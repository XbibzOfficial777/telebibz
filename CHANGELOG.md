# Changelog

## Unreleased — Telegram Bot API 10.3

- Vendored schema TypeScript `@grammyjs/types@5.0.0` (MIT), typed payload signatures, and an audited 185-method runtime registry kept in exact sync by tests; no new runtime dependency.
- Rich-message builders/entities/blocks, live-photo and paid-media builders, guest-query/ephemeral/draft helpers, inline rich-article builder, and the `08-rich-message.js` example.
- Typed `callApi(method, payload)` and Telegram schema exports; positive/negative TypeScript consumer checks run in CI and before automated npm release.
- English/Indonesian documentation and npm publishing setup guidance updated; tests now 30 feature + 17 audit checks.

## 3.1.0 — wizard: tombol pilihan + mode edit/delete (2026-09-13)

- **Wizard mendukung tombol pilihan**: `step.buttons` sebagai reply keyboard
  (`['A','B']`, `[{text,value}]`, atau baris eksplisit) atau inline keyboard
  callback (`step.inline: true`) — klik tombol langsung menjadi nilai jawaban.
- `onlyButtons` menolak ketikan bebas; `parse`/`validate` tetap berlaku untuk
  nilai tombol; tombol usang dijawab alert aman tanpa crash.
- **Wizard mendukung edit & delete pesan**: `mode: 'edit'` (satu pesan diedit
  dari awal sampai akhir) dan `mode: 'delete'` (pesan tanya lama dihapus
  sebelum pertanyaan berikutnya), bisa di-override per langkah via `step.mode`.
- `cleanup` menghapus pesan tanya terakhir saat wizard selesai (default aktif
  pada mode `'delete'`); `removeKeyboard` otomatis menyingkirkan reply keyboard.
- Helper programatis baru: `wizard.cancel/editAsk/deleteAsk` + shortcut
  `bot.wizardCancel()`, `bot.wizardEdit()`, `bot.wizardDelete()`.
- Modul `wizard` kini diekspor dari `index.js` (sebelumnya hanya lewat kelas).
- API lama 100% backward-compatible (tanpa `buttons`/`mode`, perilaku identik v3.0).
- Test offline bertambah 24 → **30/30 lulus**. Contoh `examples/03-wizard.js` diperbarui.

## 3.0.0 — production-grade parity grammY (2026-09-07)

- DEPENDENSI NYATA & TERTEST: axios (keep-alive transport), mime-types, https-proxy-agent, debug.
- Proxy API: metode APA PUN `api.metodeBebas(payload)` → callApi otomatis.
- Transformer pipeline `api.config.use` + `autoRetry()` (hormati retry_after 429) + `throttler()`.
- `limiter()` anti-spam per-user; composer lanjut `branch/filter/drop/route/lazy/fork` — semantik = grammY.
- `Menu` + `MenuContainer` (submenu, back) bawaan.
- `inlineQuery` matcher + builder hasil (`iq.article/photo/gif/...`).
- `InputMediaBuilder` + `sendMediaGroup`; `downloadFile()` streaming; `getFile()` pintar (photo terbesar).
- Filter tambahan: `:text` leading-colon, `chat_type:private/group/supergroup/channel`, payment, dll.
- Context: business_connection_id otomatis; ~70 shortcut; react(), replyWithInvoice, stopPoll, forum topic.
- 24/24 test offline.


## 2.0.0 — clone & recode penuh: 0 dependency (2026-09-07)

- ENGINE BARU 100% milik sendiri: net/api/composer/context/session/runner ditulis ulang
  dari nol dalam JS modern. Dependency runtime: **0**.
- Sama-sama mudah: API publik kompatibel penuh dengan v1.0 (tidak ada perubahan pemakaian).
- Transport multipart `attach://` untuk File/InputFile (foto, video, dokumen, stiker).
- Webhook handler Node murni (`bot.webhook()`), session storage swappable, runner
  retry 409 + backoff error jaringan (bisa diatur via `conflictDelay`).
- 14 test tanpa jaringan (injeksi transport) + 8/8 live test valid pada @xbibzrat_bot.
- NOTICE.md: kredit MIT untuk grammY sebagai acuan arsitektur.


## 1.0.0 — recode grammY (2026-09-07)

- RECODE TOTAL: framework TS 152 file → wrapper ramping di atas grammY 1.46.
- API baru: TeleBibz, cmd/hears/action/on/start/use, wizard, broadcast.
- Keyboard: tombol berwarna (Bot API 9.4) + ikon animated, builder btn/url/kb/copy.
- Session & error boundary otomatis; laporan error dengan saran Bahasa Indonesia.
- Polling long-polling TAHAN 409: auto-retry tiap 5 detik tanpa crash (terbukti live di @xbibzrat_bot).
- 12 test tanpa jaringan + 6 live test API asli; 5 contoh siap jalan; README lengkap Indonesia.
- Dihapus: build step tsc, API client tulisan tangan, CLI, struktur docs 3 bahasa.
