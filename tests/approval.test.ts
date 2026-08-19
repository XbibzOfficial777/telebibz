import { describe, expect, it } from "vitest";
import { ApiClient } from "../src/api/client.js";
import { ApprovalGate } from "../src/approval/approval.js";
import { MockTransport } from "../src/testing.js";
import { Bot } from "../src/core/bot.js";

describe("approval gate", () => {
  it("notifies the owner and blocks until an authorized callback approves", async () => {
    const ownerMessage = { message_id: 77, date: 1, chat: { id: 99, type: "private" as const }, text: "approval" };
    const transport = new MockTransport()
      .respond("sendMessage", { ok: true, result: ownerMessage })
      .respond("answerCallbackQuery", { ok: true, result: true })
      .respond("editMessageText", { ok: true, result: true });
    const gate = new ApprovalGate(new ApiClient({ transport }), { ownerChatId: 99, ownerUserId: 42, ownerLabel: "Dev Ganteng" });
    const first = await gate.check({ bot: { id: 7, is_bot: true, first_name: "Telebibz", username: "demo_bot" } });
    expect(first.allowed).toBe(false);
    expect(first.status).toBe("pending");
    const sendCall = transport.calls.find((call) => call.method === "sendMessage");
    const payload = sendCall?.payload as { reply_markup?: { inline_keyboard: Array<Array<{ callback_data?: string }>> } };
    const callbackData = payload.reply_markup?.inline_keyboard[0]?.[0]?.callback_data;
    expect(callbackData).toMatch(/^telebibz:approval:approve:/);
    const unauthorized = await gate.handleCallback({ id: "unauthorized", from: { id: 100, is_bot: false, first_name: "No" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(unauthorized.handled).toBe(true);
    expect(await gate.isAllowed(7)).toBe(false);
    const authorized = await gate.handleCallback({ id: "authorized", from: { id: 42, is_bot: false, first_name: "Owner" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(authorized.status).toBe("approved");
    expect(await gate.isAllowed(7)).toBe(true);
  });

  it("denies approval through the deny button and supports explicit opt-out", async () => {
    const ownerMessage = { message_id: 78, date: 1, chat: { id: 99, type: "private" as const }, text: "approval" };
    const transport = new MockTransport().respond("sendMessage", { ok: true, result: ownerMessage }).respond("answerCallbackQuery", { ok: true, result: true }).respond("editMessageText", { ok: true, result: true });
    const gate = new ApprovalGate(new ApiClient({ transport }), { ownerChatId: 99, ownerUserId: 42 });
    await gate.check({ bot: { id: 8, is_bot: true, first_name: "Demo" } });
    const payload = transport.calls.find((call) => call.method === "sendMessage")?.payload as { reply_markup: { inline_keyboard: Array<Array<{ callback_data?: string }>> } };
    const callbackData = payload.reply_markup.inline_keyboard[0]?.[1]?.callback_data;
    const result = await gate.handleCallback({ id: "deny", from: { id: 42, is_bot: false, first_name: "Owner" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(result.status).toBe("denied");
    expect(await gate.isAllowed(8)).toBe(false);
  });

  it("sends approval notification during Bot.init and keeps the bot awaiting approval", async () => {
    const transport = new MockTransport()
      .respond("getMe", { ok: true, result: { id: 10, is_bot: true, first_name: "Bot", username: "bot" } })
      .respond("sendMessage", { ok: true, result: { message_id: 1, date: 1, chat: { id: 42, type: "private" as const }, text: "approval" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport, approval: { ownerChatId: 42, ownerUserId: 99 } });
    await bot.init();
    expect(bot.status).toBe("awaiting-approval");
    expect(transport.calls.some((call) => call.method === "sendMessage")).toBe(true);
  });
});
