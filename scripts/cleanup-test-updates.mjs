import { Bot } from "../dist/src/index.js";
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
const bot = new Bot(token);
const updates = await bot.api.methods.getUpdates({ offset: 0, limit: 100, timeout: 0, allowed_updates: [] });
const testUpdates = updates.filter((update) => update.callback_query?.data?.startsWith("telebibz:"));
const otherUpdates = updates.filter((update) => !update.callback_query?.data?.startsWith("telebibz:"));
if (otherUpdates.length > 0) {
  console.log(JSON.stringify({ status: "SAFE_STOP", testUpdates: testUpdates.length, otherUpdates: otherUpdates.length }));
  process.exitCode = 2;
} else if (testUpdates.length > 0) {
  const offset = Math.max(...testUpdates.map((update) => update.update_id)) + 1;
  await bot.api.methods.getUpdates({ offset, limit: 1, timeout: 0, allowed_updates: [] });
  console.log(JSON.stringify({ status: "CLEANED", count: testUpdates.length }));
} else {
  console.log(JSON.stringify({ status: "CLEAN", count: 0 }));
}
