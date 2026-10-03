// lib/runner.js — long polling tahan banting dengan dispatch konkuren.
'use strict';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Loop getUpdates dengan backpressure. Update dipanggil tanpa menunggu satu sama
 * lain; handleUpdate mengatur batas worker dan urutan per session key. Promise
 * yang masih berjalan tetap dilacak agar stop() dapat melakukan graceful drain.
 */
async function pollLoop({
  api,
  handleUpdate,
  allowedUpdates,
  dropPending,
  onConflict,
  onFatal,
  shouldStop,
  conflictDelay = 5000,
  maxInFlightUpdates = 800,
}) {
  let offset = 0;
  const inFlight = new Set();
  const inFlightLimit = Number.isSafeInteger(maxInFlightUpdates) && maxInFlightUpdates > 0
    ? maxInFlightUpdates
    : 800;

  const dispatch = (update) => {
    let task;
    task = Promise.resolve()
      .then(() => handleUpdate(update))
      .catch(() => { /* error sudah ditangani bot; jangan hentikan poller */ })
      .then(() => inFlight.delete(task));
    inFlight.add(task);
  };

  if (dropPending) {
    try {
      const u = await api.callApi('getUpdates', { offset: -1, timeout: 0, allowed_updates: allowedUpdates });
      if (Array.isArray(u) && u.length) offset = u[u.length - 1].update_id + 1;
    } catch { /* abaikan — loop utama yang menangani */ }
  }

  try {
    while (!shouldStop()) {
      let updates;
      try {
        updates = await api.callApi('getUpdates', { offset, timeout: 25, allowed_updates: allowedUpdates });
        if (!Array.isArray(updates)) updates = [];
      } catch (err) {
        const code = err && (err.error_code || err.code);
        if (shouldStop()) break;
        if (code === 409) { if (onConflict) await onConflict(err); await sleep(conflictDelay); continue; }
        if (code === 429) {
          const retryAfter = Number(err && err.parameters && err.parameters.retry_after);
          await sleep(Number.isFinite(retryAfter) && retryAfter >= 0 ? retryAfter * 1000 : 1000);
          continue;
        }
        if (Number.isInteger(code) && code >= 500 && code < 600) { await sleep(1000); continue; }
        const networkCode = err && ['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN', 'ENOTFOUND', 'EPIPE', 'ENETUNREACH', 'ECONNREFUSED'].includes(err.code);
        if (!err || err.network || networkCode || !err.error_code) {
          await sleep(1000); continue; // jaringan putus/time-out: retry, bukan fatal
        }
        if (onFatal) await onFatal(err);
        break;
      }

      for (const update of updates) {
        if (shouldStop()) break;
        while (inFlight.size >= inFlightLimit) {
          await Promise.race(inFlight);
          if (shouldStop()) break;
        }
        if (shouldStop()) break;
        offset = update.update_id + 1;
        dispatch(update);
      }
    }
  } finally {
    // Stop/fatal error menghentikan intake, bukan memutus handler yang sedang berjalan.
    await Promise.all([...inFlight]);
  }
}

module.exports = { pollLoop };
