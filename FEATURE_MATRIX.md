# telebibz Feature Matrix

Runtime yang dibutuhkan: Node.js `>=22`. Status memiliki arti: `IMPLEMENTED` berarti implementasi dan test lokal tersedia; `PARTIAL` berarti core tersedia tetapi coverage atau adapter belum lengkap; `BLOCKED` berarti memerlukan credential/server eksternal; `NOT_AVAILABLE` berarti belum dibuat.

| Feature | Native API | telebibz Abstraction | Implementation | Unit Test | Integration Test | E2E Test | Status |
|---|---|---|---|---|---|---|---|
| Generated Telegram method names | Official Bot API headings | `TELEGRAM_METHOD_NAMES`, dynamic API methods | `generated/api.ts`, generator | Yes | No | No | IMPLEMENTED |
| Strong types for core methods | Official Bot API core subset | `TelegramMethodMap`, `ApiParams`, `ApiResult`, `TelegramTypes` | `src/api/types.ts`, `src/api/telegram.ts`, vendored declarations | Yes | No | Partial | IMPLEMENTED |
| Unknown/future raw methods | Any Bot API method | `api.raw`, `api.call` | `src/api/client.ts` | Yes | No | No | IMPLEMENTED |
| JSON transport | HTTPS Bot API | `FetchTransport` | `src/api/transport.ts` | Yes | No | Blocked without token | IMPLEMENTED |
| Multipart upload | Bot API InputFile | Blob/Uint8Array/ArrayBuffer/path/web+Node stream sources, explicit filenames, media-group `attach://` pattern | `src/api/transport.ts` | Yes | Yes | Blocked without token | IMPLEMENTED |
| File download | `getFile` + file endpoint | `bot.downloadFile()` / `ctx.downloadFile()` with bytes, URL, filename, optional disk persistence; `transport.fileUrl()`/`download()` | `src/api/client.ts`, `src/api/transport.ts`, `src/core/bot.ts`, `src/context/context.ts` | Yes | Yes | Blocked without token | IMPLEMENTED |
| Upload validation | Application concern | `validateUpload()` / `assertValidUpload()` size, MIME (wildcard), and extension rules; `UploadValidationError` | `src/utils/files.ts` | Yes | Yes | No | IMPLEMENTED |
| Telegram error parsing | Response error fields | typed error classes | `src/api/errors.ts` | Yes | No | No | IMPLEMENTED |
| Bot lifecycle | Bot operations | init/start/stop/restart/health | `src/core/bot.ts` | Yes | Yes | Blocked without token | IMPLEMENTED |
| Long polling | getUpdates | offset/retry/backoff/shutdown, per-update error isolation, abortable reconnect | `src/core/bot.ts` | Yes | Yes | Blocked without token | IMPLEMENTED |
| Webhook | setWebhook/update POST | Request/Response handler and secret | `src/webhook/handler.ts` | Yes | Yes | Blocked without deployed endpoint | IMPLEMENTED |
| Terminal experience | Developer UX | typing effect, glass progress bar, animated rainbow banner, human-readable update lines, red errors | `src/branding/terminal.ts`, `src/observability/logger.ts` | Yes | No | No | IMPLEMENTED |
| Context | Update/Message/CallbackQuery | typed getters, callback message fallback, reply/edit/delete helpers, 17 `replyWith*` senders (text, photo, video, audio, voice, document, animation, video note, sticker, media group, location, venue, contact, poll, dice, HTML, Markdown) with automatic quote-reply | `src/context/context.ts` | Yes | Yes | Partial | IMPLEMENTED |
| Router | Update fields | command/text/regex/callback/chat/predicate/nesting/update-type filters (`on`) | `src/router/router.ts` | Yes | Yes | No | IMPLEMENTED |
| Update-type filters | Telegram `Update` object | `bot.on("message:photo")`, `bot.on(["message:text", "callback_query:data"])` with validated filter grammar | `src/router/router.ts`, `src/core/bot.ts` | Yes | Yes | No | IMPLEMENTED |
| Text/regex triggers | Message text | `bot.hears("ping")` / `bot.hears(/regex/)` | `src/core/bot.ts` | Yes | Yes | No | IMPLEMENTED |
| Error boundary | Handler failures | `bot.catch(handler)`; without it errors reject `handleUpdate()` and webhooks answer 500 | `src/core/bot.ts` | Yes | Yes | No | IMPLEMENTED |
| Middleware | Update processing | async composition and error propagation | `src/middleware/compose.ts` | Yes | Yes | No | IMPLEMENTED |
| Commands | Telegram commands | command matcher and registration | `src/core/bot.ts` | Yes | Yes | Partial | IMPLEMENTED |
| Callback framework | callback query | exact/prefix/regex matching | `src/core/bot.ts` | Yes | Yes | Partial | IMPLEMENTED |
| Inline keyboards | InlineKeyboardMarkup | validated builder | `src/keyboard/index.ts` | Yes | No | Partial | IMPLEMENTED |
| Reply keyboards | ReplyKeyboardMarkup | validated builder primitives and native payloads | `src/keyboard/index.ts` | Yes | No | No | IMPLEMENTED |
| Session/state | Application concern | generic Storage session, JSON/Redis/SQL/Mongo adapters, context state | `src/storage/storage.ts`, `bot.ts` | Yes | Yes | No | IMPLEMENTED |
| Storage abstraction | Application concern | generic Storage and memory adapter | `src/storage/storage.ts` | Yes | No | No | IMPLEMENTED |
| Cache | Application concern | generic storage-backed TTL cache and namespace | `src/cache/cache.ts`, `src/storage/storage.ts` | Yes | No | No | IMPLEMENTED |
| Rate limiter | Telegram flood control | validated token bucket primitive with reset/retry metadata | `src/cache/cache.ts` | Yes | No | No | IMPLEMENTED |
| Queue | Background work | retry/backoff/concurrency/priority/delay | `src/queue/queue.ts` | Yes | No | No | IMPLEMENTED |
| Scheduler | Background work | interval/one-shot/full five-field cron, reschedule, error hook | `src/queue/queue.ts` | Yes | No | No | IMPLEMENTED |
| Plugin system | Application concern | lifecycle, service container, restart-safe (install once) | `src/plugins/plugin.ts` | Yes | No | No | IMPLEMENTED |
| CLI | Developer tooling | start/init/dev/doctor/webhook/generate/build/test/inspect | `src/cli.ts`, `bin` | Yes | No | No | IMPLEMENTED |
| Message splitting/formatting | Telegram limits | splitMessage/splitCaption, MarkdownV2/HTML escape helpers, `md`/`html` builders, templates | `src/utils/text.ts` | Yes | No | No | IMPLEMENTED |
| Real Telegram E2E | Telegram API | gated tests | `tests/e2e`, deep runners | Yes | Yes | PASS with provided credentials | IMPLEMENTED |
| Full generated object types | Official schema | vendored `TelegramTypes` object/union/enum/method declarations plus specialized core map | `src/api/telegram.ts`, `src/api/telegram-types/` | Yes | No | No | IMPLEMENTED |
| Conversations/wizard/forms | Framework feature | ConversationManager/Wizard/Form with Storage integration; non-linear scene orchestration is deliberately application-owned (see Design decisions) | `src/state/conversation.ts`, `src/state/forms.ts` | Yes | Yes | No | IMPLEMENTED |
| Redis/SQL/Mongo adapters | External stores | driver-based storage adapters without vendor runtime dependencies | `src/storage/storage.ts` | Yes | No | No | IMPLEMENTED |
| Mini App integration | Web App | signed init-data parser/validator and Web App query wrapper; UI components are a web-frontend concern outside a bot library (see Design decisions) | `src/telegram-features.ts` | Yes | No | No | IMPLEMENTED |
| Payments | Bot API payments | invoice links, invoices, pre-checkout answers, Web App query answers, Stars transactions/refunds; external provider orchestration is application-owned | `src/telegram-features.ts` | Yes | No | Blocked without token | IMPLEMENTED |

