---
title: Inline 模式与群发
description: 构建 Inline 结果，并使用 TeleBibz 实际 API 发送限速、个性化群发消息。
---

# Inline 模式与群发

## Inline 模式

测试前请通过 @BotFather 为机器人启用 Inline Mode。之后，用户可在聊天中输入 `@your_bot query` 调用机器人，Telegram 会发送 `inline_query` 更新。使用 `bot.inlineQuery(trigger, handler)` 注册处理器。

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery('*', async (ctx) => {
  const query = ctx.inline_query.query?.trim() || '';
  await ctx.answerInlineQuery([
    iq.article('echo', '发送这段文字', {
      message_text: query || '请在机器人名称后输入查询内容。',
    }),
  ], { cache_time: 0, is_personal: true });
});
```

`'*'` 会匹配所有 Inline query。普通字符串按不区分大小写的子串匹配；`RegExp` 按正则表达式匹配。若需组合其他条件，可在 `bot.filter` 或 `bot.on` 中使用相同的 `matchInlineQuery(trigger)` predicate。

### `iq` Builder

| Helper | 返回内容 |
| --- | --- |
| `iq.article(id, title, extra?)` | 带 `input_message_content` 的普通文本 article。 |
| `iq.richArticle(id, title, richMessage, extra?)` | 包含 Rich Message 的 article。 |
| `iq.photo(id, photoUrl, thumbnailUrl?, extra?)` | URL 图片。 |
| `iq.gif(id, gifUrl, thumbnailUrl?, extra?)` | URL GIF。 |
| `iq.video(id, url, thumbnailUrl, title, extra?)` | MP4 视频。 |
| `iq.audio(id, url, title, extra?)` | 音频。 |
| `iq.location(id, latitude, longitude, title, extra?)` | 位置。 |
| `iq.sticker(id, fileId, extra?)` | 使用 Telegram file ID 的贴纸。 |

同一 Inline 响应中的结果 ID 必须唯一，并符合 Telegram 的格式和长度限制。请在 Telegram 的时间限制内回复；根据结果的隐私和个性化需求设置 `cache_time` 与 `is_personal`。

## 群发

`bot.broadcast(chatIds, message, options)` 会按顺序调用 `sendMessage`。`message` 可以是字符串、`sendMessage` payload 对象（例如 `{ text, parse_mode }`），也可以是 `(chatId) => payload` 函数（包括 async 函数）以便个性化内容。返回结果包含 `terkirim`（成功数量）、`gagal`（失败数量）以及带有 `chatId` 和错误信息的 `errors` 数组。

```js
const result = await bot.broadcast(
  optedInChatIds,
  (chatId) => ({ text: `账户 ${chatId} 有一条更新。` }),
  { delay: 50 },
);

console.log(`成功：${result.terkirim}；失败：${result.gagal}`);
```

默认发送间隔为每位接收者 35 毫秒。可增大间隔以降低请求速率，并在适当时配置 retry/throttler transformer。Broadcast 不负责管理接收者列表或用户同意：请按照隐私策略存储数据，只向预期接收消息的用户发送，并处理已屏蔽机器人的接收者。

机器人通常不能主动开启私聊。用户需先打开机器人并点击 **Start**。大型群发应使用持久化队列、限制并行 worker、保存每位接收者的结果，并提供符合产品及适用规则的退订流程。
