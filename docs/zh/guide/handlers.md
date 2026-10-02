---
title: 处理器与过滤器
description: 匹配命令、文本、更新类型与回调查询。
---

# 处理器与过滤器

当更新符合条件时，库会调用相应处理器。处理器接收 `ctx`（该更新的 Context）；作为中间件使用时还可以接收 `next`。

## 命令与文本

```js
bot.cmd('ping', (ctx) => ctx.reply('pong'));
bot.cmd(['help', 'support'], (ctx) => ctx.reply('需要什么帮助？'));
bot.start('欢迎！');

bot.hears('status', (ctx) => ctx.reply('你输入了 status。'));
bot.hears(/你好|嗨/i, (ctx) => ctx.reply('你好！'));
```

`hears` 中的字符串按完整文本匹配，且不区分大小写。使用正则表达式可匹配模式。命令后面的文本可在 `ctx.match` 中读取：

```js
bot.cmd('echo', (ctx) => ctx.reply(`内容：${ctx.match || '（空）'}`));
// /echo hello → ctx.match 为 "hello"
```

## 过滤更新

使用 `bot.on(filter, handler)` 匹配更新类型或消息属性：

```js
bot.on('message:photo', (ctx) => ctx.reply('已收到照片。'));
bot.on(':text', (ctx) => console.log('文本：', ctx.msg?.text));
bot.on('chat_type:private', (ctx) => console.log('私聊消息'));
bot.on('callback_query', (ctx) => ctx.answerCallbackQuery());
```

过滤器包括 `message`、`callback_query`、`inline_query`、`chat_join_request` 等更新字段；`:text`、`:photo`、`:document`、`:caption` 等消息属性；以及 `chat_type:private`、`group`、`supergroup` 和 `channel` 等聊天类型。

## 按钮回调

`bot.action` 用于匹配内联键盘的回调数据。请回答回调查询，以便 Telegram 关闭按钮上的加载状态：

```js
bot.action('premium', async (ctx) => {
  await ctx.answerCallbackQuery('正在打开高级方案');
  await ctx.reply('请选择要查看的方案。');
});

bot.action(/^item:\d+$/, (ctx) => {
  const itemId = ctx.callback_query.data.split(':')[1];
  return ctx.answerCallbackQuery(`项目 ${itemId}`);
});
```

## 中间件

中间件可通过调用 `next()` 在后续处理器前后执行逻辑：

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`更新处理耗时 ${Date.now() - started} 毫秒`);
});
```

请在需要经过公共中间件的处理器之前注册中间件。TeleBibz 还提供 `filter`、`drop`、`branch`、`route`、`lazy`、`fork` 和 `errorBoundary`，用于组合更复杂的管线。

::: tip 处理器会在当前位置停止
处理器若不调用 `next()`，更新就不会传给下一个匹配的处理器。这有助于避免同一更新意外触发多个处理器。
:::
