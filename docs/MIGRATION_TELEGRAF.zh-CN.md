# 从 Telegraf 迁移（简体中文）

telebibz 有意实现了 Telegraf 的 context 表面与启动选项，因此大多数 handler 只需极少改动即可移植。本指南把 Telegraf bot 的每个部分映射到 telebibz 对应物。

## 目录

1. [并排对照：完整 bot](#1-并排对照完整-bot)
2. [概念映射](#2-概念映射)
3. [Context 方法](#3-context-方法)
4. [启动选项](#4-启动选项)
5. [Scenes → Wizards](#5-scenes--wizards)
6. [会话存储](#6-会话存储)
7. [Webhook](#7-webhook)
8. [没有直接对应物的部分](#8-没有直接对应物的部分)

## 1. 并排对照：完整 bot

**Telegraf**

```ts
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => { console.time("update"); await next(); console.timeEnd("update"); });
bot.start((ctx) => ctx.reply("Welcome!"));
bot.command("help", (ctx) => ctx.reply("Help"));
bot.action("menu:open", async (ctx) => { await ctx.answerCbQuery(); await ctx.reply("Menu"); });
bot.on("message", (ctx) => ctx.reply("got it"));
bot.catch((error) => console.error(error));

bot.launch({ dropPendingUpdates: true });
```

**telebibz**

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => { console.time("update"); await next(); console.timeEnd("update"); });
bot.command("start", async (ctx) => { await ctx.reply("Welcome!"); });   // 具名命令，而非 bot.start()
bot.command("help", async (ctx) => { await ctx.reply("Help"); });
bot.action("menu:open", async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply("Menu"); });
bot.on("message", async (ctx) => { await ctx.reply("got it"); });
bot.catch(async (error) => { console.error(error); });

await bot.launch({ dropPendingUpdates: true });   // 选项名相同
```

只有两处机械差异：`bot.start(handler)` 变为 `bot.command("start", handler)`；`answerCbQuery()` 变为 `answerCallbackQuery()`。

## 2. 概念映射

| Telegraf | telebibz | 说明 |
|---|---|---|
| `new Telegraf(token)` | `new Bot(token)` 或 `new Bot({ token, ... })` | |
| `bot.launch()` | `bot.launch()` / `bot.start()` | `launch` 上显式声明 `mode: "polling"` |
| `bot.stop()` | `bot.stop()` | telebibz 先排空在途 handler |
| `bot.use(mw)` | `bot.use(mw)` | 中间件签名相同 `(ctx, next)` |
| `bot.command(name, h)` | `bot.command(name, h)` | |
| `bot.on(filter, h)` | `bot.on(filter, h)` | 过滤语法相同（`message:photo`、数组） |
| `bot.hears(trigger, h)` | `bot.hears(trigger, h)` | 字符串与 RegExp |
| `bot.action(pattern, h)` | `bot.action(pattern, h)` | `bot.callback` 的直接别名 |
| `bot.catch(handler)` | `bot.catch(handler)` | 接收 `(error, ctx)` |

## 3. Context 方法

Telegraf context 的每个快捷方法都在 —— 包括 Telegraf 留给插件的那部分：

- **回复**：`reply`、`replyWithPhoto`、`replyWithDocument`、`replyWithVideo`、`replyWithAudio`、`replyWithVoice`、`replyWithAnimation`、`replyWithVideoNote`、`replyWithSticker`、`replyWithMediaGroup`、`replyWithLocation`、`replyWithVenue`、`replyWithContact`、`replyWithPoll`、`replyWithQuiz`、`replyWithDice`、`replyWithGame`、`replyWithInvoice`、`replyWithHTML`、`replyWithMarkdown`（+V2）
- **管理/群管**：`banChatMember`、`unbanChatMember`、`restrictChatMember`、`promoteChatMember`、`banChatSenderChat`、`unbanChatSenderChat`
- **聊天**：`setChatTitle`、`setChatDescription`、`setChatPhoto`、`deleteChatPhoto`、`setChatPermissions`、`leaveChat`、`unpinAllChatMessages`、`setChatStickerSet`、`deleteChatStickerSet`
- **信息**：`getChat`、`getChatAdministrators`、`getChatMemberCount`、`getChatMember`
- **邀请链接/加群申请**：`exportChatInviteLink`、`createChatInviteLink`、`editChatInviteLink`、`revokeChatInviteLink`、`approveChatJoinRequest`、`declineChatJoinRequest`
- **实时位置/投票/游戏**：`editMessageLiveLocation`、`stopMessageLiveLocation`、`stopPoll`、`setGameScore`、`getGameHighScores`
- **论坛**：完整话题方法集（`createForumTopic` … `unhideGeneralForumTopic`）
- **超越 Telegraf 核心的新增**：`getFile`（带类型）、`downloadFile`、`edit`（改写当前消息文本），以及从包根导出的独立助手 —— `validateUpload`/`assertValidUpload` —— 它们不是 context 方法

移植时需修正的命名差异：`answerCbQuery` → `answerCallbackQuery`；`ctx.telegram` → `ctx.api`；键盘助手来自包根（`InlineKeyboard`、`ReplyKeyboard`、`removeKeyboard`、`forceReply`）而非 `Markup`。

## 4. 启动选项

| Telegraf | telebibz |
|---|---|
| `launch({ dropPendingUpdates })` | `launch({ dropPendingUpdates })` —— 完全相同 |
| `handlerTimeout`（默认 90 000） | `handlerTimeout`（默认 90 000；`0` 禁用） |
| `contextType` 选项 | `contextType` 选项 —— 你的 `Context` 子类会为每个更新实例化 |
| `webhookReply`（按更新） | 处理器 / `handleUpdate` 选项上的 `webhookReply` |
| `telegraf.use(session(...))` | `new Bot({ session: new MemoryStorage() })`（或 JSON/Redis/SQL/Mongo） |

## 5. Scenes → Wizards

Telegraf 的 `WizardScene` + `Stage` 变成单个 `Wizard`：显式步骤、无全局 session 键：

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask-name", run: async (flow) => { flow.next(); await flow.ctx.reply("名字？"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`你好 ${flow.ctx.message?.text}！`); } });

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.useWizard(wizard);                                    // 取代 Stage 中间件
bot.command("start", async (ctx) => { await wizard.run(ctx); }); // 取代 scene.enter()
```

- 向导键自动由 chat + 发送者派生 —— 无需手工管理键。
- `flow.set(key, value)` / `flow.get(key)` 取代 `ctx.scene.session`。
- `/cancel` 取消；最后一步完成后对话自动收尾。
- 非线性流程图请用 `ConversationManager` 配合 router 组合（telebibz 刻意把场景编排留给应用；见 FEATURE_MATRIX 的 "Design decisions"）。

## 6. 会话存储

Telegraf 默认把会话放在内存，持久化需要 store 插件。telebibz 在构造函数上接收 storage —— 换适配器，不换代码：

```ts
import { Bot, MemoryStorage, JsonFileStorage, RedisStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),   // 或 MemoryStorage / RedisStorage / SqlStorage / MongoStorage
});
```

每个适配器的完整接线配方：[STORAGE.zh-CN.md](STORAGE.zh-CN.md)。

## 7. Webhook

```ts
// Telegraf: webhookCallback(bot, app)
// telebibz: 框架需显式指定
import { webhookCallback } from "@xbibzlibrary/telebibz";
app.post("/telegram", webhookCallback(bot, "express", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET }));
```

`createWebhookHandler()` 另外提供 Web 标准 `Request → Response` 处理器，适配 Bun/Deno/edge。完整部署指南：[WEBHOOK.zh-CN.md](WEBHOOK.zh-CN.md)。

## 8. 没有直接对应物的部分

- **`bot.telegram` 底层客户端** —— 使用 `bot.api`（`call`、`raw`、`methods`、`downloadFile`）；flood gate 与重试内置于传输层，不能按调用配置。
- **Telegraf 插件生态** —— 把插件移植为带显式生命周期（`install`、`onStop`、`dispose`）的 `Plugin` 对象；插件管理器可干净重启。
- **`Composer.mount`/动态 scene** —— 改用 `Router` 嵌套与 `matchMode: "all"` 组合。
- **Markup 链式助手**（`Markup.keyboard(...).resize()`） —— 使用 `new ReplyKeyboard().text("A").resized().build()`；负载相同，builder 风格。

English: [MIGRATION_TELEGRAF.md](MIGRATION_TELEGRAF.md) · Bahasa Indonesia: [MIGRATION_TELEGRAF.id.md](MIGRATION_TELEGRAF.id.md)
