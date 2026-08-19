# telebibz API 参考 — 简体中文

[English](API.md) · [Bahasa Indonesia](API.id.md) · **简体中文**

![telebibz 概览](https://raw.githubusercontent.com/XbibzOfficial777/telebibz/main/assets/telebibz-readme-preview.png)

本文件是 `@xbibzlibrary/telebibz@0.1.4` 的 API 参考。此处描述的所有签名和行为均映射自该包导出的 TypeScript 源代码。如果某个 Telegram 类型尚未有特定的参数/结果映射，该包仍通过动态 API 提供运行时访问，但其参数类型仍为通用类型。

> **实现状态。** 本文档说明当前版本中可用的功能。`JsonFileStorage`、基于 driver 的 Redis/SQL/Mongo storage、基于 Storage 的 session/conversation、完整五字段 cron、`MenuController`、带 branding 的 approval message、带 redaction 的 structured logging、Web App 验证、`PaymentsClient` 和 `TelegramTypes` declaration 均已提供。core method map 仍主要为特定 request/result inference 提供类型，未来 Telegram method 可通过 `api.raw()` 访问。

## 安装与导入

```bash
npm install @xbibzlibrary/telebibz
```

ESM：

```ts
import {
  Bot,
  InlineKeyboard,
  compose,
  escapeHtml,
  type Context,
} from "@xbibzlibrary/telebibz";
```

CommonJS：

```js
const { Bot, InlineKeyboard } = require("@xbibzlibrary/telebibz");
```

可用的子路径导出如下：

| 子路径 | 内容 |
|---|---|
| `@xbibzlibrary/telebibz` | 来自 `src/index.ts` 的全部主要公共 API |
| `@xbibzlibrary/telebibz/api` | Client、transport、errors，以及所有 Telegram API 类型 |
| `@xbibzlibrary/telebibz/keyboard` | `InlineKeyboard`、`ReplyKeyboard` 以及键盘辅助函数 |
| `@xbibzlibrary/telebibz/testing` | `MockTransport` 以及测试工厂 |

---

## 1. 核心 Bot

### `BotStatus`

```ts
type BotStatus =
  | "created"
  | "initialized"
  | "awaiting-approval"
  | "starting"
  | "running"
  | "stopping"
  | "stopped"
  | "error";
```

### `BotOptions<S>`

| 属性 | 类型 | 默认 | 说明 |
|---|---|---:|---|
| `token` | `string` | 必需 | Token BotFather dengan format `<digits>:<token>`. |
| `apiBaseUrl` | `string` | `https://api.telegram.org` | Telegram API 的基础 URL。结尾的 `/` 会被自动移除。 |
| `transport` | `Transport` | `FetchTransport` | 用于 mock、proxy 或其他实现的自定义 transport。 |
| `transportOptions` | `Omit<FetchTransportOptions, "baseUrl">` | `{}` | 超时、重试、退避、jitter、headers 和 fetch 实现。 |
| `session` | `Storage<string, S>` | 新的存储 | 基于 chat/user key 的会话存储，可使用持久化适配器。 |
| `services` | `Record<string, unknown>` | `{}` | 通过 `ctx.services` 可用的依赖/服务。 |
| `polling.timeout` | `number` | `30` | 用于 `getUpdates` 的长轮询超时（秒）。 |
| `polling.limit` | `number` | `100` | 每次轮询请求的最大 update 数量。 |
| `polling.allowedUpdates` | `string[]` | `[]` | Telegram 更新过滤器。 |
| `polling.retryDelayMs` | `number` | `500` | 轮询失败时的初始延迟（毫秒）。 |
| `polling.maxRetryDelayMs` | `number` | `30000` | 重连延迟的最大值（毫秒）。 |
| `approval` | `ApprovalOptions` | disabled | 启用所有者审批门。 |

### `Bot` constructor

```ts
new Bot<S extends object = Record<string, unknown>>(
  options: string | BotOptions<S>,
): Bot<S>
```

Jika argumen berupa string, string tersebut dianggap sebagai token. Constructor membuat `ApiClient`, router, event bus, plugin manager, session storage, dan approval gate bila dikonfigurasi. Constructor langsung memancarkan event `bot:created` secara asynchronous.

Constructor melempar `Error` jika token kosong atau tidak sesuai pola token Telegram.

### `Bot` 的属性和 getter

| API | 类型 | 描述 |
|---|---|---|
| `api` | `ApiClient` | 类型化/动态的 Telegram 客户端。 |
| `router` | `Router<Context<S>>` | bot 的主路由器。 |
| `events` | `EventBus<EventMap>` | 生命周期、update、API、webhook 和 polling 的事件总线。 |
| `plugins` | `PluginManager<Context<S>>` | 插件的生命周期管理器。 |
| `session` | `Storage<string, S>` | bot 的会话存储，可使用持久化适配器。 |
| `services` | `Record<string, unknown>` | 构造函数提供的 service 的拷贝。 |
| `approval` | `ApprovalGate \| undefined` | 如果配置了 `approval` 则为 Approval gate。 |
| `token` | `string` | 客户端使用的 bot token。 |
| `status` | `BotStatus` | 当前生命周期状态。 |
| `botInfo` | `User \| undefined` | 最近一次 `getMe()` 的结果。 |

### `bot.use(...middleware)`

```ts
use(...middleware: Middleware<Context<S>>[]): this
```

添加全局 middleware。middleware 在每个 update 的 router 之前执行，按注册顺序。返回 bot 实例以便链式调用。

### `bot.command(name, handler)`

```ts
command(name: string, handler: Middleware<Context<S>>): this
```

注册 Telegram 命令，可带或不带前导 `/`。匹配时取 `/` 之后的第一个 token，并忽略 `@` 后的 bot mention。例如 `/start@my_bot` 会匹配 `"start"`。

### `bot.callback(pattern, handler)`

```ts
callback(pattern: string | RegExp, handler: Middleware<Context<S>>): this
```

callback query 路由的快捷方式。以 `*` 结尾的字符串表示前缀匹配；其他字符串必须完全相等。

### `bot.onText(text, handler)`

```ts
onText(text: string, handler: Middleware<Context<S>>): this
```

处理 `message.text` 与 `text` 完全相同的消息。

### `bot.onRegex(expression, handler)`

```ts
onRegex(expression: RegExp, handler: Middleware<Context<S>>): this
```

使用 `RegExp` 处理消息文本。路由参数不会自动提取到 `ctx.params`；如需提取请使用 predicate 或自定义 middleware。

### `bot.usePlugin(plugin)`

```ts
usePlugin(plugin: Plugin<Context<S>>): this
```

注册插件。插件名称必须唯一。

### `bot.init()`

```ts
init(): Promise<this>
```

调用 `getMe()`，保存 bot 信息，若 approval gate 启用则处理它，然后运行插件生命周期的 `setup()` 和 `start()`。

若尚未获得批准，方法会将状态置为 `"awaiting-approval"`，通过 `ApprovalGate` 向 owner 发送通知，并返回 bot 而不设置为 `initialized`。在 owner 批准后后续调用仍可使用。

`init()` 在状态已为 `initialized` 或 `running` 时是幂等的。

### `bot.start()`

```ts
start(): Promise<void>
```

是 `launch({ mode: "polling" })` 的快捷方式。此方法开始 long polling 并等待直到轮询被停止或发生致命错误。

### `bot.launch(options?)`

```ts
launch(options?: {
  mode: "polling";
  timeout?: number;
  allowedUpdates?: string[];
}): Promise<void>
```

以 polling 模式运行 bot。启动时生命周期依次变为 `starting` 然后 `running`，之后 `getUpdates()` 循环按顺序处理每个 update。轮询失败会触发 `polling:reconnect` 并使用指数退避。

除 `"polling"` 外的模式会抛出错误，并建议对 webhook 使用 `createWebhookHandler()`。

### `bot.stop()`

```ts
stop(): Promise<void>
```

通过 `AbortController` 停止轮询，调用 `plugins.dispose()`，将状态设置为 `stopped`，并触发 stopping/stopped 事件。当状态为 `created` 或 `stopped` 时调用不会有任何效果。

### `bot.restart()`

```ts
restart(): Promise<void>
```

先运行 `stop()` 然后 `start()`。

### `bot.health()`

```ts
health(): Promise<HealthStatus>
```

调用 `getMe()` 检查 API 可达性。请求失败不会抛出错误；失败会以 `apiReachable: false` 和错误信息的形式返回。

```ts
interface HealthStatus {
  status: BotStatus;
  apiReachable: boolean;
  bot?: User;
  checkedAt: string; // ISO timestamp
  error?: string;
}
```

### `bot.getMe()`

```ts
getMe(): Promise<User>
```

从 Telegram 获取 bot 数据并更新 `botInfo`。

### `bot.setCommands(commands, scope?, languageCode?)`

```ts
setCommands(
  commands: BotCommand[],
  scope?: BotCommandScope,
  languageCode?: string,
): Promise<true>
```

相当于 `setMyCommands` 的快捷方式。`languageCode` 会映射为 Telegram 的 `language_code` 字段。

### `bot.deleteCommands(scope?, languageCode?)`

```ts
deleteCommands(
  scope?: BotCommandScope,
  languageCode?: string,
): Promise<true>
```

相当于 `deleteMyCommands` 的快捷方式。

### `bot.handleUpdate(update)`

```ts
handleUpdate(update: Update): Promise<void>
```

手动处理单个 update。该方法根据 `chat.id` 和 `from.id` 确定会话 key，创建 `Context`，触发 `update` 和 `message` 事件，执行 middleware 然后路由器，并在流水线完成后保存会话。

若启用了 approval 且 bot 尚未被允许，普通 update 会被阻止。approval 的 callback 仍会转发到 `ApprovalGate.handleCallback()`。

流水线错误会将 bot 状态置为 `error`，触发 `bot:error`，然后重新抛出错误。

### 最小 bot 示例

```ts
import { Bot, InlineKeyboard } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  polling: { allowedUpdates: ["message", "callback_query"] },
});

bot.command("start", async (ctx) => {
  await ctx.reply("来自 telebibz 的问候", {
    reply_markup: new InlineKeyboard()
      .text("状态", "status")
      .build(),
  });
});

bot.callback("status", async (ctx) => {
  await ctx.answerCallbackQuery("机器人已激活");
  await ctx.reply("状态：running");
});

await bot.start();
```

---

## 2. 事件总线

### `EventMap`

| 事件 | 负载 |
|---|---|
| `bot:created` | `{ bot: unknown }` |
| `bot:initialized` | `{ bot: unknown }` |
| `bot:starting` | `{ bot: unknown }` |
| `bot:started` | `{ bot: unknown }` |
| `bot:stopping` | `{ bot: unknown }` |
| `bot:stopped` | `{ bot: unknown }` |
| `bot:error` | `{ bot: unknown; error: unknown }` |
| `update` | `{ update: unknown }` |
| `message` | `{ message: unknown }` |
| `command` | `{ name: string; update: unknown }` |
| `callback` | `{ data: string; update: unknown }` |
| `api:request` | `{ method: string; payload: unknown }` |
| `api:response` | `{ method: string; durationMs: number; response: unknown }` |
| `api:error` | `{ method: string; durationMs: number; error: unknown }` |
| `webhook:request` | `{ update: unknown }` |
| `polling:reconnect` | `{ error: unknown; attempt: number }` |

### `EventBus<Events>`

```ts
new EventBus<Events extends Record<string, unknown> = EventMap>()
```

| 方法 | 签名 | 行为 |
|---|---|---|
| `on` | `on<K>(event: K, listener: (payload: Events[K]) => void \| Promise<void>): () => void` | 添加监听器并返回取消订阅函数。 |
| `once` | `once<K>(event: K, listener: ...): () => void` | 监听器仅调用一次，然后被移除。 |
| `off` | `off<K>(event: K, listener: ...): void` | 移除指定的监听器。 |
| `emit` | `emit<K>(event: K, payload: Events[K]): Promise<void>` | 依次调用监听器并等待每个完成。 |
| `removeAllListeners` | `removeAllListeners(): void` | 移除所有监听器。 |
| `listenerCount` | `listenerCount<K>(event: K): number` | 返回事件的监听器数量。 |

```ts
const unsubscribe = bot.events.on("bot:error", ({ error }) => {
  console.error(error);
});
unsubscribe();
```

---

## 3. API 客户端、传输 与 错误

### 基本类型

```ts
type ChatId = number | string;
type ParseMode = "Markdown" | "MarkdownV2" | "HTML";
type InputFile =
  | string
  | Uint8Array
  | ArrayBuffer
  | Blob
  | NodeJS.ReadableStream
  | { source: string | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream; filename?: string };
```

`InputFile` string 可以是普通字符串，或在作为 upload 对象中的 `source` 时为文件路径。在 Node.js 中，绝对路径、`./...` 和 `../...` 会被 `FetchTransport` 读取，然后作为 multipart 文件发送。

### `TelegramResponse<T>`

```ts
interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: ResponseParameters;
}
```

### `TransportRequest`, `TransportResponse`, 和 `Transport`

```ts
interface TransportRequest {
  method: string;
  payload?: Record<string, unknown>;
  signal?: AbortSignal;
}

interface TransportResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: TelegramResponse<T>;
}

interface Transport {
  request<T>(request: TransportRequest): Promise<TransportResponse<T>>;
}
```

### `FetchTransportOptions`

| 属性 | 默认 | 描述 |
|---|---:|---|
| `baseUrl` | `https://api.telegram.org` | 在 `/<method>` 之前的 URL 前缀。 |
| `fetch` | `globalThis.fetch` | 自定义 fetch 实现。 |
| `timeoutMs` | `30000` | 每次尝试的超时（毫秒）。 |
| `retries` | `2` | 初始尝试后的网络错误重试次数。 |
| `backoffMs` | `250` | 初始指数退避延迟（毫秒）。 |
| `maxBackoffMs` | `8000` | 传输延迟上限（毫秒）。 |
| `jitter` | `0.2` | 对指数延迟的随机抖动，范围为 ±20%。 |
| `headers` | `{}` | 额外的请求头。 |

### `new FetchTransport(options?)`

```ts
new FetchTransport(options?: FetchTransportOptions): FetchTransport
```

内置的 transport 基于 `fetch`。不含上传的 payload 会以 JSON 发送。包含 `Uint8Array`、`ArrayBuffer`、`Blob` 或嵌套上传的 payload 会使用 `FormData` 作为 `multipart/form-data` 发送。

### `fetchTransport.request(request)`

```ts
request<T>(request: TransportRequest): Promise<TransportResponse<T>>
```

发送 POST 到 `${baseUrl}/${method}`。以 `/` 开头的 method 会被正规化。外部的 AbortSignal 会转发到内部的 controller。被判定为可重试的网络错误会按指数退避并加抖动进行重试；当重试耗尽时，错误会被封装为 `TelegramNetworkError`。

### `ApiHookContext`, `ApiClientOptions`, dan `ApiMethods`

```ts
interface ApiHookContext {
  method: string;
  payload: unknown;
  startedAt: number;
  durationMs?: number;
  response?: TelegramResponse<unknown>;
  error?: unknown;
}

interface ApiClientOptions {
  transport: Transport;
  hooks?: {
    onRequest?: (context: ApiHookContext) => void | Promise<void>;
    onResponse?: (context: ApiHookContext) => void | Promise<void>;
    onError?: (context: ApiHookContext) => void | Promise<void>;
  };
}
```

`ApiMethods` 是基于 184 个 `TelegramMethodName` 的映射类型：

```ts
type ApiMethods = {
  [M in TelegramMethodName]:
    (...args: ApiCallArgs<M>) => Promise<ApiResult<M>>;
};
```

### `new ApiClient(options)`

```ts
new ApiClient(options: ApiClientOptions): ApiClient
```

在 `client.methods` 上创建动态方法代理。Hook `onRequest` 在调用 transport 之前触发，`onResponse` 在收到响应后触发，`onError` 在请求失败或 Telegram 返回 `ok: false` 时触发。

### `api.methods.<method>(params?)`

动态方法可以直接调用。无参数的方法（如 `getMe()`）无需传入参数；其他方法接受单个对象参数。

```ts
const me = await bot.api.methods.getMe();
const chat = await bot.api.methods.getChat({ chat_id: "@channel" });
const message = await bot.api.methods.sendMessage({
  chat_id: 123456789,
  text: "你好",
});
```

### `api.call(method, ...args)`

```ts
call<M extends TelegramMethodName>(
  method: M,
  ...args: ApiCallArgs<M>
): Promise<ApiResult<M>>
```

用于基于字符串字面量调用方法的类型化形式。

### `api.request(method, payload?, signal?)`

```ts
request<M extends TelegramMethodName>(
  method: M,
  payload?: ApiParams<M>,
  signal?: AbortSignal,
): Promise<ApiResult<M>>
```

低层请求方法，允许显式传入 `AbortSignal`。

### `api.raw(method, payload?, signal?)`

```ts
raw(
  method: string,
  payload?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<unknown>
```

在 transport 上调用任意字符串方法。用于调用尚未包含在 `TelegramMethodMap` 的新的 Telegram 方法或参数。即使响应为 `ok: false`，也会被转换为 `TelegramError`。

### 可用的类型化参数和返回值

以下类型在此发布版本中已被映射：

| 方法 | 参数 | 返回值 |
|---|---|---|
| `getMe` | 无 | `User` |
| `getUpdates` | `GetUpdatesParams` | `Update[]` |
| `setWebhook` | `SetWebhookParams` | `boolean` |
| `deleteWebhook` | `{ drop_pending_updates?: boolean }` | `boolean` |
| `getWebhookInfo` | 无 | `WebhookInfo` |
| `sendMessage` | `SendMessageParams` | `Message` |
| `editMessageText` | `EditMessageTextParams` | `Message \| true` |
| `deleteMessage` | `DeleteMessageParams` | `true` |
| `answerCallbackQuery` | `AnswerCallbackQueryParams` | `true` |
| `getChat` | `GetChatParams` | `Chat` |
| `getFile` | `GetFileParams` | `File` |
| `getUserProfilePhotos` | `{ user_id: number; offset?: number; limit?: number }` | `UserProfilePhotos` |
| `sendPhoto` | `SendPhotoParams` | `Message` |
| `sendDocument` | `SendDocumentParams` | `Message` |

可用的附加参数类型包括 `ReplyParameters`、`LinkPreviewOptions`、`InlineKeyboardButton`、`ReplyMarkup`、`BotCommand`、`BotCommandScope`，以及从 `api/types.ts` 导出的所有 Telegram update 类型。

### API 错误

```ts
type TelegramErrorKind =
  | "retryable"
  | "rate-limit"
  | "authentication"
  | "validation"
  | "network"
  | "server"
  | "unknown";
```

#### `TelegramError`

```ts
new TelegramError(message: string, options: {
  method: string;
  payload: unknown;
  errorCode?: number;
  parameters?: ResponseParameters;
  status?: number;
  kind?: TelegramErrorKind;
  cause?: unknown;
})
```

公开属性有 `kind`、`errorCode`、`parameters`、`method`、`payload` 和 `status`。Getter `retryAfter` 读取 `parameters.retry_after`；getter `migrateToChatId` 读取 `parameters.migrate_to_chat_id`。

#### 错误子类

| 类 | `name` | 强制的 `kind` |
|---|---|---|
| `TelegramRateLimitError` | `TelegramRateLimitError` | `rate-limit` |
| `TelegramAuthError` | `TelegramAuthError` | `authentication` |
| `TelegramValidationError` | `TelegramValidationError` | `validation` |
| `TelegramNetworkError` | `TelegramNetworkError` | `network` |

这四个子类使用与 `TelegramError` 相同的构造器选项。

#### `classifyTelegramError(errorCode?, status?)`

```ts
classifyTelegramError(
  errorCode?: number,
  status?: number,
): TelegramErrorKind
```

实际分类：`429` 映射为 `rate-limit`；错误 `401` 或 HTTP `401/403` 映射为 `authentication`；错误代码 `400–499` 映射为 `validation`；HTTP `500+` 映射为 `server`；其他为 `unknown`。

#### `telegramErrorFromResponse(response, context)`

```ts
telegramErrorFromResponse<T>(
  response: TelegramResponse<T>,
  context: { method: string; payload: unknown; status?: number },
): TelegramError
```

将失败的 Telegram 响应转换为相应的子类。`429`、认证和验证错误会产生相应的子类；其他错误会生成普通的 `TelegramError`。

---

## 4. 上下文

### `ContextOptions<S>`

```ts
interface ContextOptions<S extends object = Record<string, unknown>> {
  update: Update;
  api: ApiClient;
  session: S;
  services: Record<string, unknown>;
}
```

### `Context<S>` 属性

| 属性 | 内容 |
|---|---|
| `update` | Telegram 的原始 Update. |
| `api` | 机器人 `ApiClient`. |
| `session` | 当前 update key 的可变 session 对象. |
| `state` | 每个上下文的临时对象，不会自动保存到 session. |
| `services` | 通过 `BotOptions.services` 提供的服务. |
| `params` | 路由参数对象；内置路由器目前不会自动填充. |
| `message` | 来自 message/edited/channel/business/guest 更新的主要 message. |
| `chat` | 若可用则为 `message.chat`. |
| `from` / `sender` | 来自 message、callback query 或 inline query 的用户. |
| `callbackQuery` | `update.callback_query`. |
| `inlineQuery` | `update.inline_query`. |
| `poll` | `update.poll`. |
| `pollAnswer` | `update.poll_answer`. |
| `chatMember` | `update.chat_member`. |
| `myChatMember` | `update.my_chat_member`. |
| `chatJoinRequest` | `update.chat_join_request`. |
| `reaction` | `update.message_reaction`. |
| `boost` | `chat_boost` 或 `removed_chat_boost`. |

### `new Context(options)`

```ts
new Context<S>(options: ContextOptions<S>): Context<S>
```

### Context 消息方法

| 方法 | 签名 | 行为 |
|---|---|---|
| `reply` | `reply(text, extra?): Promise<Message>` | 将消息发送到更新的聊天，并在存在消息时设置 `reply_parameters.message_id`. |
| `send` | `send(text, extra?): Promise<Message>` | 向更新的聊天发送消息，不带回复引用. |
| `edit` | `edit(text, extra?): Promise<Message \| true>` | 使用 `editMessageText` 编辑更新的消息. |
| `delete` | `delete(): Promise<true>` | 删除更新的消息. |
| `copy` | `copy(fromChatId, messageId, extra?): Promise<unknown>` | 向上下文聊天调用 `copyMessage`. |
| `forward` | `forward(fromChatId, messageId, extra?): Promise<Message>` | 向上下文聊天调用 `forwardMessage`. |
| `pin` | `pin(messageId?, extra?): Promise<true>` | 调用 `pinChatMessage`，默认消息 ID 来自上下文. |
| `unpin` | `unpin(messageId?, extra?): Promise<true>` | 调用 `unpinChatMessage`，默认消息 ID 来自上下文. |
| `react` | `react(reaction, extra?): Promise<true>` | 调用 `setMessageReaction`. |
| `answerCallbackQuery` | `answerCallbackQuery(text?, extra?): Promise<true>` | 回答活动的回调查询。如果不是回调更新则抛出错误. |
| `answerInlineQuery` | `answerInlineQuery(results, extra?): Promise<true>` | 回答活动的内联查询。如果不是内联更新则抛出错误. |
| `getChat` | `getChat(): Promise<Chat>` | 获取上下文聊天的详细信息. |
| `getUserProfilePhotos` | `getUserProfilePhotos(userId?, extra?): Promise<unknown>` | 获取上下文用户的头像照片. |
| `getFile` | `getFile(fileId): Promise<unknown>` | 根据 ID 获取文件. |
| `withReplyMarkup` | `withReplyMarkup(markup): this` | 将标记保存到 `ctx.state.reply_markup` 并返回上下文。此方法不会自动发送消息. |

`reply`、`send`、`getChat` 以及其他一些辅助方法在更新缺少所需聊天时会抛出错误。`edit` 和 `delete` 需要同时有聊天和消息。

---

## 5. 中间件与路由器

### Middleware types

```ts
type Next = () => Promise<void>;
type Middleware<Context> = (ctx: Context, next: Next) => void | Promise<void>;
```

以洋葱模型（onion pattern）组合中间件。`next()` 会执行下一个中间件。如果同一个中间件多次调用 `next()`，`compose` 会抛出 `Error("next() called multiple times")`。

### `middleware(handler)`

```ts
middleware<Context>(handler: Middleware<Context>): Middleware<Context>
```

用于为中间件提供注解/类型推导的标识辅助函数。

### `RoutableContext`

路由器所需的最小上下文：`update`、`message`、`callbackQuery` 和 `params`。

### `Router<Context>`

```ts
new Router<Context extends RoutableContext>(): Router<Context>
```

路由按照优先级和注册顺序处理。匹配的路由不会自动阻止后续路由；所有匹配的路由都可以被执行。如果没有任何路由匹配，则在 `handle` 上的 `terminal` 会被调用。

| 方法 | 签名 | 匹配 |
|---|---|---|
| `use` | `use(...middleware): this` | 全局路由中间件，具有最高优先级，先执行。 |
| `route` | `route(matcher, ...middleware): this` | 布尔或异步的自定义匹配器。 |
| `command` | `command(name: string \| RegExp, ...middleware): this` | 以 `/` 开头的消息文本的第一个命令。 |
| `text` | `text(value: string, ...middleware): this` | 精确文本匹配。 |
| `regex` | `regex(expression: RegExp, ...middleware): this` | 对消息文本或空字符串使用 `RegExp.test`。 |
| `callback` | `callback(pattern: string \| RegExp, ...middleware): this` | 对 callback 数据进行精确匹配、以 `*` 结尾作为前缀匹配，或使用正则匹配。 |
| `chat` | `chat(chatId: number \| string, ...middleware): this` | 匹配 `message.chat.id`，数值或字符串等价。 |
| `predicate` | `predicate(matcher, ...middleware): this` | 自定义 matcher 的语义别名。 |
| `nest` | `nest(child: Router<Context>): this` | 将子路由作为嵌套路由运行。 |
| `handle` | `handle(ctx, terminal?): Promise<void>` | 评估并执行所有匹配的路由。 |

```ts
const router = new Router<Context>();
router.use(async (ctx, next) => {
  console.log("before");
  await next();
});
router.callback("page:*", async (ctx) => {
  await ctx.answerCallbackQuery();
});
router.predicate((ctx) => Boolean(ctx.from?.id), async (ctx) => {
  await ctx.reply("Authenticated update");
});
```

**RegExp 注意事项。** 路由器直接调用 `.test()`。对于带有 `g` 或 `y` 标志的表达式，JavaScript 中有状态的 `lastIndex` 可能会影响重复匹配。

---

## 6. Keyboard builders

### `InlineKeyboard`

```ts
new InlineKeyboard(): InlineKeyboard
InlineKeyboard.from(rows: InlineKeyboardButton[][]): InlineKeyboard
```

构建器以可变方式保存 `rows`，并且所有构建器方法都返回 `this`。

| Method | Signature | 描述 |
|---|---|---|
| `from` | `static from(rows): InlineKeyboard` | 从 `rows` 创建键盘并复制每一行。 |
| `text` | `text(text, callbackData): this` | 回调按钮。 |
| `url` | `url(text, url): this` | URL 按钮。 |
| `webApp` | `webApp(text, url): this` | Web 应用按钮。 |
| `pay` | `pay(text = "Pay"): this` | 支付按钮。 |
| `copy` | `copy(text, copiedText): this` | 复制文本按钮。 |
| `button` | `button(button): this` | 将一个按钮添加到最后一行，或创建第一行。 |
| `row` | `row(...buttons): this` | 添加新行。 |
| `conditional` | `conditional(condition, factory): this` | 仅当 condition 为 true 时执行 factory。 |
| `grid` | `grid(buttons, columns): this` | 将按钮按列数分配到各行。 |
| `build` | `build(): InlineKeyboardMarkup` | 生成新的 markup。 |
| `asReplyMarkup` | `asReplyMarkup(): InlineKeyboardMarkup` | `build` 的别名。 |

每个 inline 按钮必须有 text 并且恰好一个 action。回调数据限制为最多 64 字节 UTF-8；超出会抛出 `RangeError`。

```ts
const keyboard = new InlineKeyboard()
  .text("允许", "approve:123")
  .url("文档", "https://example.com")
  .row(
    { text: "A", callback_data: "a" },
    { text: "B", callback_data: "b" },
  )
  .build();
```

### `ReplyKeyboard`

```ts
new ReplyKeyboard(): ReplyKeyboard
```

| Method | Signature | 描述 |
|---|---|---|
| `text` | `text(text): this` | 普通文本按钮。 |
| `contact` | `contact(text): this` | 请求联系人。 |
| `location` | `location(text): this` | 请求位置。 |
| `poll` | `poll(text, type?): this` | 请求投票，类型为 `quiz` 或 `regular`。 |
| `webApp` | `webApp(text, url): this` | Web 应用按钮。 |
| `button` | `button(button): this` | 将一个按钮添加到最后一行。 |
| `row` | `row(...buttons): this` | 添加新行。 |
| `grid` | `grid(buttons, columns): this` | 将按钮划分为网格。 |
| `build` | `build(options?): ReplyKeyboardMarkup` | 生成 markup 并合并 options。 |
| `asReplyMarkup` | `asReplyMarkup(): ReplyKeyboardMarkup` | `build()` 的别名，不带 options。 |

columns 必须为正整数；否则，`grid` 会抛出 `RangeError`。

### `removeKeyboard(selective?)`

```ts
removeKeyboard(selective = false): ReplyMarkup
```

生成 `{ remove_keyboard: true }`，如果请求则包含 `selective: true`。

### `forceReply(placeholder?, selective?)`

```ts
forceReply(placeholder?: string, selective = false): ReplyMarkup
```

生成 ForceReply。仅当 placeholder 为 truthy 时才会添加占位符。

---

## 7. 存储与缓存

### `Storage<K, V>`

```ts
interface Storage<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, options?: { ttlMs?: number }): Promise<void>;
  delete(key: K): Promise<boolean>;
  has(key: K): Promise<boolean>;
  clear(): Promise<void>;
  keys(): AsyncIterable<K>;
  values(): AsyncIterable<V>;
  entries(): AsyncIterable<[K, V]>;
  update<T extends V>(
    key: K,
    updater: (current: V | undefined) => T | Promise<T>,
    options?: { ttlMs?: number },
  ): Promise<T>;
}
```

### `MemoryStorage<K, V>`

```ts
new MemoryStorage<K, V>(): MemoryStorage<K, V>
```

基于 `Map` 的内存实现。TTL 在读取或迭代键时惰性清理；没有后台定时器。`update` 使得每个键的 updater 操作串行执行，从而避免对同一键的并发更新出现意外覆盖。

```ts
const sessions = new MemoryStorage<string, { count: number }>();
await sessions.set("user:1", { count: 0 }, { ttlMs: 60_000 });
await sessions.update("user:1", (current) => ({
  count: (current?.count ?? 0) + 1,
}));
```

### `Cache<K, V>`

```ts
interface Cache<K = string, V = unknown> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, ttlMs?: number): Promise<void>;
  delete(key: K): Promise<boolean>;
  invalidate(prefix?: string): Promise<void>;
  getOrSet(key: K, factory: () => V | Promise<V>, ttlMs?: number): Promise<V>;
}
```

### `MemoryCache`

```ts
new MemoryCache(namespace = "telebibz"): MemoryCache
```

对字符串键的缓存，会对每个 key 在内部添加命名空间。

| Method | 行为 |
|---|---|
| `get` | 获取 value 或 `undefined`。 |
| `set` | 存储 value 并可选 TTL。 |
| `delete` | 删除 key 并返回布尔值。 |
| `invalidate(prefix = "")` | 删除命名空间中以 prefix 开头的所有 key。 |
| `getOrSet` | 返回缓存命中；若未命中，执行 factory，存储结果后返回。 |

`getOrSet` 不使用去重锁；当 key 还不存在且并发调用时，factory 可能会被执行多次。

### `RateLimitResult`

```ts
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs?: number;
}
```

### `TokenBucketLimiter`

```ts
new TokenBucketLimiter(
  capacity: number,
  refillPerSecond: number,
): TokenBucketLimiter
```

构造函数在任一参数非正时抛出 `RangeError`。`consume(key, cost = 1)` 在有可用令牌时扣减；若令牌不足，返回 `allowed: false` 并给出估计的 `retryAfterMs`。`clear(key?)` 删除单个桶或全部桶。

---

## 8. 队列和调度器

### `Job<T>` 和 `QueueOptions`

```ts
interface Job<T = unknown> {
  id: string;
  data: T;
  attempts: number;
  priority: number;
  runAt: number;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  error?: unknown;
}

interface QueueOptions {
  concurrency?: number;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
}
```

### `TaskQueue<T>`

```ts
new TaskQueue<T>(
  worker: (job: Job<T>, signal: AbortSignal) => Promise<void>,
  options?: QueueOptions,
): TaskQueue<T>
```

| 方法 | 签名 | 描述 |
|---|---|---|
| `add` | `add(data, options?): Job<T>` | 添加作业；options 包含 `id`, `priority`, `delayMs`。作业会立即被调度。 |
| `get` | `get(id): Job<T> \| undefined` | 返回作业状态的副本。 |
| `cancel` | `cancel(id): boolean` | 取消处于 queued 或 running 状态的作业并中止 worker 的 signal。 |
| `onIdle` | `onIdle(): Promise<void>` | 等待直到 pending 和 active 为空。 |
| `close` | `close(): Promise<void>` | 停止新的排空并取消活动的控制器。 |

优先级更高的作业先执行；若相同，则较早的 `runAt` 先执行。重试会一直进行直到超过 `retries`。重试延迟为指数增长，`maxBackoffMs` 的默认上限为 30 秒。

### `ScheduledJob`

```ts
interface ScheduledJob {
  id: string;
  cancel: () => void;
}
```

### `Scheduler`

```ts
new Scheduler(): Scheduler
```

| 方法 | 签名 | 描述 |
|---|---|---|
| `every` | `every(id, intervalMs, task): ScheduledJob` | 使用 `setInterval` 运行任务。使用相同 id 替换定时器。 |
| `after` | `after(id, delayMs, task): ScheduledJob` | 使用 `setTimeout` 执行一次任务。 |
| `cron` | `cron(id, expression, task): ScheduledJob` | 支持分钟字段的简单格式 `*/N`，等同于间隔 `N * 60_000`。 |
| `cancel` | `cancel(id): boolean` | 取消定时器。 |
| `clear` | `clear(): void` | 取消所有定时器。 |

内置调度器不支持完整的 cron 格式。除 `*/N` 外的表达式会抛出 `Error`。

---

## 9. 插件与服务

### `Plugin<Context>`

```ts
interface Plugin<Context = unknown> {
  name: string;
  version?: string;
  install?: (api: PluginApi<Context>) => void | Promise<void>;
  setup?: (api: PluginApi<Context>) => void | Promise<void>;
  onStart?: (api: PluginApi<Context>) => void | Promise<void>;
  onUpdate?: (context: Context) => void | Promise<void>;
  onStop?: (api: PluginApi<Context>) => void | Promise<void>;
  dispose?: (api: PluginApi<Context>) => void | Promise<void>;
}
```

### `PluginApi<Context>`

```ts
interface PluginApi<Context> {
  bot: unknown;
  services: ServiceContainer;
  registerMiddleware: (middleware: unknown) => void;
  registerRoute: (route: unknown) => void;
}
```

在此发行版中，`registerMiddleware` 和 `registerRoute` 可作为 hook API 提供，但实现管理器尚未将它们自动连接到 bot/router。插件可以直接使用 `api.bot` 和 `api.services`。

### `ServiceContainer`

```ts
new ServiceContainer(): ServiceContainer
```

| 方法 | 签名 | 描述 |
|---|---|---|
| `register` | `register<T>(name: string \| symbol, value: T): this` | 存储服务并支持链式调用。 |
| `get` | `get<T>(name: string \| symbol): T` | 获取服务；如果未注册则抛出错误。 |
| `has` | `has(name: string \| symbol): boolean` | 检查服务是否存在。 |
| `delete` | `delete(name: string \| symbol): boolean` | 删除服务。 |

### `PluginManager<Context>`

```ts
new PluginManager<Context>(bot: unknown): PluginManager<Context>
```

| 方法 | 行为 |
|---|---|
| `use(plugin)` | 添加插件；重复名称会抛出错误。 |
| `setup()` | 对每个插件先执行 `install` 然后 `setup`。 |
| `start()` | 按注册顺序执行 `onStart`。 |
| `update(context)` | 按注册顺序执行 `onUpdate`。 |
| `stop()` | 执行 `onStop`。 |
| `dispose()` | 按相反的注册顺序执行 `dispose`。 |
| `list()` | 返回只读的插件列表。 |

`Bot.handleUpdate()` 在此发行版中不会自动调用 `plugins.update()`；如果插件需要 update 生命周期，请显式调用管理器。

---

## 10. Webhook

### `WebhookOptions`

```ts
interface WebhookOptions {
  secretToken?: string;
  maxBodyBytes?: number;
  onError?: (error: unknown) => void | Promise<void>;
}
```

### `createWebhookHandler(bot, options?)`

```ts
createWebhookHandler<S extends object>(
  bot: Bot<S>,
  options?: WebhookOptions,
): (request: Request) => Promise<Response>
```

处理程序接收标准的 Web `Request` 并返回 `Response`。

| 情况 | 响应 |
|---|---|
| 方法不是 POST | `405 Method Not Allowed`, header `allow: POST` |
| Secret 头部不匹配 | `401 Unauthorized` |
| `Content-Length` 或 body 超过限制 | `413 Payload Too Large` |
| JSON 无效或 `update_id` 不是整数 | 对于 update id 返回 `400 Bad Request`; 解析时的异常返回 `500` |
| `bot.handleUpdate` 成功 | `200 OK`，body 为 `OK` |
| 其他异常 | `500 Internal Server Error` 并调用 `onError` |

默认 `maxBodyBytes` 为 `1_048_576` bytes。Telegram 的 secret 从 header `x-telegram-bot-api-secret-token` 读取。

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});

