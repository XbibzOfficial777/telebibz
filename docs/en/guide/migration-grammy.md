---
title: Notes for grammY users
description: Map familiar grammY concepts to the TeleBibz API.
---

# Notes for grammY users

TeleBibz takes inspiration from composer- and Context-style APIs used in the grammY ecosystem, but it is **not a compatibility package**. Check the TeleBibz API and type declarations before porting code; some method names intentionally use different shorthand.

| Familiar concept | TeleBibz equivalent |
| --- | --- |
| Command handler | `bot.cmd('start', handler)` or `bot.start(handler)` |
| Text handler | `bot.hears(match, handler)` |
| Update filter | `bot.on(filter, handler)` |
| Callback query data | `bot.action(trigger, handler)` |
| Context reply | `ctx.reply(text, extra)` |
| Bot API client | `bot.api.*`, `ctx.api.*`, `callApi(method, payload)` |
| Middleware | `bot.use((ctx, next) => ...)` |
| Composer branch/filter/drop/route/lazy/fork | TeleBibz Composer methods with similar concepts |
| Inline mode | `bot.inlineQuery(trigger, handler)` and the `iq` builder |
| Session | Session middleware is installed in the bot pipeline; access it through `ctx.session` |
| Menu | Built-in `Menu` or `MenuContainer` |
| Conversation form | `bot.wizard(id, definition)` |
| Auto-retry/throttle/limiter | Package helpers `autoRetry()`, `throttler()`, and `limiter()` |

## Important differences

- A TeleBibz instance uses `cmd()`, not `command()`.
- A string passed to `hears` matches exact text, case-insensitively; use a regular expression for patterns.
- TeleBibz includes menus, wizards, limiter, broadcast, download helpers, Rich Messages, and other utilities in the package.
- Default sessions use an in-memory `Map`; process restarts discard state unless storage is replaced.
- Some TeleBibz API methods have positional shortcuts; other proxy methods take one payload object. See the [Bot API reference](/en/reference/api).
- Types, transport options, and Telegram support follow the TeleBibz release, not assumptions about grammY plugin compatibility.

Port one simple handler first, run the type checker and bot tests, then migrate middleware, sessions, and plugins incrementally. Do not copy production tokens or run two pollers for the same token during migration.
