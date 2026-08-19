# telebibz

![telebibz 徽标](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-logo.png)

**`@xbibzlibrary/telebibz`** 是一个面向 Node.js 和 TypeScript 的 Telegram Bot SDK 和框架。该包提供 API 客户端、轮询、路由器、中间件、上下文、键盘构造器、状态/会话、Webhook 处理、队列、调度器、缓存、插件生命周期、CLI 以及测试工具。

[English](README.md) · [Bahasa Indonesia](README.id.md) · **简体中文**

完整 API 参考：[English](docs/API.md) · [Indonesia](docs/API.id.md) · **中文**

GitHub Packages 指南：[English](docs/GITHUB_PACKAGES.md) · [Bahasa Indonesia](docs/GITHUB_PACKAGES.id.md) · [简体中文](docs/GITHUB_PACKAGES.zh-CN.md)

![telebibz 概览](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

## 安装

```bash
npm install @xbibzlibrary/telebibz
```

需要 Node.js **20 或更高版本**。

## 简单机器人

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", (ctx) => ctx.reply("Bot aktif."));
bot.onText("ping", (ctx) => ctx.reply("pong"));

await bot.start();
```

`Bot.start()` 会运行长轮询。要手动管理生命周期，请使用 `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, 或 `restart()`。

## 路由器与中间件

```ts
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`processed in ${Date.now() - started}ms`);
});

bot.command("help", (ctx) => ctx.reply("Bantuan tersedia."));
bot.onRegex(/^order:(\\d+)$/, (ctx) => ctx.reply("Order diterima."));
bot.callback("profile:*", (ctx) => ctx.answerCallbackQuery("Dibuka."));
```

路由器支持命令、文本、正则、回调模式、自定义谓词、嵌套路由器、每条路由的中间件，以及路由优先级。

## Telegram API

通过 API 客户端可以使用生成的方法调用和原始调用：

```ts
await bot.api.methods.getMe();
await bot.api.methods.sendMessage({ chat_id: 123456789, text: "Halo." });
await bot.api.call("sendMessage", { chat_id: 123456789, text: "Halo." });
await bot.api.raw("futureTelegramMethod", { value: true });
```

内置传输使用 `fetch`，支持超时、重试、指数退避、JSON 载荷和多部分上传。

关于每个 class、function、method、type、error、lifecycle、CLI 命令和生成的 Telegram 方法的完整 API 参考请参见 [`docs/API.zh-CN.md`](docs/API.zh-CN.md)。

## 键盘

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

const keyboard = new InlineKeyboard()
  .text("Profil", "profile")
  .url("Dokumentasi", "https://core.telegram.org/bots/api")
  .build();

await ctx.reply("Pilih menu:", { reply_markup: keyboard });
```

构造器仅生成 Telegram 原生键盘的 payload。HTML/CSS 的 UI 需要单独的 Mini App 或 Web App。

## Startup and terminal logs

This package starts directly after Telegram API connectivity is established. The terminal prints a boxed telebibz attribution, an animated startup status when attached to a TTY, and structured colorful logs for lifecycle, API, polling, webhook, and update events. Set logger format to `json` for machine ingestion.

## Webhook

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

`createWebhookHandler` 接受标准 Web `Request` 并返回 `Response`。处理程序会验证 secret token、body 大小、JSON 解析以及重复更新处理。

## 状态、队列、调度器和缓存

该包提供带 TTL 和原子更新的 `MemoryStorage`、`JsonFileStorage`、`RedisStorage`、`SqlStorage`、`MongoStorage`、bot session、基于 Storage 的 conversation/form、基于 permission 的菜单、`MenuController` 分页、`MemoryCache`、令牌桶限流器、支持重试/退避/并发/延迟/取消的任务队列，以及间隔、一次性和完整五字段 cron 的调度器。Redis、SQL 和 Mongo 适配器使用小型 driver interface，因此 core package 不需要 vendor runtime dependency。

## CLI

每个 `telebibz` command 都会显示带颜色的 Unicode branding box，其中包含 `Library Bot Telegram By @xbibzofficial`。CLI 不会打印 developer target。

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
```

也可以在应用中打印相同的 terminal branding：

```ts
import { printTerminalBranding } from "@xbibzlibrary/telebibz";

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

## API 目标与限制

方法列表会在 schema 更新时根据 Telegram Bot API 文档生成。检测到的官方方法都可以运行时访问，而专门的参数/结果推断主要集中在 core method map。完整的 Telegram object、union、enum 和 method declaration 可通过 `TelegramTypes` 使用。有关实现状态请参见 [FEATURE_MATRIX.md](FEATURE_MATRIX.md)，完整 API 请参见 `docs/API.zh-CN.md`。

## 发布自动化

GitHub repository 提供 CI 和自动发布 workflow。每次推送到 `main` 都会运行 quality gates，选择尚未使用的 patch version，创建 commit 和 tag，将 package 发布到 npmjs，然后创建 GitHub Release。由于 source repository 是 private，npmjs 发布使用 `--provenance=false`。如果以后创建了 scope 为 `xbibzlibrary` 的 GitHub organization，GitHub Packages 可以作为独立选项启用。依赖自动发布前，请在 GitHub Actions 中配置 `NPM_TOKEN` secret。请参阅 [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) 和 [GitHub Packages 指南](docs/GITHUB_PACKAGES.zh-CN.md)。

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
