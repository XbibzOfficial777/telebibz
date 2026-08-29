import { ApiClient } from "../api/client.js";
import { FetchTransport, type FetchTransportOptions, type Transport } from "../api/transport.js";
import type { BotCommand, BotCommandScope, ChatId, Update, User } from "../api/types.js";
import { Context } from "../context/context.js";
import { compose, type Middleware } from "../middleware/compose.js";
import { Router, type RouterOptions, type UpdateFilter } from "../router/router.js";
import { EventBus, type EventMap } from "./events.js";
import { MemoryStorage, type Storage } from "../storage/storage.js";
import { PluginManager, type Plugin } from "../plugins/plugin.js";
import { createLogger, describeIncomingUpdate, Logger, type LogContext, type LoggerOptions, summarizeUpdate } from "../observability/logger.js";
import { printStatusLine, printTeleBibzBanner, runStartupSequence, startTeleBibzBanner, startTerminalAnimation, type BannerHandle } from "../branding/terminal.js";
import { conversationKeyFromContext, type Wizard } from "../state/conversation.js";
import { runBroadcast, type BroadcastOptions, type BroadcastReport } from "../broadcast/broadcast.js";
import { Limiter } from "../utils/concurrency.js";
import { runWithWebhookReply, runWithoutWebhookReply, type WebhookReplySink } from "./webhook-reply.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { writeFile } from "node:fs/promises";
import type { DownloadedFile } from "../api/client.js";
import type { ContextOptions } from "../context/context.js";

