---
title: FAQ and troubleshooting
description: Fix common issues when running a TeleBibz bot.
---

# FAQ and troubleshooting

## The bot does not respond

1. Check that the Node.js process is running without errors.
2. Confirm `BOT_TOKEN` is set and was issued by @BotFather.
3. In a private chat, open the bot and press **Start** before sending a message.
4. Make sure the update matches a handler, such as `bot.start(...)` or `bot.cmd('start', ...)` for `/start`.
5. For a webhook, check the public HTTPS URL, secret, route, and JSON body handling.

## 409 Conflict while polling

Another process is likely calling `getUpdates` with the same bot token. Stop the older or duplicate poller and run only one polling instance. TeleBibz retries polling conflicts, but multiple pollers are not a recommended setup.

## 429 Too Many Requests

Use `bot.api.config.use(autoRetry())` to honor Telegram's `retry_after` value. Add `throttler()` to pace API calls, and stay within Telegram's limits for the relevant method and chat.

## File upload failed

Wrap bytes, a path, or a stream in `InputFile` and check that the file format is accepted by the chosen method. Also check read permissions, payload size, and Telegram's limits.

## How do I stop polling cleanly?

Call `bot.stop()`, then await `bot.runPromise` during shutdown. Handle process signals in production and make sure there is one owner for polling.

## Where can I report a bug?

Open a [GitHub issue](https://github.com/XbibzOfficial777/telebibz/issues) with the TeleBibz and Node.js versions, the error message, and a minimal reproduction. Never include your bot token or other secrets.
