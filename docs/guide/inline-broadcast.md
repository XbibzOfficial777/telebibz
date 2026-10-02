---
title: Inline mode & broadcast
description: Tangani inline query, siapkan hasil inline, dan kirim broadcast bertahap.
---

# Inline mode & broadcast

## Inline mode

Aktifkan Inline Mode melalui @BotFather sebelum menguji fitur ini, lalu pengguna dapat memanggil bot di chat dengan mengetik `@usernamebot kata kunci`. Telegram mengirim update `inline_query`; handler TeleBibz dapat memilih query melalui `bot.inlineQuery(trigger, handler)`.

```js
const { iq } = require('@xbibzlibrary/telebibz');

bot.inlineQuery('*', async (ctx) => {
  const query = ctx.inline_query.query?.trim() || '';
  await ctx.answerInlineQuery([
    iq.article('echo', 'Kirim teks ini', {
      message_text: query || 'Ketik teks setelah nama bot.',
    }),
  ], { cache_time: 0, is_personal: true });
});
```

Trigger `'*'` mencocokkan semua query. String biasa dicocokkan secara case-insensitive sebagai substring; `RegExp` cocok berdasarkan pola. `matchInlineQuery(trigger)` adalah predicate yang sama untuk dipakai pada `bot.filter` atau `bot.on` bila ingin menggabungkan kondisi lain.

### Builder `iq`

| Helper | Tipe hasil |
| --- | --- |
| `iq.article(id, title, extra?)` | Article teks biasa dengan `input_message_content`. |
| `iq.richArticle(id, title, richMessage, extra?)` | Article dengan Rich Message. |
| `iq.photo(id, photoUrl, thumbnailUrl?, extra?)` | Foto berdasarkan URL. |
| `iq.gif(id, gifUrl, thumbnailUrl?, extra?)` | GIF berdasarkan URL. |
| `iq.video(id, url, thumbnailUrl, title, extra?)` | Video MP4. |
| `iq.audio(id, url, title, extra?)` | Audio. |
| `iq.location(id, latitude, longitude, title, extra?)` | Lokasi. |
| `iq.sticker(id, fileId, extra?)` | Sticker berdasarkan file ID Telegram. |

ID hasil harus unik dalam satu jawaban inline dan memenuhi format/ukuran Telegram. Jawab query sebelum batas waktu Telegram; gunakan `cache_time` dan `is_personal` berdasarkan privasi serta personalisasi konten.

## Broadcast

`bot.broadcast(chatIds, message, options)` mengirim method `sendMessage` secara berurutan. `message` bisa berupa string, object payload `sendMessage` (misalnya `{ text, parse_mode }`), atau fungsi async `(chatId) => payload` untuk personalisasi. Hasil mengandung jumlah `terkirim`, jumlah `gagal`, dan array `errors` dengan `chatId` serta pesan error.

```js
const hasil = await bot.broadcast(
  daftarChatId,
  (chatId) => ({ text: `Ada pembaruan untuk akun ${chatId}.` }),
  { delay: 50 },
);

console.log(`Terkirim: ${hasil.terkirim}; gagal: ${hasil.gagal}`);
```

Jeda default adalah 35 ms antar-penerima. Naikkan jeda untuk mengurangi laju request dan pasang transformer retry/throttler bila sesuai. Fungsi broadcast tidak mengelola daftar penerima atau persetujuan: simpan data dengan kebijakan privasi yang tepat, kirim hanya kepada orang yang mengharapkan pesan, dan tangani penerima yang memblokir bot.

Bot umumnya tidak dapat memulai percakapan private. Pengguna perlu membuka bot dan menekan **Start** terlebih dahulu. Untuk kampanye besar, gunakan antrean durable, batasi paralelisme, simpan hasil per penerima, dan sediakan mekanisme opt-out sesuai produk/aturan yang berlaku.
