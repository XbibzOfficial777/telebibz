---
title: Bot API 参考
description: 通过快捷方法、callApi 或 raw 调用 Telegram Bot API。
---

# Bot API 参考

每个 `TeleBibz` 实例都通过 `bot.api` 提供 API 客户端；处理器中可使用 `ctx.api`。常见接口提供便捷快捷方法，软件包注册表中的其他方法可通过 `callApi()` 和动态方法代理访问。

## API 快捷方法

```js
await bot.api.getMe();
await bot.api.sendMessage(chatId, '你好');
await bot.api.sendPhoto(chatId, photoInput, { caption: '照片' });
```

常用快捷方法采用更方便的位置参数，并可附加包含 Telegram 其他字段的 payload 对象。Context 快捷方法（如 `ctx.reply()`）会根据当前更新推断目标聊天。详见 [Context](/zh/reference/context)。

## `callApi()` 与 `raw()`

使用 `callApi(method, payload)` 传入方法名和 Bot API payload：

```js
await bot.api.callApi('sendMessage', {
  chat_id: chatId,
  text: '来自 TeleBibz 的问候',
  disable_notification: true,
});
```

`raw(method, payload)` 通过同一 API 客户端和传输配置提供低层方法访问。需要方法名、payload 和结果类型检查时，优先使用 `callApi()`，详见 [TypeScript](/zh/reference/typescript)。

## 访问其他方法的代理

API 客户端会将注册的 Bot API 方法名称公开为可调用方法，包括没有专用快捷方式的方法：

```js
await bot.api.getChat(chatId);
await bot.api.setMyCommands({ commands: [{ command: 'start', description: '开始' }] });
```

请使用准确的 Telegram 方法名和 payload 字段。已注册方法列表详见[生成的方法列表](/zh/reference/methods)。

## 响应与错误

调用成功时 Promise 返回接口结果。调用失败时会抛出 API 错误；若可用，错误中会包含 Telegram 错误说明和响应元数据。`sendMessage` 成功后返回 Telegram `Message`，`getMe` 返回 `User`。

只有 Promise 成功完成后，才能认定请求成功。符合条件的临时错误可使用重试 transformer；无效 payload、权限不足和授权错误需要修正，不能依靠自动重试解决。

## Transformer

使用 `bot.api.config.use(transformer)` 包装出站请求。软件包提供 `autoRetry()` 和 `throttler()` 等辅助工具，用于重试和控制请求节奏。详见[速率限制与错误](/zh/guide/reliability)。

## 文件

上传文件时可使用 `InputFile` 包装本地路径、`Buffer`、`Uint8Array` 或受支持的 Stream。API 客户端会构造 multipart 请求。可通过 `bot.api.getFile(fileId)` 或 `bot.api.downloadFile(fileId, destination)` 下载。详见[文件与会话](/zh/guide/files-sessions)。
