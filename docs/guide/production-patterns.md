---
title: Pola operasi produksi
description: Logging, session store, limiter, shutdown, health checks, and deployment boundaries for TeleBibz.
---

# Pola operasi produksi

Halaman ini menggabungkan pola yang sudah ada di [reliability](/guide/reliability), [polling dan webhook](/guide/deployment), serta [transport/testing](/guide/transports-testing). Contohnya adalah baseline operasional, bukan angka throughput atau jaminan ketersediaan.

::: warning Batas instance
Untuk satu token, jalankan satu poller aktif kecuali Anda memakai sistem koordinasi update yang memang dirancang untuk itu. `limiter()` dan `throttler()` bawaan berlaku per proses; keduanya bukan rate limiter terdistribusi.
:::

## Pisahkan token, state, dan proses

- Simpan `BOT_TOKEN` dan `DATABASE_URL` di secret manager environment; jangan di Git, image, atau log.
- Untuk bot yang memakai `ctx.session`, gunakan storage yang persisten jika state harus bertahan saat restart. Sediakan satu key per kombinasi pengguna/chat atau skema yang sesuai kebutuhan aplikasi.
- Jangan jalankan dua long poller dengan token yang sama. Jika perlu horizontal scaling, gunakan webhook atau orkestrasi update yang eksplisit.
- Terapkan permission admin, validasi input, dan batas request pada handler sebelum melakukan side effect.

## Contoh service: error log, session adapter, retry, dan limiter

Install logger sebagai dependency langsung aplikasi, lalu isi adapter database sesuai driver yang dipakai. Tambahkan broker durable bila pekerjaan harus bertahan saat restart:

```sh
npm install @xbibzlibrary/telebibz pino
```

```js
const pino = require('pino');
const { TeleBibz, limiter, autoRetry, throttler } = require('@xbibzlibrary/telebibz');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'token', 'BOT_TOKEN'],
});
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur');

// Implementasikan kontrak ini dengan Redis/Postgres atau storage persisten lain.
const store = {
  read: (key) => database.readJson(key),
  write: (key, value) => database.writeJson(key, value),
  delete: (key) => database.delete(key),
};
const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  session: { storage: store },
  onError: (err, ctx) => logger.error({ err, updateId: ctx?.update?.update_id }, 'Update gagal'),
});

bot.api.config.use(throttler({ perSecond: 20 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({
  windowMs: 2_000,
  limit: 3,
  onExceeded: (ctx) => ctx.reply('Pelan-pelan dulu. Coba lagi sebentar.'),
}));

// Serial queue kecil untuk contoh; tetap lokal proses dan tidak durable.
let outboundTail = Promise.resolve();
function enqueueOutbound(work) {
  const job = outboundTail.then(work);
  outboundTail = job.catch((err) => logger.error({ err }, 'Outbound job gagal'));
  return job;
}
bot.cmd('status', (ctx) => enqueueOutbound(() => ctx.reply('Bot aktif.')));

async function main() {
  await bot.launch({ dropPending: false, noSignalHandlers: true });
  logger.info({ username: bot.botInfo?.username }, 'Bot berjalan');
}

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  logger.info({ signal }, 'Menghentikan bot');
  bot.stop();
  await bot.runPromise;
  await outboundTail;
  await database.close();
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => { void shutdown(signal).catch((err) => { logger.error({ err }, 'Shutdown gagal'); process.exitCode = 1; }); });
}
main().catch((err) => { logger.fatal({ err }, 'Startup gagal'); process.exitCode = 1; });
```

Ganti `database.readJson/writeJson/delete/close` dengan implementasi driver Anda. `session()` memanggil storage `read(key)`, `write(key, value)`, dan `delete(key)`; key default diturunkan dari pengguna dan chat. Queue serial contoh ini hanya membatasi satu proses dan kehilangan job saat proses berhenti—gunakan broker durable bila pekerjaan tidak boleh hilang.

Urutan transformer disengaja: `throttler()` dipasang dulu dan `autoRetry()` kemudian agar percobaan ulang juga melewati antrean. Retry otomatis hanya membantu error yang menyertakan `retry_after`; jangan mengulang side effect bisnis tanpa idempotency key.

## Observabilitas tanpa membocorkan data

