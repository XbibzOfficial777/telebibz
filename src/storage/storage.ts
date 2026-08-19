import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface StorageOptions { ttlMs?: number }

export interface Storage<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, options?: StorageOptions): Promise<void>;
  delete(key: K): Promise<boolean>;
  has(key: K): Promise<boolean>;
  clear(): Promise<void>;
  keys(): AsyncIterable<K>;
  values(): AsyncIterable<V>;
  entries(): AsyncIterable<[K, V]>;
  update<T extends V>(key: K, updater: (current: V | undefined) => T | Promise<T>, options?: StorageOptions): Promise<T>;
}

type Entry<V> = { value: V; expiresAt?: number };

function expiration(ttlMs: number | undefined): number | undefined {
  if (ttlMs === undefined) return undefined;
  if (!Number.isFinite(ttlMs) || ttlMs < 0) throw new RangeError("ttlMs must be a finite non-negative number");
  return Date.now() + ttlMs;
}

export class MemoryStorage<K, V> implements Storage<K, V> {
  private readonly valuesMap = new Map<K, Entry<V>>();
  private readonly locks = new Map<K, Promise<void>>();

  async get(key: K): Promise<V | undefined> {
    const entry = this.valuesMap.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) { this.valuesMap.delete(key); return undefined; }
    return entry.value;
  }

  async set(key: K, value: V, options: StorageOptions = {}): Promise<void> {
    const expiresAt = expiration(options.ttlMs);
    this.valuesMap.set(key, expiresAt === undefined ? { value } : { value, expiresAt });
  }

  async delete(key: K): Promise<boolean> { return this.valuesMap.delete(key); }
  async has(key: K): Promise<boolean> { return (await this.get(key)) !== undefined; }
  async clear(): Promise<void> { this.valuesMap.clear(); }

  async *keys(): AsyncIterable<K> { for (const key of this.valuesMap.keys()) if (await this.has(key)) yield key; }
  async *values(): AsyncIterable<V> { for await (const [, value] of this.entries()) yield value; }
  async *entries(): AsyncIterable<[K, V]> { for (const key of this.valuesMap.keys()) { const value = await this.get(key); if (value !== undefined) yield [key, value]; } }

  async update<T extends V>(key: K, updater: (current: V | undefined) => T | Promise<T>, options: StorageOptions = {}): Promise<T> {
    const previous = this.locks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const currentLock = new Promise<void>((resolve) => { release = resolve; });
    this.locks.set(key, currentLock);
    await previous;
    try {
      const value = await updater(await this.get(key));
      await this.set(key, value, options);
      return value;
    } finally {
      release();
      if (this.locks.get(key) === currentLock) this.locks.delete(key);
    }
  }
}

export class JsonFileStorage<V> implements Storage<string, V> {
  private readonly memory = new MemoryStorage<string, V>();
  private readonly ready: Promise<void>;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(readonly filePath: string) {
    this.ready = this.load();
  }

  private async load(): Promise<void> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      const values = JSON.parse(raw) as Record<string, Entry<V>>;
      for (const [key, entry] of Object.entries(values)) await this.memory.set(key, entry.value, entry.expiresAt === undefined ? {} : { ttlMs: Math.max(0, entry.expiresAt - Date.now()) });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  private async persist(): Promise<void> {
    await this.ready;
    this.writeChain = this.writeChain.then(async () => {
      const output: Record<string, Entry<V>> = {};
      for await (const [key, value] of this.memory.entries()) output[key] = { value };
      await mkdir(dirname(this.filePath), { recursive: true });
      const temporary = `${this.filePath}.${process.pid}.tmp`;
      await writeFile(temporary, JSON.stringify(output, null, 2), "utf8");
      await rename(temporary, this.filePath);
    });
    await this.writeChain;
  }

  async get(key: string): Promise<V | undefined> { await this.ready; return this.memory.get(key); }
  async set(key: string, value: V, options?: StorageOptions): Promise<void> { await this.ready; await this.memory.set(key, value, options); await this.persist(); }
  async delete(key: string): Promise<boolean> { await this.ready; const deleted = await this.memory.delete(key); if (deleted) await this.persist(); return deleted; }
  async has(key: string): Promise<boolean> { await this.ready; return this.memory.has(key); }
  async clear(): Promise<void> { await this.ready; await this.memory.clear(); await this.persist(); }
  async *keys(): AsyncIterable<string> { await this.ready; yield* this.memory.keys(); }
  async *values(): AsyncIterable<V> { await this.ready; yield* this.memory.values(); }
  async *entries(): AsyncIterable<[string, V]> { await this.ready; yield* this.memory.entries(); }
  async update<T extends V>(key: string, updater: (current: V | undefined) => T | Promise<T>, options?: StorageOptions): Promise<T> { await this.ready; const result = await this.memory.update(key, updater, options); await this.persist(); return result; }
}

export interface RedisLikeClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number; PX?: number }): Promise<unknown>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
}

