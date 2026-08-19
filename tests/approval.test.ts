import { describe, expect, it } from "vitest";
import { ApiClient } from "../src/api/client.js";
import { ApprovalGate } from "../src/approval/approval.js";
import { MockTransport } from "../src/testing.js";
import { Bot } from "../src/core/bot.js";

const DEVELOPER_ID = 7377733784;

describe("approval gate", () => {
  it("notifies the owner and blocks until an authorized callback approves", async () => {
    const ownerMessage = { message_id: 77, date: 1, chat: { id: DEVELOPER_ID, type: "private" as const }, text: "approval" };
    const transport = new MockTransport()
      .respond("sendMessage", { ok: true, result: ownerMessage })
      .respond("answerCallbackQuery", { ok: true, result: true })
      .respond("editMessageText", { ok: true, result: true });
    const gate = new ApprovalGate(new ApiClient({ transport }), { ownerLabel: "Dev Ganteng" });
    const first = await gate.check({ bot: { id: 7, is_bot: true, first_name: "Telebibz", username: "demo_bot" } });
    expect(first.allowed).toBe(false);
    expect(first.status).toBe("pending");
    const sendCall = transport.calls.find((call) => call.method === "sendMessage");
    const payload = sendCall?.payload as { reply_markup?: { inline_keyboard: Array<Array<{ callback_data?: string }>> } };
    const callbackData = payload.reply_markup?.inline_keyboard[0]?.[0]?.callback_data;
    expect(callbackData).toMatch(/^telebibz:approval:approve:/);
    expect(sendCall?.payload).toMatchObject({ chat_id: DEVELOPER_ID });
    const unauthorized = await gate.handleCallback({ id: "unauthorized", from: { id: 100, is_bot: false, first_name: "No" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(unauthorized.handled).toBe(true);
    expect(await gate.isAllowed(7)).toBe(false);
    const authorized = await gate.handleCallback({ id: "authorized", from: { id: DEVELOPER_ID, is_bot: false, first_name: "Owner" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(authorized.status).toBe("approved");
    expect(await gate.isAllowed(7)).toBe(true);
  });

  it("denies approval through the deny button and remains blocked", async () => {
    const ownerMessage = { message_id: 78, date: 1, chat: { id: DEVELOPER_ID, type: "private" as const }, text: "approval" };
    const transport = new MockTransport().respond("sendMessage", { ok: true, result: ownerMessage }).respond("answerCallbackQuery", { ok: true, result: true }).respond("editMessageText", { ok: true, result: true });
    const gate = new ApprovalGate(new ApiClient({ transport }), {});
    await gate.check({ bot: { id: 8, is_bot: true, first_name: "Demo" } });
    const payload = transport.calls.find((call) => call.method === "sendMessage")?.payload as { reply_markup: { inline_keyboard: Array<Array<{ callback_data?: string }>> } };
    const callbackData = payload.reply_markup.inline_keyboard[0]?.[1]?.callback_data;
    const result = await gate.handleCallback({ id: "deny", from: { id: DEVELOPER_ID, is_bot: false, first_name: "Owner" }, chat_instance: "x", data: callbackData, message: ownerMessage });
    expect(result.status).toBe("denied");
    expect(await gate.isAllowed(8)).toBe(false);
  });

  it("uses a test-only recipient override without changing the production target", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalTestRecipient = process.env.TELEBIBZ_APPROVAL_TEST_CHAT_ID;
    try {
      process.env.NODE_ENV = "test";
      process.env.TELEBIBZ_APPROVAL_TEST_CHAT_ID = "987654321";
      const testTransport = new MockTransport().respond("sendMessage", { ok: true, result: { message_id: 1, date: 1, chat: { id: 987654321, type: "private" as const }, text: "approval" } });
      await new ApprovalGate(new ApiClient({ transport: testTransport }), {}).check({ bot: { id: 11, is_bot: true, first_name: "Test" } });
      expect(testTransport.calls.find((call) => call.method === "sendMessage")?.payload).toMatchObject({ chat_id: 987654321 });

      process.env.NODE_ENV = "production";
      const productionTransport = new MockTransport().respond("sendMessage", { ok: true, result: { message_id: 2, date: 1, chat: { id: 1, type: "private" as const }, text: "approval" } });
      await new ApprovalGate(new ApiClient({ transport: productionTransport }), {}).check({ bot: { id: 12, is_bot: true, first_name: "Production" } });
      expect(productionTransport.calls.find((call) => call.method === "sendMessage")?.payload).not.toMatchObject({ chat_id: 987654321 });
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = originalNodeEnv;
      if (originalTestRecipient === undefined) delete process.env.TELEBIBZ_APPROVAL_TEST_CHAT_ID;
      else process.env.TELEBIBZ_APPROVAL_TEST_CHAT_ID = originalTestRecipient;
    }
  });

  it("sends approval notification during Bot.init and keeps the bot awaiting approval", async () => {
    const transport = new MockTransport()
      .respond("getMe", { ok: true, result: { id: 10, is_bot: true, first_name: "Bot", username: "bot" } })
      .respond("sendMessage", { ok: true, result: { message_id: 1, date: 1, chat: { id: 42, type: "private" as const }, text: "approval" } });
    const bot = new Bot({ token: "123456:TEST_TOKEN", transport });
    await bot.init();
    expect(bot.status).toBe("awaiting-approval");
    expect(transport.calls.some((call) => call.method === "sendMessage")).toBe(true);
  });
});
