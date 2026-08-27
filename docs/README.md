# telebibz Documentation

The default documentation language is **English**. Translated README and API references are available below.

| Language | README | Complete API reference |
|---|---|---|
| English (default) | [`README.md`](../README.md) | [`API.md`](API.md) |
| Bahasa Indonesia | [`README.id.md`](../README.id.md) | [`API.id.md`](API.id.md) |
| 简体中文 | [`README.zh-CN.md`](../README.zh-CN.md) | [`API.zh-CN.md`](API.zh-CN.md) |

![telebibz overview](https://cdn.jsdelivr.net/npm/@xbibzlibrary/telebibz@latest/assets/telebibz-readme-preview.png)

The documentation covers the complete lifecycle: onboarding, bot startup and shutdown, API client and transport, update routing, middleware and context, state/session, interaction UI, background work, deployment, testing, and migration boundaries.

| Resource | Purpose |
|---|---|
| [`GETTING_STARTED.md`](GETTING_STARTED.md) | Five-minute English onboarding from installation to a working bot. |
| [`GETTING_STARTED.id.md`](GETTING_STARTED.id.md) | Indonesian onboarding guide. |
| [`GETTING_STARTED.zh-CN.md`](GETTING_STARTED.zh-CN.md) | Simplified Chinese onboarding guide. |
| [`../examples/README.md`](../examples/README.md) | Runnable minimal, wizard, and webhook starters. |
| [`../SHOWCASE.md`](../SHOWCASE.md) | Community project showcase and submission format. |

| Area | Status |
|---|---|
| Getting started | Dedicated guides are available in English, Indonesian, and Simplified Chinese, with runnable examples. |
| Complete API reference | Available in English, Indonesian, and Simplified Chinese |
| Bot lifecycle, polling, webhook | Core implementation, per-update error isolation, reconnect backoff, and tests available |
| API client and generated method list | Available; full vendored Telegram declarations are exposed through `TelegramTypes` |
| Router, middleware, context | Available and tested; first-match is default, all-match is explicit |
| Keyboard, callback, menus, pagination | Keyboard/callback core, permission menus, MenuController, and pagination available |
| Sessions, conversations, wizards, forms | Storage-backed session/conversation primitives and forms available; scene orchestration remains application-owned |
| Storage, cache, queue, scheduler | Memory, JSON file, Redis, SQL, Mongo driver adapters, cache, queue, and full five-field cron available |
| Plugins, services, observability | Lifecycle/plugin/service hooks available |
| Mini Apps, payments, business features | Web App signature validation and PaymentsClient wrappers available; UI is application-owned |
| Testing and security | Unit, integration, type-level, gated E2E, CI, and security policy available |
| Deployment and migration | Release automation is documented in `RELEASE_AUTOMATION.md`; webhook and deployment onboarding is in `GETTING_STARTED.md` |
| Governance and community | `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, `CONTRIBUTION_RULES.md`, and `SHOWCASE.md` |
| Security and support | `SECURITY.md` and `SUPPORT.md` |
| Third-party notices | `NOTICE.md` and `LICENSE` |
| GitHub contribution templates | Bug, feature, documentation, question/support, security notice, and pull request templates under `.github/` |

## GitHub templates

Issue forms are available for bug reports, feature requests, documentation problems, and support questions. A security notice template redirects reporters to the private process in `SECURITY.md`; vulnerabilities must not be disclosed in public issues. Pull requests use `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md` to require tests, documentation, compatibility, and security checks.

## Documentation principle

The documentation describes only capabilities that are implemented and tested in the current package. Telegram-native API access, Mini App/Web App behavior, external persistence, and distributed adapters are described separately so the documentation does not promise features that are not included.
