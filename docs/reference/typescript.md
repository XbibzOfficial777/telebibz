---
title: TypeScript
description: Tipe handler, payload Bot API, rich message, dan konfigurasi TeleBibz.
---

# TypeScript

TeleBibz menyertakan deklarasi `.d.ts`. Paket menggunakan CommonJS, tetapi dapat dipakai dari TypeScript dengan module resolution yang sesuai konfigurasi Node project.

## Membuat bot

```ts
import { TeleBibz } from '@xbibzlibrary/telebibz';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur');

const bot = new TeleBibz(token, {
  silent: true,
  onError: (err, ctx) => {
    console.error('Gagal menangani update:', err, ctx?.chatId);
  },
});

bot.cmd('start', (ctx) => ctx.reply(`Halo ${ctx.from?.first_name ?? 'teman'}!`));
bot.hears(/ping/i, (ctx) => ctx.reply('pong'));

async function main() {
  await bot.launch();
}
main().catch(console.error);
```

Handler menerima `Context`; properti update yang tidak selalu tersedia ditandai opsional. Lihat [referensi Context](/reference/context).

## Tipe nama, payload, dan hasil method

`TelegramMethodName`, `TelegramMethodArguments<M>`, `TelegramMethodPayload<M>`, dan `TelegramMethodResult<M>` berasal dari schema Telegram Bot API yang disertakan dalam package. `callApi()` dan `raw()` menginferensikan tuple argumen serta response dari nama method:

```ts
import {
  TeleBibz,
  type TelegramMethodName,
  type TelegramMethodArguments,
  type TelegramMethodPayload,
  type TelegramMethodResult,
} from '@xbibzlibrary/telebibz';

const bot = new TeleBibz(process.env.BOT_TOKEN!);
const method = 'sendMessage' satisfies TelegramMethodName;
const payload: TelegramMethodPayload<typeof method> = {
  chat_id: 123456789,
  text: 'Halo dari TypeScript',
};
const args: TelegramMethodArguments<typeof method> = [payload];

async function send() {
  const result: TelegramMethodResult<typeof method> = await bot.api.callApi(method, ...args);
  return result;
}
```

Method payload mengikuti nama field Telegram, umumnya `snake_case`. Nama yang tidak tercakup oleh declaration dapat tetap dipanggil lewat proxy JavaScript, tetapi proxy dinamis tidak memberi validasi tipe yang sama.

## Rich Message dan file

Type helper mencakup `InputRichBlock`, `InputRichMessage`, `InputRichMessageMedia`, `RichMessageButton`, `TelegramTypes`, dan builder `rich`:

```ts
import { TeleBibz, rich } from '@xbibzlibrary/telebibz';

const bot = new TeleBibz(process.env.BOT_TOKEN!);
bot.cmd('status', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Status layanan', 2),
  rich.paragraph(['API: ', rich.bold('aktif')]),
])));
```

File input mendukung string/path, `Buffer`, `Uint8Array`, dan stream melalui class `File` atau `InputFile`. Lihat [Rich Messages](/guide/rich-messages) untuk media multipart dan keterbatasan upload draft.

## Tipe yang diekspor

- `TeleBibzOptions`, `SessionOptions`, `Handler`, `Context`, `Composer`, `BotError`, `ApiClient`, dan `ApiError`.
- `TelegramFileInput`, `TelegramMethodName`, `TelegramMethodArguments<M>`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, dan `TelegramApiPayloads`.
- `TelegramTypes` sebagai namespace type untuk objek Bot API.
- Tipe Rich Message serta tipe input file.

Schema yang dibundel mengikuti versi TeleBibz dan tidak menggantikan dokumentasi Telegram untuk syarat runtime, hak akses, atau batas endpoint. Jalankan `npm run typecheck` dan test aplikasi setelah memperbarui versi library.
