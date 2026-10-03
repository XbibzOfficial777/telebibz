---
title: 生产环境运维模式
description: TeleBibz 的日志、持久化会话、限流、关闭流程、健康检查与部署边界。
---

# 生产环境运维模式

本页汇总[可靠性](/zh/guide/reliability)、[轮询与 Webhook](/zh/guide/deployment)以及[传输与测试](/zh/guide/transports-testing)。这些示例是运维基线，不代表吞吐量或可用性保证。

::: warning 每个 token 仅运行一个活动 poller
除非具备明确的 update 协调方案，否则一个 token 只运行一个活动 long-polling 进程。内置 `limiter()` 与 `throttler()` 仅对单个进程生效，不是分布式限流器。
:::

## 分离 token、state 与进程

- 将 `BOT_TOKEN` 和 `DATABASE_URL` 保存在运行时 secret manager 中，不要提交到 Git、打入容器镜像或写入日志。
- 如果应用使用 `ctx.session` 且 state 必须在重启后保留，请使用持久化 storage。每个用户/chat 使用独立 key，或采用符合业务模型的 schema。
- 不要用同一 token 启动两个 long poller。水平扩展时使用 Webhook 或明确设计的 update 协调系统。
- 执行副作用前验证管理员权限、输入内容并设置请求限制。

## Service 示例：错误日志、session adapter、retry 与 limiter

将 logger 作为应用的直接依赖安装，并根据所选 driver 实现数据库 adapter。需要任务跨重启保留时，再加入 durable broker：

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

// 使用 Redis/Postgres 或其他持久化存储实现这些方法。
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
  onExceeded: (ctx) => ctx.reply('请稍后再试。'),
}));

// 本示例的小型串行队列，仅在当前进程内有效且不持久化。
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

请将 `database.readJson/writeJson/delete/close` 替换为所用 driver 的实现。`TeleBibz` 会自动安装 session middleware，并把构造函数的 `session` 配置传给它；adapter 提供可异步执行的 `read(key)`、`write(key, value)` 和 `delete(key)`。这里的串行队列只在单进程内有效，进程关闭时会丢失任务；不可丢失的任务请使用 durable broker。

Transformer 顺序是有意设置的：先添加 `throttler()`，再添加 `autoRetry()`，使每次 retry 也经过队列。自动 retry 仅适用于包含 `retry_after` 的错误；没有幂等键时，不要重复执行业务 side effect。

## 保护数据的可观测性

按需记录 `update_id`、handler 类型、method 名称、状态、耗时及 retry 结果。避免记录 token、消息正文、文件、完整 `ctx.update` 或完整 Bot API payload。Pino `redact` 是额外防护；首先不要把秘密写进日志字段。

`onError` 处理 update pipeline 中的错误。scheduler/worker 在 handler 之外调用 API 时，应单独使用 `try/catch`。就绪检查请由应用提供 HTTP endpoint 并返回相关进程状态。初始化后可读取 `botInfo`，但它不能代替 API 错误监控。

## Session、并发与队列

- `maxConcurrentUpdates` 限制单个实例的活动 update 数量；相同 session key 的 update 会串行执行。
- `limiter()` 使用本地内存。多个 replica 应使用共享 limiter 或 gateway 层限制。
- `throttler()` 控制单个 `ApiClient` 的外发请求，不是所有 token、IP 或 worker 的全局速率。
- 长任务应放入带唯一 update ID 的 durable queue；合适时尽快回复，并通过唯一约束/outbox 防止 replay 重复 side effect。
- 没有用户同意、授权接收者名单、速率预算和停止机制时，不要发送 broadcast。

## 持久化 inbox/outbox 与幂等处理

Webhook delivery 可能重试，进程也可能在收到更新与执行副作用之间停止。请按 **at-least-once** 设计：使用 `(bot_id, update_id)` 作为主键，避免重复修改数据库；并在同一事务中把外部操作写入 outbox。

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
  lease_until      timestamptz,
  lease_token      uuid,
  delivered_at     timestamptz,
  dead_at          timestamptz,
  last_error       text,
  UNIQUE (bot_id, event_key)
);

