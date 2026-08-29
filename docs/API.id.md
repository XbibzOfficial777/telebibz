# Referensi API telebibz — Bahasa Indonesia

[English](API.md) · **Bahasa Indonesia** · [简体中文](API.zh-CN.md)

![telebibz overview](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

Dokumen ini adalah referensi API untuk rilis `@xbibzlibrary/telebibz` yang sedang dipublikasikan. Seluruh signature dan perilaku yang dijelaskan di sini dipetakan dari source TypeScript yang diekspor package. Jika suatu tipe Telegram belum memiliki pemetaan parameter/result khusus, package tetap menyediakan akses runtime melalui API dinamis, tetapi tipe parameternya masih generik.

> **Status implementasi.** Dokumentasi ini menjelaskan kemampuan yang tersedia pada rilis saat ini. `JsonFileStorage`, storage Redis/SQL/Mongo berbasis driver, session/conversation berbasis Storage, cron lima field lengkap, `MenuController`, terminal status output branded, structured logging dengan redaction, validasi Web App, `PaymentsClient`, dan declaration `TelegramTypes` sudah tersedia. Core method map tetap khusus untuk inferensi request/result tertentu, sedangkan `api.raw()` tersedia untuk method Telegram berikutnya.

## Instalasi dan import

```bash
npm install @xbibzlibrary/telebibz
```

ESM:

```ts
import {
  Bot,
  InlineKeyboard,
  compose,
  escapeHtml,
  type Context,
} from "@xbibzlibrary/telebibz";
```

CommonJS:

```js
const { Bot, InlineKeyboard } = require("@xbibzlibrary/telebibz");
```

Subpath exports yang tersedia adalah sebagai berikut.

| Subpath | Isi |
|---|---|
| `@xbibzlibrary/telebibz` | Seluruh public API utama dari `src/index.ts` |
| `@xbibzlibrary/telebibz/api` | Client, transport, errors, dan semua tipe API Telegram |
| `@xbibzlibrary/telebibz/keyboard` | `InlineKeyboard`, `ReplyKeyboard`, dan helpers keyboard |
| `@xbibzlibrary/telebibz/testing` | `MockTransport` dan test factories |

---

## 1. Bot inti

### `BotStatus`

```ts
type BotStatus =
  | "created"
  | "initialized"
  | "starting"
  | "running"
  | "stopping"
  | "stopped"
  | "error";
```

### `BotOptions<S>`

| Properti | Tipe | Default | Keterangan |
|---|---|---:|---|
| `token` | `string` | wajib | Token BotFather dengan format `<digits>:<token>`. |
| `apiBaseUrl` | `string` | `https://api.telegram.org` | Base URL API Telegram. Akhiran `/` dihapus secara otomatis. |
| `transport` | `Transport` | `FetchTransport` | Transport kustom untuk mock, proxy, atau implementasi lain. |
| `transportOptions` | `Omit<FetchTransportOptions, "baseUrl">` | `{}` | Timeout, retry, backoff, jitter, headers, dan fetch implementation. |
| `session` | `Storage<string, S>` | storage baru | Penyimpanan session berdasarkan kunci chat/user; dapat memakai adapter persistent. |
| `services` | `Record<string, unknown>` | `{}` | Dependency/service yang tersedia melalui `ctx.services`. |
| `branding` | `boolean` | `true` | Pengalaman startup terminal: efek ketik, glass progress bar, banner rainbow animasi `Tele Bibz`, dan baris update yang mudah dibaca. Hanya dirender pada TTY interaktif. |
| `polling.timeout` | `number` | `30` | Long-poll timeout dalam detik untuk `getUpdates`. |
| `polling.limit` | `number` | `100` | Jumlah maksimum update per request polling. |
| `polling.allowedUpdates` | `string[]` | `[]` | Filter update Telegram. |
| `polling.retryDelayMs` | `number` | `500` | Delay awal ketika polling gagal. |
| `polling.maxRetryDelayMs` | `number` | `30000` | Batas maksimum delay reconnect. |

### Konstruktor `Bot`

```ts
new Bot<S extends object = Record<string, unknown>>(
  options: string | BotOptions<S>,
): Bot<S>
```

Jika argumen berupa string, string tersebut dianggap sebagai token. Konstruktor membuat `ApiClient`, router, event bus, plugin manager, session storage, dan structured runtime logging yang selalu aktif. Konstruktor langsung memancarkan event `bot:created` secara asinkron.

Konstruktor melempar `Error` jika token kosong atau tidak sesuai pola token Telegram.

### Properti dan getter `Bot`

| API | Tipe | Deskripsi |
|---|---|---|
| `api` | `ApiClient` | Client Telegram typed/dynamic. |
| `router` | `Router<Context<S>>` | Router utama bot. |
| `events` | `EventBus<EventMap>` | Event bus untuk lifecycle, update, API, webhook, dan polling. |
| `plugins` | `PluginManager<Context<S>>` | Manajer lifecycle plugin. |
| `session` | `Storage<string, S>` | Session bot; dapat memakai adapter persistent. |
| `services` | `Record<string, unknown>` | Salinan service yang diberikan saat konstruktor. |
| `token` | `string` | Token bot yang dipakai client. |
| `status` | `BotStatus` | Status lifecycle terkini. |
| `botInfo` | `User \| undefined` | Hasil `getMe()` terakhir yang tersimpan. |

### `bot.use(...middleware)`

```ts
use(...middleware: Middleware<Context<S>>[]): this
```

Menambahkan middleware global. Middleware dijalankan sebelum router pada setiap update, sesuai urutan registrasi. Mengembalikan instance bot untuk chaining.

### `bot.command(name, handler)`

```ts
command(name: string, handler: Middleware<Context<S>>): this
```

Mendaftarkan command Telegram tanpa awalan `/` maupun dengan awalan `/`. Pencocokan mengambil token pertama setelah `/` dan mengabaikan bot mention setelah `@`. Contoh `/start@my_bot` cocok dengan `"start"`.

### `bot.callback(pattern, handler)`

```ts
callback(pattern: string | RegExp, handler: Middleware<Context<S>>): this
```

Jalan pintas untuk route callback query. String yang berakhiran `*` berarti pencocokan prefix; string lain harus sama persis.

### `bot.onText(text, handler)`

```ts
onText(text: string, handler: Middleware<Context<S>>): this
```

Menangani message yang `message.text`-nya sama persis dengan `text`.

### `bot.onRegex(expression, handler)`

```ts
onRegex(expression: RegExp, handler: Middleware<Context<S>>): this
```

Menangani message text menggunakan `RegExp`. Parameter route tidak diekstrak otomatis ke `ctx.params`; gunakan predicate atau middleware custom jika memerlukan ekstraksi.

### `bot.usePlugin(plugin)`

```ts
usePlugin(plugin: Plugin<Context<S>>): this
```

Mendaftarkan plugin. Nama plugin harus unik.

### `bot.init()`

```ts
init(): Promise<this>
```

Memanggil `getMe()`, menyimpan informasi bot, menginisialisasi plugin, dan mengembalikan bot yang siap untuk polling atau pemrosesan update manual.

`init()` idempoten ketika status sudah `initialized` atau `running`.

### `bot.start()`

```ts
start(): Promise<void>
```

Jalan pintas untuk `launch({ mode: "polling" })`. Method ini menjalankan long polling dan menunggu sampai polling dihentikan atau gagal secara fatal.

### `bot.launch(options?)`

```ts
launch(options?: {
  mode: "polling";
  timeout?: number;
  allowedUpdates?: string[];
}): Promise<void>
```

Menjalankan bot dalam mode polling. Saat mulai, lifecycle berpindah melalui `starting` lalu `running`, kemudian loop `getUpdates()` memproses setiap update secara berurutan. Kegagalan polling memancarkan `polling:reconnect` dan menggunakan backoff eksponensial.

Mode selain `"polling"` melempar error dan menyarankan penggunaan `createWebhookHandler()` untuk webhook.

### `bot.stop()`

```ts
stop(): Promise<void>
```

Menghentikan polling melalui `AbortController`, menjalankan `plugins.dispose()`, mengubah status menjadi `stopped`, dan memancarkan event stopping/stopped. Pemanggilan ketika status `created` atau `stopped` tidak melakukan apa-apa.

### `bot.restart()`

```ts
restart(): Promise<void>
```

Menjalankan `stop()` lalu `start()`.

### `bot.health()`

```ts
health(): Promise<HealthStatus>
```

Memanggil `getMe()` untuk memeriksa keterjangkauan API. Tidak melempar error untuk kegagalan request; kegagalan dikembalikan sebagai `apiReachable: false` dan pesan error.

```ts
interface HealthStatus {
  status: BotStatus;
  apiReachable: boolean;
  bot?: User;
  checkedAt: string; // ISO timestamp
  error?: string;
}
```

### `bot.getMe()`

```ts
getMe(): Promise<User>
```

Mengambil data bot dari Telegram dan memperbarui `botInfo`.

### `bot.setCommands(commands, scope?, languageCode?)`

```ts
setCommands(
  commands: BotCommand[],
  scope?: BotCommandScope,
  languageCode?: string,
): Promise<true>
```

Jalan pintas ke `setMyCommands`. `languageCode` dipetakan menjadi field Telegram `language_code`.

### `bot.deleteCommands(scope?, languageCode?)`

```ts
deleteCommands(
  scope?: BotCommandScope,
  languageCode?: string,
): Promise<true>
```

Jalan pintas ke `deleteMyCommands`.

### `bot.handleUpdate(update)`

```ts
handleUpdate(update: Update): Promise<void>
```

Memproses satu update secara manual. Method menentukan kunci session dari `chat.id` dan `from.id`, membuat `Context`, memancarkan event `update` dan `message`, menjalankan middleware lalu router, dan menyimpan session setelah pipeline selesai.

Error pipeline mengubah status bot menjadi `error`, memancarkan `bot:error`, lalu dilempar kembali.

### Contoh bot minimal

```ts
import { Bot, InlineKeyboard } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  polling: { allowedUpdates: ["message", "callback_query"] },
});

bot.command("start", async (ctx) => {
  await ctx.reply("Halo dari telebibz", {
    reply_markup: new InlineKeyboard()
      .text("Status", "status")
      .build(),
  });
});

bot.callback("status", async (ctx) => {
  await ctx.answerCallbackQuery("Bot aktif");
  await ctx.reply("Status: running");
});

await bot.start();
```

---

## 2. Bus peristiwa

### `EventMap`

| Peristiwa | Muatan |
|---|---|
| `bot:created` | `{ bot: unknown }` |
| `bot:initialized` | `{ bot: unknown }` |
| `bot:starting` | `{ bot: unknown }` |
| `bot:started` | `{ bot: unknown }` |
| `bot:stopping` | `{ bot: unknown }` |
| `bot:stopped` | `{ bot: unknown }` |
| `bot:error` | `{ bot: unknown; error: unknown }` |
| `update` | `{ update: unknown }` |
| `message` | `{ message: unknown }` |
| `command` | `{ name: string; update: unknown }` |
| `callback` | `{ data: string; update: unknown }` |
| `api:request` | `{ method: string; payload: unknown }` |
| `api:response` | `{ method: string; durationMs: number; response: unknown }` |
| `api:error` | `{ method: string; durationMs: number; error: unknown }` |
| `webhook:request` | `{ update: unknown }` |
| `polling:reconnect` | `{ error: unknown; attempt: number }` |

### `EventBus<Events>`

```ts
new EventBus<Events extends Record<string, unknown> = EventMap>()
```

| Metode | Tanda tangan | Perilaku |
|---|---|---|
| `on` | `on<K>(event: K, listener: (payload: Events[K]) => void \| Promise<void>): () => void` | Menambah listener dan mengembalikan fungsi unsubscribe. |
| `once` | `once<K>(event: K, listener: ...): () => void` | Listener hanya dipanggil sekali, lalu dilepas. |
| `off` | `off<K>(event: K, listener: ...): void` | Melepas listener tertentu. |
| `emit` | `emit<K>(event: K, payload: Events[K]): Promise<void>` | Memanggil listener secara berurutan dan menunggu masing-masing. |
| `removeAllListeners` | `removeAllListeners(): void` | Menghapus semua listener. |
| `listenerCount` | `listenerCount<K>(event: K): number` | Mengembalikan jumlah listener event. |

```ts
const unsubscribe = bot.events.on("bot:error", ({ error }) => {
  console.error(error);
});
unsubscribe();
```

---

## 3. API client, transport, dan error

### Tipe dasar

```ts
type ChatId = number | string;
type ParseMode = "Markdown" | "MarkdownV2" | "HTML";
type InputFile =
  | string
  | Uint8Array
  | ArrayBuffer
  | Blob
  | NodeJS.ReadableStream
  | { source: string | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream; filename?: string };
```

`InputFile` string dapat berupa string biasa atau path file ketika digunakan sebagai `source` dalam object upload. Pada Node.js, path absolut, `./...`, dan `../...` dibaca oleh `FetchTransport` lalu dikirim sebagai multipart file.

### `TelegramResponse<T>`

```ts
interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: ResponseParameters;
}
```

### `TransportRequest`, `TransportResponse`, dan `Transport`

```ts
interface TransportRequest {
  method: string;
  payload?: Record<string, unknown>;
  signal?: AbortSignal;
}

interface TransportResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: TelegramResponse<T>;
}

interface Transport {
  request<T>(request: TransportRequest): Promise<TransportResponse<T>>;
}
```

### `FetchTransportOptions`

| Properti | Default | Deskripsi |
|---|---:|---|
| `baseUrl` | `https://api.telegram.org` | Prefix URL sebelum `/<method>`. |
| `fetch` | `globalThis.fetch` | Implementasi fetch custom. |
| `timeoutMs` | `30000` | Timeout per attempt. |
| `retries` | `2` | Jumlah retry network error setelah attempt awal. |
| `backoffMs` | `250` | Delay exponential awal. |
| `maxBackoffMs` | `8000` | Batas delay transport. |
| `jitter` | `0.2` | Variasi acak ±20% dari exponential delay. |
| `headers` | `{}` | Header tambahan. |

### `new FetchTransport(options?)`

```ts
new FetchTransport(options?: FetchTransportOptions): FetchTransport
```

Transport bawaan berbasis `fetch`. Payload tanpa upload dikirim sebagai JSON. Payload yang mengandung `Uint8Array`, `ArrayBuffer`, `Blob`, atau nested upload dikirim sebagai `multipart/form-data` menggunakan `FormData`.

### `fetchTransport.request(request)`

```ts
request<T>(request: TransportRequest): Promise<TransportResponse<T>>
```

Mengirim POST ke `${baseUrl}/${method}`. Method dengan awalan `/` dinormalisasi. AbortSignal eksternal diteruskan ke controller internal. Network error yang dianggap retryable akan diulang dengan exponential backoff dan jitter; ketika retry habis, error dibungkus sebagai `TelegramNetworkError`.

### `ApiHookContext`, `ApiClientOptions`, dan `ApiMethods`

```ts
interface ApiHookContext {
  method: string;
  payload: unknown;
  startedAt: number;
  durationMs?: number;
  response?: TelegramResponse<unknown>;
  error?: unknown;
}

interface ApiClientOptions {
  transport: Transport;
  hooks?: {
    onRequest?: (context: ApiHookContext) => void | Promise<void>;
    onResponse?: (context: ApiHookContext) => void | Promise<void>;
    onError?: (context: ApiHookContext) => void | Promise<void>;
  };
}
```

`ApiMethods` adalah mapped type dari 184 `TelegramMethodName`:

```ts
type ApiMethods = {
  [M in TelegramMethodName]:
    (...args: ApiCallArgs<M>) => Promise<ApiResult<M>>;
};
```

### `new ApiClient(options)`

```ts
new ApiClient(options: ApiClientOptions): ApiClient
```

Membuat proxy method dinamis pada `client.methods`. Hook `onRequest` dipanggil sebelum transport, `onResponse` setelah response diterima, dan `onError` ketika request gagal atau response Telegram `ok: false`.

### `api.methods.<method>(params?)`

Method dinamis dapat dipanggil langsung. Method yang memiliki parameter kosong seperti `getMe()` dipanggil tanpa argumen; method lain menerima satu object parameter.

```ts
const me = await bot.api.methods.getMe();
const chat = await bot.api.methods.getChat({ chat_id: "@channel" });
const message = await bot.api.methods.sendMessage({
  chat_id: 123456789,
  text: "Hello",
});
```

### `api.call(method, ...args)`

```ts
call<M extends TelegramMethodName>(
  method: M,
  ...args: ApiCallArgs<M>
): Promise<ApiResult<M>>
```

Bentuk bertipe untuk pemanggilan method berdasarkan string literal.

### `api.request(method, payload?, signal?)`

```ts
request<M extends TelegramMethodName>(
  method: M,
  payload?: ApiParams<M>,
  signal?: AbortSignal,
): Promise<ApiResult<M>>
```

Method request tingkat rendah yang memungkinkan `AbortSignal` eksplisit.

### `api.raw(method, payload?, signal?)`

```ts
raw(
  method: string,
  payload?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<unknown>
```

Memanggil method string sembarang di transport. Gunakan ini untuk method Telegram atau parameter baru yang belum masuk `TelegramMethodMap`. Response `ok: false` tetap diubah menjadi `TelegramError`.

### Parameter dan hasil bertipe yang tersedia

Tipe berikut dipetakan khusus pada rilis ini.

| Method | Parameter | Result |
|---|---|---|
| `getMe` | tidak ada | `User` |
| `getUpdates` | `GetUpdatesParams` | `Update[]` |
| `setWebhook` | `SetWebhookParams` | `boolean` |
| `deleteWebhook` | `{ drop_pending_updates?: boolean }` | `boolean` |
| `getWebhookInfo` | tidak ada | `WebhookInfo` |
| `sendMessage` | `SendMessageParams` | `Message` |
| `editMessageText` | `EditMessageTextParams` | `Message \| true` |
| `deleteMessage` | `DeleteMessageParams` | `true` |
| `answerCallbackQuery` | `AnswerCallbackQueryParams` | `true` |
| `getChat` | `GetChatParams` | `Chat` |
| `getFile` | `GetFileParams` | `File` |
| `getUserProfilePhotos` | `{ user_id: number; offset?: number; limit?: number }` | `UserProfilePhotos` |
| `sendPhoto` | `SendPhotoParams` | `Message` |
| `sendDocument` | `SendDocumentParams` | `Message` |

Tipe parameter tambahan yang tersedia adalah `ReplyParameters`, `LinkPreviewOptions`, `InlineKeyboardButton`, `ReplyMarkup`, `BotCommand`, `BotCommandScope`, dan seluruh tipe update Telegram yang diekspor dari `api/types.ts`.

### Error API

```ts
type TelegramErrorKind =
  | "retryable"
  | "rate-limit"
  | "authentication"
  | "validation"
  | "network"
  | "server"
  | "unknown";
```

#### `TelegramError`

```ts
new TelegramError(message: string, options: {
  method: string;
  payload: unknown;
  errorCode?: number;
  parameters?: ResponseParameters;
  status?: number;
  kind?: TelegramErrorKind;
  cause?: unknown;
})
```

Properti publik adalah `kind`, `errorCode`, `parameters`, `method`, `payload`, dan `status`. Getter `retryAfter` membaca `parameters.retry_after`; getter `migrateToChatId` membaca `parameters.migrate_to_chat_id`.

#### Subclass error

| Class | `name` | `kind` paksa |
|---|---|---|
| `TelegramRateLimitError` | `TelegramRateLimitError` | `rate-limit` |
| `TelegramAuthError` | `TelegramAuthError` | `authentication` |
| `TelegramValidationError` | `TelegramValidationError` | `validation` |
| `TelegramNetworkError` | `TelegramNetworkError` | `network` |

Keempat subclass memakai constructor options yang sama seperti `TelegramError`.

#### `classifyTelegramError(errorCode?, status?)`

```ts
classifyTelegramError(
  errorCode?: number,
  status?: number,
): TelegramErrorKind
```

Klasifikasi aktual: `429` menjadi `rate-limit`; error `401` atau HTTP `401/403` menjadi `authentication`; error code `400–499` menjadi `validation`; HTTP `500+` menjadi `server`; selain itu `unknown`.

#### `telegramErrorFromResponse(response, context)`

```ts
telegramErrorFromResponse<T>(
  response: TelegramResponse<T>,
  context: { method: string; payload: unknown; status?: number },
): TelegramError
```

Mengubah response Telegram gagal menjadi subclass yang sesuai. Error `429`, auth, dan validation menghasilkan subclass khusus; error lain menghasilkan `TelegramError` biasa.

---

## 4. Konteks

### `ContextOptions<S>`

```ts
interface ContextOptions<S extends object = Record<string, unknown>> {
  update: Update;
  api: ApiClient;
  session: S;
  services: Record<string, unknown>;
}
```

### `Context<S>` properties

| Properti | Isi |
|---|---|
| `update` | Update mentah Telegram. |
| `api` | `ApiClient` bot. |
| `session` | Objek session yang dapat diubah milik update key saat ini. |
| `state` | Objek transient per-konteks, tidak otomatis disimpan ke session. |
| `services` | Layanan yang dikirim melalui `BotOptions.services`. |
| `params` | Objek parameter route; router bawaan saat ini tidak mengisi otomatis. |
| `message` | Message utama dari message/edited/channel/business/guest update. |
| `chat` | `message.chat` bila tersedia. |
| `from` / `sender` | Pengguna dari message, callback query, atau inline query. |
| `callbackQuery` | `update.callback_query`. |
| `inlineQuery` | `update.inline_query`. |
| `poll` | `update.poll`. |
| `pollAnswer` | `update.poll_answer`. |
| `chatMember` | `update.chat_member`. |
| `myChatMember` | `update.my_chat_member`. |
| `chatJoinRequest` | `update.chat_join_request`. |
| `reaction` | `update.message_reaction`. |
| `boost` | `chat_boost` atau `removed_chat_boost`. |

### `new Context(options)`

```ts
new Context<S>(options: ContextOptions<S>): Context<S>
```

### Metode pesan Context

| Method | Signature | Perilaku |
|---|---|---|
| `reply` | `reply(text, extra?): Promise<Message>` | Mengirim message ke chat update dan mengisi `reply_parameters.message_id` bila ada message. |
| `send` | `send(text, extra?): Promise<Message>` | Mengirim message ke chat update tanpa reply reference. |
| `edit` | `edit(text, extra?): Promise<Message \| true>` | Mengedit message update menggunakan `editMessageText`. |
| `delete` | `delete(): Promise<true>` | Menghapus message update. |
| `copy` | `copy(fromChatId, messageId, extra?): Promise<unknown>` | Memanggil `copyMessage` ke chat context. |
| `forward` | `forward(fromChatId, messageId, extra?): Promise<Message>` | Memanggil `forwardMessage` ke chat context. |
| `pin` | `pin(messageId?, extra?): Promise<true>` | Memanggil `pinChatMessage`, default message id dari context. |
| `unpin` | `unpin(messageId?, extra?): Promise<true>` | Memanggil `unpinChatMessage`, default message id dari context. |
| `react` | `react(reaction, extra?): Promise<true>` | Memanggil `setMessageReaction`. |
| `answerCallbackQuery` | `answerCallbackQuery(text?, extra?): Promise<true>` | Menjawab callback query aktif. Error jika bukan callback update. |
| `answerInlineQuery` | `answerInlineQuery(results, extra?): Promise<true>` | Menjawab inline query aktif. Error jika bukan inline update. |
| `getChat` | `getChat(): Promise<Chat>` | Mengambil detail chat context. |
| `getUserProfilePhotos` | `getUserProfilePhotos(userId?, extra?): Promise<unknown>` | Mengambil foto profil user context. |
| `getFile` | `getFile(fileId): Promise<unknown>` | Mengambil file berdasarkan id. |
| `withReplyMarkup` | `withReplyMarkup(markup): this` | Menyimpan markup di `ctx.state.reply_markup` dan mengembalikan context. Metode ini tidak otomatis mengirim message. |

`reply`, `send`, `getChat`, dan beberapa helper lain melempar error ketika update tidak memiliki chat yang diperlukan. `edit` dan `delete` membutuhkan chat serta message.

---

## 5. Middleware dan router

### Jenis middleware

```ts
type Next = () => Promise<void>;
type Middleware<Context> = (ctx: Context, next: Next) => void | Promise<void>;
```

### `compose(middleware)`

```ts
compose<Context>(
  middleware: readonly Middleware<Context>[],
): (ctx: Context) => Promise<void>
```

Menyusun middleware dengan pola onion. `next()` menjalankan middleware berikutnya. Jika middleware yang sama memanggil `next()` lebih dari sekali, compose melempar `Error("next() called multiple times")`.

### `middleware(handler)`

```ts
middleware<Context>(handler: Middleware<Context>): Middleware<Context>
```

Pembantu identitas untuk memberi anotasi/inferensi tipe pada middleware.

### `RoutableContext`

Context minimal yang dibutuhkan router: `update`, `message`, `callbackQuery`, dan `params`.

### `Router<Context>`

```ts
new Router<Context extends RoutableContext>(): Router<Context>
```

Route diproses menurut prioritas dan urutan registrasi. Route yang cocok tidak menghentikan route berikutnya secara otomatis; semua route yang cocok dapat dijalankan. Jika tidak ada route yang cocok, `terminal` pada `handle` dipanggil.

| Metode | Tanda tangan | Pencocokan |
|---|---|---|
| `use` | `use(...middleware): this` | Middleware global router dengan priority paling tinggi untuk dijalankan lebih awal. |
| `route` | `route(matcher, ...middleware): this` | Matcher boolean atau async custom. |
| `command` | `command(name: string \| RegExp, ...middleware): this` | Command pertama dari message text yang diawali `/`. |
| `text` | `text(value: string, ...middleware): this` | Pencocokan teks persis. |
| `regex` | `regex(expression: RegExp, ...middleware): this` | `RegExp.test` atas message text atau string kosong. |
| `callback` | `callback(pattern: string \| RegExp, ...middleware): this` | Exact, prefix dengan suffix `*`, atau regex atas callback data. |
| `chat` | `chat(chatId: number \| string, ...middleware): this` | Cocokkan `message.chat.id`, numeric atau string-equivalent. |
| `predicate` | `predicate(matcher, ...middleware): this` | Alias semantik untuk custom matcher. |
| `nest` | `nest(child: Router<Context>): this` | Menjalankan router child sebagai nested route. |
| `handle` | `handle(ctx, terminal?): Promise<void>` | Mengevaluasi dan menjalankan seluruh route yang cocok. |

```ts
const router = new Router<Context>();
router.use(async (ctx, next) => {
  console.log("before");
  await next();
});
router.callback("page:*", async (ctx) => {
  await ctx.answerCallbackQuery();
});
router.predicate((ctx) => Boolean(ctx.from?.id), async (ctx) => {
  await ctx.reply("Authenticated update");
});
```

**Catatan RegExp.** Router memanggil `.test()` langsung. Untuk ekspresi dengan flag `g` atau `y`, sifat stateful `lastIndex` JavaScript dapat memengaruhi pencocokan berulang.

---

## 6. Pembuat keyboard

### `InlineKeyboard`

```ts
new InlineKeyboard(): InlineKeyboard
InlineKeyboard.from(rows: InlineKeyboardButton[][]): InlineKeyboard
```

Builder menyimpan baris secara dapat diubah (mutable) dan seluruh metode builder mengembalikan `this`.

| Method | Signature | Deskripsi |
|---|---|---|
| `from` | `static from(rows): InlineKeyboard` | Membuat keyboard dari rows dan menyalin setiap row. |
| `text` | `text(text, callbackData): this` | Tombol callback. |
| `url` | `url(text, url): this` | Tombol URL. |
| `webApp` | `webApp(text, url): this` | Tombol Web App. |
| `pay` | `pay(text = "Pay"): this` | Tombol pembayaran. |
| `copy` | `copy(text, copiedText): this` | Tombol salin teks. |
| `button` | `button(button): this` | Menambahkan satu tombol ke baris terakhir atau membuat baris pertama. |
| `row` | `row(...buttons): this` | Menambahkan baris baru. |
| `conditional` | `conditional(condition, factory): this` | Menjalankan factory hanya jika kondisi bernilai true. |
| `grid` | `grid(buttons, columns): this` | Membagi tombol ke baris berdasarkan jumlah kolom. |
| `build` | `build(): InlineKeyboardMarkup` | Menghasilkan markup baru. |
| `asReplyMarkup` | `asReplyMarkup(): InlineKeyboardMarkup` | Alias dari `build`. |

Setiap inline button wajib memiliki text dan tepat satu action. Callback data dibatasi maksimum 64 bytes UTF-8; pelanggaran melempar `RangeError`.

```ts
const keyboard = new InlineKeyboard()
  .text("Izinkan", "approve:123")
  .url("Dokumentasi", "https://example.com")
  .row(
    { text: "A", callback_data: "a" },
    { text: "B", callback_data: "b" },
  )
  .build();
```

### `ReplyKeyboard`

```ts
new ReplyKeyboard(): ReplyKeyboard
```

| Method | Signature | Deskripsi |
|---|---|---|
| `text` | `text(text): this` | Tombol teks biasa. |
| `contact` | `contact(text): this` | Meminta kontak. |
| `location` | `location(text): this` | Meminta lokasi. |
| `poll` | `poll(text, type?): this` | Meminta poll `quiz` atau `regular`. |
| `webApp` | `webApp(text, url): this` | Tombol Web App. |
| `button` | `button(button): this` | Tambah satu tombol ke baris terakhir. |
| `row` | `row(...buttons): this` | Tambah baris baru. |
| `grid` | `grid(buttons, columns): this` | Membagi tombol menjadi grid. |
| `build` | `build(options?): ReplyKeyboardMarkup` | Menghasilkan markup dan menggabungkan opsi. |
| `asReplyMarkup` | `asReplyMarkup(): ReplyKeyboardMarkup` | Alias dari `build()` tanpa opsi. |

`columns` harus integer positif; jika tidak, `grid` melempar `RangeError`.

### `removeKeyboard(selective?)`

```ts
removeKeyboard(selective = false): ReplyMarkup
```

Menghasilkan `{ remove_keyboard: true }`, dengan `selective: true` bila diminta.

### `forceReply(placeholder?, selective?)`

```ts
forceReply(placeholder?: string, selective = false): ReplyMarkup
```

Menghasilkan ForceReply. Placeholder hanya ditambahkan jika bernilai truthy.

---

## 7. Storage dan cache

### `Storage<K, V>`

```ts
interface Storage<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, options?: { ttlMs?: number }): Promise<void>;
  delete(key: K): Promise<boolean>;
  has(key: K): Promise<boolean>;
  clear(): Promise<void>;
  keys(): AsyncIterable<K>;
  values(): AsyncIterable<V>;
  entries(): AsyncIterable<[K, V]>;
  update<T extends V>(
    key: K,
    updater: (current: V | undefined) => T | Promise<T>,
    options?: { ttlMs?: number },
  ): Promise<T>;
}
```

### `MemoryStorage<K, V>`

```ts
new MemoryStorage<K, V>(): MemoryStorage<K, V>
```

Implementasi in-memory berbasis `Map`. TTL dibersihkan saat diperlukan ketika key dibaca atau diiterasi; tidak ada timer latar belakang. `update` membuat operasi updater per key berjalan serial sehingga update konkuren untuk key yang sama tidak saling menimpa secara tak terduga.

```ts
const sessions = new MemoryStorage<string, { count: number }>();
await sessions.set("user:1", { count: 0 }, { ttlMs: 60_000 });
await sessions.update("user:1", (current) => ({
  count: (current?.count ?? 0) + 1,
}));
```

### `Cache<K, V>`

```ts
interface Cache<K = string, V = unknown> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, ttlMs?: number): Promise<void>;
  delete(key: K): Promise<boolean>;
  invalidate(prefix?: string): Promise<void>;
  getOrSet(key: K, factory: () => V | Promise<V>, ttlMs?: number): Promise<V>;
}
```

### `MemoryCache`

```ts
new MemoryCache(namespace = "telebibz"): MemoryCache
```

Cache yang menggunakan string sebagai kunci dan menerapkan namespace internal pada setiap key.

| Method | Perilaku |
|---|---|
| `get` | Mengambil value atau `undefined`. |
| `set` | Menyimpan value dengan TTL opsional. |
| `delete` | Menghapus key dan mengembalikan boolean. |
| `invalidate(prefix = "")` | Menghapus semua key dalam namespace yang diawali oleh prefix. |
| `getOrSet` | Mengembalikan nilai dari cache jika ada; jika tidak ada, menjalankan factory, menyimpan hasilnya, lalu mengembalikannya. |

`getOrSet` tidak menggunakan lock deduplikasi; factory dapat dijalankan lebih dari sekali bila dipanggil konkuren saat key belum tersedia.

### `RateLimitResult`

```ts
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs?: number;
}
```

### `TokenBucketLimiter`

```ts
new TokenBucketLimiter(
  capacity: number,
  refillPerSecond: number,
): TokenBucketLimiter
```

Constructor melempar `RangeError` jika salah satu nilai tidak positif. `consume(key, cost = 1)` mengurangi token bila tersedia; jika tidak cukup, mengembalikan `allowed: false` serta estimasi `retryAfterMs`. `clear(key?)` menghapus satu bucket atau seluruh bucket.

---

## 8. Queue dan scheduler

### `Job<T>` dan `QueueOptions`

```ts
interface Job<T = unknown> {
  id: string;
  data: T;
  attempts: number;
  priority: number;
  runAt: number;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  error?: unknown;
}

interface QueueOptions {
  concurrency?: number;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
}
```

### `TaskQueue<T>`

```ts
new TaskQueue<T>(
  worker: (job: Job<T>, signal: AbortSignal) => Promise<void>,
  options?: QueueOptions,
): TaskQueue<T>
```

| Method | Signature | Deskripsi |
|---|---|---|
| `add` | `add(data, options?): Job<T>` | Menambah job; options `id`, `priority`, `delayMs`. Job langsung dijadwalkan. |
| `get` | `get(id): Job<T> \| undefined` | Mengembalikan salinan status job. |
| `cancel` | `cancel(id): boolean` | Membatalkan queued/running job dan abort signal worker. |
| `onIdle` | `onIdle(): Promise<void>` | Menunggu sampai pending dan active kosong. |
| `close` | `close(): Promise<void>` | Menghentikan draining baru dan membatalkan controller aktif. |

Job dengan `priority` lebih besar dijalankan lebih dahulu; jika sama, job dengan `runAt` lebih awal dijalankan lebih dahulu. Percobaan ulang dilakukan sampai nilai `retries` terlampaui. Penundaan percobaan ulang bersifat eksponensial dengan batas `maxBackoffMs` bawaan 30 detik.

### `ScheduledJob`

```ts
interface ScheduledJob {
  id: string;
  cancel: () => void;
}
```

### `Scheduler`

```ts
new Scheduler(): Scheduler
```

| Method | Signature | Deskripsi |
|---|---|---|
| `every` | `every(id, intervalMs, task): ScheduledJob` | Menjalankan task menggunakan `setInterval`. Mengganti timer dengan id sama. |
| `after` | `after(id, delayMs, task): ScheduledJob` | Menjalankan task sekali menggunakan `setTimeout`. |
| `cron` | `cron(id, expression, task): ScheduledJob` | Mendukung format sederhana `*/N` pada field menit, setara interval `N * 60_000`. |
| `cancel` | `cancel(id): boolean` | Membatalkan timer. |
| `clear` | `clear(): void` | Membatalkan semua timer. |

Format cron penuh tidak didukung oleh built-in scheduler. Ekspresi selain `*/N` melempar `Error`.

## 9. Plugin dan services

### `Plugin<Context>`

```ts
interface Plugin<Context = unknown> {
  name: string;
  version?: string;
  install?: (api: PluginApi<Context>) => void | Promise<void>;
  setup?: (api: PluginApi<Context>) => void | Promise<void>;
  onStart?: (api: PluginApi<Context>) => void | Promise<void>;
  onUpdate?: (context: Context) => void | Promise<void>;
  onStop?: (api: PluginApi<Context>) => void | Promise<void>;
  dispose?: (api: PluginApi<Context>) => void | Promise<void>;
}
```

### `PluginApi<Context>`

```ts
interface PluginApi<Context> {
  bot: unknown;
  services: ServiceContainer;
  registerMiddleware: (middleware: unknown) => void;
  registerRoute: (route: unknown) => void;
}
```

Pada rilis ini, `registerMiddleware` dan `registerRoute` tersedia sebagai hook API tetapi manajer implementasi belum menghubungkan keduanya secara otomatis ke bot/router. Plugin dapat memakai `api.bot` dan `api.services` secara langsung.

### `ServiceContainer`

```ts
new ServiceContainer(): ServiceContainer
```

| Method | Signature | Deskripsi |
|---|---|---|
| `register` | `register<T>(name: string \| symbol, value: T): this` | Menyimpan service dan mendukung chaining. |
| `get` | `get<T>(name: string \| symbol): T` | Mengambil service; melempar jika belum terdaftar. |
| `has` | `has(name: string \| symbol): boolean` | Memeriksa keberadaan service. |
| `delete` | `delete(name: string \| symbol): boolean` | Menghapus service. |

### `PluginManager<Context>`

```ts
new PluginManager<Context>(bot: unknown): PluginManager<Context>
```

| Method | Perilaku |
|---|---|
| `use(plugin)` | Menambah plugin; nama duplikat melempar kesalahan. |
| `setup()` | Untuk setiap plugin, menjalankan `install` lalu `setup`. |
| `start()` | Menjalankan `onStart` sesuai urutan registrasi. |
| `update(context)` | Menjalankan `onUpdate` sesuai urutan registrasi. |
| `stop()` | Menjalankan `onStop`. |
| `dispose()` | Menjalankan `dispose` dalam urutan pendaftaran terbalik. |
| `list()` | Mengembalikan daftar plugin hanya baca. |

`Bot.handleUpdate()` pada rilis ini tidak memanggil `plugins.update()` secara otomatis; panggil manajer secara eksplisit bila plugin memerlukan siklus hidup pembaruan.

---

## 10. Webhook

### `WebhookOptions`

```ts
interface WebhookOptions {
  secretToken?: string;
  maxBodyBytes?: number;
  onError?: (error: unknown) => void | Promise<void>;
}
```

### `createWebhookHandler(bot, options?)`

```ts
createWebhookHandler<S extends object>(
  bot: Bot<S>,
  options?: WebhookOptions,
): (request: Request) => Promise<Response>
```

Handler menerima Request standar Web `Request` dan mengembalikan `Response`.

| Kondisi | Response |
|---|---|
| Metode bukan POST | `405 Method Not Allowed`, header `allow: POST` |
| Header secret tidak cocok | `401 Unauthorized` |
| Header `Content-Length` atau body melebihi batas | `413 Payload Too Large` |
| JSON tidak valid atau `update_id` bukan integer | `400 Bad Request` untuk update id; exception saat parsing menghasilkan `500` |
| `bot.handleUpdate` sukses | `200 OK` dengan body `OK` |
| Pengecualian lain | `500 Internal Server Error` dan `onError` dipanggil |

Nilai default `maxBodyBytes` adalah `1_048_576` bytes. Token rahasia Telegram dibaca dari header `x-telegram-bot-api-secret-token`.

```ts
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const handler = createWebhookHandler(bot, {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});

export default { fetch: handler };
```

---

## 11. Percakapan, wizard, formulir, dan menu

### Percakapan

```ts
interface ConversationState {
  name: string;
  step: number;
  values: Record<string, unknown>;
  status: "active" | "completed" | "cancelled";
  updatedAt: number;
}
```

#### `ConversationFlow<S>`

```ts
new ConversationFlow(ctx: Context<S>, state: ConversationState)
```

| Method/property | Signature | Deskripsi |
|---|---|---|
| `ctx` | `Context<S>` | Context update saat ini. |
| `state` | `ConversationState` | State percakapan mutable. |
| `values` | `Record<string, unknown>` | Alias ke `state.values`. |
| `set` | `set<T>(key, value): this` | Menyimpan value dan memperbarui `updatedAt`. |
| `get` | `get<T>(key): T \| undefined` | Mengambil typed value. |
| `next` | `next(): this` | Menaikkan step satu. |
| `previous` | `previous(): this` | Menurunkan step dengan minimum 0. |
| `complete` | `complete(): void` | Status menjadi `completed`. |
| `cancel` | `cancel(): void` | Status menjadi `cancelled`. |

#### `ConversationManager<S>`

```ts
new ConversationManager<S>(): ConversationManager<S>
```

| Method | Signature | Deskripsi |
|---|---|---|
| `start` | `start(key, name, values?): ConversationState` | Membuat atau mengganti conversation state. |
| `get` | `get(key): ConversationState \| undefined` | Mengambil state aktif. |
| `cancel` | `cancel(key): boolean` | Menandai cancelled jika ada. |
| `clearExpired` | `clearExpired(maxAgeMs): number` | Menghapus state yang `updatedAt` lebih lama dari threshold. |
| `run` | `run(ctx, key, name, steps): Promise<ConversationState>` | Menjalankan step sesuai `state.step`; jika tidak ada step, status completed. |

```ts
const conversations = new ConversationManager();
await conversations.run(ctx, "chat:1", "profile", [
  async (flow) => {
    flow.set("name", ctx.message?.text);
    flow.next();
  },
  async (flow) => {
    await flow.ctx.reply(`Nama: ${flow.get<string>("name")}`);
    flow.complete();
  },
]);
```

#### `Wizard<S>` dan `WizardStep<S>`

```ts
interface WizardStep<S> {
  id: string;
  run: (flow: ConversationFlow<S>) => void | Promise<void>;
  optional?: boolean;
}

new Wizard<S>()
```

| Method/property | Deskripsi |
|---|---|
| `step(definition)` | Menambahkan step dan mengembalikan wizard. `optional` disimpan dalam definition tetapi belum diproses khusus oleh runner. |
| `run(ctx, key, manager?)` | Menjalankan step wizard melalui `ConversationManager` dengan name `"wizard"`. |
| `steps` | Daftar step read-only. |

### Formulir

```ts
interface ValidationIssue {
  path: string;
  message: string;
  code?: string;
}

interface Field<T> {
  name: string;
  parse: (input: unknown) => T;
  validate?: (value: T) => string | undefined | Promise<string | undefined>;
  transform?: (value: T) => T | Promise<T>;
  required?: boolean;
}
```

#### `Form<T>`

```ts
new Form<T extends Record<string, unknown>>(): Form<T>
```

| Method | Deskripsi |
|---|---|
| `field(definition)` | Mendaftarkan field typed berdasarkan `name`. |
| `parse(input)` | Memproses seluruh field. Return union success atau issues. Urutan: required check, parse, transform, validate. |
| `reset()` | Menghapus data hasil parse yang tersimpan internal. |

Hasil parse:

```ts
type FormResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] };
```

Issue memakai code `required`, `parse`, atau `invalid`.

#### `validators`

| Validator | Input | Hasil/eror |
|---|---|---|
| `validators.string` | `unknown` | String; selain itu `TypeError("Expected string")`. |
| `validators.number` | `unknown` | Number finite, termasuk numeric string; selain itu `TypeError("Expected number")`. |
| `validators.integer` | `unknown` | Integer; selain itu `TypeError("Expected integer")`. |
| `validators.email` | `unknown` | String dengan pola email sederhana; selain itu `TypeError("Expected email")`. |
| `validators.url` | `unknown` | String yang diterima constructor `URL`; selain itu `TypeError("Expected URL")`. |

### Pagination dan menu

#### `Page<T>`

```ts
interface Page<T> {
  items: T[];
  page: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

#### `paginate(items, page, pageSize)`

```ts
paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): Page<T>
```

Page memakai index berbasis 0. Page yang melebihi batas di-clamp ke halaman terakhir. Collection kosong tetap memiliki `pageCount: 1`. `page` negatif/non-integer atau `pageSize < 1` melempar `RangeError`.

#### `paginationButtons(page, prefix)`

```ts
paginationButtons(
  page: Page<unknown>,
  prefix: string,
): InlineKeyboardButton[]
```

Menghasilkan button `Previous`, indicator `${page + 1}/${pageCount}` dengan callback `${prefix}:noop`, dan `Next` sesuai flag page.

#### `MenuItem`

```ts
interface MenuItem {
  id: string;
  label: string;
  callbackData?: string;
  url?: string;
  visible?: boolean | ((context: MenuContext, item: MenuItem) => boolean | Promise<boolean>);
  permission?: string | ((context: MenuContext, item: MenuItem) => boolean | Promise<boolean>);
}
```

#### `Menu`

```ts
new Menu(id: string): Menu
```

| Method/property | Deskripsi |
|---|---|
| `item(item)` | Menambah item dan mendukung chaining. |
| `breadcrumb(label)` | Menambah label breadcrumb. |
| `build()` | Menunggu predicate visibility, melewati item invisible, lalu menghasilkan `InlineKeyboard`. URL diprioritaskan dibanding callback. |
| `breadcrumbs` | Array breadcrumb read-only. |

`permission` hanya disimpan sebagai metadata item; `Menu.build()` tidak melakukan authorization otomatis.

---

## 12. Logging Terminal

Saat stdout adalah TTY interaktif, setiap `bot.start()` / `bot.launch()` memainkan urutan startup: efek ketik `Installing Dependencies......`, glass progress bar dengan kilau menyapu, dan banner ASCII rainbow animasi `Tele Bibz` (font figlet `Speed`) yang terus mengalir sampai bot terhubung, lalu diam dengan `✓ Connected as @<username>`.

Setiap update yang ditangani bot dicatat dalam baris yang mudah dibaca:

```text
[ => ] Message From 123456789 John Doe 29/08/2026 15:04:05
        ↳ Text: /start
