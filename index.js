// index.js — pintu masuk @xbibzlibrary/telebibz.
// Semua yang perlu kamu pakai sehari-hari diekspor dari sini.
'use strict';

const { TeleBibz, GrammyError, HttpError } = require('./lib/telebibz');
const { btn, url, webApp, copy, kb } = require('./lib/keyboard');
const wizard = require('./lib/wizard');
const { humanize } = require('./lib/errors');
const log = require('./lib/logger');

// Re-export alat grammY yang paling seru dipakai pemula:
const { InputFile, InlineKeyboard, Keyboard, webhookCallback } = require('grammy');

/**
 * Shortcut konteks: tambah ctx.replyHTML / ctx.jawab? — cukup lewat opsi:
 *   ctx.reply('<b>halo</b>', { parse_mode: 'HTML' })
 * atau pakai gula di bawah.
 */
const say = {
  html: (text, extra = {}) => ({ ...extra, text, parse_mode: 'HTML' }),
};

module.exports = {
  TeleBibz,
  // keyboard
  btn, url, webApp, copy, kb,
  // wizard (akses langsung kalau mau)
  wizard,
  // util
  humanize, log, say,
  // bawaan grammY
  InputFile, InlineKeyboard, Keyboard, webhookCallback,
  // error
  GrammyError, HttpError,
};
