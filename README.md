# 🤖 telebibz

**Library Telegram paling gampang untuk Node.js** — semua kekuatan [grammY](https://grammy.dev) (framework Telegram modern, Bot API 9.x), dengan API sekecil mungkin, log cantik, dan dokumentasi Bahasa Indonesia.

```
npm install @xbibzlibrary/telebibz
```

> v1.0 adalah **recode total** dari framework TS lama (152 file, build step, API client sendiri)
> menjadi **wrapper ramping**: 1 dependency, tanpa kompilasi, CommonJS murni.

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

## 🔬 Test

```
npm test   # 12 kasus: keyboard, token guard, cmd/hears, action, wizard ×3,
           # broadcast, humanize error, session, onError kustom
```

## 🆚 Kenapa recode?

| | v0.4 lama | v1.0 |
|---|---|---|
| Baris file sumber | 152 file TS | 7 file JS |
| Build step | tsc ×2 + script | — |
| Dependency API client | tulis tangan | **grammY** (terawat komunitas) |
| Bot API | manual update | ikut grammY (9.x) |
| Hello world | kelas + config | 6 baris |
| Docs | 3 bahasa × belasan file | README ini |

## 📄 Lisensi

MIT · //—Xbibz Official—//
