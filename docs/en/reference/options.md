---
title: Bot options
description: Constructor options, lifecycle methods, sessions, and transport settings.
---

# Bot options

## Constructor

**Signature:** `new TeleBibz(token, options?)`

| Option | Type (summary) | Default or notes |
| --- | --- | --- |
| `allowedUpdates` | `string[]` | Update types requested during polling; the default includes common types and Business updates supported by this release. |
| `onError` | `(err, ctx?) => unknown` | Built-in reporter if omitted. Context may be absent for errors outside handlers. |
| `silent` | `boolean` | `false`; hides boot banner and logs. When enabled, install your own shutdown handler because the built-in signal handler is also omitted. |
| `dropPending` | `boolean` | `false`; can be overridden in `launch()` options. |
| `session` | `SessionOptions` | Defaults to an in-memory `Map` and an empty object as initial state. |
| `transport` | `(method, payload?) => Promise<unknown>` | Custom transport for tests or integrations; return the endpoint result, not `{ ok, result }`. |
| `apiRoot` | `string` | Bot API root; can point to a local Bot API server. |
| `proxy` | `string` | HTTP(S) proxy address when needed. |
| `timeoutMs` | `number` | Transport request timeout in milliseconds. |
| `headers` | `Record<string, string>` | Additional transport headers. |

`SessionOptions` accepts `initial()`, `getKey(ctx)`, and `storage`. Storage can be a `Map` or an adapter with `read(key)`, `write(key, value)`, and `delete(key)` methods, which may be asynchronous. See [Files and sessions](/en/guide/files-sessions#sessions).

## Lifecycle

| API | Purpose |
| --- | --- |
| `await bot.init()` | Calls `getMe()` and loads the bot identity. `launch()` also initializes the client. |
| `await bot.launch(options?)` | Starts long polling and resolves after startup. |
| `await bot.handleUpdate(update)` | Runs one update through the pipeline without starting a poller. |
| `bot.webhook(options?)` | Creates a Node.js HTTP handler; accepts `secretToken` and `maxBodyBytes`. |
| `bot.stop()` | Requests that the long-poll loop stop. |
| `await bot.runPromise` | Waits for the polling loop to finish during controlled shutdown. |

Polling options include `dropPending`, `conflictDelay` (milliseconds; default 5,000), and `noSignalHandlers`. Set `allowedUpdates` in the constructor. If `silent: true` or signal handlers are disabled, handle `SIGINT` and `SIGTERM` yourself, call `bot.stop()`, and await `bot.runPromise`.

Do not run polling and a webhook for the same bot token at the same time. See [Polling and webhooks](/en/guide/deployment).

## Registration methods

A bot instance provides `use`, `cmd`, `start`, `hears`, `on`, `action`, `inlineQuery`, `wizard`, and `broadcast`. See [Middleware and Composer](/en/guide/middleware) and [Handlers and filters](/en/guide/handlers).
