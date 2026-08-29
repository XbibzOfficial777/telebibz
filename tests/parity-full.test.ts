import { describe, expect, it, vi } from "vitest";
import type { Update } from "../src/api/types.js";
import { Bot, UpdateTimeoutError } from "../src/core/bot.js";
import { Context } from "../src/context/context.js";
import { createMockContext, createMockUpdate, createTestBot, MockTransport } from "../src/testing.js";
import { createWebhookHandler } from "../src/webhook/handler.js";

function sleep(delayMs: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, delayMs)); }

/** Runs `call` on a fresh mock context and returns the recorded transport request. */
async function callOnContext(call: (ctx: Context) => Promise<unknown>): Promise<{ method?: string; payload?: Record<string, unknown> }> {
  const { bot, transport } = createTestBot();
  const ctx = createMockContext(bot, createMockUpdate());
  await call(ctx);
  const request = transport.calls.at(-1);
  return { method: request?.method, payload: request?.payload };
}

describe("telegraf-parity context shortcuts", () => {
  const cases: Array<{ name: string; call: (ctx: Context) => Promise<unknown>; method: string; payload?: Record<string, unknown> }> = [
    { name: "banChatMember", call: (ctx) => ctx.banChatMember(42), method: "banChatMember", payload: { chat_id: 1, user_id: 42 } },
    { name: "banChatMember with until_date", call: (ctx) => ctx.banChatMember(42, 999), method: "banChatMember", payload: { chat_id: 1, user_id: 42, until_date: 999 } },
    { name: "unbanChatMember", call: (ctx) => ctx.unbanChatMember(42), method: "unbanChatMember", payload: { chat_id: 1, user_id: 42 } },
    { name: "restrictChatMember", call: (ctx) => ctx.restrictChatMember(42, { can_send_messages: true }), method: "restrictChatMember", payload: { chat_id: 1, user_id: 42, permissions: { can_send_messages: true } } },
    { name: "promoteChatMember", call: (ctx) => ctx.promoteChatMember(42, { can_pin_messages: true }), method: "promoteChatMember", payload: { chat_id: 1, user_id: 42, can_pin_messages: true } },
    { name: "banChatSenderChat", call: (ctx) => ctx.banChatSenderChat(-100), method: "banChatSenderChat", payload: { chat_id: 1, sender_chat_id: -100 } },
    { name: "unbanChatSenderChat", call: (ctx) => ctx.unbanChatSenderChat(-100), method: "unbanChatSenderChat", payload: { chat_id: 1, sender_chat_id: -100 } },
    { name: "setChatTitle", call: (ctx) => ctx.setChatTitle("New Title"), method: "setChatTitle", payload: { chat_id: 1, title: "New Title" } },
    { name: "setChatDescription", call: (ctx) => ctx.setChatDescription("Desc"), method: "setChatDescription", payload: { chat_id: 1, description: "Desc" } },
    { name: "setChatPhoto", call: (ctx) => ctx.setChatPhoto("photo.png"), method: "setChatPhoto", payload: { chat_id: 1, photo: "photo.png" } },
    { name: "deleteChatPhoto", call: (ctx) => ctx.deleteChatPhoto(), method: "deleteChatPhoto", payload: { chat_id: 1 } },
    { name: "setChatPermissions", call: (ctx) => ctx.setChatPermissions({ can_send_messages: false }), method: "setChatPermissions", payload: { chat_id: 1, permissions: { can_send_messages: false } } },
    { name: "leaveChat", call: (ctx) => ctx.leaveChat(), method: "leaveChat", payload: { chat_id: 1 } },
    { name: "unpinAllChatMessages", call: (ctx) => ctx.unpinAllChatMessages(), method: "unpinAllChatMessages", payload: { chat_id: 1 } },
    { name: "setChatStickerSet", call: (ctx) => ctx.setChatStickerSet("pack"), method: "setChatStickerSet", payload: { chat_id: 1, sticker_set_name: "pack" } },
    { name: "deleteChatStickerSet", call: (ctx) => ctx.deleteChatStickerSet(), method: "deleteChatStickerSet", payload: { chat_id: 1 } },
    { name: "getChatAdministrators", call: (ctx) => ctx.getChatAdministrators(), method: "getChatAdministrators", payload: { chat_id: 1 } },
    { name: "getChatMemberCount", call: (ctx) => ctx.getChatMemberCount(), method: "getChatMemberCount", payload: { chat_id: 1 } },
    { name: "getChatMember", call: (ctx) => ctx.getChatMember(42), method: "getChatMember", payload: { chat_id: 1, user_id: 42 } },
    { name: "exportChatInviteLink", call: (ctx) => ctx.exportChatInviteLink(), method: "exportChatInviteLink", payload: { chat_id: 1 } },
    { name: "createChatInviteLink", call: (ctx) => ctx.createChatInviteLink({ name: "invite" }), method: "createChatInviteLink", payload: { chat_id: 1, name: "invite" } },
    { name: "editChatInviteLink", call: (ctx) => ctx.editChatInviteLink("https://t.me/x", { name: "y" }), method: "editChatInviteLink", payload: { chat_id: 1, invite_link: "https://t.me/x", name: "y" } },
    { name: "revokeChatInviteLink", call: (ctx) => ctx.revokeChatInviteLink("https://t.me/x"), method: "revokeChatInviteLink", payload: { chat_id: 1, invite_link: "https://t.me/x" } },
    { name: "approveChatJoinRequest", call: (ctx) => ctx.approveChatJoinRequest(42), method: "approveChatJoinRequest", payload: { chat_id: 1, user_id: 42 } },
    { name: "declineChatJoinRequest", call: (ctx) => ctx.declineChatJoinRequest(42), method: "declineChatJoinRequest", payload: { chat_id: 1, user_id: 42 } },
    { name: "replyWithQuiz", call: (ctx) => ctx.replyWithQuiz("Q?", ["a", "b"], { correct_option_id: 0 }), method: "sendPoll", payload: { chat_id: 1, question: "Q?", options: ["a", "b"], type: "quiz", correct_option_id: 0 } },
    { name: "stopPoll", call: (ctx) => ctx.stopPoll(5), method: "stopPoll", payload: { chat_id: 1, message_id: 5 } },
    { name: "editMessageLiveLocation", call: (ctx) => ctx.editMessageLiveLocation(1.5, 2.5), method: "editMessageLiveLocation", payload: { chat_id: 1, message_id: 1, latitude: 1.5, longitude: 2.5 } },
    { name: "stopMessageLiveLocation", call: (ctx) => ctx.stopMessageLiveLocation(), method: "stopMessageLiveLocation", payload: { chat_id: 1, message_id: 1 } },
    { name: "replyWithGame", call: (ctx) => ctx.replyWithGame("my_game"), method: "sendGame", payload: { chat_id: 1, game_short_name: "my_game" } },
    { name: "setGameScore", call: (ctx) => ctx.setGameScore(2, 100), method: "setGameScore", payload: { chat_id: 1, message_id: 1, user_id: 2, score: 100 } },
    { name: "getGameHighScores", call: (ctx) => ctx.getGameHighScores(2), method: "getGameHighScores", payload: { chat_id: 1, message_id: 1, user_id: 2 } },
    { name: "replyWithInvoice", call: (ctx) => ctx.replyWithInvoice("T", "D", "payload", "tok", "USD", [{ label: "a", amount: 100 }]), method: "sendInvoice", payload: { chat_id: 1, title: "T", description: "D", payload: "payload", provider_token: "tok", currency: "USD", prices: [{ label: "a", amount: 100 }] } },
    { name: "createForumTopic", call: (ctx) => ctx.createForumTopic("Topic"), method: "createForumTopic", payload: { chat_id: 1, name: "Topic" } },
    { name: "editForumTopic", call: (ctx) => ctx.editForumTopic({ name: "Renamed" }), method: "editForumTopic", payload: { chat_id: 1, name: "Renamed" } },
    { name: "closeForumTopic", call: (ctx) => ctx.closeForumTopic(7), method: "closeForumTopic", payload: { chat_id: 1, message_thread_id: 7 } },
    { name: "reopenForumTopic", call: (ctx) => ctx.reopenForumTopic(7), method: "reopenForumTopic", payload: { chat_id: 1, message_thread_id: 7 } },
    { name: "deleteForumTopic", call: (ctx) => ctx.deleteForumTopic(7), method: "deleteForumTopic", payload: { chat_id: 1, message_thread_id: 7 } },
    { name: "unpinAllForumTopicMessages", call: (ctx) => ctx.unpinAllForumTopicMessages(7), method: "unpinAllForumTopicMessages", payload: { chat_id: 1, message_thread_id: 7 } },
    { name: "getForumTopicIconStickers", call: (ctx) => ctx.getForumTopicIconStickers(), method: "getForumTopicIconStickers" },
    { name: "editGeneralForumTopic", call: (ctx) => ctx.editGeneralForumTopic("General"), method: "editGeneralForumTopic", payload: { chat_id: 1, name: "General" } },
    { name: "closeGeneralForumTopic", call: (ctx) => ctx.closeGeneralForumTopic(), method: "closeGeneralForumTopic", payload: { chat_id: 1 } },
    { name: "reopenGeneralForumTopic", call: (ctx) => ctx.reopenGeneralForumTopic(), method: "reopenGeneralForumTopic", payload: { chat_id: 1 } },
    { name: "hideGeneralForumTopic", call: (ctx) => ctx.hideGeneralForumTopic(), method: "hideGeneralForumTopic", payload: { chat_id: 1 } },
    { name: "unhideGeneralForumTopic", call: (ctx) => ctx.unhideGeneralForumTopic(), method: "unhideGeneralForumTopic", payload: { chat_id: 1 } },
  ];

  it.each(cases)("$name calls $method with the right payload", async ({ call, method, payload }) => {
    const result = await callOnContext(call);
    expect(result.method).toBe(method);
    if (payload !== undefined) expect(result.payload).toMatchObject(payload);
  });

  it("throws a clear error when the update has no chat", async () => {
    const { bot } = createTestBot();
    const update: Update = { update_id: 1, inline_query: { id: "q", from: { id: 2, is_bot: false, first_name: "T" }, query: "hi", offset: "" } };
    const ctx = createMockContext(bot, update);
    await expect(ctx.banChatMember(42)).rejects.toThrow("no chat");
  });
});

