// index.js — pintu masuk @xbibzlibrary/telebibz (v2: 100% kode sendiri, 0 dependency).
'use strict';

const { TeleBibz } = require('./lib/telebibz');
const { ApiError } = require('./lib/net');
const { File, InputFile } = require('./lib/file');
const { btn, url, webApp, copy, kb, InlineKeyboard, Keyboard } = require('./lib/keyboard');
const wizard = require('./lib/wizard');
const { humanize } = require('./lib/errors');
const log = require('./lib/logger');
const { session } = require('./lib/session');
const { Composer, BotError } = require('./lib/composer');
const { Api } = require('./lib/api');

const say = {
  html: (text, extra = {}) => ({ ...extra, text, parse_mode: 'HTML' }),
};

module.exports = {
  TeleBibz,
  // keyboard
  btn, url, webApp, copy, kb, InlineKeyboard, Keyboard,
  // percakapan berurut
  wizard,
  // file kiriman
  File, InputFile,
  // blok penyusun (lanjutan)
  Composer, BotError, session, Api,
  // util
  humanize, log, say,
  // error API
  ApiError,
};
