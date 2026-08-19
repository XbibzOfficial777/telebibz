import { Bot } from "../dist/src/index.js";
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_TEST_CHAT_ID;
if (!token || !chatId) throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_TEST_CHAT_ID are required");
const bot = new Bot(token);
const results = [];
const run = async (name, task) => { try { const value = await task(); results.push({ name, status: "PASS" }); console.log(`[PASS] ${name}`); return value; } catch (error) { results.push({ name, status: "FAIL", error: error instanceof Error ? error.message : String(error) }); console.log(`[FAIL] ${name} — ${error instanceof Error ? error.message : String(error)}`); return undefined; } };
const cleanup = [];
const source = await run("send source message", () => bot.api.methods.sendMessage({ chat_id: chatId, text: "telebibz message management E2E" }));
if (source?.message_id) cleanup.push(source.message_id);
if (source?.message_id) {
  const copied = await run("copyMessage", () => bot.api.raw("copyMessage", { chat_id: chatId, from_chat_id: chatId, message_id: source.message_id }));
  if (copied?.message_id) cleanup.push(copied.message_id);
  const forwarded = await run("forwardMessage", () => bot.api.raw("forwardMessage", { chat_id: chatId, from_chat_id: chatId, message_id: source.message_id }));
  if (forwarded?.message_id) cleanup.push(forwarded.message_id);
  await run("sendChatAction", () => bot.api.raw("sendChatAction", { chat_id: chatId, action: "typing" }));
}
const me = await bot.getMe();
await run("getChatMember for bot", () => bot.api.raw("getChatMember", { chat_id: chatId, user_id: me.id }));
for (const messageId of cleanup.reverse()) await run(`deleteMessage ${messageId}`, () => bot.api.methods.deleteMessage({ chat_id: chatId, message_id: messageId }));
const failed = results.filter((entry) => entry.status === "FAIL");
console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results }, null, 2));
if (failed.length) process.exitCode = 1;