/** Thrown when a single update exceeds `handlerTimeout`; the handler keeps running in the background. */
export class UpdateTimeoutError extends Error {
  override readonly name: string = "UpdateTimeoutError";
  readonly updateId: number;
  constructor(updateId: number, timeoutMs: number) {
    super(`Update ${updateId} handler timed out after ${timeoutMs}ms`);
    this.updateId = updateId;
  }
}

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
  /**
   * Update-processing tuning. Updates always run in parallel across chats
   * while staying ordered within a single chat. `concurrency` caps how many
   * updates may be processed at the same time (default `Infinity` — bursts of
   * 1000+ messages are processed at once, with no artificial cooldown).
   */
  updates?: { concurrency?: number };
  /**
   * Per-update processing timeout in milliseconds (default `90000`, matching
   * Telegraf; `Infinity` disables). On timeout the update error flow runs
   * (`update:error`, `bot:error`, `catch()` boundary) and `handleUpdate()`
   * rejects, while the handler keeps running to completion in the background.
   */
  handlerTimeout?: number;
  /** Custom `Context` subclass instantiated for every update (Telegraf's `contextType`). */
  contextType?: new (options: ContextOptions<S>) => Context<S>;
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
  /** Caps how many updates run at once (default: unlimited). */
  private readonly updateLimiter: Limiter;
  /** Per-update timeout in ms; `Infinity` disables. */
  private readonly handlerTimeoutMs: number;
  /** Context class instantiated per update (default `Context`). */
  private readonly contextType: new (options: ContextOptions<S>) => Context<S>;
  /** Per-chat processing chains: parallel across chats, ordered within a chat. */
  private readonly chatChains = new Map<string, Promise<void>>();
  /**
   * Identifies the update chain executing in the current async context so
   * `stop()` called from inside a handler never deadlocks waiting on itself
   * (Telegraf allows `bot.stop()` from within a handler).
   */
  private readonly currentUpdateChain = new AsyncLocalStorage<Promise<void>>();
  /** Memoized init so a burst of updates triggers exactly one getMe call. */
  private initOnce: Promise<void> | undefined;
  private readonly brandingEnabled: boolean;
  /** Branding effects run only on an interactive TTY; structured logs stay untouched otherwise. */
  private readonly brandingActive: boolean;
  private activeBanner: BannerHandle | undefined;
  private errorHandler?: (error: unknown, ctx: Context<S>) => void | Promise<void>;

  constructor(options: string | BotOptions<S>) {
    const config = typeof options === "string" ? { token: options } : options;
    if (!config.token || !/^\d+:[\w-]+$/.test(config.token)) throw new Error("A valid Telegram bot token is required.");
    this.token = config.token;
    this.brandingEnabled = config.branding ?? true;
    this.brandingActive = this.brandingEnabled && process.stdout.isTTY === true;
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
    this.updateLimiter = new Limiter(config.updates?.concurrency ?? Infinity);
    this.handlerTimeoutMs = config.handlerTimeout ?? 90_000;
    this.contextType = config.contextType ?? Context;
    this.pollingOptions = {
      allowedUpdates: config.polling?.allowedUpdates ?? [],
      limit: config.polling?.limit ?? 100,
      maxRetryDelayMs: config.polling?.maxRetryDelayMs ?? 30_000,
      retryDelayMs: config.polling?.retryDelayMs ?? 500,
      timeout: config.polling?.timeout ?? 30,
    };
    this.startupLog("bot.created", { status: this.statusValue });
    void this.events.emit("bot:created", { bot: this });
  }

  /** Startup info logs are demoted to debug while the branding sequence owns the terminal. */
  private startupLog(event: string, context: LogContext): void {
    if (this.brandingActive) this.logger.debug(event, context);
    else this.logger.info(event, context);
  }

  get status(): BotStatus { return this.statusValue; }
  get botInfo(): User | undefined { return this.me; }

  use(...middleware: Middleware<Context<S>>[]): this { this.middlewares.push(...middleware); return this; }
  command(name: string, handler: Middleware<Context<S>>): this { this.router.command(name, handler); return this; }
  callback(pattern: string | RegExp, handler: Middleware<Context<S>>): this { this.router.callback(pattern, handler); return this; }
  /** Telegraf-style alias for `callback()`: registers a handler for callback-query button data. */
  action(pattern: string | RegExp, handler: Middleware<Context<S>>): this { this.router.callback(pattern, handler); return this; }
  onText(text: string, handler: Middleware<Context<S>>): this { this.router.text(text, handler); return this; }
  onRegex(expression: RegExp, handler: Middleware<Context<S>>): this { this.router.regex(expression, handler); return this; }
  /** Registers a handler for update types: `bot.on("message:photo", handler)` or `bot.on(["message:text", "callback_query:data"], handler)`. */
  on(filter: UpdateFilter | UpdateFilter[], handler: Middleware<Context<S>>): this { this.router.on(filter, handler); return this; }
  /** Registers a handler for exact text or a regular expression, mirroring familiar frameworks. */
  hears(trigger: string | RegExp, handler: Middleware<Context<S>>): this {
    if (trigger instanceof RegExp) this.router.regex(trigger, handler);
    else this.router.text(trigger, handler);
    return this;
  }
  /**
   * Sets the error boundary for update handlers. When set, handler failures are
   * passed here instead of rejecting `handleUpdate()` (webhooks answer 200).
   */
  catch(handler: (error: unknown, ctx: Context<S>) => void | Promise<void>): this { this.errorHandler = handler; return this; }
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
    this.startupLog("bot.initializing", {});
    const standaloneBanner = this.brandingActive && !this.activeBanner;
    const animation = this.brandingActive ? undefined : startTerminalAnimation("Connecting to Telegram and initializing bot");
    if (standaloneBanner) printTeleBibzBanner({ subtitle: "Connecting to Telegram..." });
    try {
      this.me = await this.api.methods.getMe();
      this.statusValue = "initialized";
      this.startupLog("bot.initialized", { botId: this.me.id, username: this.me.username });
      await this.events.emit("bot:initialized", { bot: this });
      await this.plugins.setup();
      await this.plugins.start();
      if (standaloneBanner) printStatusLine(`✓ Bot initialized as @${this.me.username ?? this.me.id}`);
      else animation?.stop("Bot initialized; ready to start");
      return this;
    } catch (error) {
      if (standaloneBanner) printStatusLine(`✗ Bot could not initialize: ${error instanceof Error ? error.message : String(error)}`);
      else animation?.stop("Error: bot could not initialize");
      throw error;
    }
  }

  async start(options: { timeout?: number; allowedUpdates?: string[]; dropPendingUpdates?: boolean } = {}): Promise<void> { await this.launch({ mode: "polling", ...options }); }

  async launch(options: { mode: "polling"; timeout?: number; allowedUpdates?: string[]; dropPendingUpdates?: boolean } = { mode: "polling" }): Promise<void> {
    if (options.mode !== "polling") throw new Error("Use createWebhookHandler() for webhook mode.");
    const runBrandingSequence = this.brandingActive && !this.activeBanner && (this.statusValue === "created" || this.statusValue === "stopped");
    if (runBrandingSequence) {
      await runStartupSequence();
      this.activeBanner = startTeleBibzBanner({ subtitle: "Connecting to Telegram..." });
    }
    try {
      await this.init();
    } catch (error) {
      if (this.activeBanner) {
        this.activeBanner.stop(`Connection failed: ${error instanceof Error ? error.message : String(error)}`, "error");
        this.activeBanner = undefined;
      }
      throw error;
    }
    if (this.activeBanner) {
      this.activeBanner.stop(`Connected as @${this.me?.username ?? this.me?.id}`);
      this.activeBanner = undefined;
    }
    if (this.statusValue === "running") return;
    if (options.dropPendingUpdates) {
      // Same mechanism Telegraf uses: drop everything Telegram is holding for
      // this bot before the first getUpdates call.
      await this.api.call("deleteWebhook", { drop_pending_updates: true } as never);
    }
    this.statusValue = "starting";
    this.startupLog("bot.starting", { mode: options.mode });
    await this.events.emit("bot:starting", { bot: this });
    this.pollingAbort = new AbortController();
    this.statusValue = "running";
    await this.events.emit("bot:started", { bot: this });
    if (this.brandingActive) printStatusLine("Listening for updates...");
    await this.poll(options.timeout ?? this.pollingOptions.timeout, options.allowedUpdates ?? this.pollingOptions.allowedUpdates, this.pollingAbort.signal);
  }

  async stop(): Promise<void> {
    if (this.statusValue === "stopped" || this.statusValue === "created") return;
    this.statusValue = "stopping";
    await this.events.emit("bot:stopping", { bot: this });
    this.pollingAbort?.abort();
    this.pollingAbort = undefined;
    // Graceful shutdown: wait for updates still being processed (bounded by
    // handlerTimeout) so sessions finish writing before plugins are disposed.
    await this.drainInFlightUpdates();
    await this.plugins.stop();
    await this.plugins.dispose();
    this.statusValue = "stopped";
    if (this.brandingActive) printStatusLine("Bot stopped.");
    else this.logger.info("bot.stopped");
    await this.events.emit("bot:stopped", { bot: this });
  }

  /** Waits (bounded by `handlerTimeout`) for updates that are still processing. */
  private async drainInFlightUpdates(): Promise<void> {
    // A handler calling stop() must not wait on its own chain (deadlock); it
    // keeps running in the background, exactly like Telegraf.
    const current = this.currentUpdateChain.getStore();
    const inFlight = [...this.chatChains.values()].filter((chain) => chain !== current);
    if (inFlight.length === 0) return;
    this.logger.info("bot.draining_updates", { inFlight: inFlight.length });
    await this.withTimeout(Promise.allSettled(inFlight), this.handlerTimeoutMs, -1);
  }

  async restart(): Promise<void> { await this.stop(); await this.start(); }

  async health(): Promise<HealthStatus> {
    try { const bot = await this.api.methods.getMe(); return { status: this.statusValue, apiReachable: true, bot, checkedAt: new Date().toISOString() }; }
    catch (error) { return { status: this.statusValue, apiReachable: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) }; }
  }

  async getMe(): Promise<User> { const me = await this.api.methods.getMe(); this.me = me; return me; }
  async setCommands(commands: BotCommand[], scope?: BotCommandScope, languageCode?: string): Promise<true> { return this.api.call("setMyCommands", { commands, scope, language_code: languageCode } as never) as Promise<true>; }
  async deleteCommands(scope?: BotCommandScope, languageCode?: string): Promise<true> { return this.api.call("deleteMyCommands", { scope, language_code: languageCode } as never) as Promise<true>; }

  /**
   * Downloads a Telegram file by `file_id`: resolves it with `getFile`, then
   * fetches the raw bytes via the transport's download endpoint. Pass
   * `destination` to also persist the bytes to a local file path. The
   * returned `url` is valid for at least one hour; Telegram caps downloads
   * at 20 MB.
   */
  async downloadFile(fileId: string, options: { signal?: AbortSignal; destination?: string } = {}): Promise<DownloadedFile> {
    const downloaded = await this.api.downloadFile(fileId, options.signal !== undefined ? { signal: options.signal } : {});
    if (options.destination !== undefined) {
      await writeFile(options.destination, downloaded.bytes);
      return { ...downloaded, savedTo: options.destination };
    }
    return downloaded;
  }

  /**
   * Handles a single update. Updates for different chats run in parallel;
   * updates for the same chat are processed strictly in arrival order so
   * sessions, wizards, and conversations never interleave. Rejects for this
   * update's failure (as before) without affecting other updates.
   *
   * `options.webhookReply` installs a Telegraf-style responder: the first
   * outgoing API call during this update is answered through the webhook HTTP
   * response instead of a separate request, and resolves with `true` because
   * Telegram never sends the method result back to a webhook response.
   */
  async handleUpdate(update: Update, options: { webhookReply?: WebhookReplySink } = {}): Promise<void> {
    const key = this.conversationKey(update);
    const previous = this.chatChains.get(key);
    const execute = options.webhookReply === undefined
      ? () => this.processUpdate(update)
      : () => runWithWebhookReply(options.webhookReply!, () => this.processUpdate(update));
    // The chain waits for the real completion so same-chat ordering holds
    // even when the caller-facing await below is released by a timeout. The
    // chain is installed as the current AsyncLocalStorage value so a handler
    // calling bot.stop() is excluded from the drain set.
    const run: Promise<void> = (previous ?? Promise.resolve()).catch(() => undefined).then(() => this.currentUpdateChain.run(tail, execute));
    const tail: Promise<void> = run.then(() => undefined, () => undefined);
    this.chatChains.set(key, tail);
    void tail.then(() => {
      if (this.chatChains.get(key) === tail) this.chatChains.delete(key);
    });
    try {
      await this.withTimeout(run, this.handlerTimeoutMs, update.update_id);
    } catch (error) {
      if (!(error instanceof UpdateTimeoutError)) throw error;
      // A timed-out update follows the same error flow as a failed handler;
      // the handler itself keeps running to completion in the background.
      this.logger.error("update.handler_timeout", { updateId: update.update_id, timeoutMs: this.handlerTimeoutMs });
      await this.events.emit("update:error", { update, error });
      await this.events.emit("bot:error", { bot: this, error });
      if (this.errorHandler) {
        await this.errorHandler(error, new Context<S>({ update, api: this.api, session: {} as S, services: this.services, me: this.me }));
        return;
      }
      throw error;
    }
  }

  /** Rejects with `UpdateTimeoutError` after `timeoutMs` unless `promise` settles first; `timeoutMs <= 0` or a non-finite value disables the guard. */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number, updateId: number): Promise<T> {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new UpdateTimeoutError(updateId, timeoutMs)), timeoutMs);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }

  /**
   * Handles a whole batch of updates at once: every chat in the batch is
   * processed immediately (parallel across chats, ordered per chat), so a
   * burst of 1000 messages is not stuck behind one slow handler. Individual
   * handler failures are logged, emitted as `update:error`, and passed to the
   * `catch()` error boundary; they never reject this promise.
   */
  async handleUpdates(updates: readonly Update[]): Promise<void> {
    await Promise.all(updates.map(async (update) => {
      try {
        await this.handleUpdate(update);
      } catch {
        // Already logged and emitted by processUpdate; the polling loop must
        // keep flowing no matter how many handlers failed.
      }
    }));
  }

  /**
   * Sends to many chats in parallel — built for broadcasts to 1000+ users.
   * There is no proactive cooldown: every chat is attempted at once (up to
   * `concurrency`). When Telegram answers 429, the send is retried
   * automatically after exactly the `retry_after` delay Telegram ordered, so
   * bursts deliver completely instead of failing.
   */
  async broadcast(chatIds: readonly ChatId[], send: (chatId: ChatId) => Promise<unknown>, options?: BroadcastOptions): Promise<BroadcastReport> {
    return runBroadcast(chatIds, send, options);
  }

  /** Runs init() once even when many updates arrive concurrently; never claims a webhook reply slot. */
  private ensureInitialized(): Promise<void> {
    if (this.me) return Promise.resolve();
    if (!this.initOnce) {
      this.initOnce = runWithoutWebhookReply(() => this.init()).then(() => { this.initOnce = undefined; }, (error: unknown) => {
        this.initOnce = undefined;
        throw error;
      });
    }
    return this.initOnce;
  }

  private async processUpdate(update: Update): Promise<void> {
    await this.updateLimiter.run(() => this.runUpdate(update));
  }

  private async runUpdate(update: Update): Promise<void> {
    this.logger.incoming(describeIncomingUpdate(update));
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
    if (!this.me) await this.ensureInitialized();
    if (!this.me) return;
    const ctx = new this.contextType({ update, api: this.api, session, services: this.services, me: this.me });
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
      if (this.errorHandler) {
        // With an error boundary registered, the failure is considered handled:
        // webhooks answer 200 and polling continues without rethrowing.
        await this.errorHandler(error, ctx);
        return;
      }
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
        // Confirm the whole batch first, then process it: updates run in
        // parallel across chats (ordered per chat) instead of one by one.
        for (const update of updates) {
          this.offset = Math.max(this.offset, update.update_id + 1);
        }
        await this.handleUpdates(updates);
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
