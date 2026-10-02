---
title: Polling and webhooks
description: Run long polling or expose a Telegram webhook from a Node.js server.
---

# Polling and webhooks

TeleBibz supports long polling and a Node.js HTTP webhook handler. Choose one update-delivery method for a bot token; do not run both at once.

## Long polling

`bot.launch()` initializes the bot and starts requesting updates from Telegram:

```js
const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.cmd('start', (ctx) => ctx.reply('The bot is online.'));

bot.launch().catch(console.error);
```

Long polling is convenient for a single continuously running process. For graceful shutdown, call `bot.stop()` and wait for `bot.runPromise`:

```js
async function shutdown() {
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
```

If `silent: true` or launch options disable signal handlers, install your own. Run only one active poller for a given token.

## Webhook on a Node.js server

`bot.webhook()` returns a Node.js request handler that accepts Telegram update POSTs and checks the configured secret token:

```js
const http = require('node:http');
const bot = new TeleBibz(process.env.BOT_TOKEN);
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!secretToken) throw new Error('TELEGRAM_WEBHOOK_SECRET is not set');

const handler = bot.webhook({ secretToken });
const server = http.createServer(handler);
server.listen(3000, '0.0.0.0');
```

Expose the server through a public HTTPS URL and configure Telegram to send updates to the matching path. Keep the secret outside source control, use a reverse proxy or platform TLS, and set an appropriate body-size limit with `maxBodyBytes` where needed. The webhook handler is designed for Node.js HTTP request/response objects; adapt it when using a framework with a different request interface.

## Set, remove, and inspect a webhook

Use Bot API methods through `bot.api` to configure delivery. For example, call `setWebhook` with the public HTTPS URL and the same `secret_token` used by `bot.webhook({ secretToken })`. Use `getWebhookInfo` to inspect status and `deleteWebhook` before switching back to polling. See Telegram's [setWebhook documentation](https://core.telegram.org/bots/api#setwebhook) for supported options and requirements.

Do not log the webhook secret. Do not expose an unauthenticated administrative route for changing webhook settings.

## Serverless and other frameworks

A webhook can run behind a Node.js framework or serverless adapter when it can provide the request and response semantics the handler expects, preserve the Telegram secret header, and pass the raw JSON body safely. Verify platform body-size and execution-time limits. If the platform cannot keep a process alive, use webhook delivery rather than long polling.

For tests or a custom ingestion layer, pass a validated update to `bot.handleUpdate(update)`. See [custom transports and testing](/en/guide/transports-testing).
