---
title: Context & keyboard
description: Referensi Context, shortcut balasan, inline keyboard, reply keyboard, dan callback.
---

# Context & keyboard

Setiap handler menerima satu `ctx` (Context), pembungkus update Telegram yang sedang diproses. Context menyederhanakan akses ke sender/chat/message, menyediakan shortcut umum, dan membawa `ctx.api` untuk method Bot API lainnya.

## Properti Context

| Properti | Nilai |
| --- | --- |
| `ctx.update` | Update mentah Telegram. |
| `ctx.api` | API client untuk memanggil method Bot API. |
| `ctx.me` | Informasi bot setelah `init()`/`launch()` berhasil. |
| `ctx.msg`, `ctx.chat`, `ctx.from` | Pesan, chat, dan pengguna terkait jika ada di update. |
| `ctx.chatId`, `ctx.msgId` | ID chat/pesan yang relevan bila tersedia. |
| `ctx.match` | Argumen command yang cocok dengan `bot.cmd()`. |
| `ctx.session` | Object session untuk state per key. |
| `ctx.guestQueryId` | ID guest query jika update yang masuk memuatnya. |

Tidak semua properti ada untuk semua update. `inline_query`, `callback_query`, channel post, Business, dan event administratif memiliki bentuk update yang berbeda. Periksa jenis update sebelum mengandalkan field opsional.

## Membalas, mengedit, dan menghapus

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`Hai ${ctx.from?.first_name ?? 'teman'}`);
});

bot.cmd('format', async (ctx) => {
  const sent = await ctx.replyWithHTML('<b>Tebal</b> dan <i>miring</i>');
  await ctx.api.editMessageText(ctx.chatId, sent.message_id, 'Pesan bot sekarang diedit.');
});
```

Shortcut Context yang umum:

| Kelompok | Method |
| --- | --- |
| Teks dan rich | `reply`, `replyWithHTML`, `replyWithMarkdown`, `replyWithRichMessage`, `editMessageText`, `editRichMessage` |
| Gambar/media | `replyWithPhoto`, `replyWithVideo`, `replyWithAudio`, `replyWithDocument`, `replyWithAnimation`, `replyWithVoice`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup` |
| Data chat | `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, `replyWithDice`, `replyWithInvoice`, `replyWithChatAction` |
| Edit/hapus | `editMessageText`, `editMessageCaption`, `editMessageMedia`, `editMessageReplyMarkup`, `deleteMessage`, `deleteMessages` |
| Callback/inline | `answerCallbackQuery`, `answerInlineQuery`, `answerGuestQuery` |
| File | `getFile()`, `downloadFile(destination)` |
| Sosial/moderasi | `react`, `forwardMessage(destination)`, `copyMessage(destination)`, `banChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `pinChatMessage`, `unpinChatMessage` |
| Ephemeral/draft | `replyEphemeral`, `sendMessageDraft`, `sendRichMessageDraft`, `editEphemeralRichMessage`, `deleteEphemeralMessage` |

Untuk mengedit, target bawaan context bergantung pada update yang sedang diproses. Jika ingin mengedit pesan bot yang baru dikirim, simpan hasil `ctx.reply(...)` dan gunakan `ctx.api.editMessageText(chatId, messageId, text, extra)`.

## Inline keyboard

Helper `btn`, `url`, dan `kb` membangun `inline_keyboard` sebagai array baris:

```js
const { btn, url, kb } = require('@xbibzlibrary/telebibz');

bot.cmd('menu', (ctx) => ctx.reply('Pilih tindakan:', kb([
  [btn('Paket premium', 'plan:premium', 'primary'), btn('Paket gratis', 'plan:free', 'success')],
  [url('Buka dokumentasi', 'https://github.com/XbibzOfficial777/telebibz')],
])));

bot.action('plan:premium', async (ctx) => {
  await ctx.answerCallbackQuery('Membuka paket premium');
  await ctx.reply('Pilih paket yang ingin kamu lihat.');
});
```

Signature helper:

- `btn(text, callbackData, style?, iconId?)` membuat tombol callback.
- `url(text, link, style?, iconId?)` membuat tombol URL.
- `webApp(text, link, iconId?)` membuka Telegram Web App pada konteks yang mendukung.
- `copy(text, value, iconId?)` meminta Telegram menyalin teks ke clipboard.
- `kb(rows)` mengembalikan `{ reply_markup: { inline_keyboard: rows } }`.
- `kb.markup(rows)` menghasilkan object `inline_keyboard` tanpa wrapper `reply_markup`.
- `kb.confirm(yesData, noData, labelYes?, labelNo?)` membangun baris konfirmasi.

`style` dapat bernilai `primary`, `success`, atau `danger`. Tampilan style dan custom icon bergantung pada versi aplikasi Telegram serta syarat akun bot; klien lama dapat menampilkan tombol tanpa warna. Custom icon memakai ID custom emoji Telegram yang dapat digunakan bot.

## Builder fluent

```js
const { InlineKeyboard } = require('@xbibzlibrary/telebibz');

const keyboard = new InlineKeyboard()
  .text('Ya, lanjutkan', 'confirm:yes', 'success')
  .text('Tidak sekarang', 'confirm:no', 'danger')
  .row()
  .url('Buka portal', 'https://example.com')
  .build();

bot.cmd('konfirmasi', (ctx) => ctx.reply('Lanjutkan?', keyboard));
```

Builder mendukung `.text()`, `.url()`, `.webApp()`, `.copy()`, `.row()`, dan `.build()`.

## Reply keyboard

Reply keyboard menggantikan area keyboard input pengguna; ia bukan inline keyboard yang ditempel ke pesan. Gunakan `Keyboard`:

```js
const { Keyboard } = require('@xbibzlibrary/telebibz');
const replyKeyboard = new Keyboard()
  .text('Bantuan')
  .text('Status')
  .row()
  .requestContact('Bagikan kontak')
  .resized()
  .oneTime()
  .build();

bot.cmd('pilihan', (ctx) => ctx.reply('Pilih salah satu:', replyKeyboard));
```

Method reply keyboard meliputi `.text()`, `.requestContact()`, `.requestLocation()`, `.row()`, `.resized(value)`, `.oneTime(value)`, dan `.build()`.

## Callback query

Tombol dengan `callback_data` menghasilkan `callback_query`. Jawab callback agar klien Telegram menghentikan indikator loading; teks callback opsional:

```js
bot.action(/^item:\d+$/, async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'Pilihan diterima' });
  await ctx.editMessageText('Konten pesan diperbarui.');
});
```

Untuk callback dari tombol inline, `ctx.answerCallbackQuery('teks')` adalah shortcut. Bentuk object dapat membawa field tambahan seperti `show_alert` atau `url` sesuai Bot API. Data callback sebaiknya pendek dan jangan dianggap sebagai bukti otorisasi; validasi hak pengguna di server.

## Business dan update khusus

Context menormalkan akses dasar untuk message, edited message, channel, callback, inline, guest, dan Business update. Pada balasan dalam konteks Business, library meneruskan `business_connection_id` bila tersedia. Untuk method modern yang belum memiliki shortcut Context, panggil method melalui `ctx.api` atau `bot.api`; lihat [daftar metode Bot API](/reference/methods).
