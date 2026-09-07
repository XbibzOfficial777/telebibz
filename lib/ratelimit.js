// lib/ratelimit.js — auto-retry 429, throttler antre, dan batas laju per-user.
'use strict';

const dbg = require('debug')('telebibz:ratelimit');

/** Transformer 429: hormati retry_after Telegram (maks maxRetry kali).
 *  Pasang: bot.api.config.use(autoRetry()) */
function autoRetry({ maxRetry = 5, baseDelayMs = 500 } = {}) {
  return async (prev, method, payload) => {
    let attempt = 0;
    for (;;) {
      try { return await prev(method, payload); }
      catch (err) {
        const ra = err && err.parameters && err.parameters.retry_after;
        if (ra !== undefined && attempt < maxRetry) {
          attempt++;
          const wait = ra * 1000 + baseDelayMs * attempt;
          dbg('429 pada %s — tidur %dms (attempt %d)', method, wait, attempt);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }
  };
}

/** Transformer antrean: jaga maks `perSecond` panggilan API global.
 *  Pasang: bot.api.config.use(throttler()) */
function throttler({ perSecond = 28 } = {}) {
  const interval = 1000 / perSecond;
  let last = 0; let chain = Promise.resolve();
  return (prev, method, payload) => {
    chain = chain.then(async () => {
      const wait = last + interval - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      last = Date.now();
      return prev(method, payload);
    });
    return chain;
  };
}

/** Middleware anti-spam: maks `limit` update per user per `windowMs`. */
function limiter({ windowMs = 2000, limit = 3, onExceeded } = {}) {
  const bucket = new Map();
  return async (ctx, next) => {
    const key = ctx.from ? ctx.from.id : (ctx.chatId || '?');
    const now = Date.now();
    const arr = bucket.get(key) || [];
    const alive = arr.filter((t) => now - t < windowMs);
    if (alive.length >= limit) {
      if (onExceeded) return onExceeded(ctx);
      return; // diamkan spam
    }
    alive.push(now); bucket.set(key, alive);
    return next();
  };
}

module.exports = { autoRetry, throttler, limiter };
