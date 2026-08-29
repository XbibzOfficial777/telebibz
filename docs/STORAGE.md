# Storage quick start (English)

telebibz ships a generic `Storage<K, V>` interface with five adapters. The core package has **zero runtime dependencies**: the Redis, SQL, and Mongo adapters accept a small driver interface you already have, so you pick the driver and version.

All adapters share one contract — `get` / `set` / `delete` / `has` / `clear` / `keys()` / `entries()` — plus **`update(key, updater, { ttlMs })`**, which serializes writes per key so concurrent updates to the same key never interleave. TTL is set per write through `{ ttlMs }`.

## MemoryStorage (default — nothing to configure)

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN! });
// bot.session is a MemoryStorage<string, S> by default.
```

## JsonFileStorage (single-file persistence, still zero dependencies)

```ts
import { Bot, JsonFileStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),
});
```

## RedisStorage (bring your own client)

The adapter needs exactly the five callback-style methods every Redis client exposes — `node-redis` works as-is:

```ts
import { Bot, RedisStorage } from "@xbibzlibrary/telebibz";
import { createClient } from "redis"; // your choice of driver and version

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new RedisStorage(redis, "mybot:"), // prefix for your keys
});
// Per-write TTL: await bot.session.set(key, value, { ttlMs: 24 * 60 * 60 * 1000 });
// (Redis PX expiry is applied automatically.)
```

## SqlStorage (any SQL database)

Implement the five-method driver over your SQL library; the example uses `better-sqlite3`:

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

## MongoStorage (bring your own collection)

The adapter talks to a standard MongoDB collection shape — pass your collection directly:

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

## Choosing

| Adapter | Use when | Persistence | Extra dependency |
|---|---|---|---|
| `MemoryStorage` | single-process bots, tests | process lifetime | none |
| `JsonFileStorage` | small bots, simple deploys | file on disk | none |
| `RedisStorage` | multi-instance, shared state | Redis | your Redis client |
| `SqlStorage` | SQL-backed apps | any SQL database | your SQL driver |
| `MongoStorage` | existing Mongo stack | MongoDB | your Mongo driver |

Full API signatures: [API.md](API.md). Bahasa Indonesia: [STORAGE.id.md](STORAGE.id.md) · 简体中文: [STORAGE.zh-CN.md](STORAGE.zh-CN.md).
