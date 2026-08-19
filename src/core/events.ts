export type EventMap = {
  "bot:created": { bot: unknown };
  "bot:initialized": { bot: unknown };
  "bot:starting": { bot: unknown };
  "bot:started": { bot: unknown };
  "bot:stopping": { bot: unknown };
  "bot:stopped": { bot: unknown };
  "bot:error": { bot: unknown; error: unknown };
  update: { update: unknown };
  "update:error": { update: unknown; error: unknown };
  message: { message: unknown };
  command: { name: string; update: unknown };
  callback: { data: string; update: unknown };
  "api:request": { method: string; payload: unknown };
  "api:response": { method: string; durationMs: number; response: unknown };
  "api:error": { method: string; durationMs: number; error: unknown };
  "webhook:request": { update: unknown };
  "polling:reconnect": { error: unknown; attempt: number };
};

type Listener<T> = (payload: T) => void | Promise<void>;

export class EventBus<Events extends Record<string, unknown> = EventMap> {
  private readonly listeners = new Map<keyof Events, Set<Listener<Events[keyof Events]>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const bucket = this.listeners.get(event) ?? new Set();
    bucket.add(listener as Listener<Events[keyof Events]>);
    this.listeners.set(event, bucket);
    return () => this.off(event, listener);
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const dispose = this.on(event, async (payload) => { dispose(); await listener(payload); });
    return dispose;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<Events[keyof Events]>);
  }

  async emit<K extends keyof Events>(event: K, payload: Events[K]): Promise<void> {
    const listeners = [...(this.listeners.get(event) ?? [])];
    for (const listener of listeners) await listener(payload);
  }

  removeAllListeners(): void { this.listeners.clear(); }
  listenerCount<K extends keyof Events>(event: K): number { return this.listeners.get(event)?.size ?? 0; }
}
