---
title: Mengirim pesan
description: "Semua cara mengirim teks, format, media, album, tombol, edit, dan hapus pesan dengan TeleBibz."
---

# Mengirim pesan

Halaman ini adalah resep lengkap untuk mengirim pesan: teks biasa, format HTML/Markdown, media tunggal, album, tombol inline & reply, pesan yang bisa diedit/dihapus, sampai menjawab callback dan query dari widget.

Kalau baru pertama kali, mulai dari [Mulai cepat](/guide/getting-started). Untuk struktur pesan berblok (heading, tabel, kolapsibel), gunakan [Rich Messages](/guide/rich-messages).

## 1. Teks dasar

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Halo! Saya siap membantu.'));
bot.cmd('ping', (ctx) => ctx.reply('pong 🏓'));
bot.launch();
```

`ctx.reply(text, extra)` otomatis memakai `chat_id` dari update yang sedang diproses, jadi tidak perlu menulis chat id. Argumen `extra` diteruskan apa adanya ke `sendMessage`, artinya **seluruh field Bot API bisa dipakai**:

```js
bot.cmd('promo', (ctx) => ctx.reply('Diskon 50% hari ini!', {
  disable_notification: true,        // kirim senyap
  protect_content: true,             // tidak bisa diforward/disimpan
  link_preview_options: { is_disabled: true },
  reply_parameters: { message_id: ctx.msgId },   // reply ke pesan user
}));
```

### Kirim tanpa `ctx`

Di job terjadwal, cron, atau handler webhook non-Telegram, pakai `bot.api`:

```js
await bot.api.sendMessage(123456789, 'Laporan harian siap', { parse_mode: 'HTML' });
```

Tiga gaya pemanggilan yang setara:

```js
await bot.api.sendMessage(chatId, 'halo');                        // shortcut positional
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'halo' }); // bertipe penuh
await bot.api.raw('sendMessage', { chat_id: chatId, text: 'halo' });     // alias callApi
```

## 2. Format teks (HTML & Markdown)

```js
ctx.replyWithHTML('<b>Nama:</b> <code>Budi</code>');
ctx.replyWithMarkdown('*Nama:* `Budi`');   // MarkdownV2, karakter khusus harus di-escape
```

Selalu escape input pengguna, karena tag yang salah membuat Telegram menolak pesan dengan error `can't parse entities`:

```js
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

bot.on(':text', (ctx) => ctx.replyWithHTML(`Kamu menulis: <i>${esc(ctx.msg.text)}</i>`));
```

Atau kirim sebagai teks biasa dan gunakan `entities` manual — cara paling aman adalah membiarkan TeleBibz mengirim teks apa adanya (`ctx.reply`) lalu tidak mengaktifkan `parse_mode`.

## 3. Media

```js
const { File } = require('@xbibzlibrary/telebibz');

bot.cmd('foto', (ctx) => ctx.replyWithPhoto('https://example.com/foto.jpg', { caption: 'Dari URL' }));
bot.cmd('doc',  (ctx) => ctx.replyWithDocument(new File('./laporan.pdf'), { caption: 'Laporan Q4' }));
bot.cmd('buf',  (ctx) => ctx.replyWithPhoto(Buffer.from(pngBytes), { caption: 'Dari buffer' }));
bot.cmd('voice',(ctx) => ctx.replyWithVoice(new File('./halo.ogg')));
bot.cmd('vid',  (ctx) => ctx.replyWithVideo('file_id_yang_sudah_ada', { supports_streaming: true }));
```

`ctx.replyWith*` yang tersedia: `Photo`, `Video`, `Audio`, `Document`, `Animation`, `Voice`, `VideoNote`, `Sticker`, `MediaGroup`, `Location`, `Venue`, `Contact`, `Poll`, `Dice`, `Invoice`, `ChatAction`, serta `LivePhoto` dan `RichMessage`.

Tiga jenis sumber media yang diterima:

| Sumber | Contoh | Catatan |
|---|---|---|
| `file_id` | `'AgACAgUAAxkB...'` | Paling cepat & hemat, tidak upload ulang |
| URL publik | `'https://…'` | Telegram mengunduh sendiri, maks 20 MB |
| Upload | `new File(pathOrBufferOrStream)` | Batas upload bot 50 MB (2 GB dengan Local Bot API Server) |

### Album (media group)

```js
const { InputMediaBuilder: M } = require('@xbibzlibrary/telebibz');

ctx.replyWithMediaGroup([
  M.photo('file_id_1', { caption: 'Foto pertama' }),
  M.photo(new File('./2.jpg')),
  M.video(new File('./klip.mp4'), { supports_streaming: true }),
]);
```

### Unduh file dari pengguna

```js
bot.on('message:document', async (ctx) => {
  const path = await ctx.downloadFile('./unduhan.pdf', { maxBytes: 20 * 1024 * 1024 });
  console.log('tersimpan di', path);
});
```

`ctx.downloadFile()` dan `bot.api.downloadFile()` menghormati `apiRoot` (Local Bot API Server), proxy, timeout, serta batas `maxBytes`. Mau menulis ke stream sendiri? Kirim Writable stream sebagai tujuan.

## 4. Tombol & keyboard

