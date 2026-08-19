# Security Policy

## Supported versions

Security fixes target the latest development branch and the latest published stable release.

## Reporting a vulnerability

Jangan publikasikan token bot, payload sensitif, atau detail eksploit pada issue terbuka. Kirim laporan privat kepada maintainer package dengan deskripsi reproduksi minimal, impact, versi Node.js, versi `telebibz`, dan apakah masalah terjadi pada transport, webhook, routing, storage, atau CLI.

## Security boundaries

`telebibz` tidak mengirim telemetry ke third party secara otomatis. Token harus diberikan melalui environment atau secret manager dan tidak boleh dimasukkan ke source control. Aplikasi pengguna bertanggung jawab untuk membatasi akses server webhook, mengelola secret rotation, memvalidasi authorization domain Mini App, dan memilih adapter storage yang aman.

Input dari Telegram dianggap tidak tepercaya. Callback data, file path, URL, JSON payload, dan user-provided text harus divalidasi sebelum digunakan sebagai perintah filesystem, network, atau database.
