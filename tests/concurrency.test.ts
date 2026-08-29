import { describe, expect, it, vi } from "vitest";
import type { Update } from "../src/api/types.js";
import { FetchTransport } from "../src/api/transport.js";
import { Bot } from "../src/core/bot.js";
import { createMockUpdate, createTestBot, MockTransport } from "../src/testing.js";

function sleep(delayMs: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, delayMs)); }

function chatUpdate(chatId: number, updateId: number, text = "hello"): Update {
  const base = createMockUpdate();
  return {
    update_id: updateId,
    message: {
      ...base.message!,
      message_id: updateId,
      chat: { id: chatId, type: "private" },
      from: { id: chatId, is_bot: false, first_name: `User${chatId}` },
      text,
    },
  };
}

describe("concurrent update processing", () => {
  it("processes a 1000-update burst across distinct chats in parallel", async () => {
    const { bot } = createTestBot();
    let active = 0;
    let peak = 0;
    let processed = 0;
    bot.on("message", async () => {
      active += 1;
      peak = Math.max(peak, active);
      await sleep(5);
      active -= 1;
      processed += 1;
    });
    const updates = Array.from({ length: 1000 }, (_, index) => chatUpdate(index + 1, index + 1));
    const startedAt = Date.now();
    await bot.handleUpdates(updates);
    const durationMs = Date.now() - startedAt;
    expect(processed).toBe(1000);
    // Sequential processing would peak at 1 and take ~5000ms (1000 x 5ms).
    expect(peak).toBeGreaterThan(100);
    expect(durationMs).toBeLessThan(2500);
  });

  it("keeps arrival order for updates within a single chat", async () => {
    const { bot } = createTestBot();
    const seen: number[] = [];
    bot.on("message", async (ctx) => {
      await sleep(Math.floor(Math.random() * 5));
      seen.push(ctx.update.update_id);
    });
    const updates = Array.from({ length: 50 }, (_, index) => chatUpdate(7, index + 1));
    await bot.handleUpdates(updates);
    expect(seen).toEqual(updates.map((update) => update.update_id));
  });

  it("does not lose session writes when a chat sends many messages at once", async () => {
    const { bot } = createTestBot();
    bot.on("message", async (ctx) => {
      ctx.session.count = ((ctx.session.count as number | undefined) ?? 0) + 1;
      await sleep(2);
    });
    await bot.handleUpdates(Array.from({ length: 20 }, (_, index) => chatUpdate(1, index + 1)));
    const session = await bot.session.get("1:1");
    expect(session).toMatchObject({ count: 20 });
  });

  it("initializes exactly once under a concurrent burst", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport });
    await Promise.all(Array.from({ length: 50 }, (_, index) => bot.handleUpdate(chatUpdate(index + 1, index + 1))));
    expect(transport.calls.filter((call) => call.method === "getMe")).toHaveLength(1);
  });

  it("caps simultaneous update processing when updates.concurrency is set", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport, updates: { concurrency: 3 } });
    let active = 0;
    let peak = 0;
    let processed = 0;
    bot.on("message", async () => {
      active += 1;
      peak = Math.max(peak, active);
      await sleep(5);
      active -= 1;
      processed += 1;
    });
    await bot.handleUpdates(Array.from({ length: 12 }, (_, index) => chatUpdate(index + 1, index + 1)));
    expect(peak).toBeLessThanOrEqual(3);
    expect(processed).toBe(12);
  });

  it("keeps a slow chat from blocking updates for other chats", async () => {
    const { bot } = createTestBot();
    const done: number[] = [];
    bot.on("message", async (ctx) => {
      // Chat 1 is slow; everyone else must not wait for it.
      if (ctx.chat?.id === 1) await sleep(80);
      done.push(ctx.chat?.id as number);
    });
    const startedAt = Date.now();
    await bot.handleUpdates([chatUpdate(1, 1), ...Array.from({ length: 10 }, (_, index) => chatUpdate(index + 2, index + 2))]);
    expect(Date.now() - startedAt).toBeLessThan(400);
    expect(done).toHaveLength(11);
    expect(done.filter((chatId) => chatId !== 1).length).toBe(10);
  });
});

