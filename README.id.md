# telebibz

![telebibz logo](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-logo.png)

[![CI](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml/badge.svg)](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![npm downloads](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![Node.js](https://img.shields.io/node/v/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

**`@xbibzlibrary/telebibz`** adalah SDK dan framework Telegram Bot untuk Node.js dan TypeScript. Paket ini menyediakan API client, polling, router, middleware, context, keyboard builder, state/session, webhook handler, queue, scheduler, cache, plugin lifecycle, CLI, dan utilitas pengujian.

[English](README.md) · **Bahasa Indonesia** · [简体中文](README.zh-CN.md)

Referensi API lengkap: [English](docs/API.md) · **Indonesia** · [中文](docs/API.zh-CN.md)

Panduan GitHub Packages: [English](docs/GITHUB_PACKAGES.md) · [Bahasa Indonesia](docs/GITHUB_PACKAGES.id.md) · [简体中文](docs/GITHUB_PACKAGES.zh-CN.md)

Panduan mulai: [English](docs/GETTING_STARTED.md) · [Bahasa Indonesia](docs/GETTING_STARTED.id.md) · [简体中文](docs/GETTING_STARTED.zh-CN.md)

Showcase komunitas: [SHOWCASE.md](SHOWCASE.md)

![overview telebibz](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

## Instalasi

```bash
npm install @xbibzlibrary/telebibz
```

Node.js **22 atau lebih baru** diperlukan.

## Bot sederhana

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => { await ctx.reply("Bot aktif."); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
```

`Bot.start()` menjalankan long polling. Untuk siklus hidup manual, gunakan `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, atau `restart()`.

## Starter resmi

Repository menyediakan starter yang bisa langsung dijalankan untuk bot minimal, registration wizard multi-langkah, dan webhook Node.js. Lihat [`examples/README.md`](examples/README.md), atau jalankan starter minimal setelah mengatur `TELEGRAM_BOT_TOKEN`:

```bash
export TELEGRAM_BOT_TOKEN="<token-bot-kamu>"
npx tsx examples/minimal.ts
```

Semua examples di-typecheck oleh CI melalui `npm run test:examples` dan tidak berisi credential asli.

## Router dan middleware

```ts
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`processed in ${Date.now() - started}ms`);
});

bot.command("help", async (ctx) => { await ctx.reply("Bantuan tersedia."); });
bot.onRegex(/^order:(\\d+)$/, async (ctx) => { await ctx.reply("Order diterima."); });
bot.callback("profile:*", async (ctx) => { await ctx.answerCallbackQuery("Dibuka."); });
bot.on("message:photo", async (ctx) => { await ctx.reply("Foto yang bagus."); });
bot.on(["message:text", "callback_query:data"], async (ctx) => { await ctx.reply("Diterima."); });
bot.hears("ping", async (ctx) => { await ctx.reply("pong"); });
bot.catch(async (error, ctx) => { await ctx.reply("Terjadi kesalahan."); });
```

Router mendukung command, text, regex, pola callback, filter tipe update (`on`), predikat kustom, router bersarang, middleware per rute, dan prioritas rute. `bot.catch()` mendaftarkan error boundary: kegagalan handler diarahkan ke sana alih-alih menolak update.

## Telegram API

Generated method access dan raw access tersedia melalui API client:

```ts
await bot.api.methods.getMe();
await bot.api.methods.sendMessage({ chat_id: 123456789, text: "Halo." });
await bot.api.call("sendMessage", { chat_id: 123456789, text: "Halo." });
await bot.api.raw("futureTelegramMethod", { value: true });
```

Transport bawaan menggunakan `fetch`, timeout, retry, exponential backoff, JSON payload, dan multipart upload.

Referensi API lengkap untuk setiap class, function, method, type, error, lifecycle, CLI command, dan generated Telegram method tersedia di [`docs/API.id.md`](docs/API.id.md).

## Keyboard

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

const keyboard = new InlineKeyboard()
  .text("Profil", "profile")
  .url("Dokumentasi", "https://core.telegram.org/bots/api")
  .build();

await ctx.reply("Pilih menu:", { reply_markup: keyboard });
```

Builder hanya menghasilkan payload keyboard native Telegram. UI HTML/CSS memerlukan Mini App atau Web App terpisah.

## Startup dan log terminal

Logger mengeluarkan baris terminal yang ringkas dan mudah dibaca dengan level berwarna serta konteks terstruktur. Level log: `silent`, `error`, `warn`, `info`, `debug`, dan `trace`; nilai sensitif di-redact; error dicetak merah lengkap dengan stack. Gunakan `format: "json"` untuk log terstruktur, dan `includeUpdateContent: true` hanya bila teks pesan atau data callback memang diperlukan.

## Webhook

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

`createWebhookHandler` menerima Request Web standar dan menghasilkan Response. Secret token, ukuran body, parsing JSON, dan penanganan update duplikat diverifikasi oleh handler.

## Update beban tinggi dan broadcast

telebibz dibangun untuk burst 1000+ pesan tanpa cooldown buatan:

- **Paralel antar chat, berurutan per chat.** Setiap batch `getUpdates` (dan setiap request webhook) diproses secara konkuren — update dari chat berbeda tidak pernah saling mengantre, sementara update dari chat yang sama menjaga urutan kedatangannya sehingga session, wizard, dan conversation tetap benar dan penulisan session tidak pernah hilang. Burst konkuren hanya memicu satu inisialisasi `getMe`.
- **Tidak ada throttling proaktif.** Permintaan keluar tidak pernah ditunda oleh library. Ketika Telegram menjawab 429, transport menunggu tepat jendela `retry_after` yang diperintahkan Telegram ("flood gate" global melindungi seluruh trafik) lalu otomatis retry — sehingga burst tetap terkirim lengkap, bukan gagal.
- **Broadcast ke 1000+ user sekaligus.** `bot.broadcast()` langsung mencoba semua chat, me-retry 429 sesuai `retry_after` dari Telegram sendiri, dan mengembalikan laporan lengkap.

```ts
const report = await bot.broadcast(
  subscriberIds,
  (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "Newsletter #42" }),
  { onProgress: (p) => console.log(`${p.delivered}/${p.total} terkirim`) },
);
console.log(`Terkirim ${report.delivered}/${report.total} dalam ${report.durationMs}ms`);
```

Batasi pekerjaan simultan dengan `new Bot({ ..., updates: { concurrency: 64 } })` atau `broadcast(..., { concurrency: 64 })` jika downstream Anda (database, API) membutuhkannya — secara default keduanya berjalan sepenuhnya paralel.

## State, queue, scheduler, dan cache

Paket menyediakan `MemoryStorage` dengan TTL dan pembaruan atomik, `JsonFileStorage`, `RedisStorage`, `SqlStorage`, `MongoStorage`, persistent application state storage, session bot, conversation dan form berbasis Storage, menu berbasis permission, pagination `MenuController`, `MemoryCache`, token-bucket limiter, task queue dengan retry/backoff/concurrency/delay/cancel, serta scheduler interval, one-shot, dan cron lima field lengkap. Adapter Redis, SQL, dan Mongo memakai driver kecil sehingga core package tetap tanpa runtime dependency vendor.

## Pengalaman terminal

Saat bot dinyalakan di terminal interaktif (`npm start`, `node index.js`, `telebibz start`), telebibz memainkan urutan startup: efek ketik `Installing Dependencies......`, glass progress bar dengan kilau menyapu, dan banner ASCII rainbow animasi **Tele Bibz** (font figlet `Speed`) yang terus mengalir sampai bot terhubung, lalu diam dengan `✓ Connected as @<username>`.

Setelah itu, setiap update yang masuk ditampilkan dalam baris log yang mudah dibaca, dan error otomatis berwarna merah lengkap dengan stack-nya:

```text
[ => ] Message From 123456789 John Doe 29/08/2026 15:04:05
        ↳ Text: /start
[ => ] Callback From 123456789 John Doe 29/08/2026 15:04:07
        ↳ Data: menu:open
```

Teks pesan/command biasa dibatasi 50 karakter; data tombol callback ditampilkan penuh. Matikan dengan `branding: false` pada `Bot`, atau pakai `logger.format: "json"` untuk log terstruktur. Output non-interaktif (pipe, Docker, CI) otomatis fallback ke teks polos tanpa animasi.

## CLI

Command CLI seperti `telebibz doctor`, `init`, dan `webhook` diawali banner rainbow `Tele Bibz`. Animasi startup otomatis fallback ke output statis bersih saat stdout bukan TTY.

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
```

Branding terminal juga dapat dicetak dari aplikasi:

```ts
import { printTeleBibzBanner, printTerminalBranding } from "@xbibzlibrary/telebibz";

printTeleBibzBanner({ subtitle: "Bot saya" });
printTerminalBranding();
```

## Testing

```bash
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
```

E2E Telegram nyata memerlukan `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_TEST_CHAT_ID`. Tanpa kredensial, E2E akan dilewati dan tidak dihitung sebagai lulus.

## Web App dan pembayaran

`validateWebAppInitData()` memverifikasi signature dan expiration Telegram Web App. `PaymentsClient` menyediakan wrapper invoice link, invoice, jawaban pre-checkout, jawaban Web App query, transaksi Stars, dan refund Stars. Gunakan `TelegramTypes` serta alias seperti `TelegramUser`, `TelegramMessage`, dan `TelegramUpdate` untuk full Telegram declaration surface yang divendor.

## API target dan batasan

Daftar method dihasilkan dari dokumentasi Telegram Bot API saat skema diperbarui. Akses runtime tersedia untuk method resmi yang terdeteksi, sedangkan inferensi parameter/result khusus dipusatkan pada core method map. Full declaration Telegram untuk object, union, enum, dan method tersedia melalui `TelegramTypes`. Lihat [FEATURE_MATRIX.md](FEATURE_MATRIX.md) untuk status implementasi dan `docs/API.id.md` untuk referensi API lengkap.

## Otomatisasi release

Repository GitHub menyediakan CI dan workflow auto-publish. Setiap push ke `main` menjalankan quality gates, memilih patch version yang belum dipakai, membuat commit dan tag, menerbitkan package ke npmjs, lalu membuat GitHub Release. Karena source repository bersifat private, workflow menggunakan `--provenance=false`. GitHub Packages tersedia sebagai opsi terpisah jika organisasi GitHub dengan scope `xbibzlibrary` dibuat kemudian. Konfigurasikan secret `NPM_TOKEN` pada GitHub Actions sebelum mengandalkan publish otomatis. Lihat [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) dan panduan [GitHub Packages](docs/GITHUB_PACKAGES.id.md).

## Policy project dan kontribusi

| Dokumen | Tujuan |
|---|---|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Perilaku komunitas, penegakan, pelaporan, dan banding. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup lokal, branch/commit, test, review, dan release workflow. |
| [CONTRIBUTION_RULES.md](CONTRIBUTION_RULES.md) | Aturan API, compatibility, testing, dependency, security, dan release. |
| [GOVERNANCE.md](GOVERNANCE.md) | Peran, pengambilan keputusan, triage, perlindungan repository, dan perubahan aturan. |
| [SECURITY.md](SECURITY.md) | Pelaporan vulnerability privat, batas security, dan rotasi credential. |
| [SUPPORT.md](SUPPORT.md) | Channel support, aturan laporan aman, dan ekspektasi response. |
| [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) | Automation GitHub-to-npm dan setup `NPM_TOKEN`. |
| [RELEASE_POLICY.md](RELEASE_POLICY.md) | Kontrol immutable release dan hardening. |
| [NOTICE.md](NOTICE.md) | Atribusi declaration pihak ketiga. |

## Keamanan

Jangan commit token Telegram atau npm. Gunakan variabel lingkungan atau secret manager. Untuk kebijakan keamanan dan peningkatan keamanan rilis, lihat [SECURITY.md](SECURITY.md) dan [RELEASE_POLICY.md](RELEASE_POLICY.md).

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
