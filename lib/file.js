// lib/file.js — representasi file untuk dikirim (Buffer | path lokal | stream).
'use strict';

const fs = require('fs');

/**
 * new File(buf, 'laporan.pdf')          — dari Buffer
 * new File('/tmp/a.jpg')                — dari path lokal
 * new File(buf, 'video.mp4', 'video/mp4')
 * Tips: string biasa (URL Telegram / file_id) langsung saja, tak perlu File.
 */
class File {
  constructor(src, filename, type) {
    this.src = src;
    this.filename = filename || (typeof src === 'string' ? require('path').basename(src) : 'file');
    this.type = type;
    this._attachId = Math.random().toString(36).slice(2);
  }
  attachName(field) { return `${field}_${this._attachId}`; }
  /** Baca isi jadi Buffer (lazy, async). */
  async data() {
    if (Buffer.isBuffer(this.src)) return this.src;
    if (this.src instanceof Uint8Array) return Buffer.from(this.src);
    if (typeof this.src === 'string') return fs.promises.readFile(this.src);
    if (this.src && typeof this.src[Symbol.asyncIterator] === 'function') {
      const chunks = [];
      for await (const c of this.src) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
      return Buffer.concat(chunks);
    }
    throw new Error('telebibz File: sumber tidak dikenal (pakai Buffer/path/stream)');
  }
}

/** Alias kompatibel gaya grammY. */
class InputFile extends File {}

module.exports = { File, InputFile };
