---
title: Troubleshooting
description: A structured diagnosis guide for polling, webhooks, updates, handlers, Bot API errors, sessions, and uploads.
---

# Troubleshooting

Trace one layer at a time. Record TeleBibz/Node.js versions, transport mode, timestamp, `update_id`, API method, and a sanitized Telegram error. Never copy tokens, message contents, files, webhook secrets, or full update objects into issues/logs.

## Quick diagnosis tree

1. **Does startup fail before `bot.botInfo` exists?** Test the token with `getMe()`, validate the environment, DNS, proxy, and outbound HTTPS.
2. **Does `getMe()` work but no updates arrive?** Confirm only one transport is active. Polling cannot receive updates while a webhook is set.
3. **Do updates arrive but handlers do not run?** Check `allowedUpdates`, `dropPending`, filters/commands, middleware that fails to call `next()`, and registration order.
4. **Does a handler run but the API call fail?** Read `ApiError.description`, `error_code`, method, and `retry_after`; check chat permissions and the payload before adding retries.
5. **Is state missing or mixed?** Check the session key, storage persistence, and the number of replicas using the store.

## Common errors and symptoms

| Symptom / status | Check first | Safe action |
| --- | --- | --- |
| `401 Unauthorized` / `getMe()` fails | Wrong/revoked secret, or an extra newline/quote in the environment value. | Replace the secret from @BotFather; never print the token. Restart one instance after updating it. |
| `409 Conflict` while polling | Duplicate poller or a webhook still configured. | Stop the other poller. Check `getWebhookInfo()`; before returning to polling, call `deleteWebhook({ drop_pending_updates: false })`. |
| `429 Too Many Requests` | The response includes `retry_after`; limits can be global, per chat, or per method. | Honor `retry_after`, enable `autoRetry()`, pace bursts with `throttler()`, and check other workers. |
| `400 Bad Request` | `description` identifies a field, parse mode, file, chat, or parameter combination. | Validate `TelegramMethodPayload<M>`/method, escaping, file size, and chat state; do not retry an unchanged payload. |
| `403 Forbidden` / bot blocked | The user revoked access, blocked the bot, or admin rights are insufficient. | Mark the target unreachable and check admin permissions. Do not keep broadcasting to users who blocked the bot. |
| `chat not found` | Wrong ID, user has never opened the bot, or the bot is not a member. | Verify the ID and **Start**/membership/invite flow; do not guess chat IDs. |
| Polling runs, but an update type is missing | `allowedUpdates` excludes it, or pending updates were dropped. | Check constructor `allowedUpdates` and `dropPending`; choose backlog behavior explicitly. |
| Webhook receives no request | URL/path, HTTPS, POST route, secret, reverse proxy, body parser, or 2xx response. | Compare `getWebhookInfo()`, inspect proxy logs, and ensure the route reads the body once. Never publish the secret. |
| File upload/download fails | Path/permissions, destination directory, size, stream, or media method/type. | Check file access and Telegram limits. Validate destination names; never use user-supplied filenames as paths. |
| Update succeeds but session is empty | Default `Map` was lost on restart or the key differs between updates. | Use persistent storage and a stable `getKey(ctx)`; multiple processes need a shared store. |

## Polling versus webhooks

Use one mode per token. When moving from webhooks to long polling, check the current status and delete the webhook with `drop_pending_updates: false` if the backlog must be processed. `drop_pending_updates: true` discards queued updates when polling starts; do not use it as a trial-and-error fix. For webhooks, confirm the public HTTPS URL, exact POST route, successful response, secret header, body limit, and proxy configuration.

See [Polling and webhooks](/en/guide/deployment) for setup details.

## Updates arrive, but a handler does not match

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

Observability middleware must call `next()` for later handlers to run. Register it before the routes/handlers it should measure. Add labels such as handler name or update type when available, but avoid message text, tokens, and full payloads. Handler exceptions reach `onError(err, ctx)`; handle expected business failures close to the operation.

## Callback or edit message failed

- Answer callback queries with `ctx.answerCallbackQuery()` to dismiss Telegram's loading indicator.
- Edit only messages the bot is allowed to edit; `message is not modified` usually means the content is unchanged.
- Check HTML/Markdown escaping, `parse_mode`, Telegram length limits, and `InputFile` type.
- API calls from schedulers/workers outside handlers still need their own `try/catch`; `onError` does not automatically retry every error outside the update pipeline.
- A timeout after sending a request does not prove Telegram rejected the side effect. Use idempotency/outbox patterns for operations that may be retried.

## Sessions, concurrency, and graceful shutdown

`TeleBibz` limits concurrent updates and serializes updates with the same session key. For consistency across replicas, share the session adapter and make writes atomic; the default `Map` lives in one process only. During long-polling shutdown, call `bot.stop()` and await `bot.runPromise`. Check for stuck handlers/database requests before extending shutdown timeouts.

See [files and sessions](/en/guide/files-sessions), [rate limits and errors](/en/guide/reliability), and [production operations](/en/guide/production-patterns).

## Reproducible bug reports

Include package/Node.js versions, OS, transport, method or update type, a sanitized Telegram error, event order, and a minimal reproduction. Replace tokens, personal IDs, internal URLs, message content, and secrets with placeholders before sharing.
