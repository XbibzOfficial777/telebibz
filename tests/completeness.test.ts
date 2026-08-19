import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JsonFileStorage, MemoryStorage, MongoStorage, RedisStorage, SqlStorage } from "../src/storage/storage.js";
import { Menu, MenuController } from "../src/state/menu.js";
import { ConversationManager, Wizard } from "../src/state/conversation.js";
import type { Context } from "../src/context/context.js";
import { nextCronOccurrence, parseCronExpression, Scheduler } from "../src/queue/queue.js";
import { createHmac } from "node:crypto";
import { validateWebAppInitData } from "../src/telegram-features.js";
import { buildTerminalBranding } from "../src/branding/terminal.js";
import { createLogger, summarizeUpdate } from "../src/observability/logger.js";

const temporaryDirectories: string[] = [];
afterEach(async () => { while (temporaryDirectories.length) await rm(temporaryDirectories.pop()!, { recursive: true, force: true }); });

describe("persistent storage adapters", () => {
  it("persists JSON storage across instances and keeps TTL metadata", async () => {
    const directory = await mkdtemp(join(tmpdir(), "telebibz-storage-"));
    temporaryDirectories.push(directory);
    const path = join(directory, "state.json");
    const first = new JsonFileStorage<{ count: number }>(path);
    await first.set("session", { count: 1 });
    const second = new JsonFileStorage<{ count: number }>(path);
    await expect(second.get("session")).resolves.toEqual({ count: 1 });
    expect((await readFile(path, "utf8"))).toContain('"count": 1');
  });

  it("supports Redis, SQL, and Mongo driver contracts without vendor dependencies", async () => {
    const redisMap = new Map<string, string>();
    const redis = new RedisStorage<{ value: number }>({
      async get(key) { return redisMap.get(key) ?? null; },
      async set(key, value) { redisMap.set(key, value); },
      async del(key) { return redisMap.delete(key) ? 1 : 0; },
      async exists(key) { return redisMap.has(key) ? 1 : 0; },
      async keys() { return [...redisMap.keys()]; },
    });
    await redis.set("one", { value: 1 });
    await expect(redis.get("one")).resolves.toEqual({ value: 1 });

    const sqlMap = new MemoryStorage<string, { value: number }>();
    const sql = new SqlStorage<{ value: number }>({
      get: (key) => sqlMap.get(key),
      set: (key, value) => sqlMap.set(key, value),
      delete: (key) => sqlMap.delete(key),
      has: (key) => sqlMap.has(key),
      clear: () => sqlMap.clear(),
      async entries() { const values: Array<[string, { value: number }, number | undefined]> = []; for await (const [key, value] of sqlMap.entries()) values.push([key, value, undefined]); return values; },
    });
    await sql.set("one", { value: 2 });
    await expect(sql.get("one")).resolves.toEqual({ value: 2 });

    const mongoMap = new Map<string, { key: string; value: { value: number }; expiresAt?: number }>();
    const mongo = new MongoStorage<{ value: number }>({
      async findOne(filter) { return mongoMap.get(filter.key) ?? null; },
      async replaceOne(filter, document) { mongoMap.set(filter.key, document); },
      async deleteOne(filter) { return { deletedCount: mongoMap.delete(filter.key) ? 1 : 0 }; },
      async deleteMany() { mongoMap.clear(); },
      find() { return { toArray: async () => [...mongoMap.values()] }; },
    });
    await mongo.set("one", { value: 3 });
    await expect(mongo.get("one")).resolves.toEqual({ value: 3 });
  });
});

describe("persistent conversation state", () => {
  it("hydrates a conversation from the injected Storage adapter", async () => {
    const storage = new MemoryStorage<string, { name: string; step: number; values: Record<string, unknown>; status: "active" | "completed" | "cancelled"; updatedAt: number }>();
    const first = new ConversationManager(storage);
    first.start("chat:1", "checkout", { cart: ["item"] });
    const second = new ConversationManager(storage);
    await expect(second.getAsync("chat:1")).resolves.toMatchObject({ name: "checkout", values: { cart: ["item"] } });
  });

  it("keeps wizard continuation state across name and age answers", async () => {
    const wizard = new Wizard();
    wizard
      .step({ id: "name", run: (flow) => { flow.set("name", flow.ctx.message?.text?.trim()); flow.next(); } })
      .step({ id: "age", run: (flow) => { const raw = flow.ctx.message?.text?.trim() ?? ""; const age = Number(raw); if (!Number.isInteger(age)) throw new Error("Age must be an integer"); flow.set("age", age); flow.next(); } });
    const context = (text: string) => ({ message: { text } } as unknown as Context);

    const afterName = await wizard.run(context("Alice"), "chat:registration");
    expect(afterName).toMatchObject({ step: 1, values: { name: "Alice" }, status: "active" });
    const afterAge = await wizard.run(context("18"), "chat:registration");
    expect(afterAge).toMatchObject({ step: 2, values: { name: "Alice", age: 18 }, status: "completed" });
    expect((await wizard.manager.getAsync("chat:registration"))?.status).toBe("completed");
  });
});

