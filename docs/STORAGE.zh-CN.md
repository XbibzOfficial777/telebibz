# 存储快速上手（简体中文）

telebibz 提供一个通用的 `Storage<K, V>` 接口和五个适配器。核心包**零运行时依赖**：Redis、SQL 和 Mongo 适配器只要求一个你已经拥有的小型 driver interface，由你自己选择驱动和版本。

所有适配器共享同一契约 —— `get` / `set` / `delete` / `has` / `clear` / `keys()` / `entries()` —— 以及 **`update(key, updater, { ttlMs })`**，它按 key 串行化写入，因此对同一 key 的并发更新永远不会交错。TTL 通过 `{ ttlMs }` 按每次写入设置。

## MemoryStorage（默认 —— 无需配置）

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const bot = new Bot({ token: process.env.TELEGRAM_BOT_TOKEN! });
// bot.session 默认就是 MemoryStorage<string, S>。
```

## JsonFileStorage（单文件持久化，依然零依赖）

```ts
import { Bot, JsonFileStorage } from "@xbibzlibrary/telebibz";

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new JsonFileStorage("state/sessions.json"),
});
```

## RedisStorage（自带客户端）

适配器只需要每个 Redis 客户端都有的五个回调式方法 —— `node-redis` 可以直接使用：

```ts
import { Bot, RedisStorage } from "@xbibzlibrary/telebibz";
import { createClient } from "redis"; // 由你选择驱动和版本

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const bot = new Bot({
  token: process.env.TELEGRAM_BOT_TOKEN!,
  session: new RedisStorage(redis, "mybot:"), // 你的 key 前缀
});
// 按次写入的 TTL：await bot.session.set(key, value, { ttlMs: 24 * 60 * 60 * 1000 });
// （Redis PX 过期会自动应用。）
```

## SqlStorage（任意 SQL 数据库）

在你的 SQL 库之上实现这五个方法的 driver；示例使用 `better-sqlite3`：

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

## MongoStorage（自带 collection）

适配器直接对接标准 MongoDB collection 形状 —— 直接传入你的 collection：

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

## 如何选择

| 适配器 | 适用场景 | 持久化 | 额外依赖 |
|---|---|---|---|
| `MemoryStorage` | 单进程 bot、测试 | 进程生命周期 | 无 |
| `JsonFileStorage` | 小型 bot、简单部署 | 磁盘文件 | 无 |
| `RedisStorage` | 多实例、共享状态 | Redis | 你的 Redis 客户端 |
| `SqlStorage` | 基于 SQL 的应用 | 任意 SQL 数据库 | 你的 SQL 驱动 |
| `MongoStorage` | 已有 Mongo 技术栈 | MongoDB | 你的 Mongo 驱动 |

完整 API 签名：[API.zh-CN.md](API.zh-CN.md)。English: [STORAGE.md](STORAGE.md) · Bahasa Indonesia: [STORAGE.id.md](STORAGE.id.md)。