export default { fetch: handler };
```

---

## 11. 会话、向导、表单和菜单

### Conversation

```ts
interface ConversationState {
  name: string;
  step: number;
  values: Record<string, unknown>;
  status: "active" | "completed" | "cancelled";
  updatedAt: number;
}
```

#### `ConversationFlow<S>`

```ts
new ConversationFlow(ctx: Context<S>, state: ConversationState)
```

| 方法/属性 | 签名 | 描述 |
|---|---|---|
| `ctx` | `Context<S>` | 当前的更新上下文。 |
| `state` | `ConversationState` | 可变的会话状态。 |
| `values` | `Record<string, unknown>` | 是 `state.values` 的别名。 |
| `set` | `set<T>(key, value): this` | 保存值并更新 `updatedAt`。 |
| `get` | `get<T>(key): T \| undefined` | 获取类型化的值。 |
| `next` | `next(): this` | 将 step 增加 1。 |
| `previous` | `previous(): this` | 将 step 减少，但最低为 0。 |
| `complete` | `complete(): void` | 将状态置为 `completed`。 |
| `cancel` | `cancel(): void` | 将状态置为 `cancelled`。 |

#### `ConversationManager<S>`

```ts
new ConversationManager<S>(): ConversationManager<S>
```

| 方法 | 签名 | 描述 |
|---|---|---|
| `start` | `start(key, name, values?): ConversationState` | 创建或替换会话状态。 |
| `get` | `get(key): ConversationState \| undefined` | 获取活动状态。 |
| `cancel` | `cancel(key): boolean` | 如果存在则标记为 cancelled。 |
| `clearExpired` | `clearExpired(maxAgeMs): number` | 删除 `updatedAt` 早于阈值的状态。 |
| `run` | `run(ctx, key, name, steps): Promise<ConversationState>` | 根据 `state.step` 运行对应的步骤；如果没有步骤，则状态为 completed。 |

```ts
const conversations = new ConversationManager();
await conversations.run(ctx, "chat:1", "profile", [
  async (flow) => {
    flow.set("name", ctx.message?.text);
    flow.next();
  },
  async (flow) => {
    await flow.ctx.reply(`Nama: ${flow.get<string>("name")}`);
    flow.complete();
  },
]);
```

#### `Wizard<S>` dan `WizardStep<S>`

```ts
interface WizardStep<S> {
  id: string;
  run: (flow: ConversationFlow<S>) => void | Promise<void>;
  optional?: boolean;
}

