// lib/keyboard.js — pembangun tombol inline, tanpa perlu tahu struktur mentah API.
'use strict';

/**
 * Buat tombol callback.
 *   btn('Menu', 'menu')
 *   btn('Hapus', 'del', 'danger')                      // warna merah
 *   btn('Gas', 'go', 'success', '5408846744727334338') // + ikon animated
 * Warna (Bot API 9.4): 'danger' merah · 'success' hijau · 'primary' biru/ungu.
 * iconId = custom_emoji_id animated (butuh Premium owner / username Fragment).
 */
function btn(text, callbackData, style, iconId) {
  const b = { text, callback_data: String(callbackData) };
  if (style) b.style = style;
  if (iconId) b.icon_custom_emoji_id = String(iconId);
  return b;
}

/** Tombol tautan (membuka URL). */
function url(text, link, style, iconId) {
  const b = { text, url: String(link) };
  if (style) b.style = style;
  if (iconId) b.icon_custom_emoji_id = String(iconId);
  return b;
}

/** Tombol WebApp (khusus chat pribadi). */
function webApp(text, link, iconId) {
  const b = { text, web_app: { url: String(link) } };
  if (iconId) b.icon_custom_emoji_id = String(iconId);
  return b;
}

/** Tombol salin teks ke clipboard. */
function copy(text, value, iconId) {
  const b = { text, copy_text: { text: String(value) } };
  if (iconId) b.icon_custom_emoji_id = String(iconId);
  return b;
}

/**
 * Susun keyboard dari array 2 dimensi baris-kolom, lalu kirim apa adanya lewat
 * ctx.reply(..., { keyboard: kb([...]) }) atau simpan sebagai markup.
 */
function kb(rows) {
  return { reply_markup: { inline_keyboard: rows } };
}

/** Versi markup polos (untuk editMessageReplyMarkup dll). */
kb.markup = (rows) => ({ inline_keyboard: rows });

/** Tiga gaya warna dalam satu baris (pola konfirmasi umum). */
kb.confirm = (yesData, noData, labelYes = '✅ Ya', labelNo = '❌ Batal') =>
  kb([[btn(labelYes, yesData, 'success'), btn(labelNo, noData, 'danger')]]);

module.exports = { btn, url, webApp, copy, kb };
