import type { CallbackQuery, Message, Update } from "../api/types.js";

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";
export type LogFormat = "pretty" | "json";
export type LogContext = Record<string, unknown>;
export interface LogEntry { timestamp: string; level: Exclude<LogLevel, "silent">; event: string; context?: LogContext; /** Pre-rendered human line; the default sink writes it verbatim. */ text?: string }
export type LoggerSink = (entry: LogEntry) => void;

// Higher number = more verbose. `silent` must sort BELOW `error` so that every
// message level is filtered out (a value above all others would let every
// message through, including errors).
const priorities: Record<LogLevel, number> = { silent: -1, error: 0, warn: 1, info: 2, debug: 3, trace: 4 };
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
  if (update.business_message) return "business_message";
  if (update.edited_business_message) return "edited_business_message";
  if (update.guest_message) return "guest_message";
  if (update.edited_guest_message) return "edited_guest_message";
  if (update.message_reaction) return "message_reaction";
  if (update.message_reaction_count) return "message_reaction_count";
  if (update.chat_boost) return "chat_boost";
  if (update.removed_chat_boost) return "removed_chat_boost";
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

export interface IncomingLog {
  /** Displayed as "[ => ] {kind} From ..." — e.g. "Message", "Callback", "Update". */
  kind: string;
  fromId?: number | string | undefined;
  nickname?: string | undefined;
  contentLabel?: string | undefined;
  content?: string | undefined;
  truncated?: boolean | undefined;
  context?: LogContext | undefined;
}

export const INCOMING_TEXT_LIMIT = 50;

function padNumber(value: number): string { return String(value).padStart(2, "0"); }

/** Formats a date as `dd/mm/yyyy hh:mm:ss` in local time. */
export function formatLocalStamp(date = new Date()): string {
  return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
}

function truncateForDisplay(value: string, limit = INCOMING_TEXT_LIMIT): { text: string; truncated: boolean } {
  if (value.length <= limit) return { text: value, truncated: false };
  return { text: `${value.slice(0, limit)}…`, truncated: true };
}

function nicknameFromUser(user: { id: number; first_name?: string; last_name?: string; username?: string } | undefined): string | undefined {
  if (!user) return undefined;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return name.length > 0 ? name : user.username ?? String(user.id);
}

function messageMediaType(message: Message): string | undefined {
  for (const key of ["photo", "video", "video_note", "animation", "document", "audio", "voice", "sticker", "location", "venue", "contact", "dice", "poll", "story", "paid_media"]) {
    if (message[key as keyof Message] !== undefined) return key;
  }
  return undefined;
}

/**
 * Builds the human-readable description of an incoming update used for the
 * `[ => ] Message From ...` terminal lines. Text messages and commands are
 * truncated to 50 characters; callback button data is shown in full.
 */
