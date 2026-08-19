export interface Job<T = unknown> { id: string; data: T; attempts: number; priority: number; runAt: number; status: "queued" | "running" | "completed" | "failed" | "cancelled"; error?: unknown }
export interface QueueOptions { concurrency?: number; retries?: number; backoffMs?: number; maxBackoffMs?: number }

type Worker<T> = (job: Job<T>, signal: AbortSignal) => Promise<void>;
export class TaskQueue<T = unknown> {
  private readonly pending: Job<T>[] = [];
  private readonly jobs = new Map<string, Job<T>>();
  private readonly controllers = new Map<string, AbortController>();
  private active = 0;
  private sequence = 0;
  private draining = false;
  constructor(private readonly worker: Worker<T>, private readonly options: QueueOptions = {}) {}
  add(data: T, options: { id?: string; priority?: number; delayMs?: number } = {}): Job<T> { const id = options.id ?? `job_${Date.now()}_${this.sequence++}`; if (this.jobs.has(id)) throw new Error(`Job already exists: ${id}`); const job: Job<T> = { id, data, attempts: 0, priority: options.priority ?? 0, runAt: Date.now() + (options.delayMs ?? 0), status: "queued" }; this.jobs.set(id, job); this.pending.push(job); this.pending.sort((a, b) => b.priority - a.priority || a.runAt - b.runAt); void this.drain(); return { ...job }; }
  get(id: string): Job<T> | undefined { const job = this.jobs.get(id); return job ? { ...job } : undefined; }
  cancel(id: string): boolean { const job = this.jobs.get(id); if (!job || ["completed", "failed", "cancelled"].includes(job.status)) return false; job.status = "cancelled"; this.controllers.get(id)?.abort(); return true; }
  async onIdle(): Promise<void> { while (this.pending.length || this.active) await new Promise((resolve) => setTimeout(resolve, 10)); }
  async close(): Promise<void> { this.draining = false; for (const id of this.controllers.keys()) this.cancel(id); }
  private async drain(): Promise<void> { if (this.draining) return; this.draining = true; try { while (this.pending.length && this.active < (this.options.concurrency ?? 1)) { const index = this.pending.findIndex((job) => job.runAt <= Date.now() && job.status === "queued"); if (index < 0) { const wait = Math.max(1, Math.min(...this.pending.map((job) => job.runAt - Date.now()))); await new Promise((resolve) => setTimeout(resolve, wait)); continue; } const [job] = this.pending.splice(index, 1); if (!job) continue; this.active += 1; void this.run(job).finally(() => { this.active -= 1; void this.drain(); }); } } finally { this.draining = false; } }
  private async run(job: Job<T>): Promise<void> { const maxAttempts = this.options.retries ?? 0; const controller = new AbortController(); this.controllers.set(job.id, controller); try { while (job.attempts <= maxAttempts && job.status !== "cancelled") { job.status = "running"; job.attempts += 1; try { await this.worker(job, controller.signal); job.status = "completed"; return; } catch (error) { job.error = error; if (job.attempts > maxAttempts) { job.status = "failed"; return; } const delay = Math.min(this.options.maxBackoffMs ?? 30_000, (this.options.backoffMs ?? 250) * 2 ** (job.attempts - 1)); await new Promise((resolve) => setTimeout(resolve, delay)); } } } finally { this.controllers.delete(job.id); } }
}

export interface ScheduledJob { id: string; cancel: () => void }
export class Scheduler {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>();
  every(id: string, intervalMs: number, task: () => void | Promise<void>): ScheduledJob { if (intervalMs <= 0) throw new RangeError("intervalMs must be positive"); this.cancel(id); const timer = setInterval(() => { void task(); }, intervalMs); this.timers.set(id, timer); return { id, cancel: () => this.cancel(id) }; }
  after(id: string, delayMs: number, task: () => void | Promise<void>): ScheduledJob { this.cancel(id); const timer = setTimeout(() => { this.timers.delete(id); void task(); }, delayMs); this.timers.set(id, timer); return { id, cancel: () => this.cancel(id) }; }
  cron(id: string, expression: string, task: () => void | Promise<void>): ScheduledJob { const interval = parseSimpleCronInterval(expression); return this.every(id, interval, task); }
  cancel(id: string): boolean { const timer = this.timers.get(id); if (!timer) return false; clearTimeout(timer); clearInterval(timer); this.timers.delete(id); return true; }
  clear(): void { for (const id of [...this.timers.keys()]) this.cancel(id); }
}
function parseSimpleCronInterval(expression: string): number { const minute = expression.trim().split(/\s+/)[0]; if (minute?.startsWith("*/")) { const value = Number(minute.slice(2)); if (Number.isInteger(value) && value > 0) return value * 60_000; } throw new Error("Only interval cron expressions such as */5 are supported by the built-in scheduler; use an adapter for full cron syntax."); }
