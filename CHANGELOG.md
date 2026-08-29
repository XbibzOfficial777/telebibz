# Changelog

## 0.4.4 — 2026-08-29

### Added

- `bot.downloadFile(fileId, { signal?, destination? })` and `ctx.downloadFile(fileId)`: resolve `getFile` and download the raw bytes in one call — the result carries the bytes, the direct download URL, the filename, the size, and `savedTo` when persisted to disk. `ctx.getFile()` is now typed as the Telegram `File` object (previously `unknown`, which forced manual casting to reach `file_path`).
- Upload validation utilities: `validateUpload()`, `assertValidUpload()`, and `UploadValidationError` — size limits, MIME allowlists (with wildcards), and extension rules, all before a byte leaves the process.
- Optional `Transport#fileUrl()` and `Transport#download()` members, implemented by `FetchTransport` (`/bot<token>` maps to `/file/bot<token>`, so local Bot API servers work too).
- `MockTransport` mock downloads (`downloads` log and `downloadBytes` fixture) so download flows are testable without network access.
- `docs/STORAGE.md` quick-start recipes in three languages: copy-paste wiring for Memory, JSON file, Redis, SQL, and Mongo storage.
- New example `examples/files.ts` (validated upload + download round trip).

### Fixed

- **Multipart path uploads never worked**: a `{ source: "/path/file" }` payload was sent as plain JSON containing the raw path string — `containsUpload` did not recognize path-like string sources, so the request never switched to multipart and the file was never read. Now fixed and locked with unit tests.
- Web `ReadableStream` and Node.js stream sources are now actually uploaded as multipart parts; they were JSON-stringified before despite being part of the `InputFile` type.
- `{ source: Uint8Array | ArrayBuffer | Blob, filename }` now applies the explicit filename to the multipart part.
- `FEATURE_MATRIX.md` refreshed to current reality (multipart, file download, upload validation, plugin system, CLI, message splitting, conversations, Mini App integration, and payments are `IMPLEMENTED` with tests) plus a Design decisions section documenting the deliberate boundaries (zero runtime dependencies, no web-frontend UI kit, no per-IP limiting, fetch has no upload-progress hook).

### Changed

- 34 new tests (multipart encoding, file download, upload validation, end-to-end wizard flows) — 186 total.

## 0.4.2 — 2026-08-29

### Added

- `bot.action(pattern, handler)` as a drop-in Telegraf alias for `bot.callback(...)`, so handlers written for Telegraf register unchanged.
- Graceful shutdown: `bot.stop()` drains in-flight update handlers (bounded by `handlerTimeout`) before stopping the plugin manager, so active conversations are never truncated mid-write. A handler calling `stop()` from inside itself is excluded from the drain set, so Telegraf-style stop-from-handler never deadlocks.
- Library-only benchmark suite: `npm run benchmark` measures the update pipeline, per-chat serialization, router dispatch, webhook round trips, and broadcast fan-out against `MockTransport` — no token or network required.

### Fixed

- Logger level `silent` printed every message (including errors) because its priority sorted above all message levels; it now emits nothing.
- `printTeleBibzBanner()` and the other branding helpers documented as exported (`runStartupSequence()`, `startTeleBibzBanner()`, `paintRainbow()`, `printStatusLine()`) are now actually exported from the package entry point.
- `handlerTimeout` of `0` (or any non-finite value) now disables the timeout guard, alongside `Infinity`.

### Changed

- README (all three languages): new complete "API surface" index, a Wizards section in the Indonesian and Simplified Chinese READMEs, the `imgbs.com` banner everywhere, fully localized code examples and sections, and a rewritten release-automation section describing the Conventional Commits versioning rules.

## 0.4.1 — 2026-08-29

### Added

