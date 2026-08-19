# telebibz Documentation

The default documentation language is **English**. Translated README and API references are available below.

| Language | README | Complete API reference |
|---|---|---|
| English (default) | [`README.md`](../README.md) | [`API.md`](API.md) |
| Bahasa Indonesia | [`README.id.md`](../README.id.md) | [`API.id.md`](API.id.md) |
| 简体中文 | [`README.zh-CN.md`](../README.zh-CN.md) | [`API.zh-CN.md`](API.zh-CN.md) |

![telebibz overview](../assets/telebibz-readme-preview.png)

The API references are organized by lifecycle: bot startup and shutdown, API client and transport, update routing, middleware and context, state/session, interaction UI, background work, deployment, testing, and migration boundaries.

| Area | Status |
|---|---|
| Getting started | Available in all three README files |
| Complete API reference | Available in English, Indonesian, and Simplified Chinese |
| Bot lifecycle, polling, webhook | Core implementation and tests available |
| API client and generated method list | Available; object type generation remains partial |
| Router, middleware, context | Available and tested |
| Keyboard, callback, menus, pagination | Keyboard/callback core available; advanced menu/pagination remains partial |
| Sessions, conversations, wizards, forms | Memory session and conversation/form primitives available; advanced integration remains partial |
| Storage, cache, queue, scheduler | In-memory primitives available; distributed adapters are not included |
| Plugins, services, observability | Lifecycle/plugin/service hooks available |
| Mini Apps, payments, business features | Raw API access available; high-level subsystems are not complete |
| Testing and security | Unit, integration, type-level, gated E2E, CI, and security policy available |
| Deployment and migration | Release automation is documented in `RELEASE_AUTOMATION.md` |

## Documentation principle

The documentation describes only capabilities that are implemented and tested in the current package. Telegram-native API access, Mini App/Web App behavior, external persistence, and distributed adapters are described separately so the documentation does not promise features that are not included.
