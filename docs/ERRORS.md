# Error handling guide (English)

Every error path in telebibz, what it means, and how to handle it — from Telegram API errors to handler failures, timeouts, and shutdown.

## Contents

1. [The error taxonomy](#1-the-error-taxonomy)
2. [TelegramError anatomy](#2-telegramerror-anatomy)
3. [429 rate limits and the flood gate](#3-429-rate-limits-and-the-flood-gate)
4. [Handler errors and `bot.catch()`](#4-handler-errors-and-botcatch)
5. [handlerTimeout and `UpdateTimeoutError`](#5-handlertimeout-and-updatetimeouterror)
6. [Event-based error observation](#6-event-based-error-observation)
7. [Transport retries and network errors](#7-transport-retries-and-network-errors)
8. [Error handling recipes](#8-error-handling-recipes)

## 1. The error taxonomy

Every Telegram API failure is a `TelegramError` with a `kind`:

| `kind` | Subclass | Meaning | Typical trigger |
|---|---|---|---|
| `rate-limit` | `TelegramRateLimitError` | Telegram answered 429 | Sending too fast; `retryAfter` is set |
| `authentication` | `TelegramAuthError` | Token invalid/revoked (401) | Wrong token, revoked bot, logout |
| `validation` | `TelegramValidationError` | Bad request parameters (400) | Unknown `file_id`, malformed payload |
| `network` | `TelegramNetworkError` | Transport-level failure | DNS, socket, non-JSON response, download failure |
| `server` | — | Telegram server error (5xx) | Transient; retried automatically |
| `retryable` | — | Other retryable Telegram error | Flood-wait variants |
| `unknown` | — | Anything else | — |

Check `kind` when the reaction should differ:

```ts
import { TelegramError, TelegramRateLimitError } from "@xbibzlibrary/telebibz";

try {
  await ctx.reply("hello");
} catch (error) {
  if (error instanceof TelegramError) {
    switch (error.kind) {
      case "rate-limit":   console.log(`slow down ${error.retryAfter}s`); break;
      case "authentication": console.error("token problem — stopping"); break;
      case "validation":   console.warn(error.message); break;
      default:             console.error(error.message);
    }
  }
}
```

`instanceof TelegramRateLimitError` works too when you only care about 429s.

## 2. TelegramError anatomy

```ts
try {
  await bot.api.methods.getChatMember({ chat_id: -100123, user_id: 42 });
} catch (error) {
  if (error instanceof TelegramError) {
    error.kind;       // one of the seven kinds above
    error.errorCode;  // Telegram error_code (400, 401, 429, …) when present
    error.method;     // "getChatMember" — the failing call
    error.payload;    // the payload that was sent
    error.retryAfter; // seconds, only for 429 (from parameters.retry_after)
    error.message;    // Telegram's description
  }
}
```

## 3. 429 rate limits and the flood gate

You normally never see a 429, because the transport handles them for you:

1. Telegram answers 429 with `parameters.retry_after`.
2. The **flood gate** pauses *new* outgoing requests for exactly that window — protecting all in-flight traffic, not just the request that was rejected.
3. The failed request is retried automatically, then the failure (if it persists) surfaces as `TelegramRateLimitError`.

The flood gate is the **only** delay the library ever introduces — it is never a proactive cooldown. Tune or disable it per transport:

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  transportOptions: {
    floodGate: false,   // handle 429s entirely yourself
    retries: 3,         // retry count for 429/5xx/network errors
    backoffMs: 250,     // exponential backoff base
    maxBackoffMs: 8_000,
    timeoutMs: 30_000,  // per-request timeout
  },
});
```

If you disable the gate, catch `TelegramRateLimitError` and honor `retryAfter` yourself — Telegram's word is final:

```ts
catch (error) {
  if (error instanceof TelegramRateLimitError) {
    await sleep((error.retryAfter ?? 1) * 1000);
    return retry();
  }
  throw error;
}
```

## 4. Handler errors and `bot.catch()`

Without an error boundary, a throwing handler rejects `handleUpdate()` (and a webhook answers 500). With `bot.catch()`, failures are routed to one place:

```ts
bot.catch(async (error, ctx) => {
  console.error("handler failed:", error);

  if (error instanceof TelegramError && error.kind === "authentication") {
    process.exitCode = 1;             // unrecoverable — let the supervisor restart
    await bot.stop();
    return;
  }

  await ctx.reply("❌ Terjadi kesalahan. Coba lagi."); // ctx is the failing update's context
});
```

Key behaviors:
- Only the failing update is affected — other chats keep processing concurrently.
- Per-chat ordering is preserved: the next update of the same chat still waits for this one.
- `broadcast()` failures are collected in the report instead of throwing.

## 5. handlerTimeout and `UpdateTimeoutError`

`handlerTimeout` (default **90 000 ms**, matching Telegraf) protects the pipeline from hung handlers:

```ts
const bot = new Bot({ token, handlerTimeout: 30_000 }); // 0 or Infinity disables
```

- The hung update's `handleUpdate()` promise rejects with `UpdateTimeoutError` and flows through `update:error` → `bot:error` → `bot.catch()`.
- **The handler keeps running in the background** — sessions and conversations still complete their writes; the timeout only releases the pipeline.
- Per-chat ordering is unaffected.

## 6. Event-based error observation

For metrics/ logging independent of the boundary, listen on the event bus:

```ts
bot.events.on("update:error", ({ update, error }) => {
  metrics.increment("handler_errors", { updateId: (update as { update_id?: number }).update_id });
});
bot.events.on("bot:error", ({ error }) => log.error("bot error", { error }));
bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) log.warn("slow api call", { method, durationMs });
});
```

## 7. Transport retries and network errors

`FetchTransport` retries automatically on: 429 (with Telegram's `retry_after`), 5xx, network errors, and non-JSON responses — with exponential backoff and jitter. After `retries` attempts the last error surfaces as `TelegramNetworkError` (with `status` and a truncated cause). Authentication errors (401) and validation errors (400) are **never** retried — retrying cannot fix them.

## 8. Error handling recipes

**Retry with backoff around a single call** (beyond transport retries):

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

**Fail fast on bad tokens** (polling with an invalid token):

```ts
try {
  await bot.start();
} catch (error) {
  if (error instanceof TelegramError && error.kind === "authentication") {
    console.error("TELEGRAM_BOT_TOKEN is invalid or revoked");
  }
  throw error;
}
```

**Graceful shutdown** — `stop()` drains in-flight handlers first:

```ts
process.on("SIGINT", () => { void bot.stop().then(() => process.exit(0)); });
process.on("SIGTERM", () => { void bot.stop().then(() => process.exit(0)); });
```

Bahasa Indonesia: [ERRORS.id.md](ERRORS.id.md) · 简体中文: [ERRORS.zh-CN.md](ERRORS.zh-CN.md)