Catat `update_id`, jenis handler, nama method, status, durasi, dan hasil retry yang diperlukan untuk diagnosis. Hindari mencatat token, teks pesan, file, object `ctx.update` penuh, atau payload Bot API lengkap. Pino `redact` adalah lapisan tambahan; jangan pernah memasukkan rahasia ke field log sejak awal.

`onError` menangani error di pipeline update. Bungkus panggilan API dari scheduler/worker di luar handler dengan `try/catch` terpisah. Untuk probe kesiapan, expose endpoint HTTP milik aplikasi dan laporkan status proses yang relevan; `botInfo` tersedia setelah initialization, tetapi bukan pengganti pemantauan error API.

## Session, concurrency, dan antrean

- `maxConcurrentUpdates` membatasi update aktif per instance; update dengan session key sama diproses berurutan.
- `limiter()` memakai memori lokal. Pada beberapa replica, gunakan limiter terpusat atau pembatas di gateway.
- `throttler()` mengatur request keluar per `ApiClient`; bukan kuota global semua token, IP, atau worker.
- Untuk pekerjaan lama, masukkan job dengan ID update unik ke queue durable, balas cepat bila sesuai, dan gunakan unique constraint/outbox agar replay tidak menggandakan side effect.
- Jangan membuat broadcast tanpa consent, daftar penerima yang berwenang, rate budget, dan mekanisme stop.

## Durable inbox/outbox dan idempotency

Webhook dapat dikirim ulang dan proses bisa berhenti di antara penerimaan update dan side effect. Perlakukan pekerjaan sebagai **at-least-once**: gunakan primary key `(bot_id, update_id)` untuk mencegah perubahan database ganda, lalu tulis side effect keluar ke outbox dalam transaksi yang sama.

```sql
CREATE TABLE bot_inbox (
  bot_id       text        NOT NULL,
  update_id    bigint      NOT NULL,
  payload      jsonb       NOT NULL,
  received_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (bot_id, update_id)
);

CREATE TABLE bot_outbox (
  id               bigserial   PRIMARY KEY,
  bot_id           text        NOT NULL,
  event_key        text        NOT NULL,
  method           text        NOT NULL,
  payload          jsonb       NOT NULL,
  attempts         integer     NOT NULL DEFAULT 0,
  next_attempt_at  timestamptz NOT NULL DEFAULT now(),
  lease_until      timestamptz,
  lease_token      uuid,
  delivered_at     timestamptz,
  dead_at          timestamptz,
  last_error       text,
  UNIQUE (bot_id, event_key)
);

CREATE INDEX bot_outbox_pending_idx
  ON bot_outbox (next_attempt_at, id)
  WHERE delivered_at IS NULL AND dead_at IS NULL;
```

Contoh berikut memakai `pg` dan menganggap `applyBusinessChange(client, update)` hanya mengubah database—jangan melakukan HTTP call di dalam transaksi. Tambahkan `pg` sebagai dependency langsung aplikasi.

```js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const botId = process.env.BOT_ID;

async function recordUpdateOnce(update, eventKey, apiPayload) {
  const client = await pool.connect();
  let transactionOpen = false;
  try {
    await client.query('BEGIN');
    transactionOpen = true;
    const inserted = await client.query(
      `INSERT INTO bot_inbox (bot_id, update_id, payload)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (bot_id, update_id) DO NOTHING
       RETURNING update_id`,
      [botId, update.update_id, JSON.stringify(update)],
    );
    if (inserted.rowCount === 0) {
      await client.query('ROLLBACK');
      transactionOpen = false;
      return false;
    }

    await applyBusinessChange(client, update); // app-specific DB writes only
    await client.query(
      `INSERT INTO bot_outbox (bot_id, event_key, method, payload)
       VALUES ($1, $2, 'sendMessage', $3::jsonb)
       ON CONFLICT (bot_id, event_key) DO NOTHING`,
      [botId, eventKey, JSON.stringify(apiPayload)],
    );
    await client.query('COMMIT');
    transactionOpen = false;
    return true;
  } catch (err) {
    if (transactionOpen) await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

bot.on(':text', async (ctx) => {
  await recordUpdateOnce(ctx.update, `${ctx.update.update_id}:reply`, {
    chat_id: ctx.chatId,
    text: 'Perubahan sudah dicatat.',
  });
});
```

