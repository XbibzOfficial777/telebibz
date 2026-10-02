---
title: Middleware & composer
description: Susun middleware berurutan dengan filter, branch, route, lazy, dan fork.
---

# Middleware & composer

TeleBibz menggunakan model middleware bergaya composer. Middleware menerima `(ctx, next)`, dapat membaca/mengubah context, dan memanggil `next()` untuk menyerahkan update ke tahap berikutnya.

## Urutan dan `next()`

```js
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log('durasi update ms:', Date.now() - started);
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));
```

Middleware umum dijalankan sesuai urutan registrasi. Bagian sebelum `await next()` berjalan sebelum handler hilir; bagian setelahnya berjalan saat rantai kembali. Bila tidak memanggil `next()`, middleware menangani update dan rantai berhenti di situ.

```js
bot.use(async (ctx, next) => {
  if (!ctx.from) return; // hentikan update yang tidak punya pengirim
  return next();
});
```

Hindari memanggil `next()` lebih dari satu kali. Composer mendeteksi penggunaan tersebut dan melempar error.

## Middleware per-route dan predicate

`TeleBibz.filter(predicate, ...middleware)` menambahkan subtree terbatas ke bot. Untuk menambahkan handler khusus ke subtree, buat `Composer` agar kamu dapat mendaftarkan route turunannya secara langsung:

```js
const { Composer } = require('@xbibzlibrary/telebibz');

const privateRoutes = new Composer();
privateRoutes
  .filter((ctx) => ctx.chat?.type === 'private')
  .command('profil', (ctx) => ctx.reply(`ID: ${ctx.from?.id}`));
bot.use(privateRoutes.middleware());
```

`Composer.filter` mengembalikan `Composer` anak, sehingga handler command pada contoh hanya dijalankan ketika predicate bernilai true. Bila cukup menjalankan satu middleware pada predicate, `bot.filter(predicate, handler)` juga dapat dipakai langsung. `drop` melakukan kebalikan—melewati subtree saat predicate true. `branch` memilih salah satu dari dua cabang:

```js
bot.branch(
  (ctx) => ctx.chat?.type === 'private',
  (ctx) => ctx.reply('Chat private'),
  (ctx) => ctx.reply('Bukan chat private'),
);
```

## Route berdasarkan nilai context

`route(router, mapping)` menghitung nilai router lalu meneruskan update ke middleware pada mapping yang sesuai. Router bisa berupa nama field context atau fungsi:

```js
bot.route((ctx) => ctx.chat?.type ?? 'unknown', {
  private: (ctx) => ctx.reply('Jalur private'),
  group: (ctx) => ctx.reply('Jalur group'),
  supergroup: (ctx) => ctx.reply('Jalur supergroup'),
});
```

Nilai yang tidak ada pada mapping diteruskan ke tahap berikutnya. Gunakan route untuk pemilihan satu cabang; gunakan `on()` bila yang diperlukan adalah pencocokan field/properti update.

## Lazy middleware

`lazy(factory)` membangun middleware sesuai context pada setiap update. Factory dapat mengembalikan satu middleware atau array:

```js
bot.lazy((ctx) => {
  if (ctx.from?.is_bot) return botMiddleware;
  return userMiddleware;
});
```

Lazy membantu memisahkan kebijakan user/bot atau tenant tanpa membuat ulang seluruh instance bot.

## Fork: pekerjaan latar belakang

`fork(...middleware)` memulai middleware tanpa menahan `next()`. Gunakan untuk pekerjaan yang memang tidak perlu menjadi bagian response utama. Error fork dicatat oleh library.

```js
bot.fork(async (ctx) => {
  await simpanAuditKeDatabase(ctx.update);
});

bot.cmd('start', (ctx) => ctx.reply('Bot siap.'));
```

Jangan mengandalkan hasil `fork` sebelum response handler selesai. Untuk pekerjaan penting yang perlu retry, durability, atau konfirmasi ke pengguna, gunakan queue/worker aplikasi.

## Error boundary

Pada `TeleBibz`, handler aplikasi sudah dibungkus error boundary bawaan. Atur reporter di constructor:

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('Handler gagal:', err);
    if (ctx?.chatId) console.error('Chat:', ctx.chatId);
  },
});
```

Jika membangun `Composer` sendiri, `Composer.errorBoundary(handler, ...middleware)` dapat membungkus subtree tertentu. Error handler menerima `BotError` yang menyimpan `error` asli dan `ctx`.

```js
const { Composer } = require('@xbibzlibrary/telebibz');
const guarded = new Composer();
guarded.errorBoundary((err, next) => {
  console.error('Subtree error:', err.error);
  return next();
}, riskyMiddleware);
bot.use(guarded.middleware());
```

Periksa [handler & filter](/guide/handlers) untuk matcher `cmd`, `hears`, `on`, `action`, dan `inlineQuery`. Pipeline dan urutan middleware dijelaskan di [arsitektur](/guide/architecture).
