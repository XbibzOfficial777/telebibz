---
title: Update lifecycle and architecture
description: Understand polling, context creation, middleware order, and update handling.
---

# Update lifecycle and architecture

TeleBibz receives Telegram updates, wraps each update in a `Context`, and runs it through the registered middleware and handlers. Handlers can use `ctx.api` to call Bot API methods.

## Overview

<WorkflowCanvas flow="telebibz" locale="en" />

Drag nodes to rearrange the map, then select a node to inspect its responsibility. This is the primary dispatch path; error handling and deployment details are covered in their dedicated guides.

The bot instance owns its API client, configuration, session middleware, handler pipeline, and polling lifecycle. Keep one polling process per bot token unless your deployment uses a coordinated update strategy.

## Long-polling lifecycle

`bot.launch()` initializes the bot, starts requesting updates, and processes each returned update. The library tracks the polling promise in `bot.runPromise`; call `bot.stop()` during shutdown, then wait for that promise to settle.

```js
await bot.launch();
```

`launch()` resolves after startup; it does not mean the bot has permanently finished polling. In a long-running service, keep the process alive and install appropriate shutdown handling.

## Concurrent processing

A TeleBibz instance processes up to 256 updates concurrently by default. The poller dispatches an update without waiting for the previous handler to finish, while applying backpressure and bounding the amount of queued work.

```js
const bot = new TeleBibz(process.env.BOT_TOKEN, {
  maxConcurrentUpdates: 256, // default: 256; use a positive integer
});
```

Updates with the same session key remain ordered so concurrent read/modify/write operations on `ctx.session` do not overwrite one another. By default, the key uses the sender and chat; a custom `session.getKey` also defines the ordering key. Different keys can run concurrently. This limit applies to polling and webhook calls to `handleUpdate()`.

Concurrency helps most when handlers await a database, HTTP request, or other I/O. CPU-bound JavaScript callbacks still share the process event loop. This option does not raise Telegram's outbound API rate limits; use API retries or throttling when needed. On `bot.stop()`, the poller stops accepting work and waits for already received updates to finish.

## Middleware order

Middleware and handlers run in registration order. A middleware can inspect or enrich `ctx`, stop processing by not calling `next()`, or call `await next()` to continue down the chain. Code after `next()` runs as control returns from downstream middleware.

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`Handled in ${Date.now() - started} ms`);
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));
```

Register shared middleware before the handlers that should pass through it. See [middleware and Composer](/en/guide/middleware).

## Context is an update snapshot

Each handler receives a `ctx` for one update. Fields such as `ctx.from`, `ctx.chat`, and `ctx.msg` depend on the update type and can be absent. Check optional fields before using them; a callback query or channel update does not have the same shape as a private text message.

The Context exposes the raw `ctx.update`, an API client at `ctx.api`, and shortcuts for common replies, files, keyboards, and callbacks. See the [Context reference](/en/reference/context).

## Polling or webhook

| Consideration | Long polling | Webhook |
| --- | --- | --- |
| Update delivery | The process requests `getUpdates`. | Telegram sends POST requests to the server. |
| Infrastructure | No public bot endpoint is required. | Requires a public HTTPS URL and reachable route. |
| Startup | `bot.launch()` | `bot.init()`, `bot.webhook()`, then `setWebhook`. |
| Suitable for | Development, workers, and a simple VPS. | Existing web servers or serverless platforms. |

Do not run polling and a webhook for the same token at the same time. See [polling and webhooks](/en/guide/deployment).

## `handleUpdate()` for tests and integrations

`bot.handleUpdate(update)` sends a supplied update through the same middleware pipeline without opening a poller. Use it to replay fixtures or connect a custom transport. It does not validate that the update came from Telegram; validate request signatures/secrets at your HTTP boundary.

## Further reading

- [Handlers and filters](/en/guide/handlers)
- [Transport and testing](/en/guide/transports-testing)
- [Production operations](/en/guide/production-patterns)
- [Troubleshooting](/en/guide/troubleshooting)
- [Bot API reference](/en/reference/api)
