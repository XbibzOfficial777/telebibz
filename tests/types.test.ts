import { Bot, InlineKeyboard, type Message, type Update } from "../src/index.js";

const bot = new Bot("123456:TEST_TOKEN");
bot.command("start", async (ctx) => {
  const message: Message | undefined = ctx.message;
  const update: Update = ctx.update;
  void message;
  void update;
  await ctx.reply("hello", { reply_markup: new InlineKeyboard().text("Open", "open").build() });
});

const request = bot.api.methods.getMe();
const send = bot.api.methods.sendMessage({ chat_id: 1, text: "hello" });
void request;
void send;
