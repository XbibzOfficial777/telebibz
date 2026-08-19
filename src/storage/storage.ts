export interface Storage<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, options?: { ttlMs?: number }): Promise<void>;
  delete(key: K): Promise<boolean>;
  has(key: K): Promise<boolean>;
  clear(): Promise<void>;
  keys(): AsyncIterable<K>;
  values(): AsyncIterable<V>;
  entries(): AsyncIterable<[K, V]>;
  update<T extends V>(key: K, updater: (current: V | undefined) => V | Promise<V>, options?: { ttlMs?: number }): Promise<V>;
}

type Entry<V> = { value: V; expiresAt?: number };

export class MemoryStorage<K, V> implements Storage<K, V> {
  private readonly valuesMap = new Map<K, Entry<V>>();
  private readonly locks = new Map<K, Promise<void>>();

  async get(key: K): Promise<V | undefined> {
    const entry = this.valuesMap.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) { this.valuesMap.delete(key); return undefined; }
    return entry.value;
  }

  async set(key: K, value: V, options: { ttlMs?: number } = {}): Promise<void> {
    const entry: Entry<V> = { value };
    if (options.ttlMs !== undefined) entry.expiresAt = Date.now() + options.ttlMs;
    this.valuesMap.set(key, entry);
  }

  async delete(key: K): Promise<boolean> { return this.valuesMap.delete(key); }
  async has(key: K): Promise<boolean> { return (await this.get(key)) !== undefined; }
  async clear(): Promise<void> { this.valuesMap.clear(); }

  async *keys(): AsyncIterable<K> { for (const key of this.valuesMap.keys()) if (await this.has(key)) yield key; }
  async *values(): AsyncIterable<V> { for await (const [, value] of this.entries()) yield value; }
  async *entries(): AsyncIterable<[K, V]> { for (const key of this.valuesMap.keys()) { const value = await this.get(key); if (value !== undefined) yield [key, value]; } }

  async update<T extends V>(key: K, updater: (current: V | undefined) => T | Promise<T>, options: { ttlMs?: number } = {}): Promise<T> {
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
