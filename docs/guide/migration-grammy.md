---
title: Catatan untuk pengguna grammY
description: Padanan konsep grammY yang tersedia pada API TeleBibz.
---

# Catatan untuk pengguna grammY

TeleBibz mengambil inspirasi dari pola API composer/context yang dikenal di ekosistem grammY, tetapi **bukan package kompatibilitas**. Periksa API TeleBibz dan deklarasi tipenya sebelum memindahkan kode. Beberapa nama sengaja memakai shorthand berbeda.

| Konsep yang dikenal | Di TeleBibz |
| --- | --- |
| Command handler | `bot.cmd('start', handler)` atau `bot.start(handler)` |
| Text handler | `bot.hears(match, handler)` |
| Filter update | `bot.on(filter, handler)` |
| Callback query data | `bot.action(trigger, handler)` |
| Context reply | `ctx.reply(text, extra)` |
| Bot API client | `bot.api.*`, `ctx.api.*`, `callApi(method, payload)` |
| Middleware | `bot.use((ctx, next) => ...)` |
| Composer branch/filter/drop/route/lazy/fork | Method composer TeleBibz dengan konsep serupa |
| Inline mode | `bot.inlineQuery(trigger, handler)` dan builder `iq` |
| Session | Session middleware terpasang pada pipeline bot; akses melalui `ctx.session` |
| Menu | `Menu` atau `MenuContainer` bawaan |
| Conversation form | `bot.wizard(id, definition)` |
| Auto retry/throttle/limiter | `autoRetry()`, `throttler()`, `limiter()` dari package |

## Perbedaan penting

- TeleBibz memakai `cmd()`, bukan `command()`, pada instance bot.
- String `hears` dicocokkan sebagai teks persis, case-insensitive; gunakan regex untuk pola.
- TeleBibz menyediakan menu, wizard, limiter, broadcast, download helper, Rich Message, dan beberapa helper lain sebagai fitur package bawaan.
- Session bawaan menggunakan `Map` dalam memori; restart proses akan menghilangkan state kecuali storage diganti.
- Beberapa method API TeleBibz punya shortcut positional; method proxy lain memakai satu object payload. Lihat [referensi Bot API](/reference/api).
- Deklarasi type, opsi transport, dan dukungan Telegram mengikuti release TeleBibz, bukan asumsi kompatibilitas dengan plugin grammY.

Mulai dengan migrasi satu handler sederhana, jalankan typecheck/test bot, kemudian pindahkan middleware, session, dan plugin secara bertahap. Jangan menyalin token produksi atau menjalankan dua poller untuk token yang sama selama proses migrasi.
