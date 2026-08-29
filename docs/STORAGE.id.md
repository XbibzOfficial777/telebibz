# Panduan cepat storage (Bahasa Indonesia)

telebibz menyediakan interface `Storage<K, V>` generik dengan lima adapter. Core package **tanpa runtime dependency**: adapter Redis, SQL, dan Mongo menerima driver interface kecil yang sudah Anda punya, jadi Anda yang memilih driver dan versinya.

Semua adapter memakai kontrak yang sama — `get` / `set` / `delete` / `has` / `clear` / `keys()` / `entries()` — ditambah **`update(key, updater, { ttlMs })`** yang menyalin penulisan per key sehingga update bersamaan ke key yang sama tidak pernah saling menimpa. TTL diatur per penulisan lewat `{ ttlMs }`.

## MemoryStorage (default — tanpa konfigurasi)

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN! });
// bot.session secara default adalah MemoryStorage<string, S>.
```

## JsonFileStorage (persistensi satu file, tetap tanpa dependency)

```ts
import { Bot, JsonFileStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),
});
```

## RedisStorage (bawa client Anda sendiri)

Adapter ini hanya butuh lima method callback-style yang dimiliki setiap client Redis — `node-redis` langsung cocok:

```ts
import { Bot, RedisStorage } from "@xbibzlibrary/telebibz";
import { createClient } from "redis"; // driver dan versi pilihan Anda

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new RedisStorage(redis, "mybot:"), // prefix untuk key Anda
});
// TTL per penulisan: await bot.session.set(key, value, { ttlMs: 24 * 60 * 60 * 1000 });
// (kedaluwarsa PX Redis diterapkan otomatis.)
```

## SqlStorage (semua database SQL)

Implementasikan driver lima method di atas library SQL Anda; contoh ini memakai `better-sqlite3`:

```ts
import { Bot, SqlStorage } from "@xbibzlibrary/telebibz";
import Database from "better-sqlite3";

const db = new Database("state/bot.db");
db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER)");

const storage = new SqlStorage({
  async get(key) {
    const row = db.prepare("SELECT value, expires_at FROM kv WHERE key = ?").get(key) as { value: string; expires_at: number | null } | undefined;
    return row === undefined ? undefined : JSON.parse(row.value);
  },
  async set(key, value, expiresAt) {
    db.prepare("INSERT INTO kv (key, value, expires_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at")
      .run(key, JSON.stringify(value), expiresAt ?? null);
  },
  async delete(key) { return db.prepare("DELETE FROM kv WHERE key = ?").run(key).changes > 0; },
  async has(key) { return db.prepare("SELECT 1 FROM kv WHERE key = ?").get(key) !== undefined; },
  async clear() { db.prepare("DELETE FROM kv").run(); },
  async entries() {
    const rows = db.prepare("SELECT key, value, expires_at FROM kv").all() as Array<{ key: string; value: string; expires_at: number | null }>;
    return rows.map((row) => [row.key, JSON.parse(row.value), row.expiresAt ?? undefined] as [string, unknown, number | undefined]);
  },
});

const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN!, session: storage });
```

## MongoStorage (bawa collection Anda sendiri)

Adapter ini berbicara langsung dengan bentuk collection MongoDB standar — cukup kirim collection Anda:

```ts
import { Bot, MongoStorage } from "@xbibzlibrary/telebibz";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL!);
await client.connect();

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new MongoStorage(client.db("mybot").collection("sessions")),
});
```

## Memilih

| Adapter | Pakai saat | Persistensi | Dependency tambahan |
|---|---|---|---|
| `MemoryStorage` | bot satu proses, test | selama proses hidup | tidak ada |
| `JsonFileStorage` | bot kecil, deploy sederhana | file di disk | tidak ada |
| `RedisStorage` | multi-instance, state bersama | Redis | client Redis Anda |
| `SqlStorage` | aplikasi berbasis SQL | semua database SQL | driver SQL Anda |
| `MongoStorage` | stack Mongo yang sudah ada | MongoDB | driver Mongo Anda |

Signature API lengkap: [API.id.md](API.id.md). English: [STORAGE.md](STORAGE.md) · 简体中文: [STORAGE.zh-CN.md](STORAGE.zh-CN.md).
