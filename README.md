# 🤖 telebibz

**Library Telegram paling gampang untuk Node.js, set fitur penuh setara grammY** — recode mandiri atas arsitektur elegan [grammY](https://grammy.dev) (MIT — lihat [NOTICE.md](NOTICE.md)) dengan dependency produksi yang **benar-benar dipakai** (axios keep-alive, mime-types, https-proxy-agent, debug).

```
npm install @xbibzlibrary/telebibz
```

## 📊 FEATURE MATRIX (parity grammY)

| Fitur | grammY | telebibz |
|---|---|---|
| Proxy API **segala metode** (auto-generated) | ✅ `api.xyz()` | ✅ `api.xyz({...})` |
| ~60 shortcut bertipe (sendMessage, banChatMember…) | ✅ | ✅ |
| Context lengkap (~70 pintasan reply/edit/admin/react) | ✅ | ✅ |
| Context flavor business (`business_connection_id` otomatis) | plugin | ✅ bawaan |
| Filter `on('message:photo' / ':text' / 'chat_type:private' …)` | ✅ | ✅ |
| `cmd / hears / action / inlineQuery` | ✅ | ✅ (+ inlineQuery matcher) |
| `branch / filter / drop / route / lazy / fork` | ✅ | ✅ |
| Error boundary + catch | ✅ | ✅ (semua shortcut otomatis terlindungi) |
| Session + storage swappable | ✅ | ✅ |
| Transformer API (`api.config.use`) | ✅ | ✅ |
| `auto-retry` 429 hormati `retry_after` | plugin (@grammyjs/auto-retry) | ✅ bawaan `autoRetry()` |
| Throttler antre-rate-limit | plugin | ✅ bawaan `throttler()` |
| Rate limit per-user | plugin | ✅ bawaan `limiter()` |
| `InputFile` Buffer/path/stream + multipart attach:// | ✅ | ✅ |
| `InputMedia` builder + media group | ✅ | ✅ `InputMediaBuilder` |
| Download file (`getFile`/`downloadFile`) | plugin grammy/files | ✅ bawaan |
| Keyboard & InlineKeyboard fluent class | ✅ | ✅ |
| Menu interaktif | plugin @grammyjs/menu | ✅ bawaan `Menu/MenuContainer` |
| Wizard/percakapan | plugin conversations | ✅ bawaan `wizard()` (lebih simpel) |
| Long polling tahan-409 | ❌ (fatal crash) | ✅ bawaan (auto-retry 5 dtk) |
| Broadcast siap pakai | ❌ | ✅ `bot.broadcast()` |
| Humanisasi error + saran (🇮🇩) | ❌ | ✅ `humanize()` |
| Banner boot cantik + log debug | ❌ | ✅ (`DEBUG=telebibz*`) |
| Proxy HTTP(S) untuk VPS | ⚠️ via config manual | ✅ opsi `proxy` transport |
| TypeScript | ✅ full | d.ts longgar (JS-first) |
| Docs bahasa | en | **🇮🇩 Indonesia-first** |

## Dependensi (semuanya dipakai nyata — tertest)
| Paket | Untuk |
|---|---|
| `axios ^1.20` | transport keep-alive + streaming downloadFile |
| `mime-types ^3.0` | deteksi content-type upload |
| `https-proxy-agent ^9.1` | opsi proxy transport VPS |
| `debug ^4.4` | logging `DEBUG=telebibz:net,telebibz:ratelimit` |

> ❓ *"Kenapa bukan protobuf?"* — Bot API memakai **JSON/HTTP murni**, protobuf hanya relevan di dunia MTProto (user-client). Menambahkannya = dependency mati, melanggar prinsip *"semua library harus berfungsi"*.

---

## 🚀 Mulai dalam 6 baris

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz('TOKEN_DARI_BOTFATHER');

bot.cmd('start', (ctx) => ctx.reply('Halo!'));
bot.hears(/halo/i, (ctx) => ctx.reply('halo juga 👋'));

bot.launch();
```

```
BOT_TOKEN=123:abc node index.js
```

Output terminal:
```
┌────────────────────────┐
│  🤖 TeleBibz ON        │
│  bot      : @botkamu   │
│  engine   : grammY 1.46│
│  brand    : //—Xbibz Official—//
└────────────────────────┘
✔ menunggu update… (Ctrl+C untuk berhenti)
```

> **Hidup di VPS:** kalau ada instance bot lain yang masih polling (409 Conflict — misal deploy
> ganda atau hosting restart), telebibz **otomatis retry tiap 5 detik tanpa crash** dan menyalakan
> diri begitu jalur bebas. Tidak perlu PM2 babysitter.

---

## 📚 API lengkap (semuanya!)

### Perintah & teks

```js
bot.cmd('ping',          (ctx) => ctx.reply('pong'));      // /ping
bot.cmd(['a', 'b'],      handler);                          // /a ATAU /b
bot.hears('daftar',      handler);                          // teks persis "daftar"
bot.hears(/kampret/i,    handler);                          // regex bebas
bot.on('message:photo',  handler);                          // filter grammY apa pun
bot.use(middleware);                                       // middleware manual
```

### Tombol (keyboard) — berwarna & ikon animated

```js
const { btn, url, webApp, copy, kb } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) =>
  ctx.reply('Pilih:', kb([
    [btn('💎 Premium', 'prem', 'primary'),                // biru/ungu
     btn('✅ Daftar', 'reg', 'success')],                 // hijau
    [url('🌐 Web', 'https://situsmu.com')],
    [btn('❌ Tutup', 'close', 'danger', '5408846744727334338')], // merah + IKON ANIMASI
  ])));

