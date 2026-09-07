// lib/runner.js — long polling tahan banting (retry 409 & jaringan, backoff halus).
'use strict';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Loop getUpdates; memanggil handleUpdate per update.
 *   stop() mengamaninya keluar loop dengan bersih.
 * Perilaku:
 *  - error jaringan (fetch gagal)      → retry 1 dtk
 *  - 409 (instance lain masih polling) → log callback onConflict + retry 5 dtk
 *  - error API lain                    → oper ke onFatal (default: berhenti bersih)
 */
async function pollLoop({ api, handleUpdate, allowedUpdates, dropPending, onConflict, onFatal, shouldStop, conflictDelay = 5000 }) {
  let offset = 0;
  if (dropPending) {
    try {
      const u = await api.callApi('getUpdates', { offset: -1, timeout: 0, allowed_updates: allowedUpdates });
      if (u.length) offset = u[u.length - 1].update_id + 1;
    } catch { /* abaikan — loop utama yang menangani */ }
  }

  while (!shouldStop()) {
    let updates;
    try {
      updates = await api.callApi('getUpdates', { offset, timeout: 25, allowed_updates: allowedUpdates });
      if (!Array.isArray(updates)) updates = [];
    } catch (err) {
      const code = err && (err.error_code || err.code);
      if (shouldStop()) break;
      if (code === 409) { if (onConflict) onConflict(err); await sleep(conflictDelay); continue; }
      const fatal = code && code !== 429;
      if (fatal) { if (onFatal) onFatal(err); break; }
      await sleep(1000); continue; // koneksi putus / 429 → napas sebentar
    }

    for (const u of updates) {
      if (shouldStop()) break;
      offset = u.update_id + 1;
      try { await handleUpdate(u); } catch { /* sudah ditangani error handler bot */ }
    }
  }
}

module.exports = { pollLoop };