new Wizard<S>()
```

| 方法/属性 | 描述 |
|---|---|
| `step(definition)` | 添加步骤并返回 wizard。`optional` 保存在定义中，但 runner 还没有特殊处理。 |
| `run(ctx, key, manager?)` | 通过 `ConversationManager` 使用 name 为 `"wizard"` 运行 wizard 的步骤。 |
| `steps` | 只读的步骤列表。 |

### 表单

```ts
interface ValidationIssue {
  path: string;
  message: string;
  code?: string;
}

interface Field<T> {
  name: string;
  parse: (input: unknown) => T;
  validate?: (value: T) => string | undefined | Promise<string | undefined>;
  transform?: (value: T) => T | Promise<T>;
  required?: boolean;
}
```

#### `Form<T>`

```ts
new Form<T extends Record<string, unknown>>(): Form<T>
```

| 方法 | 描述 |
|---|---|
| `field(definition)` | 根据 `name` 注册类型化字段。 |
| `parse(input)` | 处理所有字段。返回 success 或 issues 的联合结果。顺序：required 检查、parse、transform、validate。 |
| `reset()` | 清除内部保存的解析数据。 |

Result parse:

```ts
type FormResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] };
```

Issue 使用 code `required`、`parse` 或 `invalid`。

#### `validators`

| 验证器 | 输入 | 结果/错误 |
|---|---|---|
| `validators.string` | `unknown` | String；否则 `TypeError("Expected string")`. |
| `validators.number` | `unknown` | 有限的 Number，包括数字字符串；否则 `TypeError("Expected number")`. |
| `validators.integer` | `unknown` | Integer；否则 `TypeError("Expected integer")`. |
| `validators.email` | `unknown` | 符合简易 email 模式的 String；否则 `TypeError("Expected email")`. |
| `validators.url` | `unknown` | 可被 `URL` 构造函数接受的 String；否则 `TypeError("Expected URL")`. |

### 分页与菜单

#### `Page<T>`

```ts
interface Page<T> {
  items: T[];
  page: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

#### `paginate(items, page, pageSize)`

```ts
paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): Page<T>
```

Page 使用 0 为基的索引。超出范围的 page 会被夹取到最后一页。空集合仍然具有 `pageCount: 1`。负数或非整数的 `page` 或 `pageSize < 1` 会抛出 `RangeError`。

#### `paginationButtons(page, prefix)`

```ts
paginationButtons(
  page: Page<unknown>,
  prefix: string,
): InlineKeyboardButton[]
```

生成 `Previous` 按钮、带回调 `${prefix}:noop` 的指示器 `${page + 1}/${pageCount}`，以及根据 page 标志显示 `Next`。

#### `MenuItem`

```ts
interface MenuItem {
  id: string;
  label: string;
  callbackData?: string;
  url?: string;
  visible?: boolean | (() => boolean | Promise<boolean>);
  permission?: string;
}
```

#### `Menu`

```ts
new Menu(id: string): Menu
```

| 方法/属性 | 描述 |
|---|---|
| `item(item)` | 添加 item 并支持链式调用。 |
| `breadcrumb(label)` | 添加 breadcrumb 标签。 |
| `build()` | 等待可见性谓词，跳过不可见项，然后生成 `InlineKeyboard`。URL 优先于 callback。 |
| `breadcrumbs` | `breadcrumbs` 只读的 breadcrumb 数组。 |

`permission` 仅作为 item 的元数据存储；`Menu.build()` 不会自动执行授权。

---

## 12. 审批门

Approval gate 在机器人首次使用库时向 owner 发送通知。默认消息使用标签 `Dev Gantenggg`，包含 bot ID/用户名 和 owner ID，并提供按钮 `Izinkan` 和 `Tidak Diizinkan`。

### `ApprovalOptions`

| 属性 | 类型 | 默认 | 描述 |
|---|---|---:|---|
| `ownerChatId` | `ChatId` | wajib | 通知目标聊天。 |
| `ownerUserId` | `number` | wajib | 可以按下按钮的用户 ID。 |
| `ownerLabel` | `string` | `Dev Gantenggg` | 通知上的标签。 |
| `requireApproval` | `boolean` | `true` | `false` 会禁用 gate。 |
| `notificationCooldownMs` | `number` | `600000` | 等待通知的冷却时间（毫秒）。 |
| `store` | `ApprovalStore` | `MemoryApprovalStore` | 自定义 approval 存储。 |

### 审批类型

```ts
type ApprovalStatus = "pending" | "approved" | "denied";

interface ApprovalRecord {
  key: string;
  botId: number;
  botUsername?: string;
  ownerUserId?: number;
  status: ApprovalStatus;
  nonce: string;
  requestedAt: number;
  decidedAt?: number;
  decidedBy?: number;
  notificationMessageId?: number;
}

interface ApprovalIdentity {
  bot: User;
  configuredOwnerUserId?: number;
}

interface ApprovalCheck {
  allowed: boolean;
  status: ApprovalStatus | "disabled";
  record?: ApprovalRecord;
}
```

### `ApprovalStore`

```ts
interface ApprovalStore {
  get(key: string): Promise<ApprovalRecord | undefined>;
  set(key: string, record: ApprovalRecord): Promise<void>;
  delete?(key: string): Promise<boolean>;
}
```

### `MemoryApprovalStore`

```ts
new MemoryApprovalStore(): MemoryApprovalStore
```

基于内存的存储，在 `get` 和 `set` 时返回 record 的副本。

### `ApprovalGate`

```ts
new ApprovalGate(api: ApiClient, options: ApprovalOptions): ApprovalGate
```

| 方法 | 签名 | 描述 |
|---|---|---|
| `check` | `check(identity): Promise<ApprovalCheck>` | 若记录已批准则返回 approved；若不存在记录或冷却期已过则发送新的请求。 |
| `handleCallback` | `handleCallback(callback): Promise<{ handled: boolean; status?: ApprovalStatus }>` | 验证 nonce 和 owner，然后批准/拒绝。非审批回调返回 `handled: false`。 |
| `isAllowed` | `isAllowed(botId): Promise<boolean>` | True 若为 approved 或 gate 被禁用。 |
| `revoke` | `revoke(botId): Promise<boolean>` | 如果 store 支持 delete，则删除记录。 |

回调只能由已配置的 `ownerUserId` 决定。随机的 16 个十六进制字符 nonce 可以防止旧的回调被重用。过时的回调会产生过期提醒。

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  approval: {
    ownerChatId: 7377733784,
    ownerUserId: 7377733784,
    ownerLabel: "Dev Gantenggg",
  },
});
```

---

## 13. 文本工具

### `escapeMarkdownV2(value)`

```ts
escapeMarkdownV2(value: string): string
```

对 Telegram MarkdownV2 字符进行转义：`\\_ * [ ] ( ) ~ ` > # + - = | { } . !`.

