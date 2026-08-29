import { ApiClient } from "../api/client.js";
import { FetchTransport, type FetchTransportOptions, type Transport } from "../api/transport.js";
import type { BotCommand, BotCommandScope, ChatId, Update, User } from "../api/types.js";
import { Context } from "../context/context.js";
import { compose, type Middleware } from "../middleware/compose.js";
import { Router, type RouterOptions } from "../router/router.js";
import { EventBus, type EventMap } from "./events.js";
import { MemoryStorage, type Storage } from "../storage/storage.js";
import { PluginManager, type Plugin } from "../plugins/plugin.js";
import { createLogger, Logger, type LoggerOptions, summarizeUpdate } from "../observability/logger.js";
import { printTerminalBranding, startTerminalAnimation } from "../branding/terminal.js";
import { conversationKeyFromContext, type Wizard } from "../state/conversation.js";

export type BotStatus = "created" | "initialized" | "starting" | "running" | "stopping" | "stopped" | "error";
export type BotContext<S extends object = Record<string, unknown>> = Context<S>;

export interface BotOptions<S extends object = Record<string, unknown>> {
  token: string;
  apiBaseUrl?: string;
  transport?: Transport;
  transportOptions?: Omit<FetchTransportOptions, "baseUrl">;
  session?: Storage<string, S>;
  services?: Record<string, unknown>;
  polling?: { timeout?: number; limit?: number; allowedUpdates?: string[]; retryDelayMs?: number; maxRetryDelayMs?: number };
  router?: RouterOptions;
  logger?: Logger | LoggerOptions;
  branding?: boolean;
}

export interface HealthStatus { status: BotStatus; apiReachable: boolean; bot?: User; checkedAt: string; error?: string }

export class Bot<S extends object = Record<string, unknown>> {
  readonly api: ApiClient;
  readonly router: Router<Context<S>>;
  readonly events = new EventBus<EventMap>();
  readonly plugins: PluginManager<Context<S>>;
  readonly session: Storage<string, S>;
  readonly services: Record<string, unknown>;
  readonly token: string;
  readonly logger: Logger;
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
    if (config.branding) printTerminalBranding();
    this.logger = config.logger instanceof Logger ? config.logger : createLogger(config.logger);
    this.router = new Router<Context<S>>(config.router);
    this.session = config.session ?? new MemoryStorage<string, S>();
    this.services = { ...(config.services ?? {}) };
    const transport = config.transport ?? new FetchTransport({ baseUrl: `${config.apiBaseUrl ?? "https://api.telegram.org"}/bot${config.token}`, ...(config.transportOptions ?? {}) });
    this.api = new ApiClient({
      hooks: {
        onRequest: (context) => { this.logger.trace("api.request", { method: context.method, payload: context.payload }); return this.events.emit("api:request", { method: context.method, payload: context.payload }); },
        onResponse: (context) => { this.logger.debug("api.response", { method: context.method, durationMs: context.durationMs ?? 0, ok: context.response?.ok }); return this.events.emit("api:response", { method: context.method, durationMs: context.durationMs ?? 0, response: context.response }); },
        onError: (context) => { this.logger.error("api.error", { method: context.method, durationMs: context.durationMs ?? 0, error: context.error }); return this.events.emit("api:error", { method: context.method, durationMs: context.durationMs ?? 0, error: context.error }); },
      },
      transport,
    });
    this.plugins = new PluginManager<Context<S>>(this);
    this.pollingOptions = {
      allowedUpdates: config.polling?.allowedUpdates ?? [],
      limit: config.polling?.limit ?? 100,
      maxRetryDelayMs: config.polling?.maxRetryDelayMs ?? 30_000,
      retryDelayMs: config.polling?.retryDelayMs ?? 500,
      timeout: config.polling?.timeout ?? 30,
    };
    this.logger.info("bot.created", { status: this.statusValue });
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

  /**
   * Routes subsequent messages to the active Wizard step for the same chat/user.
   * The application starts the wizard once with `wizard.run(ctx, key)`; this
   * middleware keeps routing replies until the wizard is completed or cancelled.
   */
  useWizard(wizard: Wizard<S>, options: { cancelCommand?: string } = {}): this {
    const cancelCommand = options.cancelCommand ?? "/cancel";
    this.use(async (ctx, next) => {
      const message = ctx.message;
      const key = conversationKeyFromContext(ctx);
      const state = await wizard.manager.getAsync(key);
      if (!message?.text || state?.status !== "active") { await next(); return; }
      if (message.text.trim() === cancelCommand) {
        wizard.manager.cancel(key);
        await ctx.reply("Conversation cancelled.");
        return;
      }
      await wizard.run(ctx, key);
    });
    return this;
  }

  async init(): Promise<this> {
    if (this.statusValue === "initialized" || this.statusValue === "running") return this;
    this.logger.info("bot.initializing");
    const animation = startTerminalAnimation("Connecting to Telegram and initializing bot");
    try {
      this.me = await this.api.methods.getMe();
      this.statusValue = "initialized";
      this.logger.info("bot.initialized", { botId: this.me.id, username: this.me.username });
      await this.events.emit("bot:initialized", { bot: this });
      await this.plugins.setup();
      await this.plugins.start();
      animation.stop("Bot initialized; ready to start");
      return this;
    } catch (error) {
      animation.stop("Error: bot could not initialize");
      throw error;
    }
  }

