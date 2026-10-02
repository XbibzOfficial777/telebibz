---
title: 轮询与 Webhook
description: 使用长轮询或在 Node.js 服务中接收 Telegram Webhook。
---

# 轮询与 Webhook

TeleBibz 支持长轮询和 Node.js HTTP Webhook 处理器。每个机器人令牌只能选择一种更新接收方式，不要同时运行两者。

## 长轮询

`bot.launch()` 会初始化机器人并开始向 Telegram 请求更新：

```js
const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.cmd('start', (ctx) => ctx.reply('机器人已上线。'));

bot.launch().catch(console.error);
```

长轮询适合单个持续运行的进程。要优雅关闭，请调用 `bot.stop()` 并等待 `bot.runPromise`：

```js
async function shutdown() {
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
```

如果设置了 `silent: true` 或在启动选项中禁用了信号处理器，请自行配置关闭逻辑。同一令牌只运行一个活动轮询器。

## 在 Node.js 服务中使用 Webhook

`bot.webhook()` 会返回 Node.js 请求处理器，可接收 Telegram 的更新 POST 请求并校验配置的密钥：

```js
const http = require('node:http');
const bot = new TeleBibz(process.env.BOT_TOKEN);
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!secretToken) throw new Error('尚未设置 TELEGRAM_WEBHOOK_SECRET');

const handler = bot.webhook({ secretToken });
const server = http.createServer(handler);
server.listen(3000, '0.0.0.0');
```

通过公开的 HTTPS 地址提供服务，并将 Telegram 更新发送到对应路径。密钥应放在源代码之外；可使用反向代理或平台 TLS，并根据需要设置 `maxBodyBytes`。该处理器面向 Node.js HTTP 请求/响应对象；使用其他框架时，请适配相应接口。

## 设置、删除与检查 Webhook

可通过 `bot.api` 调用 Bot API 配置更新接收。使用 `setWebhook` 设置公开 HTTPS 地址，并将 `secret_token` 设为与 `bot.webhook({ secretToken })` 相同的值。可使用 `getWebhookInfo` 检查状态，切换回轮询前调用 `deleteWebhook`。支持选项与要求请参阅 Telegram 的 [setWebhook 文档](https://core.telegram.org/bots/api#setwebhook)。

不要记录 Webhook 密钥，也不要提供无认证的管理路由来修改 Webhook 设置。

## 无服务器平台与其他框架

若框架或无服务器适配器能提供处理器要求的请求/响应语义、保留 Telegram 密钥请求头并安全传递原始 JSON 请求体，即可使用 Webhook。请检查平台的请求体大小和执行时间限制。平台无法保持进程运行时，应使用 Webhook 而非长轮询。

若用于测试或自定义接收层，可将经过验证的更新传给 `bot.handleUpdate(update)`。详见[自定义传输与测试](/zh/guide/transports-testing)。
