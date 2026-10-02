---
title: 快速开始
description: 安装 TeleBibz 并运行第一个 Telegram 机器人。
---

# 快速开始

本指南将创建一个能回复 `/start` 和问候文本的机器人。你需要 Node.js **18 或更高版本**、npm，以及从 [@BotFather](https://t.me/BotFather) 获取的机器人令牌。

## 1. 创建机器人并获取令牌

在 Telegram 中打开 **@BotFather**，发送 `/newbot` 并按提示操作。请像保护密码一样保护令牌：任何拥有令牌的人都可以控制机器人。

## 2. 创建项目并安装软件包

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

## 3. 创建 `index.js`

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('尚未设置 BOT_TOKEN。');

const bot = new TeleBibz(token);

bot.start((ctx) =>
  ctx.reply(`你好，${ctx.from?.first_name ?? '朋友'}！机器人已启动。`),
);

bot.hears(/你好|嗨/i, (ctx) => ctx.reply('你好！'));
bot.cmd('ping', (ctx) => ctx.reply('pong'));

bot.launch().catch(console.error);
```

`bot.start(...)` 处理 `/start`。`bot.hears(...)` 匹配文本，`bot.cmd(...)` 用于注册其他命令。

## 4. 运行机器人

在同一个终端会话中设置令牌：

::: code-group

```sh [macOS / Linux]
BOT_TOKEN="123456:botfather-issued-token" node index.js
```

```powershell [Windows PowerShell]
$env:BOT_TOKEN="123456:botfather-issued-token"
node index.js
```

:::

在 Telegram 中打开机器人并点击 **Start**，然后发送 `/ping` 或 `你好`。`bot.launch()` 会调用 `getMe()` 并启动长轮询。

::: warning 妥善保管令牌
不要将令牌提交到 Git，也不要暴露在浏览器代码中。如果令牌泄露，请通过 @BotFather 撤销并重新创建。
:::

## 下一步

- 阅读[处理器与过滤器](/zh/guide/handlers)，了解如何处理消息、照片、回调和中间件。
- 添加[内联键盘](/zh/guide/context-keyboards)，然后创建 [Wizard](/zh/guide/wizard)。
- 浏览[示例](/zh/examples)或查看 [Bot API 参考](/zh/reference/api)。
