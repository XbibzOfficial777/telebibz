# telebibz Documentation

The default documentation language is **English**. Every guide below is available in English, Bahasa Indonesia, and 简体中文.

| Language | README | Getting started | Complete API reference |
|---|---|---|---|
| English (default) | [`README.md`](../README.md) | [`GETTING_STARTED.md`](GETTING_STARTED.md) | [`API.md`](API.md) |
| Bahasa Indonesia | [`README.id.md`](../README.id.md) | [`GETTING_STARTED.id.md`](GETTING_STARTED.id.md) | [`API.id.md`](API.id.md) |
| 简体中文 | [`README.zh-CN.md`](../README.zh-CN.md) | [`GETTING_STARTED.zh-CN.md`](GETTING_STARTED.zh-CN.md) | [`API.zh-CN.md`](API.zh-CN.md) |

![telebibz overview](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

The documentation covers the complete lifecycle: onboarding, bot startup and shutdown, API client and transport, update routing, middleware and context, state/session, interaction UI, background work, files, errors, webhook deployment, testing, migration, and production recipes.

## Complete guide catalog

Every topic guide ships in three languages (EN · ID · ZH). Pick a topic, pick a language:

| Guide | English | Bahasa Indonesia | 简体中文 | Purpose |
|---|---|---|---|---|
| Getting started | [`GETTING_STARTED.md`](GETTING_STARTED.md) | [`GETTING_STARTED.id.md`](GETTING_STARTED.id.md) | [`GETTING_STARTED.zh-CN.md`](GETTING_STARTED.zh-CN.md) | Five-minute onboarding from installation to a working bot. |
| Complete API reference | [`API.md`](API.md) | [`API.id.md`](API.id.md) | [`API.zh-CN.md`](API.zh-CN.md) | Every exported class, method, type, error, and generated Telegram method. |
| Files: upload & download | [`FILES.md`](FILES.md) | [`FILES.id.md`](FILES.id.md) | [`FILES.zh-CN.md`](FILES.zh-CN.md) | `downloadFile()`, manual `getFile()`, `file_path` vs `filePath`, upload sources, validation, limits, troubleshooting. |
| Errors | [`ERRORS.md`](ERRORS.md) | [`ERRORS.id.md`](ERRORS.id.md) | [`ERRORS.zh-CN.md`](ERRORS.zh-CN.md) | Error taxonomy, 429 and the flood gate, `bot.catch()`, `handlerTimeout`, retries, graceful shutdown. |
| Webhook | [`WEBHOOK.md`](WEBHOOK.md) | [`WEBHOOK.id.md`](WEBHOOK.id.md) | [`WEBHOOK.zh-CN.md`](WEBHOOK.zh-CN.md) | Polling vs webhook, `createWebhookHandler()`, Express/http/Fastify/Koa, `setWebhook`, secret tokens, tunnels, production checklist. |
| Testing | [`TESTING.md`](TESTING.md) | [`TESTING.id.md`](TESTING.id.md) | [`TESTING.zh-CN.md`](TESTING.zh-CN.md) | Fully offline testing with `MockTransport`, driving updates, wizards end to end, webhooks, error paths, Vitest patterns. |
| Migration from Telegraf | [`MIGRATION_TELEGRAF.md`](MIGRATION_TELEGRAF.md) | [`MIGRATION_TELEGRAF.id.md`](MIGRATION_TELEGRAF.id.md) | [`MIGRATION_TELEGRAF.zh-CN.md`](MIGRATION_TELEGRAF.zh-CN.md) | Side-by-side port, concept map, context methods, scenes → wizards, webhooks. |
| Storage | [`STORAGE.md`](STORAGE.md) | [`STORAGE.id.md`](STORAGE.id.md) | [`STORAGE.zh-CN.md`](STORAGE.zh-CN.md) | Memory/JSON/Redis/SQL/Mongo adapters, TTL, atomic `update()`. |
| Production cookbook | [`COOKBOOK.md`](COOKBOOK.md) | [`COOKBOOK.id.md`](COOKBOOK.id.md) | [`COOKBOOK.zh-CN.md`](COOKBOOK.zh-CN.md) | Thirteen verified recipes: rate limiting, auth, broadcast, scheduling, queues, menus, forms, caching, Mini Apps, payments, metrics. |
| GitHub Packages install | [`GITHUB_PACKAGES.md`](GITHUB_PACKAGES.md) | [`GITHUB_PACKAGES.id.md`](GITHUB_PACKAGES.id.md) | [`GITHUB_PACKAGES.zh-CN.md`](GITHUB_PACKAGES.zh-CN.md) | Installing via GitHub Packages with a personal access token. |

Also available: [`../examples/README.md`](../examples/README.md) — runnable minimal, wizard, file, and webhook starters, and [`../SHOWCASE.md`](../SHOWCASE.md) — community project showcase.

## Coverage status

| Area | Status |
|---|---|
| Getting started | Dedicated guides in EN/ID/ZH with runnable examples |
| Complete API reference | Available in EN/ID/ZH |
| Bot lifecycle, polling, webhook | Core implementation, per-update error isolation, reconnect backoff, and tests available |
| API client and generated method list | Available; full vendored Telegram declarations exposed through `TelegramTypes` |
| Router, middleware, context | Available and tested; first-match is default, all-match is explicit |
| Keyboard, callback, menus, pagination | Keyboard/callback core, permission menus, MenuController, and pagination available |
| Sessions, conversations, wizards, forms | Storage-backed session/conversation primitives and forms available; scene orchestration remains application-owned |
| Storage, cache, queue, scheduler | Memory, JSON file, Redis, SQL, Mongo driver adapters, cache, queue, and full five-field cron available |
| Files | Dedicated guide: one-call `downloadFile()`, upload sources, validation, limits, troubleshooting (EN/ID/ZH) |
| Errors | Dedicated guide: taxonomy, 429/flood gate, boundaries, timeouts, retries (EN/ID/ZH) |
| Webhook deployment | Dedicated guide: handler, four frameworks, registration, secrets, tunnels, checklist (EN/ID/ZH) |
| Testing | Dedicated guide: MockTransport, update drivers, wizards, webhooks, error paths (EN/ID/ZH) |
| Migration | Dedicated Telegraf migration guide (EN/ID/ZH) |
| Production recipes | Cookbook with thirteen verified recipes (EN/ID/ZH) |
| Plugins, services, observability | Lifecycle/plugin/service hooks available |
| Mini Apps, payments, business features | Web App signature validation and PaymentsClient wrappers available; UI is application-owned |
| Testing and security | Unit, integration, type-level, gated E2E, CI, and security policy available |
| Deployment and migration | Release automation is documented in `RELEASE_AUTOMATION.md`; webhook deployment is in `WEBHOOK.md` |
| Governance and community | `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, `CONTRIBUTION_RULES.md`, and `SHOWCASE.md` |
| Security and support | `SECURITY.md` and `SUPPORT.md` |
| Third-party notices | `NOTICE.md` and `LICENSE` |
| GitHub contribution templates | Bug, feature, documentation, question/support, security notice, and pull request templates under `.github/` |

## GitHub templates

Issue forms are available for bug reports, feature requests, documentation problems, and support questions. A security notice template redirects reporters to the private process in `SECURITY.md`; vulnerabilities must not be disclosed in public issues. Pull requests use `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md` to require tests, documentation, compatibility, and security checks.

## Documentation principle

The documentation describes only capabilities that are implemented and tested in the current package, and every code snippet in the guides is verified against the actual implementation. Telegram-native API access, Mini App/Web App behavior, external persistence, and distributed adapters are described separately so the documentation does not promise features that are not included.
