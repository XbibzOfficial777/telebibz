---
title: HTML Widget（Bot API 10.4）
description: "使用 TeleBibz 发送 HTML widget、接收 widget 查询并修改其数据。"
---

# HTML Widget（Bot API 10.4）

Bot API 10.4（2026 年 11 月 9 日）引入 **HTML widget**：1–32,768 字节的 HTML，由 Telegram 直接渲染在消息气泡内，并可向机器人发送查询、可被再次分享。

::: warning 平台限制
在生产环境中，widget 只能发送到**私聊**，并自动成为 *protected content*（无法转发、无法用 `copyMessage` 复制）。
:::

## 1. 发送 widget

```js
bot.cmd('widget', (ctx) => ctx.replyWithWidget(`
  <div style="font:600 16px system-ui">服务状态</div>
  <div style="opacity:.7">全部系统正常 · ${new Date().toISOString()}</div>
`, { width: 320, height: 120, caption: '自动更新', allow_queries: true }));

await bot.api.sendWidget({ chat_id: 123456789, html: '<b>你好</b>', allow_queries: true });
```

HTML 长度 1–32,768 字节，但 **zlib 最高压缩后不得超过 4,096 字节**。

## 2. 可分享 widget

```js
await ctx.replyWithWidget('<b>名片</b>', { is_shared: true, allow_queries: true });
bot.on('widget_query', (ctx) => { if (ctx.widget_query.widget_id) save(ctx.widget_query.widget_id); });
await bot.api.sendSharedWidget({ chat_id: 987654321, widget_id: 'wid-123' });
```

## 3. 接收 widget 查询

```js
bot.on('widget_query', async (ctx) => {
  await ctx.answerWidgetQuery('收到');        // 必须在 15 秒内回答
});
bot.on('shared_widget_query:data', (ctx) => ctx.answerWidgetQuery('ok'));
```

| `type.type` | 附加字段 |
|---|---|
| `data` | `wallet_card?`（TON 钱包卡片） |
| `sign_data` | `wallet`、`sign_data` |
| `sent_transaction` | `wallet`、`msg_hash` |

Telegram 限制：每个用户对所有 widget 最多 5 次查询 / 5 秒。

## 4. 修改数据而不重发

```js
await ctx.editWidgetData({ public_data: String(Date.now()) });
await bot.api.editMessageWidgetData({ chat_id: 123, message_id: 45, chat_data: '{"state":"new"}' });
await bot.api.editSharedWidgetData({ widget_id: 'wid-123', public_data: 'v2', cache_time: 30 }); // 每秒最多 1 次
```

| 字段 | 范围 |
|---|---|
| `public_data` | 同一 shared widget 的所有消息 |
| `chat_data` | 仅该条消息 |

## 5. 在内联模式中使用

```js
const { iq } = require('@xbibzlibrary/telebibz');
bot.inlineQuery('time', (ctx) => ctx.answerInlineQuery([
  iq.article('t1', '当前时间', { input_message_content: {
    html: `<b>${new Date().toLocaleTimeString('zh-CN')}</b>`, width: 240, allow_queries: true,
  } }),
]));
```

类型：`InputWidgetMessageContent`、`InputSharedWidgetMessageContent`。

## 6. 类型与辅助方法

| 需求 | 类型/方法 |
|---|---|
| 内容 | `Message.widget`、`ExternalReplyInfo.widget` |
| 查询 | `WidgetQuery`、`SharedWidgetQuery`、`WidgetQueryType` |
| 发送 | `api.sendWidget`、`api.sendSharedWidget`、`ctx.replyWithWidget` |
| 回答 | `ctx.answerWidgetQuery(data?)` |
| 改数据 | `ctx.editWidgetData`、`api.editMessageWidgetData`、`api.editSharedWidgetData` |

## 7. TON 钱包与分享主题

```js
bot.on(':ton_wallet_transfer', (ctx) => console.log(ctx.msg.ton_wallet_transfer.amount));
const chat = await bot.api.getChat(ctx.chatId);
if (chat.ton_wallet_card) console.log(chat.ton_wallet_card.address);
const backdrops = await bot.api.getChatShareThemeBackdrops();
```

另见：[发送消息](/zh/guide/sending-messages)、[Rich Messages](/zh/guide/rich-messages)、[方法列表](/zh/reference/methods)。
