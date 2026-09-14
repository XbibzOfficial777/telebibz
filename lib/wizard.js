// lib/wizard.js — percakapan tanya-jawab berurutan (form) berbasis sesi.
// v3.1: + TOMBOL pilihan (reply keyboard / inline keyboard), mode tampilan
//       'send' | 'edit' | 'delete', cleanup pesan & hapus keyboard otomatis.
'use strict';

const KEY = '__telebibz_wizard';

/**
 * Definisi wizard:
 * {
 *   mode: 'send' | 'edit' | 'delete',   // ops, default 'send' (per-step bisa override)
 *   cleanup: true,                       // ops: hapus pesan tanya terakhir saat selesai
 *   removeKeyboard: true,                // ops: singkirkan reply keyboard saat selesai
 *   steps: [
 *     { key:'nama', ask:'Siapa namamu?' },
 *     { key:'jk', ask:'Jenis kelamin?', buttons: ['Laki-laki', 'Perempuan'] },
 *     { key:'setuju', ask:'Setuju?', inline: true,
 *       buttons: [[{ text:'✅ Ya', value:'ya' }, { text:'❌ Tidak', value:'tdk' }]] },
 *     { key:'umur', ask:'Umur berapa?', parse: Number, mode: 'edit', onlyButtons: false,
 *       validate: (n) => (n>0 && n<120) ? null : 'Umur tidak masuk akal, ulangi:' },
 *   ],
 *   done: async (answers, ctx) => {},
 *   cancelWords: ['batal', '/batal', 'cancel'],   // ops, default ada
 *   onCancel: (ctx) => ctx.reply('Dibatalkan.'),  // ops
 * }
 *
 * Format `buttons`:
 *   ['A', 'B']                          → label polos, nilai = label
 *   [{ text:'A', value:'a' }]           → label + nilai berbeda (flat, disusun 2 per baris)
 *   [['A','B'], ['C']]                  → baris eksplisit (reply maupun inline)
 * `inline: true`  → tombol callback (klik = nilai langsung, tanpa mengetik)
 * `onlyButtons: true` → tolak ketikan bebas, wajib pilih tombol
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

/* ---------- normalisasi tombol ---------- */
function normalizeButtons(input) {
  if (!Array.isArray(input) || !input.length) return null;
  const norm = (b) => (b && typeof b === 'object' && b.text !== undefined
    ? { text: String(b.text), value: b.value !== undefined ? b.value : String(b.text) }
    : { text: String(b), value: String(b) });
  if (Array.isArray(input[0])) return input.map((r) => (Array.isArray(r) ? r : [r]).map(norm));
  // daftar flat → susun rapi maksimal 2 tombol per baris
  const flat = input.map(norm);
  const rows = [];
  for (let i = 0; i < flat.length; i += 2) rows.push(flat.slice(i, i + 2));
  return rows;
}
const flatten = (rows) => rows.reduce((a, r) => a.concat(r), []);

/** Susun reply_markup untuk langkah ke-`idx` (jika ada tombolnya). */
function stepExtra(def, st, idx) {
  const step = def.steps[idx];
  const extra = { ...(step.opts || {}) };
  const rows = normalizeButtons(step.buttons);
  if (!rows) return extra;
  if (step.inline) {
    let n = 0;
    extra.reply_markup = {
      inline_keyboard: rows.map((r) => r.map((b) => ({
        text: b.text,
        callback_data: `wiz:${st.cb}:${idx}:${n++}`,
      }))),
    };
  } else {
    st.rk = true; // pernah memakai reply keyboard → perlu dibersihkan saat selesai
    extra.reply_markup = {
      keyboard: rows.map((r) => r.map((b) => ({ text: b.text }))),
      resize_keyboard: true,
      ...(step.oneTime ? { one_time_keyboard: true } : {}),
    };
  }
  return extra;
}

/** Tampilkan pertanyaan langkah `idx` sesuai mode ('send' | 'edit' | 'delete'). */
async function tampil(ctx, st, def, idx, text) {
  const step = def.steps[idx];
  const mode = step.mode || def.mode || 'send';
  const extra = stepExtra(def, st, idx);

  if (mode === 'edit' && st.msgId) {
    try {
      await ctx.api.editMessageText(st.chatId, st.msgId, text, extra);
      return;
    } catch (e) {
      if (/not modified/i.test((e && (e.description || e.message)) || '')) return;
      // pesan tak ditemukan (sudah dihapus) → jatuh ke kirim baru
    }
  } else if (mode === 'delete' && st.msgId) {
    try { await ctx.api.deleteMessage(st.chatId, st.msgId); } catch { /* sudah hilang */ }
    st.msgId = undefined;
  }
  const sent = await ctx.reply(text, extra);
  if (sent && sent.message_id) { st.chatId = ctx.chatId; st.msgId = sent.message_id; }
}

/** Bersihkan jejak wizard: hapus pesan tanya (cleanup) + singkirkan reply keyboard. */
async function bersih(ctx, st, def) {
  if (!def) return;
  const cleanupOn = def.cleanup !== undefined ? !!def.cleanup : (def.mode === 'delete');
  if (cleanupOn && st.msgId) {
    try { await ctx.api.deleteMessage(st.chatId, st.msgId); } catch { /* sudah hilang */ }
  }
  if (st.rk && def.removeKeyboard !== false) {
    try {
      await ctx.api.sendMessage(st.chatId, '\u200b', { reply_markup: { remove_keyboard: true } });
    } catch { /* chat tak terjangkau */ }
  }
}

