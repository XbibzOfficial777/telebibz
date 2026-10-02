---
title: Inline mode and broadcast
description: Answer inline queries and send controlled messages to a recipient list.
---

# Inline mode and broadcast

## Inline mode

Enable inline mode for the bot with @BotFather, then handle `inline_query` updates. Results must be sent with `ctx.answerInlineQuery(...)` within Telegram's time limit.

```js
bot.inlineQuery(/.*/, async (ctx) => {
  const query = ctx.inline_query.query;
  await ctx.answerInlineQuery([
    {
      type: 'article',
      id: 'result-1',
      title: query ? `Search for ${query}` : 'Example result',
      input_message_content: {
        message_text: query ? `You searched for: ${query}` : 'Hello from TeleBibz',
      },
    },
  ], { cache_time: 10 });
});
```

Use unique result IDs within a response and return a result type supported by Telegram. `ctx.answerInlineQuery(results, options)` wraps Telegram's `answerInlineQuery` method.

### The `iq` builder

The exported `iq` helper creates common inline-result objects. Check the installed package declarations for the supported signature, then pass the results to `ctx.answerInlineQuery`. For full control, pass ordinary Bot API result objects directly.

## Broadcast

`bot.broadcast(recipients, send, options?)` sends to a supplied list of chat IDs with configurable concurrency and delay. Only message people who opted in and are allowed to receive the content.

```js
bot.cmd('broadcast', async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return;

  const result = await bot.broadcast(
    optedInChatIds,
    (chatId) => bot.api.sendMessage(chatId, 'Service announcement'),
    { concurrency: 3, delayMs: 100 },
  );

  await ctx.reply(`Sent: ${result.sent}; failed: ${result.failed}`);
});
```

The `send` callback is responsible for making the Bot API request. Handle per-recipient failures, avoid logging personal data, and respect Telegram rate limits. For large campaigns, persist recipients and use a queue rather than relying on one in-memory process. See [rate limits and errors](/en/guide/reliability).
