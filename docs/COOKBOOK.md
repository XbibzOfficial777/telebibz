# Production cookbook (English)

Complete, verified recipes for the things real bots need: per-user rate limiting, auth middleware, broadcasts, scheduled jobs, background queues, menus with pagination, forms, caching, Mini App validation, and payments. Each recipe is self-contained — copy it into your bot and adjust names.

## Contents

1. [Per-user rate limiting](#1-per-user-rate-limiting)
2. [Auth middleware (allowlist / admin only)](#2-auth-middleware-allowlist--admin-only)
3. [Broadcast to thousands of users](#3-broadcast-to-thousands-of-users)
4. [Scheduled messages (interval, one-shot, cron)](#4-scheduled-messages-interval-one-shot-cron)
5. [Background jobs with retries](#5-background-jobs-with-retries)
6. [Paginated menus](#6-paginated-menus)
7. [Permission-aware menus](#7-permission-aware-menus)
8. [Multi-step forms with validation](#8-multi-step-forms-with-validation)
9. [Editing messages and inline keyboards](#9-editing-messages-and-inline-keyboards)
10. [Caching expensive results](#10-caching-expensive-results)
11. [Mini App initData validation](#11-mini-app-initdata-validation)
12. [Payments with Telegram Stars / invoices](#12-payments-with-telegram-stars--invoices)
13. [Structured logging and metrics hooks](#13-structured-logging-and-metrics-hooks)

## 1. Per-user rate limiting

`TokenBucketLimiter` keeps an independent bucket per key — key it by user or chat:

```ts
import { Bot, TokenBucketLimiter } from "@xbibzlibrary/telebibz";

const limiter = new TokenBucketLimiter(5, 0.5);   // burst of 5, refill 0.5 token/s (= 1 msg per 2s sustained)

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.use(async (ctx, next) => {
  const key = `user:${ctx.from?.id ?? "anon"}`;
  const result = limiter.consume(key);
  if (!result.allowed) {
    const seconds = Math.ceil((result.retryAfterMs ?? 1000) / 1000);
    await ctx.reply(`⏳ Terlalu banyak permintaan. Coba lagi dalam ${seconds} detik.`);
    return;                                       // do not call next(): update is dropped
  }
  await next();
});
```

`consume(key, cost)` supports weighted actions (e.g. uploads cost 5, text costs 1). `limiter.clear(key?)` resets state. Combine with the transport flood gate — this limiter shapes *your users*; the flood gate obeys *Telegram*.

## 2. Auth middleware (allowlist / admin only)

```ts
const ADMINS = new Set([Number(process.env.ADMIN_ID)]);
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => {
  if (ADMINS.has(ctx.from?.id ?? 0)) return await next();   // admins: everything
  if (ctx.chat?.type === "private") return await next();    // DMs: allowed
  return undefined;                                          // groups: silent drop
});

bot.command("stats", async (ctx) => {                       // admin-only route
  if (!ADMINS.has(ctx.from?.id ?? 0)) return;
  await ctx.reply("Secret stats");
});
```

## 3. Broadcast to thousands of users

```ts
const report = await bot.broadcast(
  subscriberIds,
  (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "📰 Newsletter #42" }),
  {
    concurrency: 64,                       // cap when your downstream needs it (default: fully parallel)
    onProgress: (p) => console.log(`${p.delivered}/${p.total}`),
  },
);

console.log(`Delivered ${report.delivered}/${report.total} in ${report.durationMs}ms`);
for (const failure of report.failures) {
  console.error(`chat ${failure.chatId}: ${failure.error}`);
}
```

Every chat is attempted; 429s are retried after exactly the `retry_after` Telegram orders. Failures never abort the run — they land in the report.

## 4. Scheduled messages (interval, one-shot, cron)

```ts
import { Scheduler, parseCronExpression, nextCronOccurrence } from "@xbibzlibrary/telebibz";

const scheduler = new Scheduler({ onError: (error, id) => console.error(`job ${id} failed`, error) });

// Every 6 hours
scheduler.every("digest", 6 * 60 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: ADMIN_CHAT, text: "Scheduled digest" });
});

// Once, after 5 minutes (reminder pattern)
scheduler.after("remind-42", 5 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "⏰ Reminder!" });
});

// Cron: weekdays 09:00 (five-field expression)
scheduler.cron("morning", "0 9 * * 1-5", async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "Good morning!" });
});

scheduler.cancel("digest");   // stop one job
scheduler.clear();            // stop all
```

Pure helpers for tests and previews — no timers involved:

```ts
parseCronExpression("*/15 * * * *");          // validated fields
nextCronOccurrence("0 9 * * 1", new Date());  // the next run as a Date
```

## 5. Background jobs with retries

```ts
import { TaskQueue } from "@xbibzlibrary/telebibz";

const queue = new TaskQueue(
  async (job) => {
    await fetch(`https://api.example.com/process`, { method: "POST", body: JSON.stringify(job.data) });
  },
  { concurrency: 8, retries: 3, backoffMs: 500, maxBackoffMs: 30_000, onError: (error, job) => log.error("job failed", { job: job.id, error }) },
);

bot.command("process", async (ctx) => {
  const job = queue.add({ url: ctx.message?.text?.split(" ")[1] }, { priority: 10 });  // higher runs first
  await ctx.reply(`Queued job ${job.id}`);
});

bot.command("cancel", async (ctx) => {
  const id = ctx.message?.text?.split(" ")[1];
  if (id && queue.cancel(id)) await ctx.reply("Cancelled");
});
```

## 6. Paginated menus

`MenuController` renders one page at a time and routes `prev:`/`next:` callbacks:

```ts
import { Bot, MenuController, InlineKeyboard } from "@xbibzlibrary/telebibz";

const products = Array.from({ length: 57 }, (_v, i) => ({ id: i + 1, name: `Product ${i + 1}` }));

const menu = new MenuController({
  id: "products",
  items: () => products,                 // or an async () => await db.products()
  pageSize: 10,
  label: (item) => item.name,
  callback: async (item) => { /* user picked a product */ },
  labels: { previous: "◀", next: "▶" },
});

bot.callback("products:*", async (ctx) => {
  // Pass the FULL callback data — the controller expects its own "products:" prefix.
  const result = await menu.handle(ctx.callbackQuery?.data ?? "");
  if (result === undefined) return void (await ctx.answerCallbackQuery());
  if (result.type === "noop") return void (await ctx.answerCallbackQuery());
  if (result.type === "page") {
    await ctx.reply(`Halaman ${result.page.page + 1}/${result.page.pageCount}`, { reply_markup: result.keyboard });
  } else {
    await ctx.answerCallbackQuery(`Picked: ${result.item.name}`);
  }
});
bot.command("shop", async (ctx) => {
  const result = await menu.handle("products:page:0");       // "<id>:page:<n>"
  if (result?.type === "page") await ctx.reply("Products:", { reply_markup: result.keyboard });
});
```

## 7. Permission-aware menus

```ts
import { Menu } from "@xbibzlibrary/telebibz";

const menu = new Menu("main")
  .breadcrumb("Home")
  .item({ id: "profile", label: "👤 Profile", callbackData: "open:profile" })
  .item({ id: "stats", label: "📊 Stats", permission: (context) => context.permissions?.includes("admin") ?? false })
  .item({ id: "help", label: "❓ Help", url: "https://example.com/help" });

// build() is async: it evaluates visibility/permissions for the given context.
const keyboard = await menu.build({ permissions: ["admin"] }, { columns: 1, includeBreadcrumbs: true });
await ctx.reply("Main menu:", { reply_markup: keyboard.build() });
```

`visible` hides items entirely; `permission` receives your `MenuContext` (`{ userId, permissions }`).

## 8. Multi-step forms with validation

```ts
import { Bot, Form, validators } from "@xbibzlibrary/telebibz";

const registration = new Form({
  name: { parse: validators.string, required: true },
  age: { parse: validators.integer, validate: (age) => (age >= 13 ? undefined : "Must be 13+") },
  email: { parse: validators.email },
});
```

Wire it through a `Wizard` step or `ConversationManager` — feed one field per message; `validators` covers `string`, `number`, `integer`, `email`, `url`, and custom checks return the error message.

## 9. Editing messages and inline keyboards

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

bot.action("vote:up", async (ctx) => {
  votes += 1;
  const keyboard = new InlineKeyboard()
    .text(`👍 ${votes}`, "vote:up")
    .text("👎 0", "vote:down")
    .build();
  // Swap the keyboard of the button's message in place
  await ctx.api.methods.editMessageReplyMarkup({
    chat_id: ctx.chat!.id,
    message_id: ctx.callbackQuery!.message!.message_id,
    reply_markup: keyboard,
  });
  await ctx.answerCallbackQuery();                        // stop the spinner
});
```

`ctx.edit(text, extra)` rewrites the current message's text (keyboard included via `reply_markup` in `extra`); `editMessageLiveLocation`, `stopPoll`, and the full method surface are available on `ctx.api.methods`. Button data is limited to **64 bytes** — the builder validates at construction time, not at runtime crash time.

## 10. Caching expensive results

```ts
import { MemoryCache } from "@xbibzlibrary/telebibz";

const weather = new MemoryCache<string>("weather");   // namespace; TTL is set per write
bot.command("weather", async (ctx) => {
  const city = ctx.message?.text?.split(" ")[1] ?? "Jakarta";
  let text = await weather.get(city);
  if (text === undefined) {
    text = await fetchWeather(city);
    await weather.set(city, text, 5 * 60 * 1000);     // cache for 5 minutes
  }
  await ctx.reply(text);
});
```

## 11. Mini App initData validation

```ts
import { validateWebAppInitData } from "@xbibzlibrary/telebibz";

bot.command("app", async (ctx) => {
  await ctx.reply("Open the app:", {
    reply_markup: new InlineKeyboard().webApp("🚀 Open", "https://app.example.com").build(),
  });
});

// In your app's backend endpoint — verify what the Mini App sends:
app.post("/api/data", express.json(), (req, res) => {
  try {
    const initData = validateWebAppInitData(req.body.initData, process.env.TELEGRAM_BOT_TOKEN!, 3600);
    res.json({ user: initData.user, ok: true });      // signature + freshness verified
  } catch {
    res.status(401).json({ ok: false });
  }
});
```

`validateWebAppInitData` checks the HMAC signature and the `auth_date` freshness window (default 24 h; here 1 h).

## 12. Payments with Telegram Stars / invoices

```ts
import { Bot, PaymentsClient, InlineKeyboard } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const payments = new PaymentsClient(bot.api);

// Link that works anywhere (bio, website, chat)
const link = await payments.createInvoiceLink({
  title: "Premium",
  description: "30 days of premium",
  payload: "premium-30d",
  currency: "XTR",
  prices: [{ label: "Premium", amount: 100 }],
});
await ctx.reply(`Pay here: ${link}`);

// In-chat invoice + pre-checkout + successful payment
bot.on("pre_checkout_query", async (ctx) => {
  const query = ctx.update.pre_checkout_query;
  if (!query) return;
  await ctx.api.methods.answerPreCheckoutQuery({ pre_checkout_query_id: query.id, ok: true });
});
bot.on("message:successful_payment", async (ctx) => {
  await ctx.reply("✅ Payment received. Thank you!");
});

// Stars history & refunds
const history = await payments.getStarTransactions({ limit: 50 });
await payments.refundStarPayment({ user_id: userId, telegram_payment_charge_id: "charge-id" });
```

## 13. Structured logging and metrics hooks

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  logger: { level: "info", format: "json" },   // machine-readable lines for ingestion
});

bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) console.warn(JSON.stringify({ event: "slow_api", method, durationMs }));
});
bot.events.on("update:error", ({ error }) => {
  console.error(JSON.stringify({ event: "handler_error", error: String(error) }));
});
```

Sensitive values (tokens, phone numbers) are redacted automatically; `includeUpdateContent: true` opts into logging message text when you truly need it.

Bahasa Indonesia: [COOKBOOK.id.md](COOKBOOK.id.md) · 简体中文: [COOKBOOK.zh-CN.md](COOKBOOK.zh-CN.md)
