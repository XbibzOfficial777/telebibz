---
layout: home
hero:
  name: TeleBibz
  text: Telegram Bot API for Node.js
  tagline: Handle updates, compose middleware, and call the Bot API with one library.
  image:
    src: /telebibz-hero.svg
    alt: TeleBibz code and a Telegram bot reply
features:
  - icon:
      src: /feature-start.svg
      alt: Code icon
      width: 32
      height: 32
      wrap: true
    title: Start quickly
    details: Install the package, set a BotFather token, and start long polling.
  - icon:
      src: /feature-modules.svg
      alt: Modules icon
      width: 32
      height: 32
      wrap: true
    title: A consistent API
    details: Work with handlers, context, keyboards, menus, wizards, sessions, and uploads.
  - icon:
      src: /feature-reliable.svg
      alt: Reliability icon
      width: 32
      height: 32
      wrap: true
    title: Runtime controls
    details: Configure webhooks, rate limits, retries, errors, and test transports.
---

<div class="telebibz-note">
  <strong>Start here</strong>
  <p>Follow the <a href="/en/guide/getting-started">installation guide</a>, then explore <a href="/en/guide/handlers">handlers</a> and the <a href="/en/reference/api">Bot API reference</a>.</p>
</div>

## Learning path

<div class="telebibz-grid">
  <DocCard icon="book" href="/en/guide/getting-started" title="01 · Install" description="Install TeleBibz and run your first bot." />
  <DocCard icon="code" href="/en/guide/architecture" title="02 · Update lifecycle" description="Follow updates through context, middleware, and the API." />
  <DocCard icon="keyboard" href="/en/guide/context-keyboards" title="03 · Context and keyboards" description="Handle messages and build interactive buttons." />
  <DocCard icon="bot" href="/en/guide/wizard" title="04 · Wizards" description="Build multi-step forms with validation and choices." />
</div>

## About TeleBibz

TeleBibz is a Telegram Bot API library for Node.js, published as [`@xbibzlibrary/telebibz`](https://www.npmjs.com/package/@xbibzlibrary/telebibz). The current package requires **Node.js 18 or later** and includes TypeScript declarations.

This documentation covers handlers, middleware, sessions, keyboards, media, Rich Messages, and deployment. For current endpoint parameters, permissions, and limits, consult the [official Telegram Bot API documentation](https://core.telegram.org/bots/api).

<div class="telebibz-note">
  <strong>Bot token</strong>
  <p>Keep the token in an environment variable or secret manager. Never put it in source code, a browser, or a repository.</p>
</div>
