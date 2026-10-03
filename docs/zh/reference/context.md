---
title: Context 参考
description: Context 属性、处理器快捷方法、文件、编辑、查询和聊天管理操作。
---

# Context 参考

TeleBibz 会为每个更新创建一个 `Context`，并将其传给匹配的中间件和处理器。Telegram 更新可能是消息、回调查询、Inline query、频道帖子、Business 事件等不同结构；使用字段前请先检查是否存在。

## 主要属性

| 属性 | 说明 |
| --- | --- |
| `ctx.update` | 原始 Telegram Update。 |
| `ctx.api` | 调用 Bot API 方法的客户端。 |
| `ctx.me` | 初始化完成后的机器人身份信息。 |
| `ctx.msg` | 更新关联的消息（若存在）。 |
| `ctx.chat`, `ctx.from` | 关联的聊天和发送者（若存在）。 |
| `ctx.chatId`, `ctx.msgId` | 相关聊天 ID 与消息 ID。 |
| `ctx.match` | `bot.cmd()` 匹配的命令后文本。 |
| `ctx.session` | 当前配置的 session key 对应状态。 |
| `ctx.guestQueryId` | 更新包含时的 guest query ID。 |

## 消息

Context 快捷方法会尽可能根据当前更新推断目标聊天：

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`收到：${ctx.msg?.text ?? ''}`);
});
```

| 用途 | 方法 |
| --- | --- |
| 回复 | `reply(text, extra?)`、`replyWithHTML(text, extra?)`、`replyWithMarkdown(text, extra?)` |
| Rich 内容 | `replyWithRichMessage(content, extra?)`、`editRichMessage(content, extra?)` |
| 媒体 | `replyWithPhoto`、`replyWithVideo`、`replyWithAudio`、`replyWithDocument`、`replyWithAnimation`、`replyWithVoice`、`replyWithVideoNote`、`replyWithSticker`、`replyWithMediaGroup` |
| 位置 | `replyWithLocation(latitude, longitude, extra?)`、`replyWithVenue(...)`、`replyWithContact(phone, firstName, extra?)` |
| 交互 | `replyWithPoll(question, options, extra?)`、`replyWithDice(emoji?, extra?)`、`replyWithInvoice(...)`、`replyWithChatAction(action?, extra?)` |
| Live 与草稿 | `replyWithLivePhoto(video, photo, extra?)`、`sendMessageDraft(id, text, extra?)`、`sendRichMessageDraft(id, content, extra?)` |
| Ephemeral | `replyEphemeral(text, receiverUserId, extra?)`、`editEphemeralMessageText(...)`、`editEphemeralRichMessage(...)`、`editEphemeralMessageMedia(...)`、`deleteEphemeralMessage(...)` |

媒体快捷方法接收媒体/文件值和可选的 `extra` 对象。需要直接控制 Bot API payload 时，请使用 `ctx.api`。

## 编辑、删除、转发与复制

- `editMessageText(text, extra?)` 和 `editRichMessage(content, extra?)` 会在更新提供合适目标时编辑当前消息。
- `editMessageCaption(extra?)`、`editMessageMedia(media, extra?)` 和 `editMessageReplyMarkup(extra?)` 可编辑消息标题、媒体或键盘。
- `deleteMessage(chatId?, messageId?)` 和 `deleteMessages(messageIds)` 用于删除消息。
- `forwardMessage(destination, sourceChat?, messageId?, extra?)` 和 `copyMessage(destination, sourceChat?, messageId?, extra?)` 用于转发或复制消息。
- `react(reaction?, extra?)` 可在上下文支持时对当前更新中的消息添加 reaction。

快捷方法会尽可能根据当前更新推断目标。对于其他消息或 inline message，请显式传入 ID 并检查目标类型。若要编辑 `ctx.reply()` 返回的消息，可使用其 `message_id`：

```js
const sent = await ctx.reply('原始消息');
await ctx.api.editMessageText(ctx.chatId, sent.message_id, '已更新');
```

仍需遵守 Telegram 的权限和消息时效规则。

## 回调与 Inline 查询

`answerCallbackQuery(extraOrText?)` 用于回复 callback query 并关闭客户端的加载提示。`answerInlineQuery(results, extra?)` 用于回复 Inline query。若更新包含匹配的 ID，可使用 `answerGuestQuery(result)` 回复 guest query。详见[处理器与过滤器](/zh/guide/handlers)和 [Inline 模式与群发](/zh/guide/inline-broadcast)。

## 文件

`getFile()` 会从当前消息中选择文件（例如最大尺寸的照片或 document）并获取 Telegram 元数据；`downloadFile(destination)` 会将同一文件下载到磁盘。如果当前消息不包含文件，这些方法会抛出错误。要在当前更新之外操作，请使用 `ctx.api.getFile(fileId)` 或 `ctx.api.downloadFile(fileId, destination)`。详见[文件与会话](/zh/guide/files-sessions)。

## 聊天与管理

Context 提供 `getChatMember`、`getAuthor`、`banChatMember`、`unbanChatMember`、`restrictChatMember`、`promoteChatMember`、`leaveChat`、`setChatTitle`、`setChatDescription`、`pinChatMessage` 和 `unpinChatMessage` 等快捷方法。管理操作仍受机器人管理员权限、Telegram 权限和接口规则约束。

在 Business 更新中，Context 回复 helper 会转发可用的 `business_connection_id`。键盘快捷方法详见 [Context 与键盘](/zh/guide/context-keyboards)；完整接口索引请参阅 [Bot API 方法列表](/zh/reference/methods)。
