import { readFile } from "node:fs/promises";
import { basename, isAbsolute, resolve } from "node:path";
import { buffer as streamBuffer } from "node:stream/consumers";
import type { InputFile, TelegramResponse } from "./types.js";
import { TelegramNetworkError } from "./errors.js";

export interface TransportRequest {
  method: string;
  payload?: Record<string, unknown>;
  signal?: AbortSignal;
  /** Per-request timeout in milliseconds; overrides the transport default. */
  timeoutMs?: number;
}

export interface TransportResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: TelegramResponse<T>;
}

export interface Transport {
  request<T>(request: TransportRequest): Promise<TransportResponse<T>>;
  /**
   * Builds the direct-download URL for a `file_path` returned by `getFile`.
   * Optional: custom transports that cannot download files omit it.
   */
  fileUrl?(filePath: string): string;
  /**
   * Downloads the raw bytes behind a `file_path` returned by `getFile`.
   * Optional: custom transports that cannot download files omit it.
   */
  download?(filePath: string, signal?: AbortSignal): Promise<Uint8Array>;
}

export interface FetchTransportOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  jitter?: number;
  headers?: HeadersInit;
  /**
   * When Telegram answers 429 (rate limit), pause NEW requests until the
   * `retry_after` window Telegram ordered has elapsed. Default `true`.
   * This is never a proactive cooldown: the only waiting ever done is the
   * delay Telegram itself demands, so a flood on one method protects the rest
   * of the traffic instead of every request hitting the same 429 wall.
   */
  floodGate?: boolean;
}

export class FetchTransport implements Transport {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly backoffMs: number;
  private readonly maxBackoffMs: number;
  private readonly jitter: number;
  private readonly headers: HeadersInit;
  private readonly floodGate: boolean;
  /** Timestamp (ms) until which Telegram asked us to stop sending. */
  private floodUntil = 0;

