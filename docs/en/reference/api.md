---
title: Bot API reference
description: Call Telegram Bot API methods through shortcuts, callApi, or raw.
---

# Bot API reference

Each `TeleBibz` instance exposes an API client at `bot.api`; handlers can use `ctx.api`. Common methods have convenience shortcuts, while every method in the package registry is available through `callApi()` and the dynamic method proxy.

## API shortcuts

```js
await bot.api.getMe();
await bot.api.sendMessage(chatId, 'Hello');
await bot.api.sendPhoto(chatId, photoInput, { caption: 'Photo' });
```

Shortcuts use ergonomic positional arguments for common methods and accept an optional payload object for additional Telegram fields. Context shortcuts such as `ctx.reply()` infer the relevant chat and message from the current update. See [Context](/en/reference/context).

## `callApi()` and `raw()`

Use `callApi(method, payload)` for the method name and Bot API payload:

```js
await bot.api.callApi('sendMessage', {
  chat_id: chatId,
  text: 'Hello from TeleBibz',
  disable_notification: true,
});
```

`raw(method, payload)` provides low-level method access using the same API client and transport configuration. Prefer `callApi()` when you want the typed method/payload/result declarations; see [TypeScript](/en/reference/typescript).

## Proxy for other method names

The API client exposes registered Bot API method names as callable methods, including methods without a dedicated convenience shortcut:

```js
await bot.api.getChat(chatId);
await bot.api.setMyCommands({ commands: [{ command: 'start', description: 'Start' }] });
```

Use the exact Telegram method name and payload fields. The [generated method list](/en/reference/methods) links all 185 registered names to their argument tuple, payload, result type, and Telegram's field reference.

## Responses and errors

Successful calls resolve to the endpoint result. Failed calls reject with an API error containing Telegram's description and response metadata when available. A successful `sendMessage` result is a Telegram `Message`; `getMe` returns a `User`.

Do not assume a request succeeded until its promise resolves. Handle transient errors with retry transformers where safe; invalid payloads, missing permissions, and authorization failures need a correction rather than an automatic retry.

```js
try {
  await ctx.api.getChat(ctx.chatId);
} catch (err) {
  console.error(err?.error_code, err?.description || err?.message);
}
```

## Transformers

Use `bot.api.config.use(transformer)` to wrap outgoing calls. The package exports helpers such as `autoRetry()` and `throttler()` for retry and request pacing. See [rate limits and errors](/en/guide/reliability).

```js
bot.api.config.use(async (prev, method, payload) => {
  const started = Date.now();
  try {
    const result = await prev(method, payload);
    console.log(method, 'ok', Date.now() - started);
    return result;
  } catch (err) {
    console.error(method, 'failed', err);
    throw err;
  }
});
```

## Files

File uploads can use `InputFile` with a local path, `Buffer`, `Uint8Array`, or supported stream. The API client builds multipart requests for file payloads. Download using `bot.api.getFile(fileId)` or `bot.api.downloadFile(fileId, destination)`. See [Files and sessions](/en/guide/files-sessions).
