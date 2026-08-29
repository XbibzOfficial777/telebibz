# 生产实战手册（简体中文）

真实 bot 所需功能的完整、已验证配方：按用户限流、鉴权中间件、广播、定时任务、后台队列、分页菜单、表单、缓存、Mini App 校验与支付。每个配方自成一体 —— 复制进你的 bot 后改名即可。

## 目录

1. [按用户限流](#1-按用户限流)
2. [鉴权中间件（白名单 / 仅管理员）](#2-鉴权中间件白名单--仅管理员)
3. [向数千用户广播](#3-向数千用户广播)
4. [定时消息（间隔、单次、cron）](#4-定时消息间隔单次cron)
5. [带重试的后台任务](#5-带重试的后台任务)
6. [分页菜单](#6-分页菜单)
7. [权限感知菜单](#7-权限感知菜单)
8. [带校验的多步表单](#8-带校验的多步表单)
9. [编辑消息与内联键盘](#9-编辑消息与内联键盘)
10. [缓存昂贵结果](#10-缓存昂贵结果)
11. [Mini App initData 校验](#11-mini-app-initdata-校验)
12. [Telegram Stars / 账单支付](#12-telegram-stars--账单支付)
13. [结构化日志与指标钩子](#13-结构化日志与指标钩子)

## 1. 按用户限流

`TokenBucketLimiter` 为每个键维护独立桶 —— 以用户或 chat 为键：

```ts
import { Bot, TokenBucketLimiter } from "@xbibzlibrary/telebibz";

const limiter = new TokenBucketLimiter(5, 0.5);   // 突发 5 个，每秒回填 0.5 个（持续速率 = 每 2 秒 1 条）

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
bot.use(async (ctx, next) => {
  const key = `user:${ctx.from?.id ?? "anon"}`;
  const result = limiter.consume(key);
  if (!result.allowed) {
    const seconds = Math.ceil((result.retryAfterMs ?? 1000) / 1000);
    await ctx.reply(`⏳ 请求太频繁，请在 ${seconds} 秒后重试。`);
    return;                                       // 不调用 next()：该更新被丢弃
  }
  await next();
});
```

`consume(key, cost)` 支持加权动作（如上传花 5、文本花 1）。`limiter.clear(key?)` 重置状态。可与传输层 flood gate 组合 —— 限流器约束*你的用户*；flood gate 服从 *Telegram*。

## 2. 鉴权中间件（白名单 / 仅管理员）

```ts
const ADMINS = new Set([Number(process.env.ADMIN_ID)]);
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.use(async (ctx, next) => {
  if (ADMINS.has(ctx.from?.id ?? 0)) return await next();   // 管理员：全放行
  if (ctx.chat?.type === "private") return await next();    // 私聊：放行
  return undefined;                                          // 群组：静默丢弃
});

bot.command("stats", async (ctx) => {                       // 仅管理员路由
  if (!ADMINS.has(ctx.from?.id ?? 0)) return;
  await ctx.reply("机密统计");
});
```

## 3. 向数千用户广播

```ts
const report = await bot.broadcast(
  subscriberIds,
  (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "📰 第 42 期通讯" }),
  {
    concurrency: 64,                       // 下游需要时才设上限（默认：完全并行）
    onProgress: (p) => console.log(`${p.delivered}/${p.total}`),
  },
);

console.log(`已送达 ${report.delivered}/${report.total}，耗时 ${report.durationMs}ms`);
for (const failure of report.failures) {
  console.error(`chat ${failure.chatId}: ${failure.error}`);
}
```

每个 chat 都会尝试；429 精确按 Telegram 指示的 `retry_after` 重试。失败从不中断整体 —— 全部落入报告。

## 4. 定时消息（间隔、单次、cron）

```ts
import { Scheduler, parseCronExpression, nextCronOccurrence } from "@xbibzlibrary/telebibz";

const scheduler = new Scheduler({ onError: (error, id) => console.error(`任务 ${id} 失败`, error) });

// 每 6 小时
scheduler.every("digest", 6 * 60 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: ADMIN_CHAT, text: "定时摘要" });
});

// 一次性，5 分钟后（提醒模式）
scheduler.after("remind-42", 5 * 60 * 1000, async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "⏰ 提醒！" });
});

// cron：工作日 09:00（五字段表达式）
scheduler.cron("morning", "0 9 * * 1-5", async () => {
  await bot.api.methods.sendMessage({ chat_id: 42, text: "早上好！" });
});

scheduler.cancel("digest");   // 停止单个任务
scheduler.clear();            // 停止全部
```

用于测试与预览的纯函数助手 —— 不涉及定时器：

```ts
parseCronExpression("*/15 * * * *");          // 已校验的字段
nextCronOccurrence("0 9 * * 1", new Date());  // 下次运行时间（Date）
```

## 5. 带重试的后台任务

```ts
import { TaskQueue } from "@xbibzlibrary/telebibz";

const queue = new TaskQueue(
  async (job) => {
    await fetch(`https://api.example.com/process`, { method: "POST", body: JSON.stringify(job.data) });
  },
  { concurrency: 8, retries: 3, backoffMs: 500, maxBackoffMs: 30_000, onError: (error, job) => log.error("任务失败", { job: job.id, error }) },
);

bot.command("process", async (ctx) => {
  const job = queue.add({ url: ctx.message?.text?.split(" ")[1] }, { priority: 10 });  // 高优先级先执行
  await ctx.reply(`已入队任务 ${job.id}`);
});

bot.command("cancel", async (ctx) => {
  const id = ctx.message?.text?.split(" ")[1];
  if (id && queue.cancel(id)) await ctx.reply("已取消");
});
```

## 6. 分页菜单

`MenuController` 一次渲染一页并路由翻页回调：

```ts
import { Bot, MenuController, InlineKeyboard } from "@xbibzlibrary/telebibz";

const products = Array.from({ length: 57 }, (_v, i) => ({ id: i + 1, name: `商品 ${i + 1}` }));

const menu = new MenuController({
  id: "products",
  items: () => products,                 // 或 async () => await db.products()
  pageSize: 10,
  label: (item) => item.name,
  callback: async (item) => { /* 用户选中了一件商品 */ },
  labels: { previous: "◀", next: "▶" },
});

bot.callback("products:*", async (ctx) => {
  // 传入完整的回调数据 —— 控制器需要它自己的 "products:" 前缀。
  const result = await menu.handle(ctx.callbackQuery?.data ?? "");
  if (result === undefined) return void (await ctx.answerCallbackQuery());
  if (result.type === "noop") return void (await ctx.answerCallbackQuery());
  if (result.type === "page") {
    await ctx.reply(`第 ${result.page.page + 1}/${result.page.pageCount} 页`, { reply_markup: result.keyboard });
  } else {
    await ctx.answerCallbackQuery(`已选：${result.item.name}`);
  }
});
bot.command("shop", async (ctx) => {
  const result = await menu.handle("products:page:0");       // "<id>:page:<n>"
  if (result?.type === "page") await ctx.reply("商品：", { reply_markup: result.keyboard });
});
```

## 7. 权限感知菜单

```ts
import { Menu } from "@xbibzlibrary/telebibz";

const menu = new Menu("main")
  .breadcrumb("主页")
  .item({ id: "profile", label: "👤 个人资料", callbackData: "open:profile" })
  .item({ id: "stats", label: "📊 统计", permission: (context) => context.permissions?.includes("admin") ?? false })
  .item({ id: "help", label: "❓ 帮助", url: "https://example.com/help" });

// build() 是异步的：它为给定 context 计算可见性/权限。
const keyboard = await menu.build({ permissions: ["admin"] }, { columns: 1, includeBreadcrumbs: true });
await ctx.reply("主菜单：", { reply_markup: keyboard.build() });
```

`visible` 彻底隐藏条目；`permission` 接收你的 `MenuContext`（`{ userId, permissions }`）。

## 8. 带校验的多步表单

```ts
import { Bot, Form, validators } from "@xbibzlibrary/telebibz";

const registration = new Form({
  name: { parse: validators.string, required: true },
  age: { parse: validators.integer, validate: (age) => (age >= 13 ? undefined : "需满 13 岁") },
  email: { parse: validators.email },
});
```

通过 `Wizard` 步骤或 `ConversationManager` 接线 —— 每条消息填一个字段；`validators` 覆盖 `string`、`number`、`integer`、`email`、`url`，自定义检查返回错误消息。

## 9. 编辑消息与内联键盘

```ts
import { InlineKeyboard } from "@xbibzlibrary/telebibz";

bot.action("vote:up", async (ctx) => {
  votes += 1;
  const keyboard = new InlineKeyboard()
    .text(`👍 ${votes}`, "vote:up")
    .text("👎 0", "vote:down")
    .build();
  // 原地替换按钮所在消息的键盘
  await ctx.api.methods.editMessageReplyMarkup({
    chat_id: ctx.chat!.id,
    message_id: ctx.callbackQuery!.message!.message_id,
    reply_markup: keyboard,
  });
  await ctx.answerCallbackQuery();                        // 停止转圈
});
```

`ctx.edit(text, extra)` 改写当前消息的文本（键盘通过 `extra` 中的 `reply_markup` 一并替换）；`editMessageLiveLocation`、`stopPoll` 及完整方法面都在 `ctx.api.methods` 上。按钮数据上限 **64 字节** —— builder 在构造时校验，而不是运行时崩溃。

## 10. 缓存昂贵结果

```ts
import { MemoryCache } from "@xbibzlibrary/telebibz";

const weather = new MemoryCache<string>("weather");   // 命名空间；TTL 按每次写入设置
bot.command("weather", async (ctx) => {
  const city = ctx.message?.text?.split(" ")[1] ?? "北京";
  let text = await weather.get(city);
  if (text === undefined) {
    text = await fetchWeather(city);
    await weather.set(city, text, 5 * 60 * 1000);     // 缓存 5 分钟
  }
  await ctx.reply(text);
});
```

## 11. Mini App initData 校验

```ts
import { validateWebAppInitData } from "@xbibzlibrary/telebibz";

bot.command("app", async (ctx) => {
  await ctx.reply("打开应用：", {
    reply_markup: new InlineKeyboard().webApp("🚀 打开", "https://app.example.com").build(),
  });
});

// 在你应用的后端端点里 —— 校验 Mini App 发来的数据：
app.post("/api/data", express.json(), (req, res) => {
  try {
    const initData = validateWebAppInitData(req.body.initData, process.env.TELEGRAM_BOT_TOKEN!, 3600);
    res.json({ user: initData.user, ok: true });      // 签名 + 新鲜度已验证
  } catch {
    res.status(401).json({ ok: false });
  }
});
```

`validateWebAppInitData` 检查 HMAC 签名与 `auth_date` 新鲜度窗口（默认 24 小时；此处 1 小时）。

## 12. Telegram Stars / 账单支付

```ts
import { Bot, PaymentsClient, InlineKeyboard } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const payments = new PaymentsClient(bot.api);

// 可在任何地方使用的链接（简介、网站、聊天）
const link = await payments.createInvoiceLink({
  title: "Premium",
  description: "30 天会员",
  payload: "premium-30d",
  currency: "XTR",
  prices: [{ label: "Premium", amount: 100 }],
});
await ctx.reply(`在此支付：${link}`);

// 聊天内账单 + 预检 + 支付成功
bot.on("pre_checkout_query", async (ctx) => {
  const query = ctx.update.pre_checkout_query;
  if (!query) return;
  await ctx.api.methods.answerPreCheckoutQuery({ pre_checkout_query_id: query.id, ok: true });
});
bot.on("message:successful_payment", async (ctx) => {
  await ctx.reply("✅ 已收到付款，谢谢！");
});

// Stars 流水与退款
const history = await payments.getStarTransactions({ limit: 50 });
await payments.refundStarPayment({ user_id: userId, telegram_payment_charge_id: "charge-id" });
```

## 13. 结构化日志与指标钩子

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  logger: { level: "info", format: "json" },   // 供采集系统消费的机器可读日志行
});

bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) console.warn(JSON.stringify({ event: "slow_api", method, durationMs }));
});
bot.events.on("update:error", ({ error }) => {
  console.error(JSON.stringify({ event: "handler_error", error: String(error) }));
});
```

敏感值（token、手机号）自动脱敏；确有需要时用 `includeUpdateContent: true` 开启消息文本记录。

English: [COOKBOOK.md](COOKBOOK.md) · Bahasa Indonesia: [COOKBOOK.id.md](COOKBOOK.id.md)
