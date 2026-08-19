import type { Context } from "../context/context.js";

export interface ConversationState { name: string; step: number; values: Record<string, unknown>; status: "active" | "completed" | "cancelled"; updatedAt: number }
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
  start(key: string, name: string, values: Record<string, unknown> = {}): ConversationState { const state: ConversationState = { name, step: 0, values, status: "active", updatedAt: Date.now() }; this.active.set(key, state); return state; }
  get(key: string): ConversationState | undefined { return this.active.get(key); }
  cancel(key: string): boolean { const state = this.active.get(key); if (!state) return false; state.status = "cancelled"; state.updatedAt = Date.now(); return true; }
  clearExpired(maxAgeMs: number): number { const threshold = Date.now() - maxAgeMs; let removed = 0; for (const [key, state] of this.active) if (state.updatedAt < threshold) { this.active.delete(key); removed += 1; } return removed; }
  async run(ctx: Context<S>, key: string, name: string, steps: Array<(flow: ConversationFlow<S>) => void | Promise<void>>): Promise<ConversationState> { const state = this.active.get(key) ?? this.start(key, name); const flow = new ConversationFlow(ctx, state); const step = steps[state.step]; if (!step) { state.status = "completed"; return state; } await step(flow); return state; }
}

export interface WizardStep<S extends object = Record<string, unknown>> { id: string; run: (flow: ConversationFlow<S>) => void | Promise<void>; optional?: boolean }
export class Wizard<S extends object = Record<string, unknown>> {
  private readonly stepsList: WizardStep<S>[] = [];
  step(step: WizardStep<S>): this { this.stepsList.push(step); return this; }
  async run(ctx: Context<S>, key: string, manager = new ConversationManager<S>()): Promise<ConversationState> { return manager.run(ctx, key, "wizard", this.stepsList.map((step) => step.run)); }
  get steps(): readonly WizardStep<S>[] { return this.stepsList; }
}
