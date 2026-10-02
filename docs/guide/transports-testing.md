---
title: Transport custom & testing
description: Uji handler tanpa Telegram dan kustomisasi transport Bot API.
---

# Transport custom & testing

Opsi `transport` pada constructor menggantikan pengiriman HTTP bawaan. Fungsi menerima `(method, payload)` dan mengembalikan hasil endpoint sebagai Promise. Ini memberi test akses untuk memeriksa request tanpa memakai token aktif atau mengirim pesan sungguhan.

## Test handler dengan fake transport

```js
const assert = require('node:assert/strict');
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const calls = [];
const bot = new TeleBibz('123456:TEST_TOKEN', {
  silent: true,
  transport: async (method, payload) => {
    calls.push({ method, payload });
    if (method === 'sendMessage') return { message_id: 99 };
    return true;
  },
});

bot.cmd('ping', (ctx) => ctx.reply('pong'));

async function test() {
  await bot.handleUpdate({
  update_id: 1,
  message: {
    message_id: 10,
    text: '/ping',
    chat: { id: 123, type: 'private' },
    from: { id: 123, is_bot: false, first_name: 'Test' },
  },
});

assert.equal(calls[0].method, 'sendMessage');
assert.equal(calls[0].payload.text, 'pong');
}
test().catch(console.error);
```

`handleUpdate` membuat Context dan menjalankan middleware, tetapi tidak memanggil `getMe()` seperti `launch()`. Jika tes handler mengandalkan `ctx.me`, berikan fixture `bot.init()` dengan fake transport untuk `getMe`, atau uji bagian handler yang tidak membutuhkannya.

## Pakai `handleUpdate` untuk replay fixture

Simpan beberapa update JSON representatif, lalu teruskan ke `bot.handleUpdate(update)`. Ini berguna untuk test command, foto, callback, inline query, atau update Business. Gunakan payload fixture yang bentuknya benar sesuai Telegram; fixture yang tidak lengkap dapat menghasilkan perilaku berbeda dari update produksi.

## Opsi transport bawaan

Constructor menerima `apiRoot`, `proxy`, `timeoutMs`, dan `headers`. Untuk membuat fungsi transport sendiri dari opsi yang sama, gunakan `createTransport`:

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
const transport = createTransport(token, {
  apiRoot: 'https://api.telegram.org',
  proxy: process.env.HTTPS_PROXY,
  timeoutMs: 30_000,
  headers: { 'x-client-name': 'telebibz-app' },
});
const bot = new TeleBibz(token, { transport });
```

`createTransport(token, options)` juga dapat diarahkan ke local Bot API server memakai `apiRoot`. Pastikan token dan endpoint tidak dicatat ke log.

## Proxy

Untuk VPS di belakang HTTP(S) proxy:

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');
const token = process.env.BOT_TOKEN;
const bot = new TeleBibz(token, {
  transport: createTransport(token, {
    proxy: process.env.HTTPS_PROXY,
  }),
});
```

Jangan hard-code kredensial proxy. Ambil dari secret environment hosting dan batasi izin aksesnya.

## Transformer sebagai middleware API

Transformer bekerja setelah handler memutuskan untuk memanggil Bot API. Gunakan untuk tracing, telemetry, atau perubahan payload yang memang disengaja:

```js
bot.api.config.use(async (prev, method, payload) => {
  const started = Date.now();
  try {
    const result = await prev(method, payload);
    console.log(method, 'ok', Date.now() - started);
    return result;
  } catch (err) {
    console.error(method, 'failed', err);
    throw err;
  }
});
```

Transformer menerima `(prev, method, payload)`; panggil `prev` untuk meneruskan request. Jika transformer melempar error, request akan gagal sebelum atau saat transport. Jangan mencatat token, file privat, isi pesan sensitif, atau identitas pengguna tanpa kebutuhan dan kontrol akses yang tepat.

Untuk retry 429 dan antrean global, pasang `autoRetry()` dan `throttler()` dari [panduan reliability](/guide/reliability).
