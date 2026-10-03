// lib/telebibz.js — lifecycle bot, komposisi middleware, polling, dan webhook.
'use strict';

const { makeApi } = require('./api');
const { Context } = require('./context');
const { Composer } = require('./composer');
const { session, getSessionKey } = require('./session');
const { matchInlineQuery } = require('./inline-query');
const { Menu, MenuContainer } = require('./menus');
const { pollLoop } = require('./runner');
const { UpdateProcessor } = require('./update-processor');
const wizard = require('./wizard');
const log = require('./logger');
const { humanize } = require('./errors');
const { broadcast } = require('./broadcast');

// Semua tipe Update di Bot API 10.3 (2026-08-24), termasuk tipe baru.
const DEFAULT_UPDATES = [
  'message', 'edited_message', 'channel_post', 'edited_channel_post',
  'business_connection', 'business_message', 'edited_business_message', 'deleted_business_messages',
  'guest_message', 'message_reaction', 'message_reaction_count', 'inline_query',
  'chosen_inline_result', 'callback_query', 'shipping_query', 'pre_checkout_query',
  'purchased_paid_media', 'poll', 'poll_answer', 'my_chat_member', 'chat_member',
  'chat_join_request', 'chat_boost', 'removed_chat_boost', 'stopped_message_generation',
];
const DEFAULT_MAX_CONCURRENT_UPDATES = 256;

class TeleBibz {
  /**
   * new TeleBibz('123:ABC', {
   *   allowedUpdates: [...], maxConcurrentUpdates: 256,
   *   onError(err, ctx), silent, dropPending,
   *   transport: (method, payload) => Promise<result>,   // ← suntik untuk test
   *   session: {...opsi session}, apiRoot: 'https://api.telegram.org'
   * })
   */
  constructor(token, opts = {}) {
    if (!token || !/^\d+:[\w-]+$/.test(token)) {
      throw new Error('TeleBibz: token tidak valid. Ambil dari @BotFather → /newbot.');
    }
    const maxConcurrentUpdates = opts.maxConcurrentUpdates ?? DEFAULT_MAX_CONCURRENT_UPDATES;
    if (!Number.isSafeInteger(maxConcurrentUpdates) || maxConcurrentUpdates < 1) {
      throw new RangeError('TeleBibz: maxConcurrentUpdates harus bilangan bulat positif.');
    }
    this.opts = opts;
    this.token = token;
    this.maxConcurrentUpdates = maxConcurrentUpdates;
    this._updateProcessor = new UpdateProcessor(maxConcurrentUpdates);
    this.api = makeApi(token, opts.transport, opts);
    this.botInfo = undefined;

    this._handlers = new Composer();        // composer publik (use/on/cmd/dll)
    this._report = async (bare) => {
      const err = bare && bare.error ? bare.error : bare;
      const ctx = bare && bare.ctx;
      if (typeof this.opts.onError === 'function') return this.opts.onError(err, ctx);
      this.printError(err, ctx);
    };

    // Pohon eksekusi: session → wizard → user handlers di dalam error boundary.
    this._root = new Composer()
      .use(session(opts.session || {}))
      .use(wizard.middleware());
    this._safe = this._root.errorBoundary(this._report, this._handlers.middleware());
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
    const ctx = new Context(update, this.api, this.botInfo);
    await this._updateProcessor.process(this._updateKey(ctx), async () => {
      try { await this._root.run(ctx); }
      catch (err) { await this._report({ error: err, ctx }); }
    });
  }

  /** Updates dengan session key sama berjalan berurutan; key berbeda berjalan paralel. */
  _updateKey(ctx) {
    let key;
    try { key = getSessionKey(ctx, this.opts.session || {}); }
    catch { /* session middleware reports the cached getKey error */ }
    if (key !== undefined) return `session:${String(key)}`;

    // Updates without a session key (for example inline queries) still keep a
    // single sender's stateful handlers ordered when sender information exists.
    const fromId = ctx.from && ctx.from.id;
    if (fromId !== undefined) return `user:${String(fromId)}`;
    const chatId = ctx.chat && ctx.chat.id;
    return chatId === undefined ? undefined : `chat:${String(chatId)}`;
  }

  /** Nyalakan long polling (dengan retry 409 & backoff jaringan). */
  async launch(launchOpts = {}) {
    await this.init();
    const me = this.botInfo;
    if (!this.opts.silent) {
      log.banner('🤖 TeleBibz ON', [
        `bot      : @${me.username} (id ${me.id})`,
        'mode     : long-polling',
        `library  : telebibz ${require('../package.json').version} (Node.js)`,
      ]);
      log.ok('menunggu update… (Ctrl+C untuk berhenti)');
    }
    this._stopping = false;
    this._runPromise = pollLoop({
      api: this.api,
      handleUpdate: (u) => this.handleUpdate(u),
      allowedUpdates: this.opts.allowedUpdates || DEFAULT_UPDATES,
      maxInFlightUpdates: Math.max(100, this.maxConcurrentUpdates * 4),
      dropPending: launchOpts.dropPending ?? this.opts.dropPending ?? false,
      shouldStop: () => this._stopping,
      conflictDelay: launchOpts.conflictDelay ?? 5000,
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
   * Handler webhook gaya Node/Express. Secret token (disarankan Telegram) opsional:
   *   const handler = bot.webhook({ secretToken: process.env.TG_WEBHOOK_SECRET });
   * Terima (req, res) Node murni; body dibatasi agar endpoint tidak menerima payload tak terbatas.
   */
  webhook(webhookOpts = {}) {
    const secretToken = webhookOpts.secretToken;
    const maxBodyBytes = webhookOpts.maxBodyBytes ?? 1024 * 1024;
    if (!Number.isSafeInteger(maxBodyBytes) || maxBodyBytes <= 0) throw new RangeError('webhook: maxBodyBytes harus > 0');
    if (secretToken !== undefined && (typeof secretToken !== 'string' || !/^[A-Za-z0-9_-]{1,256}$/.test(secretToken))) {
      throw new TypeError('webhook: secretToken harus 1–256 karakter A-Z, a-z, 0-9, _ atau -');
    }
    return async (req, res) => {
      if (req.method && req.method !== 'POST') { res.statusCode = 405; res.end('method not allowed'); return; }
      if (secretToken !== undefined) {
        const received = req.headers && req.headers['x-telegram-bot-api-secret-token'];
        const expectedBuf = Buffer.from(String(secretToken));
        const receivedBuf = Buffer.from(typeof received === 'string' ? received : '');
        const valid = expectedBuf.length === receivedBuf.length && require('crypto').timingSafeEqual(expectedBuf, receivedBuf);
        if (!valid) { res.statusCode = 401; res.end('unauthorized'); return; }
      }
      try {
        const chunks = [];
        let size = 0;
        for await (const c of req) {
          const chunk = Buffer.from(c);
          size += chunk.length;
          if (size > maxBodyBytes) { res.statusCode = 413; res.end('payload too large'); return; }
          chunks.push(chunk);
        }
        const update = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!update || typeof update !== 'object' || Array.isArray(update)) throw new Error('invalid update');
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
