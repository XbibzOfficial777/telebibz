---
title: Context and keyboards
description: Use Context shortcuts, inline keyboards, reply keyboards, and callback queries.
---

# Context and keyboards

Each handler receives a `ctx` (Context), a wrapper around the Telegram update being processed. It simplifies access to the sender, chat, and message, and exposes `ctx.api` for other Bot API methods.

## Context properties

| Property | Value |
| --- | --- |
| `ctx.update` | Raw Telegram update. |
| `ctx.api` | API client for Bot API calls. |
| `ctx.me` | Bot information after `init()` or `launch()` succeeds. |
| `ctx.msg`, `ctx.chat`, `ctx.from` | Related message, chat, and user when present in the update. |
| `ctx.chatId`, `ctx.msgId` | Relevant chat and message IDs when available. |
| `ctx.match` | Command arguments matched by `bot.cmd()`. |
| `ctx.session` | Per-key session state. |
| `ctx.guestQueryId` | Guest query ID when present in the update. |

Properties vary by update type. Inline queries, callbacks, channel posts, Business updates, and administrative events have different shapes. Check optional fields before using them.

## Reply, edit, and delete

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`Hello ${ctx.from?.first_name ?? 'there'}`);
});

bot.cmd('format', async (ctx) => {
  const sent = await ctx.replyWithHTML('<b>Bold</b> and <i>italic</i>');
  await ctx.api.editMessageText(ctx.chatId, sent.message_id, 'The bot message was edited.');
});
```

Common Context shortcuts include:

| Group | Methods |
| --- | --- |
| Text and rich messages | `reply`, `replyWithHTML`, `replyWithMarkdown`, `replyWithRichMessage`, `editMessageText`, `editRichMessage` |
| Images and media | `replyWithPhoto`, `replyWithVideo`, `replyWithAudio`, `replyWithDocument`, `replyWithAnimation`, `replyWithVoice`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup` |
| Chat content | `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, `replyWithDice`, `replyWithInvoice`, `replyWithChatAction` |
| Edit and delete | `editMessageText`, `editMessageCaption`, `editMessageMedia`, `editMessageReplyMarkup`, `deleteMessage`, `deleteMessages` |
| Callback and inline | `answerCallbackQuery`, `answerInlineQuery`, `answerGuestQuery` |
| Files | `getFile()`, `downloadFile(destination)` |
| Moderation and sharing | `react`, `forwardMessage(destination)`, `copyMessage(destination)`, `banChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `pinChatMessage`, `unpinChatMessage` |
| Ephemeral and drafts | `replyEphemeral`, `sendMessageDraft`, `sendRichMessageDraft`, `editEphemeralRichMessage`, `deleteEphemeralMessage` |

Edit shortcuts choose a target based on the current update. To edit a bot message you just sent, keep the result of `ctx.reply(...)` and call `ctx.api.editMessageText(chatId, messageId, text, extra)`.

## Inline keyboards

The `btn`, `url`, and `kb` helpers build an `inline_keyboard` as an array of rows:

```js
const { btn, url, kb } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) => ctx.reply('Choose an action:', kb([
  [btn('Premium plan', 'plan:premium', 'primary'), btn('Free plan', 'plan:free', 'success')],
  [url('Open documentation', 'https://github.com/XbibzOfficial777/telebibz')],
])));

bot.action('plan:premium', async (ctx) => {
  await ctx.answerCallbackQuery('Opening the premium plan');
  await ctx.reply('Choose a plan to view.');
});
```

Helper signatures:

- `btn(text, callbackData, style?, iconId?)` creates a callback button.
- `url(text, link, style?, iconId?)` creates a URL button.
- `webApp(text, link, iconId?)` opens a Telegram Web App where supported.
- `copy(text, value, iconId?)` asks Telegram to copy text to the clipboard.
- `kb(rows)` returns `{ reply_markup: { inline_keyboard: rows } }`.
- `kb.markup(rows)` returns the `inline_keyboard` object without the `reply_markup` wrapper.
- `kb.confirm(yesData, noData, labelYes?, labelNo?)` builds a confirmation row.

Styles can be `primary`, `success`, or `danger`. Style and custom-icon rendering depend on the Telegram client and bot eligibility; older clients may show uncolored buttons. Custom icons use a Telegram custom emoji ID the bot is allowed to use.

## Fluent builder

```js
const { InlineKeyboard } = require('@xbibzlibrary/telebibz');

const keyboard = new InlineKeyboard()
  .text('Yes, continue', 'confirm:yes', 'success')
  .text('Not now', 'confirm:no', 'danger')
  .row()
  .url('Open portal', 'https://example.com')
  .build();

bot.cmd('confirm', (ctx) => ctx.reply('Continue?', keyboard));
```

The builder supports `.text()`, `.url()`, `.webApp()`, `.copy()`, `.row()`, and `.build()`.

## Reply keyboards

A reply keyboard replaces the user's input keyboard; it is not an inline keyboard attached to a message. Use `Keyboard`:

```js
const { Keyboard } = require('@xbibzlibrary/telebibz');
const replyKeyboard = new Keyboard()
  .text('Help')
  .text('Status')
  .row()
  .requestContact('Share contact')
  .resized()
  .oneTime()
  .build();

bot.cmd('choices', (ctx) => ctx.reply('Choose one:', replyKeyboard));
```

Reply-keyboard methods include `.text()`, `.requestContact()`, `.requestLocation()`, `.row()`, `.resized(value)`, `.oneTime(value)`, and `.build()`.

## Callback queries

A button with `callback_data` creates a `callback_query`. Answer it so the Telegram client dismisses its loading indicator:

```js
bot.action(/^item:\d+$/, async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'Selection received' });
  await ctx.editMessageText('The message has been updated.');
});
```

`ctx.answerCallbackQuery('text')` is a shortcut for inline-button callbacks. The object form can include Bot API options such as `show_alert` or `url`. Callback data is not proof of authorization; validate user permissions on the server.

## Business and other updates

Context provides common access for message, edited-message, channel, callback, inline, guest, and Business updates. For Business replies, the library forwards `business_connection_id` when present. Call modern methods without a Context shortcut through `ctx.api` or `bot.api`; see the [Bot API method list](/en/reference/methods).
