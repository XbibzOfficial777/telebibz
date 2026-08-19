# Telebibz Owner Approval Feature

## Tujuan

Approval feature membuat bot yang memakai `telebibz` meminta izin owner sebelum update biasa diproses. Ketika bot pertama kali start, library mengirim pesan ke `ownerChatId` dengan format:

> Haloo Dev Gantenggg, ada yang memakai library telebibz nihh
>
> Bot: @example_bot (ID: 123456)
> Owner ID: 987654
> Status: menunggu izin owner.
>
> [Izinkan] [Tidak Diizinkan]

Bot berada pada status `awaiting-approval`. Update biasa tidak diteruskan ke router sampai owner menekan **Izinkan**. **Tidak Diizinkan** membuat status tetap tertolak.

## Konfigurasi

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  approval: {
    ownerChatId: Number(process.env.TELEBIBZ_OWNER_CHAT_ID),
    ownerUserId: Number(process.env.TELEBIBZ_OWNER_USER_ID),
    ownerLabel: "Dev Gantenggg",
    requireApproval: true,
  },
});

bot.command("start", (ctx) => ctx.reply("Bot sudah diizinkan."));
await bot.start();
```

`ownerChatId` adalah chat tempat notifikasi approval dikirim. `ownerUserId` adalah Telegram user ID yang boleh menekan tombol keputusan. Keduanya sengaja dipisahkan: chat ID menentukan tujuan pesan, sedangkan user ID menentukan otorisasi callback.

## Alur

Pada startup, `Bot.init()` memanggil `getMe()` lalu membuat approval record `pending`. Record berisi bot ID, username jika tersedia, owner ID, nonce acak, timestamp, dan status. Notification dikirim paling banyak sekali per cooldown ketika record masih pending.

Callback memakai format internal dengan nonce acak. Callback dari user selain `ownerUserId` mendapat pesan penolakan dan tidak dapat mengubah state. Callback dengan nonce tidak cocok dianggap kedaluwarsa. Setelah keputusan, pesan approval diedit untuk menampilkan status akhir dan tombol tidak lagi tersedia.

## Persistence

Default store adalah `MemoryApprovalStore`, cocok untuk development dan satu proses. Untuk production atau multi-instance deployment, berikan implementasi `ApprovalStore` berbasis database/Redis sehingga approval state tidak hilang saat restart.

```ts
const approvalStore = {
  async get(key) { return database.approvals.find(key); },
  async set(key, record) { await database.approvals.upsert(key, record); },
  async delete(key) { return database.approvals.delete(key); },
};

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  approval: {
    ownerChatId: 123,
    ownerUserId: 456,
    store: approvalStore,
  },
});
```

## Privacy dan security

Feature ini **tidak mengirim data ke server telebibz atau third party secara diam-diam**. Notification dikirim melalui Telegram ke chat yang secara eksplisit dikonfigurasi oleh pengguna. Hanya identitas bot dan owner ID konfigurasi yang dimasukkan ke pesan. Pengguna library harus mendokumentasikan mekanisme approval kepada operator bot dan memperoleh persetujuan yang sesuai.

Token bot, `ownerChatId`, dan `ownerUserId` harus berasal dari environment/secret manager. Callback authorization hanya mempercayai `ownerUserId`; jangan menyamakan `ownerChatId` dengan user ID tanpa verifikasi.

## Test coverage

Approval tests mencakup notification, pending block, signed callback format, unauthorized decision rejection, owner approval, denial, dan Bot startup state `awaiting-approval`. Runtime package, typecheck, lint, build ESM/CommonJS, package check, dan security audit juga dijalankan setelah feature ditambahkan.
