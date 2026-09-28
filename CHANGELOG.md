# Changelog

## Unreleased — Telegram Bot API 10.3 / Rich Messages

### API surface and types

- Added a runtime registry containing **185 Bot API method names**. An audit test compares the registry exactly with all vendored method signatures and rejects duplicates.
- Vendored `@grammyjs/types@5.0.0` declarations (MIT; attribution/license in `NOTICE.md` and `types/telegram-bot-api/LICENSE`) for Bot API methods, objects, updates and payloads. These declarations add **no runtime dependency**; TypeScript is a development-only dependency for type tests.
- `api.callApi(method, payload)` and `api.raw(...)` now provide method-specific parameter and result typing for all methods in the vendored schema. `TelegramTypes`, `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods` and `TelegramApiPayloads` are exported. The dynamic API Proxy remains available but is not runtime schema validation.

### Rich Message authoring

- Added `rich.html()`, `rich.markdown()`, `rich.blocks()`, `inputRichMessage()`, and `RichMessageBuilder` (`html`, `markdown`, `blocks`, `add`, `media`, `rtl`, `skipEntityDetection`, `build`, `buildDraft`). Exactly one content mode—HTML, Markdown or blocks—is required.
- Added RichText entity builders for bold/italic/underline/strikethrough/spoiler/marked/code/subscript/superscript, date-time, mentions, custom emoji, math, links, email/phone/card, hashtag/cashtag/bot command, anchors/references, and inline rich-text buttons.
- Added block builders for paragraph, heading, preformatted text, footer, divider, math, anchor, list, block/expandable/pull quotations, collage, slideshow, table, details, map, animation, audio, document, photo, video, voice note, buttons and draft-only thinking blocks.
- `rich.button()` now builds a `RichMessageButton` for the buttons block; `rich.buttonText()` builds the separate inline `RichTextButton` entity. Runtime validation checks the one-action rule, supported style/alignment and 1–8 button count. This correction followed a live Telegram parse error.
- Added draft-safe `rich.draftHtml()`, `rich.draftMarkdown()`, `rich.draftBlocks()` and `RichMessageBuilder.buildDraft()`. They reject new `File` uploads; use existing Telegram file IDs for draft media.
- Added animated custom emoji support via `rich.customEmoji(customEmojiId, alternativeText)` and rich-message embedding of media through `tg://...` references plus `media` entries.

### Bot API 10.x helpers and media

- Added/typed API and Context support for `sendRichMessage`, `editMessageText` with `rich_message`, `sendLivePhoto`, `sendMessageDraft`, `sendRichMessageDraft`, `answerGuestQuery`, ephemeral send/edit/delete methods, and `iq.richArticle()`.
- Added live-photo and paid-media builders (`InputMediaBuilder.livePhoto()` and `InputPaidMediaBuilder.livePhoto()`). Existing multipart transport now has audit coverage for nested rich-media attachments.
- Added Context helpers: `replyWithRichMessage`, `editRichMessage`, `replyWithLivePhoto`, `sendMessageDraft`, `sendRichMessageDraft`, `replyEphemeral`, `editEphemeralRichMessage`, ephemeral media/caption/reply-markup edits, and `deleteEphemeralMessage`.
- Added `examples/08-rich-message.js` and expanded both English and Indonesian README sections with usage, helper catalogs, typing, media, drafts, animated emoji, limits/permissions and troubleshooting.

### Verification, live-test findings and publishing

- Automated suite: **30/30** existing feature checks + **18/18** audit checks (**48 total**); `npm run typecheck`, JavaScript syntax, workflow YAML, `npm pack --dry-run`, `git diff --check`, and `npm audit --omit=dev` pass.
- Live smoke test: rich blocks, HTML/Markdown, animated custom emoji, plain/rich drafts, photo/audio/document/video/voice-note media blocks, collage/slideshow, standalone live photo, GIF with `sendAnimation`, and rich HTML media references succeeded. For a rich `animation` block, MP4 succeeded while GIF returned `RICH_MESSAGE_VIDEO_INVALID`; the same GIF worked with standalone `sendAnimation`.
- Live ephemeral sends returned Telegram `BOT_NOT_ADMIN`; paid-media sending was not attempted because it can involve Telegram Stars. Callback execution and all 185 endpoints were not live-tested; see `VERIFIKASI-MENDALAM.md`. No bot token or user/chat identifier is recorded in repo documentation.
- CI/release workflows now run TypeScript checks. Auto-publish remains gated by GitHub Environment `npm-release` and secret `NPM_TOKEN`; no credential is committed and no release is implied by this Unreleased entry.

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
