import { Bot } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("Set TELEGRAM_BOT_TOKEN before starting the example.");

const bot = new Bot(token);

bot.command("start", async (ctx) => { await ctx.reply("Hello from Telebibz. Send /help to see what I can do."); });
bot.command("help", async (ctx) => { await ctx.reply("Commands:\n/start — welcome message\n/help — show this help"); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
