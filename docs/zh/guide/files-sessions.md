---
title: 文件与会话
description: 发送和下载 Telegram 媒体，并存储用户或聊天状态。
---

# 文件与会话

## 发送新文件

`File` 和 `InputFile` 支持本地路径、`Buffer`、`Uint8Array`，以及支持 async iteration 的 Node.js Stream。上传附件会通过 `attach://` 引用添加到 multipart 请求。

```js
const fs = require('node:fs');
const { InputFile } = require('@xbibzlibrary/telebibz');

bot.cmd('document', (ctx) =>
  ctx.replyWithDocument(new InputFile('./report.pdf')),
);

bot.cmd('note', (ctx) => {
  const data = Buffer.from('来自 TeleBibz 的问候');
  return ctx.replyWithDocument(new InputFile(data, 'note.txt'));
});

bot.cmd('recording', (ctx) => {
  const source = fs.createReadStream('./recording.ogg');
  return ctx.replyWithVoice(new InputFile(source, 'recording.ogg'));
});
```

当前传输层会先将 Stream 收集到 Buffer 再构造 multipart 请求，因此较大的上传可能占用较多内存。请检查文件格式和大小，不要直接使用未经验证的用户路径。

## 媒体组

`InputMediaBuilder` 用于创建媒体组条目。媒体可使用已存储的 Telegram `file_id`，也可使用文件上传：

```js
const { InputFile, InputMediaBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
  InputMediaBuilder.photo(new InputFile('./photo-1.jpg'), { caption: '第一张照片' }),
  InputMediaBuilder.photo(new InputFile('./photo-2.jpg')),
]));
```

可用 Builder 包括 `photo`、`video`、`audio`、`document`、`animation` 和 `livePhoto`。Telegram 会限制媒体数量与类型组合；生产使用前请查看 [sendMediaGroup Bot API 文档](https://core.telegram.org/bots/api#sendmediagroup)。

## 下载用户发送的文件

```js
bot.on('message:photo', async (ctx) => {
  const file = await ctx.getFile(); // 选择最大的照片尺寸
  await ctx.downloadFile('./uploads/photo.jpg');
  await ctx.reply(`已下载 Telegram 文件 ${file.file_id}。`);
});
```

`ctx.getFile()` 会从当前消息 Context 选择文件（最大尺寸照片、document、audio、video、voice、video note、sticker 或 animation）。`ctx.downloadFile(destination)` 会获取文件信息并写入磁盘。请预先创建目标目录、处理失败情况，并对路径进行清理，不要信任用户提供的文件名。

在处理器之外，可调用 `bot.api.getFile(fileId)` 或 `bot.api.downloadFile(fileId, destination)`。Telegram 文件 ID 可重复用于发送文件，无需再次上传。

## 会话

会话中间件会自动安装到 `TeleBibz` 管线中。`ctx.session` 是当前更新对应的状态对象。默认键由 `from.id` 和 `chat.id` 组成；若没有发送者，库会使用聊天 ID。默认存储为内存 `Map`。

```js
const bot = new TeleBibz(process.env.BOT_TOKEN, {
  session: { initial: () => ({ visits: 0 }) },
});

bot.on(':text', async (ctx) => {
  ctx.session.visits++;
  await ctx.reply(`本会话中的第 ${ctx.session.visits} 条文本消息。`);
});
```

::: warning 默认存储不会持久化
Node.js 进程停止后 Map 中的数据会丢失，也不会在多个 worker 间共享。需要跨重启或多实例共享状态时，请使用数据库或 Redis 等持久化适配器。
:::

## 存储适配器

`session` 接受 `initial()`、`getKey(ctx)` 和 `storage`。自定义适配器需提供 `read(key)`、`write(key, value)` 和 `delete(key)`，这些方法可为异步函数。`storage` 也可以是 `Map`。

```js
const sessionStorage = {
  async read(key) {
    const json = await database.get(`telebibz:session:${key}`);
    return json ? JSON.parse(json) : undefined;
  },
  async write(key, value) {
    await database.set(`telebibz:session:${key}`, JSON.stringify(value));
  },
  async delete(key) {
    await database.del(`telebibz:session:${key}`);
  },
};

const bot = new TeleBibz(process.env.BOT_TOKEN, {
  session: {
    initial: () => ({ visits: 0 }),
    getKey: (ctx) => ctx.from && ctx.chat ? `${ctx.from.id}:${ctx.chat.id}` : undefined,
    storage: sessionStorage,
  },
});
```

TeleBibz 会在处理器运行前读取状态，并在中间件结束后写回，包括异步处理器。请根据应用的数据模型选择会话键。Wizard 也会在会话中保存当前步骤，详见 [Wizard](/zh/guide/wizard)。