describe("webhook replies", () => {
  function webhookRequest(update: Update): Request {
    return new Request("https://bot.example/webhook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(update),
    });
  }

  it("answers the first API call through the HTTP response when enabled", async () => {
    const { bot, transport } = createTestBot();
    bot.on("message", async (ctx) => { await ctx.reply("hello"); });
    const handler = createWebhookHandler(bot, { webhookReply: true });
    const response = await handler(webhookRequest(createMockUpdate()));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
    const body = JSON.parse(await response.text()) as Record<string, unknown>;
    expect(body.method).toBe("sendMessage");
    expect(body).toMatchObject({ chat_id: 1, text: "hello" });
    expect(transport.calls.filter((call) => call.method === "sendMessage")).toHaveLength(0);
  });

  it("sends every later call through the transport as usual", async () => {
    const { bot, transport } = createTestBot();
    bot.on("message", async (ctx) => { await ctx.reply("first"); await ctx.reply("second"); });
    const handler = createWebhookHandler(bot, { webhookReply: true });
    const response = await handler(webhookRequest(createMockUpdate()));
    const body = JSON.parse(await response.text()) as Record<string, unknown>;
    expect(body).toMatchObject({ method: "sendMessage", text: "first" });
    const sends = transport.calls.filter((call) => call.method === "sendMessage");
    expect(sends).toHaveLength(1);
    expect(sends[0]?.payload).toMatchObject({ text: "second" });
  });

  it("keeps the plain OK behaviour by default", async () => {
    const { bot, transport } = createTestBot();
    bot.on("message", async (ctx) => { await ctx.reply("hi"); });
    const handler = createWebhookHandler(bot);
    const response = await handler(webhookRequest(createMockUpdate()));
    expect(await response.text()).toBe("OK");
    expect(transport.calls.filter((call) => call.method === "sendMessage")).toHaveLength(1);
  });

  it("works through bot.handleUpdate options directly", async () => {
    const { bot, transport } = createTestBot();
    bot.on("message", async (ctx) => { await ctx.reply("hi"); });
    const captured: Array<Record<string, unknown>> = [];
    await bot.handleUpdate(createMockUpdate(), { webhookReply: (payload) => { captured.push(payload); } });
    expect(captured[0]).toMatchObject({ method: "sendMessage", chat_id: 1 });
    expect(transport.calls.filter((call) => call.method === "sendMessage")).toHaveLength(0);
  });
});

