# telebibz

![telebibz logo](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-logo.png)

[![CI](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml/badge.svg)](https://github.com/XbibzOfficial777/telebibz/actions/workflows/ci.yml)

**`@xbibzlibrary/telebibz`** is a full-scale Telegram Bot SDK and framework for Node.js and TypeScript. It provides a typed API client, polling, routing, middleware, context helpers, keyboard builders, state/session primitives, webhooks, queues, scheduling, caching, plugin lifecycle, approval gates, CLI tooling, and testing utilities.

## Documentation languages

**English (default)** · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh-CN.md)

Complete API references: [English](docs/API.md) · [Indonesia](docs/API.id.md) · [中文](docs/API.zh-CN.md)

![telebibz overview](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

## Installation

```bash
npm install @xbibzlibrary/telebibz
```

Node.js **20 or newer** is required.

## Minimal bot

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("start", (ctx) => ctx.reply("Bot is active."));
bot.onText("ping", (ctx) => ctx.reply("pong"));

await bot.start();
```

`Bot.start()` runs long polling. For manual lifecycle control, use `init()`, `launch({ mode: "polling" })`, `health()`, `stop()`, or `restart()`.

## Router and middleware

```ts
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`processed in ${Date.now() - started}ms`);
});

bot.command("help", (ctx) => ctx.reply("Help is available."));
bot.onRegex(/^order:(\\d+)$/, (ctx) => ctx.reply("Order received."));
bot.callback("profile:", (ctx) => ctx.answerCallbackQuery("Opened."));
```

The router supports commands, exact text, regular expressions, callback patterns, custom predicates, nested routers, per-route middleware, and route priority.

## Telegram API

Generated method access and raw access are available through the API client:

```ts
await bot.api.methods.getMe();
await bot.api.methods.sendMessage({ chat_id: 123456789, text: "Hello." });
await bot.api.call("sendMessage", { chat_id: 123456789, text: "Hello." });
await bot.api.raw("futureTelegramMethod", { value: true });
```

The built-in transport uses `fetch`, timeouts, retries, exponential backoff, JSON payloads, and multipart upload.

## Keyboard builders

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

const keyboard = new InlineKeyboard()
  .text("Profile", "profile")
  .url("Documentation", "https://core.telegram.org/bots/api")
  .build();

await ctx.reply("Choose an option:", { reply_markup: keyboard });
```

Builders produce native Telegram keyboard payloads. HTML/CSS interfaces require a separate Mini App or Web App.

## Owner approval gate

The approval gate pauses regular updates until the owner approves or denies a new bot through inline buttons.

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  approval: {
    ownerChatId: Number(process.env.TELEBIBZ_OWNER_CHAT_ID),
    ownerUserId: Number(process.env.TELEBIBZ_OWNER_USER_ID),
    ownerLabel: "Dev Gantenggg",
    requireApproval: true,
  },
});
```

The library sends the notification to `ownerChatId`, while only `ownerUserId` can decide. Callback data uses a random nonce. For multi-instance deployments, provide a persistent `ApprovalStore`; the default store is in memory.

## Webhook

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

`createWebhookHandler` accepts a standard Web `Request` and returns a `Response`. It verifies the optional secret token, body size, JSON payload, and update shape before calling `bot.handleUpdate()`.

## State, queue, scheduler, and cache

The package provides `MemoryStorage` with TTL and serialized per-key updates, `JsonFileStorage`, `RedisStorage`, `SqlStorage`, `MongoStorage`, persistent approval storage, bot sessions, storage-backed conversations and forms, permission-aware menus, `MenuController` pagination, `MemoryCache`, a token-bucket limiter, a task queue with retry/backoff/concurrency/delay/cancel, and schedulers for intervals, one-shot tasks, and full five-field cron expressions. Redis, SQL, and Mongo adapters use small driver interfaces so the core package remains free of vendor runtime dependencies.

## CLI

```bash
npx telebibz init my-bot
npx telebibz doctor
npx telebibz build
npx telebibz test
```

## Testing

```bash
npm run typecheck
npm run test:types
npm run lint
npm test
npm run build
npm run security
npm run release:check
```

Real Telegram E2E tests require `TELEGRAM_BOT_TOKEN` and `TELEGRAM_TEST_CHAT_ID`. Without credentials, E2E tests are skipped and are not counted as passing.

## Web Apps and payments

`validateWebAppInitData()` verifies Telegram Web App signatures and expiration. `PaymentsClient` provides wrappers for invoice links, invoices, pre-checkout answers, Web App query answers, Stars transactions, and Stars refunds. Use `TelegramTypes` and aliases such as `TelegramUser`, `TelegramMessage`, and `TelegramUpdate` for the vendored full Telegram declaration surface.

## API targets and limitations

The generated method list is derived from the Telegram Bot API schema when it is updated. Runtime access is available for detected official methods, while specialized request/result inference remains concentrated on the core method map. The complete vendored Telegram object, union, enum, and method declarations are available through `TelegramTypes`. See [FEATURE_MATRIX.md](FEATURE_MATRIX.md) for implementation status and [APPROVAL_FEATURE.md](APPROVAL_FEATURE.md) for approval details.

For every exported class, function, method, type, error, lifecycle hook, CLI command, and generated Telegram method, see the [complete English API reference](docs/API.md).

## Release automation

The GitHub repository includes CI and an auto-publish workflow. A push to `main` runs the quality gates, chooses the next unused patch version, commits the version, creates a tag, publishes to npm, and creates a GitHub Release. Because the source repository is private, the workflow uses `--provenance=false`, which npm requires for private source repositories. Configure the `NPM_TOKEN` GitHub Actions secret before relying on automatic publication. See [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md).

## Project policies and contribution

| Document | Purpose |
|---|---|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community behavior, enforcement, reporting, and appeals. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Local setup, branch/commit rules, tests, review, and release workflow. |
| [CONTRIBUTION_RULES.md](CONTRIBUTION_RULES.md) | API, compatibility, testing, dependency, security, and release requirements. |
| [GOVERNANCE.md](GOVERNANCE.md) | Roles, decision-making, triage, repository protection, and amendments. |
| [SECURITY.md](SECURITY.md) | Private vulnerability reporting, threat boundaries, and credential rotation. |
| [SUPPORT.md](SUPPORT.md) | Support channels, safe-reporting rules, and request expectations. |
| [RELEASE_AUTOMATION.md](RELEASE_AUTOMATION.md) | GitHub-to-npm automation and required `NPM_TOKEN` setup. |
| [RELEASE_POLICY.md](RELEASE_POLICY.md) | Immutable release and hardening controls. |
| [NOTICE.md](NOTICE.md) | Third-party declaration attribution. |

Never commit Telegram tokens or npm credentials. Use environment variables or a secret manager. See [SECURITY.md](SECURITY.md) and [RELEASE_POLICY.md](RELEASE_POLICY.md) for security and release hardening policies.

## License

MIT. See [LICENSE](LICENSE).
