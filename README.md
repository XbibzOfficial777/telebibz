# telebibz

![telebibz logo](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@0.1.2/assets/telebibz-logo.png)

**`@xbibzlibrary/telebibz`** adalah SDK dan framework Telegram Bot untuk Node.js dan TypeScript. Package ini menyediakan API client, polling, router, middleware, context, keyboard builder, state/session, webhook handler, queue, scheduler, cache, plugin lifecycle, CLI, dan testing utilities.

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

`Bot.start()` menjalankan long polling. Untuk lifecycle manual, gunakan `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, atau `restart()`.

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

Router mendukung command, text, regex, callback pattern, custom predicate, nested router, middleware per route, dan prioritas route.

## Telegram API

Generated method access dan raw access tersedia melalui API client:

```ts
await bot.api.methods.getMe();
await bot.api.methods.sendMessage({ chat_id: 123456789, text: "Halo." });
await bot.api.call("sendMessage", { chat_id: 123456789, text: "Halo." });
await bot.api.raw("futureTelegramMethod", { value: true });
```

Transport bawaan menggunakan `fetch`, timeout, retry, exponential backoff, JSON payload, dan multipart upload.

Referensi API lengkap untuk setiap class, function, method, type, error, lifecycle, CLI command, dan generated Telegram method tersedia di [`docs/API.md`](docs/API.md).

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

## Owner approval

Approval gate menahan update biasa sampai owner menyetujui bot melalui tombol **Izinkan** atau **Tidak Diizinkan**.

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

`createWebhookHandler` menerima Web standard `Request` dan menghasilkan `Response`. Secret token, ukuran body, parsing JSON, dan duplicate update handling diverifikasi oleh handler.

## State, queue, scheduler, dan cache

Package menyediakan `MemoryStorage` dengan TTL dan atomic update, session pada context, conversation/form primitives, menu/pagination, `MemoryCache`, token-bucket limiter, task queue dengan retry/backoff/concurrency/delay/cancel, serta scheduler interval, one-shot, dan simple cron. Adapter Redis, SQL, MongoDB, dan queue vendor harus disediakan oleh aplikasi atau package optional.

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

Real Telegram E2E memerlukan `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_TEST_CHAT_ID`. Tanpa credentials, E2E akan dilewati dan tidak dihitung sebagai lulus.

## API target dan batasan

Method list dihasilkan dari dokumentasi Telegram Bot API saat schema diperbarui. Method access tersedia untuk method resmi yang terdeteksi, tetapi tidak semua object, union, enum, dan optional adapter memiliki typing tingkat lanjut penuh. Lihat [FEATURE_MATRIX.md](FEATURE_MATRIX.md) untuk status implementasi dan [APPROVAL_FEATURE.md](APPROVAL_FEATURE.md) untuk detail approval.

## Keamanan

Jangan commit token Telegram atau npm. Gunakan environment variable atau secret manager. Untuk kebijakan keamanan dan release hardening, lihat [SECURITY.md](SECURITY.md) dan [RELEASE_POLICY.md](RELEASE_POLICY.md).

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
