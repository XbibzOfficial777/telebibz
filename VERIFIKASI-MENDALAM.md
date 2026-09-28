# Verifikasi Mendalam telebibz

**Tanggal audit:** 2026-09-28  
**Versi repo:** 3.1.2  
**Runtime yang diuji:** Node.js v20.20.2  
**Acuan Telegram:** Bot API 10.3 / pembaruan resmi terakhir 2026-08-24.

> Test otomatis menggunakan mock/server lokal. Tes live terpisah pada bot milik pengguna dilakukan 2026-09-28; token/chat ID tidak dicatat dalam laporan. Hasilnya tidak membuktikan setiap endpoint bekerja di semua bot/chat/permission Telegram produksi.

## Hasil pengujian

| Pemeriksaan | Hasil |
|---|---:|
| Test fitur yang sudah ada (`test/all.test.js`) | **30/30 lulus** |
| Test audit/regresi baru (`test/audit.test.js`) | **18/18 lulus** |
| Sintaks semua JS (`node --check`) | **lulus** |
| Test payload dan consumer TypeScript (`npm run typecheck`) | **lulus** |
| Registry runtime dibandingkan 1:1 dengan method signatures vendored | **185/185, unik, sinkron** |
| `npm audit --omit=dev` | **0 vulnerability** |
| `npm pack --dry-run` | **berhasil**, 53 file; 839.0 kB unpacked (tarball 177.8 kB) |
| YAML CI/release workflow | **valid**, parser lokal |
| `git diff --check` | **lulus** |

Test transport menggunakan HTTP server lokal: memeriksa JSON, upload multipart `attach://`, pembentukan `ApiError`, dan unduhan file. Test lain memeriksa session adapter yang membaca hasil deserialize, error boundary, filter regex global, composer `route/lazy/fork`, update guest/business, retry poller, antrean throttler, proteksi webhook, opsi `apiRoot`, dan proxy untuk metode API baru.

### Live smoke test Rich Message (2026-09-28)

- `getMe` dan `getChat` berhasil untuk bot/chat yang diberikan pengguna.
- `sendRichMessage` mode blocks, HTML, dan Markdown berhasil; rich HTML media reference dengan upload multipart nested juga berhasil.
- Animated custom emoji dikonfirmasi `is_animated: true` lewat `getCustomEmojiStickers`, lalu berhasil dikirim sebagai rich text.
- Rich media block photo, audio, document, video, voice note, collage, slideshow; `sendLivePhoto`; dan standalone `sendAnimation` GIF berhasil. Rich animation block berhasil dengan MP4, sedangkan GIF di rich animation block menerima `RICH_MESSAGE_VIDEO_INVALID` (GIF tetap diterima oleh metode `sendAnimation`).
- `sendMessageDraft` dan `sendRichMessageDraft` berhasil sebagai preview sementara.
- Pengiriman ephemeral gagal dengan HTTP 400 `BOT_NOT_ADMIN` pada `sendRichMessage` maupun `sendMessage`; dicatat sebagai belum lolos, bukan dianggap berhasil.
- Percobaan awal menemukan mismatch `rich.button()` (menghasilkan RichTextButton, bukan tombol block). Implementasi lokal diperbaiki: `rich.button()` menghasilkan `RichMessageButton`, `rich.buttonText()` untuk RichTextButton. Test offline/typecheck sesudah perbaikan lulus. Perbaikan tersebut belum dipush.
- Pesan test sengaja dibiarkan di chat sesuai izin pengguna. Callback button tidak diklik; edit/hapus, paid media (berpotensi melibatkan Stars), guest-query nyata, dan seluruh 185 endpoint tidak diuji live.

Jalankan ulang dengan:

```bash
npm ci --ignore-scripts
npm test
npm run typecheck
npm pack --dry-run
npm audit --audit-level=high --omit=dev
```

## Acuan resmi Telegram terbaru

