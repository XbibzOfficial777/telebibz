# Getting started with Telebibz

This guide takes a new developer from installation to a working Telegram bot in a few minutes.

## 1. Create a bot token

Create a bot with Telegram's official bot management account and keep the token in your deployment environment. Never commit it to source control.

## 2. Install Telebibz

```bash
mkdir my-telebibz-bot && cd my-telebibz-bot
npm init -y
npm install @xbibzlibrary/telebibz
npm install --save-dev tsx typescript
```

Create `.env` through your secret manager or export the variable in the shell:

```bash
export TELEGRAM_BOT_TOKEN="<your-bot-token>"
```

## 3. Write the first bot

Create `index.ts`:

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required.");

const bot = new Bot(token);
bot.command("start", async (ctx) => { await ctx.reply("Telebibz is working."); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
```

Run it with:

```bash
npx tsx index.ts
```

Send `/start` or `ping` to the bot. The terminal displays the Telebibz branding and structured logs. Set the logger format to `json` when a log collector consumes the output.

## 4. Add a multi-step wizard

Use `Wizard` and `bot.useWizard()` when replies should continue through active steps. Start the flow explicitly with `wizard.run(ctx)`:

```ts
const wizard = new Wizard()
  .step({ id: "name", run: async (flow) => {
    flow.set("name", flow.ctx.message?.text?.trim()).next();
    await flow.ctx.reply("How old are you?");
  }})
  .step({ id: "age", run: async (flow) => {
    const age = Number(flow.ctx.message?.text?.trim());
    if (!Number.isInteger(age)) { await flow.ctx.reply("Send a whole number."); return; }
    flow.set("age", age).next();
    await flow.ctx.reply("Registration complete.");
  }});

bot.useWizard(wizard);
bot.command("register", async (ctx) => {
  await wizard.run(ctx);
  await ctx.reply("What is your name?");
});
```

The default conversation manager persists for the lifetime of the wizard instance, and the key is derived from chat and sender identity. `/cancel` cancels the active flow by default.

## 5. Production checklist

Use HTTPS for webhooks, verify the Telegram webhook secret, keep tokens in a secret manager, configure structured JSON logs, add health checks, use persistent storage for sessions that must survive restarts, and run `npm run typecheck`, `npm run test:types`, `npm run test:examples`, `npm test`, `npm run build`, and `npm run security` before deployment.

## Next steps

- [Runnable examples](../examples/README.md)
- [Complete API reference](API.md)
- [Webhook API](API.md#10-webhook)
- [Conversations and wizards](API.md#8-state-session-and-conversations)
- [Contribution guide](../CONTRIBUTING.md)
