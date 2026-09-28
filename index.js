// index.js — pintu masuk @xbibzlibrary/telebibz.
// v3: set fitur production-grade setara grammY (lihat README -> FEATURE MATRIX).
'use strict';

const { TeleBibz } = require('./lib/telebibz');
const { ApiError, createTransport } = require('./lib/net');
const { File, InputFile, InputMediaBuilder, InputPaidMediaBuilder } = require('./lib/file');
const { rich, RichMessageBuilder, inputRichMessage } = require('./lib/rich');
const { TELEGRAM_API_METHODS } = require('./lib/telegram-methods');
const { btn, url, webApp, copy, kb, InlineKeyboard, Keyboard } = require('./lib/keyboard');
const wizard = require('./lib/wizard');
const { humanize } = require('./lib/errors');
const log = require('./lib/logger');
const { session } = require('./lib/session');
const { Composer, BotError } = require('./lib/composer');
const { makeApi } = require('./lib/api');
const { Context } = require('./lib/context');
const { broadcast } = require('./lib/broadcast');
const { autoRetry, throttler, limiter } = require('./lib/ratelimit');
const { matchInlineQuery, iq } = require('./lib/inline-query');
const { Menu, MenuContainer } = require('./lib/menus');

const say = {
  html: (text, extra = {}) => ({ ...extra, text, parse_mode: 'HTML' }),
};

module.exports = {
  // kelas utama
  TeleBibz, Context, Composer, BotError, session,
  // wizard (form percakapan + tombol + edit/delete)
  wizard,
  // keyboard & menu
  btn, url, webApp, copy, kb, InlineKeyboard, Keyboard, Menu, MenuContainer,
  // percakapan
  wizard,
  // file & media
  File, InputFile, InputMediaBuilder, InputPaidMediaBuilder,
  // Rich Messages (Bot API 10.3)
  rich, RichMessageBuilder, inputRichMessage,
  // complete raw Bot API method registry (185 methods)
  TELEGRAM_API_METHODS,
  // api & transport
  makeApi, createTransport, ApiError,
  // anti-spam & keandalan
  autoRetry, throttler, limiter, broadcast,
  // inline mode
  matchInlineQuery, iq,
  // util
  humanize, log, say,
};
