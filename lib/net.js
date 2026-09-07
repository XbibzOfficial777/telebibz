// lib/net.js — transport HTTP murni Node 18+ (fetch + FormData + Blob bawaan).
// Tanpa dependency. Menangani JSON & multipart (upload file via attach://).
'use strict';

const { File } = require('./file');

/** Error API Telegram dengan payload debugging. */
class ApiError extends Error {
  constructor(description, errorCode, method, payload) {
    super(description);
    this.name = 'ApiError';
    this.description = description;
    this.error_code = errorCode;
    this.method = method;
    this.payload = payload;
  }
}

/**
 * Panggil Bot API.
 *   transport('743:...', 'sendMessage', { chat_id: 1, text: 'hi' })
 * Nilai payload berupa instance File rilis sebagai multipart attach:// secara otomatis.
 * Return: field `result` dari envelope Telegram. Lempar ApiError kalau ok:false.
 */
async function callTelegram(token, method, payload = {}) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const files = [];
  const clean = {};

  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined || v === null) continue;
    if (v instanceof File) {
      files.push([v.attachName(k), v]);
      clean[k] = `attach://${v.attachName(k)}`;
    } else {
      clean[k] = v;
    }
  }

  let body, headers;
  if (files.length) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(clean)) fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    for (const [attachName, f] of files) fd.append(attachName, new Blob([await f.data()], { type: f.type || 'application/octet-stream' }), f.filename || attachName);
    body = fd; // undici mengatur boundary sendiri
  } else {
    headers = { 'Content-Type': 'application/json' };
    body = JSON.stringify(clean);
  }

  const res = await fetch(url, { method: 'POST', body, headers });
  let env;
  try { env = await res.json(); }
  catch { throw new ApiError(`Telegram membalas non-JSON (HTTP ${res.status})`, res.status, method, payload); }
  if (!env.ok) throw new ApiError(env.description || 'unknown error', env.error_code, method, payload);
  return env.result;
}

module.exports = { callTelegram, ApiError };
