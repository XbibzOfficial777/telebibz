---
title: Sending messages
description: "Every way to send text, formatting, media, albums, buttons, edits and deletions with TeleBibz."
---

# Sending messages

This page is a complete recipe for sending: plain text, HTML/Markdown formatting, single media, albums, inline and reply keyboards, editable messages, answering callbacks, and answering widget queries.

New here? Start with [Getting started](/en/guide/getting-started). For structured content (headings, tables, collapsible blocks) use [Rich Messages](/en/guide/rich-messages).

## 1. Plain text

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Hi! Ready when you are.'));
bot.cmd('ping', (ctx) => ctx.reply('pong 🏓'));
bot.launch();
```

`ctx.reply(text, extra)` uses the `chat_id` of the update being processed, so you never pass a chat id. Everything in `extra` is forwarded to `sendMessage`, which means **every Bot API field is available**:

```js
bot.cmd('promo', (ctx) => ctx.reply('50% off today!', {
  disable_notification: true,
  protect_content: true,
  link_preview_options: { is_disabled: true },
  reply_parameters: { message_id: ctx.msgId },
}));
```

### Sending without `ctx`

From cron jobs, queues, or non-Telegram webhooks, use `bot.api`:

```js
await bot.api.sendMessage(123456789, 'Daily report ready', { parse_mode: 'HTML' });
```

Three equivalent calling styles:

```js
await bot.api.sendMessage(chatId, 'hi');                                  // positional shortcut
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'hi' });    // fully typed
await bot.api.raw('sendMessage', { chat_id: chatId, text: 'hi' });        // alias of callApi
```

## 2. Formatting (HTML & Markdown)

```js
ctx.replyWithHTML('<b>Name:</b> <code>Budi</code>');
ctx.replyWithMarkdown('*Name:* `Budi`');   // MarkdownV2 — escape special characters
```

Always escape user input; a broken tag makes Telegram reject the message with `can't parse entities`:

```js
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
bot.on(':text', (ctx) => ctx.replyWithHTML(`You wrote: <i>${esc(ctx.msg.text)}</i>`));
```

Or send plain text without `parse_mode` — the safest default.

## 3. Media

```js
const { File } = require('@xbibzlibrary/telebibz');

bot.cmd('photo', (ctx) => ctx.replyWithPhoto('https://example.com/photo.jpg', { caption: 'From URL' }));
bot.cmd('doc',   (ctx) => ctx.replyWithDocument(new File('./report.pdf'), { caption: 'Q4 report' }));
bot.cmd('buf',   (ctx) => ctx.replyWithPhoto(Buffer.from(pngBytes), { caption: 'From a buffer' }));
bot.cmd('voice', (ctx) => ctx.replyWithVoice(new File('./hello.ogg')));
bot.cmd('video', (ctx) => ctx.replyWithVideo('existing_file_id', { supports_streaming: true }));
```

Available `ctx.replyWith*`: `Photo`, `Video`, `Audio`, `Document`, `Animation`, `Voice`, `VideoNote`, `Sticker`, `MediaGroup`, `Location`, `Venue`, `Contact`, `Poll`, `Dice`, `Invoice`, `ChatAction`, plus `LivePhoto` and `RichMessage`.

| Source | Example | Notes |
|---|---|---|
| `file_id` | `'AgACAgUAAxkB...'` | Fastest, no re-upload |
| Public URL | `'https://…'` | Telegram downloads it, max 20 MB |
| Upload | `new File(pathOrBufferOrStream)` | Bot upload limit 50 MB (2 GB with a Local Bot API Server) |

### Albums

```js
const { InputMediaBuilder: M } = require('@xbibzlibrary/telebibz');

ctx.replyWithMediaGroup([
  M.photo('file_id_1', { caption: 'First' }),
  M.photo(new File('./2.jpg')),
  M.video(new File('./clip.mp4'), { supports_streaming: true }),
]);
```

### Downloading user files

```js
bot.on('message:document', async (ctx) => {
  const path = await ctx.downloadFile('./download.pdf', { maxBytes: 20 * 1024 * 1024 });
  console.log('saved to', path);
});
```

Both `ctx.downloadFile()` and `bot.api.downloadFile()` respect `apiRoot` (Local Bot API Server), proxies, timeouts, and `maxBytes`. Pass a Writable stream as the destination to stream it yourself.

## 4. Buttons and keyboards

