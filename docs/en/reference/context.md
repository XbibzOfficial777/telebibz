---
title: Context reference
description: Context properties and convenience methods available to handlers.
---

# Context reference

TeleBibz creates a Context for each update and passes it to matched middleware and handlers. Update-specific fields may be absent; inspect the update type or use optional chaining.

## Main properties

| Property | Description |
| --- | --- |
| `ctx.update` | Original Telegram Update. |
| `ctx.api` | API client for Bot API calls. |
| `ctx.me` | Bot identity loaded by `init()` or `launch()`. |
| `ctx.from` | User associated with the update, when present. |
| `ctx.chat` | Chat associated with the update, when present. |
| `ctx.msg` | Message associated with the update, when present. |
| `ctx.chatId` | Relevant chat ID, when available. |
| `ctx.msgId` | Relevant message ID, when available. |
| `ctx.match` | Text captured after a command matched by `bot.cmd()`. |
| `ctx.session` | Session data for the configured key. |
| `ctx.guestQueryId` | Guest query identifier, when present. |

`ctx.from`, `ctx.chat`, and `ctx.msg` are optional because Telegram updates include different shapes. A channel post, callback query, inline query, and private message do not share the same fields.

## Messages

Common reply shortcuts include `reply(text, extra?)`, `replyWithHTML(text, extra?)`, and `replyWithMarkdown(text, extra?)`. Context methods infer the target chat from the current update where possible:

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`Received: ${ctx.msg?.text ?? ''}`);
});
```

Other message helpers include `replyWithPhoto`, `replyWithVideo`, `replyWithAudio`, `replyWithDocument`, `replyWithAnimation`, `replyWithVoice`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup`, `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, and `replyWithDice`.

## Edit, delete, forward, and copy

Context exposes `editMessageText`, `editMessageCaption`, `editMessageMedia`, `editMessageReplyMarkup`, `deleteMessage`, `deleteMessages`, `forwardMessage(destination)`, and `copyMessage(destination)`. Edit shortcuts target the current update's message when possible. For a message returned by `ctx.reply()`, use `ctx.api` with its `message_id`:

```js
const sent = await ctx.reply('Original');
await ctx.api.editMessageText(ctx.chatId, sent.message_id, 'Updated');
```

Telegram permissions and message-age rules still apply.

## Callback and inline queries

Use `answerCallbackQuery(textOrOptions?)` to dismiss an inline button's loading state. `answerInlineQuery(results, options?)` responds to an inline query; `answerGuestQuery(results, options?)` is available for guest-query updates supported by the package. See [handlers and filters](/en/guide/handlers) and [inline mode](/en/guide/inline-broadcast).

## Files

`getFile()` selects a file from the current message, and `downloadFile(destination)` downloads it. To work outside the current update, call `ctx.api.getFile(fileId)` or `ctx.api.downloadFile(fileId, destination)`. See [Files and sessions](/en/guide/files-sessions).

## Chat administration

Context has shortcuts for common operations such as `banChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `pinChatMessage`, `unpinChatMessage`, and `react`. These calls remain subject to Telegram bot permissions and endpoint rules. Use `ctx.api` for other methods and consult the [method list](/en/reference/methods).
