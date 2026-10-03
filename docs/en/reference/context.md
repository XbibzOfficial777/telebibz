---
title: Context reference
description: Context properties, handler shortcuts, file access, edits, queries, and chat operations.
---

# Context reference

TeleBibz creates one `Context` for each update and passes it to matched middleware and handlers. Telegram updates can represent messages, callback queries, inline queries, channel posts, Business events, and other shapes, so guard optional fields before using them.

## Main properties

| Property | Description |
| --- | --- |
| `ctx.update` | The original Telegram Update. |
| `ctx.api` | API client for Bot API methods. |
| `ctx.me` | Bot identity after initialization. |
| `ctx.msg` | Message associated with the update, when present. |
| `ctx.chat`, `ctx.from` | Associated chat and sender, when present. |
| `ctx.chatId`, `ctx.msgId` | Relevant chat and message IDs. |
| `ctx.match` | Text captured after a command matched by `bot.cmd()`. |
| `ctx.session` | State for the configured session key. |
| `ctx.guestQueryId` | Guest query ID, when included in the update. |

## Messages

Context shortcuts infer the target chat from the current update where possible:

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`Received: ${ctx.msg?.text ?? ''}`);
});
```

| Purpose | Methods |
| --- | --- |
| Reply | `reply(text, extra?)`, `replyWithHTML(text, extra?)`, `replyWithMarkdown(text, extra?)` |
| Rich content | `replyWithRichMessage(content, extra?)`, `editRichMessage(content, extra?)` |
| Media | `replyWithPhoto`, `replyWithVideo`, `replyWithAudio`, `replyWithDocument`, `replyWithAnimation`, `replyWithVoice`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup` |
| Location | `replyWithLocation(latitude, longitude, extra?)`, `replyWithVenue(...)`, `replyWithContact(phone, firstName, extra?)` |
| Interactions | `replyWithPoll(question, options, extra?)`, `replyWithDice(emoji?, extra?)`, `replyWithInvoice(...)`, `replyWithChatAction(action?, extra?)` |
| Live and drafts | `replyWithLivePhoto(video, photo, extra?)`, `sendMessageDraft(id, text, extra?)`, `sendRichMessageDraft(id, content, extra?)` |
| Ephemeral | `replyEphemeral(text, receiverUserId, extra?)`, `editEphemeralMessageText(...)`, `editEphemeralRichMessage(...)`, `editEphemeralMessageMedia(...)`, `deleteEphemeralMessage(...)` |

Media shortcuts accept a media/file value and an optional `extra` object. Use `ctx.api` when you need direct control of the Bot API payload.

## Edit, delete, forward, and copy

- `editMessageText(text, extra?)` and `editRichMessage(content, extra?)` edit the current message when the update provides a suitable target.
- `editMessageCaption(extra?)`, `editMessageMedia(media, extra?)`, and `editMessageReplyMarkup(extra?)` edit a message's caption, media, or keyboard.
- `deleteMessage(chatId?, messageId?)` and `deleteMessages(messageIds)` delete messages.
- `forwardMessage(destination, sourceChat?, messageId?, extra?)` and `copyMessage(destination, sourceChat?, messageId?, extra?)` forward or copy a message.
- `react(reaction?, extra?)` reacts to the current update's message when supported by the context.

Shortcuts infer the target from the current update when possible. For a different message or an inline message, provide explicit IDs and check the target type. For a message returned by `ctx.reply()`, use its `message_id`:

```js
const sent = await ctx.reply('Original');
await ctx.api.editMessageText(ctx.chatId, sent.message_id, 'Updated');
```

Telegram permissions and message-age rules still apply.

## Callback and inline queries

`answerCallbackQuery(extraOrText?)` answers a callback query and dismisses the client's loading indicator. `answerInlineQuery(results, extra?)` answers an inline query. `answerGuestQuery(result)` answers a guest query when the update contains a matching ID. See [handlers and filters](/en/guide/handlers) and [inline mode and broadcast](/en/guide/inline-broadcast).

## Files

`getFile()` selects a file from the current message, such as the largest photo or a document, and requests its Telegram metadata. `downloadFile(destination)` downloads that file to disk. These methods throw if the current message context contains no file. Outside the current update, use `ctx.api.getFile(fileId)` or `ctx.api.downloadFile(fileId, destination)`. See [Files and sessions](/en/guide/files-sessions).

## Chat and administration

Context provides shortcuts such as `getChatMember`, `getAuthor`, `banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `setChatTitle`, `setChatDescription`, `pinChatMessage`, and `unpinChatMessage`. Administrative methods remain subject to bot admin rights, permissions, and Telegram rules.

For Business updates, Context reply helpers forward the available `business_connection_id`. Keyboard shortcut details are in [Context and keyboards](/en/guide/context-keyboards); see the [Bot API method list](/en/reference/methods) for the complete endpoint index.
