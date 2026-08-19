import { createHmac, timingSafeEqual } from "node:crypto";
import type { ApiClient } from "./api/client.js";
import type { Message } from "./api/types.js";

export interface WebAppInitData {
  raw: string;
  hash: string;
  authDate?: number;
  data: Record<string, string>;
  user?: Record<string, unknown>;
  receiver?: Record<string, unknown>;
  chat?: Record<string, unknown>;
}

export function parseWebAppInitData(initData: string): WebAppInitData {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) throw new Error("Web App init data is missing hash");
  const data: Record<string, string> = {};
  for (const [key, value] of params.entries()) if (key !== "hash") data[key] = value;
  const authDateRaw = data.auth_date;
  const authDate = authDateRaw === undefined ? undefined : Number(authDateRaw);
  if (authDate !== undefined && (!Number.isInteger(authDate) || authDate <= 0)) throw new Error("Web App init data has an invalid auth_date");
  const parseObject = (key: string): Record<string, unknown> | undefined => {
    const value = data[key];
    if (value === undefined) return undefined;
    try { return JSON.parse(value) as Record<string, unknown>; } catch { throw new Error(`Web App init data field ${key} is not valid JSON`); }
  };
  const result: WebAppInitData = { raw: initData, hash, data };
  if (authDate !== undefined) result.authDate = authDate;
  const user = parseObject("user");
  const receiver = parseObject("receiver");
  const chat = parseObject("chat");
  if (user !== undefined) result.user = user;
  if (receiver !== undefined) result.receiver = receiver;
  if (chat !== undefined) result.chat = chat;
  return result;
}

export function validateWebAppInitData(initData: string, botToken: string, maxAgeSeconds = 86_400, nowMs = Date.now()): WebAppInitData {
  if (!botToken) throw new Error("botToken is required");
  if (!Number.isFinite(maxAgeSeconds) || maxAgeSeconds < 0) throw new RangeError("maxAgeSeconds must be non-negative");
  const parsed = parseWebAppInitData(initData);
  if (!/^[0-9a-fA-F]{64}$/.test(parsed.hash)) throw new Error("Web App init data hash must be a 64-character hexadecimal string");
  const checkString = Object.entries(parsed.data).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}=${value}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(checkString).digest("hex");
  const actual = Buffer.from(parsed.hash, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuffer.length || !timingSafeEqual(actual, expectedBuffer)) throw new Error("Web App init data signature is invalid");
  if (parsed.authDate !== undefined && nowMs / 1000 - parsed.authDate > maxAgeSeconds) throw new Error("Web App init data has expired");
  return parsed;
}

export interface InvoicePayload { [key: string]: unknown }
export interface PreCheckoutPayload { [key: string]: unknown }
export interface WebAppQueryPayload { [key: string]: unknown }

export class PaymentsClient {
  constructor(private readonly api: ApiClient) {}
  createInvoiceLink(payload: InvoicePayload): Promise<string> { return this.api.call("createInvoiceLink", payload as never) as Promise<string>; }
  sendInvoice(payload: InvoicePayload): Promise<Message> { return this.api.call("sendInvoice", payload as never) as Promise<Message>; }
  answerPreCheckoutQuery(payload: PreCheckoutPayload): Promise<true> { return this.api.call("answerPreCheckoutQuery", payload as never) as Promise<true>; }
  answerWebAppQuery(payload: WebAppQueryPayload): Promise<Record<string, unknown>> { return this.api.call("answerWebAppQuery", payload as never) as Promise<Record<string, unknown>>; }
  getStarTransactions(payload: Record<string, unknown> = {}): Promise<Record<string, unknown>> { return this.api.call("getStarTransactions", payload as never) as Promise<Record<string, unknown>>; }
  refundStarPayment(payload: Record<string, unknown>): Promise<true> { return this.api.call("refundStarPayment", payload as never) as Promise<true>; }
}
