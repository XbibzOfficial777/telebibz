import type { ResponseParameters, TelegramResponse } from "./types.js";

export type TelegramErrorKind = "retryable" | "rate-limit" | "authentication" | "validation" | "network" | "server" | "unknown";

export class TelegramError extends Error {
  override readonly name: string = "TelegramError";
  readonly kind: TelegramErrorKind;
  readonly errorCode: number | undefined;
  readonly parameters: ResponseParameters | undefined;
  readonly method: string;
  readonly payload: unknown;
  readonly status: number | undefined;

  constructor(message: string, options: { method: string; payload: unknown; errorCode?: number; parameters?: ResponseParameters; status?: number; kind?: TelegramErrorKind; cause?: unknown }) {
    super(message, { cause: options.cause });
    this.method = options.method;
    this.payload = options.payload;
    this.errorCode = options.errorCode;
    this.parameters = options.parameters;
    this.status = options.status;
    this.kind = options.kind ?? classifyTelegramError(options.errorCode, options.status);
  }

  get retryAfter(): number | undefined { return this.parameters?.retry_after; }
  get migrateToChatId(): number | undefined { return this.parameters?.migrate_to_chat_id; }
}

export class TelegramRateLimitError extends TelegramError {
  override readonly name: string = "TelegramRateLimitError";
  constructor(message: string, options: ConstructorParameters<typeof TelegramError>[1]) { super(message, { ...options, kind: "rate-limit" }); }
}
export class TelegramAuthError extends TelegramError {
  override readonly name: string = "TelegramAuthError";
  constructor(message: string, options: ConstructorParameters<typeof TelegramError>[1]) { super(message, { ...options, kind: "authentication" }); }
}
export class TelegramValidationError extends TelegramError {
  override readonly name: string = "TelegramValidationError";
  constructor(message: string, options: ConstructorParameters<typeof TelegramError>[1]) { super(message, { ...options, kind: "validation" }); }
}
export class TelegramNetworkError extends TelegramError {
  override readonly name: string = "TelegramNetworkError";
  constructor(message: string, options: ConstructorParameters<typeof TelegramError>[1]) { super(message, { ...options, kind: "network" }); }
}

export function classifyTelegramError(errorCode?: number, status?: number): TelegramErrorKind {
  if (errorCode === 429) return "rate-limit";
  if (errorCode === 401 || status === 401 || status === 403) return "authentication";
  if (errorCode !== undefined && errorCode >= 400 && errorCode < 500) return "validation";
  if (status !== undefined && status >= 500) return "server";
  return "unknown";
}

export function telegramErrorFromResponse<T>(response: TelegramResponse<T>, context: { method: string; payload: unknown; status?: number }): TelegramError {
  const message = response.description ?? `Telegram API request failed for ${context.method}`;
  const options: ConstructorParameters<typeof TelegramError>[1] = { method: context.method, payload: context.payload };
  if (response.error_code !== undefined) options.errorCode = response.error_code;
  if (response.parameters !== undefined) options.parameters = response.parameters;
  if (context.status !== undefined) options.status = context.status;
  if (response.error_code === 429) return new TelegramRateLimitError(message, options);
  if (response.error_code === 401 || context.status === 401 || context.status === 403) return new TelegramAuthError(message, options);
  if (response.error_code !== undefined && response.error_code >= 400 && response.error_code < 500) return new TelegramValidationError(message, options);
  return new TelegramError(message, options);
}
