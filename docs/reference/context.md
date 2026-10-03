---
title: Referensi Context
description: Properti Context, shortcut handler, file, edit, inline, dan operasi chat.
---

# Referensi Context

Satu instance `Context` dibuat untuk setiap update lalu diberikan kepada middleware dan handler yang cocok. Update Telegram dapat berbentuk message, callback query, inline query, channel post, Business event, dan lainnya; periksa field opsional sebelum digunakan.

## Properti utama

| Properti | Keterangan |
| --- | --- |
| `ctx.update` | Update Telegram mentah. |
| `ctx.api` | API client untuk method Bot API. |
| `ctx.me` | Informasi bot setelah inisialisasi. |
| `ctx.msg` | Pesan yang terkait dengan update jika tersedia. |
| `ctx.chat`, `ctx.from` | Chat dan pengirim terkait jika tersedia. |
| `ctx.chatId`, `ctx.msgId` | ID chat dan pesan yang relevan. |
| `ctx.match` | Teks setelah command yang cocok dengan `bot.cmd()`. |
| `ctx.session` | Data state untuk key session yang dikonfigurasi. |
| `ctx.guestQueryId` | ID guest query jika tersedia pada update. |

## Pesan

Shortcut Context menurunkan target chat dari update saat ini bila memungkinkan:

```js
bot.on(':text', async (ctx) => {
  await ctx.reply(`Diterima: ${ctx.msg?.text ?? ''}`);
});
```

| Tujuan | Method |
| --- | --- |
| Balas | `reply(text, extra?)`, `replyWithHTML(text, extra?)`, `replyWithMarkdown(text, extra?)` |
| Rich content | `replyWithRichMessage(content, extra?)`, `editRichMessage(content, extra?)` |
| Media | `replyWithPhoto`, `replyWithVideo`, `replyWithAudio`, `replyWithDocument`, `replyWithAnimation`, `replyWithVoice`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup` |
| Lokasi | `replyWithLocation(latitude, longitude, extra?)`, `replyWithVenue(...)`, `replyWithContact(phone, firstName, extra?)` |
| Interaksi | `replyWithPoll(question, options, extra?)`, `replyWithDice(emoji?, extra?)`, `replyWithInvoice(...)`, `replyWithChatAction(action?, extra?)` |
| Live/draft | `replyWithLivePhoto(video, photo, extra?)`, `sendMessageDraft(id, text, extra?)`, `sendRichMessageDraft(id, content, extra?)` |
| Ephemeral | `replyEphemeral(text, receiverUserId, extra?)`, `editEphemeralMessageText(...)`, `editEphemeralRichMessage(...)`, `editEphemeralMessageMedia(...)`, `deleteEphemeralMessage(...)` |

Shortcut media menerima media/file dan object `extra`; untuk kontrol penuh, gunakan `ctx.api` langsung.

## Edit, hapus, forward, dan copy

- `editMessageText(text, extra?)` dan `editRichMessage(content, extra?)` mengedit pesan saat ini bila update menyediakan target yang sesuai.
- `editMessageCaption(extra?)`, `editMessageMedia(media, extra?)`, dan `editMessageReplyMarkup(extra?)` mengubah caption, media, atau keyboard pesan.
- `deleteMessage(chatId?, messageId?)` dan `deleteMessages(messageIds)` menghapus pesan.
- `forwardMessage(destination, sourceChat?, messageId?, extra?)` dan `copyMessage(destination, sourceChat?, messageId?, extra?)` meneruskan atau menyalin pesan.
- `react(reaction?, extra?)` memberi reaksi pada pesan update saat ini jika konteks mendukung.

Shortcut Context menurunkan target dari update saat ini bila memungkinkan. Untuk pesan lain atau inline message, berikan ID eksplisit dan periksa jenis target. Untuk pesan yang dikembalikan `ctx.reply()`, gunakan `message_id`-nya:

```js
const sent = await ctx.reply('Pesan awal');
await ctx.api.editMessageText(ctx.chatId, sent.message_id, 'Sudah diperbarui');
```

Hak akses dan aturan usia pesan Telegram tetap berlaku.

## Callback dan inline query

`answerCallbackQuery(extraOrText?)` menjawab callback dan menutup spinner klien. `answerInlineQuery(results, extra?)` menjawab inline query. `answerGuestQuery(result)` menjawab guest query jika update memiliki ID yang sesuai. Lihat [Handler & filter](/guide/handlers) dan [Inline mode & broadcast](/guide/inline-broadcast).

## File

`getFile()` memilih file dari message saat ini—misalnya foto terbesar atau document—dan meminta metadata Telegram. `downloadFile(destination)` mengunduh file tersebut ke disk. Keduanya melempar error jika Context message tidak memuat file. Untuk akses di luar update saat ini, gunakan `ctx.api.getFile(fileId)` atau `ctx.api.downloadFile(fileId, destination)`. Lihat [File & session](/guide/files-sessions).

## Chat dan administrasi

Context menyediakan shortcut seperti `getChatMember`, `getAuthor`, `banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `setChatTitle`, `setChatDescription`, `pinChatMessage`, dan `unpinChatMessage`. Method administrasi tetap tunduk pada hak admin, permission, dan aturan Telegram.

Pada update Business, helper balasan Context meneruskan `business_connection_id` yang tersedia. Detail shortcut keyboard ada di [Context & keyboard](/guide/context-keyboards), dan daftar endpoint lengkap di [metode Bot API](/reference/methods).