  async start(): Promise<void> { await this.launch({ mode: "polling" }); }

  async launch(options: { mode: "polling"; timeout?: number; allowedUpdates?: string[] } = { mode: "polling" }): Promise<void> {
    if (options.mode !== "polling") throw new Error("Use createWebhookHandler() for webhook mode.");
    await this.init();
    if (this.statusValue === "running") return;
    this.statusValue = "starting";
    this.logger.info("bot.starting", { mode: options.mode });
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
    await this.plugins.stop();
    await this.plugins.dispose();
    this.statusValue = "stopped";
    this.logger.info("bot.stopped");
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
    this.logger.debug("update.received", { update: summarizeUpdate(update, this.logger.includeUpdateContent) });
    const message = update.message
      ?? update.edited_message
      ?? update.channel_post
      ?? update.edited_channel_post
      ?? update.business_message
      ?? update.edited_business_message
      ?? update.guest_message
      ?? update.callback_query?.message;
    const key = this.conversationKey(update);
    const session = await this.session.get(key) ?? ({} as S);
    if (!this.me) await this.init();
    if (!this.me) return;
    const ctx = new Context<S>({ update, api: this.api, session, services: this.services, me: this.me });
    await this.events.emit("update", { update });
    if (message) {
      await this.events.emit("message", { message });
      if (message.text?.startsWith("/")) {
        const command = message.text.slice(1).split(/[\s@]/, 1)[0] ?? "";
        await this.events.emit("command", { name: command, update });
      }
    }
    if (update.callback_query) await this.events.emit("callback", { data: update.callback_query.data ?? "", update });
    const pipeline = compose<Context<S>>([...this.middlewares, async (context) => this.router.handle(context)]);
    try {
      await this.plugins.update(ctx);
      await pipeline(ctx);
      await this.session.set(key, ctx.session);
    } catch (error) {
      // A handler failure belongs to this update. It must remain observable and reject
      // direct handleUpdate() callers, but it must not poison the polling lifecycle.
      this.logger.error("update.handler_error", { update: summarizeUpdate(update, this.logger.includeUpdateContent), error });
      await this.events.emit("update:error", { update, error });
      await this.events.emit("bot:error", { bot: this, error });
      throw error;
    }
  }

  private conversationKey(update: Update): string {
    if (update.callback_query) {
      const chat = update.callback_query.message?.chat;
      const userId = update.callback_query.from.id;
      if (chat?.id !== undefined) return `${chat.id}:${userId}`;
      return `user:${userId}`;
    }
    if (update.inline_query?.from?.id !== undefined) return `user:${update.inline_query.from.id}`;
    if (update.chosen_inline_result?.from?.id !== undefined) return `user:${update.chosen_inline_result.from.id}`;
    const message = update.message
      ?? update.edited_message
      ?? update.channel_post
      ?? update.edited_channel_post
      ?? update.business_message
      ?? update.edited_business_message
      ?? update.guest_message;
    if (message?.chat?.id !== undefined) return `${message.chat.id}:${message.from?.id ?? "anonymous"}`;
    if (update.chat_member?.chat?.id !== undefined) return `${update.chat_member.chat.id}:${update.chat_member.from.id}`;
    if (update.my_chat_member?.chat?.id !== undefined) return `${update.my_chat_member.chat.id}:${update.my_chat_member.from.id}`;
    if (update.chat_join_request?.chat?.id !== undefined) return `${update.chat_join_request.chat.id}:${update.chat_join_request.from.id}`;
    return `update:${update.update_id}`;
  }

  private async waitForRetry(delayMs: number, signal: AbortSignal): Promise<boolean> {
    if (signal.aborted) return false;
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve(true);
      }, delayMs);
      const onAbort = () => {
        clearTimeout(timer);
        signal.removeEventListener("abort", onAbort);
        resolve(false);
      };
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  private async poll(timeout: number, allowedUpdates: string[], signal: AbortSignal): Promise<void> {
    let delay = this.pollingOptions.retryDelayMs;
    // Telegram holds a long-poll connection open for `timeout` seconds, so the
    // request timeout must exceed it to avoid aborting a healthy connection.
    const requestTimeoutMs = timeout * 1_000 + 10_000;
    while (!signal.aborted) {
      try {
        const updates = await this.api.request("getUpdates", { offset: this.offset, limit: this.pollingOptions.limit, timeout, allowed_updates: allowedUpdates }, signal, { timeoutMs: requestTimeoutMs });
        delay = this.pollingOptions.retryDelayMs;
        for (const update of updates) {
          this.offset = Math.max(this.offset, update.update_id + 1);
          try {
            await this.handleUpdate(update);
          } catch {
            // The update has already advanced the offset. Continue with the rest of
            // the batch instead of reconnecting or replaying a failed handler.
          }
        }
      } catch (error) {
        if (signal.aborted) break;
        const attempt = Math.max(1, Math.round(Math.log2(delay / this.pollingOptions.retryDelayMs) + 1));
        this.logger.warn("polling.reconnect", { attempt, delayMs: delay, error });
        await this.events.emit("polling:reconnect", { error, attempt });
        if (!(await this.waitForRetry(delay, signal))) break;
        delay = Math.min(this.pollingOptions.maxRetryDelayMs, delay * 2);
      }
    }
  }
}
