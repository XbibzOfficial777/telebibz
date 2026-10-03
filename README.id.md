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
[![tests](https://img.shields.io/badge/test-48%2F48%20lulus-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](#-test--bukti-live)
[![size](https://img.shields.io/badge/kode-2.1k%20baris-orange?style=for-the-badge&logo=codeigniter&logoColor=white)](#-analitik--statistik)
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
| 🎛️ [Handler & filter](#handler) | 💬 [Shortcut Context](#context) | 🧱 [Rich Message & Bot API 10.3](#rich-messages) |
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
| **185 signature payload Bot API spesifik** (`callApi`) | ✅ | ✅ |
| Rich Message: block, entity, draft, media, emoji bergerak | beragam per API | ✅ bawaan |
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
| TypeScript | ✅ full | ✅ tipe spesifik untuk 185 metode Bot API |
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
  maxConcurrentUpdates: 256, // batas update aktif (default: 256)
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
### 🧱 Rich Message, emoji bergerak, media & draft (Bot API 10.3)

**Rich Message** adalah format Telegram terstruktur: satu pesan dapat memuat rich-text entities, heading, list, kutipan, tabel, peta, tombol, blok media, dan elemen lainnya. TeleBibz menyediakan builder dan shortcut Context; [referensi resmi Telegram Bot API](https://core.telegram.org/bots/api) tetap menjadi sumber otoritatif untuk batasan dan kelayakan fitur.

> **Catatan cakupan:** schema memuat **185 nama metode Bot API** dan payload bertipe melalui `api.callApi()`. Ini tidak berarti seluruh 185 endpoint aman atau bermakna untuk dites live: sebagian memerlukan update nyata, hak admin, pembayaran, atau chat tertentu. Matriks live test dan batasannya ada di [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md).

#### 1. Pilih tepat satu mode konten

Satu rich message harus memakai tepat satu sumber konten: `html`, `markdown`, atau `blocks`. Opsi seperti `media`, `is_rtl`, dan `skip_entity_detection` bersifat tambahan, bukan mode konten.

```js
const { TeleBibz, rich, RichMessageBuilder } = require('@xbibzlibrary/telebibz');
const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('laporan', async (ctx) => {
  const message = rich.blocks([
    rich.heading('Laporan mingguan', 2),
    rich.paragraph(['Pesanan: ', rich.bold('42'), ' · status ', rich.italic('siap')]),
    rich.table([
      [
        { text: 'Metrik', is_header: true, align: 'left', valign: 'middle' },
        { text: 'Nilai', is_header: true, align: 'right', valign: 'middle' },
      ],
      [
        { text: 'Pendapatan', align: 'left', valign: 'middle' },
        { text: 'Rp1.250.000', align: 'right', valign: 'middle' },
      ],
    ], { bordered: true, striped: true, compact: true, caption: 'Minggu ini' }),
    rich.details('Informasi tambahan', [rich.paragraph('Bagian ini dapat dibuka.')]),
    rich.buttons([
      rich.button('Buka dashboard', { url: 'https://example.com' }, 'primary'),
      rich.button('Konfirmasi', { callback_data: 'report:ack' }, 'success'),
    ], 'center'),
  ]);
  return ctx.replyWithRichMessage(message);
});

bot.launch();
```

Konstruktor tingkat rendah: `rich.html(html, options)`, `rich.markdown(markdown, options)`, dan `rich.blocks(blocks, options)`. `inputRichMessage(content, options)` memvalidasi pemilihan satu mode. Untuk merakit pesan bertahap, gunakan `RichMessageBuilder`:

```js
const message = new RichMessageBuilder()
  .blocks([rich.heading('Pengumuman', 2)])
  .add(rich.paragraph('Blok berikutnya bisa ditambahkan.'))
  .rtl(false)
  .skipEntityDetection()
  .build();
await ctx.replyWithRichMessage(message);
```

Pada satu builder, pemanggilan `.html()`, `.markdown()`, atau `.blocks()` kedua akan error. Buat builder baru untuk mode lain. `.media()` digunakan bersama konten HTML/Markdown yang menunjuk media melalui tautan `tg://...`.

#### 2. Rich-text entities

Rich text dapat berupa string biasa, array campuran string dan objek entity, atau objek rich-text bertingkat. Helper yang tersedia:

| Helper | Entity | Kegunaan |
|---|---|---|
| `rich.bold(text)`, `rich.italic(text)`, `rich.underline(text)`, `rich.strikethrough(text)` | penekanan | format teks inline |
| `rich.spoiler(text)`, `rich.marked(text)`, `rich.code(text)` | spoiler / marked / code | teks tersembunyi atau teknis |
| `rich.subscript(text)`, `rich.superscript(text)` | posisi huruf | rumus dan referensi |
| `rich.dateTime(text, unixTime, format)` | tanggal/waktu | timestamp lokal atau relatif |
| `rich.url(text, url)`, `rich.email(text, email)`, `rich.phone(text, phone)` | tautan/kontak | tautan atau informasi kontak |
| `rich.mention(text, username)`, `rich.textMention(text, user)` | mention | username atau objek User |
| `rich.hashtag(text, value)`, `rich.cashtag(text, value)`, `rich.botCommand(text, value)` | entity Telegram | tag dan command |
| `rich.customEmoji(customEmojiId, alternativeText)` | custom emoji | custom emoji statis maupun bergerak |
| `rich.mathText(expression)`, `rich.anchorText(name)`, `rich.anchorLink(text, name)`, `rich.reference(text, name)`, `rich.referenceLink(text, name)` | rumus/navigasi | teks panjang terstruktur |
| `rich.buttonText(text, action, style)` | tombol di rich-text inline | entity tombol di dalam satu rangkaian teks |

Contoh custom emoji bergerak (gunakan **ID custom emoji yang nyata** dan dapat dipakai bot):

```js
const emojiId = 'CUSTOM_EMOJI_ID';
const [sticker] = await ctx.api.callApi('getCustomEmojiStickers', {
  custom_emoji_ids: [emojiId],
});
if (!sticker) throw new Error('Custom emoji ID tidak ditemukan');
await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph(['Status build: ', rich.bold('lulus'), ' ', rich.customEmoji(emojiId, '👍')]),
]));
```

Emoji Unicode biasa tidak otomatis menjadi emoji custom bergerak. ID harus valid dan dapat digunakan bot; Telegram dapat menolak ID atau fitur yang tidak tersedia bagi bot tersebut.

#### 3. Katalog blok terstruktur

Setiap helper menghasilkan objek `InputRichBlock`. Blok dapat disusun bertingkat sesuai schema Telegram.

| Kelompok | Helper | Catatan |
|---|---|---|
| Teks | `paragraph(text)`, `heading(text, size)`, `pre(text, language)`, `footer(text)`, `divider()` | ukuran heading 1–6; `pre` dapat menyebut bahasa kode |
| Rumus/navigasi | `mathBlock(expression)`, `anchor(name)` | pasangan entity inline tersedia untuk isi teks |
| List/kutipan | `list(items)`, `quote(blocks, credit)`, `expandableQuote(text, credit)`, `pullQuote(text, credit)` | item list bisa string atau item terstruktur; kutipan dapat berisi blok lain |
| Tabel/disclosure | `table(cells, options)`, `details(summary, blocks, open)` | tiap sel memberi `align` dan `valign`; opsi tabel: `bordered`, `striped`, `compact`, `caption` |
| Lokasi | `map(location, zoom, width, height, caption, credit)` | `location` berbentuk `{ latitude, longitude }` |
| Media | `animation(media, caption)`, `audio(media, caption)`, `document(media, caption)`, `photo(media, caption)`, `video(media, caption)`, `voiceNote(media, caption)` | `media` adalah objek `InputMedia*`; upload `File` dikumpulkan menjadi multipart `attach://` |
| Tata letak | `collage(blocks, caption, credit)`, `slideshow(blocks, caption, credit)` | gabungkan blok media yang didukung menjadi galeri atau urutan |
| Tombol | `buttons(buttons, align)`, `button(text, action, style)` | 1–8 tombol; `align`: `left`, `center`, atau `right` |
| Khusus draft | `thinking(text)` | hanya untuk `sendRichMessageDraft`, bukan pesan rich yang disimpan |

Setiap sel tabel berbentuk `{ text, align: 'left'|'center'|'right', valign: 'top'|'middle'|'bottom' }`; sel header dapat memakai `is_header: true`. Satu tombol harus memilih tepat satu aksi seperti `url`, `callback_data`, `web_app`, `copy_text`, atau `disabled`. `rich.button()` menghasilkan objek tombol untuk block `buttons`; `rich.buttonText()` menghasilkan bentuk entity RichText yang berbeda. Style `link` hanya berlaku untuk tombol callback.

#### 4. Upload media di dalam rich message

Gunakan `file_id` Telegram untuk file yang sudah ada di server, atau bungkus bytes/path/stream dengan `File`/`InputFile` agar transport membuat multipart upload:

```js
const fs = require('node:fs');
const { File, InputMediaBuilder } = require('@xbibzlibrary/telebibz');
const image = new File(fs.readFileSync('./hero.png'), 'hero.png');
const video = new File(fs.readFileSync('./clip.mp4'), 'clip.mp4');

await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph('Contoh blok media:'),
  rich.photo(InputMediaBuilder.photo(image)),
  rich.video(InputMediaBuilder.video(video)),
]));
```

HTML/Markdown dapat merujuk media menggunakan ID unik dan entri `media` yang cocok:

```js
const photo = new File(fs.readFileSync('./hero.png'), 'hero.png');
await ctx.replyWithRichMessage(rich.html(
  '<b>Foto utama</b><br><a href="tg://photo?id=hero">Buka foto</a>',
  { media: [{ id: 'hero', media: InputMediaBuilder.photo(photo) }] },
));
```

Live smoke test berhasil mengirim media multipart bertingkat, blok photo/audio/document/video/voice note, collage/slideshow, dan media reference HTML. Pada server Telegram yang diuji, MP4 diterima sebagai rich `animation`, sedangkan GIF pada blok itu menghasilkan `RICH_MESSAGE_VIDEO_INVALID`. Metode standalone `sendAnimation` menerima GIF yang sama. Jika blok rich animation ditolak, coba MP4. Live photo dikirim lewat metode terpisah, bukan tipe `InputRichBlock`.

#### 5. Draft dan preview streaming

Draft hanya preview sementara, bukan pesan chat yang tersimpan. Kirim pesan final secara terpisah untuk menyimpan jawaban. Blok `thinking` hanya untuk rich draft. Builder draft menolak upload baru melalui `File`; gunakan `file_id` Telegram jika draft perlu media.

```js
bot.cmd('preview', async (ctx) => {
  const draftId = Date.now(); // tidak nol dan unik untuk draft ini
  await ctx.sendMessageDraft(draftId, 'Sedang menyiapkan jawaban…', { can_stop: true });
  await ctx.sendRichMessageDraft(draftId + 1, rich.draftBlocks([
    rich.paragraph(['Menyiapkan ', rich.bold('laporan Anda'), '…']),
    rich.thinking('Mengumpulkan data'),
  ]), { can_stop: true, keep_on_stop: true });
  // Kirim jawaban final agar tersimpan:
  return ctx.replyWithRichMessage(rich.markdown('**Laporan siap**'));
});
```

Konstruktor khusus draft: `rich.draftHtml()`, `rich.draftMarkdown()`, `rich.draftBlocks()`, dan `new RichMessageBuilder()...buildDraft()`. Hasilnya mengikuti schema `sendRichMessageDraft` yang tidak menerima upload `File` baru. `sendMessageDraft` dan `sendRichMessageDraft` juga bisa dipanggil dengan payload object tepat melalui `ctx.api.callApi()`.

#### 6. Live photo, paid media, ephemeral, dan edit

**Live photo** mengirim pasangan video dan foto statis yang terkait. Keduanya bisa berupa `file_id` atau `File`/`InputFile`; URL tidak didukung oleh schema metode saat ini.

```js
await ctx.replyWithLivePhoto('VIDEO_FILE_ID', 'PHOTO_FILE_ID', { caption: 'Sebuah momen' });
// Atau API mentah bertipe:
await ctx.api.sendLivePhoto({ chat_id: ctx.chatId, live_photo: videoFile, photo: photoFile });
```

`InputMediaBuilder.livePhoto(video, photo)` dan `InputPaidMediaBuilder.livePhoto(video, photo)` membangun objek media. `sendPaidMedia` membutuhkan `star_count` antara 1 dan 25.000:

```js
const fs = require('node:fs');
const { File, InputPaidMediaBuilder } = require('@xbibzlibrary/telebibz');
const paidPhoto = new File(fs.readFileSync('./paid.png'), 'paid.png');
await ctx.api.callApi('sendPaidMedia', {
  chat_id: ctx.chatId,
  star_count: 1,
  media: [InputPaidMediaBuilder.photo(paidPhoto)],
  caption: 'Contoh foto berbayar',
});
```

Fitur ini membuat paywall/pembayaran sungguhan: jangan dites ke pengguna tanpa persetujuan dan periksa penggunaan Telegram Stars sebelum memublikasikan konten berbayar.

**Pesan ephemeral** ditujukan ke penerima melalui `ephemeral_message_parameters`; kelayakannya bergantung pada aturan dan izin Telegram untuk bot/chat terkait. Helper Context meliputi `replyEphemeral(text, receiverUserId)`, `editEphemeralMessageText`, `editEphemeralRichMessage`, `editEphemeralMessageMedia`, `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup`, dan `deleteEphemeralMessage`.

```js
await ctx.replyEphemeral('Pemberitahuan sementara', ctx.from.id);
const sent = await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.blocks([rich.paragraph('Preview rich privat')]),
  ephemeral_message_parameters: { receiver_user_id: ctx.from.id },
});
// Jika Telegram mengembalikan ephemeral_message_id, ID tersebut dapat dipakai untuk edit/hapus.
if (sent.ephemeral_message_id) {
  await ctx.editEphemeralRichMessage(ctx.from.id, sent.ephemeral_message_id,
    rich.blocks([rich.paragraph('Pemberitahuan sementara diperbarui')]));
}
```

Telegram bisa menolak dengan `BOT_NOT_ADMIN` atau error izin lain; baca `ApiError` yang diterima dan jangan menganggap payload lolos test lokal berarti bot pasti berhak mengirimnya.

Untuk mengedit rich message biasa, gunakan `ctx.editRichMessage(content, extra)`. API di bawahnya adalah `editMessageText` dengan `rich_message` dan target `chat_id`/`message_id` (atau `inline_message_id`). Operasi edit mengubah pesan yang ada; gunakan pesan khusus test.

#### 7. Shortcut Context dan metode Bot API modern

| Helper | Fungsi / argumen |
|---|---|
| `ctx.replyWithRichMessage(content, extra?)` | kirim rich message tersimpan ke chat saat ini |
| `ctx.editRichMessage(content, extra?)` | edit rich message saat ini; mendukung callback dan inline target |
| `ctx.replyWithLivePhoto(video, photo, extra?)` | kirim live photo ke chat saat ini |
| `ctx.sendMessageDraft(draftId, text, extra?)` | preview teks sementara |
| `ctx.sendRichMessageDraft(draftId, richMessage, extra?)` | preview rich sementara |
| `ctx.replyEphemeral(text, receiverUserId, extra?)` | kirim teks ephemeral ke penerima tertentu |
| `ctx.guestQueryId`, `ctx.answerGuestQuery(result)` | proses update `guest_message` yang nyata |
| `ctx.editEphemeralRichMessage(...)`, `ctx.deleteEphemeralMessage(...)` | edit/hapus pesan ephemeral milik penerima |

Jawaban guest query membutuhkan `guest_query_id` dari update masuk yang asli; ID buatan tidak dapat dipakai untuk tes live yang bermakna. Artikel inline rich dapat dibuat dengan `iq.richArticle(id, title, richMessage, extra)` lalu dikembalikan saat menangani inline query sungguhan.

#### 8. Akses penuh Bot API dengan tipe

Semua **185 nama metode dan signature payload** pada schema Bot API vendored tersedia lewat `api.callApi()` dan `api.raw()` di TypeScript:

```js
// JavaScript maupun TypeScript: nama metode + object payload
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.markdown('**Halo**'),
});

await ctx.api.callApi('sendMessageDraft', {
  chat_id: ctx.chatId,
  draft_id: Date.now(),
  text: 'Preview',
  can_stop: false,
});
```

Namespace `TelegramTypes` mengekspor tipe object Telegram. Alias yang berguna: `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, dan `TelegramApiPayloads`. Proxy runtime juga menerima `ctx.api.metodeApaPun({ ...payload })` untuk metode baru, tetapi shorthand dinamis ini tidak memvalidasi schema saat runtime. Pengecekan TypeScript terjadi ketika compile saja. Jalankan `npm run typecheck` untuk memeriksa deklarasi dan contoh consumer.

Deklarasi ini vendored dari `@grammyjs/types@5.0.0` berlisensi MIT (lihat [`NOTICE.md`](NOTICE.md) dan lisensi di folder types); tidak ada dependency runtime baru. Referensi/changelog Telegram resmi—bukan package vendored—tetap otoritas saat ada perbedaan field, izin, atau batasan.

#### Batas payload dan pemecahan masalah

Schema tipe Bot API 10.3 mencatat batas Rich Message berikut: **32.768 karakter UTF-8**, **500 block** (termasuk konten nested/list/tabel/kutipan/details), **16 level nesting**, **50 attachment media**, dan **20 kolom tabel**. Block map memakai zoom 0–24 dan lebar/tinggi 0–10.000; block tombol berisi 1–8 tombol. Batas Telegram dapat berubah, jadi cek [referensi resmi](https://core.telegram.org/bots/api) sebelum membuat payload besar. Server Telegram tetap validator terakhir.

Error yang umum:

- `RICH_MESSAGE_VIDEO_INVALID`: server yang diuji menolak GIF pada block Rich Message `animation`; coba MP4. Endpoint standalone `sendAnimation` menerima GIF tersebut.
- `BOT_NOT_ADMIN` pada pesan ephemeral: respons ini terkait izin/kelayakan Telegram, bukan bukti bahwa bentuk JSON salah. Periksa akses bot/chat dan syarat metode resmi.
- `chat not found`: pada private chat, penerima biasanya perlu membuka bot dan menekan **Start** sebelum bot dapat mengirim pesan.
- Error upload: bungkus bytes/path/stream dengan `File`/`InputFile` dan pastikan tipe helper cocok dengan file.

#### Hasil live test dan batasan

Pada 2026-09-28, smoke test live dengan bot yang diberikan pengguna berhasil untuk rich blocks, HTML, Markdown, custom emoji bergerak, draft teks/rich, multipart media, blok photo/audio/document/video/voice-note, collage/slideshow, live photo, GIF melalui `sendAnimation`, dan HTML media reference. Ephemeral `sendMessage`/`sendRichMessage` ditolak Telegram dengan `BOT_NOT_ADMIN`; paid media tidak dikirim karena dapat melibatkan Stars; callback tidak diklik; seluruh 185 endpoint tidak dijalankan live. Rincian hasil dan batas cakupan ada di [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md).

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
| 📦 Modul sumber | **18 file** di `lib/` |
| 📝 Total baris kode | **2.105** di `lib/` (tanpa build step) |
| 🔌 Metode Bot API | **185 signature bertipe** lewat `api.callApi()` + dynamic Proxy |
| ⌨️ Shortcut Context | **50+** (reply/edit/delete/admin/react…) |
| 🧪 Test offline | **48/48 lulus**, termasuk transport HTTP lokal dan fitur Bot API 10.3 |
| 🧩 Contoh siap jalan | **8** di `examples/` |
| 📦 Dependency runtime | **4** — semuanya terpakai & ter-test |

### ⬇️ Download & popularitas (live dari npm)

[![per hari](https://img.shields.io/npm/dd/@xbibzlibrary/telebibz?style=flat-square&label=hari&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per minggu](https://img.shields.io/npm/dw/@xbibzlibrary/telebibz?style=flat-square&label=minggu&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![per bulan](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz?style=flat-square&label=bulan&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![total](https://img.shields.io/npm/dt/@xbibzlibrary/telebibz?style=flat-square&label=total&color=informational)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

### 📏 Peta ukuran modul (baris kode)

Angka berikut dihitung dari source terkini `lib/*.js`; ini informasi source, bukan ukuran bundle.

```text
context.js          250  accessor Context, reply, edit dan helper
wizard.js           247  form terpandu, tombol, mode edit/delete
telebibz.js         209  kelas bot, lifecycle dan dispatch update
telegram-methods.js 192  registry runtime 185 nama metode Bot API
composer.js         185  komposisi middleware dan filter
rich.js             175  builder Rich Message, entity dan block
api.js              168  adapter API, Proxy dan transformer
net.js              115  transport HTTP dan multipart upload
menus.js              90  Menu dan MenuContainer
keyboard.js           83  builder keyboard dan fluent class
ratelimit.js          74  retry, throttler dan limiter
logger.js             68  log dan banner boot
runner.js             54  polling dan retry
file.js               48  File/InputFile dan media builder
session.js            44  session storage swappable
errors.js             35  terjemahan error
broadcast.js          35  helper broadcast
inline-query.js       33  pencocokan inline dan builder hasil
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
npm test       # 48 test offline (mock + HTTP server lokal), tanpa token Telegram
npm run typecheck # cek declaration TypeScript + payload method-specific
```

48 test otomatis dan `npm run typecheck` berjalan offline dengan mock tanpa token bot. Secara terpisah dilakukan live smoke test pada bot uji milik pengguna: rich blocks, HTML/Markdown, custom emoji bergerak, draft, blok media, collage/slideshow, live photo, dan referensi media multipart berhasil. Pengiriman ephemeral ditolak Telegram dengan `BOT_NOT_ADMIN`; paid media dan semua 185 endpoint tidak diuji live. Lihat [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md) untuk matriks lengkap, batasan, serta hasil yang gagal.

Log debug: `DEBUG=telebibz:net,telebibz:ratelimit node botkamu.js`.

<a id="struktur"></a>
## 📂 Struktur Repo (18 modul JavaScript + tipe API vendored)

| File | Peran |
|---|---|
| `lib/net.js` | transport axios keep-alive + multipart `attach://` |
| `lib/api.js` | metode Bot API + Proxy segala metode + transformer |
| `lib/rich.js` | entity Rich Message, builder block, helper draft-safe |
| `lib/telegram-methods.js` | registry 185 nama metode Bot API |
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
| `types/telegram-bot-api/` | tipe Bot API vendored (MIT), tanpa kode runtime |
| `index.js` / `index.d.ts` | ekspor dan surface method/payload bertipe |

<a id="changelog"></a>
## 🕐 Changelog

- **Unreleased — Bot API 10.3** — rich message, emoji bergerak, draft, live photo, payload bertipe untuk 185 metode; 48 test offline dan live verification lebih luas. Detail: [`CHANGELOG.md`](CHANGELOG.md).
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