### `escapeHtml(value)`

```ts
escapeHtml(value: string): string
```

将 `&`、`<`、`>` 和 `"` 转换为 HTML 实体。

### `md`

下面可用的 MarkdownV2 辅助对象：

| Method | 输出（概念） |
|---|---|
| `md.bold(value)` | `*escaped value*` |
| `md.italic(value)` | `_escaped value_` |
| `md.link(label, url)` | `[escaped label](escaped url)` |
| `md.code(value)` | 使用已转义反引号的行内代码。 |
| `md.pre(value, language?)` | 带可选语言标签的代码块。 |
| `md.escape(value)` | 别名 `escapeMarkdownV2`. |

### `splitMessage(text, options?)`

```ts
splitMessage(
  text: string,
  options?: {
    limit?: number;
    parseMode?: "Markdown" | "MarkdownV2" | "HTML";
  },
): string[]
```

将文本拆分为片段，默认字符限制为 `4096`。在可能的情况下，拆分会优先选择段落边界、换行或空格；仅当边界位于窗口的一半以上时才使用该边界。`parseMode` 作为 API 的选项被接受，但目前并不会改变拆分算法。

小于 1 的 limit 会抛出 `RangeError`。

### `splitCaption(text)`

```ts
splitCaption(text: string): string[]
```