describe("handlerTimeout", () => {
  it("rejects with UpdateTimeoutError while the handler keeps running", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport, handlerTimeout: 20 });
    let finished = false;
    bot.on("message", async () => { await sleep(80); finished = true; });
    await expect(bot.handleUpdate(createMockUpdate())).rejects.toBeInstanceOf(UpdateTimeoutError);
    expect(finished).toBe(false);
    await sleep(120);
    expect(finished).toBe(true);
  });

  it("routes timeouts through the catch() error boundary", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport, handlerTimeout: 20 });
    const boundary = vi.fn();
    bot.catch(boundary);
    bot.on("message", async () => { await sleep(60); });
    await expect(bot.handleUpdate(createMockUpdate())).resolves.toBeUndefined();
    expect(boundary).toHaveBeenCalledTimes(1);
    expect(boundary.mock.calls[0]?.[0]).toBeInstanceOf(UpdateTimeoutError);
  });
});

describe("custom contextType", () => {
  it("instantiates the configured Context subclass for every update", async () => {
    class TrackedContext extends Context {
      tag(): string { return "custom"; }
    }
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport, contextType: TrackedContext });
    let seen: Context | undefined;
    bot.on("message", (ctx) => { seen = ctx; });
    await bot.handleUpdate(createMockUpdate());
    expect(seen).toBeInstanceOf(TrackedContext);
    expect((seen as TrackedContext | undefined)?.tag()).toBe("custom");
  });
});

describe("dropPendingUpdates", () => {
  it("drops pending updates via deleteWebhook before polling starts", async () => {
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    transport.respond("getUpdates", { ok: false, error_code: 401, description: "Unauthorized" });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport });
    const launching = bot.launch({ mode: "polling", dropPendingUpdates: true });
    await sleep(30);
    await bot.stop();
    await launching;
    const drop = transport.calls.find((call) => call.method === "deleteWebhook");
    expect(drop?.payload).toMatchObject({ drop_pending_updates: true });
  });
});
