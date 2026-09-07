# Changelog

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
