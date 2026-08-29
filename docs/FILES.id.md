# Bekerja dengan file: upload, download, validasi (Bahasa Indonesia)

Panduan lengkap setiap alur file di telebibz: mengunduh file yang dikirim user, mengunggah file ke Telegram, mengirim ulang via `file_id`, memvalidasi unggahan, serta batasan dan jebakan Telegram Bot API.

## Daftar isi

1. [Download: satu panggilan dengan `downloadFile()`](#1-download-satu-panggilan-dengan-downloadfile)
2. [Download: alur manual dengan `getFile()`](#2-download-alur-manual-dengan-getfile)
3. [Penamaan property: `file_path` vs `filePath`](#3-penamaan-property-file_path-vs-filepath)
4. [Upload: semua tipe sumber](#4-upload-semua-tipe-sumber)
5. [Upload: validasi sebelum mengirim](#5-upload-validasi-sebelum-mengirim)
6. [Media group dengan `attach://`](#6-media-group-dengan-attach)
7. [Batasan dan masa berlaku](#7-batasan-dan-masa-berlaku)
8. [Local Bot API server](#8-local-bot-api-server)
9. [Menguji alur file tanpa jaringan](#9-menguji-alur-file-tanpa-jaringan)
10. [Troubleshooting](#10-troubleshooting)

## 1. Download: satu panggilan dengan `downloadFile()`

`bot.downloadFile()` / `ctx.downloadFile()` me-resolve `file_id` lewat `getFile` lalu mengunduh byte mentahnya dalam satu panggilan:

```ts
bot.on("message:document", async (ctx) => {
  const fileId = ctx.message.document.file_id;

  // Unduh ke memori…
  const file = await ctx.downloadFile(fileId);
  console.log(file.fileName, file.sizeBytes, file.url);
  // file.bytes adalah Uint8Array

  // …atau langsung ke disk
  const saved = await ctx.downloadFile(fileId, { destination: "downloads/report.pdf" });
  console.log(`Tersimpan di ${saved.savedTo}`);
});
```

Hasilnya (`DownloadedFile`) membawa semua yang dibutuhkan:

| Field | Arti |
|---|---|
| `file` | Objek `File` Telegram yang dikembalikan `getFile` |
| `bytes` | Byte mentah file (`Uint8Array`) |
| `filePath` | `file_path` yang dipakai untuk unduhan |
| `url` | URL unduhan langsung — valid **minimal 1 jam** |
| `fileName` | Segmen path terakhir `filePath` (mis. `report.pdf`) |
| `sizeBytes` | Panjang byte `bytes` |
| `savedTo` | Path lokal, terisi saat Anda memberi `destination` |

Error-nya presisi:
- Telegram tidak mengembalikan `file_path` → `TelegramError` dengan `kind: "validation"`
- Unduhan HTTP-nya sendiri gagal → `TelegramNetworkError` (lengkap dengan status)
- `getFile` gagal (file_id salah, file terlalu besar) → `TelegramError` asli dari Telegram

Keduanya menerima `AbortSignal`:

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000);
const file = await bot.downloadFile(fileId, { signal: controller.signal });
```

## 2. Download: alur manual dengan `getFile()`

Kalau ingin membangun URL sendiri (mis. untuk HTTP client lain):

```ts
const file = await ctx.getFile(fileId);          // objek File Telegram
if (!file.file_path) throw new Error("File tidak tersedia (di atas 20 MB atau kedaluwarsa)");

const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
const response = await fetch(url);               // ← fetch — JANGAN createReadStream (tidak bisa membuka URL)
if (!response.ok) throw new Error(`Unduhan gagal: HTTP ${response.status}`);
const bytes = new Uint8Array(await response.arrayBuffer());
```

Tiga aturan yang terkandung di snippet ini:
1. Prefix URL-nya `/file/bot<TOKEN>/` — **kata `bot` wajib ada**. Lupa menuliskannya adalah kesalahan paling umum dan hasilnya `404 Not Found`.
2. `fetch` yang mengunduh byte; `fs.createReadStream()` hanya membuka **path lokal** — diberi URL ia akan crash dengan `ENOENT` pada stream error yang tidak tertangani.
3. URL dijamin valid **minimal 1 jam**. Jangan pernah cache lama; panggil `getFile` lagi setelah kedaluwarsa.

## 3. Penamaan property: `file_path` vs `filePath`

Ini menjegal semua orang minimal sekali. Dua gaya penamaan ini milik layer yang berbeda:

| Penamaan | Milik | Contoh |
|---|---|---|
| `snake_case` (`file_path`) | **Objek mentah Telegram** — hasil `getFile()`, `ctx.message.document`, `ctx.message.photo` | `file.file_path`, `document.file_id`, `photo.file_unique_id` |
| `camelCase` (`filePath`) | **Tipe hasil telebibz** — `DownloadedFile` dan opsi library | `downloaded.filePath`, `downloaded.fileName`, `downloaded.sizeBytes` |

```ts
const file = await ctx.getFile(fileId);
file.file_path;   // ✅ objek Telegram → snake_case
file.filePath;    // ❌ undefined — itu nama milik DownloadedFile

const downloaded = await ctx.downloadFile(fileId);
downloaded.filePath;  // ✅ hasil library → camelCase
downloaded.file_path; // ❌ undefined
```

Kalau cek "tidak ada path" Anda gagal padahal response yang di-log jelas memuat `file_path`, berarti Anda membaca property camelCase dari objek snake_case.

## 4. Upload: semua tipe sumber

Semua pengirim `replyWith*` dan panggilan API mentah menerima tipe `InputFile`. Kirim unggahan sebagai `{ source, filename? }`:

```ts
// Dari path di disk (absolut, ./, atau ../)
await ctx.replyWithDocument({ source: "reports/q3.pdf", filename: "Q3-report.pdf" });

// Dari byte mentah
const bytes = new Uint8Array(await someFile.bytes());
await ctx.replyWithDocument({ source: bytes, filename: "data.bin" });

// Dari Blob atau File (File membawa namanya sendiri)
await ctx.replyWithDocument({ source: new File([bytes], "photo.png") });

// Dari web ReadableStream atau stream Node (dikuras otomatis)
import { createReadStream } from "node:fs";
await ctx.replyWithVideo({ source: createReadStream("clip.mp4"), filename: "clip.mp4" });
```

Catatan:
- `filename` menimpa nama apa pun yang dimiliki sumber (untuk path, basename dipakai secara default).
- **Anda tidak pernah merakit `FormData` sendiri.** Transport mendeteksi payload unggahan dan beralih ke multipart otomatis. `FormData` buatan tangan dengan stream Node pasti gagal (`append` butuh `Blob`) — selalu serahkan stream/byte ke library.
- Nilai telanjang juga bisa: `await ctx.replyWithDocument(bytes)` (tanpa nama) atau file id Telegram yang sudah ada:

```ts
// Kirim ulang via file_id — tanpa unduh, tanpa upload, tanpa batas ukuran
await ctx.replyWithDocument(ctx.message.document.file_id);
```

## 5. Upload: validasi sebelum mengirim

`validateUpload()` / `assertValidUpload()` menegakkan aturan Anda sendiri sebelum satu byte pun keluar dari proses:

```ts
import { assertValidUpload, UploadValidationError } from "@xbibzlibrary/telebibz";

bot.command("doc", async (ctx) => {
  const filePath = ctx.message?.text?.split(/\s+/)[1];
  if (!filePath) return void (await ctx.reply("Penggunaan: /doc <path>"));

  const info = await stat(filePath);
  try {
    assertValidUpload(
      { sizeBytes: info.size, fileName: filePath },
      {
        maxBytes: 50 * 1024 * 1024,                       // batas dokumen Telegram
        allowedExtensions: [".pdf", ".docx", ".pptx"],    // case-insensitive
      },
    );
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return void (await ctx.reply(`❌ ${error.message}`)); // mencantumkan semua pelanggaran
    }
    throw error;
  }

  await ctx.replyWithDocument({ source: filePath });
});
```

`validateUpload()` mengembalikan daftar issue alih-alih melempar (array kosong = valid). Aturan MIME mendukung wildcard:

```ts
validateUpload({ mimeType: "image/png" }, { allowedMimeTypes: ["image/*"] }); // []
```

Aturan yang tersedia: `maxBytes`, `allowedMimeTypes` (persis atau wildcard `image/*`), `allowedExtensions` (titik opsional, case-insensitive).

## 6. Media group dengan `attach://`

`sendMediaGroup` menerima array JSON input media; file biner ikut sebagai **bagian form terpisah** yang direferensikan lewat `attach://<nama>`:

```ts
await ctx.replyWithMediaGroup([
  { type: "photo", media: "attach://pic1" },
  { type: "photo", media: "attach://pic2" },
], { pic1: bytes1, pic2: bytes2 } as never);
```

Transport mendeteksi bagian biner dan beralih ke multipart otomatis; array `media` sendiri diserialisasi sebagai satu field JSON — persis kontrak Telegram.

## 7. Batasan dan masa berlaku

| Batasan | Nilai | Catatan |
|---|---|---|
| Unduhan via `getFile` | **20 MB** | File lebih besar: `getFile` gagal (HTTP 400 "file is too big") — bukan `file_path` kosong |
| Upload foto | 10 MB | |
| Upload file lain | 50 MB | |
| Kirim ulang via `file_id` | **Tanpa batas** | File sudah ada di Telegram |
| Kirim via URL | 5 MB foto / 20 MB lainnya | Telegram yang mengambil URL-nya |
| Validitas URL unduhan | **≥ 1 jam** | Jalankan `getFile` lagi setelah kedaluwarsa |
| Kehadiran `file_path` | Opsional di skema | Selalu cek sebelum dipakai |

Batas upload milik Telegram, bukan library — `validateUpload()` adalah cara Anda menolak lebih awal dengan pesan yang ramah.

## 8. Local Bot API server

Menjalankan [local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) sendiri menghapus batas unduhan 20 MB dan mengizinkan upload hingga 2000 MB:

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  apiBaseUrl: "http://localhost:8081",   // opsi Bot API
  transportOptions: { timeoutMs: 600_000 },
});
```

`downloadFile()` dan `fileUrl()` memetakan `/bot<token>` ke `/file/bot<token>` di base URL mana pun, jadi unduhan juga bekerja lewat server lokal. Catatan: pada server lokal, `file_path` berupa **path absolut di disk server** — fetch URL-nya hanya bila server jarak jauh; baca path-nya langsung bila bot berjalan di mesin yang sama.

## 9. Menguji alur file tanpa jaringan

`MockTransport` (dari `@xbibzlibrary/telebibz/testing`) mengimplementasikan member download:

```ts
import { createTestBot } from "@xbibzlibrary/telebibz/testing";

const { bot, transport } = createTestBot();
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "documents/a.pdf" } });
transport.downloadBytes = new TextEncoder().encode("pdf-content");

const file = await bot.downloadFile("F1");
file.fileName;                         // "a.pdf"
new TextDecoder().decode(file.bytes);  // "pdf-content"
transport.downloads;                   // ["documents/a.pdf"] — unduhan yang tercatat
```

Lihat [TESTING.id.md](TESTING.id.md) untuk panduan testing lengkap.

## 10. Troubleshooting

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| "Gagal mendapatkan path file" padahal response yang di-log memuat `file_path` | Membaca `file.filePath`/`file.path` dari objek mentah Telegram | Pakai `file.file_path` (snake_case) — atau lewati manual sepenuhnya dengan `ctx.downloadFile()` |
| `ENOENT … open 'https://…'` pada ReadStream | `createReadStream()` hanya membuka path lokal | Pakai `fetch(url)` untuk URL, atau `ctx.downloadFile()` |
| URL unduhan mengembalikan 404 | Prefix `bot` hilang di `/file/bot<TOKEN>/` | Pakai field `url` dari `downloadFile()` — selalu dibangun dengan benar |
| `getFile` mengembalikan HTTP 400 "file is too big" | File di atas 20 MB | Pakai local Bot API server, atau kirim ulang via `file_id` |
| `FormData append: parameter 2 is not of type 'Blob'` | `FormData` buatan tangan berisi stream Node | Serahkan `{ source: stream, filename }` ke `replyWith*`; library yang mengurus multipart |
| `file_path` tadinya ada, sekarang hilang | URL kedaluwarsa (>1 jam) | Panggil `getFile` lagi |
| File terunduh 0 byte / salah | `file_id` milik bot lain | `file_id` bersifat per-bot; pakai id dari update bot Anda sendiri |

English: [FILES.md](FILES.md) · 简体中文: [FILES.zh-CN.md](FILES.zh-CN.md)
