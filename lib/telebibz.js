// lib/telebibz.js — kelas utama: 100% kode sendiri, 0 dependency.
'use strict';

const { makeApi } = require('./api');
const { Context } = require('./context');
const { Composer } = require('./composer');
const { session } = require('./session');
const { matchInlineQuery } = require('./inline-query');
const { Menu, MenuContainer } = require('./menus');
const { pollLoop } = require('./runner');
const wizard = require('./wizard');
const log = require('./logger');
const { humanize } = require('./errors');
const { broadcast } = require('./broadcast');

const DEFAULT_UPDATES = [
  'message', 'edited_message', 'callback_query', 'inline_query',
  'my_chat_member', 'chat_member', 'message_reaction',
  'business_connection', 'business_message', 'edited_business_message',
];

class TeleBibz {
  /**
   * new TeleBibz('123:ABC', {
   *   allowedUpdates: [...], onError(err, ctx), silent, dropPending,
   *   transport: (method, payload) => Promise<result>,   // ← suntik untuk test
   *   session: {...opsi session}, apiRoot: 'https://api.telegram.org'
   * })
   */
  constructor(token, opts = {}) {
    if (!token || !/^\d+:[\w-]+$/.test(token)) {
      throw new Error('TeleBibz: token tidak valid. Ambil dari @BotFather → /newbot.');
    }
    this.opts = opts;
    this.token = token;
    this.api = makeApi(token, opts.transport);
    this.botInfo = undefined;

    this._handlers = new Composer();        // composer publik (use/on/cmd/dll)
    this._report = async (bare) => {
      const err = bare && bare.error ? bare.error : bare;
      const ctx = bare && bare.ctx;
      if (typeof this.opts.onError === 'function') return this.opts.onError(err, ctx);
      this.printError(err, ctx);
    };

    // Pohon eksekusi: session → wizard → user handlers (dilindungi boundary)
    this._root = new Composer()
      .use(session(opts.session || {}))
      .use(wizard.middleware());
    this._safe = this._root.errorBoundary(this._report);
  }

  /* ---------- shortcut publik ---------- */
  use(...mw) { this._handlers.use(...mw); return this; }
  cmd(names, ...mw) { this._handlers.command(names, ...mw); return this; }
  hears(match, ...mw) {
    this._handlers.hears(match instanceof RegExp || Array.isArray(match) ? match : new RegExp(`^${escapeRe(match)}$`, 'i'), ...mw);
    return this;
  }
  action(trigs, ...mw) { this._handlers.callbackQuery(trigs, ...mw); return this; }

  /** Mode inline: bot.inlineQuery(/kucing/, handler) atau bot.inlineQuery('*', h) */
  branch(...a) { this._handlers.branch(...a); return this; }
  filter(...a) { this._handlers.filter(...a); return this; }
  drop(...a) { this._handlers.drop(...a); return this; }
  route(...a) { this._handlers.route(...a); return this; }
  lazy(...a) { this._handlers.lazy(...a); return this; }
  fork(...a) { this._handlers.fork(...a); return this; }

  inlineQuery(trigger, ...mw) { this._handlers.use(async (ctx, next) => (matchInlineQuery(trigger)(ctx) ? runChain(mw, ctx, next) : next())); return this; }

  /** Shortcut shortcut: daftarkan daftar perintah ke tombol menu Telegram. */
  setMyCommands(commands, extra = {}) { return this.api.setMyCommands(commands, extra); }
  on(filter, ...mw) { this._handlers.on(filter, ...mw); return this; }
  start(replies) {
    const h = typeof replies === 'function' ? replies : async (ctx) => ctx.reply(replies);
    return this.cmd('start', h);
  }

  /* ---------- wizard ---------- */
  wizard(id, def, bindCommand = true) {
    wizard.define(id, def);
    if (bindCommand) this.cmd(id, (ctx) => wizard.start(ctx, id));
    return this;
  }
  wizardStart(ctx, id) { return wizard.start(ctx, id); }
  wizardActive(ctx) { return wizard.active(ctx); }
  wizardCancel(ctx) { return wizard.cancel(ctx); }
  wizardEdit(ctx, text, extra) { return wizard.editAsk(ctx, text, extra); }
  wizardDelete(ctx) { return wizard.deleteAsk(ctx); }

  /* ---------- broadcast ---------- */
  broadcast(ids, pesan, opts) { return broadcast(this.api, ids, pesan, opts); }

  /* ---------- siklus hidup ---------- */

  /** Ambil identitas bot (dipanggil otomatis oleh launch; panggil manual untuk webhook). */
  async init() {
    const me = await this.api.getMe();
    this.botInfo = me;
    return me;
  }

  /** Tangani SATU update mentah (webhook/serverless/test). */
  async handleUpdate(update) {
    if (this._wired !== true) this._wire();
    const ctx = new Context(update, this.api, this.botInfo);
    try { await this._root.run(ctx); }
    catch (err) { await this._report({ error: err, ctx }); }
  }

  _wire() {
    this._wired = true;
    // Pasang handler publik SETELAH boundary agar semuanya terlindungi
    this._root.use(this._handlers.middleware());
  }

  /** Nyalakan long polling (dengan retry 409 & backoff jaringan). */
  async launch(launchOpts = {}) {
    await this.init();
    const me = this.botInfo;
    if (!this.opts.silent) {
      log.banner('🤖 TeleBibz ON', [
        `bot      : @${me.username} (id ${me.id})`,
        'mode     : long-polling',
        `library  : telebibz ${require('../package.json').version} (0 dependency)`,
        'brand    : //—Xbibz Official—//',
      ]);
      log.ok('menunggu update… (Ctrl+C untuk berhenti)');
    }
    this._stopping = false;
    this._runPromise = pollLoop({
      api: this.api,
      handleUpdate: (u) => this.handleUpdate(u),
      allowedUpdates: this.opts.allowedUpdates || DEFAULT_UPDATES,
      dropPending: this.opts.dropPending || launchOpts.dropPending || false,
      shouldStop: () => this._stopping,
      conflictDelay: launchOpts.conflictDelay || 5000,
      onConflict: () => { if (!this.opts.silent) log.warn('bot lain masih polling (409) — coba lagi 5 detik…'); },
      onFatal: (err) => this._report({ error: err }),
    });
    // Ctrl+C → berhenti bersih
    if (!this.opts.silent && !launchOpts.noSignalHandlers) {
      const stop = () => { log.warn('mematikan…'); this.stop(); };
      process.once('SIGINT', stop); process.once('SIGTERM', stop);
    }
    return this;
  }

  /** Berhenti polling (resolve runPromise). */
  stop() { this._stopping = true; }
  /** Promise loop polling — ditunggu utk graceful shutdown/test. */
  get runPromise() { return this._runPromise; }

  /**
   * Handler webhook gaya Node/Express:
   *   const server = bot.webhook();
   *   http.createServer((req,res) => req.url==='/tg' ? server(req,res) : ...)
   *   — framework mana pun: (req, res) pasangan Request/Response Node.
   */
  webhook() {
    return async (req, res) => {
      try {
        const chunks = [];
        for await (const c of req) chunks.push(Buffer.from(c));
        const update = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        await this.handleUpdate(update);
        res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end('{}');
      } catch (e) { res.statusCode = 400; res.end('bad request'); }
    };
  }

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

function runChain(mws, ctx, next) {
  let i = 0;
  const step = () => (i < mws.length ? mws[i++](ctx, step) : next());
  return step();
}

function escapeRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

module.exports = { TeleBibz };
