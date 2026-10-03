---
title: Rate limits and errors
description: Handle 429 responses, limit bursts, and report recoverable errors safely.
---

# Rate limits and errors

Telegram applies global rules as well as chat- and method-specific limits. Avoid uncontrolled parallel calls; when a 429 response arrives, read Telegram's `retry_after` value and schedule the next attempt accordingly.

## Automatic retry and the API queue

`autoRetry()` retries eligible errors that include `parameters.retry_after`. `throttler()` queues outgoing calls and spaces them apart.

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
```

By default, `autoRetry()` makes up to five retries for failures with `retry_after`, adding `baseDelayMs * attempt` between tries. The default `throttler()` limits this client to 28 calls per second. It is local to one instance/process; multiple workers need a shared queue or rate limiter.

Add transformers after creating `bot` and before making requests. The newest transformer becomes the outer layer; the order above puts `autoRetry()` outside `throttler()`, so each retry also passes through the queue.

## Limit updates per user

`limiter()` is an in-memory middleware that limits updates from one user. Its default is three updates in two seconds:

```js
const { limiter } = require('@xbibzlibrary/telebibz');

bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('Please try again shortly.'),
}));
```

Register the limiter before the handlers it should protect. The default key uses `from.id`, falling back to the chat ID when no sender is present. Buckets live in a process-local `Map`, so this is not distributed protection; use a shared store when several workers need consistent limits.

## Handler and Bot API errors

TeleBibz wraps the handler pipeline in a built-in error boundary. Set `onError(err, ctx)` in the constructor to report errors to logging/telemetry. A handler error includes the original error and, when available, Context; fatal polling errors may have no Context.

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('Update failed:', { err, updateId: ctx?.update?.update_id });
  },
});
```

Outside a handler, wrap direct API calls in `try/catch`. `ApiError` can include `description`, `error_code`, `method`, `payload`, and Telegram response parameters. `humanize(error)` returns `pesan` and `saran` (the library's current Indonesian property names), plus `method` and `code` when available.

```js
const { humanize } = require('@xbibzlibrary/telebibz');

try {
  await bot.api.getChat(chatId);
} catch (err) {
  const info = humanize(err);
  console.error(info.pesan, info.saran);
}
```

Avoid logging the full payload or personal identifiers unless needed and appropriately protected.

## Common errors

| Error | First check |
| --- | --- |
| `409 Conflict` | Another poller uses the token; stop the duplicate instance or switch to webhooks. |
| `429 Too Many Requests` | Honor `retry_after`; inspect per-chat as well as global request volume. |
| `chat not found` | Verify the ID; a private user usually needs to open the bot and press **Start**. |
| `bot was blocked by the user` | Mark the recipient inactive and stop retrying broadcasts to them. |
| `not enough rights` | Check the bot's admin status and chat permissions. |
| `message is not modified` | The edit did not change the content; it is usually safe to ignore. |
| Parse-entity error | Validate escaping and HTML/Markdown tags before sending. |

Never log bot tokens, sensitive data, or full message content without a clear need. For transformer retries, transport queues, and test doubles, see [Transport and testing](/en/guide/transports-testing); for broadcast safety, see [Inline mode and broadcast](/en/guide/inline-broadcast).
