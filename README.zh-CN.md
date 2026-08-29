# telebibz

![telebibz 徽标](https://imgbs.com/uploads/telebibz-d7b30671.png)

[![CI](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml/badge.svg)](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![npm downloads](https://img.shields.io/npm/dm/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)
[![Node.js](https://img.shields.io/node/v/@xbibzlibrary/telebibz)](https://www.npmjs.com/package/@xbibzlibrary/telebibz)

**`@xbibzlibrary/telebibz`** 是一个面向 Node.js 和 TypeScript 的 Telegram Bot SDK 和框架。该包提供 API 客户端、轮询、路由器、中间件、上下文、键盘构造器、状态/会话、Webhook 处理、队列、调度器、缓存、插件生命周期、CLI 以及测试工具。

[English](README.md) · [Bahasa Indonesia](README.id.md) · **简体中文**

完整 API 参考：[English](docs/API.md) · [Indonesia](docs/API.id.md) · **中文**

GitHub Packages 指南：[English](docs/GITHUB_PACKAGES.md) · [Bahasa Indonesia](docs/GITHUB_PACKAGES.id.md) · [简体中文](docs/GITHUB_PACKAGES.zh-CN.md)

入门指南：[English](docs/GETTING_STARTED.md) · [Bahasa Indonesia](docs/GETTING_STARTED.id.md) · [简体中文](docs/GETTING_STARTED.zh-CN.md)

社区 showcase：[SHOWCASE.md](SHOWCASE.md)

![telebibz 概览](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

## 安装

```bash
npm install @xbibzlibrary/telebibz
```

需要 Node.js **22 或更高版本**。

## 简单机器人

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", async (ctx) => { await ctx.reply("机器人已启动。"); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
```

`Bot.start()` 会运行长轮询。要手动管理生命周期，请使用 `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, 或 `restart()`。

## 官方 starter examples

repository 提供可直接运行的 minimal bot、多步骤 registration wizard 和 Node.js webhook starter。请查看 [`examples/README.md`](examples/README.md)，或设置 `TELEGRAM_BOT_TOKEN` 后运行 minimal starter：

```bash
export TELEGRAM_BOT_TOKEN="<your-bot-token>"
npx tsx examples/minimal.ts
```

所有 examples 都会通过 `npm run test:examples` 在 CI 中进行类型检查，并且不包含真实 credential。

## 路由器与中间件

```ts
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`processed in ${Date.now() - started}ms`);
});

bot.command("help", async (ctx) => { await ctx.reply("可以查看帮助。"); });
bot.onRegex(/^order:(\d+)$/, async (ctx) => { await ctx.reply("订单已收到。"); });
bot.callback("profile:*", async (ctx) => { await ctx.answerCallbackQuery("已打开。"); });
bot.action("menu:open", async (ctx) => { await ctx.answerCallbackQuery("菜单已打开。"); });
bot.on("message:photo", async (ctx) => { await ctx.reply("照片不错。"); });
bot.on(["message:text", "callback_query:data"], async (ctx) => { await ctx.reply("收到。"); });
bot.hears("ping", async (ctx) => { await ctx.reply("pong"); });
bot.catch(async (error, ctx) => { await ctx.reply("出错了。"); });
```

路由器支持命令、文本、正则、回调模式、更新类型过滤器（`on`）、自定义谓词、嵌套路由器、每条路由的中间件，以及路由优先级。`bot.catch()` 注册错误边界：处理器失败会转发到那里，而不是拒绝整个 update。

## Telegram API

通过 API 客户端可以使用生成的方法调用和原始调用：

```ts
await bot.api.methods.getMe();
await bot.api.methods.sendMessage({ chat_id: 123456789, text: "你好。" });
await bot.api.call("sendMessage", { chat_id: 123456789, text: "你好。" });
await bot.api.raw("futureTelegramMethod", { value: true });
```

内置传输使用 `fetch`，支持超时、重试、指数退避、JSON 载荷和多部分上传。

关于每个 class、function、method、type、error、lifecycle、CLI 命令和生成的 Telegram 方法的完整 API 参考请参见 [`docs/API.zh-CN.md`](docs/API.zh-CN.md)。

## 键盘

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

const keyboard = new InlineKeyboard()
  .text("个人资料", "profile")
  .url("文档", "https://core.telegram.org/bots/api")
  .build();

await ctx.reply("请选择菜单：", { reply_markup: keyboard });
```

构造器仅生成 Telegram 原生键盘的 payload。HTML/CSS 的 UI 需要单独的 Mini App 或 Web App。

## 启动与终端日志

Logger 输出紧凑易读的终端日志行，带彩色级别和结构化上下文。日志级别为 `silent`、`error`、`warn`、`info`、`debug` 和 `trace`；敏感值会被 redact；错误以红色打印并带完整堆栈。使用 `format: "json"` 做机器摄取，仅在明确需要消息文本或回调数据时才开启 `includeUpdateContent: true`。

## Wizard 与多步会话

将 `Wizard` 与 `bot.useWizard()` 配合使用，来自同一 chat/user 的后续每条文本回复都会自动路由到当前步骤。Key 由 Telegram chat 和发送者生成，无需手动指定。

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "prompt-name", run: async (flow) => { flow.next(); await flow.ctx.reply("你叫什么名字？"); } })
  .step({ id: "name", run: async (flow) => { flow.set("name", flow.ctx.message?.text?.trim()); flow.next(); await flow.ctx.reply("你多大了？"); } })
  .step({ id: "age", run: (flow) => { const age = Number(flow.ctx.message?.text?.trim()); if (!Number.isInteger(age)) return; flow.set("age", age); flow.next(); } });

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.useWizard(wizard);
bot.command("start", async (ctx) => { await wizard.run(ctx); });
await bot.start();
```

`Wizard` 在 update 之间保持其默认的 `ConversationManager`，并在最后一步完成后立即标记会话完成。使用 `/cancel` 可取消正在进行的 wizard。

## Webhook

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

`createWebhookHandler` 接受标准 Web `Request` 并返回 `Response`。处理程序会验证 secret token、body 大小、JSON 解析以及重复更新处理。

## 高负载更新与广播

telebibz 为 1000+ 条消息的突发场景而生，没有任何人为冷却：

- **跨 chat 并行，同一 chat 内按序。** 每个 `getUpdates` 批次（以及每个 webhook 请求）都并发处理——不同 chat 的 update 不会互相排队，而同一 chat 的 update 保持到达顺序，因此会话、wizard 和 conversation 始终正确，会话写入永不丢失。并发突发只触发一次 `getMe` 初始化。如果你自己持有轮询循环，可用 `bot.handleUpdates()` 直接喂入已拉取的批次。
- **没有主动限流。** 库永远不会延迟外发请求。当 Telegram 返回 429 时，transport 会严格按照 Telegram 指定的 `retry_after` 窗口等待（全局 "flood gate" 保护所有进行中的流量）并自动重试——因此突发流量会完整送达而不是失败。针对你自己的下游限制，`Limiter` 与 `mapWithConcurrency()` 可为任意工作负载整形速率。
- **一次性向 1000+ 用户广播。** `bot.broadcast()` 立即尝试所有 chat，按照 Telegram 自己的 `retry_after` 重试 429，并返回完整报告。
- **优雅停机。** `bot.stop()` 会先等待进行中的 handler 完成（受 `handlerTimeout` 约束），然后才停止 plugin manager——进行中的会话绝不会在写入途中被截断。

```ts
const report = await bot.broadcast(
  subscriberIds,
  (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "Newsletter #42" }),
  { onProgress: (p) => console.log(`${p.delivered}/${p.total} delivered`) },
);
console.log(`Delivered ${report.delivered}/${report.total} in ${report.durationMs}ms`);
```

当你自己的下游（数据库、API）需要时，可以用 `new Bot({ ..., updates: { concurrency: 64 } })` 或 `broadcast(..., { concurrency: 64 })` 限制并发——默认情况下两者都完全并行。

## Context 表面与 Telegraf 完全对齐

Telegraf 的每一个 context 快捷方法都可用，还包含补齐 Telegraf 核心交给其插件生态的部分：

- **管理与封禁** — `ctx.banChatMember`、`ctx.unbanChatMember`、`ctx.restrictChatMember`、`ctx.promoteChatMember`、`ctx.banChatSenderChat`、`ctx.unbanChatSenderChat`
- **聊天管理** — `ctx.setChatTitle/Description/Photo`、`ctx.setChatPermissions`、`ctx.leaveChat`、`ctx.unpinAllChatMessages`、`ctx.setChatStickerSet`、`ctx.deleteChatStickerSet`
- **信息** — `ctx.getChatAdministrators`、`ctx.getChatMemberCount`、`ctx.getChatMember`
- **邀请链接与加群申请** — `ctx.exportChatInviteLink`、`ctx.createChatInviteLink`、`ctx.editChatInviteLink`、`ctx.revokeChatInviteLink`、`ctx.approveChatJoinRequest`、`ctx.declineChatJoinRequest`
- **投票、游戏、支付** — `ctx.replyWithQuiz`、`ctx.stopPoll`、`ctx.editMessageLiveLocation`、`ctx.stopMessageLiveLocation`、`ctx.replyWithGame`、`ctx.setGameScore`、`ctx.getGameHighScores`、`ctx.replyWithInvoice`
- **论坛主题** — `ctx.createForumTopic`、`ctx.closeForumTopic`、`ctx.editGeneralForumTopic` 等九个
- **启动选项** — `handlerTimeout`（默认 90 秒，与 Telegraf 一致）以 `UpdateTimeoutError` 拒绝挂起的 update，同时 handler 继续运行；传 `0` 可禁用超时；`contextType` 接入你自己的 `Context` 子类；`start()`/`launch()` 的 `dropPendingUpdates`
- **Webhook 应答** — 选择性开启的 `webhookReply: true` 让第一个 API 调用直接通过 webhook HTTP 响应本身应答（Telegraf 风格），懒加载的 `getMe` 永远不会占用槽位
- **即插即用的 handler 别名** — `bot.action(...)` 与 `bot.callback(...)` 一样注册回调查询 handler，为 Telegraf 编写的 handler 可以原样迁移

## 状态、队列、调度器和缓存

该包提供带 TTL 和原子更新的 `MemoryStorage`、`JsonFileStorage`、`RedisStorage`、`SqlStorage`、`MongoStorage`、bot session、基于 Storage 的 conversation/form、基于 permission 的菜单、`MenuController` 分页、`MemoryCache`、令牌桶限流器、支持重试/退避/并发/延迟/取消的任务队列，以及间隔、一次性和完整五字段 cron 的调度器。Redis、SQL 和 Mongo 适配器使用小型 driver interface，因此 core package 不需要 vendor runtime dependency。

## 终端体验

当 bot 在交互式终端启动时（`npm start`、`node index.js`、`telebibz start`），telebibz 会播放启动序列：`Installing Dependencies......` 打字效果、带扫过高光的 glass 进度条，以及动画彩虹 ASCII 横幅 **Tele Bibz**（figlet `Speed` 字体）——彩虹持续流动直到 bot 连接成功，随后定格并显示 `✓ Connected as @<username>`。

之后，每一条进入的 update 都会以易读的格式输出，错误自动以红色打印并附带完整堆栈：

```text
[ => ] Message From 123456789 John Doe 29/08/2026 15:04:05
        ↳ Text: /start
[ => ] Callback From 123456789 John Doe 29/08/2026 15:04:07
        ↳ Data: menu:open
```

普通消息与命令文本截断为 50 个字符；回调按钮数据完整显示。向 `Bot` 传入 `branding: false` 可关闭启动序列，或设置 `logger.format: "json"` 获取结构化日志。非交互 stdout（管道、Docker、CI）会自动回退到无动画的纯文本输出。

## CLI

`telebibz doctor`、`init`、`webhook` 等 CLI command 以彩虹 `Tele Bibz` 横幅开始。当 stdout 不是 TTY 时，启动动画自动回退为干净的静态输出。

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
```

也可以在应用中打印相同的 terminal branding：

```ts
import { printTeleBibzBanner, printTerminalBranding } from "@xbibzlibrary/telebibz";

printTeleBibzBanner({ subtitle: "My bot" });
printTerminalBranding();
```

## 测试

```bash
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
```

真实的 Telegram E2E 需要 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_TEST_CHAT_ID`。没有凭证时，E2E 将被跳过且不计为通过。

## Web App 和支付

`validateWebAppInitData()` 会验证 Telegram Web App 的 signature 和 expiration。`PaymentsClient` 提供 invoice link、invoice、pre-checkout answer、Web App query answer、Stars transactions 和 Stars refunds 的 wrapper。使用 `TelegramTypes` 以及 `TelegramUser`、`TelegramMessage`、`TelegramUpdate` 等 alias 来访问完整的 vendored Telegram declaration surface。

## API 表面

除注明 subpath 外，以下所有内容都从 package 入口导出。每个导出的完整签名见 [docs/API.zh-CN.md](docs/API.zh-CN.md)（另有 [docs/API.md](docs/API.md) 与 [docs/API.id.md](docs/API.id.md)）。

| 领域 | 导出 |
|---|---|
| Bot 与生命周期 | `Bot` 的 `on`、`onText`、`onRegex`、`command`、`hears`、`callback`、`action`、`catch`、`use`、`usePlugin`、`useWizard`、`handleUpdate`、`handleUpdates`、`start`/`launch`、`stop`、`restart`、`init`、`health`、`broadcast`、`getMe`、`setCommands`、`deleteCommands`；`UpdateTimeoutError` |
| Context | `Context`、`ContextOptions`、launch 选项 `contextType`；`ctx` 上约 80 个快捷方法，覆盖回复、管理员操作、聊天管理、邀请链接、投票、游戏、支付与论坛主题 |
| Telegram API | `ApiClient` 的 `call()`、`request()`、`raw()` 与 `methods`（全部生成的 Bot API 方法）；`FetchTransport` 自带 429/5xx 自动重试和全局 flood gate |
| 错误 | `TelegramError` 带 `kind` 分类（`retryable`、`rate-limit`、`authentication`、`validation`、`network`、`server`、`unknown`）与 `retryAfter`，另有 `TelegramRateLimitError`、`TelegramAuthError`、`TelegramValidationError`、`TelegramNetworkError` |
| 路由器与中间件 | `Router`、`compose`、24 个 update 过滤器（`message:photo`、`callback_query:data` 等）、`matchMode`（`first`/`all`） |
| 键盘 | `InlineKeyboard`、`ReplyKeyboard`、`removeKeyboard()`、`forceReply()` |
| 存储 | `MemoryStorage`（TTL、按 key 串行化）、`JsonFileStorage`、`RedisStorage`、`SqlStorage`、`MongoStorage`，以及它们所基于的小型 driver interface |
| 缓存与限流 | `MemoryCache`、`TokenBucketLimiter`、`Limiter`、`mapWithConcurrency()` |
| 队列与调度器 | `TaskQueue`（优先级、重试、退避、延迟、取消）、`Scheduler`（间隔、一次性、cron）、`parseCronExpression()`、`nextCronOccurrence()` |
| 状态与对话 | `Wizard`、`ConversationManager`、`ConversationFlow`、带 `validators` 的 `Form`、基于 permission 的 `Menu`、`MenuController`、`paginate()` |
| Webhook | `createWebhookHandler()`（Web `Request`/`Response`）、面向 Express/Koa/Fastify/Node `http` 的 `webhookCallback()`、`runWithWebhookReply()`、`claimWebhookReply()` |
| Web App 与支付 | `parseWebAppInitData()`、`validateWebAppInitData()`、`PaymentsClient`、`TelegramTypes`（内置的 Telegram 声明） |
| 可观测性 | `Logger`（级别、redaction、JSON 格式）、带 `update:*`、`bot:*`、`broadcast:*` 事件映射的 `EventBus`、`redact()` |
| 终端 | `printTeleBibzBanner()`、`printTerminalBranding()`、`buildTerminalBranding()`、`runStartupSequence()`、`startTeleBibzBanner()`、`paintRainbow()`、`printStatusLine()` |
| 文本工具 | `splitMessage()`、`splitCaption()`、`escapeMarkdownV2()`、`escapeHtml()`、`md`、`html`、`template()` |
| 测试（`@xbibzlibrary/telebibz/testing`） | `MockTransport`、`createTestBot()`、`createMockUpdate()`、`createMockCallbackUpdate()`、`createMockContext()` |
| CLI（`telebibz …`） | `init`、`doctor`、`build`、`test`、`start`、`webhook`、`generate` |

## API 目标与限制

方法列表会在 schema 更新时根据 Telegram Bot API 文档生成。检测到的官方方法都可以运行时访问，而专门的参数/结果推断主要集中在 core method map。完整的 Telegram object、union、enum 和 method declaration 可通过 `TelegramTypes` 使用。有关实现状态请参见 [FEATURE_MATRIX.md](FEATURE_MATRIX.md)，完整 API 请参见 `docs/API.zh-CN.md`。

## 发布自动化

GitHub repository 提供 CI 和自动发布 workflow。每次推送到 `main` 都会运行 quality gates，并从推送的 Conventional Commits 推导下一个版本：`feat:` 提交和破坏性变更在 package 处于 1.0 之前提升 minor（`BREAKING-CHANGE` footer 或 `type!:` 主题自 1.0.0 起提升 major），其余提升 patch。`package.json` 中已声明且高于 npm 的版本会按声明原样发布，workflow 绝不会发布低于或等于 npm 最新版的版本。workflow 会创建版本 commit 和 tag，发布到 npm（通过 `--provenance=false` 禁用 provenance），并创建 GitHub Release。包含 `[skip release]` 的提交不会触发发布。依赖自动发布前，请在 GitHub Actions 中配置 `NPM_TOKEN` secret。请参阅 [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) 和 [GitHub Packages 指南](docs/GITHUB_PACKAGES.zh-CN.md)。

## 项目 policy 和贡献

| 文档 | 用途 |
|---|---|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | 社区行为、执行、报告和申诉。 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 本地 setup、branch/commit、测试、review 和 release workflow。 |
| [CONTRIBUTION_RULES.md](CONTRIBUTION_RULES.md) | API、兼容性、测试、依赖、安全和 release 规则。 |
| [GOVERNANCE.md](GOVERNANCE.md) | 角色、决策、triage、repository protection 和规则修改。 |
| [SECURITY.md](SECURITY.md) | 私密漏洞报告、security boundary 和 credential rotation。 |
| [SUPPORT.md](SUPPORT.md) | Support channel、安全报告规则和 response 预期。 |
| [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) | GitHub-to-npm automation 和 `NPM_TOKEN` setup。 |
| [RELEASE_POLICY.md](RELEASE_POLICY.md) | Immutable release 和 hardening 控制。 |
| [NOTICE.md](NOTICE.md) | 第三方 declaration attribution。 |

## 安全

不要将 Telegram token 或 npm 凭证提交到版本控制。使用环境变量或机密管理器。有关安全策略和发布加固，请参见 [SECURITY.md](SECURITY.md) 和 [RELEASE_POLICY.md](RELEASE_POLICY.md)。

## 许可证

MIT。参见 [LICENSE](LICENSE)。
