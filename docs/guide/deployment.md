---
title: Polling & webhook
description: Jalankan bot dengan long polling atau terima update melalui webhook HTTPS.
---

# Polling & webhook

TeleBibz dapat menerima update dengan long polling atau webhook. Pilih satu mekanisme untuk setiap token bot; Telegram tidak mengirim update lewat `getUpdates` selama webhook aktif.

## Long polling

`bot.launch()` memanggil `getMe()`, lalu menjalankan loop `getUpdates`. Cara ini paling mudah untuk development dan worker Node.js yang bisa terus hidup.

```js
const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Bot aktif.'));

async function main() {
  await bot.launch({ dropPending: false, noSignalHandlers: true });
  console.log('Bot:', bot.botInfo?.username);
}
main().catch(console.error);

async function shutdown() {
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
```

`dropPending: true` membuang update yang menunggu ketika polling dimulai; pakai hanya bila memang tidak perlu memproses backlog. Constructor menerima `allowedUpdates` untuk membatasi jenis update polling. Poller mencoba ulang konflik 409 dan gangguan jaringan sementara; jangan jalankan beberapa poller dengan token yang sama.

## Webhook pada server Node.js

Webhook memerlukan URL HTTPS publik yang dapat dijangkau Telegram. `bot.webhook()` menghasilkan handler `(req, res)` Node.js murni, membatasi body request, memeriksa method POST, dan bila `secretToken` diberikan akan membandingkannya dengan header Telegram menggunakan perbandingan waktu-konstan.

```js
const http = require('node:http');
const bot = new TeleBibz(process.env.BOT_TOKEN);

async function start() {
  await bot.init();
  const handleTelegram = bot.webhook({
    secretToken: process.env.TG_WEBHOOK_SECRET,
    maxBodyBytes: 1024 * 1024,
  });

  const server = http.createServer((req, res) => {
    if (req.url === '/telegram' && req.method === 'POST') {
      return handleTelegram(req, res);
    }
    res.writeHead(404).end('Not found');
  });

  server.listen(process.env.PORT || 3000);
  await bot.api.setWebhook(process.env.WEBHOOK_URL, {
    secret_token: process.env.TG_WEBHOOK_SECRET,
    allowed_updates: ['message', 'callback_query'],
  });
}

start().catch(console.error);
```

Pastikan `WEBHOOK_URL` persis URL HTTPS publik yang diarahkan ke path server, misalnya `https://bot.example.com/telegram`. Secret Telegram berisi 1–256 karakter huruf, angka, underscore, atau hyphen; simpan di secret environment hosting, jangan di Git.

Jika memakai framework yang sudah mengonsumsi request body, gunakan adapter framework yang sesuai atau parse JSON sekali lalu panggil `await bot.handleUpdate(update)`. Jangan coba membaca stream request yang sudah habis dipakai body parser.

## Pemasangan, penghapusan, dan pengecekan webhook

```js
await bot.api.setWebhook('https://bot.example.com/telegram', {
  secret_token: process.env.TG_WEBHOOK_SECRET,
});
const info = await bot.api.getWebhookInfo();
console.log(info.url, info.pending_update_count);
```

Untuk kembali ke polling, hapus webhook terlebih dahulu:

```js
await bot.api.deleteWebhook({ drop_pending_updates: false });
await bot.launch();
```

Periksa `getWebhookInfo()` saat Telegram belum mengirim update. Pastikan DNS/HTTPS, path route, status respons 2xx, header secret, serta batas body pada proxy sesuai.

## Serverless dan framework lain

Hubungkan request framework ke `bot.webhook()` hanya jika framework menyediakan request stream Node.js yang masih dapat dibaca. Untuk platform yang sudah mem-parse body, validasi header secret di adapter platform lalu teruskan object JSON ke `await bot.handleUpdate(update)`. Panggil `await bot.init()` bila handler membutuhkan `ctx.me`/informasi bot sebelum update pertama. Untuk adapter, lihat [transport & testing](/guide/transports-testing).