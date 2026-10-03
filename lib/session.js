// lib/session.js — sesi per-user-per-chat, tanpa konfigurasi.
'use strict';

/**
 * session({ initial, getKey, storage })
 *  - default getKey: from.id + chat.id (khas), fallback chat.id.
 *  - default storage: Map di memori. Boleh kirim storage custom { read(key), write(key,val), delete(key) }.
 */
const SESSION_KEY_CACHE = Symbol('telebibz.sessionKeyCache');

function getSessionKey(ctx, opts = {}) {
  const cached = ctx[SESSION_KEY_CACHE];
  if (cached) {
    if (cached.failed) throw cached.error;
    return cached.key;
  }

  const getKey = opts.getKey || ((current) => {
    const from = current.from && current.from.id;
    const chat = current.chat && current.chat.id;
    if (from !== undefined && chat !== undefined) return `${from}:${chat}`;
    return chat !== undefined ? String(chat) : undefined;
  });
  try {
    const key = getKey(ctx);
    Object.defineProperty(ctx, SESSION_KEY_CACHE, { value: { key, failed: false } });
    return key;
  } catch (error) {
    Object.defineProperty(ctx, SESSION_KEY_CACHE, { value: { error, failed: true } });
    throw error;
  }
}

function session(opts = {}) {
  const initial = opts.initial || (() => ({}));
  const store = opts.storage || new Map();

  const read = (k) => (store.read ? store.read(k) : store.get(k));
  const write = (k, v) => (store.write ? store.write(k, v) : store.set(k, v));
  const del = (k) => (store.delete ? store.delete(k) : store.delete(k));

  return async (ctx, next) => {
    const key = getSessionKey(ctx, opts);
    if (key === undefined) { ctx.session = {}; return next(); }
    let s = await read(key);
    if (s === undefined || s === null) s = initial();
    if (!s || typeof s !== 'object') throw new TypeError('session: initial/storage harus mengembalikan object');
    // Proxy: simpan ulang setelah middleware agar storage hasil deserialisasi juga awet.
    ctx.session = new Proxy(s, {
      get: (t, p) => t[p],
      set: (t, p, v) => { t[p] = v; return true; },
      deleteProperty: (t, p) => { delete t[p]; return true; },
    });
    try {
      return await next();
    } finally {
      if (s.__deleted === true) await del(key);
      else await write(key, s);
    }
  };
}

module.exports = { session, getSessionKey };
