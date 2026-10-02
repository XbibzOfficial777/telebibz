---
title: Rich Messages
description: Susun rich text, block, tabel, tombol, media, dan draft Telegram.
---

# Rich Messages

Rich Message adalah format Telegram untuk menyusun satu pesan dari rich-text entities dan blok terstruktur. TeleBibz menyediakan helper `rich`, builder bertahap, shortcut pada `Context`, serta akses API mentah bertipe. Fitur dan batas endpoint bergantung pada Telegram Bot API dan kelayakan bot; rujuk [dokumentasi resmi Telegram](https://core.telegram.org/bots/api) untuk ketentuan final.

::: warning Satu mode konten per pesan
Sebuah Rich Message memilih tepat satu sumber utama: `html`, `markdown`, atau `blocks`. Opsi tambahan seperti media, arah teks, dan entity detection tidak menggantikan mode konten. Jangan kirim beberapa mode sekaligus.
:::

## Bangun pesan dari blocks

Setiap helper block menghasilkan object bertipe `InputRichBlock`. Blocks dapat disusun bertingkat, misalnya paragraf di dalam details, lalu dirangkai ke `rich.blocks(...)`.

```js
const { TeleBibz, rich } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.cmd('laporan', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Laporan mingguan', 2),
  rich.paragraph(['Status: ', rich.bold('selesai')]),
  rich.table([
    [
      { text: 'Metrik', is_header: true, align: 'left', valign: 'middle' },
      { text: 'Nilai', is_header: true, align: 'right', valign: 'middle' },
    ],
    [
      { text: 'Pesanan', align: 'left', valign: 'middle' },
      { text: '42', align: 'right', valign: 'middle' },
    ],
  ], { bordered: true, striped: true, compact: true, caption: 'Minggu ini' }),
  rich.details('Rincian', [rich.paragraph('Laporan diproses otomatis.')]),
  rich.buttons([
    rich.button('Buka dashboard', { url: 'https://example.com' }, 'primary'),
    rich.button('Konfirmasi', { callback_data: 'report:ack' }, 'success'),
  ], 'center'),
])));

bot.launch();
```

## Mode HTML, Markdown, dan blocks

```js
const message = rich.html('<b>Pengumuman</b><br>Versi baru sudah tersedia.');
await ctx.replyWithRichMessage(message);
```

Gunakan `rich.markdown(markdown, options)` untuk mode Markdown atau `rich.blocks(blocks, options)` untuk blocks. `inputRichMessage(content, options)` memvalidasi bahwa payload memilih satu mode.

```js
const { inputRichMessage } = require('@xbibzlibrary/telebibz');

const payload = inputRichMessage({
  blocks: [rich.heading('Status layanan', 2)],
  is_rtl: false,
});
await ctx.replyWithRichMessage(payload);
```

`RichMessageBuilder` membantu menyusun payload bertahap. Pemanggilan `.html()`, `.markdown()`, atau `.blocks()` kedua pada builder yang sama ditolak; buat builder baru untuk mode konten lain.

```js
const { RichMessageBuilder } = require('@xbibzlibrary/telebibz');

const message = new RichMessageBuilder()
  .blocks([rich.heading('Status', 2)])
  .add(rich.paragraph('Semua layanan berjalan normal.'))
  .rtl(false)
  .skipEntityDetection()
  .build();

await ctx.replyWithRichMessage(message);
```

Builder juga menyediakan `.media(items)`, `.buildDraft()`, `.rtl(value)`, dan `.skipEntityDetection(value)`. `media` dipakai bersama HTML/Markdown yang merujuk ID media melalui URL `tg://...`; untuk blocks, media disisipkan langsung di dalam block.

## Rich-text entities

Teks rich dapat berupa string, array string dan entity, atau entity bertingkat. Helper teks mengembalikan object entity yang bisa dirangkai ke `rich.paragraph(...)` atau helper block lain.

| Helper | Fungsi |
| --- | --- |
| `rich.bold(text)` | Tebal. |
| `rich.italic(text)` | Miring. |
| `rich.underline(text)` | Garis bawah. |
| `rich.strikethrough(text)` | Coret. |
| `rich.spoiler(text)` | Teks spoiler. |
| `rich.marked(text)` | Teks yang ditandai. |
| `rich.code(text)` | Potongan kode inline. |
| `rich.subscript(text)`, `rich.superscript(text)` | Indeks bawah dan atas. |
| `rich.url(text, url)` | Tautan dengan teks tampilan. |
| `rich.email(text, email)`, `rich.phone(text, phone)`, `rich.bankCard(text, number)` | Entity email, nomor telepon, dan nomor kartu bank. |
| `rich.mention(text, username)` | Mention berdasarkan username. |
| `rich.textMention(text, user)` | Mention berdasarkan object User Telegram. |
| `rich.hashtag(text, value)`, `rich.cashtag(text, value)`, `rich.botCommand(text, value)` | Hashtag, cashtag, dan command. |
| `rich.dateTime(text, unixTime, format)` | Entity tanggal/waktu dengan timestamp Unix. |
| `rich.customEmoji(customEmojiId, alternativeText)` | Entity custom emoji Telegram. ID harus valid dan bisa dipakai bot. |
| `rich.mathText(expression)` | Entity rumus pada teks. |
| `rich.anchorText(name)`, `rich.anchorLink(text, name)` | Anchor dan tautan anchor. |
| `rich.reference(text, name)`, `rich.referenceLink(text, name)` | Referensi silang di dalam konten. |
| `rich.buttonText(text, action, style)` | Entity tombol inline di dalam rich text; berbeda dari block `buttons`. |

Custom emoji memerlukan ID custom emoji sungguhan. Teks alternatif hanya label aksesibilitas/fallback; karakter emoji biasa tidak otomatis berubah menjadi custom emoji Telegram. Telegram dapat menolak ID yang tidak tersedia bagi bot atau chat tersebut.

## Katalog block

| Kelompok | Helper | Keterangan |
| --- | --- | --- |
| Teks | `paragraph(text)`, `heading(text, size)`, `pre(text, language)`, `footer(text)`, `divider()` | Heading memakai ukuran 1 sampai 6; `pre` dapat menyebut bahasa kode. |
| Rumus dan anchor | `mathBlock(expression)`, `anchor(name)` | Rumus sebagai block dan target anchor. |
| Daftar dan kutipan | `list(items)`, `quote(blocks, credit)`, `expandableQuote(text, credit)`, `pullQuote(text, credit)` | Item list dapat berupa string atau item terstruktur; kutipan bisa memuat block nested. |
| Tabel dan disclosure | `table(cells, options)`, `details(summary, blocks, open)` | Tabel mendukung opsi `bordered`, `striped`, `compact`, dan `caption`; details dapat dibuka secara default. |
| Lokasi | `map(location, zoom, width, height, caption, credit)` | `location` berbentuk `{ latitude, longitude }`. |
| Media | `animation(media, caption)`, `audio(media, caption)`, `document(media, caption)`, `photo(media, caption)`, `video(media, caption)`, `voiceNote(media, caption)` | Terima object `InputMedia*` dan mendukung upload multipart. |
| Galeri | `collage(blocks, caption, credit)`, `slideshow(blocks, caption, credit)` | Gabungkan block media yang didukung menjadi galeri atau urutan. |
| Tombol | `buttons(buttons, align)`, `button(text, action, style)` | Block tombol 1–8 item; `align` dapat `left`, `center`, atau `right`. |
| Draft | `thinking(text)` | Block khusus preview `sendRichMessageDraft`, bukan pesan final. |

### Sel tabel

Setiap sel tabel berbentuk object `{ text, align, valign }`. `align` dapat `left`, `center`, atau `right`; `valign` dapat `top`, `middle`, atau `bottom`. Tambahkan `is_header: true` untuk sel header. Batas payload schema saat ini mencakup maksimum 20 kolom tabel.

### Aksi tombol

Satu tombol memilih tepat satu jenis aksi, misalnya `url`, `callback_data`, `web_app`, `login_url`, `switch_inline_query`, `switch_inline_query_current_chat`, `switch_inline_query_chosen_chat`, `copy_text`, atau `disabled`. `rich.button(...)` membuat bentuk tombol untuk block `buttons`, sedangkan `rich.buttonText(...)` membuat entity di rich text. Style callback yang tersedia mencakup `danger`, `success`, `primary`, dan `link`; dukungan visual tombol mengikuti versi aplikasi Telegram.

## Media dan upload multipart

Media yang sudah tersimpan di Telegram dapat dirujuk melalui `file_id`. Untuk upload baru, bungkus bytes, path, atau stream dengan `File`/`InputFile` dan pilih builder media yang sesuai. TeleBibz mengumpulkan attachment lalu mengirimnya lewat multipart `attach://`, termasuk bila file ada dalam struktur payload nested.

```js
const fs = require('node:fs');
const { File, InputMediaBuilder, rich } = require('@xbibzlibrary/telebibz');

const photo = new File(fs.readFileSync('./hero.png'), 'hero.png');
const clip = new File(fs.readFileSync('./clip.mp4'), 'clip.mp4');
await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph('Contoh media dalam pesan:'),
  rich.photo(InputMediaBuilder.photo(photo)),
  rich.video(InputMediaBuilder.video(clip)),
]));
```

Untuk HTML/Markdown, tautkan media memakai ID unik dan entri `media` yang cocok:

```js
const image = new File(fs.readFileSync('./hero.png'), 'hero.png');
await ctx.replyWithRichMessage(rich.html(
  '<b>Foto utama</b><br><a href="tg://photo?id=hero">Lihat foto</a>',
  { media: [{ id: 'hero', media: InputMediaBuilder.photo(image) }] },
));
```

Gunakan tipe builder yang cocok dengan berkas. Nama berkas dan MIME type membantu library membentuk multipart payload. Server Telegram tetap validator terakhir untuk format, ukuran, hak akses, dan kelayakan method.

::: tip Catatan media
Dalam pengujian langsung pada endpoint rich animation, MP4 diterima sedangkan GIF menghasilkan error `RICH_MESSAGE_VIDEO_INVALID`; endpoint `sendAnimation` standalone menerima GIF yang sama. Jika block rich animation ditolak, coba MP4. Live photo menggunakan method terpisah dan bukan tipe block biasa.
:::

## Draft: preview sementara

Draft bukan pesan chat permanen. Gunakan untuk mengirim preview/streaming, lalu kirim pesan final agar konten tersimpan. Helper `rich.draftHtml`, `rich.draftMarkdown`, `rich.draftBlocks`, serta `RichMessageBuilder.buildDraft()` menghasilkan bentuk untuk `sendRichMessageDraft`.

```js
bot.cmd('preview', async (ctx) => {
  const draftId = Date.now();
  await ctx.sendMessageDraft(draftId, 'Sedang menyiapkan laporan', { can_stop: true });
  await ctx.sendRichMessageDraft(draftId + 1, rich.draftBlocks([
    rich.paragraph(['Mengolah ', rich.bold('laporan'), ' Anda']),
    rich.thinking('Mengumpulkan data'),
  ]), { can_stop: true, keep_on_stop: true });

  return ctx.replyWithRichMessage(rich.markdown('**Laporan siap**'));
});
```

Gunakan ID draft non-nol yang sesuai dengan aturan Telegram dan jangan memakai builder draft untuk upload `File` baru. Jika draft perlu attachment, rujuk media yang sudah memiliki `file_id` bila schema mendukungnya.

## Live photo, paid media, dan pesan ephemeral

### Live photo

`ctx.replyWithLivePhoto(video, photo, extra?)` mengirim pasangan file video dan foto statis yang berkaitan. Keduanya dapat memakai file ID atau `File`/`InputFile`; API saat ini tidak menerima URL langsung untuk method ini.

```js
await ctx.replyWithLivePhoto('VIDEO_FILE_ID', 'PHOTO_FILE_ID', { caption: 'Sebuah momen' });
```

`InputMediaBuilder.livePhoto(video, photo)` dan `InputPaidMediaBuilder.livePhoto(video, photo)` membuat object media terkait.

### Paid media

`sendPaidMedia` menggunakan Telegram Stars dengan `star_count` sesuai rentang yang ditentukan Telegram. Ini adalah fitur pembayaran nyata; jangan kirim transaksi uji kepada pengguna tanpa persetujuan dan periksa kewajiban produk/Stars sebelum dirilis.

```js
const { File, InputPaidMediaBuilder } = require('@xbibzlibrary/telebibz');
const paidImage = new File(require('node:fs').readFileSync('./paid.png'), 'paid.png');
await ctx.api.callApi('sendPaidMedia', {
  chat_id: ctx.chatId,
  star_count: 1,
  media: [InputPaidMediaBuilder.photo(paidImage)],
  caption: 'Contoh media berbayar',
});
```

### Ephemeral message

Pesan ephemeral dikirim kepada penerima tertentu melalui parameter ephemeral. Kelayakan bot, chat, penerima, dan hak akses ditentukan Telegram. Shortcut Context meliputi `replyEphemeral`, `editEphemeralMessageText`, `editEphemeralRichMessage`, `editEphemeralMessageMedia`, `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup`, serta `deleteEphemeralMessage`.

```js
await ctx.replyEphemeral('Pemberitahuan sementara', ctx.from.id);
```

Telegram dapat menolak method ini dengan error izin seperti `BOT_NOT_ADMIN`. Tangani error API; payload yang terbentuk dengan benar belum tentu memenuhi syarat izin di semua chat.

## Edit rich message yang sudah dikirim

Gunakan `ctx.editRichMessage(content, extra?)` untuk mengedit konten rich yang ada. Update pesan ditargetkan ke `chat_id`/`message_id` atau `inline_message_id` sesuai konteks. Uji pada pesan milik bot yang memang dapat diedit, bukan pesan masuk milik pengguna.

## Shortcut Context untuk Bot API 10.3

| Helper | Tujuan |
| --- | --- |
| `ctx.replyWithRichMessage(content, extra?)` | Kirim Rich Message tersimpan ke chat saat ini. |
| `ctx.editRichMessage(content, extra?)` | Edit Rich Message yang bisa diedit dalam konteks saat ini. |
| `ctx.replyWithLivePhoto(video, photo, extra?)` | Kirim live photo. |
| `ctx.sendMessageDraft(draftId, text, extra?)` | Kirim preview teks sementara. |
| `ctx.sendRichMessageDraft(draftId, richMessage, extra?)` | Kirim preview rich sementara. |
| `ctx.replyEphemeral(text, receiverUserId, extra?)` | Kirim pesan ephemeral kepada penerima yang ditentukan. |
| `ctx.guestQueryId`, `ctx.answerGuestQuery(result)` | Baca dan jawab update guest query yang nyata. |

Guest query membutuhkan `guest_query_id` yang berasal dari update Telegram asli. Artikel inline rich dapat dibuat menggunakan `iq.richArticle(id, title, richMessage, extra)` untuk inline query yang benar-benar masuk.

## Akses Bot API dan tipe

Registry TeleBibz mengenali **185 nama metode** pada versi ini dan mendukung `api.callApi()`/`api.raw()` dengan payload type di TypeScript. Proxy runtime juga menyediakan method berdasarkan nama jika Telegram menambah endpoint baru, tetapi method proxy dinamis di JavaScript tidak otomatis memvalidasi payload.

```js
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.markdown('**Laporan siap**'),
});
```

Tipe yang diekspor mencakup `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, `TelegramApiPayloads`, serta namespace `TelegramTypes`. Lihat [TypeScript](/reference/typescript) dan [daftar 185 metode](/reference/methods). Schema type tidak menjamin semua method lolos live request: beberapa membutuhkan update nyata, hak admin, pembelian, atau konteks chat tertentu.

## Batas payload, error, dan validasi

Schema vendored Bot API 10.3 mencatat batas Rich Message berikut: **32.768 karakter UTF-8**, **500 block** termasuk nested block, **16 tingkat nesting**, **50 attachment media**, dan **20 kolom tabel**. Block map memakai zoom 0–24 dan lebar/tinggi 0–10.000; block tombol berisi 1–8 tombol. Batas Telegram dapat berubah, jadi cek dokumentasi resmi sebelum menghasilkan payload besar.

- `RICH_MESSAGE_VIDEO_INVALID`: coba format MP4 untuk block rich animation.
- `BOT_NOT_ADMIN`: periksa izin bot dan kelayakan method; error ini tidak selalu menandakan payload JSON salah.
- `chat not found`: penerima private biasanya perlu membuka bot dan menekan **Start** lebih dulu.
- Error upload: cek path/stream, MIME type, ukuran berkas, dan penggunaan `File`/`InputFile`.

Untuk ringkasan hasil uji API dan batasan live test, lihat [laporan verifikasi di repository](https://github.com/XbibzOfficial777/telebibz/blob/main/VERIFIKASI-MENDALAM.md). Tidak semua 185 method dijalankan live; pembayaran, hak admin, event dari pengguna, dan aksi interaktif memerlukan setup nyata.
