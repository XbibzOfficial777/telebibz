# telebibz Feature Matrix

Runtime yang dibutuhkan: Node.js `>=22`. Status memiliki arti: `IMPLEMENTED` berarti implementasi dan test lokal tersedia; `PARTIAL` berarti core tersedia tetapi coverage atau adapter belum lengkap; `BLOCKED` berarti memerlukan credential/server eksternal; `NOT_AVAILABLE` berarti belum dibuat.

| Feature | Native API | telebibz Abstraction | Implementation | Unit Test | Integration Test | E2E Test | Status |
|---|---|---|---|---|---|---|---|
| Generated Telegram method names | Official Bot API headings | `TELEGRAM_METHOD_NAMES`, dynamic API methods | `generated/api.ts`, generator | Yes | No | No | IMPLEMENTED |
| Strong types for core methods | Official Bot API core subset | `TelegramMethodMap`, `ApiParams`, `ApiResult`, `TelegramTypes` | `src/api/types.ts`, `src/api/telegram.ts`, vendored declarations | Yes | No | Partial | IMPLEMENTED |
| Unknown/future raw methods | Any Bot API method | `api.raw`, `api.call` | `src/api/client.ts` | Yes | No | No | IMPLEMENTED |
| JSON transport | HTTPS Bot API | `FetchTransport` | `src/api/transport.ts` | Yes | No | Blocked without token | IMPLEMENTED |
| Multipart upload | Bot API InputFile | Blob/Uint8Array/path support | `src/api/transport.ts` | Partial | No | Blocked without token | PARTIAL |
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
| Plugin system | Application concern | lifecycle, service container, restart-safe (install once) | `src/plugins/plugin.ts` | Partial | No | No | PARTIAL |
| CLI | Developer tooling | start/init/doctor/webhook/generate/build/test/inspect | `src/cli.ts`, `bin` | Partial | No | No | PARTIAL |
| Message splitting/formatting | Telegram limits | splitMessage, MarkdownV2/HTML helpers | `src/utils/text.ts` | Yes | No | No | PARTIAL |
| Real Telegram E2E | Telegram API | gated tests | `tests/e2e`, deep runners | Yes | Yes | PASS with provided credentials | IMPLEMENTED |
| Full generated object types | Official schema | vendored `TelegramTypes` object/union/enum/method declarations plus specialized core map | `src/api/telegram.ts`, `src/api/telegram-types/` | Yes | No | No | IMPLEMENTED |
| Conversations/scenes/wizard/forms | Framework feature | ConversationManager/Wizard/Form with Storage integration; scene orchestration remains application-owned | `src/state/conversation.ts`, `src/state/forms.ts` | Yes | No | No | PARTIAL |
| Redis/SQL/Mongo adapters | External stores | driver-based storage adapters without vendor runtime dependencies | `src/storage/storage.ts` | Yes | No | No | IMPLEMENTED |
| Mini App UI SDK | Web App | signed init-data parser/validator and Web App query wrapper | `src/telegram-features.ts` | Yes | No | No | PARTIAL |
| Payments orchestration | Bot API payments | invoice, pre-checkout, Web App query, Stars, refund wrapper | `src/telegram-features.ts` | Yes | No | Blocked | PARTIAL |

## Production gate status

| Gate | Result |
|---|---|
| Strict TypeScript typecheck | PASS |
| ESM build | PASS |
| CommonJS build | PASS |
| Unit tests | PASS |
| Integration tests | PASS |
| Type-level tests | PASS |
| E2E Telegram tests | PASS with provided credentials: repository E2E 1/1, deep E2E 19/19, callback 1/1, message management 8/8, polling lifecycle PASS |
| Lint | PASS |
| npm pack verification | PASS (`npm run package:check`, clean tarball install) |
| npm audit | PASS on clean dependency tree (`found 0 vulnerabilities`) |
| Full requested feature scope | PARTIAL: high-level Mini App UI, advanced scenes, and specialized method maps remain bounded |
| Production readiness | PARTIAL: core runtime and persistence are hardened; vendor driver integration and optional high-level UI/scenes remain application-owned |
