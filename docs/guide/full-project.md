---
title: Studi kasus — bot lengkap dari nol
description: "Implementasi bertahap: struktur folder, konfigurasi, handler, menu, wizard, session, storage, deploy."
---

# Studi kasus: bot lengkap dari nol

Halaman ini merangkai semua potongan menjadi satu proyek nyata: **bot toko online** dengan katalog, keranjang, form pemesanan (wizard), menu, session persisten, dan deploy. Salin berurutan, jalankan, lalu sesuaikan.

## 1. Siapkan proyek

```bash
mkdir toko-bot && cd toko-bot
npm init -y
npm i @xbibzlibrary/telebibz
npm pkg set type=commonjs engines.node=">=20"
mkdir src
```

`.env` (jangan commit):

```bash
BOT_TOKEN=123456:ABC-DEF...
ADMIN_ID=123456789
WEBHOOK_URL=https://contoh.com/telegram/webhook
WEBHOOK_SECRET=rahasia_acak_32_karakter
```

Baca `.env` tanpa dependency tambahan (Node ≥ 20):

```js
// src/env.js
require('node:process').loadEnvFile?.('.env');   // Node 20.12+/21+
module.exports = {
  token: process.env.BOT_TOKEN,
  adminId: Number(process.env.ADMIN_ID),
  webhookUrl: process.env.WEBHOOK_URL,
  webhookSecret: process.env.WEBHOOK_SECRET,
};
```

## 2. Struktur folder yang skalabel

```
toko-bot/
├── src/
│   ├── env.js            # konfigurasi & validasi env
│   ├── bot.js            # instance bot + komposisi middleware
│   ├── storage.js        # session storage (memory/Redis)
│   ├── data/produk.js    # "database" sederhana
│   ├── handlers/
│   │   ├── index.js      # registrasi semua handler
│   │   ├── start.js      # /start, bantuan
│   │   ├── katalog.js    # daftar produk + detail
│   │   └── pesanan.js    # wizard pemesanan
│   ├── menus.js          # menu inline
│   └── server.js         # HTTP server (webhook) / entry long polling
└── package.json
```

Aturan praktis: satu berkas = satu tanggung jawab, dan setiap handler diekspor sebagai fungsi `(bot) => void` supaya mudah dites dan dimatikan.

## 3. Data & storage

```js
// src/data/produk.js
const produk = [
  { id: 'kopi', nama: 'Kopi Arabika 250g', harga: 65000 },
  { id: 'teh',  nama: 'Teh Melati 100g',   harga: 35000 },
  { id: 'gula', nama: 'Gula Aren 500g',    harga: 45000 },
];
module.exports = {
  semua: () => produk,
  cari: (id) => produk.find((p) => p.id === id),
  rupiah: (n) => 'Rp' + n.toLocaleString('id-ID'),
};
```

Session default disimpan di `Map` (hilang saat restart). Untuk produksi pakai penyimpanan eksternal:

```js
// src/storage.js — contoh Redis tanpa library: sesuaikan dengan klienmu
function redisStorage(redis) {
  return {
    read: (key) => redis.get(`sess:${key}`).then((v) => (v ? JSON.parse(v) : undefined)),
    write: (key, value) => redis.set(`sess:${key}`, JSON.stringify(value), { EX: 60 * 60 * 24 }),
    delete: (key) => redis.del(`sess:${key}`),
  };
}
// atau simpel: pakai Map bawaan, cukup untuk bot kecil (<10k user)
module.exports = { redisStorage };
```

## 4. Instance bot + middleware global

```js
// src/bot.js
const { TeleBibz, session, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');
const env = require('./env');
const { redisStorage } = require('./storage');

const bot = new TeleBibz(env.token, {
  session: {
    initial: () => ({ keranjang: [], langkah: null }),
    onlyWhenChanged: true,          // hemat I/O: hanya tulis kalau session berubah
    // storage: redisStorage(redisClient),
  },
  onError: (err, ctx) => console.error('[bot error]', err.message, ctx && ctx.update_id),
});

// keandalan: hormati 429 dan jaga laju global
bot.api.config.use(autoRetry({ maxRetry: 3 }));
bot.api.config.use(throttler({ perSecond: 25 }));

// anti-spam ringan: maks 5 update / 3 detik per user
bot.use(limiter({ windowMs: 3000, limit: 5 }));

// log ringan setiap update (hapus di produksi ramai)
bot.use((ctx, next) => {
  console.log('update', ctx.update_id, Object.keys(ctx.update).filter((k) => k !== 'update_id').join(','));
  return next();
});

module.exports = { bot };
```