describe("broadcast", () => {
  it("delivers to 1000 chats at once, retrying every 429 automatically", async () => {
    const { bot, transport } = createTestBot();
    const attemptsByChat = new Map<number, number>();
    let rateLimited = 0;
    transport.respond("sendMessage", (payload) => {
      const chatId = payload?.chat_id as number;
      const attempt = (attemptsByChat.get(chatId) ?? 0) + 1;
      attemptsByChat.set(chatId, attempt);
      if (attempt === 1) {
        rateLimited += 1;
        return { ok: false, error_code: 429, description: "Too Many Requests", parameters: { retry_after: 0 } };
      }
      return { ok: true, result: { message_id: attempt, chat: { id: chatId, type: "private" }, date: Date.now(), text: "hello" } };
    });
    const progress: Array<{ total: number; processed: number; delivered: number; failed: number }> = [];
    const report = await bot.broadcast(
      Array.from({ length: 1000 }, (_, index) => index + 1),
      (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "hello" }),
      { onProgress: (current) => progress.push(current) },
    );
    expect(report.total).toBe(1000);
    expect(report.delivered).toBe(1000);
    expect(report.failed).toBe(0);
    expect(report.failures).toEqual([]);
    expect(rateLimited).toBe(1000);
    expect(progress.at(-1)).toMatchObject({ total: 1000, processed: 1000, delivered: 1000, failed: 0 });
  });

  it("records non-retryable failures per chat without retrying them", async () => {
    const { bot, transport } = createTestBot();
    let attempts = 0;
    transport.respond("sendMessage", (payload) => {
      attempts += 1;
      if (payload?.chat_id === 111) return { ok: false, error_code: 400, description: "Bad Request: chat not found" };
      return { ok: true, result: true };
    });
    const report = await bot.broadcast([111, 222, 333], (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "hello" }));
    expect(report.total).toBe(3);
    expect(report.delivered).toBe(2);
    expect(report.failed).toBe(1);
    expect(report.failures[0]).toMatchObject({ chatId: 111, attempts: 1, errorKind: "validation" });
    expect(report.failures[0]?.error).toContain("chat not found");
    expect(attempts).toBe(3);
  });

  it("supports a concurrency cap for outbound sends", async () => {
    const { bot } = createTestBot();
    let active = 0;
    let peak = 0;
    const report = await bot.broadcast(
      Array.from({ length: 20 }, (_, index) => index + 1),
      async () => {
        active += 1;
        peak = Math.max(peak, active);
        await sleep(3);
        active -= 1;
      },
      { concurrency: 4 },
    );
    expect(report.delivered).toBe(20);
    expect(peak).toBeLessThanOrEqual(4);
  });
});

describe("transport flood gate", () => {
  function jsonResponse(body: unknown): Response {
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  }

  it("delays follow-up requests for the window Telegram ordered", async () => {
    const bodies = [
      { ok: false, error_code: 429, description: "Too Many Requests", parameters: { retry_after: 0.25 } },
      { ok: true, result: { ok: true } },
    ];
    let call = 0;
    const fetchImpl = vi.fn(async () => jsonResponse(bodies[Math.min(call++, 1)]));
    const transport = new FetchTransport({ baseUrl: "https://example.test/bot123:TOKEN", fetch: fetchImpl as unknown as typeof globalThis.fetch, retries: 0 });
    const first = await transport.request({ method: "sendMessage", payload: { chat_id: 1, text: "hi" } });
    expect(first.data.ok).toBe(false);
    const startedAt = Date.now();
    await transport.request({ method: "getMe" });
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(200);
  });

  it("never delays when floodGate is disabled", async () => {
    const bodies = [
      { ok: false, error_code: 429, description: "Too Many Requests", parameters: { retry_after: 0.25 } },
      { ok: true, result: { ok: true } },
    ];
    let call = 0;
    const fetchImpl = vi.fn(async () => jsonResponse(bodies[Math.min(call++, 1)]));
    const transport = new FetchTransport({ baseUrl: "https://example.test/bot123:TOKEN", fetch: fetchImpl as unknown as typeof globalThis.fetch, retries: 0, floodGate: false });
    await transport.request({ method: "sendMessage", payload: { chat_id: 1, text: "hi" } });
    const startedAt = Date.now();
    await transport.request({ method: "getMe" });
    expect(Date.now() - startedAt).toBeLessThan(200);
  });
});
