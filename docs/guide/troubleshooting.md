---
title: Pemecahan masalah
description: Diagnosis terstruktur untuk polling, webhook, update, handler, error Bot API, session, dan upload.
---

# Pemecahan masalah

Telusuri satu lapisan pada satu waktu. Catat versi TeleBibz/Node.js, mode transport, timestamp, `update_id`, method API, dan error Telegram yang disanitasi. Jangan pernah menyalin token, isi pesan, file, secret webhook, atau object update lengkap ke issue/log.

## Pohon diagnosis cepat

1. **Startup gagal sebelum `bot.botInfo` tersedia?** Uji token dengan `getMe()`, validasi environment, DNS, proxy, dan outbound HTTPS.
2. **`getMe()` berhasil, tetapi tidak ada update?** Pastikan hanya satu transport aktif. Polling tidak dapat mengambil update selama webhook terpasang.
3. **Update masuk tetapi handler tidak berjalan?** Periksa `allowedUpdates`, `dropPending`, filter/command, middleware yang tidak memanggil `next()`, dan urutan registrasi.
4. **Handler berjalan tetapi API gagal?** Gunakan `ApiError.description`, `error_code`, method, dan `retry_after`; periksa izin chat serta payload sebelum menambah retry.
5. **State hilang atau bercampur?** Periksa session key, storage persistence, serta jumlah replica yang mengakses store.

## Error dan gejala yang umum

| Gejala / status | Pemeriksaan pertama | Tindakan yang aman |
| --- | --- | --- |
| `401 Unauthorized` / `getMe()` gagal | Secret salah, token sudah dicabut, newline/quote ikut terbaca. | Perbarui secret dari @BotFather; jangan cetak token. Restart satu instance setelah secret diganti. |
| `409 Conflict` saat polling | Poller duplikat atau webhook masih aktif. | Hentikan poller lain. Cek `getWebhookInfo()`; sebelum kembali ke polling jalankan `deleteWebhook({ drop_pending_updates: false })`. |
| `429 Too Many Requests` | Error berisi `retry_after`; batas dapat bersifat global, per-chat, atau per-method. | Hormati `retry_after`, aktifkan `autoRetry()`, batasi burst dengan `throttler()`, dan periksa worker lain. |
| `400 Bad Request` | `description` menunjukkan field, parse mode, file, chat, atau kombinasi parameter yang salah. | Validasi `TelegramMethodPayload<M>`/method, escaping, ukuran file, dan state chat; jangan retry payload identik. |
| `403 Forbidden` / bot diblokir | Pengguna mencabut izin, bot diblokir, atau hak admin tidak cukup. | Tandai target tidak dapat dihubungi; cek permission admin. Jangan mengulang broadcast ke target yang memblokir bot. |
| `chat not found` | ID salah, bot belum pernah dibuka user, atau bot bukan anggota chat. | Verifikasi ID dan alur **Start**/keanggotaan/undangan; jangan menebak chat ID. |
| Polling hidup, tetapi jenis update hilang | `allowedUpdates` membatasi jenis event atau backlog dibuang. | Periksa constructor `allowedUpdates` dan `dropPending`; pilih kebijakan backlog secara eksplisit. |
| Webhook tidak menerima request | URL/path, HTTPS, route method, secret, reverse proxy, body parser, atau response 2xx. | Bandingkan `getWebhookInfo()`, cek log proxy, dan pastikan route memproses body sekali. Jangan mempublikasikan secret. |
| Upload/unduh file gagal | Path/permission, directory tujuan, ukuran, stream, method/type media. | Cek akses file dan batas Telegram. Validasi nama tujuan; jangan gunakan nama file pengguna sebagai path. |
| Update berhasil, tetapi session kosong | Default `Map` hilang saat restart atau key berbeda di tiap update. | Gunakan storage persisten dan `getKey(ctx)` stabil; multi-process memerlukan store bersama. |

## Polling versus webhook

Gunakan satu mode per token. Jika berpindah dari webhook ke long polling, cek status terlebih dahulu dan hapus webhook dengan `drop_pending_updates: false` bila backlog harus diproses. `drop_pending_updates: true` membuang update tertunda saat polling dimulai; jangan pakai sebagai langkah coba-coba. Untuk webhook, pastikan URL publik HTTPS, route POST persis, respons sukses, secret header, ukuran body, dan konfigurasi proxy benar.

Panduan konfigurasi lengkap: [Polling & webhook](/guide/deployment).

## Update masuk, tetapi handler tidak cocok

```js
bot.use(async (ctx, next) => {
  const startedAt = Date.now();
  try {
    await next();
  } finally {
    metrics.observe('telebibz_update_duration_ms', Date.now() - startedAt);
    logger.debug({ updateId: ctx.update.update_id }, 'Update diproses');
  }
});

bot.cmd('start', (ctx) => ctx.reply('Bot aktif.'));
bot.hears(/^ping$/i, (ctx) => ctx.reply('pong'));
```

Middleware observability harus memanggil `next()` agar handler berikutnya jalan. Letakkan middleware sebelum route/handler yang ingin diukur. Tambahkan label seperti nama handler atau jenis update bila tersedia, tetapi hindari teks pesan, token, dan payload lengkap. Handler callback yang melempar error masuk ke `onError(err, ctx)`; tangani kegagalan bisnis yang diperkirakan dekat dengan operasi.

## Gagal mengirim callback atau edit

- Jawab `callback_query` menggunakan `answerCallbackQuery()` agar indikator loading Telegram berhenti.
- Edit hanya pesan yang dapat diedit bot; error `message is not modified` umumnya berarti konten sama.
- Periksa escaping untuk HTML/Markdown, `parse_mode`, batas panjang Telegram, serta tipe `InputFile`.
- Panggilan API dari scheduler/worker di luar handler tetap perlu `try/catch`; `onError` tidak mengubah setiap error di luar pipeline menjadi retry otomatis.
- Timeout sesudah request dikirim tidak membuktikan bahwa Telegram menolak side effect. Gunakan idempotency/outbox untuk operasi yang aman diulang.

## Session, concurrency, dan graceful shutdown

`TeleBibz` membatasi update bersamaan dan mengurutkan update dengan session key yang sama. Untuk konsistensi lintas replica, session adapter harus dibagi dan penulisan harus atomik; `Map` bawaan hanya hidup selama satu proses. Saat shutdown long polling, panggil `bot.stop()` lalu tunggu `bot.runPromise`. Periksa apakah handler/DB request macet sebelum memperpanjang timeout shutdown.

Lihat [session dan file](/guide/files-sessions), [rate limit & error](/guide/reliability), serta [pola operasi produksi](/guide/production-patterns) untuk konfigurasi terkait.

## Laporan bug yang dapat direproduksi

Sertakan versi package/Node.js, OS, transport, method atau jenis update, error Telegram yang sudah disanitasi, urutan kejadian, dan reproduction minimal. Ganti token, ID pribadi, URL internal, isi pesan, dan secret dengan placeholder sebelum membagikan.
