---
title: Referensi Bot API
description: Akses method Telegram melalui API client, Context, dan transformer.
---

# Referensi Bot API

`bot.api` dan `ctx.api` mengakses Telegram Bot API. `ctx.api` tersedia di handler; gunakan `bot.api` dari scheduler atau service lain yang berada di luar update.

::: tip Referensi field payload lengkap
[Daftar lokal 185 metode dan 950 field](/reference/methods) memuat tabel per metode: nama field, tipe, status wajib/opsional, dan deskripsi. Buka detail metode untuk melihat seluruh field; tautan Telegram di sana hanya pelengkap untuk aturan dan batas endpoint terbaru.
:::

## Shortcut API

Method umum memiliki shortcut pada `ApiClient`. Beberapa di antaranya memakai argumen positional agar ringkas:

```js
await bot.api.getMe();
await bot.api.sendMessage(chatId, 'Halo dari TeleBibz', { disable_notification: true });
await bot.api.sendPhoto(chatId, fileOrFileId, { caption: 'Contoh' });
await bot.api.editMessageText(chatId, messageId, 'Teks baru');
```

Shortcut positional tersedia untuk method umum seperti pesan/media, edit/copy/forward, file, callback/inline query, administrasi chat, commands/settings, webhook, forum, pembayaran, dan Stars. Lihat [semua 185 nama metode yang dikenali registry TeleBibz](/reference/methods). Context shortcut dan tipe Context tersedia di [referensi Context](/reference/context).

## `callApi()` dan `raw()`

Pakai object payload ber-field snake_case Telegram saat memanggil method berdasarkan nama. `raw()` adalah alias berperilaku sama:

```js
await bot.api.callApi('sendMessage', {
  chat_id: chatId,
  text: 'Pesan melalui callApi',
});

await ctx.api.raw('getChat', { chat_id: ctx.chatId });
```

Method yang punya shortcut positional tetap menerima payload Bot API melalui `callApi()`. Nama method harus persis seperti yang digunakan Telegram, misalnya `getChatMember`. [Daftar 185 method yang terindeks](/reference/methods) menautkan setiap nama ke tuple argumen, payload, return type, serta dokumentasi field Telegram. Lihat [referensi TypeScript](/reference/typescript) untuk tipe payload dan hasil.

## Proxy untuk nama lain

API client memiliki proxy runtime: jika sebuah properti method tidak didefinisikan sebagai shortcut, pemanggilan `bot.api.someTelegramMethod(payload)` diteruskan sebagai `callApi('someTelegramMethod', payload)`. Ini memberi fallback untuk method baru, tetapi nama/properti dynamic pada JavaScript tidak memvalidasi payload. Untuk TypeScript, gunakan `callApi()`/`raw()` agar nama dan payload diuji oleh tipe.

```js
await bot.api.getChat(chatId);
await bot.api.setMyCommands({ commands: [{ command: 'start', description: 'Mulai' }] });
```

## Response dan error

Promise menghasilkan object hasil Telegram langsung; request yang gagal melempar `ApiError` dengan informasi seperti `description`, `error_code`, `method`, dan `parameters`. Gunakan `onError` untuk error di middleware dan `humanize(error)` untuk saran pemecahan masalah.

```js
const { humanize } = require('@xbibzlibrary/telebibz');

try {
  await ctx.api.getChat(ctx.chatId);
} catch (err) {
  const info = humanize(err);
  console.error(info.pesan, info.saran);
}
```

Error API berbeda dari error handler aplikasi. Telegram dapat menolak request yang payload-nya valid bila bot tidak memiliki hak admin, update asal, chat, izin, atau kelayakan fitur yang dibutuhkan.

## Transformer

Tambahkan transformer melalui `bot.api.config.use((prev, method, payload) => ...)`. Transformer menerima satu request dan harus meneruskan `prev` bila request akan dikirim:

```js
bot.api.config.use(async (prev, method, payload) => {
  const started = Date.now();
  try {
    const result = await prev(method, payload);
    console.log(method, 'selesai dalam', Date.now() - started, 'ms');
    return result;
  } catch (err) {
    console.error('Request API gagal:', method, err);
    throw err;
  }
});
```

Transformer yang ditambahkan belakangan membungkus yang sebelumnya; karena itu request melewati transformer paling baru lebih dulu. Hindari mencatat token, isi pesan privat, atau file pengguna. Lihat [Transport & testing](/guide/transports-testing) dan [Rate limit & error](/guide/reliability).

## File

`bot.api.getFile(fileId)` mendapatkan metadata file Telegram. `bot.api.downloadFile(fileId, destination)` mengambil metadata lalu mengunduh berkas ke path lokal. Di handler, `ctx.getFile()` dan `ctx.downloadFile(destination)` memilih file dari message Context saat ini; method Context ini hanya berlaku jika update memiliki pesan dengan file. Lihat juga [File & session](/guide/files-sessions).
