# Panduan penanganan error (Bahasa Indonesia)

Semua jalur error di telebibz, artinya, dan cara menanganinya — dari error API Telegram sampai kegagalan handler, timeout, dan shutdown.

## Daftar isi

1. [Taksonomi error](#1-taksonomi-error)
2. [Anatomi TelegramError](#2-anatomi-telegramerror)
3. [Rate limit 429 dan flood gate](#3-rate-limit-429-dan-flood-gate)
4. [Error handler dan `bot.catch()`](#4-error-handler-dan-botcatch)
5. [handlerTimeout dan `UpdateTimeoutError`](#5-handlertimeout-dan-updatetimeouterror)
6. [Observasi error berbasis event](#6-observasi-error-berbasis-event)
7. [Retry transport dan error jaringan](#7-retry-transport-dan-error-jaringan)
8. [Resep penanganan error](#8-resep-penanganan-error)

## 1. Taksonomi error

Setiap kegagalan API Telegram adalah `TelegramError` dengan `kind`:

| `kind` | Subclass | Arti | Pemicu umum |
|---|---|---|---|
| `rate-limit` | `TelegramRateLimitError` | Telegram menjawab 429 | Kirim terlalu cepat; `retryAfter` terisi |
| `authentication` | `TelegramAuthError` | Token tidak valid/dicabut (401) | Token salah, bot di-revoke, logout |
| `validation` | `TelegramValidationError` | Parameter request buruk (400) | `file_id` tidak dikenal, payload rusak |
| `network` | `TelegramNetworkError` | Kegagalan level transport | DNS, socket, respons non-JSON, unduhan gagal |
| `server` | — | Error server Telegram (5xx) | Transien; di-retry otomatis |
| `retryable` | — | Error Telegram lain yang bisa di-retry | Varian flood-wait |
| `unknown` | — | Lainnya | — |

Cek `kind` saat reaksinya perlu berbeda:

```ts
import { TelegramError, TelegramRateLimitError } from "@xbibzlibrary/telebibz";

try {
  await ctx.reply("halo");
} catch (error) {
  if (error instanceof TelegramError) {
    switch (error.kind) {
      case "rate-limit":     console.log(`pelankan ${error.retryAfter}s`); break;
      case "authentication": console.error("masalah token — berhenti"); break;
      case "validation":     console.warn(error.message); break;
      default:               console.error(error.message);
    }
  }
}
```

`instanceof TelegramRateLimitError` juga bisa dipakai bila hanya peduli 429.

## 2. Anatomi TelegramError

```ts
try {
  await bot.api.methods.getChatMember({ chat_id: -100123, user_id: 42 });
} catch (error) {
  if (error instanceof TelegramError) {
    error.kind;       // salah satu dari tujuh kind di atas
    error.errorCode;  // error_code Telegram (400, 401, 429, …) bila ada
    error.method;     // "getChatMember" — panggilan yang gagal
    error.payload;    // payload yang dikirim
    error.retryAfter; // detik, hanya untuk 429 (dari parameters.retry_after)
    error.message;    // deskripsi dari Telegram
  }
}
```

## 3. Rate limit 429 dan flood gate

Biasanya Anda tidak pernah melihat 429, karena transport sudah menanganinya:

1. Telegram menjawab 429 dengan `parameters.retry_after`.
2. **Flood gate** menjeda permintaan keluar *baru* selama jendela itu — melindungi seluruh trafik, bukan hanya request yang ditolak.
3. Request yang gagal di-retry otomatis, lalu kegagalan (bila bertahan) muncul sebagai `TelegramRateLimitError`.

Flood gate adalah satu-satunya jeda yang pernah diperkenalkan library — tidak pernah ada cooldown proaktif. Atur atau matikan per transport:

```ts
const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  transportOptions: {
    floodGate: false,   // tangani 429 sepenuhnya sendiri
    retries: 3,         // jumlah retry untuk 429/5xx/error jaringan
    backoffMs: 250,     // basis backoff eksponensial
    maxBackoffMs: 8_000,
    timeoutMs: 30_000,  // timeout per request
  },
});
```

Bila gate dimatikan, tangkap `TelegramRateLimitError` dan patuhi `retryAfter` — kata Telegram final:

```ts
catch (error) {
  if (error instanceof TelegramRateLimitError) {
    await sleep((error.retryAfter ?? 1) * 1000);
    return retry();
  }
  throw error;
}
```

## 4. Error handler dan `bot.catch()`

Tanpa error boundary, handler yang melempar akan menolak `handleUpdate()` (dan webhook menjawab 500). Dengan `bot.catch()`, kegagalan diarahkan ke satu tempat:

```ts
bot.catch(async (error, ctx) => {
  console.error("handler gagal:", error);

  if (error instanceof TelegramError && error.kind === "authentication") {
    process.exitCode = 1;             // tak tertolak — biarkan supervisor me-restart
    await bot.stop();
    return;
  }

  await ctx.reply("❌ Terjadi kesalahan. Coba lagi."); // ctx = context update yang gagal
});
```

Perilaku kunci:
- Hanya update yang gagal yang terdampak — chat lain tetap diproses konkuren.
- Urutan per chat tetap terjaga: update berikutnya dari chat yang sama tetap menunggu yang ini.
- Kegagalan `broadcast()` terkumpul di report alih-alih melempar.

## 5. handlerTimeout dan `UpdateTimeoutError`

`handlerTimeout` (default **90 000 ms**, mengikuti Telegraf) melindungi pipeline dari handler yang menggantung:

```ts
const bot = new Bot({ token, handlerTimeout: 30_000 }); // 0 atau Infinity menonaktifkan
```

- Promise `handleUpdate()` untuk update yang menggantung melempar `UpdateTimeoutError` dan mengalir lewat `update:error` → `bot:error` → `bot.catch()`.
- **Handler tetap berjalan di belakang** — session dan conversation tetap menyelesaikan penulisannya; timeout hanya melepaskan pipeline.
- Urutan per chat tidak terpengaruh.

## 6. Observasi error berbasis event

Untuk metrik/logging yang independen dari boundary, dengarkan event bus:

```ts
bot.events.on("update:error", ({ update, error }) => {
  metrics.increment("handler_errors", { updateId: (update as { update_id?: number }).update_id });
});
bot.events.on("bot:error", ({ error }) => log.error("bot error", { error }));
bot.events.on("api:response", ({ method, durationMs }) => {
  if (durationMs > 3_000) log.warn("panggilan api lambat", { method, durationMs });
});
```

## 7. Retry transport dan error jaringan

`FetchTransport` me-retry otomatis saat: 429 (dengan `retry_after` milik Telegram), 5xx, error jaringan, dan respons non-JSON — dengan backoff eksponensial dan jitter. Setelah `retries` percobaan, error terakhir muncul sebagai `TelegramNetworkError` (lengkap `status` dan cause terpotong). Error autentikasi (401) dan validasi (400) **tidak pernah** di-retry — retry tidak akan memperbaikinya.

## 8. Resep penanganan error

**Retry dengan backoff di sekitar satu panggilan** (di luar retry transport):

```ts
async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try { return await run(); }
    catch (error) {
      if (error instanceof TelegramError && ["authentication", "validation"].includes(error.kind)) throw error;
      if (i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 500 * 2 ** i));
    }
  }
  throw new Error("unreachable");
}
```

**Fail cepat saat token buruk** (polling dengan token tidak valid):

```ts
try {
  await bot.start();
} catch (error) {
  if (error instanceof TelegramError && error.kind === "authentication") {
    console.error("TELEGRAM_BOT_TOKEN tidak valid atau dicabut");
  }
  throw error;
}
```

**Shutdown anggun** — `stop()` lebih dulu meng-drain handler yang berjalan:

```ts
process.on("SIGINT", () => { void bot.stop().then(() => process.exit(0)); });
process.on("SIGTERM", () => { void bot.stop().then(() => process.exit(0)); });
```

English: [ERRORS.md](ERRORS.md) · 简体中文: [ERRORS.zh-CN.md](ERRORS.zh-CN.md)
