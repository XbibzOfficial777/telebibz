// lib/wizard.js — percakapan tanya-jawab berurutan (form) berbasis sesi.
'use strict';

const KEY = '__telebibz_wizard';

/**
 * Definisi wizard:
 * {
 *   steps: [
 *     { key:'nama', ask:'Siapa namamu?' },
 *     { key:'umur', ask:'Umur berapa?', parse: Number,
 *       validate: (n) => (n>0 && n<120) ? null : 'Umur tidak masuk akal, ulangi:' },
 *   ],
 *   done: async (answers, ctx) => {},
 *   cancelWords: ['batal', '/batal', 'cancel'],   // ops, default ada
 *   onCancel: (ctx) => ctx.reply('Dibatalkan.'),  // ops
 * }
 */
const wizards = new Map();

function define(id, def) {
  if (!def || !Array.isArray(def.steps) || !def.steps.length || typeof def.done !== 'function') {
    throw new Error(`wizard "${id}" butuh steps[] dan done(answers, ctx)`);
  }
  const cancelWords = new Set((def.cancelWords || ['batal', '/batal', 'cancel']).map((s) => String(s).toLowerCase()));
  wizards.set(id, { ...def, cancelWords });
  return id;
}

function get(id) { return wizards.get(id); }

/** Mulai wizard dari handler mana pun (command/action/dll). */
async function start(ctx, id) {
  const def = wizards.get(id);
  if (!def) throw new Error(`wizard "${id}" belum didefinisikan`);
  if (!ctx.session) throw new Error('telebibz: session belum aktif (lib internal)');
  ctx.session[KEY] = { id, i: 0, ans: {} };
  const s0 = def.steps[0];
  return ctx.reply(typeof s0.ask === 'function' ? await s0.ask(ctx) : s0.ask, s0.opts || {});
}

/** Middleware global: memproses jawaban wizard yang sedang berjalan. */
function middleware() {
  return async (ctx, next) => {
    const st = ctx.session && ctx.session[KEY];
    if (!st) return next();
    const def = wizards.get(st.id);
    if (!def) { delete ctx.session[KEY]; return next(); }

    const text = ctx.message && typeof ctx.message.text === 'string' ? ctx.message.text.trim() : null;
    if (text === null) return; // pesan non-teks (foto/stiker) — diamkan, wizard menunggu

    if (def.cancelWords.has(text.toLowerCase())) {
      delete ctx.session[KEY];
      if (def.onCancel) return def.onCancel(ctx);
      return ctx.reply('✖️ Sesi dibatalkan.');
    }

    const step = def.steps[st.i];
    let value = text;
    if (step.parse) value = await step.parse(text, ctx);
    if (step.validate) {
      const errMsg = await step.validate(value, ctx);
      if (errMsg) return ctx.reply(errMsg);
    }
    st.ans[step.key] = value;
    st.i += 1;

    if (st.i >= def.steps.length) {
      delete ctx.session[KEY];
      return def.done(st.ans, ctx);
    }
    const ns = def.steps[st.i];
    return ctx.reply(typeof ns.ask === 'function' ? await ns.ask(ctx) : ns.ask, ns.opts || {});
  };
}

/** True kalau user ini sedang di tengah wizard. */
function active(ctx) { return Boolean(ctx.session && ctx.session[KEY]); }

module.exports = { define, get, start, middleware, active, KEY };