`splitMessage(text, { limit: 1024 })` 的快捷方式。

### `template(templateText, values)`

```ts
template(
  templateText: string,
  values: Record<string, unknown>,
): string
```

替换占位符 `{{ key }}` 以及类似 `{{ user.name }}` 的嵌套路径。`null` 或 `undefined` 的值会被替换为空字符串；其他值将使用 `String()` 转换。

```ts
template("你好 {{ user.name }}", { user: { name: "Ayu" } });
// "你好 Ayu"
```

---

## 14. Testing utilities

Import dari `@xbibzlibrary/telebibz/testing` atau root package.

### `MockTransport`

```ts
new MockTransport(): MockTransport
```

| API | Deskripsi |
|---|---|
| `calls` | Array semua `TransportRequest` yang diterima. |
| `respond(method, response)` | Mengatur response statis atau callback berdasarkan payload dan mengembalikan transport. |
| `request(request)` | Mencatat request dan mengembalikan response mock. Response default adalah `{ ok: true, result: true }`. |

Status mock adalah `200` bila `ok: true`, atau `error_code`/`500` bila `ok: false`.

```ts
const transport = new MockTransport()
  .respond("getMe", {
    ok: true,
    result: { id: 1, is_bot: true, first_name: "Test" },
  });
```

### `createMockUpdate(overrides?)`

