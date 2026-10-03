---
title: Inline mode and broadcast
description: Build inline results and send paced, personalized broadcasts with the actual TeleBibz API.
---

# Inline mode and broadcast

## Inline mode

Enable Inline Mode for the bot through @BotFather before testing. A user can then call the bot from a chat with `@your_bot query`; Telegram delivers an `inline_query` update. Register a handler with `bot.inlineQuery(trigger, handler)`.

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery('*', async (ctx) => {
  const query = ctx.inline_query.query?.trim() || '';
  await ctx.answerInlineQuery([
    iq.article('echo', 'Send this text', {
      message_text: query || 'Type a query after the bot name.',
    }),
  ], { cache_time: 0, is_personal: true });
});
```

The `'*'` trigger matches every inline query. A regular string is matched case-insensitively as a substring; a `RegExp` is matched as a pattern. `matchInlineQuery(trigger)` is the same predicate for `bot.filter` or `bot.on` when combining it with other conditions.

### The `iq` builder

| Helper | Result |
| --- | --- |
| `iq.article(id, title, extra?)` | Plain-text article with `input_message_content`. |
| `iq.richArticle(id, title, richMessage, extra?)` | Article containing a Rich Message. |
| `iq.photo(id, photoUrl, thumbnailUrl?, extra?)` | Photo from a URL. |
| `iq.gif(id, gifUrl, thumbnailUrl?, extra?)` | GIF from a URL. |
| `iq.video(id, url, thumbnailUrl, title, extra?)` | MP4 video. |
| `iq.audio(id, url, title, extra?)` | Audio. |
| `iq.location(id, latitude, longitude, title, extra?)` | Location. |
| `iq.sticker(id, fileId, extra?)` | Sticker by Telegram file ID. |

Result IDs must be unique within one inline response and comply with Telegram's format and size limits. Answer each query before Telegram's deadline; choose `cache_time` and `is_personal` to match the privacy and personalization of the result.

## Broadcast

`bot.broadcast(chatIds, message, options)` sends `sendMessage` requests sequentially. `message` can be a string, a `sendMessage` payload object (for example, `{ text, parse_mode }`), or a function `(chatId) => payload`—including an async function—to personalize each message. The result contains `terkirim` (sent count), `gagal` (failed count), and `errors` entries with `chatId` and the error message.

```js
const result = await bot.broadcast(
  optedInChatIds,
  (chatId) => ({ text: `There is an update for account ${chatId}.` }),
  { delay: 50 },
);

console.log(`Sent: ${result.terkirim}; failed: ${result.gagal}`);
```

The default delay is 35 ms between recipients. Increase it to lower request throughput, and add a retry/throttler transformer when appropriate. Broadcast does not manage recipients or consent: store recipient data under an appropriate privacy policy, message only people who expect it, and handle users who block the bot.

Bots generally cannot start a private conversation. A user must open the bot and press **Start** first. For large campaigns, use a durable queue, limit parallel workers, persist each recipient's result, and provide an opt-out flow appropriate for the product and applicable rules.
