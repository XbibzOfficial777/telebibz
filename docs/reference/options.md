---
title: Opsi bot
description: Referensi opsi constructor, lifecycle, session, dan transport.
---

# Opsi bot

## Constructor

**Signature:** `new TeleBibz(token, options?)`

| Opsi | Tipe ringkas | Default / catatan |
| --- | --- | --- |
| `allowedUpdates` | `string[]` | Daftar update untuk polling; default mencakup jenis umum dan Business yang didukung versi ini. |
| `onError` | `(err, ctx?) => unknown` | Reporter bawaan jika tidak disetel; context bisa tidak ada untuk error di luar handler. |
| `silent` | `boolean` | `false`; menyembunyikan banner/log boot. Bila aktif, pasang sendiri handler shutdown karena handler sinyal bawaan juga tidak dipasang. |
| `dropPending` | `boolean` | `false`; bisa dioverride melalui opsi `launch()`. |
| `session` | `SessionOptions` | Storage default memakai `Map` dalam memori dan object kosong sebagai initial state. |
| `transport` | `(method, payload?) => Promise<unknown>` | Transport custom untuk test atau integrasi. Fungsi mengembalikan hasil endpoint, bukan envelope `{ ok, result }`. |
| `apiRoot` | `string` | Root Bot API; dapat diarahkan ke local Bot API server. |
| `proxy` | `string` | Alamat proxy HTTP(S) bila dibutuhkan. |
| `timeoutMs` | `number` | Batas waktu request transport dalam milidetik. |
| `headers` | `Record<string, string>` | Header tambahan transport. |

`SessionOptions` menerima `initial()`, `getKey(ctx)`, dan `storage`. Storage dapat berupa `Map` atau adapter dengan `read(key)`, `write(key, value)`, dan `delete(key)` yang boleh asynchronous. Lihat [File & session](/guide/files-sessions#session-bawaan).

## Lifecycle

| API | Tujuan |
| --- | --- |
| `await bot.init()` | Memanggil `getMe()` dan memuat identitas bot; `launch()` juga melakukan inisialisasi. |
| `await bot.launch(options?)` | Memulai long polling dan mengembalikan instance setelah startup. |
| `await bot.handleUpdate(update)` | Menjalankan satu update melalui pipeline tanpa membuka poller. |
| `bot.webhook(options?)` | Membuat handler HTTP Node.js; menerima `secretToken` dan `maxBodyBytes`. |
| `bot.stop()` | Meminta loop long polling berhenti. |
| `await bot.runPromise` | Menunggu poll loop selesai saat shutdown terkontrol. |

Opsi `launch()` yang dikenali loop polling meliputi `dropPending`, `conflictDelay` (milidetik, default 5.000), dan `noSignalHandlers`. `allowedUpdates` disetel pada constructor. Jika `silent: true` atau `noSignalHandlers: true`, tangani `SIGINT`/`SIGTERM` sendiri lalu panggil `bot.stop()` dan tunggu `bot.runPromise`.

Jangan gunakan polling dan webhook pada token bot yang sama secara bersamaan. Untuk setup, lihat [Polling & webhook](/guide/deployment).

## Method registrasi

Instance bot menyediakan `use`, `cmd`, `start`, `hears`, `on`, `action`, `inlineQuery`, `wizard`, dan `broadcast`. Kombinator lanjutan dijelaskan pada [Middleware & composer](/guide/middleware); contoh handler ada di [Handler & filter](/guide/handlers).