[ => ] Callback From 123456789 John Doe 29/08/2026 15:04:07
        ↳ Data: menu:open
```

Teks pesan/command dibatasi 50 karakter; data tombol callback ditampilkan penuh. Error dicetak merah lengkap dengan stack. Nonaktifkan dengan `branding: false` pada `Bot`, atau set `logger.format: "json"` untuk log terstruktur — pada mode itu update masuk dikeluarkan sebagai entry `update.received`. Stdout non-interaktif (pipe, Docker, CI) otomatis fallback ke teks polos tanpa animasi.

Helper branding tambahan yang diekspor untuk aplikasi: `runStartupSequence()`, `startTeleBibzBanner()`, `printTeleBibzBanner()`, `paintRainbow()`, dan `printStatusLine()`.

## 13. Utilitas Teks

### `escapeMarkdownV2(value)`

```ts
escapeMarkdownV2(value: string): string
```

Meng-escape karakter MarkdownV2 Telegram: `\\_ * [ ] ( ) ~ ` > # + - = | { } . !`.

### `escapeHtml(value)`

```ts
escapeHtml(value: string): string
```

Mengubah `&`, `<`, `>`, dan `"` menjadi HTML entities.

### `md`

Object helper MarkdownV2 berikut tersedia:

| Method | Output konseptual |
|---|---|
| `md.bold(value)` | `*escaped value*` |
| `md.italic(value)` | `_escaped value_` |
| `md.link(label, url)` | `[escaped label](escaped url)` |
| `md.code(value)` | Inline code dengan backtick yang di-escape. |
| `md.pre(value, language?)` | Code block dengan language label opsional. |
| `md.escape(value)` | Alias `escapeMarkdownV2`. |

