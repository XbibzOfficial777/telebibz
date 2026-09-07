// lib/telebibz.js — kelas utama TeleBibz: grammY di dalam, ramah di luar.
'use strict';

const { Bot, session, GrammyError, HttpError } = require('grammy');
const log = require('./logger');
const wizard = require('./wizard');
const { humanize } = require('./errors');
const { broadcast } = require('./broadcast');

function grammyVersion() {
  try {
    const path = require('path'), fs = require('fs');
    let dir = path.dirname(require.resolve('grammy'));
    while (!fs.existsSync(path.join(dir, 'package.json'))) dir = path.dirname(dir);
    return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version || '?';
  } catch { return '?'; }
}

const DEFAULT_UPDATES = [
  'message', 'edited_message', 'callback_query', 'inline_query',
  'my_chat_member', 'chat_member', 'message_reaction',
  'business_connection', 'business_message', 'edited_business_message',
];

class TeleBibz {
  /**
   * new TeleBibz('123:ABC', {
   *   allowedUpdates: [...],     // default: semua tipe umum + Business
   *   onError: (err, ctx) => {}, // override laporan error id+proTip
   *   silent: false,             // true = tanpa banner/log boot
   *   grammy: { ... },             // opsi mentah new Bot()
   * })
   */
  constructor(token, opts = {}) {
    if (!token || !/^\d+:[\w-]+$/.test(token)) {
      throw new Error('TeleBibz: token tidak valid. Ambil dari @BotFather → /newbot.');
    }
    this.opts = opts;
    this.token = token;
    this.bot = new Bot(token, opts.grammy || {});

    // Sesi selalu aktif supaya wizard & fitur stateful "just works".
    this.bot.use(session({ initial: () => ({}) }));
    this.bot.use(wizard.middleware());

    // Laporan error: bot.catch utk long polling; errorBoundary utk SEMUA handler
    // yang didaftarkan lewat shortcut TeleBibz (cmd/hears/action/on/wizard).
    // Catatan grammY: errorBoundary tanpa argumen middleware TIDAK melindungi
    // handler yang didaftarkan kemudian — harus dipakai sebagai composer induk.
    const report = async (err) => {
      const e = err && err.error ? err.error : err;
      const ctx = err && err.ctx;
      if (typeof this.opts.onError === 'function') return this.opts.onError(e, ctx);
      this.printError(e, ctx);
    };
    this.bot.catch(report);
    this._safe = this.bot.errorBoundary(report);
  }

  /* ---------- jalan pintas populer ---------- */

  /** ctx api mentah (grammy.Api) kalau butuh metode yang belum ada shortcutnya. */
  get api() { return this.bot.api; }
  get botInfo() { return this.bot.botInfo; }

  use(...mw) { this._safe.use(...mw); return this; }

  /** Perintah slash: bot.cmd('halo', (ctx) => ctx.reply('hai')) */
  cmd(names, ...mw) { for (const n of [].concat(names)) this._safe.command(String(n).replace(/^\//, ''), ...mw); return this; }

  /** Balas saat teks cocok: bot.hears(/daftar/i, handler) atau 'teks persis' */
  hears(match, ...mw) { this._safe.hears(match instanceof RegExp ? match : new RegExp(`^${escapeRe(match)}$`, 'i'), ...mw); return this; }

  /** Tombol ditekan: bot.action('menu', handler) atau regex/array */
  action(trigs, ...mw) { this._safe.callbackQuery(trigs, ...mw); return this; }

  /** Event grammY apa pun: on('message:photo'), on(':text'), dll. */
  on(filter, ...mw) { this._safe.on(filter, ...mw); return this; }

  /** /start + /help klasik dalam satu baris. */
  start(replies) {
    const h = typeof replies === 'function' ? replies : async (ctx) => ctx.reply(replies);
    this.cmd(['start'], h);
    return this;
  }

  /* ---------- wizard ---------- */

  /**
   * bot.wizard('daftar', {
   *   steps: [{ key:'nama', ask:'Siapa namamu?' }, ...],
   *   done: async (ans, ctx) => ctx.reply(`Halo ${ans.nama}!`),
   * });
   * → otomatis bisa dipanggil lewat command /daftar.
   */
  wizard(id, def, bindCommand = true) {
    wizard.define(id, def);
    if (bindCommand) this.cmd(id, (ctx) => wizard.start(ctx, id));
    return this;
  }

  wizardStart(ctx, id) { return wizard.start(ctx, id); }
  wizardActive(ctx) { return wizard.active(ctx); }

  /* ---------- broadcast ---------- */

  /** Kirim 1 pesan ke banyak chat, aman rate limit. Lihat lib/broadcast.js. */
  broadcast(ids, pesan, opts) { return broadcast(this.api, ids, pesan, opts); }

  /* ---------- menjalankan ---------- */

  /** Nyalakan (long polling). 409 (instance lain) di-retry otomatis tiap 5 dtk. */
  async launch(launchOpts = {}) {
    await this.bot.init(); // gagal di sini = token salah → pesan lugas
    const me = this.botInfo;
    if (!this.opts.silent) {
      log.banner('🤖 TeleBibz ON', [
        `bot      : @${me.username} (id ${me.id})`,
        `mode     : long-polling`,
        `engine   : grammY ${grammyVersion()}`,
        `library  : telebibz ${require('../package.json').version}`,
        `brand    : //—Xbibz Official—//`,
      ]);
      log.ok('menunggu update… (Ctrl+C untuk berhenti)');
    }
    const allowed = this.opts.allowedUpdates || DEFAULT_UPDATES;
    this._stopping = false;
    this._runPromise = (async () => {
      while (!this._stopping) {
        try {
          await this.bot.start({
            allowed_updates: allowed,
            drop_pending_updates: this.opts.dropPending || false,
            onStart: () => {},
          });
          break; // start() hanya resolve saat stop()
        } catch (err) {
          if (this._stopping) break;
          const h = humanize(err);
          if (h.code === 409) {
            if (!this.opts.silent) log.warn('bot lain masih polling (409) — coba lagi 5 detik…');
            await new Promise((r) => setTimeout(r, 5000));
            continue;
          }
          // fatal lain: laporkan cantik, keluar loop
          if (typeof this.opts.onError === 'function') this.opts.onError(err, undefined);
          else this.printError(err, undefined);
          break;
        }
      }
    })();
    return this;
  }

  /** Untuk webhook/serverless: tangani satu update mentah. */
  handleUpdate(update) { return this.bot.handleUpdate(update); }

  /** webhookCallback bawaan grammY (express/fastly): bot.webhook('express') */
  webhook(...a) { const { webhookCallback } = require('grammy'); return webhookCallback(this.bot, ...a); }

  /** Hentikan polling. */
  stop() { this._stopping = true; return this.bot.stop(); }

  /** Ambil promise loop polling (ditunggu saat testing). */
  get runPromise() { return this._runPromise; }

  /* ---------- error cantik ---------- */

  printError(err, ctx) {
    const h = humanize(err);
    log.error(`Telegram error${h.code ? ` (${h.code})` : ''}: ${h.pesan}`);
    if (h.method) log.error(`  saat memanggil : ${h.method}`);
    const c = ctx && ctx.chat ? ctx.chat.id : '-';
    if (c !== '-') log.error(`  di chat        : ${c}`);
    if (h.saran) log.warn(`  💡 saran: ${h.saran}`);
  }
}

function escapeRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

module.exports = { TeleBibz, GrammyError, HttpError };
