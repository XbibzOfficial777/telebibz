import { describe, expect, it } from "vitest";
import { Router } from "../src/router/router.js";
import { ConversationManager } from "../src/state/conversation.js";
import { EventBus } from "../src/core/events.js";
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

  it("supports callback prefix patterns only when the suffix is explicit", async () => {
    const calls: string[] = [];
    const router = new Router<TestContext>();
    router.callback("menu:*", async () => { calls.push("matched"); });
    await router.handle({ ...testContext(), message: undefined, callbackQuery: { data: "menu:open" } });
    expect(calls).toEqual(["matched"]);
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

describe("conversation and event regressions", () => {
  it("does not execute a completed conversation step again", async () => {
    const manager = new ConversationManager();
    let runs = 0;
    const steps = [(flow: { complete: () => void }) => { runs += 1; flow.complete(); }];
    await manager.run(testContext() as never, "chat:1", "profile", steps);
    await manager.run(testContext() as never, "chat:1", "profile", steps);
    expect(runs).toBe(1);
  });

  it("runs later EventBus listeners after an earlier listener fails", async () => {
    const bus = new EventBus<{ event: { value: number } }>();
    const calls: string[] = [];
    bus.on("event", () => { calls.push("first"); throw new Error("listener failed"); });
    bus.on("event", () => { calls.push("second"); });
    await expect(bus.emit("event", { value: 1 })).rejects.toThrow("listener failed");
    expect(calls).toEqual(["first", "second"]);
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

describe("router middleware and parameter regressions", () => {
  it("executes router.use() middleware before matching routes without halting first-match routing", async () => {
    const calls: string[] = [];
    const router = new Router<TestContext>();
    router.use(async (_ctx, next) => {
      calls.push("middleware");
      await next();
    });
    router.text("hello", async () => {
      calls.push("route");
    });

    await router.handle(testContext("hello"));

    expect(calls).toEqual(["middleware", "route"]);
  });

  it("captures command arguments into ctx.args and regex groups into ctx.match", async () => {
    const router = new Router<TestContext>();
    let capturedArgs: string[] | undefined;
    let capturedMatch: string[] | undefined;

    router.command("ban", async (ctx) => {
      capturedArgs = ctx.args;
    });
    router.regex(/user_(\d+)/, async (ctx) => {
      capturedMatch = ctx.match ? [...ctx.match] : undefined;
    });

    const banContext = testContext("/ban @alice 7d");
    await router.handle(banContext);
    expect(capturedArgs).toEqual(["@alice", "7d"]);

    const regexContext = testContext("user_42");
    await router.handle(regexContext);
    expect(capturedMatch?.[1]).toBe("42");
  });
});

describe("context enhancements and text formatting regressions", () => {
  it("applies withReplyMarkup default to reply and send", async () => {
    const { bot, transport } = createTestBot();
    const ctx = createMockContext(bot, createMockUpdate());
    ctx.withReplyMarkup({ inline_keyboard: [[{ text: "Btn", callback_data: "1" }]] });

    await ctx.reply("hello with keyboard");

    expect(transport.calls[0]?.payload).toMatchObject({
      text: "hello with keyboard",
      reply_markup: { inline_keyboard: [[{ text: "Btn", callback_data: "1" }]] },
    });
  });

  it("formats MarkdownV2 and HTML correctly including code blocks and spoilers", async () => {
    const { md, html } = await import("../src/utils/text.js");

    const codeBlock = md.pre("const a = 1;", "typescript");
    expect(codeBlock).toBe("```typescript\nconst a = 1;\n```");

    expect(md.spoiler("secret")).toBe("||secret||");
    expect(md.underline("under")).toBe("__under__");
    expect(md.strikethrough("deleted")).toBe("~deleted~");
    expect(md.blockquote("quoted line")).toBe(">quoted line");

    expect(html.spoiler("secret")).toBe("<tg-spoiler>secret</tg-spoiler>");
    expect(html.bold("bold text")).toBe("<b>bold text</b>");
    expect(html.code("const x = 1;")).toBe("<code>const x = 1;</code>");
  });

  it("ensures Form parsing is stateless and does not leak values across parses", async () => {
    const { Form, validators } = await import("../src/state/forms.ts");
    const form = new Form<{ username: string }>();
    form.field({ name: "username", parse: validators.string, required: true });

    const first = await form.parse({ username: "alice" });
    const second = await form.parse({});

    expect(first.success).toBe(true);
    if (first.success) expect(first.data.username).toBe("alice");

    expect(second.success).toBe(false);
  });
});
