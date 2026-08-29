# 文件操作：上传、下载、校验（简体中文）

telebibz 文件流程的完整指南：下载用户发来的文件、上传文件到 Telegram、通过 `file_id` 转发、上传前校验，以及 Telegram Bot API 的限制与陷阱。

## 目录

1. [下载：一次调用 `downloadFile()`](#1-下载一次调用-downloadfile)
2. [下载：`getFile()` 手动流程](#2-下载getfile-手动流程)
3. [属性命名：`file_path` 与 `filePath`](#3-属性命名file_path-与-filepath)
4. [上传：所有来源类型](#4-上传所有来源类型)
5. [上传：发送前校验](#5-上传发送前校验)
6. [媒体组与 `attach://`](#6-媒体组与-attach)
7. [限制与有效期](#7-限制与有效期)
8. [本地 Bot API 服务器](#8-本地-bot-api-服务器)
9. [离线测试文件流程](#9-离线测试文件流程)
10. [故障排查](#10-故障排查)

## 1. 下载：一次调用 `downloadFile()`

`bot.downloadFile()` / `ctx.downloadFile()` 通过 `getFile` 解析 `file_id`，然后在一次调用中下载原始字节：

```ts
bot.on("message:document", async (ctx) => {
  const fileId = ctx.message.document.file_id;

  // 下载到内存……
  const file = await ctx.downloadFile(fileId);
  console.log(file.fileName, file.sizeBytes, file.url);
  // file.bytes 是 Uint8Array

  // ……或直接写入磁盘
  const saved = await ctx.downloadFile(fileId, { destination: "downloads/report.pdf" });
  console.log(`已保存到 ${saved.savedTo}`);
});
```

返回的 `DownloadedFile` 携带你所需的一切：

| 字段 | 含义 |
|---|---|
| `file` | `getFile` 返回的 Telegram `File` 对象 |
| `bytes` | 文件原始字节（`Uint8Array`） |
| `filePath` | 用于下载的 `file_path` |
| `url` | 直接下载链接 —— **至少 1 小时**内有效 |
| `fileName` | `filePath` 的最后一段（如 `report.pdf`） |
| `sizeBytes` | `bytes` 的字节长度 |
| `savedTo` | 本地路径，仅在传入 `destination` 时填充 |

错误同样精确：
- Telegram 未返回 `file_path` → `TelegramError`，`kind: "validation"`
- HTTP 下载本身失败 → `TelegramNetworkError`（含状态码）
- `getFile` 失败（file_id 错误、文件过大）→ Telegram 原始的 `TelegramError`

两者都支持 `AbortSignal`：

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000);
const file = await bot.downloadFile(fileId, { signal: controller.signal });
```

## 2. 下载：`getFile()` 手动流程

如果你想自己构造 URL（例如交给其他 HTTP 客户端）：

```ts
const file = await ctx.getFile(fileId);          // Telegram File 对象
if (!file.file_path) throw new Error("文件不可用（超过 20 MB 或已过期）");

const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
const response = await fetch(url);               // ← 用 fetch —— 不要用 createReadStream（无法打开 URL）
if (!response.ok) throw new Error(`下载失败：HTTP ${response.status}`);
const bytes = new Uint8Array(await response.arrayBuffer());
```

这段代码隐含三条规则：
1. URL 前缀是 `/file/bot<TOKEN>/` —— **`bot` 一词必不可少**。漏掉它是最常见的错误，结果是 `404 Not Found`。
2. 字节由 `fetch` 下载；`fs.createReadStream()` 只能打开**本地路径** —— 传入 URL 会在流错误回调里抛出未捕获的 `ENOENT`。
3. URL 保证**至少 1 小时**有效。不要长期缓存；过期后重新调用 `getFile`。

## 3. 属性命名：`file_path` 与 `filePath`

这个问题至少坑每个开发者一次。两种命名属于不同的层：

| 命名 | 归属 | 示例 |
|---|---|---|
| `snake_case`（`file_path`） | **Telegram 原始对象** —— `getFile()` 的结果、`ctx.message.document`、`ctx.message.photo` | `file.file_path`、`document.file_id`、`photo.file_unique_id` |
| `camelCase`（`filePath`） | **telebibz 的结果类型** —— `DownloadedFile` 和库选项 | `downloaded.filePath`、`downloaded.fileName`、`downloaded.sizeBytes` |

```ts
const file = await ctx.getFile(fileId);
file.file_path;   // ✅ Telegram 对象 → snake_case
file.filePath;    // ❌ undefined —— 那是 DownloadedFile 的字段名

const downloaded = await ctx.downloadFile(fileId);
downloaded.filePath;  // ✅ 库结果 → camelCase
downloaded.file_path; // ❌ undefined
```

如果你明明在日志里看到了 `file_path`，"没有路径" 的检查却失败了，说明你在读 snake_case 对象上的 camelCase 属性。

## 4. 上传：所有来源类型

所有 `replyWith*` 发送器和原始 API 调用都接受 `InputFile` 类型。上传时传 `{ source, filename? }`：

```ts
// 来自磁盘路径（绝对、./ 或 ../ 均可）
await ctx.replyWithDocument({ source: "reports/q3.pdf", filename: "Q3-report.pdf" });

// 来自原始字节
const bytes = new Uint8Array(await someFile.bytes());
await ctx.replyWithDocument({ source: bytes, filename: "data.bin" });

// 来自 Blob 或 File（File 自带文件名）
await ctx.replyWithDocument({ source: new File([bytes], "photo.png") });

// 来自 Web ReadableStream 或 Node 流（自动排空）
import { createReadStream } from "node:fs";
await ctx.replyWithVideo({ source: createReadStream("clip.mp4"), filename: "clip.mp4" });
```

注意：
- `filename` 会覆盖来源自带的名称（路径默认取 basename）。
- **你永远不需要自己拼 `FormData`。** 传输层检测到上传负载后自动切换 multipart。手工构造内含 Node 流的 `FormData` 必定失败（`append` 需要 `Blob`）—— 请始终把流/字节交给库。
- 也可以传裸值：`await ctx.replyWithDocument(bytes)`（无文件名），或直接传已有的 Telegram file id：

```ts
// 通过 file_id 转发 —— 不下载、不上传、无大小限制
await ctx.replyWithDocument(ctx.message.document.file_id);
```

## 5. 上传：发送前校验

`validateUpload()` / `assertValidUpload()` 在字节离开进程之前强制执行你的规则：

```ts
import { assertValidUpload, UploadValidationError } from "@xbibzlibrary/telebibz";

bot.command("doc", async (ctx) => {
  const filePath = ctx.message?.text?.split(/\s+/)[1];
  if (!filePath) return void (await ctx.reply("用法：/doc <路径>"));

  const info = await stat(filePath);
  try {
    assertValidUpload(
      { sizeBytes: info.size, fileName: filePath },
      {
        maxBytes: 50 * 1024 * 1024,                       // Telegram 文档上限
        allowedExtensions: [".pdf", ".docx", ".pptx"],    // 大小写不敏感
      },
    );
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return void (await ctx.reply(`❌ ${error.message}`)); // 列出所有违规项
    }
    throw error;
  }

  await ctx.replyWithDocument({ source: filePath });
});
```

`validateUpload()` 返回问题列表而不是抛异常（空数组 = 通过）。MIME 规则支持通配符：

```ts
validateUpload({ mimeType: "image/png" }, { allowedMimeTypes: ["image/*"] }); // []
```

可用规则：`maxBytes`、`allowedMimeTypes`（精确或 `image/*` 通配）、`allowedExtensions`（点号可选，大小写不敏感）。

## 6. 媒体组与 `attach://`

`sendMediaGroup` 接受 JSON 输入媒体数组；二进制文件作为**独立的表单部分**通过 `attach://<name>` 引用：

```ts
await ctx.replyWithMediaGroup([
  { type: "photo", media: "attach://pic1" },
  { type: "photo", media: "attach://pic2" },
], { pic1: bytes1, pic2: bytes2 } as never);
```

传输层检测到二进制部分后自动切换 multipart；`media` 数组本身序列化为单个 JSON 字段 —— 与 Telegram 的契约完全一致。

## 7. 限制与有效期

| 限制 | 数值 | 说明 |
|---|---|---|
| 通过 `getFile` 下载 | **20 MB** | 更大的文件：`getFile` 直接失败（HTTP 400 "file is too big"）—— 不是 `file_path` 为空 |
| 上传照片 | 10 MB | |
| 上传其他文件 | 50 MB | |
| 通过 `file_id` 转发 | **无限制** | 文件已在 Telegram 侧 |
| 通过 URL 发送 | 照片 5 MB / 其他 20 MB | Telegram 侧抓取该 URL |
| 下载链接有效期 | **≥ 1 小时** | 过期后重新调用 `getFile` |
| `file_path` 是否存在 | schema 中为可选 | 使用前务必检查 |

上传上限属于 Telegram 而非本库 —— `validateUpload()` 让你用友好的提示提前拒绝。

## 8. 本地 Bot API 服务器

自建[本地 Bot API 服务器](https://core.telegram.org/bots/api#using-a-local-bot-api-server)可解除 20 MB 下载限制，并允许最大 2000 MB 的上传：

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  apiBaseUrl: "http://localhost:8081",   // Bot API 选项
  transportOptions: { timeoutMs: 600_000 },
});
```

`downloadFile()` 和 `fileUrl()` 会把 `/bot<token>` 映射为任意 base URL 下的 `/file/bot<token>`，下载同样走本地服务器。注意：本地服务器返回的 `file_path` 是**服务器磁盘上的绝对路径** —— 服务器远程时 fetch 该 URL，bot 与服务器同机时直接读取该路径。

## 9. 离线测试文件流程

`MockTransport`（来自 `@xbibzlibrary/telebibz/testing`）实现了下载成员：

```ts
import { createTestBot } from "@xbibzlibrary/telebibz/testing";

const { bot, transport } = createTestBot();
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "documents/a.pdf" } });
transport.downloadBytes = new TextEncoder().encode("pdf-content");

const file = await bot.downloadFile("F1");
file.fileName;                         // "a.pdf"
new TextDecoder().decode(file.bytes);  // "pdf-content"
transport.downloads;                   // ["documents/a.pdf"] —— 已记录的下载
```

完整测试指南见 [TESTING.zh-CN.md](TESTING.zh-CN.md)。

## 10. 故障排查

| 症状 | 原因 | 修复 |
|---|---|---|
| 日志里明明有 `file_path`，却报"无法获取文件路径" | 在 Telegram 原始对象上读取了 `file.filePath`/`file.path` | 使用 `file.file_path`（snake_case）—— 或干脆用 `ctx.downloadFile()` 跳过手动流程 |
| ReadStream 报 `ENOENT … open 'https://…'` | `createReadStream()` 只能打开本地路径 | URL 用 `fetch(url)`，或使用 `ctx.downloadFile()` |
| 下载 URL 返回 404 | `/file/bot<TOKEN>/` 中缺少 `bot` 前缀 | 使用 `downloadFile()` 的 `url` 字段 —— 它总是构造正确 |
| `getFile` 返回 HTTP 400 "file is too big" | 文件超过 20 MB | 使用本地 Bot API 服务器，或通过 `file_id` 转发 |
| `FormData append: parameter 2 is not of type 'Blob'` | 手工构造的 FormData 里放了 Node 流 | 把 `{ source: stream, filename }` 交给 `replyWith*`；multipart 由库处理 |
| `file_path` 之前有值，现在没了 | 链接过期（>1 小时） | 重新调用 `getFile` |
| 下载的文件为 0 字节 / 内容错误 | `file_id` 属于另一个 bot | `file_id` 与 bot 绑定；请使用你自己 bot 的 update 中的 id |

English: [FILES.md](FILES.md) · Bahasa Indonesia: [FILES.id.md](FILES.id.md)