bot.action('prem', async (ctx) => {
  await ctx.answerCallbackQuery('Menuju premium…');
  await ctx.reply('halaman premium');
});
```

- Warna (`primary`/`success`/`danger`) butuh aplikasi Telegram rilis ≥ Feb 2026 — versi lama tampil biasa, tidak error.
- Ikon animated (`icon_custom_emoji_id`) butuh **owner bot ber-Premium** atau username Fragment. Cari ID-nya: kirim custom emoji ke bot + lihat entity `custom_emoji` di update (atau sediakan `/emojiid` sendiri, 5 baris lewat `bot.on('message')`).

### Wizard — form tanya-jawab tanpa boilerplate

```js
bot.wizard('daftar', {
  steps: [
    { key: 'nama', ask: 'Siapa namamu?' },
    { key: 'umur', ask: 'Umur?', parse: Number,
      validate: (n) => (n > 0 && n < 120 ? null : 'Angka saja ya:') },
  ],
  done: async (ans, ctx) => ctx.reply(`Oke ${ans.nama} (${ans.umur})!`),
});
// user tinggal /daftar → bot bertanya-bertanya sampai selesai.
// ketik "batal" kapan pun untuk berhenti. Sesi otomatis aktif, tak perlu setup.
```

### Broadcast aman rate-limit

```js
const hasil = await bot.broadcast([111, 222, 333], 'Pengumuman!', { delay: 35 });
// → { terkirim: 3, gagal: 0, errors: [] }  (yang diblokir-mu tercatat di errors)
```

### Kirim file

```js
const { InputFile } = require('@xbibzlibrary/telebibz');
bot.cmd('foto', (ctx) => ctx.replyWithPhoto(new InputFile(buf, 'x.jpg')));
```

### Error yang bisa dibaca manusia

Default-nya setiap error dilaporkan dengan **saran penyelesaian**:
```
✖ Telegram error (403): Forbidden: bot was blocked by the user
  💡 saran: Bot diblokir pengguna — jangan kirim ulang, hapus dari daftar broadcast.
```
Kustom: `new TeleBibz(token, { onError: (err, ctx) => { ... } })`.

### Opsi konstruktor

| Opsi | Default | Fungsi |
|---|---|---|
| `allowedUpdates` | semua tipe umum + Business | batasi update yang diterima |
| `onError` | reporter cantik bawaan | handle error sendiri |
| `silent` | `false` | tanpa banner boot |
| `dropPending` | `false` | buang update lama saat start |
| `grammy` | `{}` | opsi mentah `new Bot()` grammY |

### Webhook / serverless

```js
// express:
app.use('/tg', bot.webhook('express'));
// atau serverless manual:
await bot.handleUpdate(req.body);
```

### Escape hatch penuh

Kapan pun butuh API mentah: `bot.api.sendMessage(...)`, `bot.bot` (instance grammY), `ctx.reply(...)`, `ctx.api.*` — grammar lengkap grammY tetap berlaku 100%.

---

## 🧩 Contoh siap jalan (`examples/`)

| File | Isi |
|---|---|
| `01-quickstart.js` | bot jalan dalam 6 baris |
| `02-menu-tombol.js` | keyboard berwarna + ikon |
| `03-wizard.js` | form pendaftaran |
| `04-broadcast.js` | blast admin |
| `05-kirim-file.js` | foto & dokumen dari buffer |

## 🔬 Test & bukti live

```
npm test   # 14 kasus, TANPA jaringan (transport disuntik)
```

Tervalidasi **24/24 offline + 10 live** pada bot produksi @xbibzrat_bot: getMe, keyboard berwarna & ikon animasi asli,
upload multipart (photo+document), edit keyboard, broadcast, deleteMessage, polling 409 retry.

## 📂 Isi repo (11 file inti)

| File | Peran |
|---|---|
| `lib/net.js` | transport HTTP fetch murni + multipart `attach://` |
| `lib/api.js` | metode Bot API + `api.callApi()` untuk segala metode |
| `lib/composer.js` | middleware, filter `on('message:photo')`, `errorBoundary` |
| `lib/context.js` | objek ctx + pintasan reply/edit/delete/callback |
| `lib/session.js` | sesi per user:chat (dapat ditukar storagenya) |
| `lib/runner.js` | long polling: retry 409, backoff jaringan, drop pending |
| `lib/file.js` | `File`/`InputFile` (Buffer/path/stream) |
| `lib/keyboard.js` | builder + `InlineKeyboard`/`Keyboard` fluent class |
| `lib/wizard.js` | percakapan tanya-jawab berurutan |
| `lib/broadcast.js` | blast aman rate limit |
| `lib/errors.js` + `lib/logger.js` | error manusiawi + log berbingkai |

## 🆚 Kenapa recode?

| | v0.4 lama | v1.0 |
|---|---|---|
| Baris file sumber | 152 file TS | 7 file JS |
| Build step | tsc ×2 + script | — |
| Dependency runtime | — | **0 (nol)** |
| Bot API | manual update | 9.x penuh (uji live asli) |
| Hello world | kelas + config | 6 baris |
| Docs | 3 bahasa × belasan file | README ini |

## 📄 Lisensi

MIT · //—Xbibz Official—//
