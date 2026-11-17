// lib/net.js — transport Bot API production-grade (axios keep-alive, proxy, timeout,
// multipart attach://, 429 retry_after handler, debug logging).
'use strict';

const axios = require('axios');
const http = require('http');
const https = require('https');
const dbg = require('debug')('telebibz:net');
let HttpsProxyAgent = null;
try { ({ HttpsProxyAgent } = require('https-proxy-agent')); } catch { /* proxy opsional */ }

const { File } = require('./file');
const mime = require('mime-types');

/** Error API Telegram dengan konteks debugging. */
class ApiError extends Error {
  constructor(description, errorCode, method, payload, parameters) {
    super(description);
    this.name = 'ApiError';
    this.description = description;
    this.error_code = errorCode;
    this.parameters = parameters || {};
    this.method = method;
    this.payload = payload;
  }
}

const keepAliveHttp = new http.Agent({ keepAlive: true, maxSockets: 64 });
const keepAliveHttps = new https.Agent({ keepAlive: true, maxSockets: 64 });

/** Agent HTTP(S) sesuai opsi: proxy kalau ada, kalau tidak keep-alive bersama. */
function makeAgent(proxy) {
  if (proxy && HttpsProxyAgent) return new HttpsProxyAgent(proxy);
  return keepAliveHttps;
}

/**
 * Bangun fungsi transport (method, payload) => result.
 * opts: { apiRoot, proxy, timeoutMs, headers }
 */
function createTransport(token, opts = {}) {
  const apiRoot = (opts.apiRoot || 'https://api.telegram.org').replace(/\/$/, '');
  const agent = makeAgent(opts.proxy);
  // Upload multipart (file besar) butuh waktu jauh lebih lama daripada getUpdates.
  const uploadTimeoutMs = opts.uploadTimeoutMs || Math.max(Number(opts.timeoutMs) || 35000, 300000);
  const client = axios.create({
    baseURL: `${apiRoot}/bot${token}/`,
    httpAgent: keepAliveHttp,
    httpsAgent: agent,
    timeout: opts.timeoutMs || 35000, // sedikit > long-poll 25s
    headers: opts.headers || {},
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    proxy: false, // kendalikan lewat httpsAgent sendiri
  });

  return async function transport(method, payload = {}) {
    dbg('--> %s %s', method, JSON.stringify(payload, safeReplacer).slice(0, 400));
    const files = [];
    // Deep-walk: File di MANA PUN (media[i].media, photo top-level, thumbnail, dll)
    const clean = collectAttach(payload, files);

    let data, config = {};
    if (files.length) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(clean)) fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
      for (const [an, f] of files) {
        const buf = await f.data();
        fd.append(an, new Blob([buf], { type: f.type || mime.lookup(f.filename) || 'application/octet-stream' }), f.filename || an);
      }
      data = fd;
    } else {
      data = JSON.stringify(clean);
      config.headers = { 'Content-Type': 'application/json' };
    }

    let res;
    try {
      const perRequest = files.length ? { ...config, timeout: uploadTimeoutMs } : config;
      res = await client.post(method, data, perRequest);
    } catch (err) {
      if (err.response && err.response.data) {
        const d = err.response.data;
        dbg('<-- ERR %s: %s', method, d.description);
        throw new ApiError(d.description || `HTTP ${err.response.status}`, d.error_code || err.response.status, method, payload, d.parameters);
      }
      // error jaringan murni: tag agar Runner menganggapnya sementara
      err.network = !err.response;
      dbg('<-- NETWORK ERR %s: %s', method, err.message);
      throw err;
    }
    const env = res.data;
    if (!env.ok) {
      dbg('<-- ERR %s: %s', method, env.description);
      throw new ApiError(env.description || 'unknown error', env.error_code, method, payload, env.parameters);
    }
    dbg('<-- OK %s', method);
    return env.result;
  };
}

/**
 * Downloader file Bot API yang sadar apiRoot + proxy + timeout + batas ukuran.
 * Dipakai oleh api.downloadFile() dan ctx.downloadFile() supaya perilakunya sama.
 *   const dl = createDownloader(token, { apiRoot, proxy });
 *   await dl(file_path, '/tmp/foto.jpg');
 *   await dl(file_path, writableStream);
 */
function createDownloader(token, opts = {}) {
  const apiRoot = (opts.apiRoot || 'https://api.telegram.org').replace(/\/$/, '');
  const agent = makeAgent(opts.proxy);
  const defaultTimeout = opts.downloadTimeoutMs || 60000;
  return async function download(filePath, dest, dlOpts = {}) {
    if (!filePath) throw new Error('download: file_path kosong');
    if (!dest) throw new Error('download: tujuan (path/stream) wajib');
    const fs = require('fs');
    const { pipeline } = require('stream/promises');
    // maxBytes/timeoutMs/axios dipakai sendiri; sisanya diteruskan apa adanya ke axios
    // (kompatibel dengan pemakaian lama: downloadFile(id, dest, { adapter, headers, ... })).
    const { maxBytes = Infinity, timeoutMs, axios: axiosExtra, ...axiosRest } = dlOpts;
    const url = `${apiRoot}/file/bot${token}/${String(filePath).replace(/^\//, '')}`;
    const res = await axios.get(url, {
      responseType: 'stream',
      httpsAgent: agent,
      httpAgent: keepAliveHttp,
      timeout: timeoutMs || defaultTimeout,
      maxContentLength: maxBytes,
      maxBodyLength: Infinity,
      proxy: false,
      ...axiosRest,
      ...(axiosExtra || {}),
    });
    let received = 0;
    res.data.on('data', (c) => {
      received += c.length;
      if (received > maxBytes) res.data.destroy(new Error(`download: file > ${maxBytes} byte (batas maxBytes)`));
    });
    if (typeof dest === 'string') await pipeline(res.data, fs.createWriteStream(dest));
    else await pipeline(res.data, dest);
    return dest;
  };
}

/** Rekursif: salin payload sambil mengganti File jadi "attach://fileN". */
function collectAttach(value, files) {
  if (value instanceof File) {
    const an = `file${files.length}`;
    files.push([an, value]);
    return `attach://${an}`;
  }
  if (Array.isArray(value)) return value.map((v) => collectAttach(v, files));
  if (value && typeof value === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined || v === null) continue;
      o[k] = collectAttach(v, files);
    }
    return o;
  }
  return value;
}

/** JSON.stringify yang aman terhadap File (untuk debug log). */
function safeReplacer(k, v) { return v instanceof File ? `<File:${v.filename}>` : v; }

module.exports = { createTransport, createDownloader, makeAgent, ApiError };