export class RedisStorage<V> implements Storage<string, V> {
  constructor(private readonly client: RedisLikeClient, private readonly prefix = "telebibz:") {}
  private key(key: string): string { return `${this.prefix}${key}`; }
  private unkey(key: string): string { return key.slice(this.prefix.length); }
  async get(key: string): Promise<V | undefined> { const value = await this.client.get(this.key(key)); return value === null ? undefined : JSON.parse(value) as V; }
  async set(key: string, value: V, options: StorageOptions = {}): Promise<void> { const ttl = options.ttlMs; const redisOptions = ttl === undefined ? {} : ttl >= 1000 ? { PX: Math.max(1, Math.floor(ttl)) } : { PX: Math.max(1, Math.floor(ttl)) }; await this.client.set(this.key(key), JSON.stringify(value), redisOptions); }
  async delete(key: string): Promise<boolean> { return (await this.client.del(this.key(key))) > 0; }
  async has(key: string): Promise<boolean> { return (await this.client.exists(this.key(key))) > 0; }
  async clear(): Promise<void> { const keys = await this.client.keys(`${this.prefix}*`); if (keys.length) await Promise.all(keys.map((key) => this.client.del(key))); }
  async *keys(): AsyncIterable<string> { for (const key of await this.client.keys(`${this.prefix}*`)) yield this.unkey(key); }
  async *values(): AsyncIterable<V> { for await (const [, value] of this.entries()) yield value; }
  async *entries(): AsyncIterable<[string, V]> { for await (const key of this.keys()) { const value = await this.get(key); if (value !== undefined) yield [key, value]; } }
  async update<T extends V>(key: string, updater: (current: V | undefined) => T | Promise<T>, options?: StorageOptions): Promise<T> { const value = await updater(await this.get(key)); await this.set(key, value, options); return value; }
}

export interface SqlStorageDriver<V> {
  get(key: string): Promise<V | undefined>;
  set(key: string, value: V, expiresAt?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  entries(): Promise<Array<[string, V, number | undefined]>>;
}

export class SqlStorage<V> implements Storage<string, V> {
  constructor(private readonly driver: SqlStorageDriver<V>) {}
  async get(key: string): Promise<V | undefined> { return this.driver.get(key); }
  async set(key: string, value: V, options: StorageOptions = {}): Promise<void> { await this.driver.set(key, value, expiration(options.ttlMs)); }
  async delete(key: string): Promise<boolean> { return this.driver.delete(key); }
  async has(key: string): Promise<boolean> { return this.driver.has(key); }
  async clear(): Promise<void> { return this.driver.clear(); }
  async *keys(): AsyncIterable<string> { for (const [key] of await this.driver.entries()) yield key; }
  async *values(): AsyncIterable<V> { for (const [, value] of await this.driver.entries()) yield value; }
  async *entries(): AsyncIterable<[string, V]> { for (const [key, value, expiresAt] of await this.driver.entries()) { if (expiresAt !== undefined && expiresAt <= Date.now()) { await this.driver.delete(key); continue; } yield [key, value]; } }
  async update<T extends V>(key: string, updater: (current: V | undefined) => T | Promise<T>, options?: StorageOptions): Promise<T> { const value = await updater(await this.get(key)); await this.set(key, value, options); return value; }
}

export interface MongoStorageCollection<V> {
  findOne(filter: { key: string }): Promise<{ value: V; expiresAt?: number } | null>;
  replaceOne(filter: { key: string }, document: { key: string; value: V; expiresAt?: number }, options?: { upsert?: boolean }): Promise<unknown>;
  deleteOne(filter: { key: string }): Promise<{ deletedCount?: number }>;
  deleteMany(filter: Record<string, unknown>): Promise<unknown>;
  find(filter?: Record<string, unknown>): { toArray(): Promise<Array<{ key: string; value: V; expiresAt?: number }>> };
}

export class MongoStorage<V> implements Storage<string, V> {
  constructor(private readonly collection: MongoStorageCollection<V>) {}
  async get(key: string): Promise<V | undefined> { const document = await this.collection.findOne({ key }); if (!document || (document.expiresAt !== undefined && document.expiresAt <= Date.now())) return undefined; return document.value; }
  async set(key: string, value: V, options: StorageOptions = {}): Promise<void> {
    const expiresAt = expiration(options.ttlMs);
    const document = expiresAt === undefined ? { key, value } : { key, value, expiresAt };
    await this.collection.replaceOne({ key }, document, { upsert: true });
  }
  async delete(key: string): Promise<boolean> { return (await this.collection.deleteOne({ key })).deletedCount === 1; }
  async has(key: string): Promise<boolean> { return (await this.get(key)) !== undefined; }
  async clear(): Promise<void> { await this.collection.deleteMany({}); }
  async *keys(): AsyncIterable<string> { for (const document of await this.collection.find({}).toArray()) if (document.expiresAt === undefined || document.expiresAt > Date.now()) yield document.key; }
  async *values(): AsyncIterable<V> { for await (const [, value] of this.entries()) yield value; }
  async *entries(): AsyncIterable<[string, V]> { for (const document of await this.collection.find({}).toArray()) if (document.expiresAt === undefined || document.expiresAt > Date.now()) yield [document.key, document.value]; }
  async update<T extends V>(key: string, updater: (current: V | undefined) => T | Promise<T>, options?: StorageOptions): Promise<T> { const value = await updater(await this.get(key)); await this.set(key, value, options); return value; }
}
