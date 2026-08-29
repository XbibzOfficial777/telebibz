# Panduan testing (Bahasa Indonesia)

Uji bot telebibz sepenuhnya offline: palsukan transport, rakit update, asersikan panggilan keluar, dan jalankan conversation utuh end-to-end.

## Daftar isi

1. [Subpath testing](#1-subpath-testing)
2. [MockTransport](#2-mocktransport)
3. [Men-drive update ke dalam bot](#3-men-drive-update-ke-dalam-bot)
4. [Asersi panggilan keluar](#4-asersi-panggilan-keluar)
5. [Menguji wizard end-to-end](#5-menguji-wizard-end-to-end)
6. [Menguji unduhan file](#6-menguji-unduhan-file)
7. [Menguji webhook](#7-menguji-webhook)
8. [Menguji jalur error](#8-menguji-jalur-error)
9. [Pola Vitest / Jest](#9-pola-vitest--jest)

## 1. Subpath testing

Semuanya tersedia dari `@xbibzlibrary/telebibz/testing`:

```ts
import { MockTransport, createTestBot, createMockUpdate, createMockCallbackUpdate, createMockContext } from "@xbibzlibrary/telebibz/testing";
```

- `createTestBot()` → `{ bot, transport }` — sebuah `Bot` yang terhubung ke `MockTransport`, branding dimatikan.
- `createMockUpdate(overrides?)` → update pesan teks `/start` sederhana.
- `createMockCallbackUpdate(overrides?)` → update callback-query.
- `createMockContext(bot, update?)` → sebuah `Context` tanpa me-routing apa pun.

## 2. MockTransport

`MockTransport` merekam setiap request keluar dan menjawab dari response yang dikonfigurasi:

```ts
const { bot, transport } = createTestBot();

transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
transport.respond("sendMessage", { ok: true, result: { message_id: 1, date: 0, chat: { id: 1, type: "private" } } });
transport.respond("getFile", (payload) => ({                                   // jawaban dinamis
  ok: true,
  result: { file_id: (payload as { file_id: string }).file_id, file_unique_id: "u", file_path: "documents/a.pdf" },
}));
```

Method yang tidak dikonfigurasi menjawab `{ ok: true, result: true }` — cukup untuk panggilan yang hasilnya Anda abaikan.

Ia juga mengimplementasikan member download:

```ts
transport.downloadBytes = new TextEncoder().encode("file-content");
transport.downloads;            // setiap file_path yang diberikan ke download(), berurutan
transport.fileUrl("a.pdf");     // "mock://files/a.pdf"
```

## 3. Men-drive update ke dalam bot

Daftarkan handler, lalu kirim update — tanpa jaringan, tanpa token:

```ts
bot.on("message", async (ctx) => { await ctx.reply("hi"); });
await bot.init();                       // tepat satu getMe, seperti produksi

await bot.handleUpdate(createMockUpdate({ message: { ...createMockUpdate().message!, text: "hello" } }));
await bot.handleUpdates([updateA, updateB, updateC]);   // satu batch penuh, paralel antar chat
```

Untuk mensimulasikan beberapa chat, variasikan chat id:

```ts
function textUpdate(updateId: number, chatId: number, text: string) {
  const base = createMockUpdate();
  return { ...base, update_id: updateId, message: { ...base.message!, chat: { id: chatId, type: "private" as const }, text } };
}
```

## 4. Asersi panggilan keluar

Setiap request tercatat di `transport.calls` lengkap dengan method dan payload-nya:

```ts
const replies = transport.calls
  .filter((call) => call.method === "sendMessage")
  .map((call) => (call.payload as { text?: string }).text);

expect(replies).toEqual(["Siapa nama Anda?", "Berapa usia Anda?"]);

// Keyboard callback:
const markup = (transport.calls.at(-1)?.payload as { reply_markup?: { inline_keyboard: unknown[][] } }).reply_markup;
expect(markup?.inline_keyboard).toHaveLength(2);
```

## 5. Menguji wizard end-to-end

Berikan conversation satu pesan demi satu pesan dan asersikan balasan yang akan dilihat user:

```ts
import { Bot, Wizard } from "@xbibzlibrary/telebibz";

const wizard = new Wizard()
  .step({ id: "ask", run: async (flow) => { flow.next(); await flow.ctx.reply("Siapa nama Anda?"); } })
  .step({ id: "save", run: async (flow) => { await flow.ctx.reply(`Halo, ${flow.ctx.message?.text}!`); } });
bot.useWizard(wizard);
bot.command("start", async (ctx) => { await wizard.run(ctx); });

await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 7, "Dewi"));

expect(sentTexts()).toEqual(["Siapa nama Anda?", "Halo, Dewi!"]);
```

Dua chat, dua wizard independen — update yang berselang-seling tetap terisolasi karena update dari chat yang sama diserialisasi:

```ts
await bot.handleUpdate(textUpdate(1, 7, "/start"));
await bot.handleUpdate(textUpdate(2, 8, "/start"));
await bot.handleUpdate(textUpdate(3, 7, "Dewi"));
await bot.handleUpdate(textUpdate(4, 8, "Budi"));
expect(sentTexts()).toEqual(["Siapa nama Anda?", "Siapa nama Anda?", "Halo, Dewi!", "Halo, Budi!"]);
```

## 6. Menguji unduhan file

```ts
transport.respond("getFile", { ok: true, result: { file_id: "F1", file_unique_id: "U1", file_path: "photos/pic.jpg" } });
transport.downloadBytes = new TextEncoder().encode("jpeg-bytes");

const file = await bot.downloadFile("F1", { destination: tmpFile });
expect(file.fileName).toBe("pic.jpg");
expect(transport.downloads).toEqual(["photos/pic.jpg"]);
expect(await readFile(tmpFile, "utf8")).toBe("jpeg-bytes");
```

## 7. Menguji webhook

`createWebhookHandler` menerima `Request` Web sungguhan:

```ts
const handler = createWebhookHandler(bot, { secretToken: "s3cret" });

const response = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "s3cret" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(response.status).toBe(200);

// Secret salah → ditolak sebelum handler mana pun berjalan
const rejected = await handler(new Request("https://example.com/telegram", {
  method: "POST",
  headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": "salah" },
  body: JSON.stringify(createMockUpdate()),
}));
expect(rejected.status).toBe(401);
```

## 8. Menguji jalur error

```ts
// Telegram menolak panggilan
transport.respond("sendMessage", { ok: false, error_code: 400, description: "Bad Request: chat not found" });
await expect(ctx.reply("hi")).rejects.toThrow(/chat not found/);

// Handler melempar — asersikan error boundary melihatnya
const errors: unknown[] = [];
bot.events.on("update:error", ({ error }) => errors.push(error));
bot.onText("boom", async () => { throw new Error("boom"); });
await bot.handleUpdate(textUpdate(1, 7, "boom"));
expect(errors).toHaveLength(1);

// handlerTimeout: update yang menggantung melempar UpdateTimeoutError sementara handler tetap berjalan
const slow = new Bot({ token: "123456:TEST", transport, handlerTimeout: 50, branding: false, logger: { level: "silent" } });
let finished = false;
slow.on("message", async () => { await sleep(200); finished = true; });
await expect(slow.handleUpdate(createMockUpdate())).rejects.toBeInstanceOf(UpdateTimeoutError);
// nanti:
expect(finished).toBe(true);
```

## 9. Pola Vitest / Jest

**Senyapkan logger di test** — `logger: { level: "silent" }` tidak memancarkan apa pun (diuji regresi):

```ts
const bot = new Bot({ token: "123456:TEST", transport, branding: false, logger: { level: "silent" } });
```

**Transport segar per test** — jangan pernah berbagi state antar kasus:

```ts
beforeEach(() => { ({ bot, transport } = createTestBot()); });
```

**Mempercepat waktu** — untuk test `Scheduler`/TTL pakai fake timer atau interval kecil (`1ms`); parser cron murni dan bisa diuji tanpa timer:

```ts
import { nextCronOccurrence, parseCronExpression } from "@xbibzlibrary/telebibz";
expect(parseCronExpression("*/15 * * * *")).toBeDefined();
expect(nextCronOccurrence("0 9 * * 1", new Date("2026-08-29T00:00:00Z")).toISOString()).toContain("T09:00");
```

**Jalankan suite**: `npm test` — test E2E yang membutuhkan token asli otomatis di-skip ketika `TELEGRAM_BOT_TOKEN` tidak ada.

English: [TESTING.md](TESTING.md) · 简体中文: [TESTING.zh-CN.md](TESTING.zh-CN.md)