CREATE INDEX bot_outbox_pending_idx
  ON bot_outbox (next_attempt_at, id)
  WHERE delivered_at IS NULL AND dead_at IS NULL;
```

以下示例使用 `pg`，并假设 `applyBusinessChange(client, update)` 只写数据库；不要在事务中发起 HTTP 请求。请将 `pg` 添加为应用的直接依赖。

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

    await applyBusinessChange(client, update); // 仅执行应用自己的数据库写入
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
    text: '更改已记录。',
  });
});
```

Outbox worker 可调用 `await bot.api.callApi(row.method, row.payload)`，然后将记录标记为已发送。多个 worker 需要短时 claim/lease 机制；不要在 HTTP 请求期间一直占用数据库事务。Telegram 发送仍是 **at-least-once**：若 API 已成功但 `delivered_at` 更新失败，消息可能再次发送。使用 `event_key` 做内部去重，并让通知易于核对。

## Outbox worker：lease、带抖动重试与 dead-letter

共享 worker 可用 `SKIP LOCKED` 安全 claim job，但仍需按 bot 和 chat 控制速率。请在上方 outbox DDL 中加入 lease/dead-letter 字段。claim 使用一个原子 statement；Telegram HTTP 请求必须在事务之外执行。

```sql
WITH ready AS (
  SELECT id
  FROM bot_outbox
  WHERE bot_id = $1
    AND delivered_at IS NULL
    AND dead_at IS NULL
    AND next_attempt_at <= now()
    AND (lease_until IS NULL OR lease_until < now())
  ORDER BY next_attempt_at, id
  LIMIT $2
  FOR UPDATE SKIP LOCKED
)
UPDATE bot_outbox AS job
SET attempts = job.attempts + 1,
    lease_until = now() + interval '45 seconds',
    lease_token = $3::uuid
FROM ready
WHERE job.id = ready.id
RETURNING job.*;
```

将上面的 claim SQL 保存为 `CLAIM_BOT_OUTBOX_SQL`，供下方 JavaScript helper 使用。每个 batch 的 `$3` 使用新的 UUID。lease 应长于 API timeout；长任务需要续租。`bot_id` 确保 worker 只处理正确的 token；如需保持顺序，请按 `chat_id` 分区，每个分区同一时刻只处理一个 job。

```js
const { randomUUID } = require('node:crypto');
const MAX_ATTEMPTS = 8;
const backoffMs = (attempt) => Math.floor(
  Math.random() * Math.min(5 * 60 * 1000, 1000 * 2 ** Math.min(attempt, 8)),
);

async function claimBotOutbox(botId, limit = 20) {
  const leaseToken = randomUUID();
  const { rows } = await pool.query(CLAIM_BOT_OUTBOX_SQL, [botId, limit, leaseToken]);
  return rows;
}

async function deliverTelegramJob(job) {
  try {
    await bot.api.callApi(job.method, job.payload);
    const ack = await pool.query(
      `UPDATE bot_outbox
       SET delivered_at = now(), lease_until = NULL, lease_token = NULL, last_error = NULL
       WHERE id = $1 AND bot_id = $2 AND lease_token = $3
       RETURNING id`,
      [job.id, job.bot_id, job.lease_token],
    );
    if (!ack.rowCount) logger.warn({ jobId: job.id }, 'Lease changed after send; reconcile the result');
  } catch (err) {
    const retryAfter = Number(err?.parameters?.retry_after || 0);
    const retryable = retryAfter > 0 || Number(err?.error_code) >= 500
      || ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(err?.code);
    const dead = !retryable || job.attempts >= MAX_ATTEMPTS;
    const delayMs = dead ? 0 : Math.max(retryAfter * 1000, backoffMs(job.attempts));
    const saved = await pool.query(
      `UPDATE bot_outbox
       SET next_attempt_at = now() + ($4::double precision * interval '1 millisecond'),
           lease_until = NULL, lease_token = NULL, last_error = $5,
           dead_at = CASE WHEN $3::boolean THEN now() ELSE NULL END
       WHERE id = $1 AND bot_id = $2 AND lease_token = $6
       RETURNING id`,
      [job.id, job.bot_id, dead, delayMs, safeTelegramErrorCode(err), job.lease_token],
    );
    if (!saved.rowCount) logger.warn({ jobId: job.id }, 'Lease changed; stale worker did not overwrite the new claim');
  }
}
```

