---
title: Handler & filter
description: Cocokkan command, teks, jenis update, dan callback query.
---

# Handler & filter

Handler adalah fungsi yang dipanggil saat sebuah update cocok. Fungsi menerima `ctx` (Context) dan secara opsional `next` jika kamu sedang menyusun middleware.

## Command dan teks

```js
bot.cmd('ping', (ctx) => ctx.reply('pong'));
bot.cmd(['help', 'bantuan'], (ctx) => ctx.reply('Butuh bantuan?'));
bot.start('Selamat datang!');

bot.hears('daftar', (ctx) => ctx.reply('Kamu mengetik daftar.'));
bot.hears(/halo|hai/i, (ctx) => ctx.reply('Halo juga'));
```

String pada `hears` dicocokkan sebagai teks persis tanpa membedakan huruf besar/kecil. Gunakan regular expression jika ingin mencocokkan pola. Untuk command, argumen setelah command tersedia di `ctx.match`:

```js
bot.cmd('echo', (ctx) => ctx.reply(`Teks: ${ctx.match || '(kosong)'}`));
// /echo halo → ctx.match berisi "halo"
```

## Filter update

Gunakan `bot.on(filter, handler)` untuk memilih jenis update atau properti pesan. Beberapa filter yang umum:

```js
bot.on('message:photo', (ctx) => ctx.reply('Fotonya diterima!'));
bot.on(':text', (ctx) => console.log('Teks:', ctx.msg?.text));
bot.on('chat_type:private', (ctx) => console.log('Pesan private'));
bot.on('callback_query', (ctx) => ctx.answerCallbackQuery());
```

Filter yang didukung mencakup field update seperti `message`, `callback_query`, `inline_query`, dan `chat_join_request`; properti pesan seperti `:text`, `:photo`, `:document`, dan `:caption`; serta `chat_type:private`, `group`, `supergroup`, atau `channel`.

## Callback tombol

`bot.action` mencocokkan data callback dari inline keyboard. Jawab callback query supaya Telegram menutup indikator loading di tombol:

```js
bot.action('premium', async (ctx) => {
  await ctx.answerCallbackQuery('Menu premium dibuka!');
  await ctx.reply('Pilih paket yang kamu mau.');
});

bot.action(/^item:\d+$/, (ctx) => {
  const itemId = ctx.callback_query.data.split(':')[1];
  return ctx.answerCallbackQuery(`Item ${itemId}`);
});
```

## Middleware

Middleware dapat melakukan pekerjaan sebelum dan sesudah handler berikutnya dengan memanggil `next()`:

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`Update selesai dalam ${Date.now() - started} ms`);
});
```

Daftarkan middleware umum sebelum handler yang ingin dilaluinya. TeleBibz juga menyediakan composer seperti `filter`, `drop`, `branch`, `route`, `lazy`, `fork`, dan `errorBoundary` untuk merangkai middleware lebih lanjut.

::: tip Handler berhenti di tempatnya
Jika handler tidak memanggil `next()`, update tidak diteruskan ke handler berikutnya yang cocok. Ini membantu menghindari satu pesan dibalas oleh banyak handler tanpa sengaja.
:::