```js
const { btn, url, webApp, InlineKeyboard, Keyboard, kb } = require('@xbibzlibrary/telebibz');

ctx.reply('Choose:', { reply_markup: kb.markup([[btn('Yes', 'yes'), btn('No', 'no')]]) });

// colours (Bot API 9.4) and custom emoji icons
ctx.reply('Confirm', { reply_markup: kb.markup([[
  btn('Accept', 'ok', 'success'),
  btn('Cancel', 'no', 'danger'),
]]) });

const ikb = new InlineKeyboard()
  .text('Profile', 'profile')
  .text('Help', 'help')
  .row()
  .url('Website', 'https://example.com')
  .disabled('Coming soon')
  .build();

ctx.reply('Pick a menu item:', new Keyboard().text('📦 Products').text('💳 Pay').row().text('☎️ Contact').build());
```

Handling presses:

```js
bot.action('ok', (ctx) => ctx.answerCallbackQuery('Thanks!'));
bot.action(/^item:(\d+)$/, async (ctx) => {
  const id = ctx.callback_query.data.split(':')[1];
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(`You picked item ${id}`);
});
```

::: tip Always answer callback queries
`answerCallbackQuery()` stops the loading spinner. Without it the user sees a spinner until it times out (about a minute).
:::

## 5. Edit, delete, react

```js
bot.cmd('edit', async (ctx) => {
  const sent = await ctx.reply('Version 1');
  await bot.api.editMessageText(ctx.chatId, sent.message_id, 'Version 2');
  await bot.api.setMessageReaction(ctx.chatId, sent.message_id, [{ type: 'emoji', emoji: '🔥' }]);
});

bot.action('delete', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.answerCallbackQuery('Deleted');
});
```

Inside callback handlers, `ctx.editMessageText`, `ctx.editMessageCaption`, `ctx.editMessageMedia`, `ctx.editMessageReplyMarkup` and `ctx.react()` automatically target the button's message.

`message is not modified` is normal when the content is unchanged — ignore it or guard it:

```js
try { await ctx.editMessageText('same content'); } catch (e) { if (!/not modified/.test(e.description)) throw e; }
```

## 6. Ephemeral messages in groups

Bot API 10.x supports *ephemeral* messages: visible only to one user inside a group, and editable/deletable.

```js
bot.action('hint', (ctx) => ctx.replyEphemeralToCallback('Only you can see this ✨'));
bot.cmd('secret', (ctx) => ctx.replyEphemeral('Private instructions', ctx.from.id));

await ctx.editEphemeralMessageText(ctx.from.id, ephemeralMessageId, 'New text');
await ctx.deleteEphemeralMessage(ctx.from.id, ephemeralMessageId);
```

The bot must be a group admin with the right permissions; otherwise Telegram answers `BOT_NOT_ADMIN`.

## 7. Streaming drafts

A draft is a 30-second preview. Stream it while text grows, then finalise with a real message:

```js
bot.cmd('ai', async (ctx) => {
  const draftId = Date.now() % 2147483647;
  let text = '';
  for (const chunk of ['Hello', ',', ' this', ' answer', ' grows.']) {
    text += chunk;
    await ctx.sendMessageDraft(draftId, text);
  }
  await ctx.reply(text);
});
```

For formatted output use `sendRichMessageDraft(draftId, richMessage, extra)` then `ctx.replyWithRichMessage(...)`.

## 8. Limits and common pitfalls

| Item | Limit / behaviour |
|---|---|
| Text length | 4,096 UTF-8 characters (rich message 32,768) |
| Media caption | 1,024 characters |
| Cloud bot upload / download | 50 MB upload, 20 MB download |
| Album | 2–10 items |
| `callback_data` | ≤ 64 bytes |
| Rate limits | ~30 messages/second per bot, ~20 messages/minute per group; honour `retry_after` |
| Bots cannot DM first | the user must `/start` or press a button |
| Group → supergroup | `migrate_to_chat_id` changes; store the new chat id |

Automatic rate-limit handling:

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');
bot.api.config.use(autoRetry({ maxRetry: 3 }));
bot.api.config.use(throttler({ perSecond: 28 }));
```

See also: [Rate limits and errors](/en/guide/reliability), [Context and keyboards](/en/guide/context-keyboards), [Files and sessions](/en/guide/files-sessions), [Rich Messages](/en/guide/rich-messages), [Widgets (Bot API 10.4)](/en/guide/widgets).
