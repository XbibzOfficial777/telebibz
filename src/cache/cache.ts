import { MemoryStorage, type Storage } from "../storage/storage.js";

export interface Cache<K = string, V = unknown> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V, ttlMs?: number): Promise<void>;
  delete(key: K): Promise<boolean>;
  invalidate(prefix?: string): Promise<void>;
  getOrSet(key: K, factory: () => V | Promise<V>, ttlMs?: number): Promise<V>;
}

export class MemoryCache<V = unknown> implements Cache<string, V> {
  private readonly namespace: string;
  constructor(namespace = "telebibz", private readonly storage: Storage<string, V> = new MemoryStorage<string, V>()) { this.namespace = namespace; }
  private key(key: string): string { return `${this.namespace}:${key}`; }
  get(key: string): Promise<V | undefined> { return this.storage.get(this.key(key)); }
  set(key: string, value: V, ttlMs?: number): Promise<void> { return this.storage.set(this.key(key), value, ttlMs === undefined ? {} : { ttlMs }); }
  delete(key: string): Promise<boolean> { return this.storage.delete(this.key(key)); }
  async invalidate(prefix = ""): Promise<void> { const keys: string[] = []; for await (const key of this.storage.keys()) if (key.startsWith(this.key(prefix))) keys.push(key); for (const key of keys) await this.storage.delete(key); }
  async getOrSet(key: string, factory: () => V | Promise<V>, ttlMs?: number): Promise<V> { const existing = await this.get(key); if (existing !== undefined) return existing; const value = await factory(); await this.set(key, value, ttlMs); return value; }
}

export interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; retryAfterMs?: number }
export class TokenBucketLimiter {
  private readonly buckets = new Map<string, { tokens: number; updatedAt: number }>();
  constructor(private readonly capacity: number, private readonly refillPerSecond: number) { if (capacity <= 0 || refillPerSecond <= 0) throw new RangeError("capacity and refillPerSecond must be positive"); }
  consume(key: string, cost = 1): RateLimitResult { if (!Number.isFinite(cost) || cost <= 0) throw new RangeError("cost must be positive"); const now = Date.now(); const current = this.buckets.get(key) ?? { tokens: this.capacity, updatedAt: now }; const elapsedSeconds = (now - current.updatedAt) / 1000; current.tokens = Math.min(this.capacity, current.tokens + elapsedSeconds * this.refillPerSecond); current.updatedAt = now; if (current.tokens < cost) { const retryAfterMs = Math.ceil(((cost - current.tokens) / this.refillPerSecond) * 1000); this.buckets.set(key, current); return { allowed: false, remaining: Math.floor(current.tokens), resetAt: now + retryAfterMs, retryAfterMs }; } current.tokens -= cost; this.buckets.set(key, current); return { allowed: true, remaining: Math.floor(current.tokens), resetAt: now + Math.ceil(((this.capacity - current.tokens) / this.refillPerSecond) * 1000) }; }
  clear(key?: string): void { if (key === undefined) this.buckets.clear(); else this.buckets.delete(key); }
}
