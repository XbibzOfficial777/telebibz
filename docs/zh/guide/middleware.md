---
title: 中间件与 Composer
description: 使用过滤器、分支、路由、延迟加载和 fork 组合有序中间件。
---

# 中间件与 Composer

TeleBibz 使用 Composer 风格的中间件模型。中间件接收 `(ctx, next)`，可读取或扩展 Context，并通过调用 `next()` 将更新传给后续管线。

## 顺序与 `next()`

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log('更新耗时（毫秒）：', Date.now() - started);
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));
```

公共中间件按注册顺序执行。`await next()` 之前的代码先运行；后续处理器完成后，再运行其后的代码。不调用 `next()` 时，管线会在当前位置停止。

```js
bot.use(async (ctx, next) => {
  if (!ctx.from) return; // 停止处理没有发送者的更新
  return next();
});
```

不要重复调用 `next()`。Composer 会检测重复调用并抛出错误。

## 条件中间件与子路由

`TeleBibz.filter(predicate, ...middleware)` 可向机器人添加受限子管线。若需在子管线中注册处理器，可创建一个 `Composer`：

```js
const { Composer } = require('@xbibzlibrary/telebibz');

const privateRoutes = new Composer();
privateRoutes
  .filter((ctx) => ctx.chat?.type === 'private')
  .command('profile', (ctx) => ctx.reply(`ID：${ctx.from?.id}`));
bot.use(privateRoutes.middleware());
```

`Composer.filter` 返回子 Composer，因此上例的命令只在条件成立时运行。单个中间件可直接使用 `bot.filter(predicate, handler)`。当条件为真时，`drop` 会跳过子管线；`branch` 则从两个分支中选择一个：

```js
bot.branch(
  (ctx) => ctx.chat?.type === 'private',
  (ctx) => ctx.reply('私聊'),
  (ctx) => ctx.reply('非私聊'),
);
```

## 根据 Context 值路由

`route(router, mapping)` 会计算一个值，并将更新传给映射中对应的中间件：

```js
bot.route((ctx) => ctx.chat?.type ?? 'unknown', {
  private: (ctx) => ctx.reply('私聊路由'),
  group: (ctx) => ctx.reply('群组路由'),
  supergroup: (ctx) => ctx.reply('超级群组路由'),
});
```

未映射的值会继续传给下一个处理器。需要选择单一分支时使用 `route`；需要匹配更新字段或消息属性时使用 `on()`。

## 延迟中间件

`lazy(factory)` 会根据当前 Context 创建或选择中间件。Factory 可返回一个中间件或数组：

```js
bot.lazy((ctx) => {
  if (ctx.from?.is_bot) return botMiddleware;
  return userMiddleware;
});
```

可用于区分用户、机器人或租户策略，而无需重新创建整个机器人实例。

## Fork 后台任务

`fork(...middleware)` 会在不阻塞 `next()` 的情况下启动中间件。仅将它用于不需要成为主响应流程一部分的任务。Fork 产生的错误会由库报告。

```js
bot.fork(async (ctx) => {
  await saveAuditRecord(ctx.update);
});

bot.cmd('start', (ctx) => ctx.reply('机器人已就绪。'));
```

不要在主处理器完成前依赖 fork 的结果。需要重试、持久化或向用户确认的重要任务，应使用应用队列或 worker。

## 错误边界

`TeleBibz` 的应用处理器默认由内置错误边界保护。可在 Constructor 中设置自定义报告函数：

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('处理器失败：', err);
    if (ctx?.chatId) console.error('聊天：', ctx.chatId);
  },
});
```

独立的 `Composer` 可通过 `Composer.errorBoundary(handler, ...middleware)` 保护子管线。错误处理器接收包含原始 `error` 和 `ctx` 的 `BotError`：

```js
const { Composer } = require('@xbibzlibrary/telebibz');
const guarded = new Composer();
guarded.errorBoundary((err, next) => {
  console.error('子管线错误：', err.error);
  return next();
}, riskyMiddleware);
bot.use(guarded.middleware());
```

`cmd`、`hears`、`on`、`action` 和 `inlineQuery` 等匹配器详见[处理器与过滤器](/zh/guide/handlers)；更新管线与顺序详见[架构指南](/zh/guide/architecture)。
