---
title: 速率限制与错误
description: 处理 429、限制请求突发，并安全记录可恢复错误。
---

# 速率限制与错误

Telegram 同时设置全局规则以及按 chat/method 区分的限制。避免不受控制的并发请求；收到 429 时，读取 Telegram 的 `retry_after` 并据此安排下一次请求。

## 自动重试与 API 队列

`autoRetry()` 会重试包含 `parameters.retry_after` 的符合条件错误。`throttler()` 对外发请求排队并控制间隔。

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
```

默认情况下，`autoRetry()` 会对包含 `retry_after` 的错误最多重试五次，重试间隔增加 `baseDelayMs * attempt`。默认 `throttler()` 将当前 client 限制为每秒 28 次调用。它只作用于一个 instance/process；多个 worker 需要共享 queue 或 rate limiter。

创建 `bot` 后、开始 API 调用前注册 transformer。最新添加的 transformer 是最外层；以上顺序让 `autoRetry()` 位于 `throttler()` 外部，因此每次 retry 也会经过队列。

## 按用户限制 update

`limiter()` 是限制单个用户 update 的内存 middleware。默认每两秒三个 update：

```js
const { limiter } = require('@xbibzlibrary/telebibz');

bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('请稍后再试。'),
}));
```

请在需要保护的 handler 前注册 limiter。默认 key 使用 `from.id`；没有 sender 时回退为 chat ID。bucket 存储在进程内 `Map`，不是分布式保护；多个 worker 需要一致性时使用共享 store。

## Handler 与 Bot API 错误

TeleBibz 在 handler pipeline 外层提供 error boundary。可在 constructor 中设置 `onError(err, ctx)` 以报告日志/telemetry。handler 错误会携带原始 Error 和可用的 Context；严重 polling 错误可能没有 Context。

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('Update failed:', { err, updateId: ctx?.update?.update_id });
  },
});
```

在 handler 之外直接调用 API 时，请使用 `try/catch`。`ApiError` 可能包含 `description`、`error_code`、`method`、`payload` 和 Telegram 响应参数。`humanize(error)` 返回 `pesan`、`saran`（库当前使用的印尼语属性名），以及可用时的 `method`、`code`。

```js
const { humanize } = require('@xbibzlibrary/telebibz');

try {
  await bot.api.getChat(chatId);
} catch (err) {
  const info = humanize(err);
  console.error(info.pesan, info.saran);
}
```

除非确有需要且受适当保护，否则不要记录完整 payload 或个人标识。

## 常见错误

| 错误 | 优先检查 |
| --- | --- |
| `409 Conflict` | 另一个 poller 正在使用相同 token；停止重复实例或切换到 Webhook。 |
| `429 Too Many Requests` | 遵循 `retry_after`；同时检查每个 chat 与全局请求速率。 |
| `chat not found` | 核对 ID；私聊用户通常需要先打开 bot 并点击 **Start**。 |
| `bot was blocked by the user` | 将接收者标记为不活跃，并停止向其重复 broadcast。 |
| `not enough rights` | 检查 bot 的管理员状态和 chat 权限。 |
| `message is not modified` | 编辑内容没有变化，通常可安全忽略。 |
| Parse entity 错误 | 发送前检查转义以及 HTML/Markdown 标签。 |

没有明确需求时，不要记录 bot token、敏感数据或完整消息正文。Transformer retry、transport 队列与测试替身请查看[传输与测试](/zh/guide/transports-testing)；broadcast 安全请查看[Inline 与群发](/zh/guide/inline-broadcast)。
