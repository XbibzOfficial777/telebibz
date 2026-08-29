# Webhook 指南（简体中文）

通过 webhook 提供更新服务 —— 适用于无长轮询的平台（serverless、容器），或需要公网 HTTPS 端点的场景。

## 目录

1. [轮询 vs webhook](#1-轮询-vs-webhook)
2. [处理器：`createWebhookHandler()`](#2-处理器createwebhookhandler)
3. [常见框架](#3-常见框架)
4. [向 Telegram 注册 URL](#4-向-telegram-注册-url)
5. [Secret token](#5-secret-token)
6. [`webhookReply` 模式](#6-webhookreply-模式)
7. [本地开发：隧道](#7-本地开发隧道)
8. [生产检查清单](#8-生产检查清单)
9. [故障排查](#9-故障排查)

## 1. 轮询 vs webhook

| | 轮询（`bot.start()`） | Webhook |
|---|---|---|
| 主动连接 Telegram | 是（长轮询） | 否 —— Telegram 主动连接你 |
| 需要公网域名 + HTTPS | 否 | 是 |
| 适合 | 本地脚本、开发、VPS | Serverless（Lambda/Workers/Cloud Functions）、容器、k8s |
| 并发 | 相同的逐更新流水线 | 相同的逐更新流水线 |
| 自定义 `POST /<path>` 路由 | — | 是 —— 处理器返回 `Response`，路由仍归你 |

同一时间只有一种生效：webhook 注册后 Telegram 把更新推到该 URL，并忽略 `getUpdates`。

## 2. 处理器：`createWebhookHandler()`

处理器接受 **Web 标准 `Request`** 并返回 **`Response`** —— 可运行于 Node、Bun、Deno 与 edge runtime：

```ts
import { createWebhookHandler } from "@xbibzlibrary/telebibz";

const handleUpdate = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,  // 校验 X-Telegram-Bot-Api-Secret-Token
  webhookReply: true,                                 // 通过响应体应答 API（可选）
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

- Body 超过 1 MB → `413 Payload Too Large`（可用 `maxBodyBytes` 调整）。
- Secret 不匹配 → `401 Unauthorized`。
- 非 POST 方法 → `405 Method Not Allowed`。
- 更新经正常流水线处理 —— 错误处理器、session、conversation 全部照常工作。

对 Express 风格的 Node 服务器（req/res 对象而非 `Request`），使用 `webhookCallback()` —— 见[常见框架](#3-常见框架)。

## 3. 常见框架

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

### Koa（配合 `koa-bodyparser` 使 `ctx.request.body` 被解析）

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

## 4. 向 Telegram 注册 URL

webhook 只会推送到你注册的 URL。服务器在公网地址就绪后，调用一次 `setWebhook`：

```ts
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

await bot.api.methods.setWebhook({
  url: "https://bot.example.com/telegram",
  secret_token: secret,                 // 与处理器的 secretToken 完全一致
  max_connections: 40,                  // 默认 40；按容量调整
  allowed_updates: ["message", "callback_query"],  // 可选：减少流量
  drop_pending_updates: false,
});
```

**撤销 webhook** —— 两种选择：

```ts
await bot.api.methods.deleteWebhook({ drop_pending_updates: true }); // 回到轮询
```

当 bot 运行在本地 Bot API 服务器上时，`setWebhook` 还接受 `ip_address`，避免公网 DNS 解析。

## 5. Secret token

没有 secret，任何知道 URL 的人都能伪造更新。secret 用于确认请求确实来自 Telegram：

```bash
openssl rand -hex 32
```

保存为环境变量，并把**完全相同的值**传给 `setWebhook`（`secret_token` 参数）和处理器（`secretToken` 选项）。比较采用常数时间 —— 无法计时攻击。规则：1–256 个字符，仅限 `A-Z a-z 0-9 _ -`。

注意 `webhookReply` 与 secret 无关 —— 该模式决定 API 响应*如何*发送，而非请求来自谁。

## 6. `webhookReply` 模式

Telegram 允许 bot 直接在 webhook 响应体里应答一次 API 调用。开启后每次回复省去一次往返 —— 在 serverless 上尤其有价值：

```ts
const handleUpdate = createWebhookHandler(bot, { webhookReply: true });
```

每个 update 只有**一次** API 调用能享受此机制 —— 最先完成的那次获胜；其余照常走 HTTP 请求。响应体被占用后，处理器返回 `{}`（Telegram 仍视为成功）。

Telegraf 中称为 `telegram.webhookReply`；概念与默认值在 telebibz 中完全一致。

## 7. 本地开发：隧道

Telegram 只向**公网 HTTPS** URL 推送。开发时把公网 URL 隧道到 localhost：

```bash
# cloudflared（无需账号）
cloudflared tunnel --url http://localhost:3000

# 或 ngrok
ngrok http 3000
```

然后注册得到的 URL：

```bash
TOKEN="…"
URL="https://random-words.loca.lt"   # 来自隧道输出
SECRET="…"
curl "https://api.telegram.org/bot$TOKEN/setWebhook" \
  -d "url=$URL/telegram" -d "secret_token=$SECRET"
```

开发完成后记得 `deleteWebhook`，让 `bot.start()` 重新可用。

## 8. 生产检查清单

- [ ] 公网 HTTPS + 有效证书（Telegram 拒绝自签名）
- [ ] `secret_token` 已设置且两端一致
- [ ] `max_connections` 已调整（默认 40）
- [ ] Body parser 上限 ≥ 1 MB（`express.json({ limit: "1mb" })` 等）
- [ ] 上游超时 > `handlerTimeout`（让 `UpdateTimeoutError` 先接管，而不是负载均衡器返回 504）
- [ ] 重新部署时考虑 `drop_pending_updates`
- [ ] 错误可观测：`bot.catch()` + `update:error`
- [ ] 优雅关机：退出前 `bot.stop()`

## 9. 故障排查

| 症状 | 原因 | 修复 |
|---|---|---|
| Telegram 一直超时（`getUpdates` 空转） | webhook 处于激活状态 —— Telegram 忽略轮询 | `deleteWebhook` 或改用处理器 |
| 每个请求都 401 | 处理器 secret ≠ 已注册的 `secret_token` | 两端改为一致 |
| 413 Payload Too Large | Body 超过 `maxBodyBytes`（默认 1 MB） | 调大 `maxBodyBytes` 与 body parser 上限 |
| 代理返回 502 | webhook 发送 `content-type: application/json` —— 代理拒绝 | 移除 content-type 改写；处理器接受 JSON |
| `getUpdates` 报 `409 Conflict` | webhook 仍注册着 | 先 `deleteWebhook` |
| 更新收到后挂起 | handler 在等待缓慢的网络调用 | 降低 `handlerTimeout`；通过 `update:error` 保证可观测 |
| Serverless：回复从未送达 | 单个 handler 里 await 过多 | 开启 `webhookReply`，让第一次调用搭响应的便车 |

English: [WEBHOOK.md](WEBHOOK.md) · Bahasa Indonesia: [WEBHOOK.id.md](WEBHOOK.id.md)
