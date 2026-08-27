import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("Set TELEGRAM_BOT_TOKEN before starting the example.");

const bot = new Bot(token);
const wizard = new Wizard();

wizard
  .step({
    id: "name",
    run: async (flow) => {
      const name = flow.ctx.message?.text?.trim();
      if (!name) {
        await flow.ctx.reply("Please send your name as text.");
        return;
      }
      flow.set("name", name).next();
      await flow.ctx.reply("How old are you?");
    },
  })
  .step({
    id: "age",
    run: async (flow) => {
      const age = Number(flow.ctx.message?.text?.trim());
      if (!Number.isInteger(age) || age < 1 || age > 120) {
        await flow.ctx.reply("Please send a valid age between 1 and 120.");
        return;
      }
      const name = flow.get<string>("name") ?? "there";
      flow.set("age", age).next();
      await flow.ctx.reply(`Thanks, ${name}. Your registration is complete.`);
    },
  });

bot.useWizard(wizard);
bot.command("register", async (ctx) => {
  await wizard.run(ctx);
  await ctx.reply("What is your name?");
});

await bot.start();
