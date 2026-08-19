# telebibz

![telebibz logo](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@0.1.2/assets/telebibz-logo.png)

**`@xbibzlibrary/telebibz`** adalah SDK dan framework Telegram Bot untuk Node.js dan TypeScript. Paket ini menyediakan API client, polling, router, middleware, context, keyboard builder, state/session, webhook handler, queue, scheduler, cache, plugin lifecycle, CLI, dan utilitas pengujian.

[English](README.md) · **Bahasa Indonesia** · [简体中文](README.zh-CN.md)

Referensi API lengkap: [English](docs/API.md) · **Indonesia** · [中文](docs/API.zh-CN.md)

![overview telebibz](assets/telebibz-readme-preview.png)

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
bot.callback("profile:", (ctx) => ctx.answerCallbackQuery("Dibuka."));
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

## Persetujuan pemilik

Gerbang persetujuan menahan pembaruan biasa sampai pemilik menyetujui bot melalui tombol **Izinkan** atau **Tidak Diizinkan**.

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  approval: {
    ownerChatId: Number(process.env.TELEBIBZ_OWNER_CHAT_ID),
    ownerUserId: Number(process.env.TELEBIBZ_OWNER_USER_ID),
    ownerLabel: "Dev Gantenggg",
    requireApproval: true,
  },
});
```

Library mengirim notifikasi ke `ownerChatId`, sedangkan hanya `ownerUserId` yang dapat mengambil keputusan. Callback menggunakan nonce acak. Untuk deployment multi-instance, gunakan `ApprovalStore` persisten melalui database atau Redis; default-nya adalah memory store.

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

Paket menyediakan `MemoryStorage` dengan TTL dan pembaruan atomik, `JsonFileStorage`, `RedisStorage`, `SqlStorage`, `MongoStorage`, persistent approval storage, session bot, conversation dan form berbasis Storage, menu berbasis permission, pagination `MenuController`, `MemoryCache`, token-bucket limiter, task queue dengan retry/backoff/concurrency/delay/cancel, serta scheduler interval, one-shot, dan cron lima field lengkap. Adapter Redis, SQL, dan Mongo memakai driver kecil sehingga core package tetap tanpa runtime dependency vendor.

## CLI

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
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

Daftar method dihasilkan dari dokumentasi Telegram Bot API saat skema diperbarui. Akses runtime tersedia untuk method resmi yang terdeteksi, sedangkan inferensi parameter/result khusus dipusatkan pada core method map. Full declaration Telegram untuk object, union, enum, dan method tersedia melalui `TelegramTypes`. Lihat [FEATURE_MATRIX.md](FEATURE_MATRIX.md) untuk status implementasi dan [APPROVAL_FEATURE.md](APPROVAL_FEATURE.md) untuk detail persetujuan.

## Otomatisasi release

Repository GitHub menyediakan CI dan workflow auto-publish. Setiap push ke `main` menjalankan quality gates, memilih patch version yang belum dipakai, membuat commit dan tag, menerbitkan package ke npm dengan provenance, lalu membuat GitHub Release. Konfigurasikan secret `NPM_TOKEN` pada GitHub Actions sebelum mengandalkan publish otomatis. Lihat [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md).

## Keamanan

Jangan commit token Telegram atau npm. Gunakan variabel lingkungan atau secret manager. Untuk kebijakan keamanan dan peningkatan keamanan rilis, lihat [SECURITY.md](SECURITY.md) dan [RELEASE_POLICY.md](RELEASE_POLICY.md).

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
