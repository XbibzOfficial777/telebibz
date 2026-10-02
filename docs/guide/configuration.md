---
title: Konfigurasi bot
description: Opsi constructor TeleBibz, token, dan pengaturan runtime.
---

# Konfigurasi bot

Opsi diberikan sebagai argumen kedua ke `new TeleBibz(token, options)`. Constructor memeriksa format token dan melempar error yang menjelaskan cara memperbaikinya jika format tidak valid.

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN, {
  allowedUpdates: ['message', 'callback_query'],
  silent: false,
  dropPending: false,
  onError: (err, ctx) => {
    console.error('Gagal menangani update:', err);
  },
  session: {
    initial: () => ({ visits: 0 }),
  },
});
```

| Opsi | Kegunaan |
| --- | --- |
| `allowedUpdates` | Membatasi jenis update yang diminta saat long polling. Default-nya mencakup jenis update umum dan Business yang didukung library. |
| `onError(err, ctx)` | Handler error khusus. Jika tidak disetel, TeleBibz memakai reporter error bawaannya. `ctx` bisa tidak tersedia untuk error polling. |
| `silent` | Jika `true`, sembunyikan banner dan log boot. |
| `dropPending` | Buang update lama saat polling dimulai. Bisa juga diberikan ke `launch({ dropPending: true })`. |
| `session` | Pengaturan session seperti `initial`, `getKey`, dan `storage`. Lihat panduan [session](/guide/files-sessions#session-bawaan). |
| `transport` | Fungsi transport custom `(method, payload) => Promise<result>`, berguna untuk test atau integrasi khusus. |
| `apiRoot` | Ubah root URL Bot API. Berguna jika memakai local Bot API server. |
| `proxy` | Alamat proxy HTTP(S) untuk koneksi Telegram. |
| `timeoutMs` | Timeout request transport dalam milidetik. |
| `headers` | Header tambahan untuk request transport. |

## Environment variable

Simpan token di environment variable. Di production, gunakan pengaturan secret milik platform hosting atau secret manager—jangan tulis token langsung di file yang di-commit.

```js
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur');
const bot = new TeleBibz(token);
```

TeleBibz menggunakan CommonJS di paket saat ini, jadi contoh JavaScript memakai `require`. TypeScript bisa mengimpor deklarasi tipe paket; lihat [panduan TypeScript](/reference/typescript).