### `splitMessage(text, options?)`

```ts
splitMessage(
  text: string,
  options?: {
    limit?: number;
    parseMode?: "Markdown" | "MarkdownV2" | "HTML";
  },
): string[]
```

Memecah teks menjadi potongan dengan batas default `4096` karakter. Jika memungkinkan, pemotongan memilih batas paragraf, baris baru, atau spasi; batas hanya dipakai jika terletak lebih dari separuh jendela. `parseMode` diterima sebagai opsi API tetapi belum mengubah algoritma pemotongan.

Limit kurang dari 1 akan melempar `RangeError`.

### `splitCaption(text)`

```ts
splitCaption(text: string): string[]
```

Alias `splitMessage(text, { limit: 1024 })`.

### `template(templateText, values)`

```ts
template(
  templateText: string,
  values: Record<string, unknown>,
): string
```

Mengganti placeholder `{{ key }}` dan nested path seperti `{{ user.name }}`. Nilai `null` atau `undefined` diganti string kosong; nilai lain dikonversi dengan `String()`.

```ts
template("Halo {{ user.name }}", { user: { name: "Ayu" } });
// "Halo Ayu"
```

---

## 14. Testing utilities

Import dari `@xbibzlibrary/telebibz/testing` atau root package.

### `MockTransport`

