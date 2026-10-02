---
title: Inline 模式与群发
description: 回复 Inline 查询，并向授权接收者列表发送消息。
---

# Inline 模式与群发

## Inline 模式

通过 @BotFather 为机器人启用 Inline 模式，然后处理 `inline_query` 更新。必须在 Telegram 要求的时间内使用 `ctx.answerInlineQuery(...)` 回复。

```js
bot.inlineQuery(/.*/, async (ctx) => {
  const query = ctx.inline_query.query;
  await ctx.answerInlineQuery([
    {
      type: 'article',
      id: 'result-1',
      title: query ? `搜索：${query}` : '示例结果',
      input_message_content: {
        message_text: query ? `你搜索了：${query}` : '来自 TeleBibz 的问候',
      },
    },
  ], { cache_time: 10 });
});
```

同一响应中的结果 ID 应唯一，且结果类型必须受 Telegram 支持。`ctx.answerInlineQuery(results, options)` 是对 Telegram `answerInlineQuery` 方法的封装。

### `iq` Builder

导出的 `iq` helper 可创建常用 Inline 结果对象。请根据当前安装版本的类型声明检查支持的签名，然后将结果数组传给 `ctx.answerInlineQuery`。需要完全控制时，可直接传入普通 Bot API 结果对象。

## 群发

`bot.broadcast(recipients, send, options?)` 可向给定聊天 ID 列表发送消息，并配置并发数与延迟。仅向已主动订阅且有权接收消息的用户发送内容。

```js
bot.cmd('broadcast', async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return;

  const result = await bot.broadcast(
    optedInChatIds,
    (chatId) => bot.api.sendMessage(chatId, '服务公告'),
    { concurrency: 3, delayMs: 100 },
  );

  await ctx.reply(`成功：${result.sent}；失败：${result.failed}`);
});
```

`send` 回调负责调用 Bot API。请处理每位接收者的失败情况、避免记录个人数据，并遵守 Telegram 速率限制。大型群发应持久化接收者列表并使用队列，不要只依赖单个内存进程。详见[速率限制与错误](/zh/guide/reliability)。
