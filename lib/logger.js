// lib/logger.js — log terminal rapi, berwarna, dan mudah dibaca.
'use strict';

const C = {
  reset: '\u001b[0m', dim: '\u001b[2m', bold: '\u001b[1m',
  red: '\u001b[31m', green: '\u001b[32m', yellow: '\u001b[33m', blue: '\u001b[34m',
  magenta: '\u001b[35m', cyan: '\u001b[36m', gray: '\u001b[90m',
  developer: '\u001b[1;35m', border: '\u001b[36m',
  title: '\u001b[1;97;44m', panel: '\u001b[97;44m',
};

function paint(code, s) {
  const colorsEnabled = process.stdout && process.stdout.isTTY && !process.env.NO_COLOR;
  return colorsEnabled ? `${C[code]}${s}${C.reset}` : String(s);
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

/** Banner boot: identitas developer berada di atas panel warna. */
log.banner = (title, rows = [], developer = 'Xbibz Technology ID') => {
  const innerWidth = Math.max(displayWidth(title), ...rows.map((r) => displayWidth(strip(r)))) + 4;
  const top = `┏${'━'.repeat(innerWidth)}┓`;
  const divider = `┣${'━'.repeat(innerWidth)}┫`;
  const bottom = `┗${'━'.repeat(innerWidth)}┛`;
  const line = (text, color) => {
    const plain = `  ${text}${' '.repeat(Math.max(0, innerWidth - displayWidth(text) - 4))}  `;
    console.log(`${paint('border', '┃')}${paint(color, plain)}${paint('border', '┃')}`);
  };

  console.log(paint('developer', `◆ DEVELOPER  ${developer}`));
  console.log(paint('border', top));
  line(title, 'title');
  console.log(paint('border', divider));
  for (const row of rows) line(strip(row), 'panel');
  console.log(paint('border', bottom));
};

function strip(s) { return String(s).replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, ''); }

// Hitung lebar tampilan terminal (emoji/CJK = 2 kolom; combining mark = 0).
function displayWidth(value) {
  let width = 0;
  for (const ch of String(value)) {
    const cp = ch.codePointAt(0);
    if (/\p{Mark}/u.test(ch) || cp === 0x200d || (cp >= 0xfe00 && cp <= 0xfe0f)) continue;
    width += cp >= 0x1100 && (
      cp <= 0x115f || cp === 0x2329 || cp === 0x232a ||
      (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
      (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe10 && cp <= 0xfe19) || (cp >= 0xfe30 && cp <= 0xfe6f) ||
      (cp >= 0xff00 && cp <= 0xff60) || (cp >= 0xffe0 && cp <= 0xffe6) ||
      (cp >= 0x1f300 && cp <= 0x1faff) || (cp >= 0x20000 && cp <= 0x3fffd)
    ) ? 2 : 1;
  }
  return width;
}

module.exports = log;
