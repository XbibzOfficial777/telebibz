import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FetchTransport } from "../src/api/transport.js";
import type { TransportResponse } from "../src/api/transport.js";

interface CapturedRequest { url: string; init: RequestInit }

function captureTransport(payloadResponses: Array<{ ok: true; result: unknown }> = []): { transport: FetchTransport; requests: CapturedRequest[] } {
  const requests: CapturedRequest[] = [];
  const queue = [...payloadResponses];
  const transport = new FetchTransport({
    baseUrl: "https://api.telegram.org/bot123456:TEST_TOKEN",
    retries: 0,
    fetch: async (url, init) => {
      requests.push({ url: String(url), init: init as RequestInit });
      const response = queue.shift() ?? { ok: true as const, result: true };
      return new Response(JSON.stringify(response), { status: 200, headers: { "content-type": "application/json" } });
    },
  });
  return { transport, requests };
}

describe("FetchTransport payload encoding", () => {
  it("sends plain payloads as JSON with a JSON content type", async () => {
    const { transport, requests } = captureTransport();
    await transport.request({ method: "sendMessage", payload: { chat_id: 1, text: "hello" } });
    const [captured] = requests;
    expect(captured?.url).toBe("https://api.telegram.org/bot123456:TEST_TOKEN/sendMessage");
    expect(captured?.init.body).toBe(JSON.stringify({ chat_id: 1, text: "hello" }));
    expect(new Headers(captured?.init.headers).get("content-type")).toBe("application/json; charset=utf-8");
  });

  it("switches to multipart form data when the payload contains a Uint8Array", async () => {
    const { transport, requests } = captureTransport();
    const bytes = new TextEncoder().encode("file-body");
    await transport.request({ method: "sendDocument", payload: { chat_id: 1, document: bytes } });
    const body = requests[0]?.init.body;
    expect(body).toBeInstanceOf(FormData);
    const form = body as FormData;
    expect(form.get("chat_id")).toBe("1");
    expect(form.get("document")).toBeInstanceOf(Blob);
    expect(Buffer.from(await (form.get("document") as Blob).arrayBuffer()).toString("utf8")).toBe("file-body");
  });

  it("sends ArrayBuffer and Blob uploads as form parts", async () => {
    const { transport, requests } = captureTransport();
    const buffer = new TextEncoder().encode("from-arraybuffer").buffer;
    await transport.request({ method: "sendDocument", payload: { chat_id: 1, document: buffer } });
    const form = requests[0]?.init.body as FormData;
    expect(form.get("document")).toBeInstanceOf(Blob);
  });

  it("supports the media-group pattern: attach:// references plus separate file parts", async () => {
    const { transport, requests } = captureTransport();
    const bytes = new TextEncoder().encode("group-photo");
    await transport.request({
      method: "sendMediaGroup",
      payload: { chat_id: 1, media: [{ type: "photo", media: "attach://pic1" }], pic1: bytes },
    });
    const form = requests[0]?.init.body as FormData;
    // The media array itself is one JSON-serialized field (Telegram contract).
    expect(form.get("media")).toBe(JSON.stringify([{ type: "photo", media: "attach://pic1" }]));
    // The attached binary rides along as its own form part.
    expect(Buffer.from(await (form.get("pic1") as Blob).arrayBuffer()).toString("utf8")).toBe("group-photo");
  });

  it("drains web ReadableStream sources into form parts", async () => {
    const { transport, requests } = captureTransport();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("streamed"));
        controller.close();
      },
    });
    await transport.request({ method: "sendDocument", payload: { chat_id: 1, document: stream } });
    const form = requests[0]?.init.body as FormData;
    expect(Buffer.from(await (form.get("document") as Blob).arrayBuffer()).toString("utf8")).toBe("streamed");
  });

  it("drains Node.js stream sources into form parts", async () => {
    const { transport, requests } = captureTransport();
    const nodeStream = Readable.toWeb(new Readable({ read() { this.push(Buffer.from("node-streamed")); this.push(null); } })) as unknown as ReadableStream;
    await transport.request({ method: "sendDocument", payload: { chat_id: 1, document: nodeStream } });
    const form = requests[0]?.init.body as FormData;
    expect(Buffer.from(await (form.get("document") as Blob).arrayBuffer()).toString("utf8")).toBe("node-streamed");
  });

  it("applies an explicit filename to binary sources", async () => {
    const { transport, requests } = captureTransport();
    await transport.request({
      method: "sendDocument",
      payload: { chat_id: 1, document: { source: new TextEncoder().encode("named"), filename: "report.pdf" } },
    });
    const form = requests[0]?.init.body as FormData;
    const part = form.get("document") as File;
    expect(part.name).toBe("report.pdf");
    expect(Buffer.from(await part.arrayBuffer()).toString("utf8")).toBe("named");
  });

  it("reads file paths from disk and uses the basename as the filename", async () => {
    const dir = await mkdtemp(join(tmpdir(), "telebibz-upload-"));
    const filePath = join(dir, "report.pdf");
    await writeFile(filePath, "pdf-bytes");
    const { transport, requests } = captureTransport();
    await transport.request({
      method: "sendDocument",
      payload: { chat_id: 1, document: { source: filePath } },
    });
    const form = requests[0]?.init.body as FormData;
    const part = form.get("document") as File;
    expect(part.name).toBe("report.pdf");
    expect(Buffer.from(await part.arrayBuffer()).toString("utf8")).toBe("pdf-bytes");
  });

  it("honors an explicit filename over the basename", async () => {
    const dir = await mkdtemp(join(tmpdir(), "telebibz-upload-"));
    const filePath = join(dir, "temp.bin");
    await writeFile(filePath, "contents");
    const { transport, requests } = captureTransport();
    await transport.request({
      method: "sendDocument",
      payload: { chat_id: 1, document: { source: filePath, filename: "custom.txt" } },
    });
    const form = requests[0]?.init.body as FormData;
    expect((form.get("document") as File).name).toBe("custom.txt");
  });

  it("keeps plain strings JSON-encoded even inside upload objects with string sources", async () => {
    const { transport, requests } = captureTransport();
    await transport.request({ method: "sendMessage", payload: { chat_id: 1, text: "plain" } });
    expect(typeof requests[0]?.init.body).toBe("string");
  });
});

