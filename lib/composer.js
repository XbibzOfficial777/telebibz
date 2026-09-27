// lib/composer.js — mesin middleware & routing filter (recoded, konsep gaya grammY).
'use strict';

const { msgOf } = require('./context');

/* ---------- matcher filter ---------- */
const UPDATE_FIELDS = {
  message: (u) => u.message, edited_message: (u) => u.edited_message,
  channel_post: (u) => u.channel_post, edited_channel_post: (u) => u.edited_channel_post,
  business_message: (u) => u.business_message, edited_business_message: (u) => u.edited_business_message,
  callback_query: (u) => u.callback_query, inline_query: (u) => u.inline_query,
  chat_join_request: (u) => u.chat_join_request, chat_member: (u) => u.chat_member,
  my_chat_member: (u) => u.my_chat_member, message_reaction: (u) => u.message_reaction,
  message_reaction_count: (u) => u.message_reaction_count,
  business_connection: (u) => u.business_connection, poll: (u) => u.poll, poll_answer: (u) => u.poll_answer,
  chosen_inline_result: (u) => u.chosen_inline_result, shipping_query: (u) => u.shipping_query,
  pre_checkout_query: (u) => u.pre_checkout_query, purchased_paid_media: (u) => u.purchased_paid_media,
};
const MSG_PROPS = {
  text: (m) => typeof m.text === 'string', caption: (m) => typeof m.caption === 'string',
  photo: (m) => Array.isArray(m.photo), video: (m) => !!m.video, audio: (m) => !!m.audio,
  voice: (m) => !!m.voice, video_note: (m) => !!m.video_note, document: (m) => !!m.document,
  sticker: (m) => !!m.sticker, animation: (m) => !!m.animation, location: (m) => !!m.location,
  contact: (m) => !!m.contact, poll: (m) => !!m.poll, venue: (m) => !!m.venue,
  dice: (m) => !!m.dice, game: (m) => !!m.game, invoice: (m) => !!m.invoice,
  new_chat_members: (m) => Array.isArray(m.new_chat_members), left_chat_member: (m) => !!m.left_chat_member,
  successful_payment: (m) => !!m.successful_payment, web_app_data: (m) => !!m.web_app_data,
  via_bot: (m) => !!m.via_bot, reply_to_message: (m) => !!m.reply_to_message, entities: (m) => Array.isArray(m.entities),
  media: (m) => Array.isArray(m.photo) || !!m.video || !!m.document || !!m.audio,
  data: () => false, // khusus callback_query ditangani di bawah
};

/** filter 'message:photo', ':text', 'callback_query': → fungsi (ctx) => boolean */
function compileFilter(str) {
  // ':prop' → pesan (atau edited/channel/business) dengan properti tsb — gaya grammY
  if (String(str).startsWith(':')) {
    const prop = String(str).slice(1);
    const test = MSG_PROPS[prop];
    if (test) return (ctx) => { const m = msgOf(ctx.update); return !!m && test(m); };
    return () => false;
  }
  const [head, prop] = String(str).split(':');
  if (head === 'chat_type') return (ctx) => { const c = ctx.chat; return !!c && c.type === prop; };
  if (head === 'callback_query' && prop === 'data') return (ctx) => !!(ctx.callback_query && typeof ctx.callback_query.data === 'string');
  if (head && prop) {
    const get = UPDATE_FIELDS[head];
    const test = MSG_PROPS[prop];
    if (get && test) return (ctx) => { const m = get(ctx.update); return !!m && test(m); };
    if (get) return (ctx) => !!get(ctx.update);
    if (test) return (ctx) => { const m = msgOf(ctx.update); return !!m && test(m); };
  }
  if (UPDATE_FIELDS[head]) return (ctx) => !!UPDATE_FIELDS[head](ctx.update);
  if (MSG_PROPS[head]) return (ctx) => { const m = msgOf(ctx.update); return !!m && MSG_PROPS[head](m); };
  return () => false;
}

/* ---------- composer ---------- */
class Composer {
  constructor(...mw) { this.stack = []; for (const m of mw) this.use(m); }