```ts
new MockTransport(): MockTransport
```

| API | Deskripsi |
|---|---|
| `calls` | Array semua `TransportRequest` yang diterima. |
| `respond(method, response)` | Mengatur response statis atau callback berdasarkan payload dan mengembalikan transport. |
| `request(request)` | Mencatat request dan mengembalikan response mock. Response default adalah `{ ok: true, result: true }`. |

Status mock adalah `200` bila `ok: true`, atau `error_code`/`500` bila `ok: false`.

```ts
const transport = new MockTransport()
  .respond("getMe", {
    ok: true,
    result: { id: 1, is_bot: true, first_name: "Test" },
  });
```

### `createMockUpdate(overrides?)`

```ts
createMockUpdate(overrides?: Partial<Update>): Update
```

Membuat update message default dengan `update_id: 1`, chat private id `1`, user id `2`, dan text `/start`. Object `overrides` digabung shallow dengan default.

### `createTestBot()`

```ts
createTestBot(): { bot: Bot; transport: MockTransport }
```

Membuat bot dengan token test `123456:TEST_TOKEN`, mock `getMe()` yang menghasilkan bot id `99`, dan transport yang dapat diperiksa melalui `transport.calls`.

### `createMockContext(bot, update?)`

```ts
createMockContext(
  bot: Bot,
  update?: Update,
): Context
```

