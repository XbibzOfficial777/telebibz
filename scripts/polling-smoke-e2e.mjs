import { Bot } from "../dist/src/index.js";
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
const bot = new Bot(token);
const info = await bot.api.methods.getWebhookInfo();
if (info.url) throw new Error("Polling smoke test refused because a webhook is already configured.");
const updates = await bot.api.methods.getUpdates({ offset: 0, limit: 10, timeout: 2, allowed_updates: [] });
const types = updates.map((update) => Object.keys(update).filter((key) => key !== "update_id").sort()[0] ?? "empty");
console.log(JSON.stringify({ status: "PASS", pendingCount: updates.length, updateTypes: types, webhookUrlConfigured: Boolean(info.url) }));