- [Telegram Bot API reference](https://core.telegram.org/bots/api)
- [Telegram Bot API changelog](https://core.telegram.org/bots/api-changelog)

Per 2026-09-28, halaman resmi mencantumkan perubahan terakhir 2026-08-24 (Bot API 10.3). Perubahan relevan mencakup tipe tombol rich message, parameter `ephemeral_message_parameters`, perubahan `sendMessageDraft`/`sendRichMessageDraft`, serta update `stopped_message_generation`. Perubahan 2026 sebelumnya juga menambahkan guest messages, `answerGuestQuery`, rich messages, dan live photos.

### Penyesuaian yang dilakukan berdasarkan audit

1. **Update terbaru:** default `allowed_updates` sekarang berisi daftar update Bot API yang terdaftar saat ini, termasuk `deleted_business_messages`, `guest_message`, `chat_boost`, `removed_chat_boost`, dan `stopped_message_generation`. `Context`, `msgOf()`, dan compiler filter mengenali update pesan/jenis baru yang relevan.
2. **Guest query:** `ctx.guestQueryId` dan `ctx.answerGuestQuery(result)` dibangun sesuai parameter `guest_query_id` dan `result`; metode Bot API baru lain dapat dikirim lewat proxy API dengan argumen object payload.
3. **Error boundary:** sebelumnya handler publik ditambahkan sesudah boundary, sehingga tidak berada di dalam subpohon yang dilindungi. Sekarang handler publik menjadi bagian dari subpohon boundary.
4. **Regex:** reset `lastIndex` sebelum menguji regex di `hears`, `callbackQuery`, dan inline-query matcher agar regex `/g` tidak melewatkan update berikutnya.
5. **Reliabilitas:** poller retry koneksi ECONN*/timeout, hormati `retry_after` untuk 429, dan retry status 5xx. Throttler meneruskan antrean setelah satu request gagal. Limiter membersihkan bucket yang kedaluwarsa secara berkala.
6. **Session adapter:** hasil session ditulis kembali setelah middleware berjalan, termasuk adapter yang mengembalikan object hasil deserialize. Flag `ctx.session.__deleted = true` menghapus entry dari storage.
7. **Transport:** opsi `apiRoot`/transport diteruskan dari constructor dan dipakai juga oleh `downloadFile()`.
8. **Webhook:** tersedia pemeriksaan opsional header `X-Telegram-Bot-Api-Secret-Token`, metode POST, dan batas body default 1 MiB. Contoh:

   ```js
   const handler = bot.webhook({
     secretToken: process.env.TG_WEBHOOK_SECRET,
   });
   // Pastikan token yang sama dikirim saat setWebhook:
   await bot.api.setWebhook(url, { secret_token: process.env.TG_WEBHOOK_SECRET });
   ```

9. **API Proxy dan typing method:** nama `then`, `catch`, dan `finally` dikecualikan dari fallback metode generik agar `api` tidak dianggap Promise/thenable. Registry runtime memuat 185 nama; test membandingkannya 1:1 dengan semua signature pada schema TypeScript vendored. `api.callApi(method, payload)`/`api.raw(...)` memakai nama method dan payload yang spesifik pada compile time. Fallback `api.anyMethod(payload)` tetap generik/dinamis dan tidak melakukan validasi schema saat runtime.
10. **Rich messages / Bot API 10.3:** builder mendukung input HTML, Markdown, blocks terstruktur dan rich-text entities; rich blocks untuk heading, table, lists, details, quotes, media, buttons, maps, collage/slideshow, serta thinking khusus draft. Context/API helper baru untuk rich message send/edit, live photo, streaming drafts, guest query, ephemeral send/edit/delete dan inline rich article. Tests memeriksa payload yang dibentuk, satu-mode validation, upload multipart nested `attach://` di rich media, dan penolakan `File` upload pada rich drafts; builder menyediakan `draftHtml`/`draftMarkdown`/`draftBlocks` serta `buildDraft()`.
11. **TypeScript:** vendored `@grammyjs/types@5.0.0` (MIT) menyediakan tipe method/object/payload, tanpa dependency runtime. `npm run typecheck` mengompilasi declaration dan consumer sample, termasuk positive call serta negative `@ts-expect-error` checks; `sendRichMessageDraft` sengaja memakai schema yang tidak menerima upload baru.

## Batasan dan risiko yang masih ada

- **Tidak ada uji langsung ke Telegram saat audit ini.** Autentikasi token, izin admin, format payload khusus, batas rate Telegram, dukungan fitur per akun, dan respons nyata tetap perlu dites memakai bot staging. README lama mencatat uji live terdahulu; audit ini tidak mengulang uji tersebut.
- Semua 185 nama method dan payload signature telah tersedia pada type-level melalui `api.callApi()`/`api.raw()` dan schema TypeScript. Proxy shorthand `bot.api.namaMetode({ ...payload })` tetap tanpa pemeriksaan schema runtime. Registry disinkronkan ke schema vendored `@grammyjs/types@5.0.0`; ini bukan live test Telegram dan tidak membuktikan tiap kombinasi nilai payload diterima oleh server.
- `launch()` tidak otomatis menghapus webhook terdahulu. Sebelum beralih dari webhook ke polling, lakukan `deleteWebhook()` secara eksplisit bila dibutuhkan.
- Upload multipart membaca sumber file ke memori sebelum mengirim. Untuk file besar, penggunaan RAM dapat meningkat.
- Session default dan limiter berjalan di memori proses; gunakan storage bersama/persisten bila menjalankan banyak worker atau perlu mempertahankan data setelah restart.
- Pengujian runtime lokal dilakukan pada Node 20.20.2; deklarasi `engines` mengizinkan Node ≥18, tetapi matriks Node 18 tidak dijalankan di lingkungan audit ini.

## Auto-publish npm

Workflow `.github/workflows/auto-publish.yml` berjalan pada setiap push ke `main` dan juga dapat dijalankan manual (`workflow_dispatch`). Workflow memeriksa test, sintaks, paket, dan audit dependency; menghitung patch berikutnya dari versi lokal dan npm registry; lalu menerbitkan paket, menyimpan versi/tag ke GitHub, dan membuat GitHub Release. Versi yang terdeteksi di npm saat audit adalah **3.1.2**, sehingga push perubahan ini ke `main` akan menargetkan **3.1.3**.

Agar job dapat benar-benar publish, pastikan di GitHub:

1. Secret `NPM_TOKEN` (granular npm token dengan izin publish package) tersedia sebagai secret environment **`npm-release`** atau Actions repository secret.
2. Environment `npm-release` tidak memiliki required reviewer bila ingin rilis sepenuhnya otomatis.
3. Aturan branch `main` mengizinkan GitHub Actions push commit versi dan tag. Workflow perlu `contents: write` (sudah disetel).
4. Push perubahan ke branch `main`, atau jalankan **Actions → Auto publish to npm → Run workflow**.

Saat ini workflow menggunakan token npm. npm juga mendukung Trusted Publishing OIDC yang lebih aman dan tidak membutuhkan token tersimpan, tetapi perlu menghubungkan package di npmjs.com dengan repository serta nama workflow secara manual terlebih dahulu. [Dokumentasi npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)

**Saya tidak menjalankan publish atau push ke remote dari audit ini.** Mengubah file workflow lokal belum memicu GitHub Actions sampai perubahannya masuk ke GitHub. Workflow auto-publish memublikasikan setiap perubahan non-`[skip release]` ke `main`, bukan hanya perubahan kode; commit docs juga akan merilis patch.