Membuat context menggunakan API bot, session kosong, dan services kosong.

---


## 15. Namespace metode Telegram yang dihasilkan

`generated/api.ts` adalah source internal generator yang mendefinisikan:

```ts
const TELEGRAM_API_VERSION = "10.2";
const TELEGRAM_METHOD_NAMES: readonly string[];
type TelegramMethodName = typeof TELEGRAM_METHOD_NAMES[number];
type GeneratedMethodSpec = {
  params: Record<string, unknown>;
  result: unknown;
};
type GeneratedTelegramMethodMap = {
  [K in TelegramMethodName]: GeneratedMethodSpec;
};
const GENERATED_METHODS: Record<TelegramMethodName, TelegramMethodName>;
```

`TELEGRAM_METHOD_NAMES` berisi 184 nama method pada source generator. Namespace tersebut menjadi dasar proxy `api.methods`, `api.call`, dan `api.request`, tetapi file generated tidak diekspor sebagai package subpath publik pada release ini. Parameter/result yang belum dipetakan khusus dapat dipanggil dengan `api.raw()` atau dengan cast parameter pada TypeScript.

Untuk daftar canonical tanpa pengelompokan, nama method yang tersedia pada generated runtime namespace adalah:

```text
addStickerToSet,
answerCallbackQuery,
answerChatJoinRequestQuery,
answerGuestQuery,
answerInlineQuery,
answerPreCheckoutQuery,
answerShippingQuery,
answerWebAppQuery,
approveChatJoinRequest,
approveSuggestedPost,
banChatMember,
banChatSenderChat,
close,
closeForumTopic,
closeGeneralForumTopic,
convertGiftToStars,
copyMessage,
copyMessages,
createChatInviteLink,
createChatSubscriptionInviteLink,
createForumTopic,
createInvoiceLink,
createNewStickerSet,
declineChatJoinRequest,
declineSuggestedPost,
deleteAllMessageReactions,
deleteBusinessMessages,
deleteChatPhoto,
deleteChatStickerSet,
deleteEphemeralMessage,
deleteForumTopic,
deleteMessage,
deleteMessageReaction,
deleteMessages,
deleteMyCommands,
deleteStickerFromSet,
deleteStickerSet,
deleteStory,
deleteWebhook,
editChatInviteLink,
editChatSubscriptionInviteLink,
editEphemeralMessageCaption,
editEphemeralMessageMedia,
editEphemeralMessageReplyMarkup,
editEphemeralMessageText,
editForumTopic,
editGeneralForumTopic,
editMessageCaption,
editMessageChecklist,
editMessageLiveLocation,
editMessageMedia,
editMessageReplyMarkup,
editMessageText,
editStory,
editUserStarSubscription,
exportChatInviteLink,
forwardMessage,
forwardMessages,
getAvailableGifts,
getBusinessAccountGifts,
getBusinessAccountStarBalance,
getBusinessConnection,
getChat,
getChatAdministrators,
getChatGifts,
getChatMember,
getChatMemberCount,
getChatMenuButton,
getCustomEmojiStickers,
getFile,
getForumTopicIconStickers,
getGameHighScores,
getManagedBotAccessSettings,
getManagedBotToken,
getMe,
getMyCommands,
getMyDefaultAdministratorRights,
getMyDescription,
getMyName,
getMyShortDescription,
getMyStarBalance,
getStarTransactions,
getStickerSet,
getUpdates,
getUserChatBoosts,
getUserGifts,
getUserPersonalChatMessages,
getUserProfileAudios,
getUserProfilePhotos,
getWebhookInfo,
giftPremiumSubscription,
hideGeneralForumTopic,
leaveChat,
logOut,
pinChatMessage,
postStory,
promoteChatMember,
readBusinessMessage,
refundStarPayment,
removeBusinessAccountProfilePhoto,
removeChatVerification,
removeMyProfilePhoto,
removeUserVerification,
reopenForumTopic,
reopenGeneralForumTopic,
replaceManagedBotToken,
replaceStickerInSet,
repostStory,
restrictChatMember,
revokeChatInviteLink,
savePreparedInlineMessage,
savePreparedKeyboardButton,
sendAnimation,
sendAudio,
sendChatAction,
sendChatJoinRequestWebApp,
sendChecklist,
sendContact,
sendDice,
sendDocument,
sendGame,
sendGift,
sendInvoice,
sendLivePhoto,
sendLocation,
sendMediaGroup,
sendMessage,
sendMessageDraft,
sendPaidMedia,
sendPhoto,
sendPoll,
sendRichMessage,
sendRichMessageDraft,
sendSticker,
sendVenue,
sendVideo,
sendVideoNote,
sendVoice,
setBusinessAccountBio,
setBusinessAccountGiftSettings,
setBusinessAccountName,
setBusinessAccountProfilePhoto,
setBusinessAccountUsername,
setChatAdministratorCustomTitle,
setChatDescription,
setChatMemberTag,
setChatMenuButton,
setChatPermissions,
setChatPhoto,
setChatStickerSet,
setChatTitle,
setCustomEmojiStickerSetThumbnail,
setGameScore,
setManagedBotAccessSettings,
setMessageReaction,
setMyCommands,
setMyDefaultAdministratorRights,
setMyDescription,
setMyName,
setMyProfilePhoto,
setMyShortDescription,
setPassportDataErrors,
setStickerEmojiList,
setStickerKeywords,
setStickerMaskPosition,
setStickerPositionInSet,
setStickerSetThumbnail,
setStickerSetTitle,
setUserEmojiStatus,
setWebhook,
stopMessageLiveLocation,
stopPoll,
transferBusinessAccountStars,
transferGift,
unbanChatMember,
unbanChatSenderChat,
unhideGeneralForumTopic,
unpinAllChatMessages,
unpinAllForumTopicMessages,
unpinAllGeneralForumTopicMessages,
unpinChatMessage,
upgradeGift,
uploadStickerFile,
verifyChat
```

