import { Bot, InlineKeyboard, type Message, type Update, type Storage, MemoryStorage, type TelegramUser, type TelegramMessage, type TelegramUpdate } from "../src/index.js";

const session: Storage<string, { count: number }> = new MemoryStorage<string, { count: number }>();
const bot = new Bot<{ count: number }>({ token: "123456:TEST_TOKEN", session });
const fullUser: TelegramUser = {} as TelegramUser;
const fullMessage: TelegramMessage = {} as TelegramMessage;
const fullUpdate: TelegramUpdate = {} as TelegramUpdate;
void fullUser;
void fullMessage;
void fullUpdate;
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
