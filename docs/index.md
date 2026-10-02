---
layout: home
hero:
  name: TeleBibz
  text: Telegram Bot API untuk Node.js
  tagline: Tangani update, susun middleware, dan panggil Bot API dengan satu library.
  image:
    src: /telebibz-hero.svg
    alt: Contoh kode TeleBibz dan balasan bot Telegram
features:
  - icon:
      src: /feature-start.svg
      alt: Ikon kode
      width: 32
      height: 32
      wrap: true
    title: Mulai cepat
    details: Pasang package, atur token dari BotFather, lalu jalankan long polling.
  - icon:
      src: /feature-modules.svg
      alt: Ikon modul
      width: 32
      height: 32
      wrap: true
    title: API terpadu
    details: Gunakan handler, context, keyboard, menu, wizard, session, dan upload file.
  - icon:
      src: /feature-reliable.svg
      alt: Ikon keamanan
      width: 32
      height: 32
      wrap: true
    title: Kendali runtime
    details: Atur webhook, rate limit, retry, error handling, dan transport untuk test.
---

<div class="telebibz-note">
  <strong>Mulai di sini</strong>
  <p>Ikuti <a href="/guide/getting-started">panduan instalasi</a>, lalu pelajari <a href="/guide/handlers">handler</a> dan <a href="/reference/api">referensi Bot API</a>.</p>
</div>

## Jalur belajar

<div class="telebibz-grid">
  <DocCard icon="book" href="/guide/getting-started" title="01 · Instalasi" description="Pasang TeleBibz dan jalankan bot pertama." />
  <DocCard icon="code" href="/guide/architecture" title="02 · Siklus update" description="Ikuti alur update, context, middleware, dan API." />
  <DocCard icon="keyboard" href="/guide/context-keyboards" title="03 · Context & keyboard" description="Tangani message dan buat tombol interaktif." />
  <DocCard icon="bot" href="/guide/wizard" title="04 · Wizard" description="Buat form bertahap dengan validasi dan pilihan." />
</div>

## Tentang TeleBibz

TeleBibz adalah library Telegram Bot API untuk Node.js, tersedia sebagai [`@xbibzlibrary/telebibz`](https://www.npmjs.com/package/@xbibzlibrary/telebibz). Versi paket saat ini memerlukan **Node.js 18 atau lebih baru** dan menyertakan deklarasi TypeScript.

Dokumentasi ini mencakup handler, middleware, session, keyboard, media, Rich Messages, dan deployment. Untuk parameter endpoint, izin, dan batasan terbaru, gunakan [dokumentasi resmi Telegram Bot API](https://core.telegram.org/bots/api).

<div class="telebibz-note">
  <strong>Token bot</strong>
  <p>Simpan token di environment variable atau secret manager. Jangan masukkan token ke source code, browser, atau repository.</p>
</div>
