---
title: Referensi Context
description: Properti Context, handler shortcut, file, edit, inline, dan operasi chat.
---

# Referensi Context

Satu instance `Context` dibuat per update. Gunakan field opsional dengan guard karena update Telegram dapat berbentuk message, callback query, inline query, channel post, Business event, dan lainnya.

## Properti utama

| Properti | Keterangan |
| --- | --- |
| `update` | Update Telegram mentah. |
| `api` | API client untuk method Bot API. |
| `me` | Informasi bot setelah inisialisasi. |
| `msg` | Pesan yang terkait update jika tersedia. |
| `chat`, `from` | Chat dan pengirim jika tersedia. |
| `chatId`, `msgId` | ID chat/pesan yang relevan. |
| `match` | Teks hasil match command pada handler command. |
| `session` | Data state per key session. |
| `guestQueryId` | ID guest query jika ada di update. |

## Pesan

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

- `editMessageText(text, extra?)`, `editRichMessage(content, extra?)`.
- `editMessageCaption(extra?)`, `editMessageMedia(media, extra?)`, `editMessageReplyMarkup(extra?)`.
- `deleteMessage(chatId?, messageId?)`, `deleteMessages(messageIds)`.
- `forwardMessage(destination, sourceChat?, messageId?, extra?)` dan `copyMessage(destination, sourceChat?, messageId?, extra?)`.
- `react(reaction?, extra?)` untuk pesan update saat ini bila konteks mendukung.

Shortcut Context menurunkan target dari update saat ini bila memungkinkan. Untuk pesan lain atau inline message, panggil API dengan ID eksplisit dan cek tipe targetnya.

## Callback dan inline query

`answerCallbackQuery(extraOrText?)` menjawab callback dan menghentikan spinner klien. `answerInlineQuery(results, extra?)` menjawab inline query. `answerGuestQuery(result)` menjawab guest query jika update memiliki ID yang sesuai. Lihat [Inline mode & broadcast](/guide/inline-broadcast).

## File

`getFile()` memilih file dari message saat ini (misalnya foto terbesar atau document) dan memanggil `getFile` Telegram. `downloadFile(destination)` mengunduh file yang sama ke disk. Method ini melempar error jika message context tidak berisi file. Untuk kirim file, lihat [File & session](/guide/files-sessions).

## Chat dan administrasi

Context juga menyediakan shortcut seperti `getChatMember`, `getAuthor`, `banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `leaveChat`, `setChatTitle`, `setChatDescription`, `pinChatMessage`, dan `unpinChatMessage`. Method administrasi tetap tunduk pada hak admin, permission, dan aturan Telegram.

Pada update Business, helper balasan Context meneruskan `business_connection_id` yang tersedia. Detail shortcut keyboard ada di [Context & keyboard](/guide/context-keyboards), dan daftar endpoint lengkap di [metode Bot API](/reference/methods).
