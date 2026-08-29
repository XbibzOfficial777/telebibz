import { TELEGRAM_METHOD_NAMES, type TelegramMethodName } from "../../generated/api.js";
import { claimWebhookReply } from "../core/webhook-reply.js";
import { TelegramError, telegramErrorFromResponse } from "./errors.js";
import type { ApiCallArgs, ApiParams, ApiResult, TelegramResponse } from "./types.js";
import type { Transport, TransportRequest } from "./transport.js";

export interface ApiHookContext { method: string; payload: unknown; startedAt: number; durationMs?: number; response?: TelegramResponse<unknown>; error?: unknown }
export interface ApiClientOptions { transport: Transport; hooks?: { onRequest?: (context: ApiHookContext) => void | Promise<void>; onResponse?: (context: ApiHookContext) => void | Promise<void>; onError?: (context: ApiHookContext) => void | Promise<void> } }
export type ApiMethods = { [M in TelegramMethodName]: (...args: ApiCallArgs<M>) => Promise<ApiResult<M>> };

export class ApiClient {
  readonly methods: ApiMethods;
  private readonly transport: Transport;
  private readonly hooks: NonNullable<ApiClientOptions["hooks"]>;
  constructor(options: ApiClientOptions) {
    this.transport = options.transport;
    this.hooks = options.hooks ?? {};
    const knownMethods = new Set<string>(TELEGRAM_METHOD_NAMES);
    this.methods = new Proxy({}, {
      get: (_target, property: string | symbol) => {
        if (typeof property !== "string") return undefined;
        if (property === "then") return undefined;
        if (!knownMethods.has(property)) throw new TypeError(`Unknown Telegram API method: ${property}`);
        return (payload?: unknown) => this.request(property as TelegramMethodName, payload as never);
      },
    }) as ApiMethods;
  }
  async call<M extends TelegramMethodName>(method: M, ...args: ApiCallArgs<M>): Promise<ApiResult<M>> { return this.request<M>(method, args[0] as ApiParams<M> | undefined); }
  async request<M extends TelegramMethodName>(method: M, payload?: ApiParams<M>, signal?: AbortSignal, options?: { timeoutMs?: number }): Promise<ApiResult<M>> {
    // Webhook reply mode: the first call while handling a webhook update is
    // answered through the webhook HTTP response instead of the transport.
    const webhookReply = claimWebhookReply(method, payload as Record<string, unknown> | undefined);
    if (webhookReply) {
      const context: ApiHookContext = { method, payload, startedAt: Date.now() };
      await this.hooks.onRequest?.(context);
      context.durationMs = Date.now() - context.startedAt;
      context.response = webhookReply.data as unknown as TelegramResponse<unknown>;
      await this.hooks.onResponse?.(context);
      return webhookReply.data.result as ApiResult<M>;
    }
    const context: ApiHookContext = { method, payload, startedAt: Date.now() };
    await this.hooks.onRequest?.(context);
    try {
      const request: TransportRequest = { method };
      if (payload !== undefined) request.payload = payload as Record<string, unknown>;
      if (signal !== undefined) request.signal = signal;
      if (options?.timeoutMs !== undefined) request.timeoutMs = options.timeoutMs;
      const response = await this.transport.request<ApiResult<M>>(request);
      context.durationMs = Date.now() - context.startedAt;
      context.response = response.data as TelegramResponse<unknown>;
      await this.hooks.onResponse?.(context);
      if (!response.data.ok || response.data.result === undefined) throw telegramErrorFromResponse(response.data, { method, payload, status: response.status });
      return response.data.result;
    } catch (error) {
      context.durationMs = Date.now() - context.startedAt;
      context.error = error;
      await this.hooks.onError?.(context);
      if (error instanceof TelegramError) throw error;
      throw error;
    }
  }
  async raw(method: string, payload?: Record<string, unknown>, signal?: AbortSignal): Promise<unknown> {
    const request: TransportRequest = { method };
    if (payload !== undefined) request.payload = payload;
    if (signal !== undefined) request.signal = signal;
    const response = await this.transport.request(request);
    if (!response.data.ok) throw telegramErrorFromResponse(response.data, { method, payload, status: response.status });
    return response.data.result;
  }
}
