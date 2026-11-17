---
title: Widget HTML (Bot API 10.4)
description: "Mengirim HTML widget, menerima query dari widget, dan mengubah datanya dengan TeleBibz."
---

# Widget HTML (Bot API 10.4)

Bot API 10.4 (9 November 2026) menambahkan **HTML widget**: potongan HTML 1–32.768 byte yang dirender Telegram langsung di dalam bubble pesan, bisa mengirim query ke bot, dan bisa dibagikan ulang.

::: warning Batasan platform
Di lingkungan produksi, widget hanya bisa dikirim ke **private chat** dan otomatis berstatus *protected content* (tidak bisa diforward). Widget juga tidak bisa di-`copyMessage`/`copyMessages`. Batasan ini berasal dari Telegram, bukan dari TeleBibz.
:::

## 1. Mengirim widget

```js
bot.cmd('widget', (ctx) => ctx.replyWithWidget(`
  <div style="font:600 16px system-ui">Status layanan</div>
  <div style="opacity:.7">Semua sistem normal · ${new Date().toISOString()}</div>
`, {
  width: 320,                 // opsional; diklem aplikasi ke 200..lebar bubble
  height: 120,                // opsional; diklem 50..600
  caption: 'Diperbarui otomatis',
  allow_queries: true,        // penting: mengizinkan widget mengirim query ke bot
}));

// atau lewat API langsung
await bot.api.sendWidget({ chat_id: 123456789, html: '<b>Halo</b>', allow_queries: true });
```

Batas ukuran: HTML 1–32.768 byte, tetapi **maksimum 4.096 byte setelah dikompresi zlib level maksimum**. HTML besar yang tidak terkompresi baik akan ditolak.

## 2. Widget yang bisa dibagikan ulang

```js
// kirim pertama kali sebagai shared widget
const msg = await ctx.replyWithWidget('<b>Kartu nama</b>', { is_shared: true, allow_queries: true });

// widget.id hanya dikirim lewat query dari widget, simpan saat pertama kali diterima
bot.on('widget_query', (ctx) => { if (ctx.widget_query.widget_id) simpan(ctx.widget_query.widget_id); });

// kirim ulang ke chat lain tanpa mengirim ulang HTML
await bot.api.sendSharedWidget({ chat_id: 987654321, widget_id: 'wid-123', caption: 'Sama seperti sebelumnya' });
```

## 3. Menerima query dari widget

Query masuk sebagai update `widget_query` (widget di pesan biasa) atau `shared_widget_query` (widget dari pesan yang diforward). TeleBibz sudah meminta kedua tipe ini secara default di `allowed_updates`.

```js
bot.on('widget_query', async (ctx) => {
  console.log(ctx.widgetQueryId, ctx.widget_query.data, ctx.widget_query.type.type);
  await ctx.answerWidgetQuery('diterima');   // harus dijawab ≤ 15 detik
});

bot.on('shared_widget_query:data', (ctx) => ctx.answerWidgetQuery('ok'));
```

Bentuk `type` pada query (Bot API 10.4):

| `type.type` | Isi tambahan |
|---|---|
| `data` | `wallet_card?` — kartu TON wallet pengirim (bila dikirim bersama query) |
| `sign_data` | `wallet`, `sign_data` — data yang ditandatangani TON wallet |
| `sent_transaction` | `wallet`, `msg_hash` — notifikasi transaksi |

Batas frekuensi dari Telegram: maksimum **5 query per 5 detik** per pengguna untuk semua widget bot.

## 4. Mengubah data widget tanpa mengirim ulang

```js
// dari handler callback (pesan yang sama)
bot.action('refresh', async (ctx) => {
  await ctx.editWidgetData({ public_data: String(Date.now()) });
  await ctx.answerCallbackQuery('Diperbarui');
});

// dari mana saja, bila tahu chat_id + message_id
await bot.api.editMessageWidgetData({ chat_id: 123, message_id: 45, chat_data: '{"state":"baru"}' });

// shared widget (maksimal 1× per detik)
await bot.api.editSharedWidgetData({ widget_id: 'wid-123', public_data: 'v2', cache_time: 30 });
```

Perbedaan `public_data` vs `chat_data`:

| Field | Cakupan | Catatan |
|---|---|---|
| `public_data` | Semua pesan dengan widget yang sama (khusus shared widget) | Bisa diubah maksimal 1×/detik |
| `chat_data` | Hanya pesan itu | Cocok untuk state per-chat |

## 5. Widget di inline mode, guest query, dan Web App

Bot API 10.4 menambahkan `InputWidgetMessageContent` dan `InputSharedWidgetMessageContent` sebagai `InputMessageContent`. Gunakan objek itu di `input_message_content` hasil inline:

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery('jam', (ctx) => ctx.answerInlineQuery([
  iq.article('jam-1', 'Jam sekarang', {
    input_message_content: {
      html: `<b>${new Date().toLocaleTimeString('id-ID')}</b>`,
      width: 240,
      allow_queries: true,
    },
  }),
]));
```

Tipe TypeScript: `InputWidgetMessageContent` (widget baru) dan `InputSharedWidgetMessageContent` (widget yang sudah ada, cukup `widget_id`).

## 6. Tipe & helper yang tersedia

| Kebutuhan | API TypeScript |
|---|---|
| Isi pesan widget | `Widget` pada `Message.widget` dan `ExternalReplyInfo.widget` |
| Query | `WidgetQuery`, `SharedWidgetQuery`, `WidgetQueryType` (+ `WidgetQueryTypeData`, `WidgetQueryTypeSignData`, `WidgetQueryTypeSentTransaction`, `WidgetQueryWallet`) |
| Kirim | `ApiClient.sendWidget`, `sendSharedWidget`, `Context.replyWithWidget`, `replyWithSharedWidget` |
| Jawab | `Context.answerWidgetQuery(data?)`, `ApiClient.answerWidgetQuery` |
| Ubah data | `Context.editWidgetData(extra)`, `api.editMessageWidgetData`, `api.editSharedWidgetData` |

## 7. TON wallet & share theme (bonus 10.4)

Bot API 10.4 juga menambahkan objek TON di `Message` dan `ChatFullInfo`. Semuanya sudah bertipe, dan bisa dibaca langsung dari update:

```js
bot.on(':ton_wallet_transfer', (ctx) => {
  const t = ctx.msg.ton_wallet_transfer;     // { transaction_id, peer_address, amount, comment? }
  console.log('transfer TON', t.amount, 'dari', t.peer_address);
});

const chat = await bot.api.getChat(ctx.chatId);
if (chat.ton_wallet_card) console.log('wallet', chat.ton_wallet_card.address, chat.ton_wallet_card.amount);

const backdrops = await bot.api.getChatShareThemeBackdrops();  // tema layar share link
```

Tipe terkait: `TonWalletCard`, `TonWalletCardSticker`, `TonNft`, `TonNftAttribute`, `TonWalletTransfer`, `RichTextTonAddress`, `PaidMessagesWaived`, `ChatShareTheme*`, `EmojiType*`.

Lihat juga: [Mengirim pesan](/guide/sending-messages), [Rich Messages](/guide/rich-messages), [Daftar metode](/reference/methods).