/** Mulai wizard dari handler mana pun (command/action/dll). */
async function start(ctx, id) {
  const def = wizards.get(id);
  if (!def) throw new Error(`wizard "${id}" belum didefinisikan`);
  if (!ctx.session) throw new Error('telebibz: session belum aktif (lib internal)');
  const st = { id, i: 0, ans: {}, cb: Math.random().toString(36).slice(2, 8) };
  ctx.session[KEY] = st;
  const s0 = def.steps[0];
  const text = typeof s0.ask === 'function' ? await s0.ask(ctx) : s0.ask;
  return tampil(ctx, st, def, 0, text);
}

/** Proses satu jawaban (teks ketikan ATAU nilai tombol) untuk langkah aktif. */
async function jawab(ctx, st, def, input) {
  const step = def.steps[st.i];
  let value = input;
  if (step.parse) value = await step.parse(input, ctx);
  if (step.validate) {
    const errMsg = await step.validate(value, ctx);
    if (errMsg) {
      const mode = step.mode || def.mode || 'send';
      if (mode === 'send') return ctx.reply(errMsg);
      return tampil(ctx, st, def, st.i, errMsg); // edit/delete: ubah pesan yang sama
    }
  }
  st.ans[step.key] = value;
  st.i += 1;

  if (st.i >= def.steps.length) {
    await bersih(ctx, st, def);
    delete ctx.session[KEY];
    return def.done(st.ans, ctx);
  }
  const ns = def.steps[st.i];
  return tampil(ctx, st, def, st.i, typeof ns.ask === 'function' ? await ns.ask(ctx) : ns.ask);
}

/** Batalkan wizard yang sedang berjalan secara programatis. */
async function cancel(ctx) {
  const st = ctx.session && ctx.session[KEY];
  if (!st) return false;
  const def = wizards.get(st.id);
  await bersih(ctx, st, def);
  delete ctx.session[KEY];
  if (def && def.onCancel) { await def.onCancel(ctx); return true; }
  await ctx.reply('✖️ Sesi dibatalkan.');
  return true;
}

/** Edit pesan-tanya wizard yang sedang tampil (fallback: kirim baru). */
async function editAsk(ctx, text, extra = {}) {
  const st = ctx.session && ctx.session[KEY];
  if (!st || !st.msgId) return ctx.reply(text, extra);
  try { await ctx.api.editMessageText(st.chatId, st.msgId, text, extra); }
  catch {
    const sent = await ctx.reply(text, extra);
    if (sent && sent.message_id) { st.chatId = ctx.chatId; st.msgId = sent.message_id; }
  }
}

/** Hapus pesan-tanya wizard yang sedang tampil. */
async function deleteAsk(ctx) {
  const st = ctx.session && ctx.session[KEY];
  if (!st || !st.msgId) return false;
  try { await ctx.api.deleteMessage(st.chatId, st.msgId); } catch { /* sudah hilang */ }
  st.msgId = undefined;
  return true;
}

/** Middleware global: memproses jawaban wizard yang sedang berjalan. */
function middleware() {
  return async (ctx, next) => {
    const st = ctx.session && ctx.session[KEY];
    if (!st) return next();
    const def = wizards.get(st.id);
    if (!def) { delete ctx.session[KEY]; return next(); }

    /* ---- klik tombol inline (callback_query) ---- */
    const q = ctx.callback_query;
    if (q && typeof q.data === 'string') {
      const m = /^wiz:([a-z0-9]+):(\d+):(\d+)$/i.exec(q.data);
      if (m) {
        const stale = (pesan) => ctx.answerCallbackQuery({ text: pesan, show_alert: true }).catch(() => {});
        if (m[1] !== st.cb || Number(m[2]) !== st.i) return stale('⌛ Tombol usang — formulir sudah berpindah/berakhir.');
        const rows = normalizeButtons(def.steps[st.i].buttons);
        const tombol = rows && flatten(rows)[Number(m[3])];
        if (!tombol) return stale('⌛ Tombol usang — formulir sudah berpindah/berakhir.');
        await ctx.answerCallbackQuery().catch(() => {});
        return jawab(ctx, st, def, tombol.value);
      }
      // callback lain saat wizard aktif → diamkan, wizard menunggu (konsisten non-teks)
    }

    /* ---- jawaban teks ---- */
    const text = ctx.message && typeof ctx.message.text === 'string' ? ctx.message.text.trim() : null;
    if (text === null) return; // pesan non-teks (foto/stiker) — diamkan, wizard menunggu

    if (def.cancelWords.has(text.toLowerCase())) {
      await bersih(ctx, st, def);
      delete ctx.session[KEY];
      if (def.onCancel) return def.onCancel(ctx);
      return ctx.reply('✖️ Sesi dibatalkan.');
    }

    const step = def.steps[st.i];
    let input = text;
    const rows = normalizeButtons(step.buttons);
    if (rows) {
      const hit = flatten(rows).find((b) => b.text.toLowerCase() === text.toLowerCase());
      if (hit) input = hit.value; // tekan tombol reply → pakai nilainya
      else if (step.onlyButtons) {
        const pesan = step.onlyButtons === true
          ? '✋ Pilih salah satu tombol yang tersedia ya:'
          : step.onlyButtons;
        return tampil(ctx, st, def, st.i, pesan);
      }
    }
    return jawab(ctx, st, def, input);
  };
}

/** True kalau user ini sedang di tengah wizard. */
function active(ctx) { return Boolean(ctx.session && ctx.session[KEY]); }

module.exports = { define, get, start, middleware, active, cancel, editAsk, deleteAsk, KEY };
