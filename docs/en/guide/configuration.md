---
title: Bot configuration
description: Constructor options, token handling, and runtime settings.
---

# Bot configuration

Pass options as the second argument to `new TeleBibz(token, options)`. The constructor validates the token format and throws a descriptive error when it is invalid.

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN, {
  allowedUpdates: ['message', 'callback_query'],
  maxConcurrentUpdates: 256, // maximum active updates; default 256
  silent: false,
  dropPending: false,
  onError: (err, ctx) => {
    console.error('Update failed:', err);
  },
  session: {
    initial: () => ({ visits: 0 }),
  },
});
```

| Option | Purpose |
| --- | --- |
| `allowedUpdates` | Limits update types requested during long polling. The default includes common types and Business updates supported by this version. |
| `maxConcurrentUpdates` | Maximum active updates per bot instance; default `256`. Updates with the same session key stay ordered, while different keys run concurrently. |
| `onError(err, ctx)` | Custom error reporter. TeleBibz uses its built-in reporter when omitted. `ctx` may be unavailable for polling errors. |
| `silent` | Hides the startup banner and boot logs when `true`. |
| `dropPending` | Drops old updates when polling starts. It can also be passed to `launch({ dropPending: true })`. |
| `session` | Session options such as `initial`, `getKey`, and `storage`; see [sessions](/en/guide/files-sessions#sessions). |
| `transport` | Custom `(method, payload) => Promise<result>` transport for tests or integrations. |
| `apiRoot` | Bot API root URL, for example a local Bot API server. |
| `proxy` | HTTP(S) proxy address for Telegram requests. |
| `timeoutMs` | Transport request timeout in milliseconds. |
| `headers` | Additional transport request headers. |

`maxConcurrentUpdates` must be a positive integer. Polling and webhook calls to `handleUpdate()` share this limit; further updates wait for a slot. Concurrency helps most with asynchronous/I/O-bound handlers—CPU-bound JavaScript still runs on the same event loop. Telegram's outbound API limits are separate from update-processing concurrency; use `autoRetry` or `throttler` when you need retry and send-rate control.

## Environment variables

Read the token from an environment variable. In production, use your hosting platform's secret settings or a secret manager instead of committing it to a file.

```js
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set');
const bot = new TeleBibz(token);
```

The current package uses CommonJS, so JavaScript examples use `require`. TypeScript declarations are included; see the [TypeScript guide](/en/reference/typescript).
