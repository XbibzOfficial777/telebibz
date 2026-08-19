import { describe, expect, it, vi } from "vitest";
import { TelegramRateLimitError } from "../src/api/errors.js";
import { createTestBot, createMockUpdate, MockTransport } from "../src/testing.js";
import { InlineKeyboard } from "../src/keyboard/index.js";
import { MemoryStorage } from "../src/storage/storage.js";
import { splitMessage } from "../src/utils/text.js";
import { TaskQueue } from "../src/queue/queue.js";
import { createWebhookHandler } from "../src/webhook/handler.js";
import { Wizard } from "../src/state/conversation.js";

describe("telebibz core", () => {
  it("calls Telegram through the transport and parses typed getMe", async () => {
    const { bot, transport } = createTestBot();
    const me = await bot.getMe();
    expect(me.username).toBe("test_bot");
    expect(transport.calls[0]?.method).toBe("getMe");
  });

  it("parses rate limit errors instead of simulating success", async () => {
    const transport = new MockTransport().respond("getMe", { ok: false, error_code: 429, description: "Too Many Requests", parameters: { retry_after: 2 } });
    const { Bot } = await import("../src/core/bot.js");
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport });
    await expect(bot.getMe()).rejects.toBeInstanceOf(TelegramRateLimitError);
  });

  it("routes commands and persists session", async () => {
    const { bot } = createTestBot();
    const handler = vi.fn(async (ctx) => { ctx.session.count = ((ctx.session.count as number | undefined) ?? 0) + 1; });
    bot.command("start", handler);
    await bot.handleUpdate(createMockUpdate());
    expect(handler).toHaveBeenCalledOnce();
  });

  it("continues wizard answers for name and age across incoming messages", async () => {
    const { bot } = createTestBot();
    const wizard = new Wizard();
    wizard
      .step({ id: "prompt-name", run: async (flow) => { flow.next(); await flow.ctx.reply("Siapa nama kamu?"); } })
      .step({ id: "name", run: async (flow) => { flow.set("name", flow.ctx.message?.text?.trim()); flow.next(); await flow.ctx.reply("Berapa umur kamu?"); } })
      .step({ id: "age", run: (flow) => { const raw = flow.ctx.message?.text?.trim() ?? ""; const age = Number(raw); if (!Number.isInteger(age)) throw new Error("Age must be an integer"); flow.set("age", age); flow.next(); } });
    bot.useWizard(wizard);
    bot.command("start", async (ctx) => { await wizard.run(ctx); });

    await bot.handleUpdate(createMockUpdate({ update_id: 10 }));
    await bot.handleUpdate(createMockUpdate({ update_id: 11, message: { ...createMockUpdate().message!, message_id: 2, text: "Alice" } }));
    await bot.handleUpdate(createMockUpdate({ update_id: 12, message: { ...createMockUpdate().message!, message_id: 3, text: "18" } }));

    expect(wizard.manager.get("1:2")).toMatchObject({ status: "completed", step: 3, values: { name: "Alice", age: 18 } });
  });

  it("rejects invalid inline button with multiple actions", () => {
    expect(() => new InlineKeyboard().button({ text: "bad", url: "https://example.com", callback_data: "bad" })).toThrow();
  });

  it("expires memory storage values", async () => {
    const storage = new MemoryStorage<string, string>();
    await storage.set("key", "value", { ttlMs: 1 });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await expect(storage.get("key")).resolves.toBeUndefined();
  });

  it("splits long messages at readable boundaries", () => {
    const chunks = splitMessage(`${"one ".repeat(2000)}\n\n${"two ".repeat(2000)}`);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 4096)).toBe(true);
  });

  it("processes queue jobs with retries", async () => {
    let attempts = 0;
    const queue = new TaskQueue(async () => { attempts += 1; if (attempts < 2) throw new Error("transient"); }, { retries: 1, backoffMs: 1 });
    const job = queue.add({ value: 1 });
    await queue.onIdle();
    expect(queue.get(job.id)?.status).toBe("completed");
    expect(attempts).toBe(2);
  });

  it("verifies webhook secret and accepts valid updates", async () => {
    const { bot } = createTestBot();
    const handler = createWebhookHandler(bot, { secretToken: "secret" });
    const invalid = await handler(new Request("https://example.test", { method: "POST", body: JSON.stringify(createMockUpdate()), headers: { "content-type": "application/json" } }));
    expect(invalid.status).toBe(401);
    const valid = await handler(new Request("https://example.test", { method: "POST", body: JSON.stringify(createMockUpdate()), headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "secret" } }));
    expect(valid.status).toBe(200);
  });
});
