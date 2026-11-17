---
title: Case study — a complete bot from scratch
description: "Step by step implementation: folder structure, configuration, handlers, menus, wizard, session, storage, deployment."
---

# Case study: a complete bot from scratch

This page stitches everything together into one real project: an **online shop bot** with a catalogue, cart, order wizard, menus, persistent session, and deployment.

## 1. Project setup

```bash
mkdir shop-bot && cd shop-bot
npm init -y
npm i @xbibzlibrary/telebibz
npm pkg set type=commonjs engines.node=">=20"
mkdir src
```

`.env` (never commit):

```bash
BOT_TOKEN=123456:ABC-DEF...
ADMIN_ID=123456789
WEBHOOK_URL=https://example.com/telegram/webhook
WEBHOOK_SECRET=random_32_characters
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

## 2. A scalable folder structure

```
shop-bot/
├── src/
│   ├── env.js            # config + env validation
│   ├── bot.js            # bot instance + global middleware
│   ├── storage.js        # session storage (memory/Redis)
│   ├── data/products.js  # tiny "database"
│   ├── handlers/
│   │   ├── index.js
│   │   ├── start.js
│   │   ├── catalog.js
│   │   └── orders.js
│   ├── menus.js
│   └── server.js
└── package.json
```

One file = one responsibility; every handler module exports `(bot) => void` so it is easy to test and remove.

## 3. Data and storage

```js
// src/data/products.js
const products = [
  { id: 'coffee', name: 'Arabica 250g', price: 65000 },
  { id: 'tea',    name: 'Jasmine tea 100g', price: 35000 },
];
module.exports = {
  all: () => products,
  find: (id) => products.find((p) => p.id === id),
  money: (n) => 'IDR ' + n.toLocaleString('en-US'),
};
```

```js
// src/storage.js — bring your own Redis client
function redisStorage(redis) {
  return {
    read: (key) => redis.get(`sess:${key}`).then((v) => (v ? JSON.parse(v) : undefined)),
    write: (key, value) => redis.set(`sess:${key}`, JSON.stringify(value), { EX: 86400 }),
    delete: (key) => redis.del(`sess:${key}`),
  };
}
module.exports = { redisStorage };
```

## 4. Bot instance and global middleware

```js
// src/bot.js
const { TeleBibz, session, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');
const env = require('./env');

const bot = new TeleBibz(env.token, {
  session: {
    initial: () => ({ cart: [], step: null }),
    onlyWhenChanged: true,        // write only when the session actually changed
    // storage: require('./storage').redisStorage(redisClient),
  },
  onError: (err, ctx) => console.error('[bot error]', err.message, ctx && ctx.update_id),
});

bot.api.config.use(autoRetry({ maxRetry: 3 }));
bot.api.config.use(throttler({ perSecond: 25 }));
bot.use(limiter({ windowMs: 3000, limit: 5 }));

module.exports = { bot };
```

## 5. `/start` handler

```js
// src/handlers/start.js
const { Keyboard } = require('@xbibzlibrary/telebibz');

module.exports = (bot) => {
  bot.start((ctx) => ctx.reply(
    `Hi ${ctx.from.first_name}! Commands:\n/catalog\n/cart\n/order\n/help`,
    new Keyboard().text('🛍 Catalog').text('🧺 Cart').row().text('❓ Help').resized().build(),
  ));
  bot.cmd('help', (ctx) => ctx.replyWithHTML('<b>Help</b>\n/catalog — products\n/cart — your cart\n/order — checkout'));
};
```

## 6. Catalogue with inline buttons

```js
// src/handlers/catalog.js
const { btn, kb } = require('@xbibzlibrary/telebibz');
const db = require('../data/products');

module.exports = (bot) => {
  bot.cmd('catalog', (ctx) => {
    const rows = db.all().map((p) => [btn(`${p.name} — ${db.money(p.price)}`, `view:${p.id}`)]);
    return ctx.reply('Pick a product:', { reply_markup: kb.markup(rows) });
  });

  bot.action(/^view:(.+)$/, async (ctx) => {
    const p = db.find(ctx.callback_query.data.split(':')[1]);
    if (!p) return ctx.answerCallbackQuery('Not found');
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`${p.name}\nPrice: ${db.money(p.price)}`, {
      reply_markup: kb.markup([[btn('➕ Add to cart', `add:${p.id}`, 'success')], [btn('⬅️ Back', 'catalog')]]),
    });
  });

  bot.action(/^add:(.+)$/, async (ctx) => {
    const p = db.find(ctx.callback_query.data.split(':')[1]);
    ctx.session.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    await ctx.answerCallbackQuery(`${p.name} added`);
  });
};
```

## 7. Order wizard

```js
// src/handlers/orders.js
const { btn, kb } = require('@xbibzlibrary/telebibz');
const env = require('../env');
const db = require('../data/products');