## 5. Handler: /start & bantuan

```js
// src/handlers/start.js
const { Keyboard } = require('@xbibzlibrary/telebibz');

module.exports = (bot) => {
  bot.start((ctx) => ctx.reply(
    `Halo ${ctx.from.first_name}! Saya bot toko.\n\n` +
    'Perintah:\n/katalog — lihat produk\n/keranjang — isi keranjang\n/pesan — buat pesanan\n/bantuan — bantuan',
    new Keyboard().text('🛍 Katalog').text('🧺 Keranjang').row().text('❓ Bantuan').resized().build(),
  ));

  bot.cmd('bantuan', (ctx) => ctx.replyWithHTML(
    '<b>Bantuan</b>\n' +
    '• /katalog — daftar produk\n• /keranjang — lihat & hapus item\n• /pesan — form pemesanan\n' +
    '• /batal — batalkan proses apa pun',
  ));

  // reply keyboard juga berupa teks biasa — tangkap isinya
  bot.hears('🛍 Katalog', (ctx) => ctx.replyWithHTML('/katalog'));
  bot.hears('❓ Bantuan', (ctx) => ctx.replyWithHTML('/bantuan'));
};
```

## 6. Handler: katalog dengan tombol inline

```js
// src/handlers/katalog.js
const { btn, kb } = require('@xbibzlibrary/telebibz');
const db = require('../data/produk');

module.exports = (bot) => {
  bot.cmd('katalog', (ctx) => {
    const baris = db.semua().map((p) => [btn(`${p.nama} — ${db.rupiah(p.harga)}`, `lihat:${p.id}`)]);
    return ctx.reply('Pilih produk untuk melihat detail:', { reply_markup: kb.markup(baris) });
  });

  bot.action(/^lihat:(.+)$/, async (ctx) => {
    const p = db.cari(ctx.callback_query.data.split(':')[1]);
    if (!p) return ctx.answerCallbackQuery('Produk tidak ditemukan');
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      `${p.nama}\nHarga: ${db.rupiah(p.harga)}`,
      { reply_markup: kb.markup([[btn('➕ Tambah ke keranjang', `tambah:${p.id}`, 'success')], [btn('⬅️ Kembali', 'katalog')]]) },
    );
  });

  bot.action('katalog', (ctx) => {
    const baris = db.semua().map((p) => [btn(`${p.nama}`, `lihat:${p.id}`)]);
    return ctx.editMessageText('Pilih produk:', { reply_markup: kb.markup(baris) });
  });

  bot.action(/^tambah:(.+)$/, async (ctx) => {
    const p = db.cari(ctx.callback_query.data.split(':')[1]);
    ctx.session.keranjang.push({ id: p.id, nama: p.nama, harga: p.harga, jumlah: 1 });
    await ctx.answerCallbackQuery(`${p.nama} ditambahkan`);
    await ctx.editMessageText(`${p.nama}\n\nKeranjang: ${ctx.session.keranjang.length} item`);
  });
};
```

## 7. Handler: keranjang

```js
// src/handlers/pesanan.js (bagian keranjang)
const { btn, kb } = require('@xbibzlibrary/telebibz');
const db = require('../data/produk');

function ringkas(keranjang) {
  if (!keranjang.length) return 'Keranjang masih kosong.';
  const total = keranjang.reduce((s, i) => s + i.harga * i.jumlah, 0);
  const baris = keranjang.map((i, n) => `${n + 1}. ${i.nama} ×${i.jumlah} — ${db.rupiah(i.harga * i.jumlah)}`);
  return `${baris.join('\n')}\n\nTotal: ${db.rupiah(total)}`;
}

module.exports.kirimKeranjang = (ctx) => {
  const k = ctx.session.keranjang;
  const tombol = k.map((i, n) => [btn(`❌ Hapus ${i.nama}`, `hapus:${n}`, 'danger')]);
  tombol.push([btn('✅ Checkout', 'checkout', 'success')]);
  return ctx.reply('🧺 Keranjang:\n\n' + ringkas(k), { reply_markup: kb.markup(tombol) });
};

module.exports.hapusItem = (bot) => {
  bot.action(/^hapus:(\d+)$/, async (ctx) => {
    const i = Number(ctx.callback_query.data.split(':')[1]);
    const dibuang = ctx.session.keranjang.splice(i, 1)[0];
    await ctx.answerCallbackQuery(dibuang ? `${dibuang.nama} dihapus` : 'Item tidak ada');
    await ctx.editMessageText('🧺 Keranjang:\n\n' + ringkas(ctx.session.keranjang),
      { reply_markup: kb.markup([[btn('✅ Checkout', 'checkout', 'success')]]) });
  });
};
```

