# Migrating from Telegraf (English)

telebibz implements the Telegraf context surface and launch options deliberately, so most handlers port with little or no change. This guide maps every part of a Telegraf bot to its telebibz equivalent.

## Contents

1. [Side-by-side: a whole bot](#1-side-by-side-a-whole-bot)
2. [Concept map](#2-concept-map)
3. [Context methods](#3-context-methods)
4. [Launch options](#4-launch-options)
5. [Scenes → Wizards](#5-scenes--wizards)
6. [Session storage](#6-session-storage)
7. [Webhooks](#7-webhooks)
8. [What has no direct equivalent](#8-what-has-no-direct-equivalent)

## 1. Side-by-side: a whole bot

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
bot.command("start", async (ctx) => { await ctx.reply("Welcome!"); });   // named command, not bot.start()
bot.command("help", async (ctx) => { await ctx.reply("Help"); });
bot.action("menu:open", async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply("Menu"); });
bot.on("message", async (ctx) => { await ctx.reply("got it"); });
bot.catch(async (error) => { console.error(error); });

await bot.launch({ dropPendingUpdates: true });   // same option name
```

Only two mechanical differences: `bot.start(handler)` becomes `bot.command("start", handler)`, and `answerCbQuery()` becomes `answerCallbackQuery()`.

## 2. Concept map

| Telegraf | telebibz | Notes |
|---|---|---|
| `new Telegraf(token)` | `new Bot(token)` or `new Bot({ token, ... })` | |
| `bot.launch()` | `bot.launch()` / `bot.start()` | `mode: "polling"` is explicit on `launch` |
| `bot.stop()` | `bot.stop()` | telebibz drains in-flight handlers first |
| `bot.use(mw)` | `bot.use(mw)` | same middleware signature `(ctx, next)` |
| `bot.command(name, h)` | `bot.command(name, h)` | |
| `bot.on(filter, h)` | `bot.on(filter, h)` | same filter grammar (`message:photo`, arrays) |
| `bot.hears(trigger, h)` | `bot.hears(trigger, h)` | strings and RegExp |
| `bot.action(pattern, h)` | `bot.action(pattern, h)` | drop-in alias of `bot.callback` |
| `bot.catch(handler)` | `bot.catch(handler)` | receives `(error, ctx)` |
| `ctx.reply(text, extra)` | `ctx.reply(text, extra)` | |
| `ctx.telegram.callApi(m, p)` | `ctx.api.call(m, p)` / `ctx.api.raw(m, p)` | `raw` needs no type map entry |
| `ctx.telegram.api.config` | `transportOptions` on the `Bot` options | timeout, retries, flood gate |
| `Scenes.WizardScene` + `Stage` | `Wizard` + `bot.useWizard()` | see section 5 |
| `session` middleware | built-in `session` storage option | see section 6 |
| `webhookCallback(bot, app)` | `webhookCallback(bot, "express")` | framework is now an argument |
| Telegraf plugins (`telegraf-i18n`, …) | `bot.usePlugin({ install, onStop, dispose })` | explicit lifecycle |

## 3. Context methods

Every Telegraf context shortcut exists — including the ones Telegraf leaves to plugins:

- **Replies**: `reply`, `replyWithPhoto`, `replyWithDocument`, `replyWithVideo`, `replyWithAudio`, `replyWithVoice`, `replyWithAnimation`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup`, `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, `replyWithQuiz`, `replyWithDice`, `replyWithGame`, `replyWithInvoice`, `replyWithHTML`, `replyWithMarkdown` (+V2)
- **Admin/moderation**: `banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `banChatSenderChat`, `unbanChatSenderChat`
- **Chat**: `setChatTitle`, `setChatDescription`, `setChatPhoto`, `deleteChatPhoto`, `setChatPermissions`, `leaveChat`, `unpinAllChatMessages`, `setChatStickerSet`, `deleteChatStickerSet`
- **Info**: `getChat`, `getChatAdministrators`, `getChatMemberCount`, `getChatMember`
- **Invite links/join requests**: `exportChatInviteLink`, `createChatInviteLink`, `editChatInviteLink`, `revokeChatInviteLink`, `approveChatJoinRequest`, `declineChatJoinRequest`
- **Live location/polls/games**: `editMessageLiveLocation`, `stopMessageLiveLocation`, `stopPoll`, `setGameScore`, `getGameHighScores`
- **Forum**: full topic set (`createForumTopic` … `unhideGeneralForumTopic`)
- **New beyond Telegraf core**: `getFile` (typed), `downloadFile`, `edit` (rewrites the current message's text), plus standalone helpers exported from the package root — `validateUpload`/`assertValidUpload` — which are not context methods

Naming differences to fix while porting: `answerCbQuery` → `answerCallbackQuery`; `ctx.telegram` → `ctx.api`; keyboard helpers come from the package root (`InlineKeyboard`, `ReplyKeyboard`, `removeKeyboard`, `forceReply`) instead of `Markup`.

## 4. Launch options

| Telegraf | telebibz |
|---|---|
| `launch({ dropPendingUpdates })` | `launch({ dropPendingUpdates })` — identical |
| `handlerTimeout` (90 000 default) | `handlerTimeout` (90 000 default; `0` disables) |
| `contextType` option | `contextType` option — your `Context` subclass is instantiated for every update |
| `webhookReply` (per-update) | `webhookReply` on the handler / `handleUpdate` options |
| `telegraf.use(session(...))` | `new Bot({ session: new MemoryStorage() })` (or JSON/Redis/SQL/Mongo) |

## 5. Scenes → Wizards

Telegraf's `WizardScene` + `Stage` becomes a single `Wizard` with explicit steps and no global session keys:

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask-name", run: async (flow) => { flow.next(); await flow.ctx.reply("Name?"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`Hi ${flow.ctx.message?.text}!`); } });

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.useWizard(wizard);                                    // replaces Stage middleware
bot.command("start", async (ctx) => { await wizard.run(ctx); }); // replaces scene.enter()
```

- The wizard key derives automatically from chat + sender — no manual key management.
- `flow.set(key, value)` / `flow.get(key)` replace `ctx.scene.session`.
- `/cancel` cancels; the conversation completes automatically after the last step.
- For non-linear graphs, compose `ConversationManager` with the router (telebibz deliberately keeps scene orchestration application-owned; see FEATURE_MATRIX "Design decisions").

## 6. Session storage

Telegraf stores sessions in memory by default and needs a store plugin for persistence. telebibz takes storage on the constructor — swap the adapter, keep the code:

```ts
import { Bot, MemoryStorage, JsonFileStorage, RedisStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),   // or MemoryStorage / RedisStorage / SqlStorage / MongoStorage
});
```

Full wiring recipes for every adapter: [STORAGE.md](STORAGE.md).

## 7. Webhooks

```ts
// Telegraf: webhookCallback(bot, app)
// telebibz: framework is explicit
import { webhookCallback } from "@xbibzlibrary/telebibz";
app.post("/telegram", webhookCallback(bot, "express", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET }));
```

`createWebhookHandler()` additionally provides a Web-standard `Request → Response` handler for Bun/Deno/edge. Full deployment guide: [WEBHOOK.md](WEBHOOK.md).

## 8. What has no direct equivalent

- **`bot.telegram` low-level client** — use `bot.api` (`call`, `raw`, `methods`, `downloadFile`); the flood gate and retries are built into the transport rather than configurable per call.
- **Telegraf's plugin ecosystem** — port plugins as `Plugin` objects with an explicit lifecycle (`install`, `onStop`, `dispose`); the plugin manager restarts cleanly.
- **`Composer.mount`/dynamic scenes** — build with `Router` nesting and `matchMode: "all"` instead.
- **Markup helper chains** (`Markup.keyboard(...).resize()`) — use `new ReplyKeyboard().text("A").resized().build()`; same payloads, builder style.

Bahasa Indonesia: [MIGRATION_TELEGRAF.id.md](MIGRATION_TELEGRAF.id.md) · 简体中文: [MIGRATION_TELEGRAF.zh-CN.md](MIGRATION_TELEGRAF.zh-CN.md)
