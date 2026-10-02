---
title: File & session
description: Kirim dan unduh media Telegram, lalu simpan state per pengguna/chat.
---

# File & session

## Kirim file baru

`File` dan `InputFile` menerima path lokal, `Buffer`, `Uint8Array`, atau stream Node.js yang mendukung async iteration. Attachment disisipkan ke request multipart menggunakan `attach://`.

```js
const fs = require('node:fs');
const { InputFile } = require('@xbibzlibrary/telebibz');

bot.cmd('dokumen', (ctx) =>
  ctx.replyWithDocument(new InputFile('./laporan.pdf')),
);

bot.cmd('catatan', (ctx) => {
  const data = Buffer.from('Halo dari TeleBibz');
  return ctx.replyWithDocument(new InputFile(data, 'catatan.txt'));
});

bot.cmd('rekaman', (ctx) => {
  const source = fs.createReadStream('./rekaman.ogg');
  return ctx.replyWithVoice(new InputFile(source, 'rekaman.ogg'));
});
```

Transport saat ini mengumpulkan stream menjadi Buffer sebelum membentuk multipart payload; upload besar dapat memakai memori yang signifikan. Pastikan format sesuai method Telegram, ukur file sebelum upload, dan jangan membaca path yang berasal dari input pengguna tanpa validasi.

## Media group

`InputMediaBuilder` membangun object item untuk album/media group. Media dapat berupa `file_id` yang sudah tersimpan atau object file upload:

```js
const { InputFile, InputMediaBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
  InputMediaBuilder.photo(new InputFile('./foto-1.jpg'), { caption: 'Foto pertama' }),
  InputMediaBuilder.photo(new InputFile('./foto-2.jpg')),
]));
```

Builder yang tersedia mencakup `photo`, `video`, `audio`, `document`, `animation`, dan `livePhoto`. Batas jumlah item dan kombinasi tipe ditetapkan Telegram; baca [Telegram Bot API](https://core.telegram.org/bots/api#sendmediagroup) sebelum membuat album produksi.

## Unduh file yang dikirim pengguna

```js
bot.on('message:photo', async (ctx) => {
  const file = await ctx.getFile(); // memilih ukuran foto terbesar
  await ctx.downloadFile('./uploads/foto.jpg');
  await ctx.reply(`File Telegram ${file.file_id} sudah diunduh.`);
});
```

`ctx.getFile()` memilih file dari message Context saat ini (foto terbesar, document, audio, video, voice, video note, sticker, atau animation). `ctx.downloadFile(destination)` mendapatkan metadata dan menulis file ke disk. Buat direktori tujuan lebih dulu, cek return/error, dan jangan gunakan nama file yang dikirim pengguna sebagai path tanpa sanitasi.

Di luar handler, gunakan `bot.api.getFile(fileId)` atau `bot.api.downloadFile(fileId, destination)`. File ID Telegram dapat dipakai kembali untuk mengirim file yang sama tanpa upload ulang.

## Session bawaan

Session middleware otomatis terpasang pada pipeline `TeleBibz`. Nilai `ctx.session` berupa object state untuk update saat ini. Default key menggabungkan `from.id` dan `chat.id`; jika pengirim tidak tersedia, library memakai chat ID. Default storage adalah `Map` dalam memori.

```js
const bot = new TeleBibz(process.env.BOT_TOKEN, {
  session: { initial: () => ({ visits: 0 }) },
});

bot.on(':text', async (ctx) => {
  ctx.session.visits++;
  await ctx.reply(`Pesan teks ke-${ctx.session.visits} pada session ini.`);
});
```

::: warning Storage bawaan tidak persisten
Isi `Map` hilang ketika proses Node.js berhenti, dan tidak dibagi otomatis antar-worker. Untuk restart, multi-instance, atau data yang perlu tahan lama, gunakan storage adapter persisten seperti database atau Redis.
:::

## Storage adapter

`session` menerima `initial()`, `getKey(ctx)`, dan `storage`. Adapter custom menyediakan `read(key)`, `write(key, value)`, serta `delete(key)`; ketiganya boleh asynchronous. `storage` juga dapat berupa `Map`.

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

TeleBibz membaca state sebelum handler berjalan dan menyimpan kembali setelah middleware selesai, termasuk bila handler asynchronous. Pilih key yang sesuai model produk: satu pengguna per chat, satu state per chat, atau key khusus tenant. Untuk wizard, session juga menyimpan posisi pertanyaan; lihat [Wizard](/guide/wizard).
