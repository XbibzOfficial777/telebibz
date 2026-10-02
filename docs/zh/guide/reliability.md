---
title: 速率限制与错误
description: 重试临时 Bot API 错误，并安全报告处理器异常。
---

# 速率限制与错误

Telegram 可能返回临时网络或速率限制错误。请谨慎重试、限制请求速率，并在日志中保留处理器错误信息。

## 自动重试与 API 队列

TeleBibz 提供用于重试和限流的 API transformer：

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());
bot.api.config.use(throttler());
```

`autoRetry()` 会遵守速率限制响应中的 `retry_after`，并重试符合条件的临时故障。`throttler()` 会对 API 调用排队，降低请求突发。Transformer 作用于 API 请求，不作用于处理器中的任意代码。请查看默认配置，并根据负载与 Telegram 限制进行调整。

## 限制每位用户的更新速率

如需用户级限制，可在中间件中实施策略。多进程部署应使用共享存储的限流器。

```js
const lastSeen = new Map();
const minimumIntervalMs = 500;

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId) {
    const now = Date.now();
    const previous = lastSeen.get(userId) ?? 0;
    if (now - previous < minimumIntervalMs) return;
    lastSeen.set(userId, now);
  }
  return next();
});
```

此内存示例在重启后会重置，且不会协调多个 worker。防止滥用时，还应考虑聊天 ID、命令开销和应用级授权。

## 处理器与 Bot API 错误

可通过 `onError(err, ctx)` 报告处理器错误。轮询或启动错误可能没有 Context。请在操作附近捕获可预期的错误，不要向用户返回内部堆栈信息。

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('TeleBibz 错误：', err);
    if (ctx?.chatId) console.error('聊天 ID：', ctx.chatId);
  },
});

bot.cmd('profile', async (ctx) => {
  try {
    await ctx.reply(await loadProfile(ctx.from.id));
  } catch (error) {
    console.error('无法加载个人资料：', error);
    await ctx.reply('个人资料暂时无法使用。');
  }
});
```

Bot API 请求失败时，抛出的错误会在可用时附带 Telegram 错误说明和响应元数据。可对符合条件的临时错误使用 `autoRetry`；无效请求和授权错误不应无限重试。

## 常见问题

- **409 Conflict：** 另一个进程正使用同一令牌调用 `getUpdates`。请停止重复进程。
- **429 Too Many Requests：** 降低请求速率并遵守 `retry_after`，避免并发请求突发。
- **网络超时：** 检查主机的出站网络与代理设置。仅重试可安全重复的操作。
- **处理器失败：** 检查 `onError` 报告并创建最小复现案例。

另请参阅[轮询与 Webhook](/zh/guide/deployment)和[常见问题](/zh/faq)。
