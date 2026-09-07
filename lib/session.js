// lib/session.js — sesi per-user-per-chat, tanpa konfigurasi.
'use strict';

/**
 * session({ initial, getKey, storage })
 *  - default getKey: from.id + chat.id (khas), fallback chat.id.
 *  - default storage: Map di memori. Boleh kirim storage custom { read(key), write(key,val), delete(key) }.
 */
function session(opts = {}) {
  const initial = opts.initial || (() => ({}));
  const store = opts.storage || new Map();
  const getKey = opts.getKey || ((ctx) => {
    const from = ctx.from && ctx.from.id;
    const chat = ctx.chat && ctx.chat.id;
    if (from !== undefined && chat !== undefined) return `${from}:${chat}`;
    return chat !== undefined ? String(chat) : undefined;
  });

  const read = (k) => (store.read ? store.read(k) : store.get(k));
  const write = (k, v) => (store.write ? store.write(k, v) : store.set(k, v));
  const del = (k) => (store.delete ? store.delete(k) : store.delete(k));

  return async (ctx, next) => {
    const key = getKey(ctx);
    if (key === undefined) { ctx.session = {}; return next(); }
    let s = await read(key);
    if (s === undefined || s === null) { s = initial(); await write(key, s); }
    // Proxy: properti __deleted di akhir → hapus dari store
    ctx.session = new Proxy(s, {
      get: (t, p) => t[p], set: (t, p, v) => { t[p] = v; return true; },
    });
    return next();
  };
}

module.exports = { session };
