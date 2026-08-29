import { describe, expect, it } from "vitest";
import { Bot, Wizard } from "../../src/index.js";
import { createMockUpdate, MockTransport } from "../../src/testing.js";

function createFlowBot(): { bot: Bot; transport: MockTransport } {
  const transport = new MockTransport();
  transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "FlowBot", username: "flow_bot" } });
  const bot = new Bot({ token: "123456:TEST_TOKEN", transport, branding: false, logger: { level: "silent" } });
  return { bot, transport };
}

function textUpdate(updateId: number, chatId: number, text: string) {
  const base = createMockUpdate();
  return {
    ...base,
    update_id: updateId,
    message: { ...base.message!, chat: { id: chatId, type: "private" as const }, text },
  };
}

describe("integration: registration wizard flow", () => {
  it("runs a multi-step wizard across updates from the same chat", async () => {
    const { bot, transport } = createFlowBot();
    const wizard = new Wizard<Record<string, unknown>>()
      .step({ id: "ask-name", run: async (flow) => { flow.next(); await flow.ctx.reply("What is your name?"); } })
      .step({
        id: "save-name",
        run: async (flow) => {
          flow.set("name", flow.ctx.message?.text);
          flow.next();
          await flow.ctx.reply("How old are you?");
        },
      })
      .step({
        id: "done",
        run: async (flow) => {
          flow.set("age", Number(flow.ctx.message?.text));
          await flow.ctx.reply(`Registered ${flow.get("name")} (age ${flow.get("age")}).`);
        },
      });
    bot.useWizard(wizard);
    bot.command("start", async (ctx) => { await wizard.run(ctx); });
    await bot.init();

    await bot.handleUpdate(textUpdate(1, 7, "/start"));
    await bot.handleUpdate(textUpdate(2, 7, "Bibz"));
    await bot.handleUpdate(textUpdate(3, 7, "22"));

    const replies = transport.calls
      .filter((call) => call.method === "sendMessage")
      .map((call) => (call.payload as { text?: string } | undefined)?.text ?? "");
    expect(replies).toEqual(["What is your name?", "How old are you?", "Registered Bibz (age 22)."]);
  });

  it("keeps two chats' wizards independent", async () => {
    const { bot, transport } = createFlowBot();
    const wizard = new Wizard<Record<string, unknown>>()
      .step({ id: "ask", run: async (flow) => { flow.next(); await flow.ctx.reply("Name?"); } })
      .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`Hi ${flow.ctx.message?.text}!`); } });
    bot.useWizard(wizard);
    bot.command("start", async (ctx) => { await wizard.run(ctx); });
    await bot.init();

    await bot.handleUpdate(textUpdate(1, 7, "/start"));
    await bot.handleUpdate(textUpdate(2, 8, "/start"));
    await bot.handleUpdate(textUpdate(3, 7, "Alice"));
    await bot.handleUpdate(textUpdate(4, 8, "Bob"));

    const replies = transport.calls
      .filter((call) => call.method === "sendMessage")
      .map((call) => (call.payload as { text?: string } | undefined)?.text ?? "");
    expect(replies).toEqual(["Name?", "Name?", "Hi Alice!", "Hi Bob!"]);
  });
});

describe("integration: photo download flow", () => {
  it("downloads a photo file_id straight from a message handler", async () => {
    const { bot, transport } = createFlowBot();
    transport.respond("getFile", { ok: true, result: { file_id: "photo-file-id", file_unique_id: "u1", file_size: 16, file_path: "photos/big.jpg" } });
    transport.downloadBytes = new TextEncoder().encode("jpeg-bytes");
    let downloadResult: { fileName: string; url: string; size: number } | undefined;
    bot.on("message:photo", async (ctx) => {
      const fileId = ctx.message?.photo?.at(-1)?.file_id;
      if (!fileId) throw new Error("photo update without file_id");
      const downloaded = await ctx.downloadFile(fileId);
      downloadResult = { fileName: downloaded.fileName, url: downloaded.url, size: downloaded.sizeBytes };
    });
    await bot.init();

    const base = createMockUpdate();
    const photoUpdate = {
      ...base,
      update_id: 11,
      message: { ...base.message!, photo: [{ file_id: "photo-file-id", file_unique_id: "u1", width: 100, height: 100 }] },
    };
    await bot.handleUpdate(photoUpdate as typeof base);

    expect(downloadResult).toEqual({ fileName: "big.jpg", url: "mock://files/photos/big.jpg", size: 10 });
    expect(transport.downloads).toEqual(["photos/big.jpg"]);
  });
});

describe("integration: upload validation before sendDocument", () => {
  it("rejects an oversized document before any API call leaves the process", async () => {
    const { bot, transport } = createFlowBot();
    const { assertValidUpload, UploadValidationError } = await import("../../src/index.js");
    let caught: unknown;
    bot.command("doc", async (ctx) => {
      try {
        assertValidUpload({ sizeBytes: 9000, mimeType: "application/zip", fileName: "bundle.zip" }, { maxBytes: 5000, allowedMimeTypes: ["application/pdf"], allowedExtensions: [".pdf"] });
        await ctx.reply("sent");
      } catch (error) {
        caught = error;
        await ctx.reply("rejected");
      }
    });
    await bot.init();
    await bot.handleUpdate(textUpdate(1, 8, "/doc"));
    expect(caught).toBeInstanceOf(UploadValidationError);
    expect(transport.calls.filter((call) => call.method === "sendDocument")).toHaveLength(0);
  });
});
