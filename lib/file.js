// lib/file.js — file kiriman (Buffer | path | stream) + builder InputMedia.
'use strict';

const fs = require('fs');
const path = require('path');
let mime = null;
try { mime = require('mime-types'); } catch { /* opsional */ }

class File {
  constructor(src, filename, type) {
    this.src = src;
    this.filename = filename || (typeof src === 'string' ? path.basename(src) : 'file');
    this.type = type || (mime ? (mime.lookup(this.filename) || undefined) : undefined);
    this._attachId = Math.random().toString(36).slice(2);
  }
  attachName(field) { return `${field}_${this._attachId}`; }
  async data() {
    if (Buffer.isBuffer(this.src)) return this.src;
    if (this.src instanceof Uint8Array) return Buffer.from(this.src);
    if (typeof this.src === 'string') return fs.promises.readFile(this.src);
    if (this.src && this.src.path && fs.existsSync(this.src.path)) return fs.promises.readFile(this.src.path); // stream fs
    if (this.src && typeof this.src[Symbol.asyncIterator] === 'function') {
      const chunks = [];
      for await (const c of this.src) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
      return Buffer.concat(chunks);
    }
    throw new Error('telebibz File: sumber tidak dikenal (Buffer/path/stream)');
  }
}
class InputFile extends File {}

/** Builder media grup (album): media.photo(src, {caption}), .video(...), ... */
const InputMediaBuilder = {
  photo: (media, extra = {}) => ({ type: 'photo', media, ...extra }),
  video: (media, extra = {}) => ({ type: 'video', media, ...extra }),
  livePhoto: (media, photo, extra = {}) => ({ type: 'live_photo', media, photo, ...extra }),
  document: (media, extra = {}) => ({ type: 'document', media, ...extra }),
  audio: (media, extra = {}) => ({ type: 'audio', media, ...extra }),
  animation: (media, extra = {}) => ({ type: 'animation', media, ...extra }),
};

const InputPaidMediaBuilder = {
  photo: (media, extra = {}) => ({ type: 'photo', media, ...extra }),
  video: (media, extra = {}) => ({ type: 'video', media, ...extra }),
  livePhoto: (media, photo, extra = {}) => ({ type: 'live_photo', media, photo, ...extra }),
};

module.exports = { File, InputFile, InputMediaBuilder, InputPaidMediaBuilder };
