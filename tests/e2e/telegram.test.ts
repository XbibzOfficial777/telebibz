import { describe, expect, it } from "vitest";
import { Bot } from "../../src/index.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_TEST_CHAT_ID;

describe.skipIf(!token || !chatId)("Telegram Bot API E2E", () => {
  it("performs real getMe and message lifecycle", async () => {
    const bot = new Bot(token!);
    const me = await bot.getMe();
    expect(me.is_bot).toBe(true);
    const message = await bot.api.methods.sendMessage({ chat_id: chatId!, text: "telebibz E2E test" });
    expect(message.message_id).toBeTypeOf("number");
    await bot.api.methods.editMessageText({ chat_id: chatId!, message_id: message.message_id, text: "telebibz E2E test edited" });
    await bot.api.methods.deleteMessage({ chat_id: chatId!, message_id: message.message_id });
  }, 30_000);
});