Worker outbox mengirim `await bot.api.callApi(row.method, row.payload)`, lalu menandai row terkirim. Beberapa worker perlu mekanisme claim/lease singkat; jangan menahan transaksi database selama HTTP request. Pengiriman Telegram tetap **at-least-once**: bila API sukses tetapi penandaan `delivered_at` gagal, pesan dapat terkirim ulang. Gunakan `event_key` untuk deduplikasi internal dan buat notifikasi mudah direkonsiliasi.

## Worker outbox: lease, retry berjitter, dan dead-letter

Worker bersama dapat mengambil job secara aman dengan `SKIP LOCKED`, tetapi tetap harus membatasi budget per bot dan per chat. Tambahkan kolom lease/dead-letter pada DDL outbox di atas. Claim adalah satu statement atomik; HTTP request Telegram dijalankan sesudahnya, di luar transaksi.

```sql
WITH ready AS (
  SELECT id
  FROM bot_outbox
  WHERE bot_id = $1
    AND delivered_at IS NULL
    AND dead_at IS NULL
    AND next_attempt_at <= now()
    AND (lease_until IS NULL OR lease_until < now())
  ORDER BY next_attempt_at, id
  LIMIT $2
  FOR UPDATE SKIP LOCKED
)
UPDATE bot_outbox AS job
SET attempts = job.attempts + 1,
    lease_until = now() + interval '45 seconds',
    lease_token = $3::uuid
FROM ready
WHERE job.id = ready.id
RETURNING job.*;
```

Simpan SQL claim di atas sebagai konstanta `CLAIM_BOT_OUTBOX_SQL` untuk helper JavaScript berikut. Gunakan UUID baru sebagai `$3` untuk setiap batch. Sesuaikan lease dengan timeout API dan perpanjang untuk operasi lama. `bot_id` membatasi worker pada token yang benar; untuk menjaga urutan, partisi job menurut `chat_id` dan hanya proses satu job per partisi sekaligus.

```js
const { randomUUID } = require('node:crypto');
const MAX_ATTEMPTS = 8;
const backoffMs = (attempt) => Math.floor(
  Math.random() * Math.min(5 * 60 * 1000, 1000 * 2 ** Math.min(attempt, 8)),
);

async function claimBotOutbox(botId, limit = 20) {
  const leaseToken = randomUUID();
  const { rows } = await pool.query(CLAIM_BOT_OUTBOX_SQL, [botId, limit, leaseToken]);
  return rows;
}

async function deliverTelegramJob(job) {
  try {
    await bot.api.callApi(job.method, job.payload);
    const ack = await pool.query(
      `UPDATE bot_outbox
       SET delivered_at = now(), lease_until = NULL, lease_token = NULL, last_error = NULL
       WHERE id = $1 AND bot_id = $2 AND lease_token = $3
       RETURNING id`,
      [job.id, job.bot_id, job.lease_token],
    );
    if (!ack.rowCount) logger.warn({ jobId: job.id }, 'Lease changed after send; reconcile the result');
  } catch (err) {
    const retryAfter = Number(err?.parameters?.retry_after || 0);
    const retryable = retryAfter > 0 || Number(err?.error_code) >= 500
      || ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(err?.code);
    const dead = !retryable || job.attempts >= MAX_ATTEMPTS;
    const delayMs = dead ? 0 : Math.max(retryAfter * 1000, backoffMs(job.attempts));
    const saved = await pool.query(
      `UPDATE bot_outbox
       SET next_attempt_at = now() + ($4::double precision * interval '1 millisecond'),
           lease_until = NULL, lease_token = NULL, last_error = $5,
           dead_at = CASE WHEN $3::boolean THEN now() ELSE NULL END
       WHERE id = $1 AND bot_id = $2 AND lease_token = $6
       RETURNING id`,
      [job.id, job.bot_id, dead, delayMs, safeTelegramErrorCode(err), job.lease_token],
    );
    if (!saved.rowCount) logger.warn({ jobId: job.id }, 'Lease changed; stale worker did not overwrite the new claim');
  }
}
```

