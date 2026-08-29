# Webhook deployment guide (English)

Everything needed to run telebibz behind a webhook: choosing polling vs webhook, the four framework integrations, secret tokens, registering the webhook, webhook replies, and local development tunnels.

## Contents

1. [Polling or webhook?](#1-polling-or-webhook)
2. [The Web-standard handler](#2-the-web-standard-handler)
3. [Express, Koa, Fastify, and Node http](#3-express-koa-fastify-and-node-http)
4. [Registering the webhook](#4-registering-the-webhook)
5. [Secret tokens](#5-secret-tokens)
6. [Webhook replies (Telegraf-style)](#6-webhook-replies-telegraf-style)
7. [Local development with a tunnel](#7-local-development-with-a-tunnel)
8. [Production checklist](#8-production-checklist)
9. [Troubleshooting](#9-troubleshooting)

## 1. Polling or webhook?

| | Long polling (`bot.start()`) | Webhook |
|---|---|---|
| Setup | zero | needs HTTPS endpoint |
| Works behind NAT/laptop | ✅ | needs tunnel |
| Best for | development, small bots | production, serverless, high volume |
| Update delivery | bot pulls | Telegram pushes |

Both share the exact same update pipeline (parallel across chats, ordered per chat). Switch freely — handlers do not change.

## 2. The Web-standard handler

`createWebhookHandler()` takes a Web `Request` and returns a `Response` — it works on Node 22 (via `node:http` bridging below), Bun, Deno, and edge runtimes:

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.on("message", async (ctx) => { await ctx.reply("hello"); });

export const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,   // verifies X-Telegram-Bot-Api-Secret-Token
  maxBodyBytes: 1_048_576,                            // reject bodies over 1 MB (default)
  webhookReply: false,                                // see section 6
});
```

The handler verifies, in order: HTTP method and path, secret token header, body size, JSON parsing, and update shape — answering each failure with the right status code before your handlers ever run.

## 3. Express, Koa, Fastify, and Node http

`webhookCallback()` adapts the handler to each framework's request/response style:

**Express**

```ts
import express from "express";
import { Bot, webhookCallback } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.on("message", async (ctx) => { await ctx.reply("hello"); });

const app = express();
app.use(express.json({ limit: "1mb" }));
app.post("/telegram", webhookCallback(bot, "express", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET }));
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.listen(3000);
```

**Node http (no framework)**

```ts
import { createServer } from "node:http";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const callback = webhookCallback(bot, "http", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET });
createServer((req, res) => {
  if (req.method === "POST" && req.url === "/telegram") return void callback(req, res);
  res.writeHead(404).end();
}).listen(3000);
```

**Fastify**

```ts
import Fastify from "fastify";
import { webhookCallback } from "@xbibzlibrary/telebibz";

const fastify = Fastify({ logger: true });
fastify.post("/telegram", (req, reply) => webhookCallback(bot, "fastify", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET })(req, reply));
await fastify.listen({ port: 3000, host: "0.0.0.0" });
```

**Koa** (with `koa-bodyparser` so `ctx.request.body` is parsed)

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

Framework ids: `"express" | "http" | "fastify" | "koa"`.

## 4. Registering the webhook

Point Telegram at your endpoint once (not on every boot):

```ts
await bot.api.methods.setWebhook({
  url: "https://bot.example.com/telegram",
  secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
  max_connections: 40,                // 1–100, default 40
  drop_pending_updates: true,         // optional: discard updates queued while down
  allowed_updates: ["message", "callback_query"],
});
```

Check registration and tear it down:

```ts
const info = await bot.api.methods.getWebhookInfo();
await bot.api.methods.deleteWebhook({ drop_pending_updates: false });
```

A small CLI-style script makes this repeatable:

```ts
// scripts/register-webhook.ts — run with: npx tsx scripts/register-webhook.ts
import { Bot } from "@xbibzlibrary/telebibz";
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
await bot.api.methods.setWebhook({
  url: process.env.WEBHOOK_URL!,
  secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
  max_connections: 40,
});
console.log("webhook registered:", process.env.WEBHOOK_URL);
```

## 5. Secret tokens

Always set a secret token. Telegram then sends it in the `X-Telegram-Bot-Api-Secret-Token` header on every update; the handler rejects anything that does not match with `401 Unauthorized`. Generate one with `openssl rand -hex 32`. Two rules:

- Between 1 and 256 characters of `A-Z, a-z, 0-9, _` and `-`.
- Pass the **same value** to `setWebhook` (`secret_token`) and to `createWebhookHandler`/`webhookCallback` (`secretToken`).

## 6. Webhook replies (Telegraf-style)

With `webhookReply: true`, the **first** API call while handling an update is answered through the webhook HTTP response itself — Telegram executes the method for you and you save one round trip:

```ts
const handler = createWebhookHandler(bot, { webhookReply: true });
```

- Only the first call is claimed; later calls go through the transport as usual.
- The claimed call resolves with `true` (Telegram never sends the method result back through the webhook response).
- The lazy `getMe` initialization never claims the slot.
- Per-update override: `bot.handleUpdate(update, { webhookReply: sink })` for fully custom servers.

Most bots should keep it off — the default reply-then-200 flow is simpler to reason about, and the transport's connection reuse already keeps latency low.

## 7. Local development with a tunnel

Telegram must reach your endpoint over HTTPS. For local development, expose your port through a tunnel and register the tunnel URL:

```bash
# Option A: cloudflared (no account, no install to project)
cloudflared tunnel --url http://localhost:3000
# → https://random-name.trycloudflare.com

# Option B: ngrok
ngrok http 3000
# → https://random-name.ngrok-free.app
```

Then:

```bash
WEBHOOK_URL=https://random-name.trycloudflare.com npx tsx scripts/register-webhook.ts
```

Tunnel URLs change on restart — re-register after each restart, or keep using polling during development and switch to webhooks only in staging/production (the handler code is identical).

## 8. Production checklist

- [ ] HTTPS endpoint with a valid certificate (Telegram rejects self-signed certs unless you upload `certificate`)
- [ ] Secret token set on both `setWebhook` and the handler
- [ ] `max_connections` tuned (default 40; range 1–100)
- [ ] Health endpoint (`/healthz`) for your load balancer
- [ ] Graceful shutdown: `process.on("SIGTERM", () => bot.stop())` — drains in-flight handlers before plugins are disposed
- [ ] Body limit enforced (the handler rejects oversized bodies, but the framework's own limit should match)
- [ ] Logging: `logger: { format: "json" }` for structured ingestion
- [ ] Monitoring: subscribe to `update:error` and `bot:error` events
- [ ] `getWebhookInfo()` polled by your ops dashboard (watch `pending_update_count`)

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Telegram never calls the endpoint | Webhook not registered / wrong URL | `getWebhookInfo()` shows the registered URL and the last error |
| Every update answers 401 | Secret token mismatch | Same value in `setWebhook` and the handler |
| 404 from Telegram | Wrong path | Register the exact path you serve (`/telegram`) |
| Updates arrive twice | Both polling and webhook active | `deleteWebhook()` or stop calling `bot.start()` |
| `ai_response`/ssl errors in `getWebhookInfo` | Invalid certificate | Use a CA-signed cert or upload the self-signed one as `certificate` |
| Handler never sees large bodies | Framework body limit below Telegram's payload | Raise the framework's JSON limit (e.g. `express.json({ limit: "1mb" })`) |

Bahasa Indonesia: [WEBHOOK.id.md](WEBHOOK.id.md) · 简体中文: [WEBHOOK.zh-CN.md](WEBHOOK.zh-CN.md)
