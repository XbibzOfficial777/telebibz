---
title: 故障排查
description: 系统化排查轮询、Webhook、更新、handler、Bot API 错误、session 与文件上传。
---

# 故障排查

逐层定位问题。记录 TeleBibz/Node.js 版本、transport 模式、时间戳、`update_id`、API method 和脱敏后的 Telegram 错误。不要把 token、消息内容、文件、Webhook secret 或完整 update object 复制到 issue/日志中。

## 快速诊断流程

1. **启动时 `bot.botInfo` 尚不存在就失败？** 使用 `getMe()` 验证 token，并检查环境变量、DNS、代理与 outbound HTTPS。
2. **`getMe()` 成功但没有 update？** 确认只启用了一个 transport。Webhook 仍启用时，轮询无法收到 update。
3. **收到了 update，但 handler 没运行？** 检查 `allowedUpdates`、`dropPending`、filter/command、未调用 `next()` 的 middleware，以及注册顺序。
4. **handler 运行但 API 调用失败？** 查看 `ApiError.description`、`error_code`、method 和 `retry_after`；增加 retry 前先确认 chat 权限与 payload。
5. **state 丢失或混杂？** 检查 session key、storage 持久性，以及访问同一 store 的 replica 数量。

## 常见错误与症状

| 症状 / 状态 | 优先检查 | 安全处理 |
| --- | --- | --- |
| `401 Unauthorized` / `getMe()` 失败 | secret 错误/已撤销，或环境变量包含额外换行/引号。 | 在 @BotFather 重新获取 secret；不要打印 token。更新后只重启一个实例。 |
| 轮询时 `409 Conflict` | poller 重复或仍配置了 webhook。 | 停止其他 poller。检查 `getWebhookInfo()`；切回轮询前调用 `deleteWebhook({ drop_pending_updates: false })`。 |
| `429 Too Many Requests` | 响应包含 `retry_after`；限制可能按全局、chat 或 method 计算。 | 遵循 `retry_after`，启用 `autoRetry()`，用 `throttler()` 降低 burst，并检查其他 worker。 |
| `400 Bad Request` | `description` 通常会指出字段、parse mode、文件、chat 或参数组合错误。 | 验证 `TelegramMethodPayload<M>`/method、转义、文件大小和 chat 状态；不要重复发送相同错误 payload。 |
| `403 Forbidden` / bot 被封锁 | 用户撤销访问权限、封锁 bot，或管理员权限不足。 | 将目标标记为不可达并检查管理员权限；不要持续向已封锁 bot 的用户群发。 |
| `chat not found` | ID 错误、用户从未打开 bot，或 bot 不是该 chat 成员。 | 核对 ID、**Start**/成员关系/邀请流程；不要猜 chat ID。 |
| polling 正常但缺少某类 update | `allowedUpdates` 未包含该类型，或待处理 update 已被丢弃。 | 检查 constructor `allowedUpdates` 和 `dropPending`；明确选择 backlog 策略。 |
| Webhook 没收到请求 | URL/path、HTTPS、POST route、secret、反向代理、body parser 或 2xx 响应。 | 对照 `getWebhookInfo()` 并查看代理日志，确认 route 只读取一次 body。不要公开 secret。 |
| 文件上传/下载失败 | path/权限、目标目录、大小、stream 或媒体 method/type。 | 检查文件访问权限和 Telegram 限制。校验目标文件名；不要把用户输入当作文件路径。 |
| update 成功但 session 为空 | 默认 `Map` 在重启后丢失，或不同 update 的 key 不一致。 | 使用持久化 storage 和稳定的 `getKey(ctx)`；多进程需要共享 store。 |

## Polling 与 Webhook

每个 token 只使用一种模式。从 webhook 切换到 long polling 时先检查当前状态；若需处理积压，使用 `drop_pending_updates: false` 删除 webhook。`drop_pending_updates: true` 会在启动轮询时丢弃待处理 update，不要将其当作试错修复。Webhook 必须确认公网 HTTPS URL、准确的 POST route、成功响应、secret header、body 上限与代理配置。

具体配置见[轮询与 Webhook](/zh/guide/deployment)。

## 收到 update，但 handler 没匹配

```js
bot.use(async (ctx, next) => {
  const startedAt = Date.now();
  try {
    await next();
  } finally {
    metrics.observe('telebibz_update_duration_ms', Date.now() - startedAt);
    logger.debug({ updateId: ctx.update.update_id }, 'Update processed');
  }
});

bot.cmd('start', (ctx) => ctx.reply('Bot is running.'));
bot.hears(/^ping$/i, (ctx) => ctx.reply('pong'));
```

可观测性 middleware 必须调用 `next()`，后续 handler 才会运行。请在希望测量的 route/handler 之前注册。可按需增加 handler 名称或 update 类型作为 label，但不要记录消息正文、token 或完整 payload。handler exception 会进入 `onError(err, ctx)`；预期中的业务失败应在操作附近处理。

## Callback 或编辑消息失败

- 使用 `ctx.answerCallbackQuery()` 回应 callback query，使 Telegram 关闭按钮加载指示器。
- 只能编辑 bot 有权限编辑的消息；`message is not modified` 通常表示内容没有变化。
- 检查 HTML/Markdown 转义、`parse_mode`、Telegram 字符限制和 `InputFile` 类型。
- handler 之外的 scheduler/worker API 调用仍需单独使用 `try/catch`；`onError` 不会自动重试 update pipeline 之外的所有错误。
- 请求发出后的 timeout 不代表 Telegram 一定拒绝了 side effect。对于可重试操作，使用幂等/outbox 模式。

## Session、并发与优雅关闭

`TeleBibz` 限制并发 update，并按相同 session key 串行处理。跨 replica 一致性要求共享 session adapter 并原子写入；默认 `Map` 只存在于单个进程中。long polling 关闭时，调用 `bot.stop()` 并等待 `bot.runPromise`。延长 shutdown timeout 前，先检查 handler/数据库请求是否卡住。

另请查看[文件与 session](/zh/guide/files-sessions)、[速率限制与错误](/zh/guide/reliability)和[生产环境运维模式](/zh/guide/production-patterns)。

## 可复现的 bug 报告

提供 package/Node.js 版本、OS、transport、method 或 update 类型、脱敏后的 Telegram 错误、事件顺序与最小复现。在分享前将 token、个人 ID、内部 URL、消息正文和 secret 替换为占位符。
