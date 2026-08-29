# Telebibz 入门

本指南帮助新开发者在几分钟内完成安装并运行 Telegram bot。

## 1. 创建 bot token

通过 Telegram 官方 bot 管理账号创建 bot，并将 token 保存在部署环境中。不要把 token 提交到 source control。

## 2. 安装 Telebibz

```bash
mkdir my-telebibz-bot && cd my-telebibz-bot
npm init -y
npm install @xbibzlibrary/telebibz
npm install --save-dev tsx typescript
```

请使用 secret manager，或在 shell 中设置变量：

```bash
export TELEGRAM_BOT_TOKEN="<your-bot-token>"
```

## 3. 编写第一个 bot

创建 `index.ts`：

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required.");

const bot = new Bot(token);
bot.command("start", async (ctx) => { await ctx.reply("Telebibz is working."); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
```

运行：

```bash
npx tsx index.ts
```

向 bot 发送 `/start` 或 `ping`。终端会显示 Telebibz branding 和 structured logs。如果日志会被 log collector 读取，请将 logger format 设置为 `json`。

## 4. 添加多步骤 wizard

当回复需要继续处理 active step 时，使用 `Wizard` 和 `bot.useWizard()`。使用 `wizard.run(ctx)` 显式开始 flow：

```ts
const wizard = new Wizard()
  .step({ id: "name", run: async (flow) => {
    flow.set("name", flow.ctx.message?.text?.trim()).next();
    await flow.ctx.reply("How old are you?");
  }})
  .step({ id: "age", run: async (flow) => {
    const age = Number(flow.ctx.message?.text?.trim());
    if (!Number.isInteger(age)) { await flow.ctx.reply("Send a whole number."); return; }
    flow.set("age", age).next();
    await flow.ctx.reply("Registration complete.");
  }});

bot.useWizard(wizard);
bot.command("register", async (ctx) => {
  await wizard.run(ctx);
  await ctx.reply("What is your name?");
});
```

default conversation manager 会在 wizard instance 生命周期内持续使用，key 会根据 chat 和 sender identity 生成。默认情况下，`/cancel` 会取消 active flow。

## 5. Production checklist

Webhook 使用 HTTPS，验证 Telegram webhook secret，将 token 保存到 secret manager，配置 structured JSON logs，添加 health checks；如果 session 必须跨重启保留，请使用 persistent storage。部署前运行 `npm run typecheck`、`npm run test:types`、`npm run test:examples`、`npm test`、`npm run build` 和 `npm run security`。

## 下一步

- [Runnable examples](../examples/README.md)
- [完整 API 参考](API.zh-CN.md)
- [文件：上传与下载](FILES.zh-CN.md)
- [错误处理与限流](ERRORS.zh-CN.md)
- [Webhook 部署](WEBHOOK.zh-CN.md)
- [离线测试你的 bot](TESTING.zh-CN.md)
- [从 Telegraf 迁移](MIGRATION_TELEGRAF.zh-CN.md)
- [生产实战手册](COOKBOOK.zh-CN.md)
- [贡献指南](../CONTRIBUTING.md)