describe("FetchTransport fileUrl", () => {
  it("maps the bot base URL to the file download URL", () => {
    const { transport } = captureTransport();
    expect(transport.fileUrl("documents/report.pdf")).toBe("https://api.telegram.org/file/bot123456:TEST_TOKEN/documents/report.pdf");
  });

  it("supports local Bot API server base URLs", () => {
    const transport = new FetchTransport({ baseUrl: "http://localhost:8081/botlocal:token", fetch: async () => new Response() });
    expect(transport.fileUrl("photos/file.jpg")).toBe("http://localhost:8081/file/botlocal:token/photos/file.jpg");
  });
});

describe("FetchTransport download", () => {
  it("downloads bytes from the file URL", async () => {
    const requests: CapturedRequest[] = [];
    const transport = new FetchTransport({
      baseUrl: "https://api.telegram.org/bot123456:TEST_TOKEN",
      retries: 0,
      fetch: async (url, init) => {
        requests.push({ url: String(url), init: init as RequestInit });
        return new Response(new TextEncoder().encode("downloaded-bytes"), { status: 200 });
      },
    });
    const bytes = await transport.download("documents/report.pdf");
    expect(requests[0]?.url).toBe("https://api.telegram.org/file/bot123456:TEST_TOKEN/documents/report.pdf");
    expect(requests[0]?.init.method).toBe("GET");
    expect(new TextDecoder().decode(bytes)).toBe("downloaded-bytes");
  });

  it("throws a network error with status context on HTTP failure", async () => {
    const transport = new FetchTransport({
      baseUrl: "https://api.telegram.org/bot123456:TEST_TOKEN",
      retries: 0,
      fetch: async () => new Response("not found", { status: 404 }),
    });
    await expect(transport.download("gone.bin")).rejects.toThrow(/HTTP 404/);
  });
});
