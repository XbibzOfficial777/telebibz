import type { CallbackQuery, Update } from "../api/types.js";

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";
export type LogFormat = "pretty" | "json";
export type LogContext = Record<string, unknown>;
export interface LogEntry { timestamp: string; level: Exclude<LogLevel, "silent">; event: string; context?: LogContext }
export type LoggerSink = (entry: LogEntry) => void;

const priorities: Record<LogLevel, number> = { silent: 99, error: 0, warn: 1, info: 2, debug: 3, trace: 4 };
const defaultRedactKeys = ["token", "secret", "password", "authorization", "cookie", "private_key", "api_key", "npm_token", "bot_token"];
const ANSI = {
  reset: "\u001b[0m",
  dim: "\u001b[2m",
  red: "\u001b[31m",
  yellow: "\u001b[33m",
  green: "\u001b[32m",
  cyan: "\u001b[36m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
} as const;

export interface LoggerOptions {
  level?: LogLevel;
  format?: LogFormat;
  color?: boolean;
  sink?: LoggerSink;
  includeUpdateContent?: boolean;
  redactKeys?: readonly string[];
  context?: LogContext;
  stream?: NodeJS.WriteStream;
}

function isObject(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function shouldRedact(key: string, keys: readonly string[]): boolean { const normalized = key.toLowerCase().replace(/[-_]/g, ""); return keys.some((candidate) => normalized.includes(candidate.toLowerCase().replace(/[-_]/g, ""))); }
function redactString(value: string): string {
  return value
    .replace(/\b\d{6,12}:[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_TELEGRAM_TOKEN]")
    .replace(/\bnpm_[A-Za-z0-9]{20,}\b/g, "[REDACTED_NPM_TOKEN]");
}

function safeValue(value: unknown, keys: readonly string[], seen = new WeakSet<object>()): unknown {
  if (typeof value === "string") return redactString(value);
  if (typeof value === "bigint") return `${value}n`;
  if (value instanceof Error) return safeValue({ name: value.name, message: value.message, stack: value.stack }, keys, seen);
  if (Array.isArray(value)) {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    return value.map((item) => safeValue(item, keys, seen));
  }
  if (!isObject(value)) return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) result[key] = shouldRedact(key, keys) ? "[REDACTED]" : safeValue(nested, keys, seen);
  return result;
}

export function redact(value: unknown, keys: readonly string[] = defaultRedactKeys): unknown { return safeValue(value, keys); }

function updateType(update: Update): string {
  if (update.callback_query) return "callback_query";
  if (update.inline_query) return "inline_query";
  if (update.message) return "message";
  if (update.edited_message) return "edited_message";
  if (update.channel_post) return "channel_post";
  if (update.edited_channel_post) return "edited_channel_post";
  if (update.my_chat_member) return "my_chat_member";
  if (update.chat_member) return "chat_member";
  if (update.chat_join_request) return "chat_join_request";
  if (update.poll) return "poll";
  if (update.poll_answer) return "poll_answer";
  return "unknown";
}

export interface UpdateSummary { updateId: number; type: string; chatId?: number | string; fromUserId?: number; messageId?: number; text?: string; callbackData?: string }

export function summarizeUpdate(update: Update, includeContent = false): UpdateSummary {
  const callback: CallbackQuery | undefined = update.callback_query;
  const message = update.message ?? update.edited_message ?? update.channel_post ?? update.edited_channel_post ?? update.business_message ?? update.edited_business_message ?? callback?.message;
  const summary: UpdateSummary = { updateId: update.update_id, type: updateType(update) };
  if (message?.chat?.id !== undefined) summary.chatId = message.chat.id;
  if (message?.from?.id !== undefined) summary.fromUserId = message.from.id;
  if (message?.message_id !== undefined) summary.messageId = message.message_id;
  if (includeContent) {
    const text = message?.text ?? message?.caption;
    if (text !== undefined) summary.text = text;
    if (callback?.data !== undefined) summary.callbackData = callback.data;
  }
  return summary;
}

function levelColor(level: LogEntry["level"]): string {
  if (level === "error") return ANSI.red;
  if (level === "warn") return ANSI.yellow;
  if (level === "debug") return ANSI.blue;
  if (level === "trace") return ANSI.magenta;
  return ANSI.green;
}

function formatEntry(entry: LogEntry, color: boolean, format: LogFormat): string {
  if (format === "json") {
    const line = JSON.stringify(entry);
    return color ? `${ANSI.dim}${line}${ANSI.reset}` : line;
  }
  const time = entry.timestamp.slice(11, 23);
  const label = entry.level.toUpperCase().padEnd(5, " ");
  const context = entry.context && Object.keys(entry.context).length ? ` ${JSON.stringify(entry.context)}` : "";
  const line = `${time} ${label} ${entry.event}${context}`;
  return color ? `${levelColor(entry.level)}${line}${ANSI.reset}` : line;
}

function createDefaultSink(options: Pick<LoggerOptions, "color" | "format" | "stream">, redactKeys: readonly string[]): LoggerSink {
  const stream = options.stream ?? process.stdout;
  const color = options.color ?? Boolean(stream.isTTY && !process.env.NO_COLOR);
  const format = options.format ?? "pretty";
  return (entry) => {
    const safeEntry = redact(entry, redactKeys) as LogEntry;
    const line = formatEntry(safeEntry, color, format);
    stream.write(`${line}\n`);
  };
}

export class Logger {
  readonly level: LogLevel;
  readonly format: LogFormat;
  readonly color: boolean;
  readonly includeUpdateContent: boolean;
  private readonly sink: LoggerSink;
  private readonly redactKeys: readonly string[];
  private readonly baseContext: LogContext;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? "info";
    this.format = options.format ?? "pretty";
    const stream = options.stream ?? process.stdout;
    this.color = options.color ?? Boolean(stream.isTTY && !process.env.NO_COLOR);
    this.includeUpdateContent = options.includeUpdateContent ?? false;
    this.redactKeys = options.redactKeys ?? defaultRedactKeys;
    this.sink = options.sink ?? createDefaultSink({ color: this.color, format: this.format, stream }, this.redactKeys);
    this.baseContext = options.context ?? {};
  }

  child(context: LogContext): Logger { return new Logger({ level: this.level, format: this.format, color: this.color, sink: this.sink, includeUpdateContent: this.includeUpdateContent, redactKeys: this.redactKeys, context: { ...this.baseContext, ...context } }); }
  trace(event: string, context?: LogContext): void { this.write("trace", event, context); }
  debug(event: string, context?: LogContext): void { this.write("debug", event, context); }
  info(event: string, context?: LogContext): void { this.write("info", event, context); }
  warn(event: string, context?: LogContext): void { this.write("warn", event, context); }
  error(event: string, context?: LogContext): void { this.write("error", event, context); }

  private write(level: Exclude<LogLevel, "silent">, event: string, context: LogContext = {}): void {
    if (priorities[level] > priorities[this.level]) return;
    const merged = { ...this.baseContext, ...context };
    const safe = redact(merged, this.redactKeys) as LogContext;
    const entry: LogEntry = { timestamp: new Date().toISOString(), level, event };
    if (Object.keys(safe).length) entry.context = safe;
    this.sink(entry);
  }
}

export function createLogger(options?: LoggerOptions): Logger { return new Logger(options); }
