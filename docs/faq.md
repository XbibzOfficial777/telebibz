---
title: FAQ
description: Jawaban masalah umum saat menjalankan bot TeleBibz.
---

# FAQ & pemecahan masalah

## Bot tidak merespons

1. Pastikan proses Node.js masih berjalan tanpa error.
2. Periksa bahwa `BOT_TOKEN` terisi benar dan berasal dari @BotFather.
3. Untuk chat private, buka bot dan tekan **Start** sebelum mengirim pesan.
4. Pastikan update cocok dengan handler—misalnya `/start` ditangani lewat `bot.start(...)` atau `bot.cmd('start', ...)`.
5. Jika memakai webhook, pastikan URL HTTPS publik, secret, route, dan body JSON dikonfigurasi benar.

## Error 409 Conflict saat polling

Biasanya ada proses lain yang memanggil `getUpdates` dengan token bot yang sama. Hentikan instance lama atau jalankan hanya satu proses polling. TeleBibz mencoba ulang konflik polling, tetapi beberapa instance polling tetap bukan konfigurasi yang disarankan.

## Error 429 Too Many Requests

Pasang `bot.api.config.use(autoRetry())` agar retry menghormati `retry_after` dari Telegram. Untuk antrean request, tambahkan `throttler()`. Tetap sesuaikan laju dengan batas Telegram dan konteks chat.

## Upload file gagal

Bungkus bytes, path, atau stream menggunakan `InputFile` dan pastikan format file sesuai method yang dipakai. Cek juga izin baca file, ukuran payload, dan batas Telegram.

## Bagaimana menghentikan polling dengan bersih?

Panggil `bot.stop()`, lalu tunggu `await bot.runPromise` saat proses menutup. Dalam aplikasi production, tangani sinyal shutdown dan pastikan ada satu pemilik proses polling.

## Di mana melaporkan bug?

Buka [GitHub Issues](https://github.com/XbibzOfficial777/telebibz/issues) dengan versi TeleBibz, versi Node.js, pesan error, dan contoh reproduksi minimal. Jangan pernah menyertakan token bot atau data rahasia.
