import { Bot, InlineKeyboard, TelegramError, createWebhookHandler } from "../dist/src/index.js";
import { createMockUpdate } from "../dist/src/testing.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_TEST_CHAT_ID;
if (!token || !chatId) throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_TEST_CHAT_ID are required");

const bot = new Bot(token);
const results = [];
const record = (name, status, detail = "") => { results.push({ name, status, detail }); console.log(`[${status}] ${name}${detail ? ` — ${detail}` : ""}`); };
const cleanups = [];

async function run(name, operation) {
  try { const value = await operation(); record(name, "PASS", summarize(value)); return value; }
  catch (error) { record(name, "FAIL", error instanceof Error ? `${error.name}: ${error.message}` : String(error)); return undefined; }
}
function summarize(value) { if (value === undefined) return ""; if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") return String(value); if (value && typeof value === "object") { const object = value; return [object.id ? `id=${object.id}` : "", object.message_id ? `message_id=${object.message_id}` : "", object.username ? `username=${object.username}` : ""].filter(Boolean).join(", "); } return ""; }

await run("getMe through typed convenience API", () => bot.getMe());
await run("getMe through raw API", () => bot.api.raw("getMe"));
await run("getWebhookInfo read-only", () => bot.api.methods.getWebhookInfo());
await run("health check", () => bot.health());
await run("getChat read-only", () => bot.api.methods.getChat({ chat_id: chatId }));
await run("getMyCommands read-only", () => bot.api.raw("getMyCommands"));

const keyboard = new InlineKeyboard().text("telebibz E2E", "telebibz:e2e").url("Telegram API", "https://core.telegram.org/bots/api").build();
const message = await run("sendMessage with validated inline keyboard", () => bot.api.methods.sendMessage({ chat_id: chatId, text: `telebibz deep E2E ${new Date().toISOString()}`, reply_markup: keyboard }));
if (message?.message_id) cleanups.push(() => bot.api.methods.deleteMessage({ chat_id: chatId, message_id: message.message_id }));
if (message?.message_id) await run("editMessageText", () => bot.api.methods.editMessageText({ chat_id: chatId, message_id: message.message_id, text: "telebibz deep E2E edited", reply_markup: keyboard }));
const changedKeyboard = new InlineKeyboard().text("telebibz E2E changed", "telebibz:e2e:changed").build();
if (message?.message_id) await run("editMessageReplyMarkup", () => bot.api.raw("editMessageReplyMarkup", { chat_id: chatId, message_id: message.message_id, reply_markup: changedKeyboard }));

const png = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"));
const photo = await run("sendPhoto multipart upload", () => bot.api.methods.sendPhoto({ chat_id: chatId, photo: png, caption: "telebibz E2E photo" }));
if (photo?.message_id) cleanups.push(() => bot.api.methods.deleteMessage({ chat_id: chatId, message_id: photo.message_id }));
if (photo?.photo?.at?.(-1)?.file_id) await run("getFile for uploaded photo", () => bot.api.methods.getFile({ file_id: photo.photo.at(-1).file_id }));

const document = await run("sendDocument multipart upload", () => bot.api.methods.sendDocument({ chat_id: chatId, document: { source: Buffer.from("telebibz E2E document\n", "utf8"), filename: "telebibz-e2e.txt" }, caption: "telebibz E2E document" }));
if (document?.message_id) cleanups.push(() => bot.api.methods.deleteMessage({ chat_id: chatId, message_id: document.message_id }));

await run("invalid method error parsing", async () => {
  try { await bot.api.raw("getFile", { file_id: "definitely-invalid-file-id" }); throw new Error("Expected Telegram API error was not raised"); }
  catch (error) { if (!(error instanceof TelegramError)) throw error; return error; }
});
await run("local middleware and session processing", async () => {
  let middlewareRuns = 0;
  const localBot = new Bot({ token: token, transport: { async request() { return { status: 200, headers: new Headers(), data: { ok: true, result: { id: 1, is_bot: true, first_name: "local" } } }; } } });
  localBot.use(async (ctx, next) => { middlewareRuns += 1; ctx.session.runs = (ctx.session.runs ?? 0) + 1; await next(); });
  localBot.command("start", async () => undefined);
  await localBot.init();
  await localBot.handleUpdate(createMockUpdate({ update_id: 9001 }));
  await localBot.handleUpdate(createMockUpdate({ update_id: 9002 }));
  if (middlewareRuns !== 2) throw new Error(`middlewareRuns=${middlewareRuns}`);
  return { middlewareRuns };
});

const webhook = createWebhookHandler(bot, { secretToken: "telebibz-e2e-secret" });
await run("webhook secret rejection", async () => { const response = await webhook(new Request("https://example.test", { method: "POST", body: JSON.stringify(createMockUpdate()), headers: { "content-type": "application/json" } })); if (response.status !== 401) throw new Error(`status=${response.status}`); return response.status; });
await run("webhook valid update", async () => { const response = await webhook(new Request("https://example.test", { method: "POST", body: JSON.stringify(createMockUpdate({ update_id: 9003 })), headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "telebibz-e2e-secret" } })); if (response.status !== 200) throw new Error(`status=${response.status}`); return response.status; });

for (const cleanup of cleanups.reverse()) await run("cleanup test message", cleanup);
const failed = results.filter((result) => result.status === "FAIL");
console.log(JSON.stringify({ passed: results.filter((result) => result.status === "PASS").length, failed: failed.length, results }, null, 2));
if (failed.length) process.exitCode = 1;