## 8. Form pemesanan dengan wizard

```js
// src/handlers/pesanan.js (bagian wizard)
const { wizard } = require('@xbibzlibrary/telebibz');
const env = require('../env');
const db = require('../data/produk');

module.exports.wizardPesanan = (bot) => {
  bot.wizard('pesan', {
    steps: [
      {
        key: 'nama',
        ask: 'Nama penerima?',
        validate: (v) => (String(v).trim().length >= 2 ? null : 'Nama minimal 2 karakter.'),
      },
      {
        key: 'alamat',
        ask: 'Alamat lengkap pengiriman?',
        validate: (v) => (String(v).trim().length >= 10 ? null : 'Alamat terlalu pendek.'),
      },
      {
        key: 'telepon',
        ask: 'Nomor telepon?',
        validate: (v) => (/^(\+62|0)\d{8,13}$/.test(String(v).replace(/[\s-]/g, '')) ? null : 'Format nomor tidak valid.'),
      },
      {
        key: 'metode',
        ask: 'Metode pembayaran?',
        buttons: ['Transfer bank', 'COD', 'QRIS'],   // tombol reply cepat
        onlyButtons: true,
      },
      { key: 'catatan', ask: 'Catatan tambahan? (kirim "-" bila tidak ada)' },
    ],
    async done(answers, ctx) {
      const items = ctx.session.keranjang;
      if (!items.length) return ctx.reply('Keranjang kosong — kirim /katalog dulu.');

      const total = items.reduce((s, i) => s + i.harga * i.jumlah, 0);
      const pesananId = 'INV-' + Date.now().toString(36).toUpperCase();

      await ctx.replyWithHTML(
        `<b>Pesanan ${pesananId} diterima</b>\n` +
        `Nama: ${answers.nama}\nAlamat: ${answers.alamat}\nTelp: ${answers.telepon}\n` +
        `Bayar: ${answers.metode}\nCatatan: ${answers.catatan}\n\n` +
        `Total: <b>${db.rupiah(total)}</b>`,
      );

      // kabari admin (abaikan bila gagal — jangan ganggu pembeli)
      if (env.adminId) {
        await bot.api.sendMessage(env.adminId,
          `🛒 ${pesananId}\n${items.map((i) => `- ${i.nama} ×${i.jumlah}`).join('\n')}\nTotal ${db.rupiah(total)}`,
        ).catch(() => {});
      }

      ctx.session.keranjang = [];
    },
    onCancel: (ctx) => ctx.reply('Pemesanan dibatalkan.'),
    cancelWords: ['/batal', 'batal'],
  });
};
```

Wizard otomatis menangani `/batal`, validasi, dan pengiriman ulang pertanyaan bila input salah. Rincian mode (kirim/edit/hapus pesan pertanyaan) ada di [Wizard](/guide/wizard).

## 9. Menu inline

```js
// src/menus.js
const { Menu, MenuContainer } = require('@xbibzlibrary/telebibz');

module.exports = function menuUtama() {
  const mc = new MenuContainer();
  const utama = mc.create('utama');
  const info = mc.create('info');

  utama
    .text('🛍 Katalog', (ctx) => { ctx.answerCallbackQuery(); return ctx.reply('/katalog'); })
    .row()
    .text('📄 Syarat', async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply('Syarat & ketentuan…'); })
    .submenu('ℹ️ Info ▶', 'info');

  info
    .text('🕒 Jam buka', (ctx) => ctx.answerCallbackQuery('Senin–Sabtu 08.00–20.00'))
    .row()
    .back('⬅️ Kembali', 'utama');

  return mc;
};
```