> Daftar di atas mengikuti generated source. Jika Telegram menambahkan method baru, jalankan `npm run update:telegram` atau `telebibz generate` setelah schema diperbarui.

---

## 16. CLI

Binary package adalah `telebibz`.

```bash
npx telebibz <command>
```

| Command | Perilaku |
|---|---|
| `telebibz init [directory]` | Membuat directory, `index.ts` minimal, dan `.env.example`. Default directory `my-telebibz-bot`. |
| `telebibz doctor` | Menampilkan Node version, presence `TELEGRAM_BOT_TOKEN`, cwd, package name, lalu health API jika token tersedia. Exit code menjadi 1 jika API tidak reachable. |
| `telebibz generate` | Menjalankan generator method dari `scripts/generate-api.mjs`. |
| `telebibz build` | Menjalankan `npm run build`. |
| `telebibz test` | Menjalankan `npm test`. |
| `telebibz webhook` | Memeriksa `TELEGRAM_BOT_TOKEN`, memakai `TELEGRAM_WEBHOOK_SECRET` bila ada, membuat handler, dan mencetak kesiapan. Command ini tidak membuat HTTP server. |
| `telebibz inspect` | Menampilkan cwd dan Node version. |
| tanpa command | Menampilkan daftar command bantuan. |

Environment variable yang dipakai CLI adalah `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_WEBHOOK_SECRET`.

