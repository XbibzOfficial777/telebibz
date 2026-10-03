---
title: Contoh siap jalan
description: Contoh bot TeleBibz dari repository.
---

# Contoh siap jalan

Repository TeleBibz punya contoh JavaScript di folder [`examples/`](https://github.com/XbibzOfficial777/telebibz/tree/main/examples). Jalankan dari root hasil clone repository setelah memasang dependency dan mengatur `BOT_TOKEN`.

| File | Isi |
| --- | --- |
| [`01-quickstart.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/01-quickstart.js) | Bot pertama, command dan text handler. |
| [`02-menu-tombol.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/02-menu-tombol.js) | Inline keyboard dan callback. |
| [`03-wizard.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/03-wizard.js) | Wizard dengan validasi, tombol pilihan, dan mode edit. |
| [`04-broadcast.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/04-broadcast.js) | Broadcast ke daftar chat dan pembatasan akses admin. |
| [`05-kirim-file.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/05-kirim-file.js) | Kirim file/foto. |
| [`06-menu.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/06-menu.js) | Menu dengan submenu. |
| [`07-inline-query.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/07-inline-query.js) | Inline mode. |
| [`08-rich-message.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/08-rich-message.js) | Rich Message, callback, dan draft. |

Contoh repository memakai `require('..')` karena dijalankan dari dalam repo. Kalau dipindah ke project bot terpisah, ganti dengan `require('@xbibzlibrary/telebibz')`.
## Bot layanan dengan throttling dan shutdown tertib

Contoh ini menggabungkan pemeriksaan admin, batas update per pengguna, throttling API, retry `retry_after`, dan shutdown polling. Isi `ADMIN_ID` melalui secret environment; jangan menaruh token di source.

```js
const { TeleBibz, autoRetry, throttler, limiter, btn, kb } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur.');
const adminId = process.env.ADMIN_ID;

const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  onError: (err, ctx) => {
    console.error({
      name: err?.name,
      code: err?.error_code,
      updateId: ctx?.update?.update_id,
    }, 'Update gagal diproses');
  },
});

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({ windowMs: 2_000, limit: 3 }));

bot.cmd('start', (ctx) => ctx.reply(
  'Pilih tindakan:', kb([[btn('Periksa status', 'status')]]),
));
bot.action('status', async (ctx) => {
  await ctx.answerCallbackQuery();
  return ctx.reply('Bot menerima update.');
});
bot.cmd('admin', (ctx) => {
  if (!adminId || String(ctx.from?.id) !== adminId) return;
  return ctx.reply('Akses admin terverifikasi.');
});

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });

bot.launch({ noSignalHandlers: true }).catch((err) => {
  console.error({ name: err?.name }, 'Bot gagal dijalankan');
  process.exitCode = 1;
});
```

::: warning Batas proses
`limiter()` dan `throttler()` di contoh ini berlaku per proses. Jika menjalankan beberapa worker, gunakan limiter/queue bersama. `ADMIN_ID` hanya ilustrasi otorisasi command; handler nyata juga harus memeriksa chat, izin, dan dampak aksinya. Jangan mencatat token atau seluruh update.
:::