  constructor(options: FetchTransportOptions = {}) {
    this.baseUrl = (options.baseUrl ?? "https://api.telegram.org").replace(/\/$/, "");
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) throw new Error("A fetch implementation is required.");
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.retries = options.retries ?? 2;
    this.backoffMs = options.backoffMs ?? 250;
    this.maxBackoffMs = options.maxBackoffMs ?? 8_000;
    this.jitter = options.jitter ?? 0.2;
    this.headers = options.headers ?? {};
    this.floodGate = options.floodGate ?? true;
  }

  /** Waits out the remainder of a Telegram-ordered flood window, if any. */
  private async waitForFloodWindow(): Promise<void> {
    if (!this.floodGate) return;
    const waitMs = this.floodUntil - Date.now();
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  /** Extends the flood window when Telegram answers 429 or sends retry_after. */
  private recordFloodWindow(data: TelegramResponse<unknown>): void {
    if (!this.floodGate) return;
    if (data.ok || (data.error_code !== 429 && data.parameters?.retry_after === undefined)) return;
    const retryAfterMs = Math.max(0, (data.parameters?.retry_after ?? 0) * 1000);
    this.floodUntil = Math.max(this.floodUntil, Date.now() + retryAfterMs);
  }

  /** Direct-download URL for a `file_path` from `getFile` (`/bot<token>` → `/file/bot<token>`). */
  fileUrl(filePath: string): string {
    const downloadBase = /\/bot[^/]+$/.test(this.baseUrl) ? this.baseUrl.replace(/\/bot([^/]+)$/, "/file/bot$1") : this.baseUrl;
    return `${downloadBase}/${filePath}`;
  }

  /** Downloads the raw bytes behind a `file_path` from `getFile` (Telegram caps downloads at 20 MB). */
  async download(filePath: string, signal?: AbortSignal): Promise<Uint8Array> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error("File download timed out")), Math.max(this.timeoutMs, 120_000));
    const onAbort = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", onAbort, { once: true });
    try {
      const response = await this.fetchImpl(this.fileUrl(filePath), { method: "GET", signal: controller.signal });
      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new TelegramNetworkError(`Failed to download ${filePath}: HTTP ${response.status} ${response.statusText || "request failed"}`, { method: "getFile", payload: { file_path: filePath }, status: response.status, cause: bodyText.slice(0, 512) });
      }
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      if (error instanceof TelegramNetworkError) throw error;
      if (signal?.aborted) throw error;
      throw new TelegramNetworkError(`Failed to download ${filePath}: ${error instanceof Error ? error.message : String(error)}`, { method: "getFile", payload: { file_path: filePath }, cause: error });
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", onAbort);
    }
  }

  async request<T>({ method, payload = {}, signal, timeoutMs }: TransportRequest): Promise<TransportResponse<T>> {
    const effectiveTimeoutMs = timeoutMs ?? this.timeoutMs;
    const hasUpload = await containsUpload(payload);
    let body: BodyInit | undefined;
    const headers = new Headers(this.headers);
    if (hasUpload) {
      const form = new FormData();
      for (const [key, value] of Object.entries(payload)) await appendFormValue(form, key, value);
      body = form;
    } else {
      headers.set("content-type", "application/json; charset=utf-8");
      body = JSON.stringify(payload);
    }

    let attempt = 0;
    while (true) {
      await this.waitForFloodWindow();
      let responseStatus: number | undefined;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(new Error(`Request timed out after ${effectiveTimeoutMs}ms`)), effectiveTimeoutMs);
      const onAbort = () => controller.abort(signal?.reason);
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const normalizedMethod = method.replace(/^\//, "");
        const response = await this.fetchImpl(`${this.baseUrl}/${normalizedMethod}`, {
          method: "POST",
          headers,
          body,
          signal: controller.signal,
        });
        responseStatus = response.status;
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.length > 0 && !/json/i.test(contentType)) {
          const bodyText = await response.text();
          const error = new TelegramNetworkError(`HTTP ${response.status} ${response.statusText || "request failed"} returned a non-JSON response`, { method, payload, status: response.status, cause: bodyText.slice(0, 512) });
          if (isRetryableStatus(response.status) && attempt < this.retries) {
            await waitBeforeRetry(attempt, this.backoffMs, this.maxBackoffMs, this.jitter);
            attempt += 1;
            continue;
          }
          throw error;
        }
        const data = await response.json() as TelegramResponse<T>;
        this.recordFloodWindow(data);
        if (!data.ok && isRetryableResponse(response.status, data) && attempt < this.retries) {
          const retryAfterMs = data.parameters?.retry_after === undefined ? undefined : Math.max(0, data.parameters.retry_after * 1000);
          await waitBeforeRetry(attempt, this.backoffMs, this.maxBackoffMs, this.jitter, retryAfterMs);
          attempt += 1;
          continue;
        }
        return { status: response.status, headers: response.headers, data };
      } catch (error) {
        if (signal?.aborted) throw error;
        if (error instanceof TelegramNetworkError && error.status !== undefined) {
          if (isRetryableStatus(error.status) && attempt < this.retries) {
            await waitBeforeRetry(attempt, this.backoffMs, this.maxBackoffMs, this.jitter);
            attempt += 1;
            continue;
          }
          throw error;
        }
        if (responseStatus !== undefined && error instanceof SyntaxError) {
          const parseError = new TelegramNetworkError(`HTTP ${responseStatus} ${responseStatus >= 500 ? "server" : "request"} returned invalid JSON`, { method, payload, status: responseStatus, cause: error });
          if (isRetryableStatus(responseStatus) && attempt < this.retries) {
            await waitBeforeRetry(attempt, this.backoffMs, this.maxBackoffMs, this.jitter);
            attempt += 1;
            continue;
          }
          throw parseError;
        }
        if (attempt >= this.retries || !isRetryableNetworkError(error)) {
          throw new TelegramNetworkError(error instanceof Error ? error.message : "Network request failed", { method, payload, cause: error });
        }
        await waitBeforeRetry(attempt, this.backoffMs, this.maxBackoffMs, this.jitter);
        attempt += 1;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", onAbort);
      }
    }
  }
}

