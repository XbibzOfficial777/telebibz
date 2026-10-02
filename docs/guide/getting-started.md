---
title: Mulai cepat
description: Pasang TeleBibz dan jalankan bot Telegram pertamamu.
---

# Mulai cepat

Dalam beberapa menit, kita akan membuat bot yang membalas `/start` dan teks sapaan. Kamu perlu Node.js **18 atau lebih baru**, npm, dan token bot dari [@BotFather](https://t.me/BotFather).

## 1. Buat bot dan ambil token

Buka Telegram, chat **@BotFather**, kirim `/newbot`, lalu ikuti instruksinya. Simpan token yang diberikan—siapa pun yang memilikinya dapat mengendalikan botmu.

## 2. Siapkan project dan pasang paket

::: code-group

```sh [npm]
npm init -y
npm install @xbibzlibrary/telebibz
```

```sh [pnpm]
pnpm init
pnpm add @xbibzlibrary/telebibz
```

```sh [yarn]
yarn init -y
yarn add @xbibzlibrary/telebibz
```

:::

## 3. Buat `index.js`

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('Environment variable BOT_TOKEN belum diatur.');

const bot = new TeleBibz(token);

bot.start((ctx) =>
  ctx.reply(`Halo ${ctx.from?.first_name ?? 'teman'}! Botku sudah aktif`),
);

bot.hears(/halo|hai/i, (ctx) => ctx.reply('Halo juga'));
bot.cmd('ping', (ctx) => ctx.reply('pong'));

bot.launch().catch(console.error);
```

`bot.start(...)` mendaftarkan handler `/start`. `bot.hears(...)` mencocokkan pesan teks, sedangkan `bot.cmd(...)` menangani command lain.

## 4. Jalankan bot

Isi token melalui environment variable di terminal yang sama:

::: code-group

```sh [macOS / Linux]
BOT_TOKEN="123456:token-dari-botfather" node index.js
```

```powershell [Windows PowerShell]
$env:BOT_TOKEN="123456:token-dari-botfather"
node index.js
```

:::

Buka chat dengan botmu di Telegram, tekan **Start**, lalu coba `/ping` atau kirim `halo`. `bot.launch()` memanggil `getMe()` dan mulai long polling.

::: warning Token adalah rahasia
Jangan commit token ke Git atau menaruhnya di frontend/browser. Jika token terlanjur bocor, buat ulang lewat @BotFather.
:::

## Apa selanjutnya?

- Pelajari [handler dan filter](/guide/handlers) untuk menangani pesan, foto, callback, dan middleware.
- Tambahkan [inline keyboard](/guide/context-keyboards), lalu buat alur [wizard](/guide/wizard).
- Lihat [contoh siap jalan](/examples) atau buka [referensi API](/reference/api).
