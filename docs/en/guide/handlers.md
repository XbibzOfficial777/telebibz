---
title: Handlers and filters
description: Match commands, text, update types, and callback queries.
---

# Handlers and filters

A handler is called when an update matches. It receives `ctx` (the update's Context) and may receive `next` when used as middleware.

## Commands and text

```js
bot.cmd('ping', (ctx) => ctx.reply('pong'));
bot.cmd(['help', 'support'], (ctx) => ctx.reply('How can I help?'));
bot.start('Welcome!');

bot.hears('status', (ctx) => ctx.reply('You typed status.'));
bot.hears(/hello|hi/i, (ctx) => ctx.reply('Hello!'));
```

A string passed to `hears` is matched exactly, without case sensitivity. Use a regular expression to match a pattern. Text after a command is available in `ctx.match`:

```js
bot.cmd('echo', (ctx) => ctx.reply(`Text: ${ctx.match || '(empty)'}`));
// /echo hello → ctx.match is "hello"
```

## Filter updates

Use `bot.on(filter, handler)` to match an update type or message property:

```js
bot.on('message:photo', (ctx) => ctx.reply('Photo received.'));
bot.on(':text', (ctx) => console.log('Text:', ctx.msg?.text));
bot.on('chat_type:private', (ctx) => console.log('Private chat'));
bot.on('callback_query', (ctx) => ctx.answerCallbackQuery());
```

Filters include update fields such as `message`, `callback_query`, `inline_query`, and `chat_join_request`; message properties such as `:text`, `:photo`, `:document`, and `:caption`; and chat types such as `chat_type:private`, `group`, `supergroup`, or `channel`.

## Button callbacks

`bot.action` matches callback data from an inline keyboard. Answer a callback query so Telegram dismisses the button's loading indicator:

```js
bot.action('premium', async (ctx) => {
  await ctx.answerCallbackQuery('Opening premium plans');
  await ctx.reply('Choose a plan to view.');
});

bot.action(/^item:\d+$/, (ctx) => {
  const itemId = ctx.callback_query.data.split(':')[1];
  return ctx.answerCallbackQuery(`Item ${itemId}`);
});
```

## Middleware

Middleware can run work before and after downstream handlers by calling `next()`:

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`Update handled in ${Date.now() - started} ms`);
});
```

Register shared middleware before the handlers that should pass through it. TeleBibz also provides `filter`, `drop`, `branch`, `route`, `lazy`, `fork`, and `errorBoundary` for composing more complex pipelines.

::: tip A handler stops where it is
If a handler does not call `next()`, the update is not passed to the next matching handler. This helps prevent an update from being handled more than once by accident.
:::
