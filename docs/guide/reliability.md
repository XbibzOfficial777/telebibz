---
title: Rate limit & error
description: Tangani 429, batasi spam, dan susun error handling yang dapat dipulihkan.
---

# Rate limit & error

Telegram membatasi request dengan aturan global dan batas khusus chat/method. Hindari request paralel tak terkendali; bila menerima error 429, baca `retry_after` dari Telegram dan jadwalkan ulang sesuai nilainya.

## Retry otomatis dan antrean API

`autoRetry()` adalah API transformer yang mencoba lagi error dengan `parameters.retry_after`. `throttler()` mengantrikan panggilan dan memberi jarak antar-request.

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
```

Default `autoRetry()` mencoba hingga lima kali setelah kegagalan yang menyertakan `retry_after`, dengan tambahan jeda `baseDelayMs * nomorPercobaan`. Default `throttler()` membatasi request client ini ke 28 panggilan per detik. Transformer throttler bersifat lokal untuk satu instance/proses; beberapa worker perlu antrean atau rate limiter bersama.

Tambahkan transformer setelah `bot` dibuat dan sebelum request mulai. Karena transformer terbaru menjadi lapisan terluar, urutan pemasangan berpengaruh; urutan di atas menempatkan `autoRetry()` di luar `throttler()`, sehingga setiap percobaan ulang juga melewati antrean throttler.

## Batasi update per pengguna

`limiter()` adalah middleware in-memory untuk membatasi update dari satu pengguna. Default-nya tiga update dalam dua detik:

```js
const { limiter } = require('@xbibzlibrary/telebibz');

bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('Pelan-pelan dulu. Coba lagi sebentar.'),
}));
```

Daftarkan limiter sebelum handler yang ingin dibatasi. Default key memakai `from.id`, dengan fallback ke chat ID bila pengirim tidak tersedia. Karena bucket berada di Map proses, limiter ini bukan proteksi distributed untuk beberapa instance; gunakan store terpusat jika perlu konsistensi lintas worker.

## Error dari handler dan Bot API

TeleBibz membungkus pipeline handler dengan error boundary bawaan. Atur `onError(err, ctx)` pada constructor untuk mengirim laporan ke logger/telemetry. Handler menerima error asli dan Context bila tersedia; error polling fatal dapat datang tanpa Context.

```js
const bot = new TeleBibz(token, {
  onError: (err, ctx) => {
    console.error('Update gagal:', err);
    if (ctx?.chatId) console.error('Chat:', ctx.chatId);
  },
});
```

Di luar handler, bungkus panggilan API langsung dengan `try/catch`. `ApiError` membawa `description`, `error_code`, `method`, `payload`, dan parameter respons Telegram. `humanize(error)` menghasilkan `pesan`, `saran`, `method`, dan `code` bila tersedia.

```js
const { humanize } = require('@xbibzlibrary/telebibz');

try {
  await bot.api.getChat(chatId);
} catch (err) {
  const info = humanize(err);
  console.error(info.pesan, info.saran);
}
```

## Error yang sering ditemukan

| Pesan | Pemeriksaan |
| --- | --- |
| `409 Conflict` | Ada poller lain memakai token sama; hentikan instance duplikat atau pindah ke webhook. |
| `429 Too Many Requests` | Terapkan jeda dan hormati `retry_after`; cek laju per-chat selain batas global. |
| `chat not found` | Periksa ID; pengguna private biasanya harus membuka bot dan menekan **Start**. |
| `bot was blocked by the user` | Tandai penerima tidak aktif dan jangan terus mencoba mengirim broadcast. |
| `not enough rights` | Periksa status admin dan permission bot pada chat tujuan. |
| `message is not modified` | Edit tidak mengubah isi; biasanya aman untuk diabaikan. |
| Error parse entity | Validasi escaping dan tag HTML/Markdown sebelum mengirim. |

Jangan log token, data sensitif, atau isi pesan lengkap tanpa kebutuhan. Untuk retry transform, antrean dan test transport, lihat [Transport & testing](/guide/transports-testing); untuk broadcast, lihat [Inline mode & broadcast](/guide/inline-broadcast).