`retry_after` dari Telegram lebih kuat daripada backoff lokal; gunakan juga limiter terdistribusi (misalnya Redis token bucket) karena `throttler()` bawaan hanya membatasi satu `ApiClient`. Sediakan `safeTelegramErrorCode(err)` yang hanya menyimpan kode error allowlist/network, bukan body atau pesan mentah. Error permanen masuk dead-letter untuk rekonsiliasi operator. Jika Telegram menerima request tetapi respons hilang atau update `delivered_at` gagal, job bisa dikirim ulang: desain ini **at-least-once**, bukan exactly-once. Jangan menyimpan body error mentah jika dapat berisi data sensitif.

## Topologi multi-replica dan kepemilikan update

| Jenis proses | Pola skala | State dan koordinasi yang diperlukan |
| --- | --- | --- |
| Long poller | Satu pemilik aktif per token; mulai dari `replicas: 1`. | Failover memerlukan leader lease dan fencing token, atau pergantian proses yang dikendalikan orchestrator. Jangan biarkan dua poller overlap. |
| Webhook ingress | Beberapa replica stateless di belakang HTTPS load balancer. | Database/session store bersama, inbox idempotent, dan secret header yang sama-sama tervalidasi. Telegram dapat mengulang delivery. |
| Outbox/queue worker | Tambah consumer sesuai kedalaman antrean dan kebutuhan throughput. | Broker/claim terdistribusi, retry budget, rate limit bersama, serta urutan per chat bila produk membutuhkannya. |

Serialisasi session TeleBibz dan `limiter()` berlaku per instance. Beberapa webhook replica dapat menerima update dengan session key sama secara bersamaan; gunakan lock/distributed session store atau sharding per key bila read-modify-write harus berurutan. `throttler()` juga lokal pada `ApiClient`, jadi gunakan budget terpusat untuk membatasi beberapa worker pada satu token/chat.

## Health probe, drain, dan runbook

Pisahkan **liveness** (proses dapat merespons) dari **readiness** (proses sudah diinisialisasi, tidak sedang drain, dan dependency minimum siap). Jangan jadikan liveness bergantung pada Telegram API; gangguan upstream sementara tidak semestinya merestart seluruh replica.

```js
const http = require('node:http');
let draining = false;
const healthServer = http.createServer(async (req, res) => {
  if (req.url === '/livez') return res.writeHead(200).end('ok');
  if (req.url !== '/readyz') return res.writeHead(404).end();

  let databaseReady = false;
  try { await database.ping(); databaseReady = true; } catch {}
  const ready = !draining && Boolean(bot.botInfo) && databaseReady;
  res.writeHead(ready ? 200 : 503, { 'content-type': 'text/plain' });
  res.end(ready ? 'ready' : 'not ready');
});
healthServer.listen(process.env.HEALTH_PORT || 8080, '0.0.0.0');
```

`database.ping()` di atas mewakili probe ber-timeout milik driver. Saat menerima `SIGTERM`, set `draining = true`, hentikan penerimaan update baru pada ingress, tunggu handler/outbox yang sudah diterima, panggil `bot.stop()` untuk poller, lalu tutup pool. Pertahankan `dropPending: false` saat shutdown/deploy normal.

Checklist operasi:

- **Deploy:** poller satu token satu per satu; pada webhook, mulai dengan canary dan pastikan secret header serta body limit benar.
- **Pantau:** `pending_update_count`/umur update tertua, kedalaman dan umur antrean, p95 handler, latensi session store, error API, HTTP 429 `retry_after`, konflik polling 409, serta kegagalan outbox.
- **Pulihkan:** verifikasi backup database dan uji restore; setelah failover, pastikan hanya satu poller memegang lease/fencing token sebelum worker lama kembali.
- **Perubahan rahasia:** rotasi token/secret lewat mekanisme resmi, perbarui secret manager, lalu verifikasi `getMe()` dan `getWebhookInfo()` tanpa mencetak nilai rahasia.

::: details Dockerfile minimal untuk long polling
```dockerfile
FROM node:22-bookworm-slim
WORKDIR /srv/bot
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "index.js"]
```

Gunakan image non-root dan runtime secret injection. Untuk session file, mount volume persisten terpisah dengan permission terbatas; untuk database session, jangan menaruh dump/credentials pada layer image. Compose/hosting tetap perlu mengatur satu worker polling per token.
:::

Untuk HTTPS webhook, reverse proxy, secret header, dan perpindahan dari polling, ikuti [panduan deployment](/guide/deployment). Untuk rate limits, 409/429, dan error umum, lihat [reliability](/guide/reliability).
