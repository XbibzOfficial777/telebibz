/**
 * Minimal concurrency primitives with zero dependencies.
 *
 * These helpers never add proactive delays: they only cap how many async tasks
 * run at the same time. `Infinity` means fully parallel execution.
 */

export function validateConcurrency(value: number, label = "concurrency"): void {
  if (value === Infinity) return;
  if (!Number.isInteger(value) || value < 1) throw new RangeError(`${label} must be a positive integer or Infinity`);
}

/** Promise semaphore: runs tasks immediately while a slot is free, queues the rest in FIFO order. */
export class Limiter {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(readonly limit: number) {
    validateConcurrency(limit);
  }

  /** Number of tasks currently running. */
  get activeCount(): number { return this.active; }
  /** Number of tasks waiting for a free slot. */
  get queuedCount(): number { return this.waiters.length; }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.limit) await new Promise<void>((resolve) => { this.waiters.push(resolve); });
    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
      this.waiters.shift()?.();
    }
  }
}

/**
 * Maps items through an async worker with a concurrency cap.
 * Results keep the input order; `Infinity` runs everything in parallel.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  validateConcurrency(limit);
  const results = new Array<R>(items.length);
  const limiter = new Limiter(limit);
  await Promise.all(items.map((item, index) => limiter.run(async () => {
    results[index] = await worker(item, index);
  })));
  return results;
}
