export interface Job<T = unknown> { id: string; data: T; attempts: number; priority: number; runAt: number; status: "queued" | "running" | "completed" | "failed" | "cancelled"; error?: unknown }
export interface QueueOptions { concurrency?: number; retries?: number; backoffMs?: number; maxBackoffMs?: number; onError?: (error: unknown, job: Job) => void | Promise<void> }

type Worker<T> = (job: Job<T>, signal: AbortSignal) => Promise<void>;

function sleep(delayMs: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, delayMs)); }

export class TaskQueue<T = unknown> {
  private readonly pending: Job<T>[] = [];
  private readonly jobs = new Map<string, Job<T>>();
  private readonly controllers = new Map<string, AbortController>();
  private active = 0;
  private sequence = 0;
  private draining = false;
  private closed = false;

  constructor(private readonly worker: Worker<T>, private readonly options: QueueOptions = {}) {
    if ((options.concurrency ?? 1) < 1 || !Number.isInteger(options.concurrency ?? 1)) throw new RangeError("concurrency must be a positive integer");
    if ((options.retries ?? 0) < 0 || !Number.isInteger(options.retries ?? 0)) throw new RangeError("retries must be a non-negative integer");
  }

  add(data: T, options: { id?: string; priority?: number; delayMs?: number } = {}): Job<T> {
    if (this.closed) throw new Error("TaskQueue is closed");
    const id = options.id ?? `job_${Date.now()}_${this.sequence++}`;
    if (this.jobs.has(id)) throw new Error(`Job already exists: ${id}`);
    if (options.delayMs !== undefined && options.delayMs < 0) throw new RangeError("delayMs must be non-negative");
    const job: Job<T> = { id, data, attempts: 0, priority: options.priority ?? 0, runAt: Date.now() + (options.delayMs ?? 0), status: "queued" };
    this.jobs.set(id, job);
    this.pending.push(job);
    this.pending.sort((a, b) => b.priority - a.priority || a.runAt - b.runAt);
    void this.drain();
    return { ...job };
  }

  get(id: string): Job<T> | undefined { const job = this.jobs.get(id); return job ? { ...job } : undefined; }
  cancel(id: string): boolean { const job = this.jobs.get(id); if (!job || ["completed", "failed", "cancelled"].includes(job.status)) return false; job.status = "cancelled"; this.controllers.get(id)?.abort(); return true; }
  async onIdle(): Promise<void> { while (this.pending.some((job) => job.status === "queued") || this.active) await sleep(10); }
  async close(): Promise<void> {
    this.closed = true;
    this.draining = false;
    for (const id of this.controllers.keys()) this.cancel(id);
    for (const job of this.pending) if (job.status === "queued") job.status = "cancelled";
    this.pending.length = 0;
    await this.onIdle();
  }

  private async drain(): Promise<void> {
    if (this.draining || this.closed) return;
    this.draining = true;
    try {
      while (!this.closed && this.pending.some((job) => job.status === "queued") && this.active < (this.options.concurrency ?? 1)) {
        const index = this.pending.findIndex((job) => job.runAt <= Date.now() && job.status === "queued");
        if (index < 0) {
          const next = Math.min(...this.pending.filter((job) => job.status === "queued").map((job) => job.runAt));
          await sleep(Math.max(1, next - Date.now()));
          continue;
        }
        const [job] = this.pending.splice(index, 1);
        if (!job) continue;
        this.active += 1;
        void this.run(job).finally(() => { this.active -= 1; void this.drain(); });
      }
    } finally { this.draining = false; }
  }

  private async run(job: Job<T>): Promise<void> {
    const maxAttempts = this.options.retries ?? 0;
    const controller = new AbortController();
    this.controllers.set(job.id, controller);
    try {
      while (job.attempts <= maxAttempts && job.status !== "cancelled") {
        job.status = "running";
        job.attempts += 1;
        try {
          await this.worker(job, controller.signal);
          job.status = "completed";
          return;
        } catch (error) {
          job.error = error;
          const wasCancelled = (job.status as Job<T>["status"]) === "cancelled";
          if (job.attempts > maxAttempts || wasCancelled) {
            job.status = wasCancelled ? "cancelled" : "failed";
            await this.options.onError?.(error, { ...job });
            return;
          }
          const delay = Math.min(this.options.maxBackoffMs ?? 30_000, (this.options.backoffMs ?? 250) * 2 ** (job.attempts - 1));
          await sleep(delay);
        }
      }
    } finally { this.controllers.delete(job.id); }
  }
}

export interface ScheduledJob { id: string; cancel: () => void; nextRunAt?: Date | undefined }
export interface SchedulerOptions { onError?: (error: unknown, id: string) => void | Promise<void> }

type Timer = ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;

interface CronField { min: number; max: number; values: Set<number> }

