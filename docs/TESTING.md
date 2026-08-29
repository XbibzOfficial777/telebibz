# Testing guide (English)

Test telebibz bots fully offline: fake the transport, craft updates, assert outgoing calls, and drive whole conversations end to end.

## Contents

1. [The testing subpath](#1-the-testing-subpath)
2. [MockTransport](#2-mocktransport)
3. [Driving updates through the bot](#3-driving-updates-through-the-bot)
4. [Asserting outgoing calls](#4-asserting-outgoing-calls)
5. [Testing wizards end to end](#5-testing-wizards-end-to-end)
6. [Testing file downloads](#6-testing-file-downloads)
7. [Testing webhooks](#7-testing-webhooks)
8. [Testing error paths](#8-testing-error-paths)
9. [Vitest / Jest patterns](#9-vitest--jest-patterns)

## 1. The testing subpath

Everything ships from `@xbibzlibrary/telebibz/testing`:

```ts
import { MockTransport, createTestBot, createMockUpdate, createMockCallbackUpdate, createMockContext } from "@xbibzlibrary/telebibz/testing";
```

- `createTestBot()` → `{ bot, transport }` — a `Bot` wired to a `MockTransport`, branding off.
- `createMockUpdate(overrides?)` → a plain text `/start` message update.
- `createMockCallbackUpdate(overrides?)` → a callback-query update.
- `createMockContext(bot, update?)` → a `Context` without routing anything.

## 2. MockTransport

`MockTransport` records every outgoing request and answers from configured responses:

```ts
const { bot, transport } = createTestBot();

transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
transport.respond("sendMessage", { ok: true, result: { message_id: 1, date: 0, chat: { id: 1, type: "private" } } });
transport.respond("getFile", (payload) => ({                                   // dynamic answers
  ok: true,
  result: { file_id: (payload as { file_id: string }).file_id, file_unique_id: "u", file_path: "documents/a.pdf" },
}));
```

Unconfigured methods answer `{ ok: true, result: true }` — enough for calls whose result you ignore.

It also implements the download members:

```ts
transport.downloadBytes = new TextEncoder().encode("file-content");
transport.downloads;            // every file_path passed to download(), in order
transport.fileUrl("a.pdf");     // "mock://files/a.pdf"
```

## 3. Driving updates through the bot

Register handlers, then feed updates — no network, no token:

```ts
bot.on("message", async (ctx) => { await ctx.reply("hi"); });
await bot.init();                       // exactly one getMe, like production

await bot.handleUpdate(createMockUpdate({ message: { ...createMockUpdate().message!, text: "hello" } }));
await bot.handleUpdates([updateA, updateB, updateC]);   // whole batch, parallel across chats
```

To simulate several chats, vary the chat id:

```ts
function textUpdate(updateId: number, chatId: number, text: string) {
  const base = createMockUpdate();
  return { ...base, update_id: updateId, message: { ...base.message!, chat: { id: chatId, type: "private" as const }, text } };
}
```

## 4. Asserting outgoing calls

Every request is recorded in `transport.calls` with its method and payload:

```ts
const replies = transport.calls
  .filter((call) => call.method === "sendMessage")
  .map((call) => (call.payload as { text?: string }).text);

expect(replies).toEqual(["What is your name?", "How old are you?"]);

// Callback keyboards:
const markup = (transport.calls.at(-1)?.payload as { reply_markup?: { inline_keyboard: unknown[][] } }).reply_markup;
expect(markup?.inline_keyboard).toHaveLength(2);
```

## 5. Testing wizards end to end

Feed the conversation one message at a time and assert the replies the user would see:

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask", run: async (flow) => { flow.next(); await flow.ctx.reply("Name?"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`Hi ${flow.ctx.message?.text}!`); } });
bot.useWizard(wizard);
bot.command("start", async (ctx) => { await wizard.run(ctx); });

await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 7, "Alice"));

expect(sentTexts()).toEqual(["Name?", "Hi Alice!"]);
```

Two chats, two independent wizards — interleaved updates stay isolated because same-chat updates serialize:

```ts
await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 8, "/start"));
await bot.handleUpdate(textUpdate(3, 7, "Alice"));
await bot.handleUpdate(textUpdate(4, 8, "Bob"));
expect(sentTexts()).toEqual(["Name?", "Name?", "Hi Alice!", "Hi Bob!"]);
```

## 6. Testing file downloads

```ts
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "photos/pic.jpg" } });
transport.downloadBytes = new TextEncoder().encode("jpeg-bytes");

const file = await bot.downloadFile("F1", { destination: tmpFile });
expect(file.fileName).toBe("pic.jpg");
expect(transport.downloads).toEqual(["photos/pic.jpg"]);
expect(await readFile(tmpFile, "utf8")).toBe("jpeg-bytes");
```

## 7. Testing webhooks

`createWebhookHandler` accepts a real Web `Request`:

```ts
const handler = createWebhookHandler(bot, { secretToken: "s3cret" });

const response = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "s3cret" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(response.status).toBe(200);

// Wrong secret → rejected before any handler runs
const rejected = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "wrong" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(rejected.status).toBe(401);
```

## 8. Testing error paths

```ts
// Telegram rejects the call
transport.respond("sendMessage", { ok: false, error_code: 400, description: "Bad Request: chat not found" });
await expect(ctx.reply("hi")).rejects.toThrow(/chat not found/);

// A handler throws — assert the error boundary saw it
const errors: unknown[] = [];
bot.events.on("update:error", ({ error }) => errors.push(error));
bot.onText("boom", async () => { throw new Error("boom"); });
await bot.handleUpdate(textUpdate(1, 7, "boom"));
expect(errors).toHaveLength(1);

// handlerTimeout: hung updates reject with UpdateTimeoutError while the handler keeps running
const slow = new Bot({ token: "123456:TEST", transport, handlerTimeout: 50, branding: false, logger: { level: "silent" } });
let finished = false;
slow.on("message", async () => { await sleep(200); finished = true; });
await expect(slow.handleUpdate(createMockUpdate())).rejects.toBeInstanceOf(UpdateTimeoutError);
// later:
expect(finished).toBe(true);
```

## 9. Vitest / Jest patterns

**Silence the logger in tests** — `logger: { level: "silent" }` emits nothing (regression-tested):

```ts
const bot = new Bot({ token: "123456:TEST", transport, branding: false, logger: { level: "silent" } });
```

**Fresh transport per test** — never share state between cases:

```ts
beforeEach(() => { ({ bot, transport } = createTestBot()); });
```

**Fast-forwarding time** — for `Scheduler`/TTL tests use fake timers or small intervals (`1ms`); the cron parser is pure and testable without timers:

```ts
import { nextCronOccurrence, parseCronExpression } from "@xbibzlibrary/telebibz";
expect(parseCronExpression("*/15 * * * *")).toBeDefined();
expect(nextCronOccurrence("0 9 * * 1", new Date("2026-08-29T00:00:00Z")).toISOString()).toContain("T09:00");
```

**Run the suite**: `npm test` — E2E tests requiring a real token are skipped automatically when `TELEGRAM_BOT_TOKEN` is absent.

Bahasa Indonesia: [TESTING.id.md](TESTING.id.md) · 简体中文: [TESTING.zh-CN.md](TESTING.zh-CN.md)
