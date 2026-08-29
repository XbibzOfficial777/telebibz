# Changelog

## Unreleased

### Fixed

- Restored a green build: `npm run typecheck`, `lint`, `test:types`, `test:examples`, and `build` failed under TypeScript 5.9 with `exactOptionalPropertyTypes` (`Context.me` assignment, `RoutableContext.me` index-signature constraint, and an invalid `webhookCallback` cast).
- The published `telebibz` CLI binary crashed with `MODULE_NOT_FOUND` because `bin/telebibz.mjs` imported `../dist/cli.js`; the build emits `dist/src/cli.js`. `release:check` now verifies every bin import resolves inside the tarball.
- Long polling no longer races its own transport timeout: `getUpdates` now uses a per-request timeout of the polling timeout plus a 10-second buffer instead of the flat 30s transport default, which aborted healthy connections the moment Telegram responded.
- `bot.stop()` now aborts the in-flight long-poll request (the polling `AbortSignal` is passed through to the transport), so shutdown no longer blocks for up to the full polling timeout.
- `JsonFileStorage` now persists `expiresAt` metadata, so values written with a TTL no longer silently become permanent after a restart.
- `webhookCallback` now actually supports Koa-style contexts (`status`/`body`), reads secret-token headers from fetch `Request` header maps, and parses bodies from web-standard `Request` objects instead of misreading their `ReadableStream` `body` as a pre-parsed update.

### Added

- `TransportRequest.timeoutMs` for per-request timeouts, honored by `FetchTransport` and `ApiClient.request()`.
- Regression tests for polling timeout/abort behavior, JSON storage TTL persistence, and webhook framework adapters.

- Callback-query contexts now resolve `message` and `chat` from `callback_query.message`, so `ctx.reply()`, `ctx.edit()`, and `ctx.delete()` work for button callbacks.
- Router matching is first-match by default; explicit `matchMode: "all"` preserves deliberate fan-out without accidental double replies.
- Polling isolates handler failures per update, continues the remainder of a batch, emits `update:error`, and uses abortable reconnect backoff.
- Regex matchers reset `lastIndex` before reuse.

### Added

- JSON-file, Redis, SQL-driver, Mongo-driver, and persistent approval storage adapters.
- Storage-backed conversations, full five-field cron parsing, scheduler error hooks, permission-aware menus, `MenuController`, Web App init-data validation, PaymentsClient, and vendored Telegram declarations.
- Callback-update test fixtures and expanded failure-path/regression coverage.
- Code of Conduct, Contributing Guide, Contribution Rules, Governance, Support Policy, expanded Security Policy, third-party Notice, CODEOWNERS, Dependabot configuration, and complete GitHub issue/PR templates.

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
