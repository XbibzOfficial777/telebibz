---
title: Rate limits and errors
description: Retry temporary Bot API failures and report handler errors safely.
---

# Rate limits and errors

Telegram can return temporary network or rate-limit errors. Retry carefully, limit request volume, and keep handler errors visible in logs.

## Automatic retry and API queue

TeleBibz provides API transformers for retries and throttling:

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());
bot.api.config.use(throttler());
```

`autoRetry()` uses Telegram's `retry_after` value for rate-limit responses and retries eligible temporary failures. `throttler()` queues API calls to reduce request bursts. Transformers apply to API requests, not arbitrary code in handlers. Review their defaults and tune them for your workload and Telegram's documented limits.

## Limit updates per user

Apply a policy in middleware when an application needs per-user limits. A production limiter should use a shared store if the bot runs in multiple processes.

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

This in-memory example resets on restart and does not coordinate workers. For abuse prevention, also consider chat IDs, command cost, and application-level authorization.

## Handler and Bot API errors

Set `onError(err, ctx)` to report errors from handlers. A Context may not exist for polling or startup failures. Catch expected errors close to the operation and avoid returning internal stack traces to users.

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('TeleBibz error:', err);
    if (ctx?.chatId) console.error('Chat ID:', ctx.chatId);
  },
});

bot.cmd('profile', async (ctx) => {
  try {
    await ctx.reply(await loadProfile(ctx.from.id));
  } catch (error) {
    console.error('Could not load profile:', error);
    await ctx.reply('The profile is temporarily unavailable.');
  }
});
```

Bot API failures include Telegram's description and error metadata in the thrown error. Use `autoRetry` for eligible transient errors; do not retry invalid requests or authorization failures indefinitely.

## Common issues

- **409 Conflict:** another poller is using `getUpdates` for the same bot token. Stop the duplicate process.
- **429 Too Many Requests:** slow down and honor `retry_after`; avoid parallel request bursts.
- **Network timeout:** check the host's outbound access and proxy configuration. Retry only operations that are safe to repeat.
- **Handler failure:** inspect the `onError` report and keep a minimal reproducible example.

See [polling and webhooks](/en/guide/deployment) and the [FAQ](/en/faq).