function parseCronField(token: string, min: number, max: number, normalize?: (value: number) => number): CronField {
  if (!token) throw new Error("Cron fields cannot be empty");
  const values = new Set<number>();
  for (const part of token.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart === undefined ? 1 : Number(stepPart);
    if (!Number.isInteger(step) || step < 1) throw new Error(`Invalid cron step: ${part}`);
    const bounds = rangePart === "*" ? [min, max] : rangePart?.split("-").map(Number);
    if (!bounds || bounds.length < 1 || bounds.some((value) => !Number.isInteger(value))) throw new Error(`Invalid cron range: ${part}`);
    const start = bounds[0] as number;
    const end = (bounds[1] ?? start) as number;
    if (start < min || end > max || start > end) throw new Error(`Cron value out of range: ${part}`);
    for (let value = start; value <= end; value += step) values.add(normalize ? normalize(value) : value);
  }
  return { min, max, values };
}

export interface CronExpression { minute: CronField; hour: CronField; dayOfMonth: CronField; month: CronField; dayOfWeek: CronField }

export function parseCronExpression(expression: string): CronExpression {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error("Cron expression must contain exactly five fields: minute hour day-of-month month day-of-week");
  return {
    minute: parseCronField(fields[0]!, 0, 59),
    hour: parseCronField(fields[1]!, 0, 23),
    dayOfMonth: parseCronField(fields[2]!, 1, 31),
    month: parseCronField(fields[3]!, 1, 12),
    dayOfWeek: parseCronField(fields[4]!, 0, 7, (value) => value === 7 ? 0 : value),
  };
}

export function nextCronOccurrence(expression: string | CronExpression, from = new Date()): Date {
  const cron = typeof expression === "string" ? parseCronExpression(expression) : expression;
  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);
  const maxMinutes = 366 * 24 * 60 * 5;
  for (let index = 0; index < maxMinutes; index += 1) {
    const dayOfMonthMatches = cron.dayOfMonth.values.has(candidate.getDate());
    const dayOfWeekMatches = cron.dayOfWeek.values.has(candidate.getDay());
    const dayMatches = cron.dayOfMonth.values.size === cron.dayOfMonth.max - cron.dayOfMonth.min + 1
      || cron.dayOfWeek.values.size === cron.dayOfWeek.max - cron.dayOfWeek.min + 1
      ? dayOfMonthMatches && dayOfWeekMatches
      : dayOfMonthMatches || dayOfWeekMatches;
    if (cron.month.values.has(candidate.getMonth() + 1) && cron.hour.values.has(candidate.getHours()) && cron.minute.values.has(candidate.getMinutes()) && dayMatches) return new Date(candidate);
    candidate.setMinutes(candidate.getMinutes() + 1);
  }
  throw new Error(`Cron expression has no occurrence within five years: ${typeof expression === "string" ? expression : "[parsed]"}`);
}

export class Scheduler {
  private readonly timers = new Map<string, Timer>();
  private readonly nextRuns = new Map<string, Date>();
  constructor(private readonly options: SchedulerOptions = {}) {}

  every(id: string, intervalMs: number, task: () => void | Promise<void>): ScheduledJob {
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) throw new RangeError("intervalMs must be positive");
    this.cancel(id);
    const timer = setInterval(() => { void this.run(id, task); }, intervalMs);
    this.timers.set(id, timer);
    return { id, cancel: () => this.cancel(id) };
  }

  after(id: string, delayMs: number, task: () => void | Promise<void>): ScheduledJob {
    if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError("delayMs must be non-negative");
    this.cancel(id);
    const timer = setTimeout(() => { this.timers.delete(id); void this.run(id, task); }, delayMs);
    this.timers.set(id, timer);
    return { id, cancel: () => this.cancel(id) };
  }

  cron(id: string, expression: string, task: () => void | Promise<void>): ScheduledJob {
    const parsed = parseCronExpression(expression);
    this.cancel(id);
    const scheduleNext = () => {
      const nextRunAt = nextCronOccurrence(parsed);
      this.nextRuns.set(id, nextRunAt);
      const timer = setTimeout(() => {
        this.timers.delete(id);
        void this.run(id, task).finally(() => { if (this.nextRuns.has(id)) scheduleNext(); });
      }, Math.max(1, nextRunAt.getTime() - Date.now()));
      this.timers.set(id, timer);
    };
    scheduleNext();
    const scheduler = this;
    return { id, cancel: () => scheduler.cancel(id), get nextRunAt() { return scheduler.nextRuns.get(id); } };
  }

  getNextRun(id: string): Date | undefined { const value = this.nextRuns.get(id); return value ? new Date(value) : undefined; }
  cancel(id: string): boolean { const timer = this.timers.get(id); if (!timer) { this.nextRuns.delete(id); return false; } clearTimeout(timer); clearInterval(timer); this.timers.delete(id); this.nextRuns.delete(id); return true; }
  clear(): void { for (const id of [...this.timers.keys()]) this.cancel(id); }

  private async run(id: string, task: () => void | Promise<void>): Promise<void> {
    try { await task(); } catch (error) { await this.options.onError?.(error, id); }
  }
}
