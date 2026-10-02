---
title: Menu interaktif
description: Susun inline menu, callback, tautan, dan submenu dengan MenuContainer.
---

# Menu interaktif

`Menu` dan `MenuContainer` membantu membuat inline keyboard interaktif dari beberapa menu yang terhubung. `MenuContainer` mendaftarkan seluruh callback menu sebagai middleware melalui `bot.use(container)`.

## Menu utama dan submenu

```js
const { TeleBibz, MenuContainer } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
const menus = new MenuContainer();
const main = menus.create('main');
const settings = menus.create('settings');

main
  .submenu('Pengaturan', 'settings')
  .row()
  .url('Dokumentasi', 'https://github.com/XbibzOfficial777/telebibz');

settings
  .text('Toggle notifikasi', (ctx) => ctx.answerCallbackQuery('Pengaturan diperbarui'))
  .back('Kembali ke menu utama', 'main');

bot.use(menus.middleware());
bot.cmd('menu', async (ctx) => {
  await ctx.reply('Pilih menu:', { reply_markup: await main.render(ctx) });
});

bot.launch().catch(console.error);
```

`submenu(label, targetId)` mengganti inline keyboard pesan saat ini dengan menu target dan menjawab callback. `back(label, parentId)` adalah alias untuk submenu menuju menu induk. ID menu harus cocok dengan target yang dibuat di container.

## Method menu

| Method | Fungsi |
| --- | --- |
| `.text(label, handler)` | Tombol callback yang menjalankan handler saat ditekan. Handler dapat menjawab callback, mengedit pesan, atau mengirim pesan baru. |
| `.url(label, link, options?)` | Tombol tautan eksternal. |
| `.webApp(label, link)` | Tombol untuk membuka Telegram Web App. |
| `.submenu(label, targetId)` | Navigasi ke menu lain di `MenuContainer`. |
| `.back(label, parentId)` | Shortcut navigasi kembali. |
| `.row()` | Mulai baris tombol berikutnya. |
| `.render(ctx)` | Render object `inline_keyboard` untuk `reply_markup`. |
| `menus.create(id)` / `menus.get(id)` | Buat atau ambil menu berdasarkan ID. |

Tambahkan menu ke bot dengan `bot.use(menus)` satu kali. Bila memakai `Menu` tunggal, daftarkan instance tersebut memakai `bot.use(menu)`; submenu antar-menu paling mudah dikelola melalui `MenuContainer`.

## Callback dan tombol usang

Menu menaruh ID menu dan indeks tombol pada `callback_data`. Callback yang tidak lagi cocok dengan definisi menu dijawab sebagai tombol usang tanpa menjalankan handler. Jaga ID menu tetap pendek dan unik, serta jangan gunakan callback sebagai satu-satunya kontrol otorisasi: validasi hak pengguna di handler.

Untuk keyboard statis tanpa navigasi menu, gunakan helper `btn`, `url`, `kb` atau `InlineKeyboard` pada [Context & keyboard](/guide/context-keyboards).