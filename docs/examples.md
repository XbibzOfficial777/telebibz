---
title: Contoh siap jalan
description: Contoh bot TeleBibz dari repository.
---

# Contoh siap jalan

Repository TeleBibz punya contoh JavaScript di folder [`examples/`](https://github.com/XbibzOfficial777/telebibz/tree/main/examples). Jalankan dari root hasil clone repository setelah memasang dependency dan mengatur `BOT_TOKEN`.

| File | Isi |
| --- | --- |
| [`01-quickstart.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/01-quickstart.js) | Bot pertama, command dan text handler. |
| [`02-menu-tombol.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/02-menu-tombol.js) | Inline keyboard dan callback. |
| [`03-wizard.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/03-wizard.js) | Wizard dengan validasi, tombol pilihan, dan mode edit. |
| [`04-broadcast.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/04-broadcast.js) | Broadcast ke daftar chat dan pembatasan akses admin. |
| [`05-kirim-file.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/05-kirim-file.js) | Kirim file/foto. |
| [`06-menu.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/06-menu.js) | Menu dengan submenu. |
| [`07-inline-query.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/07-inline-query.js) | Inline mode. |
| [`08-rich-message.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/08-rich-message.js) | Rich Message, callback, dan draft. |

Contoh repository memakai `require('..')` karena dijalankan dari dalam repo. Kalau dipindah ke project bot terpisah, ganti dengan `require('@xbibzlibrary/telebibz')`.