Daftarkan di `bot.use(menuUtama())`, lalu tampilkan dengan `ctx.reply('Menu:', { reply_markup: await menuUtama().get('utama').render(ctx) })`.

## 10. Merakit semuanya

```js
// src/handlers/index.js
module.exports = (bot) => {
  require('./start')(bot);
  require('./katalog')(bot);
  const pesanan = require('./pesanan');
  pesanan.hapusItem(bot);
  pesanan.wizardPesanan(bot);
  bot.cmd('keranjang', pesanan.kirimKeranjang);
  bot.action('checkout', (ctx) => { ctx.answerCallbackQuery(); return bot.wizardStart(ctx, 'pesan'); });
};
```

```js
// src/bot.js (lanjutan) — daftarkan setelah middleware global
const { bot } = require('./bot');   // sesuaikan: hindari siklus impor dengan memisah factory
require('./handlers')(bot);
bot.use(require('./menus')());
```

## 11. Jalankan: long polling vs webhook

**Long polling** — paling mudah, cocok untuk VPS/PM2:

```js
// src/server.js (mode polling)
const { bot } = require('./bot');
bot.launch();

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, async () => {
    bot.stop();
    await bot.runPromise;
    process.exit(0);
  });
}
```

**Webhook** — cocok untuk serverless/container dengan domain HTTPS:

```js
// src/server.js (mode webhook, tanpa framework)
const http = require('node:http');
const { bot } = require('./bot');
const env = require('./env');

(async () => {
  await bot.init();
  await bot.api.setWebhook(env.webhookUrl, {
    secret_token: env.webhookSecret,
    allowed_updates: undefined,     // undefined = pakai daftar default TeleBibz (semua tipe 10.4)
    max_connections: 40,
    drop_pending_updates: false,
  });

  const handler = bot.webhook({
    secretToken: env.webhookSecret,
    awaitProcessing: false,   // balas 200 dulu, proses di latar belakang
    dedupe: true,             // tolak update_id duplikat saat Telegram retry
  });

  http.createServer((req, res) => {
    if (req.url === '/telegram/webhook') return handler(req, res);
    res.writeHead(404).end();
  }).listen(process.env.PORT || 8080, '0.0.0.0', () => console.log('webhook siap'));
})();
```

::: tip Pilih salah satu
Jangan pernah menjalankan `getUpdates` (polling) dan webhook bersamaan — Telegram akan mengembalikan `409 Conflict`. TeleBibz otomatis menunggu dan mencoba ulang, tetapi perilakunya tidak diinginkan di produksi.
:::

Untuk serverless (Vercel/Lambda/Cloudflare), set `awaitProcessing: true` agar proses tidak dimatikan sebelum handler selesai.

## 12. Uji tanpa token

Transport bisa disuntik, jadi test berjalan offline:

```js
const assert = require('node:assert');
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const calls = [];
const bot = new TeleBibz('123456:TESTTOKEN', {
  silent: true,
  transport: async (method, payload) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 1, is_bot: true, username: 'testbot' };
    return true;
  },
});

bot.cmd('halo', (ctx) => ctx.reply('hai'));
await bot.handleUpdate({ update_id: 1, message: { message_id: 1, date: 1, from: { id: 2 }, chat: { id: 2, type: 'private' }, text: '/halo' } });
assert.equal(calls.at(-1).payload.text, 'hai');
```

Pola lengkap ada di [Transport & testing](/guide/transports-testing).

## 13. Checklist sebelum produksi

- [ ] `BOT_TOKEN` hanya dari env, tidak pernah masuk log/repo
- [ ] `onError` mengirim ke logger (bukan `console.log` polos)
- [ ] Session pakai storage eksternal bila >1 instance
- [ ] `autoRetry()` + `throttler()` aktif
- [ ] Webhook: `secret_token` diisi, URL HTTPS, `awaitProcessing` sesuai platform
- [ ] Graceful shutdown: `bot.stop()` + `await bot.runPromise` (polling) atau `await bot.drainWebhook()` (webhook)
- [ ] `node --version` ≥ 20
- [ ] Uji beban ringan: 50 pesan/detik ke grup uji, cek 429 dan retry

Lihat juga: [Polling & webhook](/guide/deployment), [Pola produksi](/guide/production-patterns), [Mengirim pesan](/guide/sending-messages), [Rate limit & error](/guide/reliability).
