---
title: 实战 — 从零构建完整机器人
description: "分步实现：目录结构、配置、处理器、菜单、向导表单、会话、存储与部署。"
---

# 实战：从零构建完整机器人

本页把各部分串成一个真实项目：**在线商店机器人**，包含商品目录、购物车、下单向导、菜单、持久会话与部署方式。

## 1. 初始化

```bash
mkdir shop-bot && cd shop-bot
npm init -y
npm i @xbibzlibrary/telebibz
npm pkg set type=commonjs engines.node=">=20"
mkdir src
```

```js
// src/env.js
require('node:process').loadEnvFile?.('.env');
module.exports = {
  token: process.env.BOT_TOKEN,
  adminId: Number(process.env.ADMIN_ID),
  webhookUrl: process.env.WEBHOOK_URL,
  webhookSecret: process.env.WEBHOOK_SECRET,
};
```

## 2. 目录结构

```
shop-bot/src/
├── env.js            # 配置
├── bot.js            # 机器人实例 + 全局中间件
├── storage.js        # 会话存储（内存/Redis）
├── data/products.js  # 简易数据源
├── handlers/{index,start,catalog,orders}.js
├── menus.js
└── server.js         # 轮询或 webhook 入口
```

## 3. 数据与会话

```js
// src/data/products.js
const products = [{ id: 'coffee', name: '阿拉比卡 250g', price: 65000 }];
module.exports = {
  all: () => products,
  find: (id) => products.find((p) => p.id === id),
  money: (n) => 'IDR ' + n.toLocaleString('en-US'),
};
```

```js
// src/storage.js
function redisStorage(redis) {
  return {
    read: (k) => redis.get(`sess:${k}`).then((v) => (v ? JSON.parse(v) : undefined)),
    write: (k, v) => redis.set(`sess:${k}`, JSON.stringify(v), { EX: 86400 }),
    delete: (k) => redis.del(`sess:${k}`),
  };
}
module.exports = { redisStorage };
```

## 4. 机器人实例与全局中间件

```js
// src/bot.js
const { TeleBibz, session, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');
const env = require('./env');

const bot = new TeleBibz(env.token, {
  session: { initial: () => ({ cart: [] }), onlyWhenChanged: true },
  onError: (err, ctx) => console.error('[bot error]', err.message, ctx && ctx.update_id),
});

bot.api.config.use(autoRetry({ maxRetry: 3 }));
bot.api.config.use(throttler({ perSecond: 25 }));
bot.use(limiter({ windowMs: 3000, limit: 5 }));

module.exports = { bot };
```

## 5. 处理器：开始与目录

```js
// src/handlers/start.js
const { Keyboard } = require('@xbibzlibrary/telebibz');
module.exports = (bot) => {
  bot.start((ctx) => ctx.reply(`你好 ${ctx.from.first_name}！发送 /catalog 查看商品。`,
    new Keyboard().text('🛍 目录').text('🧺 购物车').resized().build()));
};

// src/handlers/catalog.js
const { btn, kb } = require('@xbibzlibrary/telebibz');
const db = require('../data/products');
module.exports = (bot) => {
  bot.cmd('catalog', (ctx) => ctx.reply('请选择商品：', {
    reply_markup: kb.markup(db.all().map((p) => [btn(`${p.name} — ${db.money(p.price)}`, `view:${p.id}`)])),
  }));
  bot.action(/^view:(.+)$/, (ctx) => ctx.answerCallbackQuery('已选择'));
};
```

## 6. 下单向导

```js
// src/handlers/orders.js
const { btn, kb } = require('@xbibzlibrary/telebibz');
const env = require('../env');

module.exports = (bot) => {
  bot.cmd('cart', (ctx) => ctx.reply('🧺 购物车', {
    reply_markup: kb.markup([[btn('✅ 结账', 'checkout', 'success')]]),
  }));

  bot.wizard('order', {
    steps: [
      { key: 'name', ask: '收件人姓名？', validate: (v) => (String(v).trim().length >= 2 ? null : '至少 2 个字符。') },
      { key: 'address', ask: '收货地址？', validate: (v) => (String(v).trim().length >= 10 ? null : '地址太短。') },
      { key: 'payment', ask: '支付方式？', buttons: ['银行转账', '货到付款', 'QRIS'], onlyButtons: true },
    ],
    async done(answers, ctx) {
      const id = 'INV-' + Date.now().toString(36).toUpperCase();
      await ctx.replyWithHTML(`<b>订单 ${id}</b>\n${answers.name}\n${answers.address}\n付款：${answers.payment}`);
      if (env.adminId) await bot.api.sendMessage(env.adminId, `🛒 ${id}`).catch(() => {});
    },
    cancelWords: ['/cancel', 'cancel'],
  });

  bot.action('checkout', (ctx) => { ctx.answerCallbackQuery(); return bot.wizardStart(ctx, 'order'); });
};
```

## 7. 组装

```js
// src/handlers/index.js
module.exports = (bot) => {
  require('./start')(bot);
  require('./catalog')(bot);
  require('./orders')(bot);
};
```

## 8. 轮询或 webhook

```js
// 轮询
const { bot } = require('./bot');
bot.launch();
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, async () => { bot.stop(); await bot.runPromise; process.exit(0); });
}
```

```js
// webhook（无需框架）
const http = require('node:http');
const { bot } = require('./bot');
const env = require('./env');
(async () => {
  await bot.init();
  await bot.api.setWebhook(env.webhookUrl, { secret_token: env.webhookSecret, max_connections: 40 });
  const handler = bot.webhook({ secretToken: env.webhookSecret, awaitProcessing: false, dedupe: true });
  http.createServer((req, res) => (req.url === '/telegram/webhook' ? handler(req, res) : res.writeHead(404).end()))
    .listen(process.env.PORT || 8080, '0.0.0.0');
})();
```

::: tip 二选一
不要同时使用 `getUpdates` 与 webhook，否则 Telegram 会返回 `409 Conflict`。Serverless 平台请设置 `awaitProcessing: true`。
:::

## 9. 无 token 测试

```js
const calls = [];
const bot = new TeleBibz('123456:TESTTOKEN', {
  silent: true,
  transport: async (method, payload) => { calls.push({ method, payload }); return true; },
});
bot.cmd('hello', (ctx) => ctx.reply('hi'));
await bot.handleUpdate({ update_id: 1, message: { message_id: 1, date: 1, from: { id: 2 }, chat: { id: 2, type: 'private' }, text: '/hello' } });
```

## 10. 上线前检查清单

- [ ] Token 只从环境变量读取
- [ ] `onError` 接入日志系统
- [ ] 多实例部署时使用外部会话存储
- [ ] 启用 `autoRetry()` 与 `throttler()`
- [ ] webhook 配置 `secret_token` 与 HTTPS
- [ ] 优雅关闭：`bot.stop()` + `await bot.runPromise` 或 `await bot.drainWebhook()`
- [ ] Node ≥ 20

另见：[部署](/zh/guide/deployment)、[生产模式](/zh/guide/production-patterns)、[发送消息](/zh/guide/sending-messages)。
