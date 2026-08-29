/**
 * Micro-benchmarks for the telebibz update pipeline.
 *
 * Run with `npm run benchmark`. Everything runs against the in-memory
 * `MockTransport` from the testing subpath, so no bot token, network access,
 * or Telegram servers are involved; the numbers measure the library itself
 * (router dispatch, context construction, chat-chain serialization,
 * webhook request handling, and broadcast fan-out).
 */
import { performance } from "node:perf_hooks";
import { Bot, createWebhookHandler } from "../src/index.js";
import { createMockUpdate, MockTransport, type Update } from "../src/testing.js";
import type { User } from "../src/api/types.js";

function makeBot(options: { chats: number } & Record<string, unknown> = { chats: 1 }): { bot: Bot; transport: MockTransport } {
  const transport = new MockTransport();
  transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "BenchBot", username: "bench_bot" } satisfies User });
  transport.respond("sendMessage", { ok: true, result: { message_id: 1, date: 0, chat: { id: 1, type: "private" } } });
  const bot = new Bot({
    token: "123456:BENCH_TOKEN",
    transport,
    branding: false,
    logger: { level: "silent" },
    ...options,
  });
  return { bot, transport };
}

function updatesFor(chats: number, count: number, text = "hello"): Update[] {
  const updates: Update[] = [];
  for (let i = 0; i < count; i += 1) {
    const base = createMockUpdate();
    updates.push({
      ...base,
      update_id: i + 1,
      message: { ...base.message!, chat: { id: (i % chats) + 1, type: "private" }, text },
    });
  }
  return updates;
}

async function timePhase<T>(label: string, unit: string, count: number, run: () => Promise<T>): Promise<number> {
  const started = performance.now();
  await run();
  const elapsedMs = performance.now() - started;
  const perSecond = elapsedMs > 0 ? (count / elapsedMs) * 1_000 : Number.POSITIVE_INFINITY;
  console.log(`  ${label.padEnd(48)} ${count.toLocaleString("en-US")} ${unit} in ${elapsedMs.toFixed(1).padStart(8)} ms  (${perSecond.toFixed(0).padStart(8)} ${unit}/s)`);
  return perSecond;
}

async function main(): Promise<void> {
  console.log("telebibz benchmark — library-only, MockTransport, no network\n");

  // Phase 1: full pipeline (router + middleware + context) across 1000 chats.
  {
    const { bot } = makeBot();
    bot.use(async (_ctx, next) => { await next(); });
    bot.on("message", async () => { /* handler only, no API call */ });
    await bot.init();
    const updates = updatesFor(1_000, 20_000);
    await bot.handleUpdates(updates.slice(0, 1_000)); // warmup
    await timePhase("update pipeline, 1000 chats (parallel across chats)", "updates", 20_000, async () => {
      await bot.handleUpdates(updates);
    });
    await bot.stop();
  }

  // Phase 2: single chat — every update serializes on the chat chain.
  {
    const { bot } = makeBot();
    bot.on("message", async () => { /* handler only */ });
    await bot.init();
    const updates = updatesFor(1, 5_000);
    await bot.handleUpdates(updates.slice(0, 500)); // warmup
    await timePhase("update pipeline, 1 chat (per-chat chain serialization)", "updates", 5_000, async () => {
      await bot.handleUpdates(updates);
    });
    await bot.stop();
  }

  // Phase 3: router matching cost — command + filter + regex routes installed.
  {
    const { bot } = makeBot();
    bot.command("start", async () => {});
    bot.on("message:photo", async () => {});
    bot.onRegex(/^order:(\d+)$/, async () => {});
    bot.hears("hello", async () => {});
    bot.on("message", async () => {});
    await bot.init();
    const mixed: Update[] = [];
    const base = createMockUpdate();
    for (let i = 0; i < 10_000; i += 1) {
      if (i % 3 === 0) mixed.push({ ...base, update_id: i, message: { ...base.message!, text: "/start" } });
      else if (i % 3 === 1) mixed.push({ ...base, update_id: i, message: { ...base.message!, text: `order:${i}` } });
      else mixed.push({ ...base, update_id: i, message: { ...base.message!, text: "hello" } });
    }
    await bot.handleUpdates(mixed.slice(0, 500)); // warmup
    await timePhase("router dispatch, 4 routes (command/regex/hears/filter)", "updates", 10_000, async () => {
      await bot.handleUpdates(mixed);
    });
    await bot.stop();
  }

  // Phase 4: webhook request → JSON parse → verify → handleUpdate → response.
  {
    const { bot } = makeBot();
    bot.on("message", async () => {});
    await bot.init();
    const handler = createWebhookHandler(bot, { secretToken: undefined });
    const body = JSON.stringify(createMockUpdate());
    const makeRequest = () => new Request("https://example.com/webhook", { method: "POST", headers: { "content-type": "application/json" }, body });
    await handler(makeRequest()); // warmup
    await timePhase("webhook handler round trip (Request → Response)", "requests", 10_000, async () => {
      for (let i = 0; i < 10_000; i += 1) {
        const response = await handler(makeRequest());
        if (response.status !== 200) throw new Error(`unexpected status ${response.status}`);
      }
    });
    await bot.stop();
  }

  // Phase 5: broadcast fan-out to 1000 chats through the API client.
  {
    const { bot } = makeBot();
    await bot.init();
    const ids = Array.from({ length: 1_000 }, (_value, index) => index + 1);
    await bot.broadcast(ids, (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "bench" })); // warmup
    await timePhase("broadcast, 1000 chats (retry-free happy path)", "messages", 1_000, async () => {
      await bot.broadcast(ids, (chatId) => bot.api.methods.sendMessage({ chat_id: chatId, text: "bench" }));
    });
    await bot.stop();
  }

  console.log("\ndone.");
}

await main();
