# telebibz Feature Matrix

Status memiliki arti: `IMPLEMENTED` berarti implementasi dan test lokal tersedia; `PARTIAL` berarti core tersedia tetapi coverage atau adapter belum lengkap; `BLOCKED` berarti memerlukan credential/server eksternal; `NOT_AVAILABLE` berarti belum dibuat.

| Feature | Native API | telebibz Abstraction | Implementation | Unit Test | Integration Test | E2E Test | Status |
|---|---|---|---|---|---|---|---|
| Generated Telegram method names | Official Bot API headings | `TELEGRAM_METHOD_NAMES`, dynamic API methods | `generated/api.ts`, generator | Yes | No | No | IMPLEMENTED |
| Strong types for core methods | Official Bot API core subset | `TelegramMethodMap`, `ApiParams`, `ApiResult` | `src/api/types.ts` | Yes | No | Partial | PARTIAL |
| Unknown/future raw methods | Any Bot API method | `api.raw`, `api.call` | `src/api/client.ts` | Yes | No | No | IMPLEMENTED |
| JSON transport | HTTPS Bot API | `FetchTransport` | `src/api/transport.ts` | Yes | No | Blocked without token | IMPLEMENTED |
| Multipart upload | Bot API InputFile | Blob/Uint8Array/path support | `src/api/transport.ts` | Partial | No | Blocked without token | PARTIAL |
| Telegram error parsing | Response error fields | typed error classes | `src/api/errors.ts` | Yes | No | No | IMPLEMENTED |
| Bot lifecycle | Bot operations | init/start/stop/restart/health | `src/core/bot.ts` | Yes | Yes | Blocked without token | IMPLEMENTED |
| Long polling | getUpdates | offset/retry/backoff/shutdown | `src/core/bot.ts` | Partial | No | Blocked without token | PARTIAL |
| Webhook | setWebhook/update POST | Request/Response handler and secret | `src/webhook/handler.ts` | Yes | Yes | Blocked without deployed endpoint | IMPLEMENTED |
| Context | Update/Message/CallbackQuery | typed getters and helpers | `src/context/context.ts` | Yes | Yes | Partial | PARTIAL |
| Router | Update fields | command/text/regex/callback/chat/predicate/nesting | `src/router/router.ts` | Yes | Yes | No | IMPLEMENTED |
| Middleware | Update processing | async composition and error propagation | `src/middleware/compose.ts` | Yes | Yes | No | IMPLEMENTED |
| Commands | Telegram commands | command matcher and registration | `src/core/bot.ts` | Yes | Yes | Partial | IMPLEMENTED |
| Callback framework | callback query | exact/prefix/regex matching | `src/core/bot.ts` | Yes | Yes | Partial | IMPLEMENTED |
| Inline keyboards | InlineKeyboardMarkup | validated builder | `src/keyboard/index.ts` | Yes | No | Partial | IMPLEMENTED |
| Reply keyboards | ReplyKeyboardMarkup | builder primitives | `src/keyboard/index.ts` | Partial | No | No | PARTIAL |
| Session/state | Application concern | memory session and context state | `src/storage/storage.ts`, `bot.ts` | Yes | Yes | No | PARTIAL |
| Storage abstraction | Application concern | generic Storage and memory adapter | `src/storage/storage.ts` | Yes | No | No | IMPLEMENTED |
| Cache | Application concern | TTL memory cache and namespace | `src/cache/cache.ts` | Partial | No | No | IMPLEMENTED |
| Rate limiter | Telegram flood control | token bucket primitive | `src/cache/cache.ts` | Partial | No | No | PARTIAL |
| Queue | Background work | retry/backoff/concurrency/priority/delay | `src/queue/queue.ts` | Yes | No | No | IMPLEMENTED |
| Scheduler | Background work | interval/one-shot/simple cron | `src/queue/queue.ts` | Partial | No | No | PARTIAL |
| Plugin system | Application concern | lifecycle and service container | `src/plugins/plugin.ts` | Partial | No | No | PARTIAL |
| Owner approval gate | Application concern | pending/approved/denied, owner notification, signed callback, owner-only decision | `src/approval/approval.ts`, `BotOptions.approval` | Yes | Yes | No | IMPLEMENTED |
| CLI | Developer tooling | init/doctor/generate/build/test/inspect | `src/cli.ts`, `bin` | Partial | No | No | PARTIAL |
| Message splitting/formatting | Telegram limits | splitMessage, MarkdownV2/HTML helpers | `src/utils/text.ts` | Yes | No | No | PARTIAL |
| Real Telegram E2E | Telegram API | gated tests | `tests/e2e`, deep runners | Yes | Yes | PASS with provided credentials | IMPLEMENTED |
| Full generated object types | Official schema | all classes/unions/options | generator currently method-name focused | No | No | No | NOT_AVAILABLE |
| Conversations/scenes/wizard/forms | Framework feature | planned | not implemented | No | No | No | NOT_AVAILABLE |
| Redis/SQL/Mongo adapters | External stores | planned optional packages | not implemented | No | No | No | NOT_AVAILABLE |
| Mini App UI SDK | Web App | planned optional package | not implemented | No | No | No | NOT_AVAILABLE |
| Payments orchestration | Bot API payments | raw API only | no high-level subsystem | No | No | Blocked | NOT_AVAILABLE |

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
| Full requested feature scope | PARTIAL: high-level schema/adapters/subsystems remain incomplete |
| Production readiness | PARTIAL, not PASS: requested full scope remains incomplete despite real Telegram E2E passing |
