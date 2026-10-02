---
title: 机器人配置
description: Constructor 选项、令牌管理与运行时设置。
---

# 机器人配置

通过 `new TeleBibz(token, options)` 的第二个参数传入配置。Constructor 会检查令牌格式；格式不正确时会抛出说明性错误。

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN, {
  allowedUpdates: ['message', 'callback_query'],
  silent: false,
  dropPending: false,
  onError: (err, ctx) => {
    console.error('更新处理失败：', err);
  },
  session: {
    initial: () => ({ visits: 0 }),
  },
});
```

| 选项 | 用途 |
| --- | --- |
| `allowedUpdates` | 限制长轮询请求的更新类型。默认值包含常用类型及当前版本支持的 Business 更新。 |
| `onError(err, ctx)` | 自定义错误报告函数。未设置时使用内置报告器；轮询错误可能没有 `ctx`。 |
| `silent` | 为 `true` 时隐藏启动横幅和启动日志。 |
| `dropPending` | 启动轮询时丢弃旧更新。也可通过 `launch({ dropPending: true })` 传入。 |
| `session` | 会话配置，例如 `initial`、`getKey` 和 `storage`。详见[会话指南](/zh/guide/files-sessions#会话)。 |
| `transport` | 自定义 `(method, payload) => Promise<result>` 传输函数，适用于测试或集成。 |
| `apiRoot` | Bot API 根 URL，例如本地 Bot API 服务器。 |
| `proxy` | Telegram 请求使用的 HTTP(S) 代理地址。 |
| `timeoutMs` | 传输请求超时时间，单位为毫秒。 |
| `headers` | 传输请求的附加请求头。 |

## 环境变量

从环境变量读取令牌。生产环境请使用托管平台的密钥设置或密钥管理器，不要把令牌写入已提交的文件。

```js
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('尚未设置 BOT_TOKEN');
const bot = new TeleBibz(token);
```

当前软件包使用 CommonJS，因此 JavaScript 示例采用 `require`。软件包附带 TypeScript 声明，详见 [TypeScript 指南](/zh/reference/typescript)。
