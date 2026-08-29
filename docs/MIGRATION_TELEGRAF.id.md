# Migrasi dari Telegraf (Bahasa Indonesia)

telebibz mengimplementasikan surface context dan opsi launch Telegraf secara sengaja, sehingga sebagian besar handler bisa dipindah dengan sedikit atau tanpa perubahan. Panduan ini memetakan setiap bagian bot Telegraf ke padanannya di telebibz.

## Daftar isi

1. [Side-by-side: satu bot utuh](#1-side-by-side-satu-bot-utuh)
2. [Peta konsep](#2-peta-konsep)
3. [Method Context](#3-method-context)
4. [Opsi launch](#4-opsi-launch)
5. [Scenes → Wizards](#5-scenes--wizards)
6. [Penyimpanan session](#6-penyimpanan-session)
7. [Webhook](#7-webhook)
8. [Yang tidak punya ekuivalen langsung](#8-yang-tidak-punya-ekuivalen-langsung)

## 1. Side-by-side: satu bot utuh

**Telegraf**

```ts
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => { console.time("update"); await next(); console.timeEnd("update"); });
bot.start((ctx) => ctx.reply("Welcome!"));
bot.command("help", (ctx) => ctx.reply("Help"));
bot.action("menu:open", async (ctx) => { await ctx.answerCbQuery(); await ctx.reply("Menu"); });
bot.on("message", (ctx) => ctx.reply("got it"));
bot.catch((error) => console.error(error));

bot.launch({ dropPendingUpdates: true });
```

**telebibz**

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => { console.time("update"); await next(); console.timeEnd("update"); });
bot.command("start", async (ctx) => { await ctx.reply("Welcome!"); });   // command bernama, bukan bot.start()
bot.command("help", async (ctx) => { await ctx.reply("Help"); });
bot.action("menu:open", async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply("Menu"); });
bot.on("message", async (ctx) => { await ctx.reply("got it"); });
bot.catch(async (error) => { console.error(error); });

await bot.launch({ dropPendingUpdates: true });   // nama opsi sama
```

Hanya dua perbedaan mekanis: `bot.start(handler)` menjadi `bot.command("start", handler)`, dan `answerCbQuery()` menjadi `answerCallbackQuery()`.

## 2. Peta konsep

| Telegraf | telebibz | Catatan |
|---|---|---|
| `new Telegraf(token)` | `new Bot(token)` atau `new Bot({ token, ... })` | |
| `bot.launch()` | `bot.launch()` / `bot.start()` | `mode: "polling"` eksplisit di `launch` |
| `bot.stop()` | `bot.stop()` | telebibz men-drain handler yang sedang berjalan lebih dulu |
| `bot.use(mw)` | `bot.use(mw)` | signature middleware sama `(ctx, next)` |
| `bot.command(name, h)` | `bot.command(name, h)` | |
| `bot.on(filter, h)` | `bot.on(filter, h)` | grammar filter sama (`message:photo`, array) |
| `bot.hears(trigger, h)` | `bot.hears(trigger, h)` | string dan RegExp |
| `bot.action(pattern, h)` | `bot.action(pattern, h)` | alias drop-in dari `bot.callback` |
| `bot.catch(handler)` | `bot.catch(handler)` | menerima `(error, ctx)` |

## 3. Method Context

Setiap shortcut context Telegraf ada — termasuk yang di Telegraf diserahkan ke plugin:

- **Balasan**: `reply`, `replyWithPhoto`, `replyWithDocument`, `replyWithVideo`, `replyWithAudio`, `replyWithVoice`, `replyWithAnimation`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup`, `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, `replyWithQuiz`, `replyWithDice`, `replyWithGame`, `replyWithInvoice`, `replyWithHTML`, `replyWithMarkdown` (+V2)
- **Admin/moderasi**: `banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `banChatSenderChat`, `unbanChatSenderChat`
- **Chat**: `setChatTitle`, `setChatDescription`, `setChatPhoto`, `deleteChatPhoto`, `setChatPermissions`, `leaveChat`, `unpinAllChatMessages`, `setChatStickerSet`, `deleteChatStickerSet`
- **Info**: `getChat`, `getChatAdministrators`, `getChatMemberCount`, `getChatMember`
- **Invite link/join request**: `exportChatInviteLink`, `createChatInviteLink`, `editChatInviteLink`, `revokeChatInviteLink`, `approveChatJoinRequest`, `declineChatJoinRequest`
- **Live location/poll/game**: `editMessageLiveLocation`, `stopMessageLiveLocation`, `stopPoll`, `setGameScore`, `getGameHighScores`
- **Forum**: set topik lengkap (`createForumTopic` … `unhideGeneralForumTopic`)
- **Baru, melampaui core Telegraf**: `getFile` (typed), `downloadFile`, `edit` (menulis ulang teks pesan saat ini), plus helper mandiri yang diekspor dari root paket — `validateUpload`/`assertValidUpload` — yang bukan method context

Perbedaan penamaan yang harus diperbaiki saat porting: `answerCbQuery` → `answerCallbackQuery`; `ctx.telegram` → `ctx.api`; helper keyboard berasal dari root paket (`InlineKeyboard`, `ReplyKeyboard`, `removeKeyboard`, `forceReply`) alih-alih `Markup`.

## 4. Opsi launch

| Telegraf | telebibz |
|---|---|
| `launch({ dropPendingUpdates })` | `launch({ dropPendingUpdates })` — identik |
| `handlerTimeout` (default 90 000) | `handlerTimeout` (default 90 000; `0` menonaktifkan) |
| Opsi `contextType` | Opsi `contextType` — subclass `Context` Anda diinstansiasi untuk setiap update |
| `webhookReply` (per-update) | `webhookReply` pada opsi handler / `handleUpdate` |
| `telegraf.use(session(...))` | `new Bot({ session: new MemoryStorage() })` (atau JSON/Redis/SQL/Mongo) |

## 5. Scenes → Wizards

`WizardScene` + `Stage` milik Telegraf menjadi satu `Wizard` dengan step eksplisit dan tanpa kunci session global:

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask-name", run: async (flow) => { flow.next(); await flow.ctx.reply("Nama?"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`Hai ${flow.ctx.message?.text}!`); } });

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.useWizard(wizard);                                    // menggantikan middleware Stage
bot.command("start", async (ctx) => { await wizard.run(ctx); }); // menggantikan scene.enter()
```

- Kunci wizard diturunkan otomatis dari chat + pengirim — tanpa pengelolaan kunci manual.
- `flow.set(key, value)` / `flow.get(key)` menggantikan `ctx.scene.session`.
- `/cancel` membatalkan; conversation selesai otomatis setelah step terakhir.
- Untuk graf non-linear, susun `ConversationManager` dengan router (telebibz sengaja menjadikan orkestrasi scene milik aplikasi; lihat "Design decisions" di FEATURE_MATRIX).

## 6. Penyimpanan session

Telegraf menyimpan session di memori secara default dan butuh plugin store untuk persistensi. telebibz menerima storage di constructor — ganti adapter, pertahankan kode:

```ts
import { Bot, MemoryStorage, JsonFileStorage, RedisStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),   // atau MemoryStorage / RedisStorage / SqlStorage / MongoStorage
});
```

Resep wiring lengkap untuk setiap adapter: [STORAGE.id.md](STORAGE.id.md).

## 7. Webhook

```ts
// Telegraf: webhookCallback(bot, app)
// telebibz: framework eksplisit
import { webhookCallback } from "@xbibzlibrary/telebibz";
app.post("/telegram", webhookCallback(bot, "express", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET }));
```

`createWebhookHandler()` tambahan menyediakan handler Web-standard `Request → Response` untuk Bun/Deno/edge. Panduan deployment lengkap: [WEBHOOK.id.md](WEBHOOK.id.md).

## 8. Yang tidak punya ekuivalen langsung

- **Client low-level `bot.telegram`** — pakai `bot.api` (`call`, `raw`, `methods`, `downloadFile`); flood gate dan retry terpasang di transport, bukan dikonfigurasi per panggilan.
- **Ekosistem plugin Telegraf** — port plugin sebagai objek `Plugin` dengan lifecycle eksplisit (`install`, `onStop`, `dispose`); plugin manager di-restart dengan bersih.
- **`Composer.mount`/scene dinamis** — bangun dengan nesting `Router` dan `matchMode: "all"`.
- **Rantai helper Markup** (`Markup.keyboard(...).resize()`) — pakai `new ReplyKeyboard().text("A").resized().build()`; payload sama, gaya builder.

English: [MIGRATION_TELEGRAF.md](MIGRATION_TELEGRAF.md) · 简体中文: [MIGRATION_TELEGRAF.zh-CN.md](MIGRATION_TELEGRAF.zh-CN.md)