```ts
createMockUpdate(overrides?: Partial<Update>): Update
```

Membuat update message default dengan `update_id: 1`, chat private id `1`, user id `2`, dan text `/start`. Object `overrides` digabung shallow dengan default.

### `createTestBot()`

```ts
createTestBot(): { bot: Bot; transport: MockTransport }
```

Membuat bot dengan token test `123456:TEST_TOKEN`, mock `getMe()` yang menghasilkan bot id `99`, dan transport yang dapat diperiksa melalui `transport.calls`.

### `createMockContext(bot, update?)`

```ts
createMockContext(
  bot: Bot,
  update?: Update,
): Context
```

Membuat context menggunakan API bot, session kosong, dan services kosong.

---


## 15. 生成的 Telegram 方法命名空间

`generated/api.ts` 是生成器的内部源，定义了:

```ts
const TELEGRAM_API_VERSION = "10.2";
const TELEGRAM_METHOD_NAMES: readonly string[];
type TelegramMethodName = typeof TELEGRAM_METHOD_NAMES[number];
type GeneratedMethodSpec = {
  params: Record<string, unknown>;
  result: unknown;
};
type GeneratedTelegramMethodMap = {
  [K in TelegramMethodName]: GeneratedMethodSpec;
};
const GENERATED_METHODS: Record<TelegramMethodName, TelegramMethodName>;
```

