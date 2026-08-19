# Dokumentasi telebibz

Dokumentasi ini disusun menurut lifecycle aplikasi: mulai dari bot paling sederhana, API client dan transport, update routing, middleware dan context, state/session, interaction UI, background work, deployment, lalu testing dan migration.

| Area | Status |
|---|---|
| Getting started | Tersedia di `README.md` |
| Complete API reference | Tersedia di [`API.md`](API.md), dipetakan dari source TypeScript |
| Bot lifecycle, polling, webhook | Core implementation dan tests tersedia |
| API client dan generated method list | Tersedia; object type generation masih partial |
| Router, middleware, context | Tersedia dan diuji |
| Keyboard, callback, menus, pagination | Keyboard/callback core tersedia; menu/pagination lanjutan partial |
| Sessions, conversations, scenes, wizard, forms | Memory session dan primitives forms/conversation tersedia; integration lanjutan partial |
| Storage, cache, queue, scheduler | Memory primitives tersedia; distributed adapters belum tersedia |
| Plugins, services, observability | Lifecycle/plugin/service hooks tersedia |
| Mini Apps, payments, business features | Raw API access tersedia; high-level subsystem belum lengkap |
| Testing dan security | Unit, integration, type-level, gated E2E, CI, security policy tersedia |
| Deployment dan migration | Roadmap dan package boundaries perlu diperluas sebelum stable release |

## Prinsip dokumentasi

Dokumentasi tidak akan menyebut fitur `production-ready` jika implementasi, test, atau adapter-nya belum benar-benar tersedia. Batas native Telegram dan kemampuan Mini App/Web App harus dijelaskan terpisah agar API tidak menjanjikan kemampuan yang tidak dimiliki Telegram.
