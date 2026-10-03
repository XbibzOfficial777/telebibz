---
title: Examples
description: Runnable TeleBibz bot examples from the repository.
---

# Examples

The TeleBibz repository includes JavaScript examples in [`examples/`](https://github.com/XbibzOfficial777/telebibz/tree/main/examples). Clone the repository, install dependencies, and set `BOT_TOKEN` before running them.

| File | What it covers |
| --- | --- |
| [`01-quickstart.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/01-quickstart.js) | First bot, commands, and text handlers. |
| [`02-menu-tombol.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/02-menu-tombol.js) | Inline keyboards and callbacks. |
| [`03-wizard.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/03-wizard.js) | Wizard validation, choices, and edit mode. |
| [`04-broadcast.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/04-broadcast.js) | Broadcast to chat IDs and admin access checks. |
| [`05-kirim-file.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/05-kirim-file.js) | Send files and photos. |
| [`06-menu.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/06-menu.js) | Menus with submenus. |
| [`07-inline-query.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/07-inline-query.js) | Inline mode. |
| [`08-rich-message.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/08-rich-message.js) | Rich Messages, callbacks, and drafts. |

The repository examples use `require('..')` because they run from inside the repository. In a separate bot project, use `require('@xbibzlibrary/telebibz')` instead.
## Service bot with throttling and graceful shutdown

This example combines an admin check, per-user update limit, API throttling, `retry_after` handling, and polling shutdown. Supply `ADMIN_ID` through a secret environment variable; never put the bot token in source.

```js
const { TeleBibz, autoRetry, throttler, limiter, btn, kb } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set.');
const adminId = process.env.ADMIN_ID;

const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  onError: (err, ctx) => {
    console.error({
      name: err?.name,
      code: err?.error_code,
      updateId: ctx?.update?.update_id,
    }, 'Update processing failed');
  },
});

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({ windowMs: 2_000, limit: 3 }));

bot.cmd('start', (ctx) => ctx.reply(
  'Choose an action:', kb([[btn('Check status', 'status')]]),
));
bot.action('status', async (ctx) => {
  await ctx.answerCallbackQuery();
  return ctx.reply('The bot is receiving updates.');
});
bot.cmd('admin', (ctx) => {
  if (!adminId || String(ctx.from?.id) !== adminId) return;
  return ctx.reply('Admin access verified.');
});

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });

bot.launch({ noSignalHandlers: true }).catch((err) => {
  console.error({ name: err?.name }, 'Bot startup failed');
  process.exitCode = 1;
});
```

::: warning Process-local limits
The sample `limiter()` and `throttler()` apply to one process. Multiple workers need a shared limiter/queue. `ADMIN_ID` only illustrates command authorization; a real handler should also check the chat, permissions, and action impact. Do not log the token or full updates.
:::
