---
title: Production operating patterns
description: Logging, persistent sessions, rate controls, shutdown, health checks, and deployment boundaries for TeleBibz.
---

# Production operating patterns

This page brings together [reliability](/en/guide/reliability), [polling and webhooks](/en/guide/deployment), and [transport/testing](/en/guide/transports-testing). The examples are an operational baseline, not throughput figures or an availability guarantee.

::: warning One active poller per token
Run one active long-polling process for a token unless you have an explicit update-coordination design. Built-in `limiter()` and `throttler()` are process-local; they are not distributed rate limiters.
:::

## Separate token, state, and process

- Keep `BOT_TOKEN` and `DATABASE_URL` in a runtime secret manager, not Git, the container image, or logs.
- If the application uses `ctx.session`, use persistent storage when state must survive restarts. Use one key per user/chat or a schema that matches the product.
- Do not run two long pollers with the same token. For horizontal scaling, use webhooks or an explicit update orchestration system.
- Enforce admin permissions, validate input, and set request limits before performing side effects.

## Service example: error logs, session adapter, retry, and limiter

Install the logger as a direct application dependency and implement the database adapter for your chosen driver. Add a durable broker if jobs must survive restarts:

```sh
npm install @xbibzlibrary/telebibz pino
```

```js
const pino = require('pino');
const { TeleBibz, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'token', 'BOT_TOKEN'],
});
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is required');

// Implement these methods with Redis/Postgres or another persistent store.
const store = {
  read: (key) => database.readJson(key),
  write: (key, value) => database.writeJson(key, value),
  delete: (key) => database.delete(key),
};
const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  session: { storage: store },
  onError: (err, ctx) => logger.error({ err, updateId: ctx?.update?.update_id }, 'Update failed'),
});

bot.api.config.use(throttler({ perSecond: 20 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('Please try again shortly.'),
}));

// Small serial queue for this example; local to the process and not durable.
let outboundTail = Promise.resolve();
function enqueueOutbound(work) {
  const job = outboundTail.then(work);
  outboundTail = job.catch((err) => logger.error({ err }, 'Outbound job failed'));
  return job;
}
bot.cmd('status', (ctx) => enqueueOutbound(() => ctx.reply('Bot is running.')));

async function main() {
  await bot.launch({ dropPending: false, noSignalHandlers: true });
  logger.info({ username: bot.botInfo?.username }, 'Bot started');
}

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  logger.info({ signal }, 'Stopping bot');
  bot.stop();
  await bot.runPromise;
  await outboundTail;
  await database.close();
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => { void shutdown(signal).catch((err) => { logger.error({ err }, 'Shutdown failed'); process.exitCode = 1; }); });
}
main().catch((err) => { logger.fatal({ err }, 'Startup failed'); process.exitCode = 1; });
```

Replace `database.readJson/writeJson/delete/close` with your driver. `TeleBibz` installs its session middleware automatically and passes it the constructor `session` options; the adapter supplies asynchronous `read(key)`, `write(key, value)`, and `delete(key)` methods. The serial queue shown here is process-local and loses queued work at shutdown—use a durable broker for jobs that must not be lost.

Transformer order is intentional: `throttler()` is installed first and `autoRetry()` second, so retries also pass through the queue. Automatic retry only helps errors with `retry_after`; do not repeat a business side effect without an idempotency key.

## Observability without leaking data

Record `update_id`, handler type, method name, status, duration, and retry outcome as needed. Avoid logging tokens, message text, files, the full `ctx.update`, or complete Bot API payloads. Pino `redact` is an extra layer; do not put secrets into log fields in the first place.

`onError` handles errors in the update pipeline. Wrap API calls made by schedulers/workers outside handlers in their own `try/catch`. For readiness, expose an application-owned HTTP endpoint and report relevant process state. `botInfo` is available after initialization, but it does not replace API error monitoring.

## Sessions, concurrency, and queues

- `maxConcurrentUpdates` caps active updates per instance; updates with the same session key are serialized.
- `limiter()` uses local memory. Across replicas, use a shared limiter or gateway-level controls.
- `throttler()` controls outgoing requests per `ApiClient`, not the global rate across tokens, IPs, or workers.
- For long-running work, enqueue a durable job with a unique update ID, reply promptly where appropriate, and use a unique constraint/outbox so replays do not duplicate side effects.
- Do not broadcast without consent, an authorized recipient list, a rate budget, and a stop mechanism.

::: details Minimal Dockerfile for long polling
```dockerfile
FROM node:22-bookworm-slim
WORKDIR /srv/bot
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "index.js"]
```

Use a non-root image and inject secrets at runtime. If using file-based sessions, mount a restricted persistent volume; with database-backed sessions, do not put dumps or credentials in the image layer. Configure Compose/hosting for one polling worker per token.
:::

For HTTPS webhooks, reverse proxies, secret headers, and migration from polling, see [deployment](/en/guide/deployment). For rate limits, 409/429, and common API errors, see [reliability](/en/guide/reliability).
