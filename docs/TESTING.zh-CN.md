# 测试指南（简体中文）

完全离线地测试 telebibz bot：伪造传输层、构造更新、断言外发调用，并端到端驱动整段对话。

## 目录

1. [testing 子路径](#1-testing-子路径)
2. [MockTransport](#2-mocktransport)
3. [把更新送进 bot](#3-把更新送进-bot)
4. [断言外发调用](#4-断言外发调用)
5. [端到端测试向导](#5-端到端测试向导)
6. [测试文件下载](#6-测试文件下载)
7. [测试 webhook](#7-测试-webhook)
8. [测试错误路径](#8-测试错误路径)
9. [Vitest / Jest 模式](#9-vitest--jest-模式)

## 1. testing 子路径

所有工具都从 `@xbibzlibrary/telebibz/testing` 导出：

```ts
import { MockTransport, createTestBot, createMockUpdate, createMockCallbackUpdate, createMockContext } from "@xbibzlibrary/telebibz/testing";
```

- `createTestBot()` → `{ bot, transport }` —— 连接到 `MockTransport` 的 `Bot`，branding 已关闭。
- `createMockUpdate(overrides?)` → 一条普通 `/start` 文本消息更新。
- `createMockCallbackUpdate(overrides?)` → 一条回调查询更新。
- `createMockContext(bot, update?)` → 不经过路由的 `Context`。

## 2. MockTransport

`MockTransport` 记录每个外发请求，并按配置应答：

```ts
const { bot, transport } = createTestBot();

transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
transport.respond("sendMessage", { ok: true, result: { message_id: 1, date: 0, chat: { id: 1, type: "private" } } });
transport.respond("getFile", (payload) => ({                                   // 动态应答
  ok: true,
  result: { file_id: (payload as { file_id: string }).file_id, file_unique_id: "u", file_path: "documents/a.pdf" },
}));
```

未配置的方法应答 `{ ok: true, result: true }` —— 对结果无所谓的调用足够了。

它还实现了下载成员：

```ts
transport.downloadBytes = new TextEncoder().encode("file-content");
transport.downloads;            // 每个传给 download() 的 file_path，按顺序
transport.fileUrl("a.pdf");     // "mock://files/a.pdf"
```

## 3. 把更新送进 bot

注册 handler，然后投喂更新 —— 无网络、无 token：

```ts
bot.on("message", async (ctx) => { await ctx.reply("hi"); });
await bot.init();                       // 恰好一次 getMe，与生产一致

await bot.handleUpdate(createMockUpdate({ message: { ...createMockUpdate().message!, text: "hello" } }));
await bot.handleUpdates([updateA, updateB, updateC]);   // 整批投喂，跨 chat 并行
```

模拟多个 chat 时，变换 chat id：

```ts
function textUpdate(updateId: number, chatId: number, text: string) {
  const base = createMockUpdate();
  return { ...base, update_id: updateId, message: { ...base.message!, chat: { id: chatId, type: "private" as const }, text } };
}
```

## 4. 断言外发调用

每个请求连同 method 与 payload 记录在 `transport.calls`：

```ts
const replies = transport.calls
  .filter((call) => call.method === "sendMessage")
  .map((call) => (call.payload as { text?: string }).text);

expect(replies).toEqual(["你叫什么名字？", "你多大了？"]);

// 回调键盘：
const markup = (transport.calls.at(-1)?.payload as { reply_markup?: { inline_keyboard: unknown[][] } }).reply_markup;
expect(markup?.inline_keyboard).toHaveLength(2);
```

## 5. 端到端测试向导

逐条消息推进对话，并断言用户将看到的回复：

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask", run: async (flow) => { flow.next(); await flow.ctx.reply("你叫什么名字？"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`你好，${flow.ctx.message?.text}！`); } });
bot.useWizard(wizard);
bot.command("start", async (ctx) => { await wizard.run(ctx); });

await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 7, "小明"));

expect(sentTexts()).toEqual(["你叫什么名字？", "你好，小明！"]);
```

两个 chat、两个独立向导 —— 交错投喂依然隔离，因为同一 chat 的更新按序串行：

```ts
await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 8, "/start"));
await bot.handleUpdate(textUpdate(3, 7, "小明"));
await bot.handleUpdate(textUpdate(4, 8, "小红"));
expect(sentTexts()).toEqual(["你叫什么名字？", "你叫什么名字？", "你好，小明！", "你好，小红！"]);
```

## 6. 测试文件下载

```ts
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "photos/pic.jpg" } });
transport.downloadBytes = new TextEncoder().encode("jpeg-bytes");

const file = await bot.downloadFile("F1", { destination: tmpFile });
expect(file.fileName).toBe("pic.jpg");
expect(transport.downloads).toEqual(["photos/pic.jpg"]);
expect(await readFile(tmpFile, "utf8")).toBe("jpeg-bytes");
```

## 7. 测试 webhook

`createWebhookHandler` 接受真实的 Web `Request`：

```ts
const handler = createWebhookHandler(bot, { secretToken: "s3cret" });

const response = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "s3cret" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(response.status).toBe(200);

// 错误 secret → 在任何 handler 运行前被拒绝
const rejected = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "wrong" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(rejected.status).toBe(401);
```

## 8. 测试错误路径

```ts
// Telegram 拒绝调用
transport.respond("sendMessage", { ok: false, error_code: 400, description: "Bad Request: chat not found" });
await expect(ctx.reply("hi")).rejects.toThrow(/chat not found/);

// handler 抛异常 —— 断言错误边界看到了它
const errors: unknown[] = [];
bot.events.on("update:error", ({ error }) => errors.push(error));
bot.onText("boom", async () => { throw new Error("boom"); });
await bot.handleUpdate(textUpdate(1, 7, "boom"));
expect(errors).toHaveLength(1);

// handlerTimeout：挂起的更新以 UpdateTimeoutError 拒绝，而 handler 继续运行
const slow = new Bot({ token: "123456:TEST", transport, handlerTimeout: 50, branding: false, logger: { level: "silent" } });
let finished = false;
slow.on("message", async () => { await sleep(200); finished = true; });
await expect(slow.handleUpdate(createMockUpdate())).rejects.toBeInstanceOf(UpdateTimeoutError);
// 稍后：
expect(finished).toBe(true);
```

## 9. Vitest / Jest 模式

**测试中静音 logger** —— `logger: { level: "silent" }` 不输出任何内容（有回归测试）：

```ts
const bot = new Bot({ token: "123456:TEST", transport, branding: false, logger: { level: "silent" } });
```

**每个测试全新 transport** —— 不要在用例间共享状态：

```ts
beforeEach(() => { ({ bot, transport } = createTestBot()); });
```

**快进时间** —— `Scheduler`/TTL 测试用假定时器或小间隔（`1ms`）；cron 解析器是纯函数，无需定时器：

```ts
import { nextCronOccurrence, parseCronExpression } from "@xbibzlibrary/telebibz";
expect(parseCronExpression("*/15 * * * *")).toBeDefined();
expect(nextCronOccurrence("0 9 * * 1", new Date("2026-08-29T00:00:00Z")).toISOString()).toContain("T09:00");
```

**运行套件**：`npm test` —— 缺少 `TELEGRAM_BOT_TOKEN` 时，需要真实 token 的 E2E 测试自动跳过。

English: [TESTING.md](TESTING.md) · Bahasa Indonesia: [TESTING.id.md](TESTING.id.md)
