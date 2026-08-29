import { describe, expect, it } from "vitest";
import {
  paintRainbow,
  printTeleBibzBanner,
  runStartupSequence,
  startTeleBibzBanner,
  TELE_BIBZ_ASCII,
  TERMINAL_BRAND_TEXT,
} from "../src/branding/terminal.js";
import { createLogger, describeIncomingUpdate, formatLocalStamp, type LogEntry } from "../src/observability/logger.js";
import { Bot } from "../src/core/bot.js";
import { MockTransport, createMockCallbackUpdate, createMockUpdate } from "../src/testing.js";

function createFakeStream(isTTY = true): { stream: NodeJS.WriteStream; output: () => string } {
  let buffer = "";
  const stream = {
    isTTY,
    write: (chunk: string | Uint8Array): boolean => {
      buffer += typeof chunk === "string" ? chunk : Buffer.from(chunk).toString();
      return true;
    },
  };
  return { stream: stream as unknown as NodeJS.WriteStream, output: () => buffer };
}

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "");
}

describe("rainbow painting", () => {
  it("wraps non-space characters in truecolor escapes and leaves spaces plain", () => {
    const painted = paintRainbow("AB C", { color: true });
    expect(painted).toContain("\u001b[38;2;");
    expect(painted).not.toContain("\u001b[38;2; \u001b[0m");
    expect(stripAnsi(painted)).toBe("AB C");
  });

  it("returns plain text when color is disabled", () => {
    expect(paintRainbow("Tele Bibz", { color: false })).toBe("Tele Bibz");
  });
});

describe("startup sequence", () => {
  it("types the label, prints the dots, and fills the glass bar to 100%", async () => {
    const { stream, output } = createFakeStream();
    await runStartupSequence({ stream, typeDelayMs: 1, dotDelayMs: 1, barDurationMs: 60, barFrameMs: 16 });
    const visible = stripAnsi(output());
    expect(visible).toContain("Installing Dependencies......");
    expect(visible).toContain("100%");
    expect(visible.trimEnd().endsWith("✓")).toBe(true);
  });

  it("does nothing when the stream is not an interactive TTY", async () => {
    const { stream, output } = createFakeStream(false);
    await runStartupSequence({ stream, typeDelayMs: 0, dotDelayMs: 0, barDurationMs: 0 });
    expect(output()).toBe("");
  });
});

describe("tele bibz banner", () => {
  it("animates the rainbow banner and freezes with the connection status", async () => {
    const { stream, output } = createFakeStream();
    const banner = startTeleBibzBanner({ stream, frameMs: 5, subtitle: "Connecting..." });
    await new Promise((resolve) => setTimeout(resolve, 60));
    banner.stop("Connected as @test_bot");
    banner.stop("second stop is ignored");
    const visible = stripAnsi(output());
    expect(visible).toContain(TELE_BIBZ_ASCII[0]);
    expect(visible).toContain(TERMINAL_BRAND_TEXT);
    expect(visible).toContain("Connecting...");
    expect(visible).toContain("✓ Connected as @test_bot");
    expect(visible).not.toContain("second stop is ignored");
    expect(output()).toContain("\u001b[?25h");
  });

  it("prints a static banner with an optional status message", () => {
    const { stream, output } = createFakeStream(false);
    printTeleBibzBanner({ stream, color: false, subtitle: "doctor", message: "All checks passed", tone: "success" });
    const visible = stripAnsi(output());
    expect(visible).toContain(TELE_BIBZ_ASCII.join("\n"));
    expect(visible).toContain("✓ All checks passed");
  });
});

describe("incoming update descriptions", () => {
  it("describes a message with nickname and truncates text to 50 characters", () => {
    const longText = "a".repeat(80);
    const input = describeIncomingUpdate(createMockUpdate({
      message: {
        message_id: 1,
        date: Date.now(),
        chat: { id: 1, type: "private" },
        from: { id: 2, is_bot: false, first_name: "John", last_name: "Doe", username: "johndoe" },
        text: longText,
      },
    }));
    expect(input.kind).toBe("Message");
    expect(input.fromId).toBe(2);
    expect(input.nickname).toBe("John Doe");
    expect(input.content).toHaveLength(51);
    expect(input.content?.endsWith("…")).toBe(true);
    expect(input.truncated).toBe(true);
  });

  it("keeps short commands and callback button data intact", () => {
    const command = describeIncomingUpdate(createMockUpdate());
    expect(command.content).toBe("/start");
    expect(command.truncated).toBe(false);

    const callback = describeIncomingUpdate(createMockCallbackUpdate());
    expect(callback.kind).toBe("Callback");
    expect(callback.fromId).toBe(2);
    expect(callback.nickname).toBe("Test");
    expect(callback.content).toBe("action");
  });

  it("falls back to the username when the user has no name", () => {
    const input = describeIncomingUpdate(createMockUpdate({
      message: {
        message_id: 1,
        date: Date.now(),
        chat: { id: 1, type: "private" },
        from: { id: 7, is_bot: false, first_name: "", username: "ghost" },
        text: "hi",
      },
    }));
    expect(input.nickname).toBe("ghost");
  });
});

describe("incoming log rendering", () => {
  const sample = describeIncomingUpdate(createMockUpdate());

  it("renders the human message line with date and content", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "info", format: "pretty", color: false, sink: (entry) => entries.push(entry) });
    logger.incoming(sample);
    expect(entries).toHaveLength(1);
    const [header] = (entries[0]?.text ?? "").split("\n");
    expect(header).toMatch(/^\[ => \] Message From 2 Test \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
    expect(entries[0]?.text).toContain("↳ Text: /start");
  });

  it("emits a structured entry in json format", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "info", format: "json", sink: (entry) => entries.push(entry) });
    logger.incoming(sample);
    expect(entries[0]?.event).toBe("update.received");
    expect(entries[0]?.context).toMatchObject({ kind: "Message", fromId: 2, nickname: "Test" });
    expect(entries[0]?.text).toBeUndefined();
  });

  it("respects the log level filter", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "error", sink: (entry) => entries.push(entry) });
    logger.incoming(sample);
    expect(entries).toHaveLength(0);
  });

  it("silent level emits nothing, not even errors", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "silent", sink: (entry) => entries.push(entry) });
    logger.error("boom", { code: 1 });
    logger.warn("careful");
    logger.info("hello");
    logger.debug("detail");
    logger.trace("noise");
    logger.incoming(sample);
    expect(entries).toHaveLength(0);
  });

  it("formats local timestamps as dd/mm/yyyy hh:mm:ss", () => {
    expect(formatLocalStamp(new Date(2026, 7, 29, 15, 4, 5))).toBe("29/08/2026 15:04:05");
  });
});

describe("bot incoming log pipeline", () => {
  it("logs every handled update through the incoming line", async () => {
    const entries: LogEntry[] = [];
    const transport = new MockTransport();
    transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
    const bot = new Bot({
      token: "123456:TEST_TOKEN",
      transport,
      logger: createLogger({ level: "info", format: "pretty", color: false, sink: (entry) => entries.push(entry) }),
    });
    await bot.handleUpdate(createMockUpdate({ update_id: 30 }));
    await bot.handleUpdate(createMockCallbackUpdate({ update_id: 31 }));
    const texts = entries.filter((entry) => entry.text !== undefined).map((entry) => entry.text);
    expect(texts[0]).toMatch(/\[ => \] Message From 2 Test /);
    expect(texts[0]).toContain("↳ Text: /start");
    expect(texts[1]).toMatch(/\[ => \] Callback From 2 Test /);
    expect(texts[1]).toContain("↳ Data: action");
  });
});
