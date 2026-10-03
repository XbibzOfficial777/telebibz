---
title: 自定义传输与测试
description: 使用模拟传输测试处理器、重放更新并配置 API 请求。
---

# 自定义传输与测试

自定义传输可让测试或特殊部署拦截 API 调用。它接收方法名和 payload，并应返回接口结果本身，而不是 Telegram 的 `{ ok, result }` 包装对象。

## 使用模拟传输测试处理器

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const calls = [];
const bot = new TeleBibz('123456:TEST_TOKEN_VALUE', {
  silent: true,
  transport: async (method, payload) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 123456, is_bot: true, first_name: 'Test' };
    if (method === 'sendMessage') return { message_id: 1, chat: { id: payload.chat_id } };
    return true;
  },
});

bot.cmd('start', (ctx) => ctx.reply('你好'));

await bot.init();
await bot.handleUpdate({
  update_id: 1,
  message: {
    message_id: 10,
    date: 1,
    chat: { id: 42, type: 'private' },
    from: { id: 42, is_bot: false, first_name: 'Test' },
    text: '/start',
  },
});

console.log(calls.find((call) => call.method === 'sendMessage'));
```

测试时请使用非生产环境的令牌格式值。自定义传输可以阻止真实 API 请求，但测试样本中也不应包含真实用户数据。建议检查发出的接口方法和 payload；除非调用顺序本身属于预期行为，否则不要断言内部调用顺序。

## 使用 `handleUpdate()` 重放测试样本

`bot.handleUpdate(update)` 可在不启动长轮询的情况下，将更新传入机器人的中间件和处理器。它适用于确定性测试、集成测试或自定义 Webhook 适配器。此方法不会验证输入；调用前应检查 Telegram 密钥请求头。

## 内置传输选项

Constructor 支持 `transport`、`apiRoot`、`proxy`、`timeoutMs` 和附加 `headers`。`apiRoot` 可指向本地 Bot API 服务器。若要显式使用这些选项创建 transport，可调用 `createTransport`：

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
const transport = createTransport(token, {
  apiRoot: 'https://api.telegram.org',
  proxy: process.env.HTTPS_PROXY,
  timeoutMs: 30_000,
  headers: { 'x-client-name': 'telebibz-app' },
});
const bot = new TeleBibz(token, { transport });
```

`createTransport(token, options)` 也可通过 `apiRoot` 指向本地 Bot API 服务。请分开管理测试与生产凭据，并避免记录授权请求头。

## 代理

必要时可将 `proxy` 设为 HTTP(S) 代理地址。请确认运行环境能够解析代理且出站 TLS 配置正确。代理凭据应存放在平台密钥中。

```js
const { TeleBibz, createTransport } = require('@xbibzlibrary/telebibz');
const token = process.env.BOT_TOKEN;
const bot = new TeleBibz(token, {
  transport: createTransport(token, {
    proxy: process.env.HTTPS_PROXY,
  }),
});
```

不要将代理凭据写入代码。请存入托管平台的 Secret，并限制访问权限。

## 用 Transformer 处理中间 API 请求

API transformer 可包装 Bot API 请求，用于重试、限流、日志或修改请求：

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');

bot.api.config.use(autoRetry());
bot.api.config.use(throttler());
```

请保持 transformer 职责清晰，并保留 Telegram 响应与错误语义。详见[速率限制与错误](/zh/guide/reliability)。
