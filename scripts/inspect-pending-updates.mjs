import { Bot } from "../dist/src/index.js";
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
const bot = new Bot(token);
const updates = await bot.api.methods.getUpdates({ offset: 0, limit: 100, timeout: 0, allowed_updates: [] });
console.log(JSON.stringify({ count: updates.length, types: updates.map((update) => Object.keys(update).filter((key) => key !== "update_id").sort()[0] ?? "empty") }));
