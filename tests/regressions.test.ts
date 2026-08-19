import { describe, expect, it } from "vitest";
import { Router } from "../src/router/router.js";
import { createMockCallbackUpdate, createMockUpdate, createMockContext, createTestBot } from "../src/testing.js";

describe("callback context regressions", () => {
  it("uses callbackQuery.message as message/chat for reply, edit, and delete", async () => {
    const { bot, transport } = createTestBot();
    const ctx = createMockContext(bot, createMockCallbackUpdate());

    expect(ctx.message?.message_id).toBe(10);
    expect(ctx.chat?.id).toBe(1);
    expect(ctx.from?.id).toBe(2);

    await ctx.reply("callback reply");
    await ctx.edit("edited callback");
    await ctx.delete();

    expect(transport.calls.map((call) => call.method)).toEqual(["sendMessage", "editMessageText", "deleteMessage"]);
    expect(transport.calls[0]?.payload).toMatchObject({ chat_id: 1, reply_parameters: { message_id: 10 } });
    expect(transport.calls[1]?.payload).toMatchObject({ chat_id: 1, message_id: 10, text: "edited callback" });
    expect(transport.calls[2]?.payload).toMatchObject({ chat_id: 1, message_id: 10 });
  });
});

type TestContext = {
  update: Record<string, unknown>;
  message: { text?: string; chat?: { id: number | string } } | undefined;
  callbackQuery: { data?: string } | undefined;
  params: Record<string, string>;
};

function testContext(text = "hello"): TestContext {
  return { update: {}, message: { text, chat: { id: 1 } }, callbackQuery: undefined, params: {} };
}

describe("router matching semantics", () => {
  it("uses first-match by default and does not run later matching handlers", async () => {
    const calls: string[] = [];
    const router = new Router<TestContext>();
    router.text("hello", async () => { calls.push("first"); });
    router.route(() => true, async () => { calls.push("second"); });

    await router.handle(testContext());

    expect(calls).toEqual(["first"]);
  });

  it("supports explicit all-match mode for deliberate fan-out", async () => {
    const calls: string[] = [];
    const router = new Router<TestContext>({ matchMode: "all" });
    router.text("hello", async () => { calls.push("first"); });
    router.route(() => true, async () => { calls.push("second"); });

    await router.handle(testContext());

    expect(calls).toEqual(["first", "second"]);
  });

  it("allows a nested router to delegate terminal handling without double dispatch", async () => {
    const calls: string[] = [];
    const child = new Router<TestContext>();
    child.text("hello", async () => { calls.push("child"); });
    const parent = new Router<TestContext>();
    parent.nest(child);
    parent.route(() => true, async () => { calls.push("parent-fallback"); });

    await parent.handle(testContext());

    expect(calls).toEqual(["child"]);
  });
});

describe("polling failure isolation", () => {
  it("continues processing a batch after one handler throws", async () => {
    const { bot, transport } = createTestBot();
    let goodHandlerCalls = 0;
    const errors: unknown[] = [];
    bot.events.on("update:error", ({ error }) => { errors.push(error); });
    bot.onText("bad", async () => { throw new Error("bad handler"); });
    bot.onText("good", async () => {
      goodHandlerCalls += 1;
      await bot.stop();
    });
    transport.respond("getUpdates", {
      ok: true,
      result: [
        createMockUpdate({ update_id: 11, message: { ...createMockUpdate().message!, text: "bad" } }),
        createMockUpdate({ update_id: 12, message: { ...createMockUpdate().message!, text: "good" } }),
      ],
    });

    await bot.launch({ mode: "polling", timeout: 0 });

    expect(goodHandlerCalls).toBe(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect(bot.status).toBe("stopped");
    expect(transport.calls.filter((call) => call.method === "getUpdates")).toHaveLength(1);
  });
});
