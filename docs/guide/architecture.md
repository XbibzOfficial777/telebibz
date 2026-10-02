---
title: Arsitektur & siklus update
description: Pahami perjalanan update dari Telegram sampai handler dan API response.
---

# Arsitektur & siklus update

TeleBibz memisahkan alur masuk (Telegram update), pemrosesan middleware, context, dan alur keluar (Bot API call). Memahami batas antarbagian membantu saat menambah middleware, menguji handler, atau memindahkan bot dari polling ke webhook.

## Gambaran umum

```text
Telegram Bot API
      │
      ├── long polling: getUpdates → pollLoop
      └── webhook: HTTP request → bot.webhook() / handleUpdate()
                                │
                                ▼
                       Context(update, api, botInfo)
                                │
                    session middleware (Map/adapter)
                                │
                     wizard conversation middleware
                                │
                      built-in error boundary
                                │
                    handler dan middleware aplikasi
                                │
                       ctx.reply() / ctx.api.*
                                │
             ApiClient → transformer berurutan → transport
                                │
                      Telegram Bot API
```

Transport bawaan memakai Axios untuk request JSON dan multipart. Dependency/transport detail dapat berubah antarversi, jadi baca `package.json` repository untuk versi yang sedang dipakai.

## Siklus long polling

`bot.launch()` melakukan `getMe()` agar TeleBibz memiliki identitas bot, menampilkan banner kecuali `silent: true`, kemudian menjalankan loop `getUpdates`. Tiap update masuk ke `handleUpdate(update)`, membuat satu `Context`, menjalankan pipeline middleware, lalu meneruskan panggilan API dari handler melalui transformer dan transport.

```js
await bot.launch();
```

`launch()` memulai poll loop dan mengembalikan instance setelah inisialisasi. Loop update berjalan selama proses hidup. Untuk graceful shutdown, panggil `bot.stop()` dan tunggu `bot.runPromise` jika aplikasi perlu memastikan poller sudah selesai.

## Urutan pipeline

1. **Session**: muat state sesuai key update ke `ctx.session`.
2. **Wizard**: lanjutkan alur tanya-jawab aktif jika ada.
3. **Error boundary**: membungkus handler aplikasi dan mengirim error ke `onError` atau reporter bawaan.
4. **Handler aplikasi**: middleware, command, filter, callback, dan handler lain berjalan sesuai urutan pendaftaran.
5. **Response/API call**: helper Context mengubah aksi handler menjadi payload Bot API.

Handler yang tidak memanggil `next()` menghentikan alur untuk update itu. Jadi satu handler yang cocok biasanya menjadi pemilik respons, kecuali sengaja meneruskan middleware.

## `Context` adalah snapshot satu update

`ctx` mewakili satu update masuk, bukan sesi koneksi Telegram yang berubah terus. Akses umum meliputi `ctx.update`, `ctx.from`, `ctx.chat`, `ctx.msg`, `ctx.chatId`, `ctx.msgId`, `ctx.api`, `ctx.session`, dan `ctx.match`. Field tertentu tidak tersedia untuk semua jenis update—misalnya inline query tidak memiliki message biasa.

Context meneruskan konteks Business jika tersedia. Balasan di konteks business otomatis membawa `business_connection_id` sesuai implementasi library.

## Polling dibanding webhook

| Pertimbangan | Long polling | Webhook |
| --- | --- | --- |
| Cara menerima update | Proses bot meminta `getUpdates`. | Telegram mengirim POST ke server HTTPS. |
| Infrastruktur | Tidak perlu endpoint publik untuk bot. | Perlu URL HTTPS publik dan route yang dapat dijangkau Telegram. |
| Cara mulai | `bot.launch()` | `bot.init()`, `bot.webhook()`, lalu konfigurasi `setWebhook`. |
| Cocok untuk | Development, worker, VPS sederhana. | Server web/serverless yang sudah menerima request. |

Jangan gunakan polling dan webhook sekaligus untuk token bot yang sama. Satu token hanya memiliki satu mekanisme pengiriman update aktif dari Telegram.

## Kenapa `handleUpdate` berguna?

`bot.handleUpdate(update)` menjalankan satu update mentah melalui pipeline yang sama tanpa memulai polling. Ini berguna untuk webhook/serverless, replay fixture test, dan pemeriksaan handler. Sebelum memanggilnya di aplikasi, pastikan body sudah diparse dan validasi request dilakukan oleh server/framework-mu.

Lihat [handler & filter](/guide/handlers), [middleware](/guide/middleware), [polling & webhook](/guide/deployment), dan [transport/testing](/guide/transports-testing) untuk contoh operasional.