describe("full cron scheduler", () => {
  it("parses wildcard, list, range, and step fields", () => {
    const expression = parseCronExpression("*/15 9-17 1,15 1-12 1-5");
    expect(expression.minute.values).toEqual(new Set([0, 15, 30, 45]));
    expect(expression.hour.values.has(9)).toBe(true);
    expect(expression.dayOfMonth.values).toEqual(new Set([1, 15]));
    expect(expression.dayOfWeek.values.has(5)).toBe(true);
  });

  it("calculates the next local occurrence for a full five-field expression", () => {
    const from = new Date(2026, 0, 5, 8, 59, 0, 0);
    const next = nextCronOccurrence("0 9 * * 1-5", from);
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBe(0);
    expect(next.getDay()).toBeGreaterThanOrEqual(1);
    expect(next.getDay()).toBeLessThanOrEqual(5);
  });

  it("captures task failures through the scheduler error hook", async () => {
    const errors: unknown[] = [];
    const scheduler = new Scheduler({ onError: async (error) => { errors.push(error); } });
    scheduler.after("failure", 0, async () => { throw new Error("scheduled failure"); });
    await new Promise((resolve) => setTimeout(resolve, 10));
    scheduler.clear();
    expect(errors).toHaveLength(1);
  });
});

describe("Telegram Web App security", () => {
  it("validates signed init data and rejects tampering/expiry", () => {
    const token = "123456:TEST_TOKEN";
    const authDate = Math.floor(Date.now() / 1000);
    const data = `auth_date=${authDate}&query_id=query-1&user=${encodeURIComponent(JSON.stringify({ id: 42, first_name: "Test" }))}`;
    const decoded = [...new URLSearchParams(data).entries()].sort(([left], [right]) => left.localeCompare(right));
    const checkString = decoded.map(([key, value]) => `${key}=${value}`).join("\n");
    const secret = createHmac("sha256", "WebAppData").update(token).digest();
    const hash = createHmac("sha256", secret).update(checkString).digest("hex");
    const valid = validateWebAppInitData(`${data}&hash=${hash}`, token);
    expect(valid.user?.id).toBe(42);
    expect(() => validateWebAppInitData(`${data}&hash=${"0".repeat(64)}`, token)).toThrow(/signature/);
    expect(() => validateWebAppInitData(`${data}&hash=${hash}`, token, 0, (authDate + 10) * 1000)).toThrow(/expired/);
  });
});

describe("permission-aware menus", () => {
  it("filters permissioned items and supports multi-column layout", async () => {
    const menu = new Menu("settings").item({ id: "public", label: "Public" }).item({ id: "admin", label: "Admin", permission: "admin" });
    const keyboard = await menu.build({ permissions: ["user"] }, { columns: 2 });
    expect(keyboard.build().inline_keyboard.flat().map((button) => button.text)).toEqual(["Public"]);
  });

  it("renders and dispatches paginated selection callbacks", async () => {
    const selected: number[] = [];
    const controller = new MenuController({ id: "items", items: ["a", "b", "c"], pageSize: 2, label: (item, index) => `${index}:${item}`, callback: async (_item, context) => { selected.push(context.userId!); } });
    const first = await controller.render({ userId: 42 });
    expect(first.inline_keyboard[0]?.[0]?.callback_data).toBe("items:select:0");
    const result = await controller.handle("items:select:1", { userId: 42 });
    expect(result?.type).toBe("select");
    expect(selected).toEqual([42]);
    const next = await controller.handle("items:page:1", { userId: 42 });
    expect(next?.type).toBe("page");
    expect(controller.page).toBe(1);
  });
});


describe("branding and observability", () => {
  it("renders terminal branding without approval wording", () => {
    const output = buildTerminalBranding({ color: false });
    expect(output).toContain("TELEBIBZ CLI");
    expect(output).toContain("Library Bot Telegram By @xbibzofficial");
    expect(output).toContain("Runtime logs: colorful structured output.");
    expect(output).not.toContain("approval");
    expect(output).not.toContain("developer");
    expect(output).not.toContain("\u001b[");
  });

  it("formats logger output with colored level and structured context", () => {
    const chunks: string[] = [];
    const stream = { isTTY: true, write: (chunk: string): boolean => { chunks.push(chunk); return true; } } as unknown as NodeJS.WriteStream;
    const logger = createLogger({ level: "debug", color: true, stream });
    logger.info("message.received", { chatId: 44, text: "hello" });
    const output = chunks.join("");
    expect(output).toContain("INFO ");
    expect(output).toContain("message.received");
    expect(output).toContain("\u001b[");
    expect(output).toContain('"chatId":44');
  });

  it("redacts sensitive logger fields and summarizes updates without content by default", () => {
    const entries: Array<{ context?: Record<string, unknown> }> = [];
    const logger = createLogger({ level: "debug", sink: (entry) => entries.push(entry) });
    logger.info("credentials loaded", { token: "secret-token", password: "secret-password", nested: { apiKey: "secret-key" } });
    expect(entries[0]?.context).toMatchObject({ token: "[REDACTED]", password: "[REDACTED]", nested: { apiKey: "[REDACTED]" } });

    const summary = summarizeUpdate({
      update_id: 901,
      message: {
        message_id: 3,
        chat: { id: 44, type: "private" },
        from: { id: 55, is_bot: false, first_name: "User" },
        text: "do not log by default",
      },
    });
    expect(summary).toEqual({ updateId: 901, type: "message", chatId: 44, fromUserId: 55, messageId: 3 });
    expect(summary).not.toHaveProperty("text");
  });
});
