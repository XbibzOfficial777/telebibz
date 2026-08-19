import { readFile } from "node:fs/promises";
import { basename, isAbsolute, resolve } from "node:path";
import type { InputFile, TelegramResponse } from "./types.js";
import { TelegramNetworkError } from "./errors.js";

export interface TransportRequest {
  method: string;
  payload?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface TransportResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: TelegramResponse<T>;
}

export interface Transport {
  request<T>(request: TransportRequest): Promise<TransportResponse<T>>;
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
  }

  async request<T>({ method, payload = {}, signal }: TransportRequest): Promise<TransportResponse<T>> {
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
      let responseStatus: number | undefined;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(new Error(`Request timed out after ${this.timeoutMs}ms`)), this.timeoutMs);
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
  if (typeof value === "string") return false;
  if (value && typeof value === "object" && "source" in value) return containsUpload((value as { source: unknown }).source);
  if (Array.isArray(value)) {
    for (const item of value) if (await containsUpload(item)) return true;
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) if (await containsUpload(item)) return true;
  }
  return false;
}

async function appendFormValue(form: FormData, key: string, value: unknown): Promise<void> {
  if (value === undefined || value === null) return;
  if (value instanceof Uint8Array) { form.append(key, new Blob([value as unknown as BlobPart])); return; }
  if (value instanceof ArrayBuffer) { form.append(key, new Blob([value])); return; }
  if (value instanceof Blob) { form.append(key, value); return; }
  if (value && typeof value === "object" && "source" in value) {
    const upload = value as { source: unknown; filename?: string };
    if (typeof upload.source === "string" && (isAbsolute(upload.source) || upload.source.startsWith("./") || upload.source.startsWith("../"))) {
      const filePath = resolve(upload.source);
      const bytes = await readFile(filePath);
      form.append(key, new Blob([bytes]), upload.filename ?? basename(filePath));
      return;
    }
    return appendFormValue(form, key, upload.source);
  }
  if (typeof value === "string") { form.append(key, value); return; }
  if (typeof value === "number" || typeof value === "boolean") { form.append(key, String(value)); return; }
  form.append(key, JSON.stringify(value));
}
