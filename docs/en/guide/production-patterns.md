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

## Durable inbox/outbox and idempotency

Webhook deliveries can be retried, and a process can stop between receiving an update and performing its side effect. Treat work as **at-least-once**: use `(bot_id, update_id)` as a primary key to prevent duplicate database changes, then write external work to an outbox in the same transaction.

```sql
CREATE TABLE bot_inbox (
  bot_id       text        NOT NULL,
  update_id    bigint      NOT NULL,
  payload      jsonb       NOT NULL,
  received_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (bot_id, update_id)
);

CREATE TABLE bot_outbox (
  id               bigserial   PRIMARY KEY,
  bot_id           text        NOT NULL,
  event_key        text        NOT NULL,
  method           text        NOT NULL,
  payload          jsonb       NOT NULL,
  attempts         integer     NOT NULL DEFAULT 0,
  next_attempt_at  timestamptz NOT NULL DEFAULT now(),
  delivered_at     timestamptz,
  UNIQUE (bot_id, event_key)
);

CREATE INDEX bot_outbox_pending_idx
  ON bot_outbox (next_attempt_at, id)
  WHERE delivered_at IS NULL;
```

The example below uses `pg` and assumes `applyBusinessChange(client, update)` only writes to the database—do not make HTTP calls inside the transaction. Add `pg` as a direct application dependency.

```js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const botId = process.env.BOT_ID;

async function recordUpdateOnce(update, eventKey, apiPayload) {
  const client = await pool.connect();
  let transactionOpen = false;
  try {
    await client.query('BEGIN');
    transactionOpen = true;
    const inserted = await client.query(
      `INSERT INTO bot_inbox (bot_id, update_id, payload)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (bot_id, update_id) DO NOTHING
       RETURNING update_id`,
      [botId, update.update_id, JSON.stringify(update)],
    );
    if (inserted.rowCount === 0) {
      await client.query('ROLLBACK');
      transactionOpen = false;
      return false;
    }

    await applyBusinessChange(client, update); // application-specific database writes only
    await client.query(
      `INSERT INTO bot_outbox (bot_id, event_key, method, payload)
       VALUES ($1, $2, 'sendMessage', $3::jsonb)
       ON CONFLICT (bot_id, event_key) DO NOTHING`,
      [botId, eventKey, JSON.stringify(apiPayload)],
    );
    await client.query('COMMIT');
    transactionOpen = false;
    return true;
  } catch (err) {
    if (transactionOpen) await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

bot.on(':text', async (ctx) => {
  await recordUpdateOnce(ctx.update, `${ctx.update.update_id}:reply`, {
    chat_id: ctx.chatId,
    text: 'The change has been recorded.',
  });
});
```

An outbox worker can send `await bot.api.callApi(row.method, row.payload)`, then mark the row delivered. Multiple workers need a short claim/lease mechanism; do not hold a database transaction open during the HTTP request. Telegram sends are still **at-least-once**: if the API succeeds but setting `delivered_at` fails, a message may be sent again. Use `event_key` for internal deduplication and make notifications easy to reconcile.

## Multi-replica topology and update ownership

| Process type | Scaling pattern | Required state and coordination |
| --- | --- | --- |
| Long poller | One active owner per token; start with `replicas: 1`. | Failover requires a leader lease with a fencing token, or orchestrator-controlled process replacement. Do not let two pollers overlap. |
| Webhook ingress | Several stateless replicas behind an HTTPS load balancer. | Shared database/session store, idempotent inbox, and validation of the same secret header. Telegram may retry delivery. |
| Outbox/queue workers | Add consumers based on queue depth and throughput needs. | Broker/distributed claims, retry budget, shared rate limits, and per-chat ordering when required by the product. |

TeleBibz session serialization and `limiter()` are per instance. Multiple webhook replicas can receive updates with the same session key at the same time; use a distributed lock/shared session store or shard by key when read/modify/write must be ordered. `throttler()` is also local to an `ApiClient`; use a shared budget to limit several workers for the same token/chat.

## Health probes, drain, and runbook

Separate **liveness** (the process can respond) from **readiness** (the process is initialized, not draining, and its minimum dependencies are ready). Do not make liveness depend on Telegram's API; a temporary upstream outage should not restart every replica.

```js
const http = require('node:http');
let draining = false;
const healthServer = http.createServer(async (req, res) => {
  if (req.url === '/livez') return res.writeHead(200).end('ok');
  if (req.url !== '/readyz') return res.writeHead(404).end();

  let databaseReady = false;
  try { await database.ping(); databaseReady = true; } catch {}
  const ready = !draining && Boolean(bot.botInfo) && databaseReady;
  res.writeHead(ready ? 200 : 503, { 'content-type': 'text/plain' });
  res.end(ready ? 'ready' : 'not ready');
});
healthServer.listen(process.env.HEALTH_PORT || 8080, '0.0.0.0');
```

`database.ping()` represents a driver-specific probe with a timeout. On `SIGTERM`, set `draining = true`, stop accepting new ingress updates, let in-flight handlers/outbox work finish, call `bot.stop()` for a poller, and then close the pool. Keep `dropPending: false` during a normal shutdown or deployment.

Operational checklist:

- **Deploy:** roll out one poller per token at a time; for webhooks, start with a canary and verify the secret header and body-size limit.
- **Monitor:** `pending_update_count`/oldest update age, queue depth and age, handler p95, session-store latency, API errors, HTTP 429 `retry_after`, polling 409 conflicts, and outbox failures.
- **Recover:** verify database backups and test restores; after failover, ensure only one poller holds the lease/fencing token before an old worker can return.
- **Change secrets:** rotate tokens/secrets through the official mechanism, update the secret manager, then verify `getMe()` and `getWebhookInfo()` without printing secret values.

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
