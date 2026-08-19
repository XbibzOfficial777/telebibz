import { Bot, InlineKeyboard } from "../dist/src/index.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_TEST_CHAT_ID;
if (!token || !chatId) throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_TEST_CHAT_ID are required");
const bot = new Bot(token);
const marker = `telebibz:callback:${Date.now()}`;
const message = await bot.api.methods.sendMessage({ chat_id: chatId, text: "telebibz callback E2E: klik tombol ini dalam 30 detik", reply_markup: new InlineKeyboard().text("Klik untuk menguji callback", marker).build() });
console.log(`Callback test message sent (message_id=${message.message_id}).`);
let offset = 0;
let callback = undefined;
const deadline = Date.now() + 30_000;
try {
  while (Date.now() < deadline && !callback) {
    const updates = await bot.api.methods.getUpdates({ offset, limit: 100, timeout: 5, allowed_updates: ["callback_query"] });
    for (const update of updates) {
      offset = Math.max(offset, update.update_id + 1);
      if (update.callback_query?.data === marker) { callback = update.callback_query; break; }
    }
  }
  if (!callback) { console.log("CALLBACK_BLOCKED: button was not clicked before timeout."); process.exitCode = 2; } else {
    await bot.api.methods.answerCallbackQuery({ callback_query_id: callback.id, text: "telebibz callback E2E PASS" });
    console.log(`CALLBACK_PASS: received and answered callback query for message ${callback.message?.message_id ?? "inline"}.`);
  }
} finally {
  try { await bot.api.methods.deleteMessage({ chat_id: chatId, message_id: message.message_id }); console.log("Cleanup PASS: callback test message deleted."); } catch (error) { console.log(`Cleanup WARN: ${error instanceof Error ? error.message : String(error)}`); }
}
