---
title: Middleware and Composer
description: Compose ordered middleware with filters, branches, routes, lazy handlers, and forks.
---

# Middleware and Composer

TeleBibz uses a composer-style middleware model. Middleware receives `(ctx, next)`, can read or enrich the Context, and calls `next()` to pass the update downstream.

## Order and `next()`

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log('Update duration (ms):', Date.now() - started);
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));
```

Shared middleware runs in registration order. Code before `await next()` runs before downstream handlers; code after it runs as the middleware chain returns. If middleware does not call `next()`, the chain stops there.

```js
bot.use(async (ctx, next) => {
  if (!ctx.from) return; // stop updates without a sender
  return next();
});
```

Do not call `next()` more than once. Composer detects repeated calls and throws an error.

## Predicate middleware and sub-routes

`TeleBibz.filter(predicate, ...middleware)` attaches a limited subtree to the bot. To register handlers inside it, create a `Composer`:

```js
const { Composer } = require('@xbibzlibrary/telebibz');

const privateRoutes = new Composer();
privateRoutes
  .filter((ctx) => ctx.chat?.type === 'private')
  .command('profile', (ctx) => ctx.reply(`ID: ${ctx.from?.id}`));
bot.use(privateRoutes.middleware());
```

`Composer.filter` returns a child Composer, so the command above runs only when the predicate is true. For one middleware, `bot.filter(predicate, handler)` is also available. `drop` skips a subtree when the predicate is true; `branch` selects one of two branches:

```js
bot.branch(
  (ctx) => ctx.chat?.type === 'private',
  (ctx) => ctx.reply('Private chat'),
  (ctx) => ctx.reply('Not a private chat'),
);
```

## Route by Context value

`route(router, mapping)` computes a value and forwards the update to the matching middleware:

```js
bot.route((ctx) => ctx.chat?.type ?? 'unknown', {
  private: (ctx) => ctx.reply('Private route'),
  group: (ctx) => ctx.reply('Group route'),
  supergroup: (ctx) => ctx.reply('Supergroup route'),
});
```

Unmapped values continue to the next handler. Use `route` to choose one branch; use `on()` to match update fields or message properties.

## Lazy middleware

`lazy(factory)` creates or selects middleware using the current Context. The factory can return one middleware or an array:

```js
bot.lazy((ctx) => {
  if (ctx.from?.is_bot) return botMiddleware;
  return userMiddleware;
});
```

This can separate user, bot, or tenant policies without rebuilding the bot instance.

## Fork background work

`fork(...middleware)` starts middleware without holding up `next()`. Use it only for work that does not need to be part of the main response. Fork errors are reported by the library.

```js
bot.fork(async (ctx) => {
  await saveAuditRecord(ctx.update);
});

bot.cmd('start', (ctx) => ctx.reply('The bot is ready.'));
```

Do not depend on a fork's result before the response handler finishes. Use an application queue or worker for important work that needs retries, durability, or user confirmation.

## Error boundaries

Application handlers on `TeleBibz` are wrapped in a built-in error boundary. Set a custom reporter in the constructor:

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('Handler failed:', err);
    if (ctx?.chatId) console.error('Chat:', ctx.chatId);
  },
});
```

For a standalone `Composer`, `Composer.errorBoundary(handler, ...middleware)` can wrap a subtree. Its handler receives a `BotError` containing the original `error` and `ctx`:

```js
const { Composer } = require('@xbibzlibrary/telebibz');
const guarded = new Composer();
guarded.errorBoundary((err, next) => {
  console.error('Subtree error:', err.error);
  return next();
}, riskyMiddleware);
bot.use(guarded.middleware());
```

See [handlers and filters](/en/guide/handlers) for `cmd`, `hears`, `on`, `action`, and `inlineQuery` matchers. The [architecture guide](/en/guide/architecture) explains the update pipeline.