function isRetryableStatus(status: number): boolean { return status >= 500 || status === 429; }

function isRetryableResponse(status: number, data: TelegramResponse<unknown>): boolean { return isRetryableStatus(status) || data.error_code === 429; }

async function waitBeforeRetry(attempt: number, backoffMs: number, maxBackoffMs: number, jitter: number, retryAfterMs?: number): Promise<void> {
  const exponential = Math.min(maxBackoffMs, backoffMs * 2 ** attempt);
  const spread = exponential * jitter;
  const jittered = Math.max(0, exponential - spread + Math.random() * spread * 2);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, Math.max(jittered, retryAfterMs ?? 0)));
}

function isRetryableNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  return error.name === "AbortError" || /network|fetch|socket|timeout|temporar/i.test(error.message);
}

async function containsUpload(value: unknown): Promise<boolean> {
  if (value instanceof Uint8Array || value instanceof ArrayBuffer || value instanceof Blob) return true;
  if (value instanceof ReadableStream) return true;
  if (typeof value === "string") return false;
  if (value && typeof value === "object" && "source" in value) {
    const source = (value as { source: unknown }).source;
    // A path-like string source means the transport reads the file from disk
    // and must switch to multipart — a plain string source is just a file_id.
    if (typeof source === "string" && (isAbsolute(source) || source.startsWith("./") || source.startsWith("../"))) return true;
    return containsUpload(source);
  }
  if (typeof (value as { pipe?: unknown })?.pipe === "function") return true;
  if (Array.isArray(value)) {
    for (const item of value) if (await containsUpload(item)) return true;
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) if (await containsUpload(item)) return true;
  }
  return false;
}

/** Converts a Node.js or web ReadableStream to a Blob by draining it. */
async function streamToBlob(stream: unknown): Promise<Blob> {
  if (stream instanceof ReadableStream) return new Blob([await new Response(stream).arrayBuffer()]);
  const bytes = await streamBuffer(stream as NodeJS.ReadableStream);
  return new Blob([bytes]);
}

async function appendFormValue(form: FormData, key: string, value: unknown): Promise<void> {
  if (value === undefined || value === null) return;
  if (value instanceof Uint8Array) { form.append(key, new Blob([value as unknown as BlobPart])); return; }
  if (value instanceof ArrayBuffer) { form.append(key, new Blob([value])); return; }
  if (value instanceof Blob) { form.append(key, value); return; }
  if (value instanceof ReadableStream || typeof (value as { pipe?: unknown })?.pipe === "function") { form.append(key, await streamToBlob(value)); return; }
  if (value && typeof value === "object" && "source" in value) {
    const upload = value as { source: unknown; filename?: string };
    if (typeof upload.source === "string" && (isAbsolute(upload.source) || upload.source.startsWith("./") || upload.source.startsWith("../"))) {
      const filePath = resolve(upload.source);
      const bytes = await readFile(filePath);
      form.append(key, new Blob([bytes]), upload.filename ?? basename(filePath));
      return;
    }
    if (upload.filename !== undefined && upload.source instanceof Uint8Array) { form.append(key, new Blob([upload.source as unknown as BlobPart]), upload.filename); return; }
    if (upload.filename !== undefined && upload.source instanceof Blob) { form.append(key, upload.source, upload.filename); return; }
    if (upload.filename !== undefined && upload.source instanceof ArrayBuffer) { form.append(key, new Blob([upload.source]), upload.filename); return; }
    return appendFormValue(form, key, upload.source);
  }
  if (typeof value === "string") { form.append(key, value); return; }
  if (typeof value === "number" || typeof value === "boolean") { form.append(key, String(value)); return; }
  form.append(key, JSON.stringify(value));
}
