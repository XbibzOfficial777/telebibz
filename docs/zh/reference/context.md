---
title: Context 参考
description: 处理器可用的 Context 属性与快捷方法。
---

# Context 参考

TeleBibz 会为每个更新创建一个 Context，并将其传给匹配的中间件与处理器。不同更新类型拥有不同字段；请检查更新类型或使用可选链。

## 主要属性

| 属性 | 说明 |
| --- | --- |
| `ctx.update` | Telegram 原始 Update。 |
| `ctx.api` | Bot API 客户端。 |
| `ctx.me` | 通过 `init()` 或 `launch()` 加载的机器人身份信息。 |
| `ctx.from` | 更新关联的用户（若存在）。 |
| `ctx.chat` | 更新关联的聊天（若存在）。 |
| `ctx.msg` | 更新关联的消息（若存在）。 |
| `ctx.chatId` | 相关聊天 ID（若可用）。 |
| `ctx.msgId` | 相关消息 ID（若可用）。 |
| `ctx.match` | `bot.cmd()` 匹配的命令后文本。 |
| `ctx.session` | 当前配置键对应的会话数据。 |
| `ctx.guestQueryId` | 更新中存在时的 guest query ID。 |

Telegram 更新结构不同，因此 `ctx.from`、`ctx.chat` 和 `ctx.msg` 都可能不存在。频道帖子、回调查询、Inline query 和私聊消息包含不同字段。

## 消息

常用回复快捷方法包括 `reply(text, extra?)`、`replyWithHTML(text, extra?)` 和 `replyWithMarkdown(text, extra?)`。Context 方法会尽可能根据当前更新推断目标聊天：

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`收到：${ctx.msg?.text ?? ''}`);
});
```

其他消息助手包括 `replyWithPhoto`、`replyWithVideo`、`replyWithAudio`、`replyWithDocument`、`replyWithAnimation`、`replyWithVoice`、`replyWithVideoNote`、`replyWithSticker`、`replyWithMediaGroup`、`replyWithLocation`、`replyWithVenue`、`replyWithContact`、`replyWithPoll` 和 `replyWithDice`。

## 编辑、删除、转发与复制

Context 提供 `editMessageText`、`editMessageCaption`、`editMessageMedia`、`editMessageReplyMarkup`、`deleteMessage`、`deleteMessages`、`forwardMessage(destination)` 和 `copyMessage(destination)`。在当前更新允许时，编辑快捷方法会定位当前消息。若要编辑 `ctx.reply()` 返回的消息，请使用其 `message_id` 调用 `ctx.api`：

```js
const sent = await ctx.reply('原始消息');
await ctx.api.editMessageText(ctx.chatId, sent.message_id, '已更新');
```

仍需遵守 Telegram 的权限和消息时效规则。

## 回调与 Inline 查询

使用 `answerCallbackQuery(textOrOptions?)` 关闭内联按钮上的加载提示。`answerInlineQuery(results, options?)` 用于回复 Inline query；软件包支持的 guest query 更新可使用 `answerGuestQuery(results, options?)`。详见[处理器与过滤器](/zh/guide/handlers)和 [Inline 模式](/zh/guide/inline-broadcast)。

## 文件

`getFile()` 会从当前消息中选择文件，`downloadFile(destination)` 将其下载。要在当前更新之外操作，请使用 `ctx.api.getFile(fileId)` 或 `ctx.api.downloadFile(fileId, destination)`。详见[文件与会话](/zh/guide/files-sessions)。

## 聊天管理

Context 为 `banChatMember`、`restrictChatMember`、`promoteChatMember`、`leaveChat`、`pinChatMessage`、`unpinChatMessage` 和 `react` 等常用操作提供快捷方法。调用仍受 Telegram 机器人权限和接口规则约束。其他方法可通过 `ctx.api` 调用，详见[方法列表](/zh/reference/methods)。
