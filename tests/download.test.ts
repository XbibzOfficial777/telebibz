import { describe, expect, it } from "vitest";
import { readFile, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Bot } from "../src/core/bot.js";
import { Context } from "../src/context/context.js";
import { TelegramError } from "../src/api/errors.js";
import { createMockUpdate, createTestBot, MockTransport } from "../src/testing.js";

function respondGetFile(transport: MockTransport, filePath?: string): void {
  transport.respond("getFile", { ok: true, result: { file_id: "FILE_ID", file_unique_id: "UNIQUE", file_size: 123, ...(filePath !== undefined ? { file_path: filePath } : {}) } });
}

describe("bot.downloadFile", () => {
  it("resolves getFile and downloads the bytes", async () => {
    const { bot, transport } = createTestBot();
    respondGetFile(transport, "documents/report.pdf");
    transport.downloadBytes = new TextEncoder().encode("pdf-content");
    const downloaded = await bot.downloadFile("FILE_ID");
    expect(transport.calls.filter((call) => call.method === "getFile")).toHaveLength(1);
    expect(transport.downloads).toEqual(["documents/report.pdf"]);
    expect(downloaded).toMatchObject({
      filePath: "documents/report.pdf",
      url: "mock://files/documents/report.pdf",
      fileName: "report.pdf",
      sizeBytes: 11,
    });
    expect(new TextDecoder().decode(downloaded.bytes)).toBe("pdf-content");
  });

  it("persists to disk when destination is given", async () => {
    const { bot, transport } = createTestBot();
    respondGetFile(transport, "photos/pic.jpg");
    const destination = join(await mkdtemp(join(tmpdir(), "telebibz-dl-")), "pic.jpg");
    const downloaded = await bot.downloadFile("FILE_ID", { destination });
    expect(downloaded.savedTo).toBe(destination);
    expect(await readFile(destination, "utf8")).toBe("photos/pic.jpg");
  });

  it("throws a validation error when Telegram returns no file_path", async () => {
    const { bot, transport } = createTestBot();
    respondGetFile(transport, undefined);
    const error = await bot.downloadFile("FILE_ID").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(TelegramError);
    expect((error as TelegramError).kind).toBe("validation");
    expect((error as Error).message).toContain("file_path");
  });

  it("propagates Telegram errors from getFile itself", async () => {
    const { bot, transport } = createTestBot();
    transport.respond("getFile", { ok: false, error_code: 400, description: "Bad Request: wrong file identifier" });
    await expect(bot.downloadFile("WRONG")).rejects.toThrow(/wrong file identifier/);
  });
});

describe("context download helpers", () => {
  it("getFile is typed and returns file_path", async () => {
    const { bot, transport } = createTestBot();
    respondGetFile(transport, "voice/note.oga");
    const ctx = new Context({ update: createMockUpdate(), api: bot.api, session: {}, services: {} });
    const file = await ctx.getFile("FILE_ID");
    expect(file.file_path).toBe("voice/note.oga");
    expect(file.file_id).toBe("FILE_ID");
  });

  it("downloadFile works straight from a handler", async () => {
    const { bot, transport } = createTestBot();
    respondGetFile(transport, "documents/inline.bin");
    let result: { url: string; fileName: string } | undefined;
    bot.on("message", async (ctx) => {
      const downloaded = await ctx.downloadFile("FILE_ID");
      result = { url: downloaded.url, fileName: downloaded.fileName };
    });
    await bot.handleUpdate(createMockUpdate());
    expect(result).toEqual({ url: "mock://files/documents/inline.bin", fileName: "inline.bin" });
  });
});

describe("transports without download support", () => {
  it("fails with a clear error instead of a crash", async () => {
    const transport = new MockTransport();
    // Simulate a custom transport that only implements request().
    const minimal = { request: transport.request.bind(transport) } as unknown as MockTransport;
    const bot = new Bot({ token: "123456:TEST", transport: minimal, branding: false, logger: { level: "silent" } });
    respondGetFile(transport, "documents/x.pdf");
    const error = await bot.downloadFile("FILE_ID").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(TelegramError);
    expect((error as Error).message).toContain("does not support file downloads");
  });
});
