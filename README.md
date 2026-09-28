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
[![tests](https://img.shields.io/badge/tests-48%2F48%20passing-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](#-testing--live-proof)
[![size](https://img.shields.io/badge/code-2.1k%20lines-orange?style=for-the-badge&logo=codeigniter&logoColor=white)](#-analytics--statistics)
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
| 🎛️ [Handlers & filters](#handlers) | 💬 [Context shortcuts](#context) | 🧱 [Rich Messages & Bot API 10.3](#rich-messages) |
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
| **185 method-specific Bot API payload signatures** (`callApi`) | ✅ | ✅ |
| Rich Messages: blocks, entities, drafts, media, animated emoji | varies by API | ✅ built-in |
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
| TypeScript | ✅ full | ✅ method-specific types for 185 Bot API methods |
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
### 🧱 Rich Messages, animated emoji, media & drafts (Bot API 10.3)

A **Rich Message** is Telegram's structured message format: one message can combine rich-text entities, headings, lists, quotations, tables, maps, buttons, media blocks, and more. TeleBibz provides builders and Context shortcuts; the official [Telegram Bot API reference](https://core.telegram.org/bots/api) remains authoritative for current limits and eligibility.

> **Coverage note:** the package includes a type-level registry for **185 Bot API methods** and typed payloads through `api.callApi()`. This does not mean all 185 endpoints can be safely or meaningfully tested live: many require real updates, admin rights, payments, or specific chats. See [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md) for the live-test matrix and known limitations.

#### 1. Choose exactly one content mode

A rich message has exactly one content source: `html`, `markdown`, or `blocks`. Optional settings such as `media`, `is_rtl`, and `skip_entity_detection` do not count as content modes.

```js
const { TeleBibz, rich, RichMessageBuilder } = require('@xbibzlibrary/telebibz');
const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('rich', async (ctx) => {
  const message = rich.blocks([
    rich.heading('Weekly report', 2),
    rich.paragraph(['Orders: ', rich.bold('42'), ' · status ', rich.italic('ready')]),
    rich.table([
      [
        { text: 'Metric', is_header: true, align: 'left', valign: 'middle' },
        { text: 'Value', is_header: true, align: 'right', valign: 'middle' },
      ],
      [
        { text: 'Revenue', align: 'left', valign: 'middle' },
        { text: '$1,250', align: 'right', valign: 'middle' },
      ],
    ], { bordered: true, striped: true, compact: true, caption: 'This week' }),
    rich.details('More information', [rich.paragraph('This section can be expanded.')]),
    rich.buttons([
      rich.button('Open dashboard', { url: 'https://example.com' }, 'primary'),
      rich.button('Acknowledge', { callback_data: 'report:ack' }, 'success'),
    ], 'center'),
  ]);
  return ctx.replyWithRichMessage(message);
});

bot.launch();
```

The lower-level constructors are `rich.html(html, options)`, `rich.markdown(markdown, options)`, and `rich.blocks(blocks, options)`. `inputRichMessage(content, options)` validates that one content mode is selected. `RichMessageBuilder` is useful when assembling a message incrementally:

```js
const message = new RichMessageBuilder()
  .blocks([rich.heading('Notice', 2)])
  .add(rich.paragraph('More blocks can be appended.'))
  .rtl(false)
  .skipEntityDetection()
  .build();
await ctx.replyWithRichMessage(message);
```

Calling `.html()`, `.markdown()`, or `.blocks()` more than once on the same builder is an error: create a new builder when you want a different mode. `.media()` is intended for HTML/Markdown content that references media by `tg://...` links.

#### 2. Rich-text entities

Rich text can be a plain string, an array mixing strings and entity objects, or a nested rich-text object. Common entity helpers include:

| Helper | Entity produced | Typical use |
|---|---|---|
| `rich.bold(text)`, `rich.italic(text)`, `rich.underline(text)`, `rich.strikethrough(text)` | emphasis | inline formatting |
| `rich.spoiler(text)`, `rich.marked(text)`, `rich.code(text)` | spoiler / marked / code | hidden or technical text |
| `rich.subscript(text)`, `rich.superscript(text)` | script position | formulas and references |
| `rich.dateTime(text, unixTime, format)` | date/time | localized or relative timestamp |
| `rich.url(text, url)`, `rich.email(text, email)`, `rich.phone(text, phone)` | explicit links/contact | clickable or recognized values |
| `rich.mention(text, username)`, `rich.textMention(text, user)` | user mention | username or user object |
| `rich.hashtag(text, value)`, `rich.cashtag(text, value)`, `rich.botCommand(text, value)` | Telegram entities | searchable tags/commands |
| `rich.customEmoji(customEmojiId, alternativeText)` | custom emoji | standard or animated custom emoji |
| `rich.mathText(expression)`, `rich.anchorText(name)`, `rich.anchorLink(text, name)`, `rich.reference(text, name)`, `rich.referenceLink(text, name)` | formula/navigation | structured long-form text |
| `rich.buttonText(text, action, style)` | inline rich-text button entity | a button inside a rich-text run |

Example with an animated custom emoji (use a **real** custom emoji ID that Telegram returns for your bot):

```js
const emojiId = 'CUSTOM_EMOJI_ID';
const [sticker] = await ctx.api.callApi('getCustomEmojiStickers', {
  custom_emoji_ids: [emojiId],
});
if (!sticker) throw new Error('Unknown custom emoji ID');
await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph(['Build status: ', rich.bold('passed'), ' ', rich.customEmoji(emojiId, '👍')]),
]));
```

A regular Unicode emoji is not automatically an animated custom emoji. The custom ID must be valid and usable by the bot; Telegram may reject unavailable IDs or features the bot is not eligible to use.

#### 3. Structured block catalog

Each block helper returns an `InputRichBlock` object. Blocks can be nested where the schema permits it.

| Block family | Helpers | Notes |
|---|---|---|
| Text | `paragraph(text)`, `heading(text, size)`, `pre(text, language)`, `footer(text)`, `divider()` | heading size is 1–6; preformatted blocks can name a language |
| Math/navigation | `mathBlock(expression)`, `anchor(name)` | use the corresponding rich-text formula/reference helpers for inline content |
| Lists/quotes | `list(items)`, `quote(blocks, credit)`, `expandableQuote(text, credit)`, `pullQuote(text, credit)` | a list item may be a string or a structured item; quotations can contain nested blocks |
| Tables/disclosure | `table(cells, options)`, `details(summary, blocks, open)` | each cell supplies `align` and `valign`; options: `bordered`, `striped`, `compact`, `caption` |
| Location | `map(location, zoom, width, height, caption, credit)` | `location` is `{ latitude, longitude }` |
| Media | `animation(media, caption)`, `audio(media, caption)`, `document(media, caption)`, `photo(media, caption)`, `video(media, caption)`, `voiceNote(media, caption)` | `media` is an `InputMedia*` object; `File` uploads are collected recursively into multipart `attach://` fields |
| Layout | `collage(blocks, caption, credit)`, `slideshow(blocks, caption, credit)` | compose allowed media blocks into a gallery or sequence |
| Buttons | `buttons(buttons, align)`, `button(text, action, style)` | 1–8 buttons; alignment is `left`, `center`, or `right` |
| Draft-only | `thinking(text)` | use only in `sendRichMessageDraft`, not a persisted rich message |

For `table`, each cell should look like `{ text, align: 'left'|'center'|'right', valign: 'top'|'middle'|'bottom' }`; header cells may set `is_header: true`. A button action must provide exactly one supported action field, such as `url`, `callback_data`, `web_app`, `copy_text`, or `disabled`. `rich.button()` returns the button object for a buttons block. `rich.buttonText()` returns the distinct inline entity shape. Link style is only valid for callback buttons.

#### 4. Uploading media inside rich messages

Use Telegram `file_id`s for files already on Telegram, or wrap bytes/path/stream in `File` (or `InputFile`) for multipart upload:

```js
const fs = require('node:fs');
const { File, InputMediaBuilder } = require('@xbibzlibrary/telebibz');
const image = new File(fs.readFileSync('./hero.png'), 'hero.png');
const video = new File(fs.readFileSync('./clip.mp4'), 'clip.mp4');

await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph('Uploaded media blocks:'),
  rich.photo(InputMediaBuilder.photo(image)),
  rich.video(InputMediaBuilder.video(video)),
]));
```

HTML/Markdown can refer to media by a unique ID and a matching `media` entry:

```js
const photo = new File(fs.readFileSync('./hero.png'), 'hero.png');
await ctx.replyWithRichMessage(rich.html(
  '<b>Hero image</b><br><a href="tg://photo?id=hero">Open photo</a>',
  { media: [{ id: 'hero', media: InputMediaBuilder.photo(photo) }] },
));
```

A successful live smoke test confirmed nested multipart media, photo/audio/document/video/voice-note blocks, collage/slideshow, and a rich HTML media reference. On the tested Bot API server, an MP4 worked in a rich `animation` block; a GIF in that block returned `RICH_MESSAGE_VIDEO_INVALID`. The standalone `sendAnimation` method did accept the same GIF. If a rich animation block is rejected, try MP4. Live-photo video/photo pairing is a separate API operation, not an `InputRichBlock` type.

#### 5. Drafts and streaming previews

Drafts are temporary previews, not stored chat messages. Send a final message separately to persist the completed answer. `thinking` blocks are for rich drafts only. Draft helpers reject `File` uploads; use existing Telegram file IDs if a draft needs media.

```js
bot.cmd('stream-preview', async (ctx) => {
  const draftId = Date.now(); // non-zero and unique for this draft
  await ctx.sendMessageDraft(draftId, 'Preparing a response…', { can_stop: true });
  await ctx.sendRichMessageDraft(draftId + 1, rich.draftBlocks([
    rich.paragraph(['Working on ', rich.bold('your report'), '…']),
    rich.thinking('Collecting data'),
  ]), { can_stop: true, keep_on_stop: true });
  // Persist the final answer explicitly:
  return ctx.replyWithRichMessage(rich.markdown('**Report ready**'));
});
```

Draft constructors are `rich.draftHtml()`, `rich.draftMarkdown()`, `rich.draftBlocks()`, and `new RichMessageBuilder()...buildDraft()`. Their return types match `sendRichMessageDraft`'s no-new-upload schema. `sendMessageDraft` and `sendRichMessageDraft` also accept exact object payloads through `ctx.api.callApi()`.

#### 6. Live photos, paid media, ephemeral messages, and editing

**Live photo** sends a video and its corresponding still image. Both can be file IDs or `File`/`InputFile` values; URLs are not supported by the current method schema.

```js
await ctx.replyWithLivePhoto('VIDEO_FILE_ID', 'PHOTO_FILE_ID', { caption: 'A moment' });
// Or raw typed API:
await ctx.api.sendLivePhoto({ chat_id: ctx.chatId, live_photo: videoFile, photo: photoFile });
```

`InputMediaBuilder.livePhoto(video, photo)` and `InputPaidMediaBuilder.livePhoto(video, photo)` build media objects. `sendPaidMedia` requires a `star_count` from 1 to 25,000:

```js
const fs = require('node:fs');
const { File, InputPaidMediaBuilder } = require('@xbibzlibrary/telebibz');
const paidPhoto = new File(fs.readFileSync('./paid.png'), 'paid.png');
await ctx.api.callApi('sendPaidMedia', {
  chat_id: ctx.chatId,
  star_count: 1,
  media: [InputPaidMediaBuilder.photo(paidPhoto)],
  caption: 'Paid photo sample',
});
```

This is a real payment/paywall feature: do not test it on users without consent, and account for Telegram Stars before publishing paid content.

An **ephemeral message** is addressed to a recipient using `ephemeral_message_parameters`; availability depends on Telegram's bot/chat eligibility and permissions. Context helpers include `replyEphemeral(text, receiverUserId)`, `editEphemeralMessageText`, `editEphemeralRichMessage`, `editEphemeralMessageMedia`, `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup`, and `deleteEphemeralMessage`.

```js
await ctx.replyEphemeral('Temporary notice', ctx.from.id);
const sent = await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.blocks([rich.paragraph('Private rich preview')]),
  ephemeral_message_parameters: { receiver_user_id: ctx.from.id },
});
// If Telegram returns an ephemeral_message_id, it can be used with the edit/delete helpers.
if (sent.ephemeral_message_id) {
  await ctx.editEphemeralRichMessage(ctx.from.id, sent.ephemeral_message_id,
    rich.blocks([rich.paragraph('Updated temporary notice')]));
}
```

Telegram can reject requests with `BOT_NOT_ADMIN` or other permission errors; inspect the returned `ApiError` and do not treat a local payload test as proof of eligibility.

Rich edits use `ctx.editRichMessage(content, extra)`. The underlying Bot API is `editMessageText` with `rich_message` and a target `chat_id`/`message_id` (or `inline_message_id`). These operations modify an existing message; use a message created for testing when validating them.

#### 7. Context helpers and modern Bot API methods

| Helper | Effect / arguments |
|---|---|
| `ctx.replyWithRichMessage(content, extra?)` | sends a persisted rich message to the current chat |
| `ctx.editRichMessage(content, extra?)` | rich-edits the current message; callback and inline targets are handled |
| `ctx.replyWithLivePhoto(video, photo, extra?)` | sends a live photo to the current chat |
| `ctx.sendMessageDraft(draftId, text, extra?)` | streams a plain-text preview |
| `ctx.sendRichMessageDraft(draftId, richMessage, extra?)` | streams a rich preview |
| `ctx.replyEphemeral(text, receiverUserId, extra?)` | sends an ephemeral plain-text message |
| `ctx.guestQueryId`, `ctx.answerGuestQuery(result)` | handles a real incoming `guest_message` update |
| `ctx.editEphemeralRichMessage(...)`, `ctx.deleteEphemeralMessage(...)` | edits/deletes a recipient's ephemeral message |

Guest query answers require the `guest_query_id` from an actual incoming guest update; it cannot be fabricated for a meaningful live test. Inline rich articles can be built with `iq.richArticle(id, title, richMessage, extra)` and returned while handling an actual inline query.

#### 8. Complete typed Bot API access

All **185 method names and payload signatures** in the vendored Bot API schema are available in TypeScript through `api.callApi()` and `api.raw()`:

```js
// JavaScript or TypeScript: method name + payload object
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.markdown('**Hello**'),
});

await ctx.api.callApi('sendMessageDraft', {
  chat_id: ctx.chatId,
  draft_id: Date.now(),
  text: 'Preview',
  can_stop: false,
});
```

The `TelegramTypes` namespace exports the vendored Telegram object types. Useful type aliases include `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, and `TelegramApiPayloads`. The runtime proxy also permits `ctx.api.anyMethod({ ...payload })` for newly added methods, but that dynamic shorthand has no runtime schema validation. TypeScript checks happen at compile time only. Run `npm run typecheck` to validate declarations and consumer examples.

The declarations are vendored from `@grammyjs/types@5.0.0` under MIT (see [`NOTICE.md`](NOTICE.md) and the vendored license); they add no runtime dependency. Telegram's official reference/changelog—not the vendored package—remains the authority when a field, permission, or limit differs.

#### Limits and troubleshooting

The Bot API 10.3 type schema documents these Rich Message ceilings: **32,768 UTF-8 characters**, **500 blocks** (including nested/list/table/quotation/details content), **16 nesting levels**, **50 media attachments**, and **20 table columns**. Map blocks use zoom 0–24 and width/height 0–10,000; the buttons block allows 1–8 buttons. Telegram can update limits, so check the [official reference](https://core.telegram.org/bots/api) before building large payloads. The server remains the final validator.

Common failures:

- `RICH_MESSAGE_VIDEO_INVALID`: the tested server rejected a GIF in a Rich Message `animation` block; try MP4. The standalone `sendAnimation` endpoint accepted the GIF.
- `BOT_NOT_ADMIN` on ephemeral sends: this is a Telegram eligibility/permission response, not proof that the JSON shape is invalid. Verify bot/chat access and official method requirements.
- `chat not found`: in a private chat, the user usually needs to open the bot and press **Start** before the bot can initiate a message.
- Upload errors: wrap bytes, paths, or streams in `File`/`InputFile`; confirm the media helper's type matches the file.

#### Live verification and limits

On 2026-09-28, a live smoke test against a user-provided bot succeeded for rich blocks, HTML, Markdown, animated custom emoji, plain/rich drafts, multipart media, photo/audio/document/video/voice-note blocks, collage/slideshow, live photo, GIF via `sendAnimation`, and HTML media references. Ephemeral `sendMessage`/`sendRichMessage` failed with Telegram's `BOT_NOT_ADMIN`; paid media was not sent because it can involve Stars; callback buttons were not clicked; all 185 endpoints were not exercised live. See [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md) for the exact outcomes and test boundaries.

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
| 📦 Source modules | **18 files** in `lib/` |
| 📝 Total lines of code | **2,105** in `lib/` (no build step) |
| 🔌 Bot API methods | **185 typed method signatures** via `api.callApi()` + dynamic Proxy |
| ⌨️ Context shortcuts | **50+** (reply/edit/delete/admin/react…) |
| 🧪 Offline tests | **48/48 passing**, including local HTTP transport and Bot API 10.3 tests |
| 🧩 Ready examples | **8** in `examples/` |
| 📦 Runtime dependencies | **4** — all used, all tested |

### ⬇️ Downloads & popularity (live from npm)

[![per day](https://img.shields.io/npm/dd/@xbibzlibrary/telebibz?style=flat-square&label=day&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per week](https://img.shields.io/npm/dw/@xbibzlibrary/telebibz?style=flat-square&label=week&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per month](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=flat-square&label=month&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![total](https://img.shields.io/npm/dt/@xbibzlibrary/telebibz?style=flat-square&label=total&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

### 📏 Module size map (lines of code)

The figures below are generated from the current `lib/*.js` source. They are informational, not bundle-size measurements.

```text
context.js          250  Context accessors, replies, edits and helpers
wizard.js           247  Guided forms, buttons, edit/delete modes
telebibz.js         209  Bot class, lifecycle, update dispatch
telegram-methods.js 192  Runtime registry for 185 API method names
composer.js         185  Middleware composition and filters
rich.js             175  Rich Message, entity and block builders
api.js              168  Typed API adapters, Proxy and transformers
net.js              115  HTTP transport and multipart upload
menus.js              90  Menu and MenuContainer
keyboard.js           83  Keyboard builders and fluent classes
ratelimit.js          74  Retry, throttler and limiter
logger.js             68  Logs and boot banner
runner.js             54  Polling and retry handling
file.js               48  File/InputFile and media builders
session.js            44  Swappable session storage
errors.js             35  Error translations
broadcast.js          35  Broadcast helper
inline-query.js       33  Inline matching and result builders
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
npm test          # 48 offline checks, including local HTTP transport + Bot API 10.3 tests
npm run typecheck # verify declarations and method-specific Bot API payload types
```

The 48 automated checks and `npm run typecheck` are offline/mocked and do not need a bot token. A separate live smoke test was performed with the owner's test bot: rich blocks, HTML/Markdown, animated custom emoji, drafts, media blocks, collage/slideshow, live photo, and multipart media references passed. Ephemeral sends were rejected by Telegram with `BOT_NOT_ADMIN`; paid media and all 185 endpoints were not tested live. See [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md) for the exact matrix, known limits, and failures.

Debug logging: `DEBUG=telebibz:net,telebibz:ratelimit node yourbot.js`.

<a id="structure"></a>
## 📂 Repo Structure (18 JavaScript modules + vendored API types)

| File | Role |
|---|---|
| `lib/net.js` | axios keep-alive transport + multipart `attach://` |
| `lib/api.js` | Bot API methods + any-method Proxy + transformers |
| `lib/rich.js` | Rich Message entities, block builders, draft-safe helpers |
| `lib/telegram-methods.js` | registry of 185 Bot API method names |
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
| `types/telegram-bot-api/` | vendored Bot API types (MIT); no runtime code |
| `index.js` / `index.d.ts` | export door + typed method/payload surface |

<a id="changelog"></a>
## 🕐 Changelog

- **Unreleased — Bot API 10.3** — rich messages, animated emoji, drafts, live photos, all 185 typed method payloads; 48 offline checks and richer live verification. Details: [`CHANGELOG.md`](CHANGELOG.md).
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