---

## 17. Tipe Telegram utama

Paket mengekspor tipe data yang paling sering digunakan secara langsung.

| Tipe | Isi penting |
|---|---|
| `User` | ID, penanda bot, nama, username, bahasa, dan penanda kemampuan. |
| `Chat` | ID, tipe, title/username/nama, penanda forum/pesan langsung. |
| `Message` | ID, tanggal, chat, pengirim, teks/caption, entity, reply, markup, plus index signature untuk field Telegram tambahan. |
| `Update` | Semua field update yang didukung sumber, termasuk message, callback, inline, poll, member, join request, reaction, boost, business, dan field ekstensi. |
| `CallbackQuery` | ID, from, message/inline message id, chat instance, data. |
| `InlineQuery` | ID, from, query, offset, tipe chat, lokasi. |
| `Poll`, `PollAnswer` | Data poll dan jawaban. |
| `ChatMemberUpdated`, `ChatJoinRequest` | Perubahan anggota dan permintaan bergabung. |
| `InlineKeyboardMarkup`, `ReplyKeyboardMarkup`, `ReplyKeyboardRemove`, `ForceReply` | Bentuk reply markup Telegram. |
| `MessageEntity`, `ReplyParameters`, `LinkPreviewOptions` | Metadata entity, reply, dan pratinjau tautan. |
| `BotCommand`, `BotCommandScope`, `WebhookInfo`, `File`, `UserProfilePhotos`, `ChatMember`, `ChatAdministratorRights` | Tipe hasil/parameter untuk helper API. |

