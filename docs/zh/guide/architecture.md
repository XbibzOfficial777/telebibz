---
title: 更新处理流程与架构
description: 了解轮询、Context 创建、中间件顺序与更新处理。
---

# 更新处理流程与架构

TeleBibz 接收 Telegram 更新，将每个更新包装为 `Context`，再传入已注册的中间件和处理器。处理器可通过 `ctx.api` 调用 Bot API 方法。

## 流程概览

```text
Telegram Bot API
      │ getUpdates / Webhook
      ▼
  TeleBibz 传输层
      │ Update 对象
      ▼
 会话与中间件
      │ Context
      ▼
匹配的处理器 ───► ctx.api ───► Telegram Bot API
```

机器人实例管理 API 客户端、配置、会话中间件、处理管线和轮询生命周期。除非部署方案协调了更新处理，否则每个机器人令牌只运行一个轮询进程。

## 长轮询生命周期

`bot.launch()` 会初始化机器人、开始请求更新并处理返回结果。库通过 `bot.runPromise` 跟踪轮询 Promise；关闭服务时调用 `bot.stop()`，然后等待该 Promise 结束。

```js
await bot.launch();
```

`launch()` 在启动后返回，并不表示轮询已经永久结束。长期运行的服务需保持进程存活，并配置适当的关闭处理。

## 并发处理

默认情况下，单个 TeleBibz 实例最多可同时处理 256 个更新。轮询器不会等待前一个处理器完成后才派发下一个更新，同时会施加背压并限制排队任务数量。

```js
const bot = new TeleBibz(process.env.BOT_TOKEN, {
  maxConcurrentUpdates: 256, // 默认 256；请使用正整数
});
```

相同会话键的更新仍按顺序处理，以防 `ctx.session` 的读、修改、写入相互覆盖。默认会话键由发送者和聊天组成；自定义 `session.getKey` 也会决定排序键。不同会话键可并行处理。此限制同时适用于长轮询和 Webhook 对 `handleUpdate()` 的调用。

并发最适合等待数据库、HTTP 请求或其他 I/O 的异步处理器。CPU 密集型 JavaScript 回调仍共享同一个进程事件循环。此选项不会提高 Telegram 出站 API 的速率限制；需要时请使用 API 重试或限速。调用 `bot.stop()` 后，轮询器停止接收新任务，并等待已接收的更新完成。

## 中间件顺序

中间件和处理器按注册顺序运行。中间件可以检查或扩展 `ctx`；不调用 `next()` 即可停止处理；调用 `await next()` 则继续执行后续管线。`next()` 返回后，会继续执行它后面的代码。

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`处理耗时 ${Date.now() - started} 毫秒`);
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));
```

请先注册公共中间件，再注册需要经过它们的处理器。详见[中间件与 Composer](/zh/guide/middleware)。

## Context 是单次更新的快照

每个处理器都会收到一个对应单次更新的 `ctx`。`ctx.from`、`ctx.chat` 和 `ctx.msg` 等字段取决于更新类型，可能不存在。使用前应检查可选字段；回调查询或频道更新的结构与私聊文本消息不同。

Context 提供原始 `ctx.update`、API 客户端 `ctx.api`，以及回复、文件、键盘和回调的常用快捷方法。详见 [Context 参考](/zh/reference/context)。

## 长轮询还是 Webhook

长轮询适合单个持续运行的进程。Webhook 会将更新推送到公开的 HTTPS 地址，适合托管平台或无服务器环境。同一令牌不要同时运行轮询和 Webhook。详见[轮询与 Webhook](/zh/guide/deployment)。

## 测试与集成中的 `handleUpdate()`

`bot.handleUpdate(update)` 可在不启动轮询的情况下，将指定更新传入相同的中间件管线。可用于重放测试样本或接入自定义传输。它不会验证更新是否来自 Telegram；请在 HTTP 边界验证请求密钥。
