---
title: Custom transports and testing
description: Test handlers with a fake transport, replay updates, and configure API requests.
---

# Custom transports and testing

A custom transport lets tests or specialized deployments intercept API calls. It receives a method name and payload and should return the endpoint result (not the Telegram `{ ok, result }` envelope).

## Test a handler with a fake transport

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const calls = [];
const bot = new TeleBibz('123456:TEST_TOKEN_VALUE', {
  silent: true,
  transport: async (method, payload) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 123456, is_bot: true, first_name: 'Test' };
    if (method === 'sendMessage') return { message_id: 1, chat: { id: payload.chat_id } };
    return true;
  },
});

bot.cmd('start', (ctx) => ctx.reply('Hello'));

await bot.init();
await bot.handleUpdate({
  update_id: 1,
  message: {
    message_id: 10,
    date: 1,
    chat: { id: 42, type: 'private' },
    from: { id: 42, is_bot: false, first_name: 'Test' },
    text: '/start',
  },
});

console.log(calls.find((call) => call.method === 'sendMessage'));
```

Use a non-production token-shaped value in tests. The custom transport prevents real API requests, but fixtures should still avoid real user data. Assert the outgoing method and payload rather than a particular internal call order unless order is part of the behavior being tested.

## Replay fixtures with `handleUpdate()`

`bot.handleUpdate(update)` runs an update through the bot's middleware and handlers without starting long polling. It is useful for deterministic fixtures, integration tests, or a custom validated webhook adapter. It does not authenticate input; verify Telegram's secret header before calling it.

## Built-in transport options

The constructor supports `transport`, `apiRoot`, `proxy`, `timeoutMs`, and additional `headers`. `apiRoot` can target a local Bot API server. To build a transport with those options explicitly, use `createTransport`:

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
const transport = createTransport(token, {
  apiRoot: 'https://api.telegram.org',
  proxy: process.env.HTTPS_PROXY,
  timeoutMs: 30_000,
  headers: { 'x-client-name': 'telebibz-app' },
});
const bot = new TeleBibz(token, { transport });
```

`createTransport(token, options)` can also use a local Bot API server through `apiRoot`. Keep test and production credentials separate, and do not log authorization headers.

## Proxy

Set `proxy` to an HTTP(S) proxy address when required by the deployment network. Verify that the runtime can resolve the proxy and that outbound TLS is configured correctly. Use a platform secret for any proxy credentials.

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');
const token = process.env.BOT_TOKEN;
const bot = new TeleBibz(token, {
  transport: createTransport(token, {
    proxy: process.env.HTTPS_PROXY,
  }),
});
```

Do not hard-code proxy credentials. Store them in the hosting platform's secret manager and restrict access.

## Transformers as API middleware

API transformers wrap outgoing Bot API requests. They can add retries, throttling, logging, or request modifications:

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());
bot.api.config.use(throttler());
```

Keep transformers focused and preserve Telegram's response/error semantics. See [rate limits and errors](/en/guide/reliability).