## Production gate status

| Gate | Result |
|---|---|
| Strict TypeScript typecheck | PASS |
| ESM build | PASS |
| CommonJS build | PASS |
| Unit tests | PASS (186 tests) |
| Integration tests | PASS (webhook, registration wizard flows, photo download, upload validation) |
| Type-level tests | PASS |
| E2E Telegram tests | PASS with provided credentials: repository E2E 1/1, deep E2E 19/19, callback 1/1, message management 8/8, polling lifecycle PASS |
| Lint | PASS |
| npm pack verification | PASS (`npm run package:check`, clean tarball install) |
| npm audit | PASS on clean dependency tree (`found 0 vulnerabilities`) |
| Benchmark suite | PASS (`npm run benchmark`: ~33k updates/s pipeline, ~11k webhook req/s, ~99k broadcast msgs/s against MockTransport) |
| Full requested feature scope | Telegram Bot API surface, runtime, state, and developer tooling are complete; non-linear scenes and web-frontend UI kits are deliberately application-owned (see Design decisions) |
| Production readiness | READY: zero runtime dependencies, dual ESM/CJS builds, graceful shutdown, 429 flood handling, per-chat ordering, and full local test coverage; see Design decisions for the deliberate boundaries |

## Design decisions

Boundaries yang disengaja (bukan kekurangan implementasi):

- **Nol runtime dependency.** Redis/SQL/Mongo adapter memakai driver interface kecil (`RedisLikeClient`, `SqlStorageDriver`, `MongoStorageCollection`) sehingga aplikasi memilih driver dan versinya sendiri; core tetap bebas dependency vendor. Resep cepat: [docs/STORAGE.md](docs/STORAGE.md).
- **Mini App UI kit berada di luar scope.** UI Mini App adalah HTML/CSS/JS di browser; library bot hanya bertanggung jawab atas validasi `initData` dan query Web App — keduanya lengkap dan teruji.
- **Scene non-linear tetap milik aplikasi.** Wizard linear, conversation state, dan forms disediakan; orkestrasi scene bebas-graf milik Telegraf tidak direplikasi karena dapat disusun dari `ConversationManager` + router.
- **Progress upload tidak disediakan.** API `fetch` standar tidak punya hook progress upload; mengandalkan implementasi spesifik undici akan mengikat library pada satu runtime. Unggah tetap berjalan penuh (multipart, hingga batas Telegram).
- **Rate limiting per-IP tidak relevan untuk bot Telegram** (server tidak mengekspos IP pengirim). Yang disediakan: `TokenBucketLimiter` per-key (per user/chat/metode), `Limiter` konkurensi, dan flood gate 429 otomatis di transport yang menunggu persis `retry_after` Telegram.
- **Relative time format & scheduled callback bukan konsep Bot API** — tidak ada field demikian di objek Bot API, sehingga tidak ada yang diimplementasikan.
- **Tunnel ngrok built-in tidak disediakan.** Webhook handler siap pakai; endpoint publik dan tunneling adalah keputusan infrastruktur aplikasi.
