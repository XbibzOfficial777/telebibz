import { ApiClient } from "../api/client.js";
import { FetchTransport, type FetchTransportOptions, type Transport } from "../api/transport.js";
import type { BotCommand, BotCommandScope, ChatId, Update, User } from "../api/types.js";
import { Context } from "../context/context.js";
import { compose, type Middleware } from "../middleware/compose.js";
import { Router } from "../router/router.js";
import { EventBus, type EventMap } from "./events.js";
import { MemoryStorage } from "../storage/storage.js";
import { PluginManager, type Plugin } from "../plugins/plugin.js";
import { ApprovalGate, type ApprovalOptions } from "../approval/approval.js";

export type BotStatus = "created" | "initialized" | "awaiting-approval" | "starting" | "running" | "stopping" | "stopped" | "error";
export type BotContext<S extends object = Record<string, unknown>> = Context<S>;

export interface BotOptions<S extends object = Record<string, unknown>> {
  token: string;
  apiBaseUrl?: string;
  transport?: Transport;
  transportOptions?: Omit<FetchTransportOptions, "baseUrl">;
  session?: MemoryStorage<string, S>;
  services?: Record<string, unknown>;
  polling?: { timeout?: number; limit?: number; allowedUpdates?: string[]; retryDelayMs?: number; maxRetryDelayMs?: number };
  approval?: ApprovalOptions;
}

export interface HealthStatus { status: BotStatus; apiReachable: boolean; bot?: User; checkedAt: string; error?: string }

export class Bot<S extends object = Record<string, unknown>> {
  readonly api: ApiClient;
  readonly router = new Router<Context<S>>();
  readonly events = new EventBus<EventMap>();
  readonly plugins: PluginManager<Context<S>>;
  readonly session: MemoryStorage<string, S>;
  readonly services: Record<string, unknown>;
  readonly approval: ApprovalGate | undefined;
  readonly token: string;
  private readonly middlewares: Middleware<Context<S>>[] = [];
  private readonly pollingOptions: Required<NonNullable<BotOptions<S>["polling"]>>;
  private statusValue: BotStatus = "created";
  private pollingAbort: AbortController | undefined;
  private offset = 0;
  private me?: User;

  constructor(options: string | BotOptions<S>) {
    const config = typeof options === "string" ? { token: options } : options;
    if (!config.token || !/^\d+:[\w-]+$/.test(config.token)) throw new Error("A valid Telegram bot token is required.");
    this.token = config.token;
    this.session = config.session ?? new MemoryStorage<string, S>();
    this.services = { ...(config.services ?? {}) };
    const transport = config.transport ?? new FetchTransport({ baseUrl: `${config.apiBaseUrl ?? "https://api.telegram.org"}/bot${config.token}`, ...(config.transportOptions ?? {}) });
    this.api = new ApiClient({
      transport,
      hooks: {
        onRequest: (context) => this.events.emit("api:request", { method: context.method, payload: context.payload }),
        onResponse: (context) => this.events.emit("api:response", { method: context.method, durationMs: context.durationMs ?? 0, response: context.response }),
        onError: (context) => this.events.emit("api:error", { method: context.method, durationMs: context.durationMs ?? 0, error: context.error }),
      },
    });
    this.plugins = new PluginManager<Context<S>>(this);
    this.approval = config.approval ? new ApprovalGate(this.api, config.approval) : undefined;
    this.pollingOptions = {
      timeout: config.polling?.timeout ?? 30,
      limit: config.polling?.limit ?? 100,
      allowedUpdates: config.polling?.allowedUpdates ?? [],
      retryDelayMs: config.polling?.retryDelayMs ?? 500,
      maxRetryDelayMs: config.polling?.maxRetryDelayMs ?? 30_000,
    };
    void this.events.emit("bot:created", { bot: this });
  }

  get status(): BotStatus { return this.statusValue; }
  get botInfo(): User | undefined { return this.me; }

  use(...middleware: Middleware<Context<S>>[]): this { this.middlewares.push(...middleware); return this; }
  command(name: string, handler: Middleware<Context<S>>): this { this.router.command(name, handler); return this; }
  callback(pattern: string | RegExp, handler: Middleware<Context<S>>): this { this.router.callback(pattern, handler); return this; }
  onText(text: string, handler: Middleware<Context<S>>): this { this.router.text(text, handler); return this; }
  onRegex(expression: RegExp, handler: Middleware<Context<S>>): this { this.router.regex(expression, handler); return this; }
  usePlugin(plugin: Plugin<Context<S>>): this { this.plugins.use(plugin); return this; }

