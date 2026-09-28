# NOTICE

## Arsitektur dan implementasi JavaScript

telebibz adalah recode mandiri dengan konsep arsitektur yang terinspirasi oleh
Bot API framework **grammY** (https://github.com/grammyjs/grammY, lisensi MIT).
Implementasi JavaScript pada `lib/` ditulis untuk repo ini; referensi tersebut
adalah atribusi konseptual.

## Type declarations Bot API

Berkas deklarasi TypeScript pada `types/telegram-bot-api/` diambil dari
[`@grammyjs/types` v5.0.0](https://github.com/grammyjs/types), proyek grammY
berlisensi MIT. Salinan lisensinya ada di [`types/telegram-bot-api/LICENSE`](types/telegram-bot-api/LICENSE).
Deklarasi tersebut digunakan sebagai model tipe Bot API 10.3; implementasi
runtime telebibz tetap menggunakan transport dan proxy milik repo ini.

Terima kasih kepada grammY dan komunitas Telegram bot atas dokumentasi dan
rancangan API yang membantu proyek ini.
