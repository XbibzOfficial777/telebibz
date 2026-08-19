# Changelog

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

The full object/type schema generator, conversations/scenes/wizard/forms, distributed adapters, Mini App UI SDK, high-level payments subsystem, and authenticated Telegram E2E verification are not complete in this release. See `FEATURE_MATRIX.md`.