```js
const { btn, url, webApp, InlineKeyboard, Keyboard, kb } = require('@xbibzlibrary/telebibz');

// inline keyboard sederhana
ctx.reply('Pilih:', { reply_markup: kb.markup([[btn('Ya', 'ya'), btn('Tidak', 'tidak')]]) });

// dengan warna (Bot API 9.4) dan ikon custom emoji
ctx.reply('Konfirmasi', { reply_markup: kb.markup([[
  btn('Setuju', 'ok', 'success'),
  btn('Batal', 'no', 'danger'),
]]) });

// builder bertahap
const ikb = new InlineKeyboard()
  .text('Profil', 'profil')
  .text('Bantuan', 'bantuan')
  .row()
  .url('Website', 'https://example.com')
  .disabled('Segera hadir')
  .build();

// reply keyboard (bawah kolom input)
ctx.reply('Pilih menu:', new Keyboard().text('📦 Produk').text('💳 Bayar').row().text('☎️ Kontak').build());
```

Menangani tekan tombol:

```js
bot.action('ok', (ctx) => ctx.answerCallbackQuery('Terima kasih!'));
bot.action(/^item:(\d+)$/, async (ctx) => {
  const id = ctx.callback_query.data.split(':')[1];
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(`Kamu memilih item ${id}`);
});
```

::: tip Selalu jawab callback query
`answerCallbackQuery()` mencegah ikon loading berputar. Tanpa itu, pengguna melihat spinner sampai timeout (±1 menit).
:::

## 5. Edit, hapus, dan reaksi

```js
bot.cmd('edit', async (ctx) => {
  const sent = await ctx.reply('Versi 1');
  await bot.api.editMessageText(ctx.chatId, sent.message_id, 'Versi 2');
  await bot.api.setMessageReaction(ctx.chatId, sent.message_id, [{ type: 'emoji', emoji: '🔥' }]);
});

bot.action('hapus', async (ctx) => {
  await ctx.deleteMessage();            // hapus pesan tombol yang ditekan
  await ctx.answerCallbackQuery('Dihapus');
});
```

Di dalam handler callback, `ctx.editMessageText(...)`, `ctx.editMessageCaption(...)`, `ctx.editMessageMedia(...)`, `ctx.editMessageReplyMarkup(...)`, dan `ctx.react()` otomatis menunjuk ke pesan tombol tersebut.

`message is not modified` adalah error normal saat isi pesan sama — abaikan atau tangkap:

```js
try { await ctx.editMessageText('isi yang sama'); } catch (e) { if (!/not modified/.test(e.description)) throw e; }
```

## 6. Pesan sementara & ephemeral (grup)

Bot API 10.x punya pesan *ephemeral*: hanya terlihat oleh satu pengguna di dalam grup dan boleh diedit/dihapus.

```js
bot.action('hint', (ctx) => ctx.replyEphemeralToCallback('Ini hanya terlihat oleh kamu ✨'));
bot.cmd('rahasia', (ctx) => ctx.replyEphemeral('Instruksi privat', ctx.from.id));
```

Untuk edit/hapus ephemeral, simpan `ephemeral_message_id` dari `Message`:

```js
await ctx.editEphemeralMessageText(ctx.from.id, ephemeralMessageId, 'Teks baru');
await ctx.deleteEphemeralMessage(ctx.from.id, ephemeralMessageId);
```

Butuh bot admin di grup dan hak yang sesuai; bila ditolak, Telegram mengembalikan `BOT_NOT_ADMIN`.

## 7. Streaming draft (efek "mengetik lalu tumbuh")

Draft hanya pratinjau sementara (30 detik). Kirim draft berulang saat teks bertambah, lalu finalkan dengan pesan sungguhan:

```js
bot.cmd('ai', async (ctx) => {
  const draftId = Date.now() % 2147483647;      // id unik per stream
  let teks = '';
  for (const potongan of ['Halo', ',', ' ini', ' jawaban', ' bertahap.']) {
    teks += potongan;
    await ctx.sendMessageDraft(draftId, teks);
  }
  await ctx.reply(teks);                         // final, permanen
});
```

Untuk versi berformat, gunakan `sendRichMessageDraft(draftId, richMessage, extra)` lalu `ctx.replyWithRichMessage(...)`.

## 8. Batas & jebakan umum

| Hal | Batas / perilaku |
|---|---|
| Panjang teks | 4.096 karakter UTF-8 (rich message 32.768) |
| Caption media | 1.024 karakter |
| Upload bot cloud | 50 MB per file; unduh 20 MB |
| Album | 2–10 item |
| `callback_data` | ≤ 64 byte |
| Rate limit | ±30 pesan/detik per bot, ±20 pesan/menit per grup; tangani `retry_after` |
| Bot tidak bisa PM duluan | user harus `/start` atau menekan tombol |
| Grup → supergroup | `migrate_to_chat_id` berubah; simpan chat id baru |

Penanganan rate limit otomatis:

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');
bot.api.config.use(autoRetry({ maxRetry: 3 }));   // hormati retry_after 429
bot.api.config.use(throttler({ perSecond: 28 })); // antre global
```

Lihat juga: [Rate limit & error](/guide/reliability), [Keyboard & Context](/guide/context-keyboards), [File & session](/guide/files-sessions), [Rich Messages](/guide/rich-messages), [Widget (Bot API 10.4)](/guide/widgets).