Telegram 的 `retry_after` 优先于本地 backoff；还应使用分布式 limiter（如 Redis token bucket），因为内置 `throttler()` 只限制一个 `ApiClient`。请提供 `safeTelegramErrorCode(err)`，仅保存 allowlist 中的 API/network 代码，不要保存原始 error body 或消息。永久错误进入 dead-letter，交由 operator 对账。如果 Telegram 已接收请求但响应丢失，或 `delivered_at` 更新失败，job 可能再次发送：该方案是 **at-least-once**，不是 exactly-once。若原始 error body 可能含敏感数据，不要直接存储。

## 多副本拓扑与更新所有权

| 进程类型 | 扩展方式 | 所需状态与协调 |
| --- | --- | --- |
| Long poller | 每个 token 只有一个活动 owner；从 `replicas: 1` 开始。 | 故障切换需要带 fencing token 的 leader lease，或由 orchestrator 控制进程替换。不要让两个 poller 同时运行。 |
| Webhook ingress | 在 HTTPS load balancer 后运行多个无状态副本。 | 共享数据库/session store、幂等 inbox，并验证相同的 secret header。Telegram 可能重试 delivery。 |
| Outbox/queue worker | 根据队列深度和吞吐需求增加 consumer。 | Broker/分布式 claim、重试预算、共享速率限制，以及业务需要时的 per-chat 顺序。 |

TeleBibz 的 session 串行化和 `limiter()` 仅作用于单个实例。多个 webhook replica 可能同时收到 session key 相同的更新；若 read/modify/write 必须有序，请使用分布式锁/共享 session store，或按 key 分片。`throttler()` 也只作用于单个 `ApiClient`；多个 worker 共用一个 token/chat 时应采用集中式预算。

## 健康检查、drain 与运行手册

将 **liveness**（进程能够响应）与 **readiness**（进程已初始化、未处于 drain 状态且最低限度依赖已就绪）分开。不要让 liveness 依赖 Telegram API；上游短暂故障不应导致所有 replica 重启。

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

`database.ping()` 表示 driver 提供且带超时的健康检查。收到 `SIGTERM` 时，先设置 `draining = true`，停止接收新的 ingress 更新，等待正在处理的 handler/outbox 工作完成；若运行 poller，则调用 `bot.stop()`，最后关闭连接池。正常关闭或部署时保持 `dropPending: false`。

运维检查清单：

- **部署：** 同一 token 的 poller 逐个滚动更新；Webhook 先用 canary，并验证 secret header 和 body size 限制。
- **监控：** `pending_update_count`/最旧更新年龄、队列深度与年龄、handler p95、session store 延迟、API 错误、HTTP 429 `retry_after`、轮询 409 冲突和 outbox 失败。
- **恢复：** 验证数据库备份并演练恢复；故障切换后，先确认只有一个 poller 持有 lease/fencing token，再允许旧 worker 恢复。
- **更换密钥：** 通过官方流程轮换 token/secret，更新 secret manager，然后检查 `getMe()` 和 `getWebhookInfo()`；不要输出密钥值。

::: details Long polling 的最小 Dockerfile
```dockerfile
FROM node:22-bookworm-slim
WORKDIR /srv/bot
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "index.js"]
```

使用非 root 镜像并在运行时注入密钥。文件 session 应挂载权限受限的持久化 volume；数据库 session 不要把 dump 或凭据放入镜像层。Compose/托管环境应确保每个 token 只有一个 polling worker。
:::

HTTPS Webhook、反向代理、secret header 及从 polling 迁移，请查看[部署指南](/zh/guide/deployment)。409/429、rate limit 和常见 API 错误请查看[可靠性](/zh/guide/reliability)。
