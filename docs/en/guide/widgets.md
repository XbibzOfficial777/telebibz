---
title: HTML widgets (Bot API 10.4)
description: "Send HTML widgets, receive widget queries and edit their data with TeleBibz."
---

# HTML widgets (Bot API 10.4)

Bot API 10.4 (9 November 2026) introduced **HTML widgets**: 1–32,768 bytes of HTML rendered by Telegram inside the message bubble. Widgets can send queries to the bot and can be re-shared.

::: warning Platform limits
In production, widgets can only be sent to **private chats** and are automatically *protected content* (not forwardable). Widget messages cannot be copied with `copyMessage`/`copyMessages`. These are Telegram limits, not TeleBibz limits.
:::

## 1. Sending a widget

```js
bot.cmd('widget', (ctx) => ctx.replyWithWidget(`
  <div style="font:600 16px system-ui">Service status</div>
  <div style="opacity:.7">All systems normal · ${new Date().toISOString()}</div>
`, {
  width: 320,             // optional; clamped to 200..bubble width
  height: 120,            // optional; clamped to 50..600
  caption: 'Updated automatically',
  allow_queries: true,    // required for the widget to query the bot
}));

await bot.api.sendWidget({ chat_id: 123456789, html: '<b>Hi</b>', allow_queries: true });
```

Size rules: HTML 1–32,768 bytes, but **max 4,096 bytes after zlib compression at maximum level**.

## 2. Re-shareable widgets

```js
const msg = await ctx.replyWithWidget('<b>Business card</b>', { is_shared: true, allow_queries: true });

bot.on('widget_query', (ctx) => { if (ctx.widget_query.widget_id) save(ctx.widget_query.widget_id); });

await bot.api.sendSharedWidget({ chat_id: 987654321, widget_id: 'wid-123', caption: 'Same as before' });
```

## 3. Receiving widget queries

Queries arrive as the `widget_query` update (widget in a normal message) or `shared_widget_query` (widget inside a forwarded message). TeleBibz already requests both in its default `allowed_updates`.

```js
bot.on('widget_query', async (ctx) => {
  console.log(ctx.widgetQueryId, ctx.widget_query.data, ctx.widget_query.type.type);
  await ctx.answerWidgetQuery('received');   // must answer within 15 seconds
});

bot.on('shared_widget_query:data', (ctx) => ctx.answerWidgetQuery('ok'));
```

| `type.type` | Extra fields |
|---|---|
| `data` | `wallet_card?` — sender's TON wallet card, when sent with the query |
| `sign_data` | `wallet`, `sign_data` |
| `sent_transaction` | `wallet`, `msg_hash` |

Telegram rate limit: at most **5 queries per 5 seconds** per user across all of a bot's widgets.

## 4. Editing widget data without resending

```js
bot.action('refresh', async (ctx) => {
  await ctx.editWidgetData({ public_data: String(Date.now()) });
  await ctx.answerCallbackQuery('Updated');
});

await bot.api.editMessageWidgetData({ chat_id: 123, message_id: 45, chat_data: '{"state":"new"}' });

// shared widgets can be edited at most once per second
await bot.api.editSharedWidgetData({ widget_id: 'wid-123', public_data: 'v2', cache_time: 30 });
```

| Field | Scope | Notes |
|---|---|---|
| `public_data` | Every message with the same shared widget | At most 1 change/second |
| `chat_data` | That message only | Good for per-chat state |

## 5. Widgets in inline mode, guest queries and Web Apps

`InputWidgetMessageContent` and `InputSharedWidgetMessageContent` are valid `InputMessageContent`:

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery('time', (ctx) => ctx.answerInlineQuery([
  iq.article('time-1', 'Current time', {
    input_message_content: {
      html: `<b>${new Date().toLocaleTimeString('en-GB')}</b>`,
      width: 240,
      allow_queries: true,
    },
  }),
]));
```

## 6. Types and helpers

| Need | TypeScript surface |
|---|---|
| Widget payload | `Widget` on `Message.widget` and `ExternalReplyInfo.widget` |
| Queries | `WidgetQuery`, `SharedWidgetQuery`, `WidgetQueryType` (+ `WidgetQueryTypeData`, `WidgetQueryTypeSignData`, `WidgetQueryTypeSentTransaction`, `WidgetQueryWallet`) |
| Send | `ApiClient.sendWidget`, `sendSharedWidget`, `Context.replyWithWidget`, `replyWithSharedWidget` |
| Answer | `Context.answerWidgetQuery(data?)`, `ApiClient.answerWidgetQuery` |
| Edit data | `Context.editWidgetData(extra)`, `api.editMessageWidgetData`, `api.editSharedWidgetData` |

## 7. TON wallets and share themes (bonus)

```js
bot.on(':ton_wallet_transfer', (ctx) => {
  const t = ctx.msg.ton_wallet_transfer;
  console.log('TON transfer', t.amount, 'from', t.peer_address);
});

const chat = await bot.api.getChat(ctx.chatId);
if (chat.ton_wallet_card) console.log('wallet', chat.ton_wallet_card.address, chat.ton_wallet_card.amount);

const backdrops = await bot.api.getChatShareThemeBackdrops();
```

Related types: `TonWalletCard`, `TonWalletCardSticker`, `TonNft`, `TonNftAttribute`, `TonWalletTransfer`, `RichTextTonAddress`, `PaidMessagesWaived`, `ChatShareTheme*`, `EmojiType*`.

See also: [Sending messages](/en/guide/sending-messages), [Rich Messages](/en/guide/rich-messages), [Method list](/en/reference/methods).
