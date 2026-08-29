# Working with files: upload, download, validation (English)

Complete guide to every file flow in telebibz: downloading files users send you, uploading files to Telegram, sending by `file_id`, validating uploads, and the limits and gotchas that come with the Telegram Bot API.

## Contents

1. [Download: one call with `downloadFile()`](#1-download-one-call-with-downloadfile)
2. [Download: manual flow with `getFile()`](#2-download-manual-flow-with-getfile)
3. [Property naming: `file_path` vs `filePath`](#3-property-naming-file_path-vs-filepath)
4. [Upload: every source type](#4-upload-every-source-type)
5. [Upload: validation before sending](#5-upload-validation-before-sending)
6. [Media groups with `attach://`](#6-media-groups-with-attach)
7. [Limits and lifetimes](#7-limits-and-lifetimes)
8. [Local Bot API server](#8-local-bot-api-server)
9. [Testing file flows without network](#9-testing-file-flows-without-network)
10. [Troubleshooting](#10-troubleshooting)

## 1. Download: one call with `downloadFile()`

`bot.downloadFile()` / `ctx.downloadFile()` resolves the `file_id` through `getFile` and downloads the raw bytes in a single call:

```ts
bot.on("message:document", async (ctx) => {
  const fileId = ctx.message.document.file_id;

  // Downloads to memory…
  const file = await ctx.downloadFile(fileId);
  console.log(file.fileName, file.sizeBytes, file.url);
  // file.bytes is a Uint8Array

  // …or straight to disk
  const saved = await ctx.downloadFile(fileId, { destination: "downloads/report.pdf" });
  console.log(`Saved to ${saved.savedTo}`);
});
```

The result (`DownloadedFile`) carries everything:

| Field | Meaning |
|---|---|
| `file` | The Telegram `File` object returned by `getFile` |
| `bytes` | Raw file bytes (`Uint8Array`) |
| `filePath` | The `file_path` used for the download |
| `url` | Direct download URL — valid for **at least 1 hour** |
| `fileName` | Last path segment of `filePath` (e.g. `report.pdf`) |
| `sizeBytes` | Byte length of `bytes` |
| `savedTo` | Local path, set when you passed `destination` |

Errors are precise:
- Telegram returns no `file_path` → `TelegramError` with `kind: "validation"`
- The HTTP download itself fails → `TelegramNetworkError` (with status)
- `getFile` fails (bad `file_id`, file too big) → the original `TelegramError` from Telegram

Both variants accept an `AbortSignal`:

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000);
const file = await bot.downloadFile(fileId, { signal: controller.signal });
```

## 2. Download: manual flow with `getFile()`

If you want to build the URL yourself (e.g. to hand it to another HTTP client):

```ts
const file = await ctx.getFile(fileId);          // Telegram File object
if (!file.file_path) throw new Error("File unavailable (over 20 MB or expired)");

const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
const response = await fetch(url);               // fetch — NEVER createReadStream (it cannot open URLs)
if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
const bytes = new Uint8Array(await response.arrayBuffer());
```

Three rules this snippet encodes:
1. The URL prefix is `/file/bot<TOKEN>/` — **the word `bot` is required**. Forgetting it is the single most common mistake and yields `404 Not Found`.
2. `fetch` downloads the bytes; `fs.createReadStream()` only opens **local paths** — passing it a URL crashes the process with `ENOENT` on an unhandled stream error.
3. The URL is guaranteed valid for **at least 1 hour**. Never cache it long-term; call `getFile` again when it expires.

## 3. Property naming: `file_path` vs `filePath`

This trips everyone once. The two naming styles belong to different layers:

| Naming | Belongs to | Examples |
|---|---|---|
| `snake_case` (`file_path`) | **Raw Telegram objects** — the result of `getFile()`, `ctx.message.document`, `ctx.message.photo` | `file.file_path`, `document.file_id`, `photo.file_unique_id` |
| `camelCase` (`filePath`) | **telebibz result types** — `DownloadedFile` and library options | `downloaded.filePath`, `downloaded.fileName`, `downloaded.sizeBytes` |

```ts
const file = await ctx.getFile(fileId);
file.file_path;   // ✅ Telegram object → snake_case
file.filePath;    // ❌ undefined — this is the DownloadedFile name

const downloaded = await ctx.downloadFile(fileId);
downloaded.filePath;  // ✅ library result → camelCase
downloaded.file_path; // ❌ undefined
```

If your "no file path" check fails while the logged response clearly contains `file_path`, you are reading a camelCase property from a snake_case object.

## 4. Upload: every source type

All `replyWith*` senders and raw API calls accept the `InputFile` type. Pass uploads as `{ source, filename? }`:

```ts
// From a path on disk (absolute, ./, or ../)
await ctx.replyWithDocument({ source: "reports/q3.pdf", filename: "Q3-report.pdf" });

// From raw bytes
const bytes = new Uint8Array(await someFile.bytes());
await ctx.replyWithDocument({ source: bytes, filename: "data.bin" });

// From a Blob or File (File carries its own name)
await ctx.replyWithDocument({ source: new File([bytes], "photo.png") });

// From a web ReadableStream or a Node.js stream (drained automatically)
import { createReadStream } from "node:fs";
await ctx.replyWithVideo({ source: createReadStream("clip.mp4"), filename: "clip.mp4" });
```

Notes:
- `filename` overrides whatever name the source would otherwise have (for paths, the basename is used by default).
- **You never build `FormData` yourself.** The transport detects upload payloads and switches to multipart automatically. Hand-rolled `FormData` with Node streams fails (`append` requires a `Blob`) — always pass the stream/bytes to the library instead.
- Bare values also work: `await ctx.replyWithDocument(bytes)` (no filename) or an existing Telegram file id:

```ts
// Re-send by file_id — no download, no upload, no size limit
await ctx.replyWithDocument(ctx.message.document.file_id);
```

## 5. Upload: validation before sending

`validateUpload()` / `assertValidUpload()` enforce your own rules before a byte leaves the process:

```ts
import { assertValidUpload, UploadValidationError } from "@xbibzlibrary/telebibz";

bot.command("doc", async (ctx) => {
  const filePath = ctx.message?.text?.split(/\s+/)[1];
  if (!filePath) return void (await ctx.reply("Usage: /doc <path>"));

  const info = await stat(filePath);
  try {
    assertValidUpload(
      { sizeBytes: info.size, fileName: filePath },
      {
        maxBytes: 50 * 1024 * 1024,                       // Telegram document cap
        allowedExtensions: [".pdf", ".docx", ".pptx"],    // case-insensitive
      },
    );
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return void (await ctx.reply(`❌ ${error.message}`)); // lists every violation
    }
    throw error;
  }

  await ctx.replyWithDocument({ source: filePath });
});
```

`validateUpload()` returns issues instead of throwing (empty array = valid). MIME rules support wildcards:

```ts
validateUpload({ mimeType: "image/png" }, { allowedMimeTypes: ["image/*"] }); // []
```

Available rules: `maxBytes`, `allowedMimeTypes` (exact or `image/*` wildcards), `allowedExtensions` (dot optional, case-insensitive).

## 6. Media groups with `attach://`

`sendMediaGroup` takes a JSON array of input media; binary files ride along as **separate form parts** referenced by `attach://<name>`:

```ts
await ctx.replyWithMediaGroup([
  { type: "photo", media: "attach://pic1" },
  { type: "photo", media: "attach://pic2" },
], { pic1: bytes1, pic2: bytes2 } as never);
```

The transport detects the binary parts and switches to multipart automatically; the `media` array itself is serialized as one JSON form field, exactly as Telegram requires.

## 7. Limits and lifetimes

| Limit | Value | Notes |
|---|---|---|
| Download via `getFile` | **20 MB** | Larger files: `getFile` fails (HTTP 400 "file is too big") — not an empty `file_path` |
| Upload photos | 10 MB | |
| Upload other files | 50 MB | |
| Re-send by `file_id` | **No limit** | Telegram already has the file |
| Send by URL | 5 MB photos / 20 MB other | Telegram fetches the URL itself |
| Download URL validity | **≥ 1 hour** | Re-run `getFile` after expiry |
| `file_path` presence | Optional in the schema | Always check before using it |

Upload limits are Telegram's, not the library's — `validateUpload()` is how you reject early with a friendly message.

## 8. Local Bot API server

Running your own [local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) removes the 20 MB download cap and allows 2000 MB uploads:

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  apiBaseUrl: "http://localhost:8081",   // Bot API option
  transportOptions: { timeoutMs: 600_000 },
});
```

`downloadFile()` and `fileUrl()` map `/bot<token>` to `/file/bot<token>` on any base URL, so downloads work against local servers too. Note: with a local server, `file_path` is an **absolute path on the server's disk** — fetch the URL only if the server is remote; read the path directly when your bot runs on the same machine.

## 9. Testing file flows without network

`MockTransport` (from `@xbibzlibrary/telebibz/testing`) implements the download members:

```ts
import { createTestBot } from "@xbibzlibrary/telebibz/testing";

const { bot, transport } = createTestBot();
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "documents/a.pdf" } });
transport.downloadBytes = new TextEncoder().encode("pdf-content");

const file = await bot.downloadFile("F1");
file.fileName;                         // "a.pdf"
new TextDecoder().decode(file.bytes);  // "pdf-content"
transport.downloads;                   // ["documents/a.pdf"] — the recorded download
```

See [TESTING.md](TESTING.md) for the full testing guide.

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Gagal mendapatkan path file" while the logged response contains `file_path` | Reading `file.filePath`/`file.path` from a raw Telegram object | Use `file.file_path` (snake_case) — or skip manual handling entirely with `ctx.downloadFile()` |
| `ENOENT … open 'https://…'` on a ReadStream | `createReadStream()` only opens local paths | Use `fetch(url)` for URLs, or `ctx.downloadFile()` |
| Download URL returns 404 | Missing `bot` prefix in `/file/bot<TOKEN>/` | Use the `url` field from `downloadFile()` — it is always built correctly |
| `getFile` returns HTTP 400 "file is too big" | File over 20 MB | Use a local Bot API server, or re-send by `file_id` |
| `FormData append: parameter 2 is not of type 'Blob'` | Hand-rolled `FormData` with a Node stream | Pass `{ source: stream, filename }` to `replyWith*` instead; the library handles multipart |
| `file_path` was there, now it's gone | URL expired (>1 hour) | Call `getFile` again |
| Downloaded file is 0 bytes / wrong | `file_id` belongs to another bot | `file_id`s are bot-scoped; use the id from your own bot's updates |

Bahasa Indonesia: [FILES.id.md](FILES.id.md) · 简体中文: [FILES.zh-CN.md](FILES.zh-CN.md)