---

## 18. Persistence, cron lengkap, menu, dan deklarasi Telegram lengkap

### Adapter storage persistent

Semua adapter mengimplementasikan kontrak `Storage<K, V>` yang sama. Package inti tetap tidak memiliki runtime dependency vendor; adapter Redis, SQL, dan Mongo menerima driver kecil yang disediakan aplikasi atau client vendor pilihan aplikasi.

| Class | Konstruktor | Tujuan |
|---|---|---|
| `MemoryStorage<K, V>` | `new MemoryStorage()` | Storage in-memory cepat dengan TTL dan `update()` atomik per key. |
| `JsonFileStorage<V>` | `new JsonFileStorage(filePath)` | Persistensi JSON atomik untuk deployment single-process. |
| `RedisStorage<V>` | `new RedisStorage(client, prefix?)` | Storage Redis melalui `RedisLikeClient`, termasuk TTL dan namespace. |
| `SqlStorage<V>` | `new SqlStorage(driver)` | Storage SQL melalui `SqlStorageDriver` milik aplikasi. |
| `MongoStorage<V>` | `new MongoStorage(collection)` | Storage Mongo melalui `MongoStorageCollection` milik aplikasi. |

`BotOptions.session` menerima `Storage<string, S>`, sehingga session dapat memakai adapter apa pun. `ConversationManager` menerima abstraction yang sama dan menyediakan `getAsync()`, `cancelAsync()`, serta `clearExpiredAsync()` untuk state conversation durable.

```ts
const session = new JsonFileStorage<Record<string, unknown>>("./data/sessions.json");
const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN!, session });
```

### Cron lima field lengkap

`parseCronExpression()` mendukung lima field standar `minute hour day-of-month month day-of-week`, termasuk wildcard, list, range, dan step seperti `*/15 9-17 1,15 * 1-5`. `nextCronOccurrence()` menghitung occurrence lokal berikutnya. `Scheduler.cron()` memakai timer one-shot dan menjadwalkan ulang setelah setiap eksekusi; kegagalan task dikirim ke `Scheduler({ onError })`, bukan menjadi unhandled promise rejection.

### Mode matching router

`new Router()` menggunakan **first-match secara default** untuk mencegah double reply. Gunakan `new Router({ matchMode: "all" })` hanya untuk fan-out yang disengaja. Matcher RegExp mereset `lastIndex`, sehingga expression global atau sticky dapat digunakan ulang dengan aman.

### MenuController dan permission

`Menu` mendukung item berbasis permission, predicate visibility/permission asynchronous, breadcrumb, dan layout multi-kolom. `MenuController` menambahkan render halaman stateful dan dispatch callback untuk `select`, `page`, `noop`, serta callback asing.

### Namespace deklarasi Telegram lengkap

Package memvendorkan declaration Telegram berlisensi MIT dan mengeksposnya sebagai type-only export melalui `TelegramTypes`, serta alias seperti `TelegramUser`, `TelegramMessage`, `TelegramUpdate`, dan `TelegramApiMethods`. CLI memakai kotak Unicode berwarna dengan attribution `Library Bot Telegram By @xbibzofficial`. `Logger` menghasilkan output terminal atau JSON terstruktur dengan level, redaction, ringkasan update, dan opt-in untuk isi pesan user/callback. Declaration ini mencakup surface object, union, enum, dan method tanpa runtime dependency tambahan. Map method inti telebibz tetap khusus untuk method yang memiliki pemetaan parameter/result langsung.

---

## 19. Kompatibilitas dan batasan yang perlu diketahui

Perpustakaan menargetkan Node.js `>=20`, menggunakan ESM sebagai module utama, serta menyediakan build CommonJS. Webhook membutuhkan runtime yang menyediakan Web `Request`, `Response`, `Headers`, `FormData`, `Blob`, dan `AbortController`; Node.js modern menyediakannya secara native.

Daftar method yang dihasilkan API dan peta method API bukanlah hal yang sama. `TelegramMethodName` mencakup 184 nama runtime, tetapi `TelegramMethodMap` hanya memiliki parameter/hasil yang bertipe khusus untuk subset yang tercantum pada bagian API client. Untuk method lain, gunakan `api.raw()` atau tambahkan deklarasi tipe di sisi aplikasi.

State session dan primitive in-memory lainnya hilang saat proses dimulai ulang kecuali aplikasi menyediakan adapter persistent. `BotOptions.session` menerima kontrak generic `Storage<string, S>`.

---

## Referensi

[1]: https://core.telegram.org/bots/api "Telegram Bot API — dokumentasi resmi"
[2]: https://www.npmjs.com/package/@xbibzlibrary/telebibz "@xbibzlibrary/telebibz di npm"
