# Webhook (Bahasa Indonesia)

Cara melayani update lewat webhook — untuk platform tanpa long-polling (serverless, container), atau saat butuh endpoint terbuka HTTPS.

## Daftar isi

1. [Polling vs webhook](#1-polling-vs-webhook)
2. [Handler: `createWebhookHandler()`](#2-handler-createwebhookhandler)
3. [Framework populer](#3-framework-populer)
4. [Mendaftarkan URL ke Telegram](#4-mendaftarkan-url-ke-telegram)
5. [Secret token](#5-secret-token)
6. [Mode `webhookReply`](#6-mode-webhookreply)
7. [Local development dengan tunnel](#7-local-development-dengan-tunnel)
8. [Checklist produksi](#8-checklist-produksi)
9. [Troubleshooting](#9-troubleshooting)

## 1. Polling vs webhook

| | Polling (`bot.start()`) | Webhook |
|---|---|---|
| Menghubungi Telegram | Ya (long-polling) | Tidak — Telegram yang menghubungi Anda |
| Butuh domain + HTTPS publik | Tidak | Ya |
| Cocok untuk | Skrip lokal, development, VPS | Serverless (Lambda/Workers/Cloud Functions), container, k8s |
| Konkurensi | Pipeline per-update yang sama | Pipeline per-update yang sama |
| Menerima `POST /<path>` Anda sendiri | — | Ya — handler mengembalikan `Response`, routing tetap milik Anda |

Hanya satu yang aktif: Telegram mengirim update ke webhook terdaftar dan mengabaikan `getUpdates` selama webhook aktif.

## 2. Handler: `createWebhookHandler()`

Handler menerima **Web-standard `Request`** dan mengembalikan **`Response`** — berjalan di Node, Bun, Deno, dan edge runtime:

```ts
import { createWebhookHandler } from "@xbibzlibrary/telebibz";

const handleUpdate = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,  // verifikasi X-Telegram-Bot-Api-Secret-Token
  webhookReply: true,                                 // jawab API via body respons (opsional)
});

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "POST" && new URL(request.url).pathname === "/telegram") {
      return handleUpdate(request);
    }
    return new Response("Not Found", { status: 404 });
  },
};
```

- Body > 1 MB → `413 Payload Too Large` (atur `maxBodyBytes`).
- Secret salah → `401 Unauthorized`.
- Method non-POST → `405 Method Not Allowed`.
- Update diproses via pipeline normal — error handler, session, conversation, semuanya bekerja.

Untuk server Node ala Express (objek req/res, bukan `Request`), gunakan `webhookCallback()` — lihat [Framework populer](#3-framework-populer).

## 3. Framework populer

### Express

```ts
import express from "express";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.post("/telegram", webhookCallback(bot, "express", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET }));
app.listen(3000);
```

### Node `http`

```ts
import http from "node:http";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const callback = webhookCallback(bot, "http", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET });
http
  .createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/telegram") return callback(req, res);
    res.writeHead(404).end();
  })
  .listen(3000);
```

### Fastify

```ts
import Fastify from "fastify";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const fastify = Fastify({ bodyLimit: 1_048_576 });
fastify.post("/telegram", (req, reply) => webhookCallback(bot, "fastify", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET })(req, reply));
await fastify.listen({ port: 3000 });
```

### Koa (dengan `koa-bodyparser` agar `ctx.request.body` terisi)

```ts
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const app = new Koa();
app.use(bodyParser());
app.use(async (ctx) => {
  if (ctx.method === "POST" && ctx.path === "/telegram") {
    await webhookCallback(bot, "koa", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET })(ctx.request, ctx);
    return;
  }
  ctx.status = 404;
});
app.listen(3000);
```

## 4. Mendaftarkan URL ke Telegram

Webhook hanya mengirim ke URL yang Anda daftarkan. Setelah server jalan di URL publik, panggil `setWebhook` sekali:

```ts
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

await bot.api.methods.setWebhook({
  url: "https://bot.example.com/telegram",
  secret_token: secret,                 // sama persis dengan secretToken handler
  max_connections: 40,                  // default 40; sesuaikan dengan kapasitas
  allowed_updates: ["message", "callback_query"],  // opsional: kurangi trafik
  drop_pending_updates: false,
});
```

**Menghentikan webhook** — dua opsi:

```ts
await bot.api.methods.deleteWebhook({ drop_pending_updates: true }); // kembali ke polling
```

Saat bot Anda berjalan di local Bot API server, `setWebhook` juga menerima `ip_address` untuk menghindari resolusi DNS publik.

## 5. Secret token

Tanpa secret, siapa pun yang tahu URL bisa mengirim update palsu. Secret memverifikasi bahwa request berasal dari Telegram:

```bash
openssl rand -hex 32
```

Simpan sebagai environment variable dan berikan **nilai yang sama persis** ke `setWebhook` (parameter `secret_token`) dan ke handler (opsi `secretToken`). Perbandingan dilakukan constant-time — tidak bisa diTiming-attack. Aturan: 1–256 karakter dari `A-Z a-z 0-9 _ -`.

Perhatikan `webhookReply` **tidak** terkait secret — mode itu memilih *bagaimana* respons API dikirim, bukan siapa pengirimnya.

## 6. Mode `webhookReply`

Telegram mengizinkan bot menjawab satu panggilan API langsung di body respons webhook. Mengaktifkan mode ini menghilangkan satu round-trip per balasan — sangat berguna di serverless:

```ts
const handleUpdate = createWebhookHandler(bot, { webhookReply: true });
```

Hanya **satu** panggilan API per update yang mendapat manfaat ini — panggilan pertama yang selesai menang; sisanya dikirim sebagai request HTTP normal. Ketika body respons sudah dipakai, handler mengembalikan `{}` (Telegram tetap menganggapnya sukses).

Telegraf menyebutnya `telegram.webhookReply`; konsep dan default-nya sama persi di telebibz.

## 7. Local development dengan tunnel

Telegram hanya mengirim ke URL **publik HTTPS**. Saat development, arahkan URL publik ke localhost:

```bash
# cloudflared (tanpa akun)
cloudflared tunnel --url http://localhost:3000

# atau ngrok
ngrok http 3000
```

Lalu daftarkan URL yang dihasilkan:

```bash
TOKEN="…"
URL="https://random-words.loca.lt"   # dari output tunnel
SECRET="…"
curl "https://api.telegram.org/bot$TOKEN/setWebhook" \
  -d "url=$URL/telegram" -d "secret_token=$SECRET"
```

Lepas webhook setelah selesai (`deleteWebhook`) agar `bot.start()` berfungsi kembali.

## 8. Checklist produksi

- [ ] HTTPS publik + sertifikat valid (Telegram menolak self-signed)
- [ ] `secret_token` ter-set dan cocok di kedua sisi
- [ ] `max_connections` disetel (default 40)
- [ ] Body parser limit ≥ 1 MB (`express.json({ limit: "1mb" })` dkk.)
- [ ] Timeout upstream > `handlerTimeout` (agar `UpdateTimeoutError` sempat mengambil alih, bukan 504 load balancer)
- [ ] `drop_pending_updates` dipertimbangkan saat redeploy
- [ ] Error ter-observasi: `bot.catch()` + `update:error`
- [ ] Graceful shutdown: `bot.stop()` sebelum exit

## 9. Troubleshooting

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| Telegram selalu timeout (baris `getUpdates` kosong) | Webhook aktif — Telegram mengabaikan polling | `deleteWebhook` atau gunakan handler |
| 401 di setiap request | Secret handler ≠ `secret_token` yang terdaftar | Samakan nilainya di `setWebhook` dan handler |
| 413 Payload Too Large | Body melebihi `maxBodyBytes` (default 1 MB) | Naikkan `maxBodyBytes` + limit body parser |
| 502 dari proxy | Webhook mengirim `content-type: application/json` — proxy menolak | Hapus rewrite content-type; handler menerima JSON |
| `409 Conflict` saat `getUpdates` | Webhook masih terdaftar | `deleteWebhook` dulu |
| Update diterima lalu menggantung | Handler menunggu network call yang lambat | Turunkan `handlerTimeout`; pastikan observabilitas via `update:error` |
| Serverless: jawaban tidak pernah sampai | Terlalu banyak await di satu handler | Aktifkan `webhookReply` agar panggilan pertama menumpang respons |

English: [WEBHOOK.md](WEBHOOK.md) · 简体中文: [WEBHOOK.zh-CN.md](WEBHOOK.zh-CN.md)
