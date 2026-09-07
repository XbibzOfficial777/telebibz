// lib/broadcast.js — kirim ke banyak chat dengan pacing aman rate-limit.
'use strict';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * bot.broadcast(ids, pesan, opts)
 *   ids   : array chat id
 *   pesan : string  → { text: string }
 *           object  → payload sendMessage/salinan
 *           fungsi  → (chatId) => payload (personal per penerima)
 *   opts  : { delay = 35 } ms antar kirim (≈28 pesan/detik, di bawah limit Telegram)
 *
 * Return: { terkirim, gagal, errors: [{ chatId, pesan }] }
 */
async function broadcast(api, ids, pesan, opts = {}) {
  const delay = Number.isFinite(opts.delay) ? opts.delay : 35;
  const failures = [];
  let terkirim = 0;

  for (const chatId of ids) {
    let p = typeof pesan === 'function' ? await pesan(chatId) : pesan;
    if (typeof p === 'string') p = { text: p };
    try {
      await api.sendMessage(chatId, p.text, p);
      terkirim += 1;
    } catch (err) {
      failures.push({ chatId, pesan: (err && (err.description || err.message)) || String(err) });
    }
    if (delay > 0) await sleep(delay);
  }
  return { terkirim, gagal: failures.length, errors: failures };
}

module.exports = { broadcast };