const summary = (cart) => cart.map((i) => `${i.name} ×${i.qty}`).join('\n') +
  `\n\nTotal: ${db.money(cart.reduce((s, i) => s + i.price * i.qty, 0))}`;

module.exports = (bot) => {
  bot.cmd('cart', (ctx) => ctx.reply('🧺 Cart:\n\n' + (summary(ctx.session.cart) || 'empty'),
    { reply_markup: kb.markup([[btn('✅ Checkout', 'checkout', 'success')]]) }));

  bot.wizard('order', {
    steps: [
      { key: 'name', ask: 'Recipient name?', validate: (v) => (String(v).trim().length >= 2 ? null : 'Min 2 characters.') },
      { key: 'address', ask: 'Full shipping address?', validate: (v) => (String(v).trim().length >= 10 ? null : 'Too short.') },
      { key: 'phone', ask: 'Phone number?', validate: (v) => (/^(\+62|0)\d{8,13}$/.test(String(v).replace(/[\s-]/g, '')) ? null : 'Invalid number.') },
      { key: 'payment', ask: 'Payment method?', buttons: ['Bank transfer', 'COD', 'QRIS'], onlyButtons: true },
    ],
    async done(answers, ctx) {
      const cart = ctx.session.cart;
      if (!cart.length) return ctx.reply('Cart is empty — send /catalog first.');
      const id = 'INV-' + Date.now().toString(36).toUpperCase();
      await ctx.replyWithHTML(`<b>Order ${id}</b>\n${answers.name}\n${answers.address}\n${answers.phone}\nPay: ${answers.payment}\n\n${summary(cart)}`);
      if (env.adminId) {
        await bot.api.sendMessage(env.adminId, `🛒 ${id}\n${summary(cart)}`).catch(() => {});
      }
      ctx.session.cart = [];
    },
    onCancel: (ctx) => ctx.reply('Order cancelled.'),
    cancelWords: ['/cancel', 'cancel'],
  });

  bot.action('checkout', (ctx) => { ctx.answerCallbackQuery(); return bot.wizardStart(ctx, 'order'); });
};
```

## 8. Assembling everything

```js
// src/handlers/index.js
module.exports = (bot) => {
  require('./start')(bot);
  require('./catalog')(bot);
  require('./orders')(bot);
};
```

```js
// src/bot.js (continued)
require('./handlers')(bot);
bot.use(require('./menus')());
```

## 9. Long polling vs webhook

```js
// polling
const { bot } = require('./bot');
bot.launch();
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, async () => { bot.stop(); await bot.runPromise; process.exit(0); });
}
```

```js
// webhook (no framework needed)
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

::: tip Pick one delivery mode
Never run `getUpdates` and a webhook at the same time — Telegram answers `409 Conflict`. For serverless platforms set `awaitProcessing: true`.
:::

## 10. Testing without a token

```js
const assert = require('node:assert');
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const calls = [];
const bot = new TeleBibz('123456:TESTTOKEN', {
  silent: true,
  transport: async (method, payload) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 1, is_bot: true, username: 'testbot' };
    return true;
  },
});

bot.cmd('hello', (ctx) => ctx.reply('hi'));
await bot.handleUpdate({ update_id: 1, message: { message_id: 1, date: 1, from: { id: 2 }, chat: { id: 2, type: 'private' }, text: '/hello' } });
assert.equal(calls.at(-1).payload.text, 'hi');
```

## 11. Pre-production checklist

- [ ] Token only from env, never logged
- [ ] `onError` wired to a logger
- [ ] External session storage when running more than one instance
- [ ] `autoRetry()` + `throttler()` enabled
- [ ] Webhook: `secret_token` set, HTTPS URL, right `awaitProcessing` for the platform
- [ ] Graceful shutdown: `bot.stop()` + `await bot.runPromise`, or `await bot.drainWebhook()`
- [ ] Node ≥ 20
- [ ] Light load test in a test group, verify 429 handling

See also: [Polling and webhooks](/en/guide/deployment), [Production operations](/en/guide/production-patterns), [Sending messages](/en/guide/sending-messages).
