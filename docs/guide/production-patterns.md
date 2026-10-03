---
title: Pola operasi produksi
description: Logging, session store, limiter, shutdown, health checks, and deployment boundaries for TeleBibz.
---

# Pola operasi produksi

Halaman ini menggabungkan pola yang sudah ada di [reliability](/guide/reliability), [polling dan webhook](/guide/deployment), serta [transport/testing](/guide/transports-testing). Contohnya adalah baseline operasional, bukan angka throughput atau jaminan ketersediaan.

::: warning Batas instance
Untuk satu token, jalankan satu poller aktif kecuali Anda memakai sistem koordinasi update yang memang dirancang untuk itu. `limiter()` dan `throttler()` bawaan berlaku per proses; keduanya bukan rate limiter terdistribusi.
:::

## Pisahkan token, state, dan proses

- Simpan `BOT_TOKEN` dan `DATABASE_URL` di secret manager environment; jangan di Git, image, atau log.
- Untuk bot yang memakai `ctx.session`, gunakan storage yang persisten jika state harus bertahan saat restart. Sediakan satu key per kombinasi pengguna/chat atau skema yang sesuai kebutuhan aplikasi.
- Jangan jalankan dua long poller dengan token yang sama. Jika perlu horizontal scaling, gunakan webhook atau orkestrasi update yang eksplisit.
- Terapkan permission admin, validasi input, dan batas request pada handler sebelum melakukan side effect.

## Contoh service: error log, session adapter, retry, dan limiter

Install logger sebagai dependency langsung aplikasi, lalu isi adapter database sesuai driver yang dipakai. Tambahkan broker durable bila pekerjaan harus bertahan saat restart:

```sh
npm install @xbibzlibrary/telebibz pino
```

```js
const pino = require('pino');
const { TeleBibz, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'token', 'BOT_TOKEN'],
});
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur');

// Implementasikan kontrak ini dengan Redis/Postgres atau storage persisten lain.
const store = {
  read: (key) => database.readJson(key),
  write: (key, value) => database.writeJson(key, value),
  delete: (key) => database.delete(key),
};
const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  session: { storage: store },
  onError: (err, ctx) => logger.error({ err, updateId: ctx?.update?.update_id }, 'Update gagal'),
});

bot.api.config.use(throttler({ perSecond: 20 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('Pelan-pelan dulu. Coba lagi sebentar.'),
}));

// Serial queue kecil untuk contoh; tetap lokal proses dan tidak durable.
let outboundTail = Promise.resolve();
function enqueueOutbound(work) {
  const job = outboundTail.then(work);
  outboundTail = job.catch((err) => logger.error({ err }, 'Outbound job gagal'));
  return job;
}
bot.cmd('status', (ctx) => enqueueOutbound(() => ctx.reply('Bot aktif.')));

async function main() {
  await bot.launch({ dropPending: false, noSignalHandlers: true });
  logger.info({ username: bot.botInfo?.username }, 'Bot berjalan');
}

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  logger.info({ signal }, 'Menghentikan bot');
  bot.stop();
  await bot.runPromise;
  await outboundTail;
  await database.close();
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => { void shutdown(signal).catch((err) => { logger.error({ err }, 'Shutdown gagal'); process.exitCode = 1; }); });
}
main().catch((err) => { logger.fatal({ err }, 'Startup gagal'); process.exitCode = 1; });
```

Ganti `database.readJson/writeJson/delete/close` dengan implementasi driver Anda. `session()` memanggil storage `read(key)`, `write(key, value)`, dan `delete(key)`; key default diturunkan dari pengguna dan chat. Queue serial contoh ini hanya membatasi satu proses dan kehilangan job saat proses berhenti—gunakan broker durable bila pekerjaan tidak boleh hilang.

Urutan transformer disengaja: `throttler()` dipasang dulu dan `autoRetry()` kemudian agar percobaan ulang juga melewati antrean. Retry otomatis hanya membantu error yang menyertakan `retry_after`; jangan mengulang side effect bisnis tanpa idempotency key.

## Observabilitas tanpa membocorkan data

Catat `update_id`, jenis handler, nama method, status, durasi, dan hasil retry yang diperlukan untuk diagnosis. Hindari mencatat token, teks pesan, file, object `ctx.update` penuh, atau payload Bot API lengkap. Pino `redact` adalah lapisan tambahan; jangan pernah memasukkan rahasia ke field log sejak awal.

`onError` menangani error di pipeline update. Bungkus panggilan API dari scheduler/worker di luar handler dengan `try/catch` terpisah. Untuk probe kesiapan, expose endpoint HTTP milik aplikasi dan laporkan status proses yang relevan; `botInfo` tersedia setelah initialization, tetapi bukan pengganti pemantauan error API.

## Session, concurrency, dan antrean

- `maxConcurrentUpdates` membatasi update aktif per instance; update dengan session key sama diproses berurutan.
- `limiter()` memakai memori lokal. Pada beberapa replica, gunakan limiter terpusat atau pembatas di gateway.
- `throttler()` mengatur request keluar per `ApiClient`; bukan kuota global semua token, IP, atau worker.
- Untuk pekerjaan lama, masukkan job dengan ID update unik ke queue durable, balas cepat bila sesuai, dan gunakan unique constraint/outbox agar replay tidak menggandakan side effect.
- Jangan membuat broadcast tanpa consent, daftar penerima yang berwenang, rate budget, dan mekanisme stop.

::: details Dockerfile minimal untuk long polling
```dockerfile
FROM node:22-bookworm-slim
WORKDIR /srv/bot
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "index.js"]
```

Gunakan image non-root dan runtime secret injection. Untuk session file, mount volume persisten terpisah dengan permission terbatas; untuk database session, jangan menaruh dump/credentials pada layer image. Compose/hosting tetap perlu mengatur satu worker polling per token.
:::

Untuk HTTPS webhook, reverse proxy, secret header, dan perpindahan dari polling, ikuti [panduan deployment](/guide/deployment). Untuk rate limits, 409/429, dan error umum, lihat [reliability](/guide/reliability).