- Full Telegraf-parity context surface: moderation (`banChatMember`, `unbanChatMember`, `restrictChatMember`, `promoteChatMember`, `banChatSenderChat`, `unbanChatSenderChat`), chat management (`setChatTitle/Description/Photo`, `deleteChatPhoto`, `setChatPermissions`, `leaveChat`, `unpinAllChatMessages`, `setChatStickerSet`, `deleteChatStickerSet`), member info (`getChatAdministrators`, `getChatMemberCount`, `getChatMember`), invite links (`exportChatInviteLink`, `createChatInviteLink`, `editChatInviteLink`, `revokeChatInviteLink`), join requests (`approveChatJoinRequest`, `declineChatJoinRequest`), polls and live location (`replyWithQuiz`, `stopPoll`, `editMessageLiveLocation`, `stopMessageLiveLocation`), games and payments (`replyWithGame`, `setGameScore`, `getGameHighScores`, `replyWithInvoice`), and the full forum-topic set (`createForumTopic` through `unhideGeneralForumTopic`). Every method acts on `ctx.chat` and accepts native Telegram parameters via `extra`.
- Opt-in Telegraf-style webhook replies: `createWebhookHandler(bot, { webhookReply: true })` (and `bot.handleUpdate(update, { webhookReply })` for custom servers) answers the first API call through the webhook HTTP response itself; the call resolves with `true`, later calls go through the transport, and the lazy `getMe` never claims the slot. Concurrency-safe via `AsyncLocalStorage`.
- `handlerTimeout` (default `90000`, Telegraf's value; `Infinity` disables): hung updates reject `handleUpdate()` with `UpdateTimeoutError` and flow through `update:error`/`bot:error`/the `catch()` boundary while the handler keeps running; per-chat ordering is unaffected.
- `contextType` bot option to plug in a custom `Context` subclass (Telegraf's `contextType`), and `dropPendingUpdates` on `start()`/`launch()` to drop Telegram-held updates before the first `getUpdates` call.

## 0.3.2 — 2026-08-29

### Changed

- README logo image URL updated.

## 0.3.1 — 2026-08-29

### Added

- Concurrent update processing built for 1000+ message bursts: updates run in parallel across chats while staying ordered within a single chat, so a slow handler never blocks other chats, sessions never lose writes, and a concurrent burst triggers exactly one `getMe` initialization. `bot.handleUpdates(updates)` processes a whole batch at once and the polling loop uses it for every `getUpdates` batch. Cap simultaneous work with `updates: { concurrency }` (default `Infinity`).
- `bot.broadcast(chatIds, send, options)` for sending to 1000+ users at once: every chat is attempted immediately (no proactive cooldown, configurable `concurrency`), 429 answers are retried automatically after exactly the `retry_after` delay Telegram ordered, and the returned `BroadcastReport` lists delivered/failed counts with per-chat failure details plus `onProgress` streaming.
- `FetchTransport` flood gate (`floodGate`, default on): when Telegram answers 429, new requests wait out the `retry_after` window Telegram ordered — the only delay ever introduced, never a proactive cooldown.
- `Limiter` and `mapWithConcurrency` concurrency primitives (promise semaphore and ordered concurrent mapping) exported for applications.

### Fixed

- A burst of concurrent updates no longer races `init()`: initialization is memoized, so 1000 simultaneous updates trigger exactly one `getMe` call instead of one per update.
- Session writes are no longer lost when one chat sends several messages at once: same-chat updates are serialized in arrival order, so each update reads the session state written by the previous one.

## 0.2.1 — 2026-08-29

### Breaking

- Node.js 22 is now the minimum supported runtime (`engines.node: ">=22"`); CI tests Node 22 and 24. The TypeScript target moves to ES2023.

### Added

- `bot.on(filter, handler)` update-type filters with payload narrowing: `bot.on("message:photo")`, `bot.on("callback_query:data")`, or an array like `["message:text", "callback_query:data"]`. Invalid filters throw at registration time.
- `bot.hears(trigger, handler)` for exact text or `RegExp` message matching.
- `bot.catch(handler)` error boundary: handler failures are logged, emitted as `update:error`/`bot:error`, and routed to the handler instead of rejecting `handleUpdate()`; webhooks answer `200` and polling continues.
- Extended context senders with automatic quote-reply: `replyWithAnimation`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup`, `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, and `replyWithDice`.
- Animated terminal startup experience (on by default, `branding: false` to disable): typing effect for `Installing Dependencies......`, a glass progress bar with a sweeping highlight, and the animated rainbow ASCII banner `Tele Bibz` (figlet `Speed` font) that flows until the bot connects and then freezes with `✓ Connected as @<username>`.
- Human-readable incoming update logs: `[ => ] Message From {id} {nickname} {dd/mm/yyyy} {hh:mm:ss}` plus an indented content line. Regular message/command text is truncated to 50 characters; callback button data is shown in full. Errors print in red with the full stack. Non-interactive stdout falls back to plain output; `logger.format: "json"` emits structured `update.received` entries instead.
- Branding helpers exported for applications: `runStartupSequence()`, `startTeleBibzBanner()`, `printTeleBibzBanner()`, `paintRainbow()`, `printStatusLine()`, plus `Logger.incoming()` and `describeIncomingUpdate()`.
- `TransportRequest.timeoutMs` for per-request timeouts, honored by `FetchTransport` and `ApiClient.request()`.
- Storage-backed conversations, full five-field cron parsing, scheduler error hooks, permission-aware menus, `MenuController`, Web App init-data validation, PaymentsClient, and vendored Telegram declarations.

### Fixed

- Restored a green build: `npm run typecheck`, `lint`, `test:types`, `test:examples`, and `build` failed under TypeScript 5.9 with `exactOptionalPropertyTypes` (`Context.me` assignment, `RoutableContext.me` index-signature constraint, and an invalid `webhookCallback` cast).
- The published `telebibz` CLI binary crashed with `MODULE_NOT_FOUND` because `bin/telebibz.mjs` imported `../dist/cli.js`; the build emits `dist/src/cli.js`. `release:check` now verifies every bin import resolves inside the tarball.
- Long polling no longer races its own transport timeout: `getUpdates` now uses a per-request timeout of the polling timeout plus a 10-second buffer instead of the flat 30s transport default, which aborted healthy connections the moment Telegram responded.
- `bot.stop()` now aborts the in-flight long-poll request (the polling `AbortSignal` is passed through to the transport), so shutdown no longer blocks for up to the full polling timeout.
- `JsonFileStorage` now persists `expiresAt` metadata, so values written with a TTL no longer silently become permanent after a restart.
- `webhookCallback` now actually supports Koa-style contexts (`status`/`body`), reads secret-token headers from fetch `Request` header maps, and parses bodies from web-standard `Request` objects instead of misreading their `ReadableStream` `body` as a pre-parsed update.
- Passing `reply_parameters` in `extra` no longer discards the automatic quote `message_id`; user options now merge with it across all `reply`/`replyWith*` senders.
- Plugins install exactly once; `bot.restart()` no longer double-registers plugin middleware and routes.
- Callback-query contexts resolve `message` and `chat` from `callback_query.message`, so `ctx.reply()`, `ctx.edit()`, and `ctx.delete()` work for button callbacks.
- Router matching is first-match by default; explicit `matchMode: "all"` preserves deliberate fan-out without accidental double replies.
- Polling isolates handler failures per update, continues the remainder of a batch, emits `update:error`, and uses abortable reconnect backoff.

### Removed

- Development report files (`TELEBIBZ_FINAL_REPORT.md`, `TELEBIBZ_E2E_REPORT.md`, `NPM_RELEASE_REPORT.md`) and the feature-matrix row for an approval gate that was never part of the source tree.

## 0.1.2 — 2026-08-19

### Changed

- README logo now uses the version-pinned jsDelivr CDN URL.

## 0.1.1 — 2026-08-19

### Changed

- Added the telebibz logo asset to the package.
- Rewrote the README around the actual public API and scoped installation path.
- Added concise documentation links for approval, security, and release policy.

## 0.1.0 — 2026-08-19

### Added

- Typed low-level Telegram API client with `call`, `raw`, and `request`.
- Official-documentation-driven method-name generation targeting Bot API 10.2.
- Fetch transport with JSON, multipart, timeout, retry, exponential backoff, jitter, and AbortSignal.
- Typed Telegram error hierarchy and response parsing.
- Bot lifecycle, health checks, polling, update handling, sessions, context, and graceful stop.
- Router matchers for command, text, regex, callback, chat, and custom predicates.
- Async middleware composition.
- Inline and reply keyboard builders with native Telegram payload validation.
- Memory storage, TTL cache, token bucket limiter, task queue, scheduler, plugin manager, service container, webhook handler, CLI, text splitting, and formatting utilities.
- Unit, integration, type-level, and credential-gated E2E tests.
- ESM/CommonJS build configuration, package exports, security policy, CI-ready scripts, and feature matrix.

### Known limitations

The generated method list has runtime coverage for official method names, while specialized request/result inference remains concentrated on the core method map; full Telegram declarations are available through `TelegramTypes`. Scene orchestration and a full Mini App UI layer remain application-owned. Redis, SQL, and Mongo adapters require the application to provide the corresponding vendor driver interface. See `FEATURE_MATRIX.md`.