export function describeIncomingUpdate(update: Update): IncomingLog {
  const callback = update.callback_query;
  if (callback) {
    const result: IncomingLog = { kind: "Callback", fromId: callback.from.id, nickname: nicknameFromUser(callback.from), contentLabel: "Data", content: callback.data };
    return result;
  }
  const message = (update.message ?? update.edited_message ?? update.channel_post ?? update.edited_channel_post ?? update.business_message ?? update.edited_business_message ?? update.guest_message ?? update.edited_guest_message) as Message | undefined;
  if (message) {
    const from = message.from;
    const nickname = nicknameFromUser(from) ?? (message.chat.title !== undefined ? String(message.chat.title) : message.chat.id !== undefined ? String(message.chat.id) : undefined);
    const input: IncomingLog = { kind: "Message", fromId: from?.id ?? message.chat.id, nickname };
    const text = message.text;
    if (text !== undefined) {
      const truncated = truncateForDisplay(text);
      input.contentLabel = "Text";
      input.content = truncated.text;
      input.truncated = truncated.truncated;
    } else if (message.caption !== undefined) {
      const truncated = truncateForDisplay(message.caption);
      input.contentLabel = "Caption";
      input.content = truncated.text;
      input.truncated = truncated.truncated;
    } else {
      const media = messageMediaType(message);
      if (media !== undefined) input.contentLabel = media === "photo" ? "Photo" : media.replace(/_/g, " ").replace(/^./, (character) => character.toUpperCase());
    }
    return input;
  }
  const inline = update.inline_query;
  if (inline) {
    const truncated = truncateForDisplay(inline.query);
    return { kind: "Inline Query", fromId: inline.from.id, nickname: nicknameFromUser(inline.from), contentLabel: "Query", content: truncated.text, truncated: truncated.truncated };
  }
  const chosen = update.chosen_inline_result;
  if (chosen) return { kind: "Inline Result", fromId: chosen.from.id, nickname: nicknameFromUser(chosen.from), contentLabel: "Result", content: chosen.result_id };
  const chatScoped = update.chat_member ?? update.my_chat_member ?? update.chat_join_request;
  if (chatScoped) {
    return { kind: "Update", fromId: chatScoped.from.id, nickname: nicknameFromUser(chatScoped.from), contentLabel: "Chat", content: chatScoped.chat.title ?? String(chatScoped.chat.id) };
  }
  const reaction = update.message_reaction as { from?: { id: number; first_name?: string; last_name?: string; username?: string } } | undefined;
  const reactor = nicknameFromUser(reaction?.from);
  if (reactor) return { kind: "Reaction", fromId: reaction?.from?.id, nickname: reactor };
  return { kind: "Update", context: { type: updateType(update) } };
}

export function summarizeUpdate(update: Update, includeContent = false): UpdateSummary {
  const callback: CallbackQuery | undefined = update.callback_query;
  const message = (update.message ?? update.edited_message ?? update.channel_post ?? update.edited_channel_post ?? update.business_message ?? update.edited_business_message ?? update.guest_message ?? update.edited_guest_message ?? callback?.message) as Message | undefined;
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
    if (typeof entry.text === "string") {
      stream.write(`${redactString(entry.text)}\n`);
      return;
    }
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

  /**
   * Logs an incoming update as the human-readable terminal line:
   * `[ => ] Message From {id} {nickname} {dd/mm/yyyy} {hh:mm:ss}` followed by
   * an indented content line. In `json` format it emits a structured entry
   * with the event name `update.received`.
   */
  incoming(input: IncomingLog): void {
    if (priorities.info > priorities[this.level]) return;
    if (this.format === "json") {
      const context: LogContext = { kind: input.kind, ...(input.fromId !== undefined ? { fromId: input.fromId } : {}), ...(input.nickname !== undefined ? { nickname: input.nickname } : {}), ...(input.content !== undefined ? { content: input.content } : {}), ...(input.truncated ? { truncated: true } : {}), ...input.context };
      this.write("info", "update.received", context);
      return;
    }
    const stamp = formatLocalStamp();
    const identity = [input.fromId !== undefined ? String(input.fromId) : undefined, input.nickname].filter(Boolean).join(" ");
    const arrow = this.color ? `\u001b[36m\u001b[1m[ => ]\u001b[0m` : "[ => ]";
    const kind = this.color ? `\u001b[1m${input.kind}\u001b[0m` : input.kind;
    const header = `${arrow} ${kind} From ${identity} ${this.color ? `\u001b[2m${stamp}\u001b[0m` : stamp}`;
    const lines = [redactString(header)];
    if (input.content !== undefined || input.contentLabel !== undefined) {
      const label = input.contentLabel ?? "Content";
      const value = input.content ?? "";
      const contentLine = `        ↳ ${label}: ${value}`;
      lines.push(this.color ? `\u001b[2m${redactString(contentLine)}\u001b[0m` : redactString(contentLine));
    }
    this.sink({ timestamp: new Date().toISOString(), level: "info", event: "update.received", text: lines.join("\n") });
  }

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
