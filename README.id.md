# telebibz

![telebibz logo](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-logo.png)

**`@xbibzlibrary/telebibz`** adalah SDK dan framework Telegram Bot untuk Node.js dan TypeScript. Paket ini menyediakan API client, polling, router, middleware, context, keyboard builder, state/session, webhook handler, queue, scheduler, cache, plugin lifecycle, CLI, dan utilitas pengujian.

[English](README.md) · **Bahasa Indonesia** · [简体中文](README.zh-CN.md)

Referensi API lengkap: [English](docs/API.md) · **Indonesia** · [中文](docs/API.zh-CN.md)

![overview telebibz](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

## Instalasi

```bash
npm install @xbibzlibrary/telebibz
```

Node.js **20 atau lebih baru** diperlukan.

## Bot sederhana

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", (ctx) => ctx.reply("Bot aktif."));
bot.onText("ping", (ctx) => ctx.reply("pong"));

await bot.start();
```

`Bot.start()` menjalankan long polling. Untuk siklus hidup manual, gunakan `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, atau `restart()`.

## Router dan middleware

```ts
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`processed in ${Date.now() - started}ms`);
});

bot.command("help", (ctx) => ctx.reply("Bantuan tersedia."));
bot.onRegex(/^order:(\\d+)$/, (ctx) => ctx.reply("Order diterima."));
bot.callback("profile:*", (ctx) => ctx.answerCallbackQuery("Dibuka."));
```

Router mendukung command, text, regex, pola callback, predikat kustom, router bersarang, middleware per rute, dan prioritas rute.

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

This package starts directly after Telegram API connectivity is established. The terminal prints a boxed telebibz attribution, an animated startup status when attached to a TTY, and structured colorful logs for lifecycle, API, polling, webhook, and update events. Set logger format to `json` for machine ingestion.

## Webhook

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

`createWebhookHandler` menerima Request Web standar dan menghasilkan Response. Secret token, ukuran body, parsing JSON, dan penanganan update duplikat diverifikasi oleh handler.

## State, queue, scheduler, dan cache

Paket menyediakan `MemoryStorage` dengan TTL dan pembaruan atomik, `JsonFileStorage`, `RedisStorage`, `SqlStorage`, `MongoStorage`, persistent application state storage, session bot, conversation dan form berbasis Storage, menu berbasis permission, pagination `MenuController`, `MemoryCache`, token-bucket limiter, task queue dengan retry/backoff/concurrency/delay/cancel, serta scheduler interval, one-shot, dan cron lima field lengkap. Adapter Redis, SQL, dan Mongo memakai driver kecil sehingga core package tetap tanpa runtime dependency vendor.

## CLI

Setiap command `telebibz` menampilkan kotak branding Unicode berwarna dengan tulisan `Library Bot Telegram By @xbibzofficial`. CLI tidak mencetak target developer.

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
```

Branding terminal juga dapat dicetak dari aplikasi:

```ts
import { printTerminalBranding } from "@xbibzlibrary/telebibz";

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

Repository GitHub menyediakan CI dan workflow auto-publish. Setiap push ke `main` menjalankan quality gates, memilih patch version yang belum dipakai, membuat commit dan tag, menerbitkan package ke npm, lalu membuat GitHub Release. Karena source repository bersifat private, workflow menggunakan `--provenance=false`, sesuai batasan npm untuk source private. Konfigurasikan secret `NPM_TOKEN` pada GitHub Actions sebelum mengandalkan publish otomatis. Lihat [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md).

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
