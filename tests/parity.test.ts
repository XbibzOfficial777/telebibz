import { describe, expect, it, vi } from "vitest";
import { Bot } from "../src/core/bot.js";
import { Router } from "../src/router/router.js";
import { createMockCallbackUpdate, createMockContext, createMockUpdate, createTestBot, MockTransport } from "../src/testing.js";
import { createWebhookHandler } from "../src/webhook/handler.js";
import type { Context } from "../src/context/context.js";

function messageUpdate(text: string, extra: Record<string, unknown> = {}) {
  return createMockUpdate({
    update_id: Math.floor(Math.random() * 100_000),
    message: { ...createMockUpdate().message!, message_id: 7, text, ...extra },
  });
}

describe("bot.on update-type filters", () => {
  it("matches bare update types", async () => {
    const { bot } = createTestBot();
    const handler = vi.fn();
    bot.on("callback_query", handler);
    await bot.handleUpdate(createMockCallbackUpdate());
    expect(handler).toHaveBeenCalledOnce();
  });

  it("narrows message filters by payload field", async () => {
    const { bot } = createTestBot();
    const handler = vi.fn();
    bot.on("message:photo", handler);
    await bot.handleUpdate(messageUpdate("caption", { text: undefined, photo: [{ file_id: "f", file_unique_id: "u", width: 1, height: 1 }] }));
    expect(handler).toHaveBeenCalledOnce();

    const { bot: textBot } = createTestBot();
    const textHandler = vi.fn();
    textBot.on("message:photo", textHandler);
    await textBot.handleUpdate(messageUpdate("just text"));
    expect(textHandler).not.toHaveBeenCalled();
  });

  it("accepts an array of filters", async () => {
    const { bot } = createTestBot();
    const handler = vi.fn();
    bot.on(["message:text", "callback_query:data"], handler);
    await bot.handleUpdate(messageUpdate("hello"));
    await bot.handleUpdate(createMockCallbackUpdate({ update_id: 55 }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("rejects unknown update types at registration time", () => {
    const router = new Router();
    expect(() => router.on("messages" as never, async () => {})).toThrow(TypeError);
    expect(() => router.on("message:photo" as never, async () => {})).not.toThrow();
  });
});

describe("bot.hears triggers", () => {
  it("matches exact text and regex", async () => {
    const { bot } = createTestBot();
    const exact = vi.fn();
    const pattern = vi.fn();
    bot.hears("ping", exact);
    bot.hears(/^order-(\d+)$/, pattern);
    await bot.handleUpdate(messageUpdate("ping"));
    await bot.handleUpdate(messageUpdate("order-42"));
    await bot.handleUpdate(messageUpdate("nope"));
    expect(exact).toHaveBeenCalledOnce();
    expect(pattern).toHaveBeenCalledOnce();
  });
});

describe("bot.catch error boundary", () => {
  it("routes handler failures to the boundary and resolves handleUpdate", async () => {
    const { bot } = createTestBot();
    const caught: Array<{ error: unknown; chatId: unknown }> = [];
    const reply = vi.fn();
    bot.onText("boom", async () => { throw new Error("handler exploded"); });
    bot.catch(async (error, ctx) => { caught.push({ error, chatId: ctx.chat?.id }); await reply(); });
    const events: string[] = [];
    bot.events.on("update:error", () => { events.push("update:error"); });

    await expect(bot.handleUpdate(messageUpdate("boom"))).resolves.toBeUndefined();
    expect(caught).toHaveLength(1);
    expect((caught[0]?.error as Error).message).toBe("handler exploded");
    expect(caught[0]?.chatId).toBe(1);
    expect(reply).toHaveBeenCalledOnce();
    expect(events).toEqual(["update:error"]);
  });

  it("still rejects when no boundary is registered", async () => {
    const { bot } = createTestBot();
    bot.onText("boom", async () => { throw new Error("handler exploded"); });
    await expect(bot.handleUpdate(messageUpdate("boom"))).rejects.toThrow("handler exploded");
  });

  it("webhook answers 200 when the boundary handles the failure", async () => {
    const { bot } = createTestBot();
    bot.onText("boom", async () => { throw new Error("handler exploded"); });
    bot.catch(() => undefined);
    const handler = createWebhookHandler(bot);
    const response = await handler(new Request("https://example.test", { method: "POST", body: JSON.stringify(messageUpdate("boom")), headers: { "content-type": "application/json" } }));
    expect(response.status).toBe(200);
  });
});

describe("extended context senders", () => {
  const cases: Array<{ name: keyof Context; invoke: (ctx: Context) => Promise<unknown>; method: string; payload: Record<string, unknown> }> = [
    { name: "replyWithSticker", invoke: (ctx) => ctx.replyWithSticker("CAACAgIA"), method: "sendSticker", payload: { sticker: "CAACAgIA" } },
    { name: "replyWithVideoNote", invoke: (ctx) => ctx.replyWithVideoNote(new Blob(["x"])), method: "sendVideoNote", payload: {} },
    { name: "replyWithAnimation", invoke: (ctx) => ctx.replyWithAnimation("https://example.com/a.gif"), method: "sendAnimation", payload: { animation: "https://example.com/a.gif" } },
    { name: "replyWithLocation", invoke: (ctx) => ctx.replyWithLocation(-6.2, 106.8), method: "sendLocation", payload: { latitude: -6.2, longitude: 106.8 } },
    { name: "replyWithVenue", invoke: (ctx) => ctx.replyWithVenue(-6.2, 106.8, "Monas", "Jakarta"), method: "sendVenue", payload: { title: "Monas", address: "Jakarta" } },
    { name: "replyWithContact", invoke: (ctx) => ctx.replyWithContact("+628123456789", "Budi"), method: "sendContact", payload: { phone_number: "+628123456789", first_name: "Budi" } },
    { name: "replyWithPoll", invoke: (ctx) => ctx.replyWithPoll("Pilih", ["A", "B"]), method: "sendPoll", payload: { question: "Pilih", options: ["A", "B"] } },
    { name: "replyWithDice", invoke: (ctx) => ctx.replyWithDice("🎲"), method: "sendDice", payload: { emoji: "🎲" } },
    { name: "replyWithMediaGroup", invoke: (ctx) => ctx.replyWithMediaGroup([{ type: "photo", media: "a" }]), method: "sendMediaGroup", payload: { media: [{ type: "photo", media: "a" }] } },
  ];

  it.each(cases)("$name sends the right Telegram method with automatic quote-reply", async ({ invoke, method, payload }) => {
    const { bot, transport } = createTestBot();
    const ctx = createMockContext(bot, messageUpdate("halo"));
    await invoke(ctx);
    const call = transport.calls.at(-1);
    expect(call?.method).toBe(method);
    expect(call?.payload).toMatchObject({ chat_id: 1, ...payload, reply_parameters: { message_id: 7 } });
  });

  it("merges explicit reply_parameters with the automatic quote instead of dropping it", async () => {
    const { bot, transport } = createTestBot();
    const ctx = createMockContext(bot, messageUpdate("halo"));
    await ctx.reply("quoted", { reply_parameters: { allow_spoiler: true } });
    expect(transport.calls[0]?.payload).toMatchObject({
      text: "quoted",
      reply_parameters: { message_id: 7, allow_spoiler: true },
    });
  });

  it("keeps an explicit message_id when replying to another message", async () => {
    const { bot, transport } = createTestBot();
    const ctx = createMockContext(bot, messageUpdate("halo"));
    await ctx.reply("other", { reply_parameters: { message_id: 999 } });
    expect(transport.calls[0]?.payload).toMatchObject({ reply_parameters: { message_id: 999 } });
  });
});

describe("restart-safe plugin lifecycle", () => {
  it("installs plugins once even when init runs again", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const installs: string[] = [];
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport });
    bot.usePlugin({
      name: "once",
      install: () => { installs.push("install"); },
    });
    await bot.init();
    await bot.stop();
    await bot.init();
    expect(installs).toEqual(["install"]);
  });
});