`TELEGRAM_METHOD_NAMES` 包含生成器源中的 184 个方法名。该命名空间是 `api.methods`、`api.call` 和 `api.request` 的代理基础，但在此版本中生成的文件并未作为公共包子路径导出。尚未映射的特定参数/返回值可以通过 `api.raw()` 调用，或在 TypeScript 中通过类型转换传参。

以下为未经分组的规范方法列表，生成时运行时命名空间中可用的方法名为：

```text
addStickerToSet,
answerCallbackQuery,
answerChatJoinRequestQuery,
answerGuestQuery,
answerInlineQuery,
answerPreCheckoutQuery,
answerShippingQuery,
answerWebAppQuery,
approveChatJoinRequest,
approveSuggestedPost,
banChatMember,
banChatSenderChat,
close,
closeForumTopic,
closeGeneralForumTopic,
convertGiftToStars,
copyMessage,
copyMessages,
createChatInviteLink,
createChatSubscriptionInviteLink,
createForumTopic,
createInvoiceLink,
createNewStickerSet,
declineChatJoinRequest,
declineSuggestedPost,
deleteAllMessageReactions,
deleteBusinessMessages,
deleteChatPhoto,
deleteChatStickerSet,
deleteEphemeralMessage,
deleteForumTopic,
deleteMessage,
deleteMessageReaction,
deleteMessages,
deleteMyCommands,
deleteStickerFromSet,
deleteStickerSet,
deleteStory,
deleteWebhook,
editChatInviteLink,
editChatSubscriptionInviteLink,
editEphemeralMessageCaption,
editEphemeralMessageMedia,
editEphemeralMessageReplyMarkup,
editEphemeralMessageText,
editForumTopic,
editGeneralForumTopic,
editMessageCaption,
editMessageChecklist,
editMessageLiveLocation,
editMessageMedia,
editMessageReplyMarkup,
editMessageText,
editStory,
editUserStarSubscription,
exportChatInviteLink,
forwardMessage,
forwardMessages,
getAvailableGifts,
getBusinessAccountGifts,
getBusinessAccountStarBalance,
getBusinessConnection,
getChat,
getChatAdministrators,
getChatGifts,
getChatMember,
getChatMemberCount,
getChatMenuButton,
getCustomEmojiStickers,
getFile,
getForumTopicIconStickers,
getGameHighScores,
getManagedBotAccessSettings,
getManagedBotToken,
getMe,
getMyCommands,
getMyDefaultAdministratorRights,
getMyDescription,
getMyName,
getMyShortDescription,
getMyStarBalance,
getStarTransactions,
getStickerSet,
getUpdates,
getUserChatBoosts,
getUserGifts,
getUserPersonalChatMessages,
getUserProfileAudios,
getUserProfilePhotos,
getWebhookInfo,
giftPremiumSubscription,
hideGeneralForumTopic,
leaveChat,
logOut,
pinChatMessage,
postStory,
promoteChatMember,
readBusinessMessage,
refundStarPayment,
removeBusinessAccountProfilePhoto,
removeChatVerification,
removeMyProfilePhoto,
removeUserVerification,
reopenForumTopic,
reopenGeneralForumTopic,
replaceManagedBotToken,
replaceStickerInSet,
repostStory,
restrictChatMember,
revokeChatInviteLink,
savePreparedInlineMessage,
savePreparedKeyboardButton,
sendAnimation,
sendAudio,
sendChatAction,
sendChatJoinRequestWebApp,
sendChecklist,
sendContact,
sendDice,
sendDocument,
sendGame,
sendGift,
sendInvoice,
sendLivePhoto,
sendLocation,
sendMediaGroup,
sendMessage,
sendMessageDraft,
sendPaidMedia,
sendPhoto,
sendPoll,
sendRichMessage,
sendRichMessageDraft,
sendSticker,
sendVenue,
sendVideo,
sendVideoNote,
sendVoice,
setBusinessAccountBio,
setBusinessAccountGiftSettings,
setBusinessAccountName,
setBusinessAccountProfilePhoto,
setBusinessAccountUsername,
setChatAdministratorCustomTitle,
setChatDescription,
setChatMemberTag,
setChatMenuButton,
setChatPermissions,
setChatPhoto,
setChatStickerSet,
setChatTitle,
setCustomEmojiStickerSetThumbnail,
setGameScore,
setManagedBotAccessSettings,
setMessageReaction,
setMyCommands,
setMyDefaultAdministratorRights,
setMyDescription,
setMyName,
setMyProfilePhoto,
setMyShortDescription,
setPassportDataErrors,
setStickerEmojiList,
setStickerKeywords,
setStickerMaskPosition,
setStickerPositionInSet,
setStickerSetThumbnail,
setStickerSetTitle,
setUserEmojiStatus,
setWebhook,
stopMessageLiveLocation,
stopPoll,
transferBusinessAccountStars,
transferGift,
unbanChatMember,
unbanChatSenderChat,
unhideGeneralForumTopic,
unpinAllChatMessages,
unpinAllForumTopicMessages,
unpinAllGeneralForumTopicMessages,
unpinChatMessage,
upgradeGift,
uploadStickerFile,
verifyChat
```

