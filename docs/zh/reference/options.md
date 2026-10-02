---
title: 机器人选项
description: Constructor 选项、生命周期方法、会话与传输设置。
---

# 机器人选项

## Constructor

**签名：** `new TeleBibz(token, options?)`

| 选项 | 类型（摘要） | 默认值或说明 |
| --- | --- | --- |
| `allowedUpdates` | `string[]` | 轮询请求的更新类型；默认包含常见类型和当前版本支持的 Business 更新。 |
| `onError` | `(err, ctx?) => unknown` | 未设置时使用内置报告器。处理器之外的错误可能没有 Context。 |
| `silent` | `boolean` | 默认 `false`；隐藏启动横幅和日志。启用后内置信号处理器也不会安装，需自行处理关闭。 |
| `dropPending` | `boolean` | 默认 `false`；可由 `launch()` 选项覆盖。 |
| `session` | `SessionOptions` | 默认使用内存 `Map`，初始状态为空对象。 |
| `transport` | `(method, payload?) => Promise<unknown>` | 用于测试或集成的自定义传输；返回接口结果，不是 `{ ok, result }`。 |
| `apiRoot` | `string` | Bot API 根地址，可指向本地 Bot API 服务器。 |
| `proxy` | `string` | 所需的 HTTP(S) 代理地址。 |
| `timeoutMs` | `number` | 传输请求超时毫秒数。 |
| `headers` | `Record<string, string>` | 传输请求的附加请求头。 |

`SessionOptions` 接受 `initial()`、`getKey(ctx)` 和 `storage`。存储可以是 `Map`，也可以是提供 `read(key)`、`write(key, value)` 和 `delete(key)` 的适配器；这些方法可为异步函数。详见[文件与会话](/zh/guide/files-sessions#会话)。

## 生命周期

| API | 用途 |
| --- | --- |
| `await bot.init()` | 调用 `getMe()` 并加载机器人身份；`launch()` 也会完成初始化。 |
| `await bot.launch(options?)` | 启动长轮询，并在启动后返回。 |
| `await bot.handleUpdate(update)` | 将单个更新传入处理管线，不启动轮询器。 |
| `bot.webhook(options?)` | 创建 Node.js HTTP 处理器；接受 `secretToken` 与 `maxBodyBytes`。 |
| `bot.stop()` | 请求停止长轮询循环。 |
| `await bot.runPromise` | 在受控关闭期间等待轮询结束。 |

轮询选项包括 `dropPending`、`conflictDelay`（毫秒，默认 5,000）和 `noSignalHandlers`。请在 Constructor 中设置 `allowedUpdates`。若使用 `silent: true` 或禁用信号处理器，请自行处理 `SIGINT` 与 `SIGTERM`，调用 `bot.stop()` 并等待 `bot.runPromise`。

同一机器人令牌不要同时运行轮询和 Webhook。详见[轮询与 Webhook](/zh/guide/deployment)。

## 注册方法

机器人实例提供 `use`、`cmd`、`start`、`hears`、`on`、`action`、`inlineQuery`、`wizard` 和 `broadcast`。组合器说明见[中间件与 Composer](/zh/guide/middleware)，处理器示例见[处理器与过滤器](/zh/guide/handlers)。