  async init(): Promise<this> {
    if (this.statusValue === "initialized" || this.statusValue === "running") return this;
    this.me = await this.api.methods.getMe();
    if (this.approval) {
      const approval = await this.approval.check({ bot: this.me });
      if (!approval.allowed) { this.statusValue = "awaiting-approval"; return this; }
    }
    this.statusValue = "initialized";
    await this.events.emit("bot:initialized", { bot: this });
    await this.plugins.setup();
    await this.plugins.start();
    return this;
  }

  async start(): Promise<void> { await this.launch({ mode: "polling" }); }

  async launch(options: { mode: "polling"; timeout?: number; allowedUpdates?: string[] } = { mode: "polling" }): Promise<void> {
    if (options.mode !== "polling") throw new Error("Use createWebhookHandler() for webhook mode.");
    await this.init();
    if (this.statusValue === "running") return;
    this.statusValue = "starting";
    await this.events.emit("bot:starting", { bot: this });
    this.pollingAbort = new AbortController();
    this.statusValue = "running";
    await this.events.emit("bot:started", { bot: this });
    await this.poll(options.timeout ?? this.pollingOptions.timeout, options.allowedUpdates ?? this.pollingOptions.allowedUpdates, this.pollingAbort.signal);
  }

  async stop(): Promise<void> {
    if (this.statusValue === "stopped" || this.statusValue === "created") return;
    this.statusValue = "stopping";
    await this.events.emit("bot:stopping", { bot: this });
    this.pollingAbort?.abort();
    this.pollingAbort = undefined;
    await this.plugins.dispose();
    this.statusValue = "stopped";
    await this.events.emit("bot:stopped", { bot: this });
  }

  async restart(): Promise<void> { await this.stop(); await this.start(); }

  async health(): Promise<HealthStatus> {
    try { const bot = await this.api.methods.getMe(); return { status: this.statusValue, apiReachable: true, bot, checkedAt: new Date().toISOString() }; }
    catch (error) { return { status: this.statusValue, apiReachable: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) }; }
  }

  async getMe(): Promise<User> { const me = await this.api.methods.getMe(); this.me = me; return me; }
  async setCommands(commands: BotCommand[], scope?: BotCommandScope, languageCode?: string): Promise<true> { return this.api.call("setMyCommands", { commands, scope, language_code: languageCode } as never) as Promise<true>; }
  async deleteCommands(scope?: BotCommandScope, languageCode?: string): Promise<true> { return this.api.call("deleteMyCommands", { scope, language_code: languageCode } as never) as Promise<true>; }

  async handleUpdate(update: Update): Promise<void> {
    const message = update.message ?? update.edited_message ?? update.channel_post ?? update.edited_channel_post ?? update.business_message ?? update.guest_message;
    const key = message?.chat?.id !== undefined ? `${message.chat.id}:${message.from?.id ?? "anonymous"}` : `update:${update.update_id}`;
    const session = await this.session.get(key) ?? ({} as S);
    if (this.approval && this.me && !(await this.approval.isAllowed(this.me.id))) {
      if (update.callback_query) await this.approval.handleCallback(update.callback_query);
      return;
    }
    const ctx = new Context<S>({ update, api: this.api, session, services: this.services });
    await this.events.emit("update", { update });
    if (message) await this.events.emit("message", { message });
    const pipeline = compose<Context<S>>([...this.middlewares, async (context) => this.router.handle(context)]);
    try {
      await pipeline(ctx);
      await this.session.set(key, ctx.session);
    } catch (error) {
      this.statusValue = "error";
      await this.events.emit("bot:error", { bot: this, error });
      throw error;
    }
  }

  private async poll(timeout: number, allowedUpdates: string[], signal: AbortSignal): Promise<void> {
    let delay = this.pollingOptions.retryDelayMs;
    while (!signal.aborted) {
      try {
        const updates = await this.api.methods.getUpdates({ offset: this.offset, limit: this.pollingOptions.limit, timeout, allowed_updates: allowedUpdates });
        delay = this.pollingOptions.retryDelayMs;
        for (const update of updates) {
          this.offset = Math.max(this.offset, update.update_id + 1);
          await this.handleUpdate(update);
        }
      } catch (error) {
        if (signal.aborted) break;
        await this.events.emit("polling:reconnect", { error, attempt: Math.ceil(delay / this.pollingOptions.retryDelayMs) });
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(this.pollingOptions.maxRetryDelayMs, delay * 2);
      }
    }
  }
}
