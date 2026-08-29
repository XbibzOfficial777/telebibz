# 错误处理指南（简体中文）

telebibz 中每一条错误路径、其含义与处理方式 —— 从 Telegram API 错误到 handler 失败、超时与关机。

## 目录

1. [错误分类](#1-错误分类)
2. [TelegramError 解剖](#2-telegramerror-解剖)
3. [429 限流与 flood gate](#3-429-限流与-flood-gate)
4. [错误处理器与 `bot.catch()`](#4-错误处理器与-botcatch)
5. [handlerTimeout 与 `UpdateTimeoutError`](#5-handlertimeout-与-updatetimeouterror)
6. [基于事件的错误观测](#6-基于事件的错误观测)
7. [传输层重试与网络错误](#7-传输层重试与网络错误)
8. [错误处理配方](#8-错误处理配方)

## 1. 错误分类

每个 Telegram API 失败都是带 `kind` 的 `TelegramError`：

| `kind` | 子类 | 含义 | 常见诱因 |
|---|---|---|---|
| `rate-limit` | `TelegramRateLimitError` | Telegram 返回 429 | 发送过快；`retryAfter` 有值 |
| `authentication` | `TelegramAuthError` | token 无效/被吊销（401） | token 错误、bot 被吊销、logout |
| `validation` | `TelegramValidationError` | 请求参数错误（400） | 未知的 `file_id`、损坏的负载 |
| `network` | `TelegramNetworkError` | 传输层失败 | DNS、socket、非 JSON 响应、下载失败 |
| `server` | — | Telegram 服务器错误（5xx） | 瞬时故障；自动重试 |
| `retryable` | — | 其他可重试的 Telegram 错误 | flood-wait 变体 |
| `unknown` | — | 其他 | — |

当不同错误需要不同反应时，检查 `kind`：

```ts
import { TelegramError, TelegramRateLimitError } from "@xbibzlibrary/telebibz";

try {
  await ctx.reply("hello");
} catch (error) {
  if (error instanceof TelegramError) {
    switch (error.kind) {
      case "rate-limit":     console.log(`放慢 ${error.retryAfter}s`); break;
      case "authentication": console.error("token 问题 —— 停机"); break;
      case "validation":     console.warn(error.message); break;
      default:               console.error(error.message);
    }
  }
}
```

如果只关心 429，也可以用 `instanceof TelegramRateLimitError`。

## 2. TelegramError 解剖

```ts
try {
  await bot.api.methods.getChatMember({ chat_id: -100123, user_id: 42 });
} catch (error) {
  if (error instanceof TelegramError) {
    error.kind;       // 上表七种 kind 之一
    error.errorCode;  // Telegram 的 error_code（400、401、429……），如存在
    error.method;     // "getChatMember" —— 失败的调用
    error.payload;    // 发出的负载
    error.retryAfter; // 秒数，仅 429（来自 parameters.retry_after）
    error.message;    // Telegram 的描述
  }
}
```

## 3. 429 限流与 flood gate

通常你根本见不到 429，因为传输层已经处理了：

1. Telegram 返回带 `parameters.retry_after` 的 429。
2. **flood gate** 在该时间窗内暂停*新的*外发请求 —— 保护整个流量，而不只是被拒绝的那个请求。
3. 被拒请求自动重试；若仍失败，最终以 `TelegramRateLimitError` 抛出。

flood gate 是本库引入的唯一暂停机制 —— 从不做主动冷却。可按传输层调整或关闭：

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  transportOptions: {
    floodGate: false,   // 完全自行处理 429
    retries: 3,         // 429/5xx/网络错误的重试次数
    backoffMs: 250,     // 指数退避基数
    maxBackoffMs: 8_000,
    timeoutMs: 30_000,  // 单个请求超时
  },
});
```

关闭 gate 后，请捕获 `TelegramRateLimitError` 并遵守 `retryAfter` —— Telegram 说了算：

```ts
catch (error) {
  if (error instanceof TelegramRateLimitError) {
    await sleep((error.retryAfter ?? 1) * 1000);
    return retry();
  }
  throw error;
}
```

## 4. 错误处理器与 `bot.catch()`

没有错误边界时，抛异常的 handler 会让 `handleUpdate()` 拒绝（webhook 则返回 500）。使用 `bot.catch()` 把失败引到一处：

```ts
bot.catch(async (error, ctx) => {
  console.error("handler 失败：", error);

  if (error instanceof TelegramError && error.kind === "authentication") {
    process.exitCode = 1;             // 不可恢复 —— 交给监督进程重启
    await bot.stop();
    return;
  }

  await ctx.reply("❌ 出错了，请稍后再试。"); // ctx = 失败 update 的上下文
});
```

关键行为：
- 只有失败的 update 受影响 —— 其他 chat 继续并发处理。
- 每 chat 顺序保持不变：同一 chat 的后续 update 仍会排队等待。
- `broadcast()` 的失败收集在报告中，而不是抛异常。

## 5. handlerTimeout 与 `UpdateTimeoutError`

`handlerTimeout`（默认 **90 000 毫秒**，与 Telegraf 一致）保护流水线免受挂起 handler 的拖累：

```ts
const bot = new Bot({ token, handlerTimeout: 30_000 }); // 0 或 Infinity 表示禁用
```

- 挂起 update 的 `handleUpdate()` promise 抛出 `UpdateTimeoutError`，并依次流经 `update:error` → `bot:error` → `bot.catch()`。
- **handler 仍在后台运行** —— session 与 conversation 照常完成写入；超时只释放流水线。
- 每 chat 顺序不受影响。

## 6. 基于事件的错误观测

要独立于错误边界的指标/日志，监听事件总线：

```ts
bot.events.on("update:error", ({ update, error }) => {
  metrics.increment("handler_errors", { updateId: (update as { update_id?: number }).update_id });
});
bot.events.on("bot:error", ({ error }) => log.error("bot error", { error }));
bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) log.warn("慢速 API 调用", { method, durationMs });
});
```

## 7. 传输层重试与网络错误

`FetchTransport` 自动重试：429（遵守 Telegram 的 `retry_after`）、5xx、网络错误、非 JSON 响应 —— 采用指数退避加抖动。重试 `retries` 次后，最后一个错误以 `TelegramNetworkError` 抛出（含 `status` 与截断的 cause）。认证错误（401）和校验错误（400）**从不**重试 —— 重试无济于事。

## 8. 错误处理配方

**围绕单次调用的退避重试**（在传输层重试之外）：

```ts
async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try { return await run(); }
    catch (error) {
      if (error instanceof TelegramError && ["authentication", "validation"].includes(error.kind)) throw error;
      if (i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 500 * 2 ** i));
    }
  }
  throw new Error("unreachable");
}
```

**token 无效时快速失败**（用错误 token 轮询）：

```ts
try {
  await bot.start();
} catch (error) {
  if (error instanceof TelegramError && error.kind === "authentication") {
    console.error("TELEGRAM_BOT_TOKEN 无效或已吊销");
  }
  throw error;
}
```

**优雅关机** —— `stop()` 先排空在途 handler：

```ts
process.on("SIGINT", () => { void bot.stop().then(() => process.exit(0)); });
process.on("SIGTERM", () => { void bot.stop().then(() => process.exit(0)); });
```

English: [ERRORS.md](ERRORS.md) · Bahasa Indonesia: [ERRORS.id.md](ERRORS.id.md)
