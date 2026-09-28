<div align="center">

[🇬🇧 **English**](README.md) · [🇮 **Indonesia**](README.id.md)

<br>

<a href="https://www.npmjs.com/package/@xbibzlibrary/telebibz" title="Open telebibz on npm">
  <img src="https://imgbs.com/uploads/telebibz-d7b30671.png" alt="telebibz — Telegram Bot Library" width="560">
</a>

<br><br>

**The easiest Telegram bot library for Node.js — full feature set on par with grammY.**<br>
A standalone recode of [grammY](https://grammy.dev)'s elegant architecture, with production
dependencies that are *actually used*, and an Indonesia-first community.

<br>

[![npm version](https://img.shields.io/npm/v/@xbibzlibrary/telebibz?style=for-the-badge&logo=npm&logoColor=white&color=CB3837&label=telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![downloads](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=for-the-badge&logo=npm&logoColor=white&color=green&label=downloads%2Fmonth)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![node](https://img.shields.io/node/v/@xbibzlibrary/telebibz?style=for-the-badge&logo=node.js&logoColor=white&color=339933&label=node)](https://nodejs.org)
[![tests](https://img.shields.io/badge/tests-30%2F30%20passing-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](#-testing--live-proof)
[![size](https://img.shields.io/badge/code-1.7k%20lines-orange?style=for-the-badge&logo=codeigniter&logoColor=white)](#-analytics--statistics)
[![license](https://img.shields.io/npm/l/@xbibzlibrary/telebibz?style=for-the-badge&color=blue)](LICENSE)
[![views](https://komarev.com/ghpvc/?username=XbibzOfficial777&repo=telebibz&style=for-the-badge&color=blueviolet&label=repo+views)](https://github.com/XbibzOfficial777/telebibz)

<br>

`Xbibz Technology ID`

</div>

---

## 📑 Table of Contents

| | | |
|---|---|---|
| ⚡ [Why telebibz?](#why) | 📊 [Feature matrix vs grammY](#matrix) | 📥 [Installation & requirements](#install) |
| 🚀 [Quick start](#quickstart) | 🧠 [How it works (architecture)](#architecture) | 📖 [Full documentation](#docs) |
| 🎛️ [Handlers & filters](#handlers) | 💬 [Context shortcuts](#context) | 🔘 [Keyboards & buttons](#keyboards) |
| ️ [Interactive menus](#menus) | 🧙 [Wizard (forms + buttons + edit/delete)](#wizard) | ❓ [Inline mode](#inline) |
| 📣 [Broadcast](#broadcast) | 📎 [Files & media](#files) | 🛡️ [Reliability & rate limiting](#ratelimit) |
| 🗃️ [Sessions](#sessions) | 🇮🇩 [Human-readable errors](#errors) | 🕸️ [Webhooks & serverless](#webhook) |
| 🔌 [Proxy transport](#proxy) | 🧪 [Transformers](#transformers) | 📈 [Analytics & statistics](#analytics) |
| 🧩 [Examples](#examples) | 🔬 [Testing](#testing) | 📂 [Repo structure](#structure) |
| 🕐 [Changelog](#changelog) | 📄 [License](#license) | |

<a id="why"></a>
## ⚡ Why telebibz?

> [!TIP]
> **One principle:** every feature that needs a plugin in grammY is **built in** here —
> wizard, menus, rate limiting, broadcast, file download — and polling that *never dies* on 409.

- 🧠 **The grammY API you already know** — `bot.cmd()`, `bot.hears()`, `ctx.reply()`, middleware, transformers
- 🧙 **Built-in Wizard v3.1** — question-and-answer forms with **choice buttons** (reply/inline) and **edit/delete** message modes
- 🛡️ **Bulletproof** — 429 auto-retry, throttler, per-user limiter, polling auto-retry on 409 conflict
- 🇮🇩 **Human-readable errors** — every Telegram error is translated into a plain-language suggestion
- 🔌 **Proxy API for any method** — `api.anyMethod({...})` works automatically, even for methods not released yet
- 🪶 **Light & honest** — 4 dependencies, all genuinely used and tested

<a id="matrix"></a>
## 📊 Feature Matrix — grammY parity

| Feature | grammY | telebibz |
|---|:---:|:---:|
| Proxy API for **any method** (auto-generated) | ✅ | ✅ |
| ~60 typed shortcuts (sendMessage, banChatMember…) | ✅ | ✅ |
| Full Context (~70 shortcuts reply/edit/admin/react) | ✅ | ✅ |
| Business flavor (`business_connection_id` automatic) | plugin | ✅ built-in |
| Filters `on('message:photo' / ':text' / 'chat_type:private' …)` | ✅ | ✅ |
| `cmd / hears / action / inlineQuery` | ✅ | ✅ (+ inlineQuery matcher) |
| `branch / filter / drop / route / lazy / fork` | ✅ | ✅ |
| Error boundary + catch | ✅ | ✅ (all shortcuts auto-protected) |
| Session + swappable storage | ✅ | ✅ |
| Transformer API (`api.config.use`) | ✅ | ✅ |
| `auto-retry` on 429 honoring `retry_after` | plugin | ✅ built-in `autoRetry()` |
| Throttler queue | plugin | ✅ built-in `throttler()` |
| Per-user rate limit | plugin | ✅ built-in `limiter()` |
| `InputFile` Buffer/path/stream + multipart `attach://` | ✅ | ✅ |
| `InputMedia` builder + media groups | ✅ | ✅ `InputMediaBuilder` |
| File download (`getFile`/`downloadFile`) | plugin | ✅ built-in |
| Keyboard & InlineKeyboard fluent classes | ✅ | ✅ |
| Interactive menus | plugin | ✅ built-in `Menu/MenuContainer` |
| Wizard/conversations | plugin | ✅ built-in — **+ choice buttons & `edit`/`delete` modes** |
| 409-resilient long polling | ❌ (fatal crash) | ✅ built-in (auto-retry 5 s) |
| Broadcast ready to use | ❌ | ✅ `bot.broadcast()` |
| Humanized errors + suggestions | ❌ | ✅ `humanize()` |
| Boot banner + debug logging | ❌ | ✅ (`DEBUG=telebibz*`) |
| HTTP(S) proxy for VPS | ⚠️ manual | ✅ `proxy` transport option |
| TypeScript | ✅ full | loose d.ts (JS-first) |
| Documentation language | en | **🇬🇧 + 🇮🇩** |

<a id="install"></a>
## 📥 Installation & Requirements

**Requirements:** Node.js ≥ 18 (uses global `FormData`/`Blob` for uploads).

```bash
npm install @xbibzlibrary/telebibz
# or
yarn add @xbibzlibrary/telebibz
# or
pnpm add @xbibzlibrary/telebibz
```

**Runtime dependencies (all used, all tested):**

| Package | Purpose |
|---|---|
| `axios ^1.20` | keep-alive transport + streaming `downloadFile` |
| `mime-types ^3.0` | content-type detection for uploads |
| `https-proxy-agent ^9.1` | VPS proxy transport option |
| `debug ^4.4` | logging via `DEBUG=telebibz:net,telebibz:ratelimit` |

Get your bot token from **@BotFather** → `/newbot`. The constructor validates the token
format (`123456:ABC…`) and throws a helpful error if it's wrong.

<a id="quickstart"></a>
## 🚀 Quick Start

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz('TOKEN_FROM_BOTFATHER');

bot.cmd('start', (ctx) => ctx.reply('Hello!'));
bot.hears(/hello|hi/i, (ctx) => ctx.reply('hello there 👋'));
bot.hears('ping', (ctx) => ctx.reply('pong 🏓'));

bot.launch();
```

```bash
BOT_TOKEN=123:abc node index.js
```

```
◆ DEVELOPER  Xbibz Technology ID
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 TeleBibz ON                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  bot      : @yourbot (id 123456)      ┃
┃  mode     : long-polling              ┃
┃  library  : telebibz 3.1.2 (Node.js)  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
✔ waiting for updates… (Ctrl+C to stop)
```

> [!NOTE]
> **On a VPS:** if another bot instance is still polling (409 Conflict — e.g. double
> deploy or a hosting restart), telebibz **auto-retries every 5 seconds without
> crashing** and boots the moment the lane is free. No PM2 babysitting needed.

<a id="architecture"></a>
## 🧠 How It Works (Architecture)

```
                       ┌─────────────────────────────────────────────┐
 Telegram Bot API ────►│  long polling (lib/runner.js)               │
                       │  or webhook / handleUpdate (lib/telebibz.js)│
                       └──────────────────┬──────────────────────────┘
                                          │ raw update (JSON)
                                          ▼
                       Context(update, api, me)          lib/context.js
                                          │
             ┌────────────────────────────▼───────────────────────────┐
             │  Middleware tree `_root` (fixed order):                │
             │  1. session()                 lib/session.js           │
             │  2. wizard.middleware()       lib/wizard.js            │
             │  3. errorBoundary(reporter)                            │
             │       └─► your handlers: use/cmd/hears/action/on/      │
             │           inlineQuery/Menu/wizard      lib/composer.js │
             └────────────────────────────┬───────────────────────────┘
                                          │ ctx.reply / ctx.api.*
                                          ▼
             ApiBase + Proxy + transformer pipeline        lib/api.js
             (api.config.use → autoRetry / throttler)
                                          │
                                          ▼
             axios transport: JSON or multipart attach://  lib/net.js
                                          │
                                          ▼
                                 https://api.telegram.org
```

**Lifecycle of one update** (e.g. `/start`): `getUpdates` → `pollLoop` →
`handleUpdate` → new `Context` → session loads → wizard middleware (no active
wizard → pass) → error boundary → your matched handler runs → `ctx.reply()` →
transformer pipeline → axios → Telegram. Any thrown error becomes a `BotError`
and flows to `opts.onError` or the humanized reporter.

<a id="docs"></a>
## 📖 Full Documentation

### 🏗️ Constructor & options

```js
const bot = new TeleBibz('TOKEN', {
  allowedUpdates: [...],   // limit update types (default: common + Business types)
  onError: (err, ctx) {},  // custom error handler (default: humanized reporter)
  silent: false,           // hide boot banner
  dropPending: false,      // discard old updates on start
  session: { ... },        // { initial, getKey, storage } — see Sessions
  transport: fn,           // inject custom transport (testing / proxy)
});
```

<a id="handlers"></a>
### 🎛️ Handlers & filters

```js
bot.cmd('ping',           (ctx) => ctx.reply('pong'));     // /ping
bot.cmd(['a', 'b'],       handler);                        // /a OR /b
bot.start('Welcome!');    // shortcut: registers /start
bot.hears('daftar',       handler);   // exact text "daftar" (case-insensitive)
bot.hears(/kitt?y/i,      handler);   // any regex
bot.on('message:photo',   handler);   // grammY-style filters
bot.on([':text', 'chat_type:private'], handler);
bot.action('menu:premium', handler);  // callback_query data (string or RegExp)
bot.inlineQuery(/kucing/i, handler);  // inline mode (regex / string / '*')
bot.use(middleware);                  // manual middleware
```

Composer combinators (grammY semantics):

```js
bot.branch(pred, ifTrue, ifFalse);  // pick a subtree by predicate
bot.filter(pred, ...mw);            // run only when pred(ctx) is true
bot.drop(pred, ...mw);              // skip when pred(ctx) is true
bot.route('chat.type', { private: mwA, group: mwB });       // map ctx→handler
bot.lazy((ctx) => ctx.from.is_bot ? botMw : userMw);        // build mw per update
bot.fork(slowMw);                   // run in background, doesn't block next()
```

Filters supported by `on()`: update fields (`message`, `edited_message`,
`callback_query`, `inline_query`, `my_chat_member`, …), message props
(`message:photo`, `message:text`, `:caption`, `:document`, `:sticker`, `:media`, …),
chat types (`chat_type:private/group/supergroup/channel`), plus
`callback_query:data`, payments, reactions, join requests.

Command handlers receive arguments in `ctx.match`:

```js
bot.cmd('echo', (ctx) => ctx.reply(`args: ${ctx.match}`)); // /echo hello → "hello"
```

<a id="context"></a>
### 💬 Context shortcuts

`ctx` wraps every update kind (message, edited, channel, business, callback,
inline…) with unified accessors: `chat`, `from`, `chatId`, `msgId`, `msg`,
`senderChat`, `inlineMessageId`, `businessConnectionId`.

| Category | Shortcuts |
|---|---|
| **Reply** | `reply`, `replyWithHTML`, `replyWithMarkdown`, `replyWithPhoto/Video/Audio/Document/Animation/Voice/VideoNote/Sticker/MediaGroup/Location/Venue/Contact/Poll/Dice/Invoice/ChatAction` |
| **Edit & delete** | `editMessageText/Caption/Media/ReplyMarkup`, `deleteMessage`, `deleteMessages` — callback-aware & inline-message aware |
| **React** | `react('👍')` |
| **Forward/copy** | `forwardMessage(to)`, `copyMessage(to)` (defaults to current msg) |
| **Callbacks & inline** | `answerCallbackQuery` (string or object), `answerInlineQuery` |
| **Admin** | `banChatMember`, `restrictChatMember`, `promoteChatMember`, `banAuthor`, `restrictAuthor`, `getChat*`, `getAuthor`, `leaveChat`, `setChatTitle/Description`, `pin/unpinChatMessage` |
| **Files** | `getFile()` (smart: largest photo), `downloadFile(dest)` |

Business accounts: replies inside a business context automatically carry
`business_connection_id`.

<a id="rich-messages"></a>
### 🧱 Rich Messages, drafts, live photos & ephemeral messages (Bot API 10.3)

TeleBibz includes rich-message builders and Context helpers. All **185 Bot API
methods** are also available through typed `ctx.api.callApi(method, payload)`;
the proxy accepts newer methods using an object payload.

```js
const { rich, RichMessageBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('report', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Report', 2),
  rich.paragraph(['Status: ', rich.bold('success')]),
  rich.table([
    [{ text: 'Item', align: 'left', valign: 'middle', is_header: true },
     { text: 'Total', align: 'right', valign: 'middle', is_header: true }],
    [{ text: 'Orders', align: 'left', valign: 'middle' },
     { text: '3', align: 'right', valign: 'middle' }],
  ], { bordered: true, striped: true, compact: true }),
  rich.details('Notes', [rich.paragraph('Additional details')]),
  rich.buttons([rich.button('Open', { url: 'https://example.com' }, 'primary')]),
])));

// HTML, Markdown, media blocks, lists, quotes, maps, tables, collages,
// slideshows, buttons and rich-text entities (bold/customEmoji/dateTime, etc.) are supported.
const content = new RichMessageBuilder().markdown('**Hello!**').rtl().build();
await ctx.replyWithRichMessage(content);

// Live photo: both inputs may be Telegram file_ids or InputFile instances.
await ctx.replyWithLivePhoto('video-file-id', 'photo-file-id', { caption: 'Moment' });

// A draft is a temporary preview. Send the final rich message to persist it.
await ctx.sendRichMessageDraft(1, rich.draftBlocks([
  rich.paragraph('Writing…'), rich.thinking('Working'),
]), { can_stop: true, keep_on_stop: true });
await ctx.replyWithRichMessage(rich.markdown('**Final answer**'));

// Ephemeral: visible only to a specific recipient.
await ctx.replyEphemeral('A temporary private message', ctx.from.id);

// Fully typed raw access to every Bot API method and its payload.
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.html('<b>Rich HTML</b>'),
});
```

`RichMessageBuilder` supports `.html()`, `.markdown()`, `.blocks()`, `.add()`,
`.media()`, `.rtl()`, `.skipEntityDetection()`, `.build()`, and `.buildDraft()`.
`rich.draftHtml()`, `rich.draftMarkdown()`, and `rich.draftBlocks()` return draft-safe content and reject `File` uploads (drafts may use existing Telegram file IDs). Rich block helpers cover
paragraphs, headings, code, lists, tables, details, quotations, maps, media,
buttons, and thinking. `InputMediaBuilder.livePhoto()` and
`InputPaidMediaBuilder.livePhoto()` construct live-photo media payloads. The
`thinking` block is only valid in `sendRichMessageDraft`. Other modern methods are available via
`ctx.api.sendMessageDraft()`, `ctx.api.answerGuestQuery()`,
`ctx.api.editEphemeralMessage*()`, and `ctx.api.deleteEphemeralMessage()`.
Telegram types are available under `TelegramTypes`; rich input types are exported directly.

<a id="keyboards"></a>
### 🔘 Keyboards & buttons

```js
const { btn, url, webApp, copy, kb, InlineKeyboard, Keyboard } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) =>
  ctx.reply('Pick:', kb([
    [btn('💎 Premium', 'prem', 'primary'),      // blue/purple
     btn('✅ Register', 'reg', 'success')],     // green
    [url('🌐 Web', 'https://yoursite.com')],
    [btn('❌ Close', 'close', 'danger', '5408846744727334338')], // red + ANIMATED ICON
  ])));
```

- 🎨 `style` colors (`primary`/`success`/`danger`) need Telegram apps from Feb 2026+ — older apps render plain buttons, never an error.
- ✨ `icon_custom_emoji_id` needs a Premium bot owner or a Fragment username.
- Helpers: `copy(text, value)` (copy-to-clipboard), `webApp(text, link)`, `kb.confirm(yesData, noData)`, `kb.markup(rows)`.
- Fluent classes: `new InlineKeyboard().text(...).url(...).row().text(...).build()` and `new Keyboard().text(...).requestContact(...).resized().build()` (real reply keyboards).

<a id="menus"></a>
### 🍽️ Interactive menus

```js
const { Menu, MenuContainer } = require('@xbibzlibrary/telebibz');

const mc = new MenuContainer();
const main = mc.create('main'), more = mc.create('more');

main.text('🔔 Toggle', async (ctx) => ctx.answerCallbackQuery('toggled!'))
    .row()
    .url('🌐 Web', 'https://x.com')
    .submenu('More ▶', 'more');
more.back('◀️ Back', 'main');

bot.use(mc); // button handlers registered automatically
bot.cmd('cfg', (ctx) => ctx.reply('Menu:', { reply_markup: main.render(ctx) }));
```

Submenus swap the keyboard in place via `editMessageReplyMarkup`; stale button
presses are answered with a friendly alert instead of crashing.

<a id="wizard"></a>
### 🧙 Wizard — conversation forms, zero boilerplate

```js
bot.wizard('register', {
  steps: [
    { key: 'name', ask: 'What is your name?' },
    { key: 'age', ask: 'Age?', parse: Number,
      validate: (n) => (n > 0 && n < 120 ? null : 'Numbers only, please:') },
  ],
  done: async (ans, ctx) => ctx.reply(`Done ${ans.name} (${ans.age})!`),
});
// user runs /register → the bot asks until finished.
// typing "cancel" / "batal" stops any time. Session is active automatically.
```

`bot.wizard(id, def, bindCommand = true)` also binds `/id` as the trigger; use
`bot.wizardStart(ctx, id)` from any handler (button, menu, …).

#### 🆕 v3.1 — choice buttons + `edit`/`delete` modes

```js
bot.wizard('survey', {
  mode: 'edit',        // 'send' (default) | 'edit' | 'delete'
  steps: [
    // reply keyboard — user taps, no typing
    { key: 'gender', ask: 'Gender?', buttons: ['👨 Male', '👩 Female'], onlyButtons: true },

    // inline keyboard (callback) — value may differ from label
    { key: 'island', ask: 'Which island?', inline: true, onlyButtons: true,
      buttons: [[{ text: '🌋 Java', value: 'java' }, { text: '🌴 Sumatra', value: 'sumatra' }]] },

    // free typing with validation (mode can be overridden per step)
    { key: 'age', ask: 'Age?', parse: Number, mode: 'send',
      validate: (n) => (n > 0 && n < 120 ? null : 'Numbers only:') },
  ],
  done: async (ans, ctx) => ctx.reply(`Saved: ${JSON.stringify(ans)}`),
});
```

| Option | Level | Purpose |
|---|:---:|---|
| `buttons` | step | `['A','B']`, `[{text,value}]`, or explicit rows `[['A'],['B','C']]` |
| `inline` | step | `true` → callback buttons (click = value, no typing) |
| `onlyButtons` | step | `true`/string → reject free typing, must pick a button |
| `mode` | def/step | `'send'` new message · `'edit'` one message edited in place · `'delete'` old question deleted first |
| `cleanup` | def | delete the last question when done (default on with mode `'delete'`) |
| `removeKeyboard` | def | dismiss the reply keyboard when done (default `true` if one was shown) |

Programmatic helpers: `bot.wizardCancel(ctx)`, `bot.wizardEdit(ctx, text)`,
`bot.wizardDelete(ctx)`, plus module `wizard` (`cancel/editAsk/deleteAsk`).
Stale buttons (clicked after the wizard advanced/ended) get a safe alert —
the bot never crashes. `parse`/`validate` also apply to button values.

<a id="inline"></a>
### ❓ Inline mode

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery(/cat/i, async (ctx) => {
  await ctx.answerInlineQuery([
    iq.article('1', 'A cat fact', { message_text: 'meong!' }),
    iq.photo('2', 'https://x/1.jpg'),
  ], { cache_time: 0 });
});
```

Builders: `iq.article/photo/gif/video/audio/location/sticker`.

<a id="broadcast"></a>
### 📣 Broadcast (rate-limit safe)

```js
const result = await bot.broadcast([111, 222, 333], 'Announcement!', { delay: 35 });
// → { terkirim: 3, gagal: 0, errors: [] }  (blocked users are listed in errors)
```

`pesan` may be a string, a `sendMessage` payload object, or a function
`(chatId) => payload` for per-recipient personalization. Default pacing is
35 ms (≈28 msg/s, safely under Telegram limits).

<a id="files"></a>
### 📎 Files & media

```js
const { InputFile, InputMediaBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('foto', (ctx) => ctx.replyWithPhoto(new InputFile(buffer, 'x.jpg')));
bot.cmd('dok',  (ctx) => ctx.replyWithDocument(new InputFile('/path/file.pdf')));
bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
  InputMediaBuilder.photo('https://a/1.jpg'),
  InputMediaBuilder.photo('https://a/2.jpg', { caption: 'two' }),
]));
bot.on('message:photo', async (ctx) => {
  const f = await ctx.getFile();        // largest photo size, automatic
  await ctx.downloadFile('./foto.jpg'); // streams to disk
});
```

`InputFile` accepts Buffer / Uint8Array / file path / fs stream / async
iterable; uploads are sent as `multipart` with `attach://` anywhere in the
payload (media groups, thumbnails, …). `api.downloadFile(file_id, dest)` works
standalone too.

<a id="ratelimit"></a>
### 🛡️ Reliability & rate limiting

```js
const { autoRetry, throttler, limiter } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());            // retry 429, honor retry_after (max 5)
bot.api.config.use(throttler());            // global queue ≤ 28 calls/second
bot.use(limiter({ windowMs: 2000, limit: 3, onExceeded })); // per-user anti-spam
```

Long polling is resilient by default: 409 conflicts retry every 5 s
(`launch({ conflictDelay: 5000 })` to tune), network hiccups back off 1 s,
`stop()` exits cleanly (`await bot.runPromise`).

<a id="sessions"></a>
### 🗃️ Sessions

```js
const { session } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(token, {
  session: {
    initial: () => ({ count: 0 }),
    getKey: (ctx) => `${ctx.from?.id}:${ctx.chat?.id}`,   // default
    storage: myRedisAdapter,   // { read(k), write(k,v), delete(k) } — default: in-memory Map
  },
});

bot.on(':text', (ctx) => { ctx.session.count++; });
```

`ctx.session` is always present, even without configuration.

<a id="errors"></a>
### 🇮🇩 Human-readable errors

Every error is reported with an actionable suggestion:

```
✖ Telegram error (403): Forbidden: bot was blocked by the user
  💡 saran: Bot diblokir pengguna — jangan kirim ulang, hapus dari daftar broadcast.
```

`humanize(err)` returns `{ pesan, saran, method, code }` covering 15+ common
Telegram errors (bad token, chat not found, rights, parse errors, rate limits,
stale callbacks, oversize files, …). Override with
`new TeleBibz(token, { onError: (err, ctx) => {} })`.

<a id="webhook"></a>
### 🕸️ Webhooks & serverless

```js
const http = require('http');
http.createServer((req, res) =>
  req.url === '/tg' ? bot.webhook()(req, res) : res.end('ok')
).listen(8443);

// any framework (Express/Fastify/Hono): mount the (req, res) handler from bot.webhook()
// or serverless, directly:
await bot.handleUpdate(req.body);   // one raw update in → full pipeline
```

Remember `await bot.init()` first when you don't call `launch()` (it fetches
bot info), and `setWebhook(url)` via `bot.api.setWebhook({ url })`.

<a id="proxy"></a>
### 🔌 Proxy transport (VPS behind a proxy)

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');
const bot = new TeleBibz(token, {
  transport: createTransport(token, { proxy: 'http://user:pass@proxy:8080' }),
});
```

`createTransport(token, { apiRoot, proxy, timeoutMs, headers })` also lets you
point at a local Bot API server.

<a id="transformers"></a>
### 🧪 Transformers (escape hatch)

```js
bot.api.config.use(async (prev, method, payload) => {
  console.log('→', method);           // observe/modify every Bot API call
  return prev(method, payload);
});

// any method, even unreleased ones (Proxy magic):
await bot.api.sendDiceCustom({ chat_id: 1, emoji: '🎲' });
```

<a id="analytics"></a>
## 📈 Analytics & Statistics

### 📊 This repo in numbers

| Metric | Value |
|---|---|
| 📦 Source modules | **16 files** in `lib/` |
| 📝 Total lines of code | **~1,700** (no build step) |
| 🔌 Bot API methods | **90+** — 75 typed shortcuts + unbounded Proxy |
| ⌨️ Context shortcuts | **50+** (reply/edit/delete/admin/react…) |
| 🧪 Offline tests | **47/47 passing**, including local HTTP transport and Bot API 10.3 tests |
| 🧩 Ready examples | **7** in `examples/` |
| 📦 Runtime dependencies | **4** — all used, all tested |

### ⬇️ Downloads & popularity (live from npm)

[![per day](https://img.shields.io/npm/dd/@xbibzlibrary/telebibz?style=flat-square&label=day&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per week](https://img.shields.io/npm/dw/@xbibzlibrary/telebibz?style=flat-square&label=week&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per month](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=flat-square&label=month&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![total](https://img.shields.io/npm/dt/@xbibzlibrary/telebibz?style=flat-square&label=total&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

### 📏 Module size map (lines of code)

```
wizard.js      █████████████████████████ 247  ← forms + buttons + edit/delete
telebibz.js    ███████████████████▎      193  ← main class & lifecycle
context.js     ███████████████████       190  ← ctx + 50-ish shortcuts
composer.js    █████████████████▍        174  ← middleware engine & filters
api.js         ███████████████▍          154  ← 75 shortcuts + Proxy + transformers
net.js         ███████████▌              115  ← axios transport + multipart
menus.js       █████████                  90  ← Menu/MenuContainer
keyboard.js    ████████▎                  83  ← btn/url/kb + fluent classes
ratelimit.js   ██████                     61  ← autoRetry · throttler · limiter
runner.js      ████▌                      45  ← 409-resilient polling
file.js        ████                       41  ← InputFile + InputMediaBuilder
logger.js      ███▊                       38  ← logs + banner
session.js     ███▌                       36  ← swappable sessions
errors.js      ███▌                       35  ← humanized errors 🇮
broadcast.js   ███                       35  ← rate-limit-safe blast
inline-query.js██▊                        28  ← matcher + result builders
```

### 🗺️ Repo health

<div align="center">

[![repo card](https://github-readme-stats.vercel.app/api/pin/?username=XbibzOfficial777&repo=telebibz&show_owner=false)](https://github.com/XbibzOfficial777/telebibz)

</div>

<details>
<summary>📅 Star history (click to open)</summary>

![Star History](https://api.star-history.com/svg?repos=XbibzOfficial777/telebibz&type=Date)

</details>

<a id="examples"></a>
## 🧩 Ready Examples (`examples/`)

| File | Content |
|---|---|
| `01-quickstart.js` | bot up in 6 lines |
| `02-menu-tombol.js` | colored keyboard + animated icons |
| `03-wizard.js` | registration form + **buttons + edit mode** |
| `04-broadcast.js` | admin blast |
| `05-kirim-file.js` | photos & documents from buffers |
| `06-menu.js` | interactive menus + submenus |
| `07-inline-query.js` | inline mode with result builders |
| `08-rich-message.js` | rich messages, live photo, drafts, ephemeral messages, raw API |

Run any of them with `BOT_TOKEN=123:abc node examples/01-quickstart.js`.

<a id="testing"></a>
## 🔬 Testing & Live Proof

```bash
npm test          # 47 offline checks, including local HTTP transport + Bot API 10.3 tests
npm run typecheck # verify declarations and method-specific Bot API payload types
```

The current audit needs no Telegram token. An earlier release of this repository
records **30 offline + 10 live checks** on `@xbibzrat_bot`; that live run is historical
and was not repeated in the current audit. See [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md)
for the test matrix, Bot API 10.3 comparison, and remaining limitations.

Debug logging: `DEBUG=telebibz:net,telebibz:ratelimit node yourbot.js`.

<a id="structure"></a>
## 📂 Repo Structure (16 core files)

| File | Role |
|---|---|
| `lib/net.js` | axios keep-alive transport + multipart `attach://` |
| `lib/api.js` | Bot API methods + any-method Proxy + transformers |
| `lib/composer.js` | middleware, `on('message:photo')` filters, `errorBoundary` |
| `lib/context.js` | ctx object + 50-ish reply/edit/delete/callback shortcuts |
| `lib/session.js` | per user:chat sessions (swappable storage) |
| `lib/runner.js` | long polling: 409 retry, network backoff, drop pending |
| `lib/wizard.js` | conversation forms + choice buttons + edit/delete modes |
| `lib/menus.js` | `Menu`/`MenuContainer` interactive menus |
| `lib/keyboard.js` | button builders + fluent `InlineKeyboard`/`Keyboard` |
| `lib/ratelimit.js` | `autoRetry` 429 · `throttler` queue · per-user `limiter` |
| `lib/broadcast.js` | rate-limit-safe blast |
| `lib/file.js` | `File`/`InputFile` (Buffer/path/stream) + `InputMediaBuilder` |
| `lib/inline-query.js` | query matcher + inline result builders |
| `lib/errors.js` | humanized errors + suggestions |
| `lib/logger.js` | framed logs + boot banner |
| `index.js` / `index.d.ts` | export door + TypeScript types |

<a id="changelog"></a>
## 🕐 Changelog

- **3.1.0** — wizard: choice buttons (reply/inline), `edit`/`delete` modes, auto cleanup, programmatic helpers · tests 24 → 30
- **3.0.0** — production-grade grammY parity: axios keep-alive, transformers, menus, inline query, limiter
- **2.0.0** — engine rewritten from scratch, multipart transport, native Node webhook
- **1.0.0** — grammY architecture recode

> Full details in [`CHANGELOG.md`](CHANGELOG.md). Deep architecture study (🇮): [`ANALISIS-telebibz.md`](ANALISIS-telebibz.md).

<a id="publishing"></a>
## 📦 Automated npm publishing

`.github/workflows/auto-publish.yml` publishes on pushes to `main` (except release commits tagged with `[skip release]`) or manually on the `main` branch via **Actions → Auto publish to npm → Run workflow** (the job rejects dispatches from other branches). Before enabling it, configure a GitHub Actions Environment named `npm-release` and add the repository/environment secret **`NPM_TOKEN`** with permission to publish `@xbibzlibrary/telebibz`. No credential is stored in this repository.

The workflow derives the next patch version from the greater of the checked-in version and npm's latest version, then runs runtime tests, TypeScript checks, JS syntax checks, package dry-run, and production dependency audit. It publishes publicly, commits the bumped `package.json`/lockfile, creates an annotated `vX.Y.Z` tag, and a GitHub release. A failed validation stops before publish. The CI/release workflows have been reviewed locally; a real GitHub Actions run and npm publish still require repository access and the secret.

<a id="license"></a>
## 📄 License

**MIT** © Xbibz Technology ID — architecture inspired by [grammY](https://grammy.dev) (MIT, see [`NOTICE.md`](NOTICE.md)).

---

<div align="center">

**Made with ❤️ by Xbibz Technology ID**

If telebibz helps you, a ⭐ on this repo means a lot.

[![repo views](https://komarev.com/ghpvc/?username=XbibzOfficial777&repo=telebibz&style=flat-square&color=blueviolet&label=repo+views)](https://github.com/XbibzOfficial777/telebibz)

</div>
