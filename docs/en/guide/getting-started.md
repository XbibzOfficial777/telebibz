---
title: Getting started
description: Install TeleBibz and run your first Telegram bot.
---

# Getting started

This guide creates a bot that replies to `/start` and greeting text. You need Node.js **18 or later**, npm, and a bot token from [@BotFather](https://t.me/BotFather).

## 1. Create a bot and get a token

Open Telegram, message **@BotFather**, send `/newbot`, and follow the prompts. Treat the token as a password: anyone who has it can control your bot.

## 2. Create a project and install the package

::: code-group

```sh [npm]
npm init -y
npm install @xbibzlibrary/telebibz
```

```sh [pnpm]
pnpm init
pnpm add @xbibzlibrary/telebibz
```

```sh [yarn]
yarn init -y
yarn add @xbibzlibrary/telebibz
```

:::

## 3. Create `index.js`

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set.');

const bot = new TeleBibz(token);

bot.start((ctx) =>
  ctx.reply(`Hello ${ctx.from?.first_name ?? 'there'}! The bot is online.`),
);

bot.hears(/hello|hi/i, (ctx) => ctx.reply('Hello!'));
bot.cmd('ping', (ctx) => ctx.reply('pong'));

bot.launch().catch(console.error);
```

`bot.start(...)` handles `/start`. `bot.hears(...)` matches text, while `bot.cmd(...)` registers another command.

## 4. Run the bot

Set the token in the same terminal session:

::: code-group

```sh [macOS / Linux]
BOT_TOKEN="123456:token-from-botfather" node index.js
```

```powershell [Windows PowerShell]
$env:BOT_TOKEN="123456:token-from-botfather"
node index.js
```

:::

Open your bot in Telegram, press **Start**, then try `/ping` or send `hello`. `bot.launch()` calls `getMe()` and starts long polling.

::: warning Keep the token private
Do not commit the token or expose it in browser code. If it leaks, revoke it and create a replacement with @BotFather.
:::

## Next steps

- Learn about [handlers and filters](/en/guide/handlers) for messages, photos, callbacks, and middleware.
- Add an [inline keyboard](/en/guide/context-keyboards), then build a [wizard](/en/guide/wizard).
- Browse the [examples](/en/examples) or the [Bot API reference](/en/reference/api).