  use(...mw) {
    for (const m of mw) {
      const fn = m instanceof Composer ? m.middleware() : m;
      this.stack.push({ match: () => true, fns: [fn] });
    }
    return this;
  }
  on(filter, ...mw) { [].concat(filter).forEach((f) => this.stack.push({ match: compileFilter(f), fns: mw })); return this; }
  hears(re, ...mw) {
    [].concat(re).forEach((r) => this.stack.push({
      match: (ctx) => { const m = msgOf(ctx.update); const t = m && (m.text || m.caption || ''); return !!t && r.test(t); },
      fns: mw,
    }));
    return this;
  }
  command(names, ...mw) {
    const set = [].concat(names).map((n) => String(n).toLowerCase());
    this.stack.push({
      match: (ctx) => {
        const m = msgOf(ctx.update);
        if (!m || typeof m.text !== 'string') return false;
        const mobj = /^\/([A-Za-z0-9_]+)(?:@([A-Za-z0-9_]+))?(\s|$)/.exec(m.text);
        if (!mobj) return false;
        if (!set.includes(mobj[1].toLowerCase())) return false;
        if (mobj[2] && ctx.me && ctx.me.username && mobj[2].toLowerCase() !== ctx.me.username.toLowerCase()) return false;
        ctx.match = m.text.slice(mobj[0].length); // argumen setelah perintah
        return true;
      },
      fns: mw,
    });
    return this;
  }
  callbackQuery(trigs, ...mw) {
    const list = [].concat(trigs);
    this.stack.push({
      match: (ctx) => {
        const q = ctx.callback_query || ctx.update.callback_query;
        if (!q || typeof q.data !== 'string') return false;
        return list.some((t) => t instanceof RegExp ? t.test(q.data) : String(t) === q.data);
      },
      fns: mw,
    });
    return this;
  }

  /** Jalankan mw hanya jika pred true. */
  filter(pred, ...mw) { const c = new Composer(...mw); this.use(async (ctx, next) => (await pred(ctx) ? c.run(ctx, next) : next())); return c; }
  /** Lewati mw jika pred true. */
  drop(pred, ...mw) { const c = new Composer(...mw); this.use(async (ctx, next) => (await pred(ctx) ? undefined : c.run(ctx, next))); return c; }
  /** Cabang dua: pred ? A : B. */
  branch(pred, a, b) { const ca = new Composer(a), cb = new Composer(b); this.use(async (ctx, next) => (await pred(ctx) ? ca.run(ctx, next) : cb.run(ctx, next))); return this; }
  /** Petakan ctx→key ke composer berbeda: route('type',{private:c, group:c2}) */
  route(router, by) {
    const map = new Map(Object.entries(by).map(([k, v]) => [k, v instanceof Composer ? v : new Composer(v)]));
    this.use(async (ctx, next) => { const k = typeof router === 'function' ? await router(ctx) : ctx[router]; const c = map.get(k); return c ? c.run(ctx, next) : next(); });
    return this;
  }
  /** Bangun mw malas per-update: lazy((ctx)=>ctx.from?.is_bot?botmw:usermw) */
  lazy(factory) { this.use(async (ctx, next) => { const mw = await factory(ctx); const c = new Composer(...(Array.isArray(mw) ? mw : [mw]).filter(Boolean)); return c.run(ctx, next); }); return this; }
  /** Jalankan mw DI LATAR BELAKANG (tidak menahan next) — cocok untuk tugas lambat. */
  fork(...mw) { const c = new Composer(...mw); this.use((ctx, next) => { c.run(ctx).then(()=>{},(e)=>ctx.api && console.error('[telebibz:fork]', e.message)); return next(); }); return this; }

  /** Lindungi subpohon middleware dengan handler error — pola batas rambu grammY. */
  errorBoundary(handler, ...mw) {
    const sub = new Composer(...mw);
    this.use(async (ctx, next) => {
      let called = false;
      const cont = () => ((called = true), Promise.resolve());
      try { await sub.run(ctx, cont); }
      catch (err) { called = false; await handler(new BotError(err, ctx), cont); }
      if (called) return next();
    });
    return sub;
  }

  /** Jalankan rantai middleware terhadap satu ctx. */
  async run(ctx, next) {
    const entries = this.stack;
    let idx = -1;
    const dispatch = async (i) => {
      if (i <= idx) throw new Error('next() dipanggil dua kali');
      idx = i;
      if (i >= entries.length) return next ? next() : undefined;
      const e = entries[i];
      if (!e.match(ctx)) return dispatch(i + 1);
      let continued = false;
      for (let j = 0; j < e.fns.length; j++) {
        const isLast = j === e.fns.length - 1;
        let stepNext = false;
        const r = await e.fns[j](ctx, async () => {
          stepNext = true;
          if (isLast) { continued = true; return dispatch(i + 1); }
        });
        if (!stepNext) return r; // handler berhenti di sini (tak lanjut middleware)
      }
      if (!continued) return undefined;
    };
    return dispatch(0);
  }
  middleware() { return (ctx, next) => this.run(ctx, next); }
}

/** Error yang dibungkus konteksnya, gaya BotError grammY. */
class BotError extends Error {
  constructor(err, ctx) {
    super(err && err.message ? err.message : String(err));
    this.name = 'BotError';
    this.error = err;
    this.ctx = ctx;
  }
}

module.exports = { Composer, BotError, compileFilter };
