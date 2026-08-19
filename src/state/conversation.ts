import type { Context } from "../context/context.js";
import { MemoryStorage, type Storage } from "../storage/storage.js";

export interface ConversationState { name: string; step: number; values: Record<string, unknown>; status: "active" | "completed" | "cancelled"; updatedAt: number }

export function conversationKeyFromContext<S extends object>(ctx: Context<S>): string {
  return ctx.chat?.id !== undefined ? `${ctx.chat.id}:${ctx.from?.id ?? "anonymous"}` : `update:${ctx.update.update_id}`;
}

export class ConversationFlow<S extends object = Record<string, unknown>> {
  constructor(readonly ctx: Context<S>, readonly state: ConversationState) {}
  get values(): Record<string, unknown> { return this.state.values; }
  set<T>(key: string, value: T): this { this.state.values[key] = value; this.state.updatedAt = Date.now(); return this; }
  get<T>(key: string): T | undefined { return this.state.values[key] as T | undefined; }
  next(): this { this.state.step += 1; this.state.updatedAt = Date.now(); return this; }
  previous(): this { this.state.step = Math.max(0, this.state.step - 1); this.state.updatedAt = Date.now(); return this; }
  complete(): void { this.state.status = "completed"; this.state.updatedAt = Date.now(); }
  cancel(): void { this.state.status = "cancelled"; this.state.updatedAt = Date.now(); }
}

export class ConversationManager<S extends object = Record<string, unknown>> {
  private readonly active = new Map<string, ConversationState>();
  readonly storage: Storage<string, ConversationState>;

  constructor(storage: Storage<string, ConversationState> = new MemoryStorage<string, ConversationState>()) {
    this.storage = storage;
  }

  start(key: string, name: string, values: Record<string, unknown> = {}): ConversationState {
    const state: ConversationState = { name, step: 0, values, status: "active", updatedAt: Date.now() };
    this.active.set(key, state);
    void this.storage.set(key, state).catch(() => undefined);
    return state;
  }

  async startAsync(key: string, name: string, values: Record<string, unknown> = {}): Promise<ConversationState> {
    const state: ConversationState = { name, step: 0, values, status: "active", updatedAt: Date.now() };
    this.active.set(key, state);
    await this.storage.set(key, state);
    return state;
  }

  get(key: string): ConversationState | undefined { return this.active.get(key); }

  async getAsync(key: string): Promise<ConversationState | undefined> {
    const cached = this.active.get(key);
    if (cached) return cached;
    const stored = await this.storage.get(key);
    if (stored) this.active.set(key, stored);
    return stored;
  }

  cancel(key: string): boolean {
    const state = this.active.get(key);
    if (!state) return false;
    state.status = "cancelled";
    state.updatedAt = Date.now();
    void this.storage.set(key, state).catch(() => undefined);
    return true;
  }

  async cancelAsync(key: string): Promise<boolean> {
    const state = await this.getAsync(key);
    if (!state) return false;
    state.status = "cancelled";
    state.updatedAt = Date.now();
    await this.storage.set(key, state);
    return true;
  }

  clearExpired(maxAgeMs: number): number {
    if (!Number.isFinite(maxAgeMs) || maxAgeMs < 0) throw new RangeError("maxAgeMs must be non-negative");
    const threshold = Date.now() - maxAgeMs;
    let removed = 0;
    for (const [key, state] of this.active) if (state.updatedAt < threshold) { this.active.delete(key); void this.storage.delete(key); removed += 1; }
    return removed;
  }

  async clearExpiredAsync(maxAgeMs: number): Promise<number> {
    if (!Number.isFinite(maxAgeMs) || maxAgeMs < 0) throw new RangeError("maxAgeMs must be non-negative");
    const threshold = Date.now() - maxAgeMs;
    let removed = 0;
    for await (const [key, state] of this.storage.entries()) {
      if (state.updatedAt < threshold) { await this.storage.delete(key); this.active.delete(key); removed += 1; }
    }
    return removed;
  }

  async run(ctx: Context<S>, key: string, name: string, steps: Array<(flow: ConversationFlow<S>) => void | Promise<void>>): Promise<ConversationState> {
    const existing = await this.getAsync(key);
    const state = existing ?? await this.startAsync(key, name);
    if (state.name !== name) throw new Error(`Conversation ${key} belongs to ${state.name}, not ${name}`);
    if (state.status !== "active") return state;
    const flow = new ConversationFlow(ctx, state);
    const step = steps[state.step];
    if (!step) state.status = "completed";
    else {
      await step(flow);
      if (state.step >= steps.length) state.status = "completed";
    }
    state.updatedAt = Date.now();
    await this.storage.set(key, state);
    this.active.set(key, state);
    return state;
  }
}

export interface WizardStep<S extends object = Record<string, unknown>> { id: string; run: (flow: ConversationFlow<S>) => void | Promise<void>; optional?: boolean }
export class Wizard<S extends object = Record<string, unknown>> {
  private readonly stepsList: WizardStep<S>[] = [];
  private readonly defaultManager: ConversationManager<S>;

  constructor(manager?: ConversationManager<S>) {
    this.defaultManager = manager ?? new ConversationManager<S>();
  }

  step(step: WizardStep<S>): this { this.stepsList.push(step); return this; }

  /**
   * Runs the active step for a conversation key. The default manager belongs to
   * this Wizard instance and is intentionally reused across updates; passing a
   * manager is useful when the application owns persistent storage explicitly.
   */
  async run(ctx: Context<S>, key = conversationKeyFromContext(ctx), manager?: ConversationManager<S>): Promise<ConversationState> {
    return (manager ?? this.defaultManager).run(ctx, key, "wizard", this.stepsList.map((step) => step.run));
  }

  get steps(): readonly WizardStep<S>[] { return this.stepsList; }
  get manager(): ConversationManager<S> { return this.defaultManager; }
}
