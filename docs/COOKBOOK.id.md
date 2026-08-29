# Cookbook produksi (Bahasa Indonesia)

Resep lengkap dan terverifikasi untuk kebutuhan bot sungguhan: rate limit per user, middleware auth, broadcast, tugas terjadwal, antrian background, menu berpaginasi, form, cache, validasi Mini App, dan pembayaran. Setiap resep berdiri sendiri — salin ke bot Anda dan sesuaikan namanya.

## Daftar isi

1. [Rate limit per user](#1-rate-limit-per-user)
2. [Middleware auth (allowlist / khusus admin)](#2-middleware-auth-allowlist--khusus-admin)
3. [Broadcast ke ribuan user](#3-broadcast-ke-ribuan-user)
4. [Pesan terjadwal (interval, sekali, cron)](#4-pesan-terjadwal-interval-sekali-cron)
5. [Job background dengan retry](#5-job-background-dengan-retry)
6. [Menu berpaginasi](#6-menu-berpaginasi)
7. [Menu dengan permission](#7-menu-dengan-permission)
8. [Form multi-step dengan validasi](#8-form-multi-step-dengan-validasi)
9. [Mengedit pesan dan inline keyboard](#9-mengedit-pesan-dan-inline-keyboard)
10. [Cache hasil mahal](#10-cache-hasil-mahal)
11. [Validasi initData Mini App](#11-validasi-initdata-mini-app)
12. [Pembayaran dengan Telegram Stars / invoice](#12-pembayaran-dengan-telegram-stars--invoice)
13. [Logging terstruktur dan hook metrik](#13-logging-terstruktur-dan-hook-metrik)

## 1. Rate limit per user

`TokenBucketLimiter` menjaga bucket independen per kunci — kuncikan berdasarkan user atau chat:

```ts
import { Bot, TokenBucketLimiter } from "@xbibzlibrary/telebibz";

const limiter = new TokenBucketLimiter(5, 0.5);   // burst 5, isi ulang 0.5 token/s (= 1 pesan per 2s berkelanjutan)

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.use(async (ctx, next) => {
  const key = `user:${ctx.from?.id ?? "anon"}`;
  const result = limiter.consume(key);
  if (!result.allowed) {
    const seconds = Math.ceil((result.retryAfterMs ?? 1000) / 1000);
    await ctx.reply(`⏳ Terlalu banyak permintaan. Coba lagi dalam ${seconds} detik.`);
    return;                                       // jangan panggil next(): update dijatuhkan
  }
  await next();
});
```

`consume(key, cost)` mendukung aksi berbobot (mis. unggahan biaya 5, teks biaya 1). `limiter.clear(key?)` mereset state. Kombinasikan dengan flood gate transport — limiter ini membentuk *user Anda*; flood gate mematuhi *Telegram*.

## 2. Middleware auth (allowlist / khusus admin)

```ts
const ADMINS = new Set([Number(process.env.ADMIN_ID)]);
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => {
  if (ADMINS.has(ctx.from?.id ?? 0)) return await next();   // admin: semua boleh
  if (ctx.chat?.type === "private") return await next();    // DM: diizinkan
  return undefined;                                          // grup: jatuhkan diam-diam
});

bot.command("stats", async (ctx) => {                       // route khusus admin
  if (!ADMINS.has(ctx.from?.id ?? 0)) return;
  await ctx.reply("Statistik rahasia");
});
```

## 3. Broadcast ke ribuan user

```ts
const report = await bot.broadcast(
  subscriberIds,
  (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "📰 Newsletter #42" }),
  {
    concurrency: 64,                       // batasi bila downstream Anda butuh (default: paralel penuh)
    onProgress: (p) => console.log(`${p.delivered}/${p.total}`),
  },
);

console.log(`Terkirim ${report.delivered}/${report.total} dalam ${report.durationMs}ms`);
for (const failure of report.failures) {
  console.error(`chat ${failure.chatId}: ${failure.error}`);
}
```

Setiap chat tetap dicoba; 429 di-retry tepat selama `retry_after` yang diperintahkan Telegram. Kegagalan tidak pernah membatalkan keseluruhan proses — semuanya masuk report.

## 4. Pesan terjadwal (interval, sekali, cron)

```ts
import { Scheduler, parseCronExpression, nextCronOccurrence } from "@xbibzlibrary/telebibz";

const scheduler = new Scheduler({ onError: (error, id) => console.error(`job ${id} gagal`, error) });

// Setiap 6 jam
scheduler.every("digest", 6 * 60 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: ADMIN_CHAT, text: "Ringkasan terjadwal" });
});

// Sekali, setelah 5 menit (pola pengingat)
scheduler.after("remind-42", 5 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "⏰ Pengingat!" });
});

// Cron: hari kerja 09:00 (ekspresi lima field)
scheduler.cron("morning", "0 9 * * 1-5", async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "Selamat pagi!" });
});

scheduler.cancel("digest");   // hentikan satu job
scheduler.clear();            // hentikan semua
```

Helper murni untuk test dan pratinjau — tanpa timer:

```ts
parseCronExpression("*/15 * * * *");          // field tervalidasi
nextCronOccurrence("0 9 * * 1", new Date());  // eksekusi berikutnya sebagai Date
```

## 5. Job background dengan retry

```ts
import { TaskQueue } from "@xbibzlibrary/telebibz";

const queue = new TaskQueue(
  async (job) => {
    await fetch(`https://api.example.com/process`, { method: "POST", body: JSON.stringify(job.data) });
  },
  { concurrency: 8, retries: 3, backoffMs: 500, maxBackoffMs: 30_000, onError: (error, job) => log.error("job gagal", { job: job.id, error }) },
);

bot.command("process", async (ctx) => {
  const job = queue.add({ url: ctx.message?.text?.split(" ")[1] }, { priority: 10 });  // lebih tinggi lebih dulu
  await ctx.reply(`Job ${job.id} masuk antrian`);
});

bot.command("cancel", async (ctx) => {
  const id = ctx.message?.text?.split(" ")[1];
  if (id && queue.cancel(id)) await ctx.reply("Dibatalkan");
});
```

## 6. Menu berpaginasi

`MenuController` merender satu halaman sekaligus dan me-routing callback navigasi:

```ts
import { Bot, MenuController, InlineKeyboard } from "@xbibzlibrary/telebibz";

const products = Array.from({ length: 57 }, (_v, i) => ({ id: i + 1, name: `Produk ${i + 1}` }));

const menu = new MenuController({
  id: "products",
  items: () => products,                 // atau async () => await db.products()
  pageSize: 10,
  label: (item) => item.name,
  callback: async (item) => { /* user memilih sebuah produk */ },
  labels: { previous: "◀", next: "▶" },
});

bot.callback("products:*", async (ctx) => {
  // Lewatkan data callback LENGKAP — controller mengharapkan prefix "products:"-nya sendiri.
  const result = await menu.handle(ctx.callbackQuery?.data ?? "");
  if (result === undefined) return void (await ctx.answerCallbackQuery());
  if (result.type === "noop") return void (await ctx.answerCallbackQuery());
  if (result.type === "page") {
    await ctx.reply(`Halaman ${result.page.page + 1}/${result.page.pageCount}`, { reply_markup: result.keyboard });
  } else {
    await ctx.answerCallbackQuery(`Dipilih: ${result.item.name}`);
  }
});
bot.command("shop", async (ctx) => {
  const result = await menu.handle("products:page:0");       // "<id>:page:<n>"
  if (result?.type === "page") await ctx.reply("Produk:", { reply_markup: result.keyboard });
});
```

## 7. Menu dengan permission

```ts
import { Menu } from "@xbibzlibrary/telebibz";

const menu = new Menu("main")
  .breadcrumb("Beranda")
  .item({ id: "profile", label: "👤 Profil", callbackData: "open:profile" })
  .item({ id: "stats", label: "📊 Statistik", permission: (context) => context.permissions?.includes("admin") ?? false })
  .item({ id: "help", label: "❓ Bantuan", url: "https://example.com/help" });

// build() async: ia mengevaluasi visibilitas/permission untuk context yang diberikan.
const keyboard = await menu.build({ permissions: ["admin"] }, { columns: 1, includeBreadcrumbs: true });
await ctx.reply("Menu utama:", { reply_markup: keyboard.build() });
```

`visible` menyembunyikan item sepenuhnya; `permission` menerima `MenuContext` Anda (`{ userId, permissions }`).

## 8. Form multi-step dengan validasi

```ts
import { Bot, Form, validators } from "@xbibzlibrary/telebibz";

const registration = new Form({
  name: { parse: validators.string, required: true },
  age: { parse: validators.integer, validate: (age) => (age >= 13 ? undefined : "Minimal 13 tahun") },
  email: { parse: validators.email },
});
```

Sambungkan lewat step `Wizard` atau `ConversationManager` — beri satu field per pesan; `validators` mencakup `string`, `number`, `integer`, `email`, `url`, dan cek kustom mengembalikan pesan errornya.

## 9. Mengedit pesan dan inline keyboard

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

bot.action("vote:up", async (ctx) => {
  votes += 1;
  const keyboard = new InlineKeyboard()
    .text(`👍 ${votes}`, "vote:up")
    .text("👎 0", "vote:down")
    .build();
  // Tukar keyboard pesan tombol tersebut di tempat
  await ctx.api.methods.editMessageReplyMarkup({
    chat_id: ctx.chat!.id,
    message_id: ctx.callbackQuery!.message!.message_id,
    reply_markup: keyboard,
  });
  await ctx.answerCallbackQuery();                        // hentikan spinner
});
```

`ctx.edit(text, extra)` menulis ulang teks pesan saat ini (keyboard ikut lewat `reply_markup` di `extra`); `editMessageLiveLocation`, `stopPoll`, dan seluruh surface method tersedia di `ctx.api.methods`. Data tombol dibatasi **64 byte** — builder memvalidasi saat konstruksi, bukan crash saat runtime.

## 10. Cache hasil mahal

```ts
import { MemoryCache } from "@xbibzlibrary/telebibz";

const weather = new MemoryCache<string>("weather");   // namespace; TTL di-set per penulisan
bot.command("weather", async (ctx) => {
  const city = ctx.message?.text?.split(" ")[1] ?? "Jakarta";
  let text = await weather.get(city);
  if (text === undefined) {
    text = await fetchWeather(city);
    await weather.set(city, text, 5 * 60 * 1000);     // cache 5 menit
  }
  await ctx.reply(text);
});
```

## 11. Validasi initData Mini App

```ts
import { validateWebAppInitData } from "@xbibzlibrary/telebibz";

bot.command("app", async (ctx) => {
  await ctx.reply("Buka aplikasinya:", {
    reply_markup: new InlineKeyboard().webApp("🚀 Buka", "https://app.example.com").build(),
  });
});

// Di endpoint backend aplikasi Anda — verifikasi yang dikirim Mini App:
app.post("/api/data", express.json(), (req, res) => {
  try {
    const initData = validateWebAppInitData(req.body.initData, process.env.TELEGRAM_BOT_TOKEN!, 3600);
    res.json({ user: initData.user, ok: true });      // signature + kesegaran terverifikasi
  } catch {
    res.status(401).json({ ok: false });
  }
});
```

`validateWebAppInitData` memeriksa signature HMAC dan jendela kesegaran `auth_date` (default 24 jam; di sini 1 jam).

## 12. Pembayaran dengan Telegram Stars / invoice

```ts
import { Bot, PaymentsClient, InlineKeyboard } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const payments = new PaymentsClient(bot.api);

// Link yang berfungsi di mana saja (bio, website, chat)
const link = await payments.createInvoiceLink({
  title: "Premium",
  description: "30 hari premium",
  payload: "premium-30d",
  currency: "XTR",
  prices: [{ label: "Premium", amount: 100 }],
});
await ctx.reply(`Bayar di sini: ${link}`);

// Invoice dalam chat + pre-checkout + pembayaran sukses
bot.on("pre_checkout_query", async (ctx) => {
  const query = ctx.update.pre_checkout_query;
  if (!query) return;
  await ctx.api.methods.answerPreCheckoutQuery({ pre_checkout_query_id: query.id, ok: true });
});
bot.on("message:successful_payment", async (ctx) => {
  await ctx.reply("✅ Pembayaran diterima. Terima kasih!");
});

// Riwayat Stars & refund
const history = await payments.getStarTransactions({ limit: 50 });
await payments.refundStarPayment({ user_id: userId, telegram_payment_charge_id: "charge-id" });
```

## 13. Logging terstruktur dan hook metrik

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  logger: { level: "info", format: "json" },   // baris machine-readable untuk ingestion
});

bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) console.warn(JSON.stringify({ event: "slow_api", method, durationMs }));
});
bot.events.on("update:error", ({ error }) => {
  console.error(JSON.stringify({ event: "handler_error", error: String(error) }));
});
```

Nilai sensitif (token, nomor telepon) otomatis di-redact; `includeUpdateContent: true` mengaktifkan pencatatan teks pesan bila benar-benar diperlukan.

English: [COOKBOOK.md](COOKBOOK.md) · 简体中文: [COOKBOOK.zh-CN.md](COOKBOOK.zh-CN.md)
