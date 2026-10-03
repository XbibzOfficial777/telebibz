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
