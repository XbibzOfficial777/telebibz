// lib/logger.js — log terminal cantik tanpa dependency.
'use strict';

const C = {
  reset: '[0m', dim: '[2m', bold: '[1m',
  red: '[31m', green: '[32m', yellow: '[33m', blue: '[34m',
  magenta: '[35m', cyan: '[36m', gray: '[90m',
};

function paint(code, s) {
  return process.stdout && process.stdout.isTTY ? `${C[code]}${s}${C.reset}` : String(s);
}

function stamp() {
  return paint('gray', new Date().toLocaleTimeString('id-ID', { hour12: false }));
}

const log = {
  info: (...a) => console.log(`${stamp()} ${paint('cyan', 'ℹ')} `, ...a),
  ok:   (...a) => console.log(`${stamp()} ${paint('green', '✔')} `, ...a),
  warn: (...a) => console.warn(`${stamp()} ${paint('yellow', '⚠')} `, ...a),
  error:(...a) => console.error(`${stamp()} ${paint('red', '✖')} `, ...a),
  paint,
};

/** Banner ASCII saat bot nyala. */
log.banner = (title, rows) => {
  const width = Math.max(title.length, ...rows.map((r) => strip(r).length)) + 2;
  const line = '─'.repeat(width + 2);
  console.log(`┌${line}┐`);
  console.log(`│  ${paint('bold', title)}${' '.repeat(width - title.length)}│`);
  for (const r of rows) console.log(`│  ${r}${' '.repeat(Math.max(0, width - strip(r).length))}│`);
  console.log(`└${line}┘`);
};

function strip(s) { return String(s).replace(/\[\d+m/g, ''); }

module.exports = log;
