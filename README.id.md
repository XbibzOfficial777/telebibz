<div align="center">

[🇬 **English**](README.md) · [🇮 **Indonesia**](README.id.md)

<br>

<a href="https://www.npmjs.com/package/@xbibzlibrary/telebibz" title="Buka telebibz di npm">
  <img src="https://imgbs.com/uploads/telebibz-d7b30671.png" alt="telebibz — Telegram Bot Library" width="560">
</a>

<br><br>

**Library Telegram paling gampang untuk Node.js — set fitur penuh setara grammY.**<br>
Recode mandiri atas arsitektur elegan [grammY](https://grammy.dev), dengan dependency
produksi yang *benar-benar dipakai*, dokumentasi 🇮🇩 Indonesia-first, dan nol drama.

<br>

[![npm version](https://img.shields.io/npm/v/@xbibzlibrary/telebibz?style=for-the-badge&logo=npm&logoColor=white&color=CB3837&label=telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![downloads](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=for-the-badge&logo=npm&logoColor=white&color=green&label=unduh%2Fbulan)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![node](https://img.shields.io/node/v/@xbibzlibrary/telebibz?style=for-the-badge&logo=node.js&logoColor=white&color=339933&label=node)](https://nodejs.org)
[![tests](https://img.shields.io/badge/test-30%2F30%20lulus-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](#-test--bukti-live)
[![size](https://img.shields.io/badge/kode-1.7k%20baris-orange?style=for-the-badge&logo=codeigniter&logoColor=white)](#-analitik--statistik)
[![license](https://img.shields.io/npm/l/@xbibzlibrary/telebibz?style=for-the-badge&color=blue)](LICENSE)
[![views](https://komarev.com/ghpvc/?username=XbibzOfficial777&repo=telebibz&style=for-the-badge&color=blueviolet&label=kunjungan+repo)](https://github.com/XbibzOfficial777/telebibz)

<br>

`Xbibz Technology ID`

</div>

---

## 📑 Daftar Isi

| | | |
|---|---|---|
| ⚡ [Kenapa telebibz?](#kenapa) | 📊 [Matriks fitur vs grammY](#matriks) | 📥 [Instalasi & persyaratan](#instalasi) |
| 🚀 [Mulai cepat](#mulai) | 🧠 [Cara kerja (arsitektur)](#arsitektur) | 📖 [Dokumentasi lengkap](#dokumentasi) |
| 🎛️ [Handler & filter](#handler) | 💬 [Shortcut Context](#context) | 🔘 [Keyboard & tombol](#keyboard) |
| 🍽️ [Menu interaktif](#menu) | 🧙 [Wizard (form + tombol + edit/delete)](#wizard) | ❓ [Mode inline](#inline) |
| 📣 [Broadcast](#broadcast) | 📎 [File & media](#file) | 🛡️ [Keandalan & rate limit](#ratelimit) |
| 🗃️ [Session](#session) | 🇮🇩 [Error manusiawi](#error) | 🕸️ [Webhook & serverless](#webhook) |
| 🔌 [Transport proxy](#proxy) | 🧪 [Transformer](#transformer) | 📈 [Analitik & statistik](#analitik) |
| 🧩 [Contoh siap jalan](#contoh) | 🔬 [Test & bukti live](#test) | 📂 [Struktur repo](#struktur) |
| 🕐 [Changelog](#changelog) | 📄 [Lisensi](#lisensi) | |

<a id="kenapa"></a>
## ⚡ Kenapa telebibz?

> [!TIP]
> **Satu prinsip:** semua fitur yang di grammY butuh plugin, di telebibz sudah
> **bawaan** — wizard, menu, rate-limit, broadcast, download file — dan polling
> yang *tidak mati* kena 409.

- 🧠 **API grammY yang sudah kamu kenal** — `bot.cmd()`, `bot.hears()`, `ctx.reply()`, middleware, transformer
- 🧙 **Wizard bawaan v3.1** — form tanya-jawab dengan **tombol pilihan** (reply/inline) dan mode **edit/delete** pesan
- 🛡️ **Tahan banting** — auto-retry 429, throttler, limiter anti-spam, polling retry saat konflik 409
- 🇮🇩 **Error manusiawi** — setiap error Telegram diterjemahkan + dikasih saran penyelesaian
- 🔌 **Proxy API segala metode** — `api.metodeApaPun({...})` otomatis tersedia, bahkan untuk metode yang belum rilis
- 🪶 **Ringan & jujur** — 4 dependency, semuanya terpakai nyata dan ter-test

<a id="matriks"></a>
## 📊 Matriks Fitur — parity grammY

| Fitur | grammY | telebibz |
|---|:---:|:---:|
| Proxy API **segala metode** (auto-generated) | ✅ | ✅ |
| ~60 shortcut bertipe (sendMessage, banChatMember…) | ✅ | ✅ |
| Context lengkap (~70 pintasan reply/edit/admin/react) | ✅ | ✅ |
| Context flavor business (`business_connection_id` otomatis) | plugin | ✅ bawaan |
| Filter `on('message:photo' / ':text' / 'chat_type:private' …)` | ✅ | ✅ |
| `cmd / hears / action / inlineQuery` | ✅ | ✅ (+ inlineQuery matcher) |
| `branch / filter / drop / route / lazy / fork` | ✅ | ✅ |
| Error boundary + catch | ✅ | ✅ (semua shortcut otomatis terlindungi) |
| Session + storage swappable | ✅ | ✅ |
| Transformer API (`api.config.use`) | ✅ | ✅ |
| `auto-retry` 429 hormati `retry_after` | plugin | ✅ bawaan `autoRetry()` |
| Throttler antre-rate-limit | plugin | ✅ bawaan `throttler()` |
| Rate limit per-user | plugin | ✅ bawaan `limiter()` |
| `InputFile` Buffer/path/stream + multipart `attach://` | ✅ | ✅ |
| `InputMedia` builder + media group | ✅ | ✅ `InputMediaBuilder` |
| Download file (`getFile`/`downloadFile`) | plugin | ✅ bawaan |
| Keyboard & InlineKeyboard fluent class | ✅ | ✅ |
| Menu interaktif | plugin | ✅ bawaan `Menu/MenuContainer` |
| Wizard/percakapan | plugin | ✅ bawaan — **+ tombol pilihan & mode `edit`/`delete`** |
| Long polling tahan-409 | ❌ (fatal crash) | ✅ bawaan (auto-retry 5 dtk) |
| Broadcast siap pakai | ❌ | ✅ `bot.broadcast()` |
| Humanisasi error + saran (🇮🇩) | ❌ | ✅ `humanize()` |
| Banner boot + log debug | ❌ | ✅ (`DEBUG=telebibz*`) |
| Proxy HTTP(S) untuk VPS | ⚠️ manual | ✅ opsi `proxy` transport |
| TypeScript | ✅ full | d.ts longgar (JS-first) |
| Bahasa dokumentasi | en | **🇬🇧 + 🇮🇩** |

<a id="instalasi"></a>
## 📥 Instalasi & Persyaratan

**Persyaratan:** Node.js ≥ 18 (memakai `FormData`/`Blob` global untuk upload).

```bash
npm install @xbibzlibrary/telebibz
# atau
yarn add @xbibzlibrary/telebibz
# atau
pnpm add @xbibzlibrary/telebibz
```

**Dependency runtime (semuanya dipakai & ter-test):**

| Paket | Untuk |
|---|---|
| `axios ^1.20` | transport keep-alive + streaming `downloadFile` |
| `mime-types ^3.0` | deteksi content-type upload |
| `https-proxy-agent ^9.1` | opsi proxy transport VPS |
| `debug ^4.4` | log `DEBUG=telebibz:net,telebibz:ratelimit` |

Ambil token bot dari **@BotFather** → `/newbot`. Konstruktor memvalidasi format
token (`123456:ABC…`) dan melempar error yang jelas kalau salah.

<a id="mulai"></a>
## 🚀 Mulai Cepat

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz('TOKEN_DARI_BOTFATHER');

bot.cmd('start', (ctx) => ctx.reply('Halo!'));
bot.hears(/halo|hai/i, (ctx) => ctx.reply('halo juga 👋'));
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
┃  bot      : @botkamu (id 123456)      ┃
┃  mode     : long-polling              ┃
┃  library  : telebibz 3.1.2 (Node.js)  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
✔ menunggu update… (Ctrl+C untuk berhenti)
```

> [!NOTE]
> **Hidup di VPS:** kalau ada instance bot lain yang masih polling (409 Conflict —
> misal deploy ganda atau hosting restart), telebibz **otomatis retry tiap 5 detik
> tanpa crash** dan menyala begitu jalur bebas. Tidak perlu PM2 babysitter.

<a id="arsitektur"></a>
## 🧠 Cara Kerja (Arsitektur)

```
                       ┌─────────────────────────────────────────────┐
 Telegram Bot API ────►│  long polling (lib/runner.js)               │
                       │  atau webhook / handleUpdate (lib/telebibz) │
                       └──────────────────┬──────────────────────────┘
                                          │ update JSON mentah
                                          ▼
                       Context(update, api, me)          lib/context.js
                                          │
             ┌────────────────────────────▼───────────────────────────┐
             │  Pohon middleware `_root` (urutan tetap):              │
             │  1. session()                 lib/session.js           │
             │  2. wizard.middleware()       lib/wizard.js            │
             │  3. errorBoundary(reporter)                             │
             │       └─► handler kamu: use/cmd/hears/action/on/       │
             │           inlineQuery/Menu/wizard      lib/composer.js │
             └────────────────────────────┬───────────────────────────┘
                                          │ ctx.reply / ctx.api.*
                                          ▼
             ApiBase + Proxy + pipeline transformer        lib/api.js
             (api.config.use → autoRetry / throttler)
                                          │
                                          ▼
             transport axios: JSON atau multipart attach:// lib/net.js
                                          │
                                          ▼
                                 https://api.telegram.org
```

**Lifecycle satu update** (mis. `/start`): `getUpdates` → `pollLoop` →
`handleUpdate` → `Context` baru → session dimuat → middleware wizard (tak ada
wizard aktif → lanjut) → error boundary → handler kamu yang cocok jalan →
`ctx.reply()` → pipeline transformer → axios → Telegram. Error yang dilempar
jadi `BotError` dan mengalir ke `opts.onError` atau reporter manusiawi.

<a id="dokumentasi"></a>
## 📖 Dokumentasi Lengkap

### 🏗️ Konstruktor & opsi

```js
const bot = new TeleBibz('TOKEN', {
  allowedUpdates: [...],   // batasi tipe update (default: tipe umum + Business)
  onError: (err, ctx) {},  // handle error sendiri (default: reporter manusiawi)
  silent: false,           // tanpa banner boot
  dropPending: false,      // buang update lama saat start
  session: { ... },        // { initial, getKey, storage } — lihat bagian Session
  transport: fn,           // suntik transport custom (test / proxy)
});
```

<a id="handler"></a>
### 🎛️ Handler & filter

```js
bot.cmd('ping',           (ctx) => ctx.reply('pong'));     // /ping
bot.cmd(['a', 'b'],       handler);                        // /a ATAU /b
bot.start('Selamat datang!');   // shortcut: daftarkan /start
bot.hears('daftar',       handler);   // teks persis "daftar" (case-insensitive)
bot.hears(/kuc?ing/i,     handler);   // regex bebas
bot.on('message:photo',   handler);   // filter gaya grammY
bot.on([':text', 'chat_type:private'], handler);
bot.action('menu:premium', handler);  // callback_query data (string / RegExp)
bot.inlineQuery(/kucing/i, handler);  // mode inline (regex / string / '*')
bot.use(middleware);                  // middleware manual
```

Kombinator composer (semantik grammY):

```js
bot.branch(pred, kalauYa, kalauTidak);   // pilih subpohon berdasar predikat
bot.filter(pred, ...mw);                 // jalan hanya jika pred(ctx) true
bot.drop(pred, ...mw);                   // dilewati jika pred(ctx) true
bot.route('chat.type', { private: mwA, group: mwB });  // petakan ctx → handler
bot.lazy((ctx) => ctx.from.is_bot ? mwBot : mwUser);   // bangun mw per update
bot.fork(mwLambat);                      // jalan di latar, tidak menahan next()
```

Filter yang didukung `on()`: field update (`message`, `edited_message`,
`callback_query`, `inline_query`, `my_chat_member`, …), properti pesan
(`message:photo`, `message:text`, `:caption`, `:document`, `:sticker`, `:media`, …),
tipe chat (`chat_type:private/group/supergroup/channel`), plus
`callback_query:data`, payment, reaksi, join request.

Handler perintah menerima argumen di `ctx.match`:

```js
bot.cmd('echo', (ctx) => ctx.reply(`argumen: ${ctx.match}`)); // /echo halo → "halo"
```

<a id="context"></a>
### 💬 Shortcut Context

`ctx` membungkus semua jenis update (message, edited, channel, business,
callback, inline…) dengan accessor seragam: `chat`, `from`, `chatId`, `msgId`,
`msg`, `senderChat`, `inlineMessageId`, `businessConnectionId`.

| Kategori | Shortcut |
|---|---|
| **Balasan** | `reply`, `replyWithHTML`, `replyWithMarkdown`, `replyWithPhoto/Video/Audio/Document/Animation/Voice/VideoNote/Sticker/MediaGroup/Location/Venue/Contact/Poll/Dice/Invoice/ChatAction` |
| **Edit & hapus** | `editMessageText/Caption/Media/ReplyMarkup`, `deleteMessage`, `deleteMessages` — sadar callback & inline-message |
| **Reaksi** | `react('👍')` |
| **Teruskan/salin** | `forwardMessage(tujuan)`, `copyMessage(tujuan)` (default pesan saat ini) |
| **Callback & inline** | `answerCallbackQuery` (string atau objek), `answerInlineQuery` |
| **Admin** | `banChatMember`, `restrictChatMember`, `promoteChatMember`, `banAuthor`, `restrictAuthor`, `getChat*`, `getAuthor`, `leaveChat`, `setChatTitle/Description`, `pin/unpinChatMessage` |
| **File** | `getFile()` (pintar: photo terbesar), `downloadFile(dest)` |

Akun business: balasan dalam konteks business otomatis menyertakan
`business_connection_id`.

<a id="rich-messages"></a>
### 🧱 Rich Messages, draft, live photo & pesan ephemeral (Bot API 10.3)

TeleBibz menyediakan builder rich-message dan Context helper; untuk seluruh
**185 metode Bot API** tersedia juga `ctx.api.callApi(method, payload)` yang bertipe,
sementara proxy menerima metode baru lewat object payload.

```js
const { rich, RichMessageBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('laporan', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Laporan', 2),
  rich.paragraph(['Status: ', rich.bold('berhasil')]),
  rich.table([
    [{ text: 'Item', align: 'left', valign: 'middle', is_header: true },
     { text: 'Total', align: 'right', valign: 'middle', is_header: true }],
    [{ text: 'Pesanan', align: 'left', valign: 'middle' },
     { text: '3', align: 'right', valign: 'middle' }],
  ], { bordered: true, striped: true, compact: true }),
  rich.details('Catatan', [rich.paragraph('Rincian tambahan')]),
  rich.buttons([rich.button('Buka', { url: 'https://example.com' }, 'primary')]),
])));

// HTML, Markdown, blok berisi media, list, kutipan, peta, tabel, collage,
// slideshow, button, rich-text entities (bold/customEmoji/dateTime, dll.) juga didukung.
const content = new RichMessageBuilder().markdown('**Hai!**').rtl().build();
await ctx.replyWithRichMessage(content);

// Live photo: kedua file dapat berupa file_id atau InputFile.
await ctx.replyWithLivePhoto('video-file-id', 'photo-file-id', { caption: 'Momen' });

// Draft adalah preview sementara; kirim Rich Message final agar tersimpan.
await ctx.sendRichMessageDraft(1, rich.draftBlocks([
  rich.paragraph('Sedang menulis…'), rich.thinking('Memproses'),
]), { can_stop: true, keep_on_stop: true });
await ctx.replyWithRichMessage(rich.markdown('**Jawaban final**'));

// Ephemeral: pesan hanya terlihat oleh penerima tertentu.
await ctx.replyEphemeral('Pesan privat sementara', ctx.from.id);

// Akses lengkap dan bertipe untuk metode/parameter Bot API (termasuk semua metode 10.3).
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.html('<b>Rich HTML</b>'),
});
```

`RichMessageBuilder` menyediakan `.html()`, `.markdown()`, `.blocks()`, `.add()`,
`.media()`, `.rtl()`, `.skipEntityDetection()`, `.build()`, dan `.buildDraft()`.
`rich.draftHtml()`, `rich.draftMarkdown()`, dan `rich.draftBlocks()` menghasilkan
konten draft-safe serta menolak upload `File` (draft dapat memakai file_id Telegram yang ada).
Rich block builder mencakup
paragraph/heading/pre/list/table/details/quote/map/media/buttons/thinking; block
`thinking` hanya untuk `sendRichMessageDraft`. `InputMediaBuilder.livePhoto()` dan
`InputPaidMediaBuilder.livePhoto()` membentuk payload media live photo. API raw modern lain tersedia lewat
`ctx.api.sendMessageDraft()`, `ctx.api.answerGuestQuery()`, `ctx.api.editEphemeralMessage*()`
dan `ctx.api.deleteEphemeralMessage()`. Tipe resmi Telegram dapat diakses sebagai
`TelegramTypes`; rich input types diekspor langsung.

<a id="keyboard"></a>
### 🔘 Keyboard & tombol

```js
const { btn, url, webApp, copy, kb, InlineKeyboard, Keyboard } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) =>
  ctx.reply('Pilih:', kb([
    [btn('💎 Premium', 'prem', 'primary'),                // biru/ungu
     btn('✅ Daftar', 'reg', 'success')],                 // hijau
    [url('🌐 Web', 'https://situsmu.com')],
    [btn('❌ Tutup', 'close', 'danger', '5408846744727334338')], // merah + IKON ANIMASI
  ])));
```

- 🎨 Warna `style` (`primary`/`success`/`danger`) butuh aplikasi Telegram rilis ≥ Feb 2026 — versi lama tampil biasa, tidak error.
- ✨ `icon_custom_emoji_id` butuh **owner bot ber-Premium** atau username Fragment.
- Helper: `copy(text, nilai)` (salin ke clipboard), `webApp(text, link)`, `kb.confirm(yaData, tidakData)`, `kb.markup(rows)`.
- Kelas fluent: `new InlineKeyboard().text(...).url(...).row().text(...).build()` dan `new Keyboard().text(...).requestContact(...).resized().build()` (reply keyboard asli).

<a id="menu"></a>
### 🍽️ Menu interaktif

```js
const { Menu, MenuContainer } = require('@xbibzlibrary/telebibz');

const mc = new MenuContainer();
const utama = mc.create('utama'), lanjut = mc.create('lanjut');

utama.text('🔔 Notif', async (ctx) => ctx.answerCallbackQuery('dinyalakan!'))
     .row()
     .url('🌐 Web', 'https://x.com')
     .submenu('Lanjut ▶', 'lanjut');
lanjut.back('◀️ Kembali', 'utama');

bot.use(mc); // handler tombol terdaftar otomatis
bot.cmd('cfg', (ctx) => ctx.reply('Menu:', { reply_markup: utama.render(ctx) }));
```

Submenu menukar keyboard di tempat lewat `editMessageReplyMarkup`; tombol usang
dijawab alert ramah, bukan crash.

<a id="wizard"></a>
### 🧙 Wizard — form percakapan, nol boilerplate

```js
bot.wizard('daftar', {
  steps: [
    { key: 'nama', ask: 'Siapa namamu?' },
    { key: 'umur', ask: 'Umur?', parse: Number,
      validate: (n) => (n > 0 && n < 120 ? null : 'Angka saja ya:') },
  ],
  done: async (ans, ctx) => ctx.reply(`Oke ${ans.nama} (${ans.umur})!`),
});
// user tinggal /daftar → bot bertanya sampai selesai.
// ketik "batal" / "cancel" kapan pun untuk berhenti. Sesi otomatis aktif.
```

`bot.wizard(id, def, bindCommand = true)` otomatis mengikat `/id` sebagai
pemicu; pakai `bot.wizardStart(ctx, id)` dari handler mana pun (tombol, menu, …).

#### 🆕 v3.1 — tombol pilihan + mode `edit`/`delete`

```js
bot.wizard('survey', {
  mode: 'edit',        // 'send' (default) | 'edit' | 'delete'
  steps: [
    // reply keyboard — user ketuk, tak perlu mengetik
    { key: 'jk', ask: 'Jenis kelamin?', buttons: ['👨 Laki-laki', '👩 Perempuan'], onlyButtons: true },

    // inline keyboard (callback) — nilai boleh beda dari label
    { key: 'pulau', ask: 'Domisili pulau?', inline: true, onlyButtons: true,
      buttons: [[{ text: '🌋 Jawa', value: 'jawa' }, { text: '🌴 Sumatera', value: 'sumatera' }]] },

    // ketikan bebas dengan validasi (mode bisa di-override per langkah)
    { key: 'umur', ask: 'Umur?', parse: Number, mode: 'send',
      validate: (n) => (n > 0 && n < 120 ? null : 'Angka saja ya:') },
  ],
  done: async (ans, ctx) => ctx.reply(`Tersimpan: ${JSON.stringify(ans)}`),
});
```

| Opsi | Level | Fungsi |
|---|:---:|---|
| `buttons` | step | `['A','B']`, `[{text,value}]`, atau baris eksplisit `[['A'],['B','C']]` |
| `inline` | step | `true` → tombol callback (klik = nilai, tanpa mengetik) |
| `onlyButtons` | step | `true`/string → tolak ketikan bebas, wajib pilih tombol |
| `mode` | def/step | `'send'` pesan baru · `'edit'` satu pesan diedit terus · `'delete'` pesan lama dihapus dulu |
| `cleanup` | def | hapus pesan tanya terakhir saat selesai (default aktif pada mode `'delete'`) |
| `removeKeyboard` | def | singkirkan reply keyboard saat selesai (default `true` bila sempat dipakai) |

Helper programatis: `bot.wizardCancel(ctx)`, `bot.wizardEdit(ctx, teks)`,
`bot.wizardDelete(ctx)`, plus modul `wizard` (`cancel/editAsk/deleteAsk`).
Tombol usang (diklik setelah wizard pindah/selesai) dijawab alert aman — bot
tidak pernah crash. `parse`/`validate` juga berlaku untuk nilai tombol.

<a id="inline"></a>
### ❓ Mode inline

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery(/kucing/i, async (ctx) => {
  await ctx.answerInlineQuery([
    iq.article('1', 'Fakta kucing', { message_text: 'meong!' }),
    iq.photo('2', 'https://x/1.jpg'),
  ], { cache_time: 0 });
});
```

Builder hasil: `iq.article/photo/gif/video/audio/location/sticker`.

<a id="broadcast"></a>
### 📣 Broadcast (aman rate-limit)

```js
const hasil = await bot.broadcast([111, 222, 333], 'Pengumuman!', { delay: 35 });
// → { terkirim: 3, gagal: 0, errors: [] }  (yang memblokir tercatat di errors)
```

`pesan` boleh string, objek payload `sendMessage`, atau fungsi
`(chatId) => payload` untuk personalisasi per penerima. Pacing default 35 ms
(≈28 pesan/detik, aman di bawah limit Telegram).

<a id="file"></a>
### 📎 File & media

```js
const { InputFile, InputMediaBuilder } = require('@xbibzlibrary/telebibz');

bot.cmd('foto', (ctx) => ctx.replyWithPhoto(new InputFile(buffer, 'x.jpg')));
bot.cmd('dok',  (ctx) => ctx.replyWithDocument(new InputFile('/path/file.pdf')));
bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
  InputMediaBuilder.photo('https://a/1.jpg'),
  InputMediaBuilder.photo('https://a/2.jpg', { caption: 'dua' }),
]));
bot.on('message:photo', async (ctx) => {
  const f = await ctx.getFile();          // ukuran photo terbesar, otomatis
  await ctx.downloadFile('./foto.jpg');   // streaming ke disk
});
```

`InputFile` menerima Buffer / Uint8Array / path file / stream fs / async
iterable; upload dikirim sebagai `multipart` dengan `attach://` di mana pun
dalam payload (media group, thumbnail, …). `api.downloadFile(file_id, dest)`
juga bisa berdiri sendiri.

<a id="ratelimit"></a>
### 🛡️ Keandalan & rate limit

```js
const { autoRetry, throttler, limiter } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());            // retry 429, hormati retry_after (maks 5)
bot.api.config.use(throttler());            // antrean global ≤ 28 panggilan/detik
bot.use(limiter({ windowMs: 2000, limit: 3, onExceeded })); // anti-spam per-user
```

Long polling tahan banting secara default: konflik 409 retry tiap 5 detik
(atur via `launch({ conflictDelay: 5000 })`), gangguan jaringan backoff 1
detik, `stop()` keluar dengan bersih (`await bot.runPromise`).

<a id="session"></a>
### 🗃️ Session

```js
const { session } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(token, {
  session: {
    initial: () => ({ hitung: 0 }),
    getKey: (ctx) => `${ctx.from?.id}:${ctx.chat?.id}`,  // default
    storage: adapterRedisKu,  // { read(k), write(k,v), delete(k) } — default: Map memori
  },
});

bot.on(':text', (ctx) => { ctx.session.hitung++; });
```

`ctx.session` selalu ada bahkan tanpa konfigurasi apa pun.

<a id="error"></a>
### 🇮🇩 Error yang bisa dibaca manusia

Setiap error dilaporkan dengan saran yang bisa ditindaklanjuti:

```
✖ Telegram error (403): Forbidden: bot was blocked by the user
  💡 saran: Bot diblokir pengguna — jangan kirim ulang, hapus dari daftar broadcast.
```

`humanize(err)` mengembalikan `{ pesan, saran, method, code }` untuk 15+ error
Telegram umum (token salah, chat not found, hak admin, parse error, rate
limit, callback basi, file kegedean, …). Override lewat
`new TeleBibz(token, { onError: (err, ctx) => {} })`.

<a id="webhook"></a>
### 🕸️ Webhook & serverless

```js
const http = require('http');
http.createServer((req, res) =>
  req.url === '/tg' ? bot.webhook()(req, res) : res.end('ok')
).listen(8443);

// framework apa pun (Express/Fastify/Hono): pasang handler (req, res) dari bot.webhook()
// — atau serverless, langsung:
await bot.handleUpdate(req.body);   // satu update mentah → pipeline penuh
```

Jangan lupa `await bot.init()` dulu kalau tidak memakai `launch()` (untuk
mengambil info bot), dan pasang webhook via `bot.api.setWebhook({ url })`.

<a id="proxy"></a>
### 🔌 Transport proxy (VPS di balik proxy)

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');
const bot = new TeleBibz(token, {
  transport: createTransport(token, { proxy: 'http://user:pass@proxy:8080' }),
});
```

`createTransport(token, { apiRoot, proxy, timeoutMs, headers })` juga bisa
diarahkan ke Bot API server lokal.

<a id="transformer"></a>
### 🧪 Transformer (escape hatch)

```js
bot.api.config.use(async (prev, method, payload) => {
  console.log('→', method);          // lihat/modifikasi semua panggilan Bot API
  return prev(method, payload);
});

// metode apa pun, bahkan yang belum rilis (sihir Proxy):
await bot.api.sendDiceCustom({ chat_id: 1, emoji: '🎲' });
```

<a id="analitik"></a>
## 📈 Analitik & Statistik

### 📊 Repo ini dalam angka

| Metrik | Nilai |
|---|---|
| 📦 Modul sumber | **16 file** di `lib/` |
| 📝 Total baris kode | **±1.700** (tanpa build step) |
| 🔌 Metode Bot API | **90+** — 75 shortcut bertipe + Proxy tanpa batas |
| ⌨️ Shortcut Context | **50+** (reply/edit/delete/admin/react…) |
| 🧪 Test offline | **47/47 lulus**, termasuk transport HTTP lokal dan fitur Bot API 10.3 |
| 🧩 Contoh siap jalan | **7** di `examples/` |
| 📦 Dependency runtime | **4** — semuanya terpakai & ter-test |

### ⬇️ Download & popularitas (live dari npm)

[![per hari](https://img.shields.io/npm/dd/@xbibzlibrary/telebibz?style=flat-square&label=hari&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per minggu](https://img.shields.io/npm/dw/@xbibzlibrary/telebibz?style=flat-square&label=minggu&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per bulan](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=flat-square&label=bulan&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![total](https://img.shields.io/npm/dt/@xbibzlibrary/telebibz?style=flat-square&label=total&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

### 📏 Peta ukuran modul (baris kode)

```
wizard.js      █████████████████████████ 247  ← form + tombol + edit/delete
telebibz.js    ███████████████████▎      193  ← kelas utama & siklus hidup
context.js     ███████████████████       190  ← ctx + 50-an shortcut
composer.js    █████████████████▍        174  ← mesin middleware & filter
api.js         ███████████████▍          154  ← 75 shortcut + Proxy + transformer
net.js         ███████████▌              115  ← transport axios + multipart
menus.js       █████████                  90  ← Menu/MenuContainer
keyboard.js    ████████▎                  83  ← btn/url/kb + kelas fluent
ratelimit.js   ██████                     61  ← autoRetry · throttler · limiter
runner.js      ████▌                      45  ← polling tahan-409
file.js        ████                       41  ← InputFile + InputMediaBuilder
logger.js      ███▊                       38  ← log + banner
session.js     ███▌                       36  ← session swappable
errors.js      ███▌                       35  ← humanize error 🇮
broadcast.js   ███▌                       35  ← blast aman rate-limit
inline-query.js██▊                        28  ← matcher + builder hasil
```

### 🗺️ Kesehatan repo

<div align="center">

[![kartu repo](https://github-readme-stats.vercel.app/api/pin/?username=XbibzOfficial777&repo=telebibz&show_owner=false)](https://github.com/XbibzOfficial777/telebibz)

</div>

<details>
<summary>📅 Riwayat bintang (klik untuk buka)</summary>

![Star History](https://api.star-history.com/svg?repos=XbibzOfficial777/telebibz&type=Date)

</details>

<a id="contoh"></a>
## 🧩 Contoh Siap Jalan (`examples/`)

| File | Isi |
|---|---|
| `01-quickstart.js` | bot jalan dalam 6 baris |
| `02-menu-tombol.js` | keyboard berwarna + ikon animasi |
| `03-wizard.js` | form pendaftaran + **tombol + mode edit** |
| `04-broadcast.js` | blast admin |
| `05-kirim-file.js` | foto & dokumen dari buffer |
| `06-menu.js` | menu interaktif + submenu |
| `07-inline-query.js` | mode inline dengan builder hasil |
| `08-rich-message.js` | rich messages, live photo, draft, ephemeral, dan raw method API |

Jalankan dengan `BOT_TOKEN=123:abc node examples/01-quickstart.js`.

<a id="test"></a>
## 🔬 Test & Bukti Live

```bash
npm test       # 47 test offline (mock + HTTP server lokal), tanpa token Telegram
npm run typecheck # cek declaration TypeScript + payload method-specific
```

Audit saat ini tidak membutuhkan token Telegram. Versi repo sebelumnya mencatat
**30 test offline + 10 test live** pada `@xbibzrat_bot`; pengujian live tersebut
bersifat historis dan tidak diulang pada audit ini. Lihat [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md)
untuk matriks test, perbandingan Bot API 10.3, dan batasan yang tersisa.

Log debug: `DEBUG=telebibz:net,telebibz:ratelimit node botkamu.js`.

<a id="struktur"></a>
## 📂 Struktur Repo (16 file inti)

| File | Peran |
|---|---|
| `lib/net.js` | transport axios keep-alive + multipart `attach://` |
| `lib/api.js` | metode Bot API + Proxy segala metode + transformer |
| `lib/composer.js` | middleware, filter `on('message:photo')`, `errorBoundary` |
| `lib/context.js` | objek ctx + 50-an pintasan reply/edit/delete/callback |
| `lib/session.js` | sesi per user:chat (storage swappable) |
| `lib/runner.js` | long polling: retry 409, backoff jaringan, drop pending |
| `lib/wizard.js` | form percakapan + tombol pilihan + mode edit/delete |
| `lib/menus.js` | menu interaktif `Menu`/`MenuContainer` |
| `lib/keyboard.js` | builder tombol + kelas fluent `InlineKeyboard`/`Keyboard` |
| `lib/ratelimit.js` | `autoRetry` 429 · antre `throttler` · `limiter` per-user |
| `lib/broadcast.js` | blast aman rate-limit |
| `lib/file.js` | `File`/`InputFile` (Buffer/path/stream) + `InputMediaBuilder` |
| `lib/inline-query.js` | matcher query + builder hasil inline |
| `lib/errors.js` | humanisasi error + saran |
| `lib/logger.js` | log berbingkai + banner boot |
| `index.js` / `index.d.ts` | pintu ekspor + tipe TypeScript |

<a id="changelog"></a>
## 🕐 Changelog

- **3.1.0** — wizard: tombol pilihan (reply/inline), mode `edit`/`delete`, cleanup otomatis, helper programatis · test 24 → 30
- **3.0.0** — parity grammY production-grade: axios keep-alive, transformer, menu, inline query, limiter
- **2.0.0** — engine ditulis ulang dari nol, transport multipart, webhook Node murni
- **1.0.0** — recode arsitektur grammY

> Detail lengkap di [`CHANGELOG.md`](CHANGELOG.md). Studi arsitektur mendalam: [`ANALISIS-telebibz.md`](ANALISIS-telebibz.md).

<a id="publishing"></a>
## 📦 Publikasi npm otomatis

Workflow `.github/workflows/auto-publish.yml` menerbitkan saat ada push ke `main` (kecuali commit rilis yang memuat `[skip release]`) atau manual dari branch `main` lewat **Actions → Auto publish to npm → Run workflow** (workflow menolak dispatch dari branch lain). Sebelum mengaktifkannya, buat GitHub Actions Environment bernama `npm-release`, lalu tambahkan secret **`NPM_TOKEN`** yang berizin menerbitkan `@xbibzlibrary/telebibz`. Token tidak disimpan di repo.

Workflow memilih patch berikutnya berdasarkan versi yang lebih tinggi antara repo dan versi terbaru npm; lalu menjalankan test runtime, typecheck TypeScript, pemeriksaan sintaks JS, simulasi paket, dan audit dependency produksi. Workflow mem-publish sebagai paket publik, commit bump `package.json`/lockfile, membuat tag anotasi `vX.Y.Z`, dan GitHub Release. Validasi yang gagal menghentikan workflow sebelum publish. Konfigurasi ditinjau secara lokal; verifikasi Actions nyata dan publish memerlukan akses repo dan secret tersebut.

<a id="lisensi"></a>
## 📄 Lisensi

**MIT** © Xbibz Technology ID — arsitektur terinspirasi [grammY](https://grammy.dev) (MIT, lihat [`NOTICE.md`](NOTICE.md)).

---

<div align="center">

**Dibuat dengan ❤️ oleh Xbibz Technology ID**

Kalau telebibz membantumu, bintang ⭐ repo ini sangat berarti.

[![kunjungan repo](https://komarev.com/ghpvc/?username=XbibzOfficial777&repo=telebibz&style=flat-square&color=blueviolet&label=kunjungan+repo)](https://github.com/XbibzOfficial777/telebibz)

</div>
