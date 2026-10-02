---
title: Context 与键盘
description: 使用 Context 快捷方法、内联键盘、回复键盘和回调查询。
---

# Context 与键盘

每个处理器都会收到 `ctx`（Context），它包装了当前处理的 Telegram 更新。Context 简化了对发送者、聊天和消息的访问，并通过 `ctx.api` 提供其他 Bot API 方法。

## Context 属性

| 属性 | 内容 |
| --- | --- |
| `ctx.update` | Telegram 原始 Update。 |
| `ctx.api` | 用于调用 Bot API 的客户端。 |
| `ctx.me` | `init()` 或 `launch()` 成功后加载的机器人信息。 |
| `ctx.msg`、`ctx.chat`、`ctx.from` | 更新中包含的消息、聊天和用户。 |
| `ctx.chatId`、`ctx.msgId` | 可用时对应的聊天和消息 ID。 |
| `ctx.match` | `bot.cmd()` 匹配到的命令参数。 |
| `ctx.session` | 当前会话键对应的状态对象。 |
| `ctx.guestQueryId` | 更新中存在时的 guest query ID。 |

不同更新类型的属性各不相同。Inline query、回调、频道帖子、Business 更新和管理事件结构均可能不同。使用前应检查可选字段。

## 回复、编辑和删除

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`你好，${ctx.from?.first_name ?? '朋友'}`);
});

bot.cmd('format', async (ctx) => {
  const sent = await ctx.replyWithHTML('<b>粗体</b>和<i>斜体</i>');
  await ctx.api.editMessageText(ctx.chatId, sent.message_id, '机器人消息已编辑。');
});
```

常用 Context 快捷方法：

| 类型 | 方法 |
| --- | --- |
| 文本与 Rich Message | `reply`、`replyWithHTML`、`replyWithMarkdown`、`replyWithRichMessage`、`editMessageText`、`editRichMessage` |
| 图片与媒体 | `replyWithPhoto`、`replyWithVideo`、`replyWithAudio`、`replyWithDocument`、`replyWithAnimation`、`replyWithVoice`、`replyWithVideoNote`、`replyWithSticker`、`replyWithMediaGroup` |
| 聊天内容 | `replyWithLocation`、`replyWithVenue`、`replyWithContact`、`replyWithPoll`、`replyWithDice`、`replyWithInvoice`、`replyWithChatAction` |
| 编辑与删除 | `editMessageText`、`editMessageCaption`、`editMessageMedia`、`editMessageReplyMarkup`、`deleteMessage`、`deleteMessages` |
| 回调与 Inline | `answerCallbackQuery`、`answerInlineQuery`、`answerGuestQuery` |
| 文件 | `getFile()`、`downloadFile(destination)` |
| 管理与转发 | `react`、`forwardMessage(destination)`、`copyMessage(destination)`、`banChatMember`、`restrictChatMember`、`promoteChatMember`、`leaveChat`、`pinChatMessage`、`unpinChatMessage` |
| 临时消息与草稿 | `replyEphemeral`、`sendMessageDraft`、`sendRichMessageDraft`、`editEphemeralRichMessage`、`deleteEphemeralMessage` |

编辑快捷方法会根据当前更新推断目标。若要编辑刚刚发送的机器人消息，请保存 `ctx.reply(...)` 的结果，并调用 `ctx.api.editMessageText(chatId, messageId, text, extra)`。

## 内联键盘

`btn`、`url` 和 `kb` helper 可将按钮组织成多行 `inline_keyboard`：

```js
const { btn, url, kb } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) => ctx.reply('请选择操作：', kb([
  [btn('高级方案', 'plan:premium', 'primary'), btn('免费方案', 'plan:free', 'success')],
  [url('打开文档', 'https://github.com/XbibzOfficial777/telebibz')],
])));

bot.action('plan:premium', async (ctx) => {
  await ctx.answerCallbackQuery('正在打开高级方案');
  await ctx.reply('请选择要查看的方案。');
});
```

Helper 签名：

- `btn(text, callbackData, style?, iconId?)` 创建回调按钮。
- `url(text, link, style?, iconId?)` 创建 URL 按钮。
- `webApp(text, link, iconId?)` 在受支持的场景中打开 Telegram Web App。
- `copy(text, value, iconId?)` 请求 Telegram 将文本复制到剪贴板。
- `kb(rows)` 返回 `{ reply_markup: { inline_keyboard: rows } }`。
- `kb.markup(rows)` 返回不含 `reply_markup` 包装的 `inline_keyboard` 对象。
- `kb.confirm(yesData, noData, labelYes?, labelNo?)` 创建确认按钮行。

`style` 可选 `primary`、`success` 或 `danger`。按钮样式与自定义图标取决于 Telegram 客户端版本及机器人资格；旧版客户端可能不显示颜色。自定义图标使用机器人可用的 Telegram custom emoji ID。

## 链式 Builder

```js
const { InlineKeyboard } = require('@xbibzlibrary/telebibz');

const keyboard = new InlineKeyboard()
  .text('继续', 'confirm:yes', 'success')
  .text('暂不继续', 'confirm:no', 'danger')
  .row()
  .url('打开门户', 'https://example.com')
  .build();

bot.cmd('confirm', (ctx) => ctx.reply('是否继续？', keyboard));
```

Builder 支持 `.text()`、`.url()`、`.webApp()`、`.copy()`、`.row()` 和 `.build()`。

## 回复键盘

回复键盘会替换用户的输入键盘，不同于附加在消息上的内联键盘。使用 `Keyboard`：

```js
const { Keyboard } = require('@xbibzlibrary/telebibz');
const replyKeyboard = new Keyboard()
  .text('帮助')
  .text('状态')
  .row()
  .requestContact('分享联系人')
  .resized()
  .oneTime()
  .build();

bot.cmd('choices', (ctx) => ctx.reply('请选择：', replyKeyboard));
```

回复键盘方法包括 `.text()`、`.requestContact()`、`.requestLocation()`、`.row()`、`.resized(value)`、`.oneTime(value)` 和 `.build()`。

## 回调查询

带有 `callback_data` 的按钮会产生 `callback_query`。回答查询可关闭 Telegram 客户端的加载提示：

```js
bot.action(/^item:\d+$/, async (ctx) => {
  await ctx.answerCallbackQuery({ text: '已收到选择' });
  await ctx.editMessageText('消息已更新。');
});
```

`ctx.answerCallbackQuery('文本')` 是内联按钮回调的快捷写法。对象参数可包含 Bot API 支持的 `show_alert` 或 `url` 等选项。回调数据不能证明用户已获授权；请在服务器端验证权限。

## Business 与其他更新

Context 为 message、edited message、channel、callback、inline、guest 和 Business 更新提供常用访问方式。Business 回复中若存在 `business_connection_id`，库会自动传递。没有 Context 快捷方法的新接口可通过 `ctx.api` 或 `bot.api` 调用，详见 [Bot API 方法列表](/zh/reference/methods)。