> 上述列表遵循生成的源代码。如果 Telegram 添加了新方法，请在 schema 更新后运行 `npm run update:telegram` 或 `telebibz generate`。

---

## 16. 命令行界面 (CLI)

二进制包为 `telebibz`。

```bash
npx telebibz <command>
```

| 命令 | 行为 |
|---|---|
| `telebibz init [directory]` | 创建目录、最小的 `index.ts`，以及 `.env.example`。默认目录 `my-telebibz-bot`。 |
| `telebibz doctor` | 显示 Node 版本、是否存在 `TELEGRAM_BOT_TOKEN`、cwd、包名，然后如果存在 token 则检查健康检查 API。如果 API 无法访问则退出码为 1。 |
| `telebibz generate` | 运行 `scripts/generate-api.mjs` 中的生成器方法。 |
| `telebibz build` | 运行 `npm run build`。 |
| `telebibz test` | 运行 `npm test`。 |
| `telebibz webhook` | 检查 `TELEGRAM_BOT_TOKEN`，如有则使用 `TELEGRAM_WEBHOOK_SECRET`，创建处理器并打印就绪状态。此命令不会创建 HTTP 服务器。 |
| `telebibz inspect` | 显示 cwd 和 Node 版本。 |
| 无命令 | 显示帮助命令列表。 |

CLI 使用的环境变量是 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_WEBHOOK_SECRET`。

---

## 17. 主要 Telegram 类型

该包直接导出最常用的数据类型。

| Type | 重要内容 |
|---|---|
| `User` | ID、机器人标志、姓名、用户名、语言和能力标志。 |
| `Chat` | ID、类型、标题/用户名/名称、论坛/私信 标志。 |
| `Message` | ID、日期、聊天、发送者、文本/说明、实体、回复、标记，以及用于额外 Telegram 字段的索引签名。 |
| `Update` | 包含源支持的所有更新字段，包括消息、回调、内联、投票、成员、加入请求、反应、提升、业务和扩展字段。 |
| `CallbackQuery` | ID、来自用户、消息/内联消息 ID、聊天实例、数据。 |
| `InlineQuery` | ID、来自用户、查询、偏移、聊天类型、位置。 |
| `Poll`, `PollAnswer` | 投票数据和答案。 |
| `ChatMemberUpdated`, `ChatJoinRequest` | 成员变更和加入请求。 |
| `InlineKeyboardMarkup`, `ReplyKeyboardMarkup`, `ReplyKeyboardRemove`, `ForceReply` | Telegram 的回复标记（reply markup）格式。 |
| `MessageEntity`, `ReplyParameters`, `LinkPreviewOptions` | 实体元数据、回复参数和链接预览选项。 |
| `BotCommand`, `BotCommandScope`, `WebhookInfo`, `File`, `UserProfilePhotos`, `ChatMember`, `ChatAdministratorRights` | API 的结果/参数辅助类型。 |

---

## 18. 持久化、完整 cron、菜单和完整 Telegram 声明

### 持久化 storage 适配器

所有适配器都实现相同的 `Storage<K, V>` contract。核心 package 不包含 vendor runtime dependency；Redis、SQL 和 Mongo 适配器接收由应用或所选 vendor client 提供的小型 driver interface。

| Class | 构造函数 | 用途 |
|---|---|---|
| `MemoryStorage<K, V>` | `new MemoryStorage()` | 带 TTL 和按 key 原子 `update()` 的快速内存 storage。 |
| `JsonFileStorage<V>` | `new JsonFileStorage(filePath)` | 适用于单进程部署的原子 JSON 文件持久化。 |
| `RedisStorage<V>` | `new RedisStorage(client, prefix?)` | 通过 `RedisLikeClient` 使用 Redis storage，包含 TTL 和 namespace。 |
| `SqlStorage<V>` | `new SqlStorage(driver)` | 通过应用提供的 `SqlStorageDriver` 使用 SQL storage。 |
| `MongoStorage<V>` | `new MongoStorage(collection)` | 通过应用提供的 `MongoStorageCollection` 使用 Mongo storage。 |
| `StorageApprovalStore` | `new StorageApprovalStore(storage)` | 使用任意 `Storage<string, ApprovalRecord>` 持久化 owner approval record。 |

`BotOptions.session` 接受 `Storage<string, S>`，因此 session 可以使用任意适配器。`ConversationManager` 接受相同的 storage abstraction，并提供 `getAsync()`、`cancelAsync()` 和 `clearExpiredAsync()` 来持久化 conversation state。

```ts
const session = new JsonFileStorage<Record<string, unknown>>("./data/sessions.json");
const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN!, session });
```

### 完整五字段 cron

`parseCronExpression()` 支持标准五字段 `minute hour day-of-month month day-of-week`，包括 wildcard、list、range 和 step，例如 `*/15 9-17 1,15 * 1-5`。`nextCronOccurrence()` 计算下一个本地 occurrence。`Scheduler.cron()` 使用 one-shot timer，并在每次执行后重新调度；任务错误会交给 `Scheduler({ onError })`，不会成为未处理的 promise rejection。

### Router matching mode

`new Router()` 默认使用 **first-match**，防止意外的 double reply。只有在确实需要 fan-out 时才使用 `new Router({ matchMode: "all" })`。RegExp matcher 在测试前会重置 `lastIndex`，因此 global 或 sticky expression 可以安全复用。

### MenuController 和 permission

`Menu` 支持基于 permission 的 item、异步 visibility/permission predicate、breadcrumb 和多列布局。`MenuController` 增加 stateful page rendering，以及对 `select`、`page`、`noop` 和外部 callback data 的 dispatch。

### 完整 Telegram declaration namespace

Package 内置 MIT 许可的 Telegram declaration，并通过 type-only export 暴露 `TelegramTypes`，同时提供 `TelegramUser`、`TelegramMessage`、`TelegramUpdate` 和 `TelegramApiMethods` 等 alias。Approval notification 使用带颜色的 Unicode box，并包含 attribution `Library Bot Telegram By @xbibzofficial`。`Logger` 输出带 level、redaction、update summary 的结构化 JSON，并支持 opt-in 记录 user message/callback content。这些 declaration 覆盖完整的 object、union、enum 和 method surface，不增加 runtime dependency。telebibz core method map 仍专门为具有直接参数/结果映射的 method 提供类型。

---

## 19. 兼容性和需要注意的限制

Library menargetkan Node.js `>=20`，使用 ESM 作为主要模块，并提供 CommonJS 构建。Webhook 需要运行时提供 Web `Request`、`Response`、`Headers`、`FormData`、`Blob` 和 `AbortController`；现代 Node.js 原生提供了这些。

API 生成的方法列表（generated method list）和 API 方法映射（API method map）并不相同。`TelegramMethodName` 包含 184 个运行时名称，但 `TelegramMethodMap` 仅对 API 客户端部分列出的子集提供了带类型的参数/结果。对于其他方法，使用 `api.raw()` 或在应用端添加类型声明。

Approval 状态和其他内存 primitive 会在进程重启时丢失，除非应用提供持久化适配器。`BotOptions.session` 接受 generic `Storage<string, S>` contract，`ApprovalGate` 可以使用 `StorageApprovalStore` 或自定义 `ApprovalStore`。

---

## 参考文献

[1]: https://core.telegram.org/bots/api "Telegram Bot API — 官方文档"
[2]: https://www.npmjs.com/package/@xbibzlibrary/telebibz "@xbibzlibrary/telebibz 在 npm 上"
