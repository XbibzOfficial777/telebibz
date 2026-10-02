---
title: Files and sessions
description: Send and download Telegram media, then store per-user or per-chat state.
---

# Files and sessions

## Send a new file

`File` and `InputFile` accept a local path, `Buffer`, `Uint8Array`, or a Node.js stream that supports async iteration. Uploads are added to the multipart request using `attach://` references.

```js
const fs = require('node:fs');
const { InputFile } = require('@xbibzlibrary/telebibz');

bot.cmd('document', (ctx) =>
  ctx.replyWithDocument(new InputFile('./report.pdf')),
);

bot.cmd('note', (ctx) => {
  const data = Buffer.from('Hello from TeleBibz');
  return ctx.replyWithDocument(new InputFile(data, 'note.txt'));
});

bot.cmd('recording', (ctx) => {
  const source = fs.createReadStream('./recording.ogg');
  return ctx.replyWithVoice(new InputFile(source, 'recording.ogg'));
});
```

The current transport collects streams into a Buffer before building the multipart request, so large uploads can use significant memory. Check file formats and sizes before uploading, and never use an unvalidated user-supplied path.

## Media groups

`InputMediaBuilder` creates media-group items. Media can be an existing Telegram `file_id` or a file upload:

```js
const { InputFile, InputMediaBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
  InputMediaBuilder.photo(new InputFile('./photo-1.jpg'), { caption: 'First photo' }),
  InputMediaBuilder.photo(new InputFile('./photo-2.jpg')),
]));
```

Builders include `photo`, `video`, `audio`, `document`, `animation`, and `livePhoto`. Telegram controls the number of items and valid media combinations; check the [sendMediaGroup Bot API documentation](https://core.telegram.org/bots/api#sendmediagroup) before using albums in production.

## Download a file sent by a user

```js
bot.on('message:photo', async (ctx) => {
  const file = await ctx.getFile(); // selects the largest photo size
  await ctx.downloadFile('./uploads/photo.jpg');
  await ctx.reply(`Downloaded Telegram file ${file.file_id}.`);
});
```

`ctx.getFile()` selects a file from the current message Context (largest photo, document, audio, video, voice, video note, sticker, or animation). `ctx.downloadFile(destination)` retrieves metadata and writes the file. Create the destination directory first, handle failures, and sanitize paths rather than trusting a user-provided filename.

Outside a handler, use `bot.api.getFile(fileId)` or `bot.api.downloadFile(fileId, destination)`. A Telegram file ID can be reused to send the same file without uploading it again.

## Sessions

Session middleware is installed automatically in the `TeleBibz` pipeline. `ctx.session` is an object holding state for the current update. The default key combines `from.id` and `chat.id`; when the sender is missing, the library uses the chat ID. The default storage is an in-memory `Map`.

```js
const bot = new TeleBibz(process.env.BOT_TOKEN, {
  session: { initial: () => ({ visits: 0 }) },
});

bot.on(':text', async (ctx) => {
  ctx.session.visits++;
  await ctx.reply(`Text message ${ctx.session.visits} in this session.`);
});
```

::: warning Default storage is not persistent
The Map is lost when the Node.js process stops and is not shared between workers. Use a persistent adapter such as a database or Redis when state must survive restarts or be shared across instances.
:::

## Storage adapters

`session` accepts `initial()`, `getKey(ctx)`, and `storage`. A custom adapter provides `read(key)`, `write(key, value)`, and `delete(key)`; each can be asynchronous. `storage` can also be a `Map`.

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

TeleBibz reads session state before handlers and writes it back after the middleware finishes, including asynchronous handlers. Choose a key that matches your app's state model. Wizards also store their current step in the session; see [Wizards](/en/guide/wizard).
