import { timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Bot } from "../core/bot.js";
import type { Update } from "../api/types.js";
import type { WebhookReplyPayload, WebhookReplySink } from "../core/webhook-reply.js";

export interface WebhookOptions {
  secretToken?: string;
  maxBodyBytes?: number;
  onError?: (error: unknown) => void | Promise<void>;
  /**
   * Telegraf-style webhook replies (default `false`). When enabled, the first
   * outgoing API call while handling an update is answered through the webhook
   * HTTP response instead of a separate request to Telegram — Telegram then
   * executes the method for you. That call resolves with `true`, since Telegram
   * never sends the method result back to a webhook response.
   */
  webhookReply?: boolean;
}
export type WebhookFramework = "express" | "http" | "fastify" | "koa";

/** Runs the update, optionally claiming the webhook response for the first API call. */
async function processWithOptionalReply(bot: Bot<never>, update: Update, sink: WebhookReplySink | undefined): Promise<void> {
  if (sink === undefined) { await bot.handleUpdate(update); return; }
  await bot.handleUpdate(update, { webhookReply: sink });
}

function replyResponse(payload: WebhookReplyPayload | undefined): Response {
  if (payload !== undefined) return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });
  return new Response("OK", { status: 200 });
}

export function createWebhookHandler<S extends object>(bot: Bot<S>, options: WebhookOptions = {}): (request: Request) => Promise<Response> {
  const maxBodyBytes = options.maxBodyBytes ?? 1_048_576;
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
    if (options.secretToken && !secureEqual(request.headers.get("x-telegram-bot-api-secret-token") ?? "", options.secretToken)) return new Response("Unauthorized", { status: 401 });
    const contentType = request.headers.get("content-type") ?? "";
    if (!/^application\/json(?:\s*;|\s*$)/i.test(contentType)) return new Response("Unsupported Media Type", { status: 415 });
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > maxBodyBytes) return new Response("Payload Too Large", { status: 413 });
    try {
      const raw = await request.arrayBuffer();
      if (raw.byteLength > maxBodyBytes) return new Response("Payload Too Large", { status: 413 });
      const update = JSON.parse(new TextDecoder().decode(raw)) as Update;
      if (!Number.isInteger(update.update_id)) return new Response("Bad Request", { status: 400 });
      let replyPayload: WebhookReplyPayload | undefined;
      const sink: WebhookReplySink | undefined = options.webhookReply === true ? (payload) => { replyPayload = payload; } : undefined;
      await processWithOptionalReply(bot as unknown as Bot<never>, update, sink);
      return replyResponse(replyPayload);
    } catch (error) {
      await options.onError?.(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
}

export function webhookCallback<S extends object>(
  bot: Bot<S>,
  _framework: WebhookFramework = "express",
  options: WebhookOptions = {}
): (req: IncomingMessage | Record<string, unknown>, res?: ServerResponse | Record<string, unknown>) => Promise<void> {
  const maxBodyBytes = options.maxBodyBytes ?? 1_048_576;

  return async (req: IncomingMessage | Record<string, unknown>, res?: ServerResponse | Record<string, unknown>): Promise<void> => {
    const rawReq = req as IncomingMessage & { body?: unknown; headers?: Record<string, string | string[] | undefined> };
    const rawRes = res as ServerResponse | undefined;

    const sendResponse = (status: number, message: string, contentType = "text/plain") => {
      if (rawRes && typeof rawRes.writeHead === "function" && typeof rawRes.end === "function") {
        rawRes.writeHead(status, { "Content-Type": contentType });
        rawRes.end(message);
        return;
      }
      const expressLike = rawRes as unknown as { status?: unknown; send?: unknown } | undefined;
      if (typeof expressLike?.status === "function" && typeof expressLike.send === "function") {
        (expressLike as unknown as { status: (code: number) => { send: (body: string) => void } }).status(status).send(message);
        return;
      }
      const koaLike = rawRes as unknown as { status?: unknown; body?: unknown } | undefined;
      if (koaLike !== undefined) {
        koaLike.status = status;
        koaLike.body = message;
      }
    };

    if (rawReq.method !== "POST") {
      sendResponse(405, "Method Not Allowed");
      return;
    }

    if (options.secretToken) {
      if (!secureEqual(readHeader(rawReq, "x-telegram-bot-api-secret-token"), options.secretToken)) {
        sendResponse(401, "Unauthorized");
        return;
      }
    }

    try {
      let update: Update;
      if (typeof (rawReq as { arrayBuffer?: unknown }).arrayBuffer === "function") {
        // Web-standard Request objects (e.g. Deno, Bun, WinterCG runtimes, or
        // a converted fetch Request) expose the body through arrayBuffer().
        // Checked before `body` because a Request's `body` is a ReadableStream.
        const raw = await (rawReq as unknown as Request).arrayBuffer();
        if (raw.byteLength > maxBodyBytes) {
          sendResponse(413, "Payload Too Large");
          return;
        }
        update = JSON.parse(new TextDecoder().decode(raw)) as Update;
      } else if (rawReq.body && typeof rawReq.body === "object") {
        update = rawReq.body as Update;
      } else {
        const chunks: Buffer[] = [];
        let totalBytes = 0;
        for await (const chunk of rawReq as AsyncIterable<Buffer | string>) {
          const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
          totalBytes += buffer.length;
          if (totalBytes > maxBodyBytes) {
            sendResponse(413, "Payload Too Large");
            return;
          }
          chunks.push(buffer);
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        update = JSON.parse(raw) as Update;
      }

      if (!Number.isInteger(update?.update_id)) {
        sendResponse(400, "Bad Request");
        return;
      }

      let replyPayload: WebhookReplyPayload | undefined;
      const sink: WebhookReplySink | undefined = options.webhookReply === true ? (payload) => { replyPayload = payload; } : undefined;
      await processWithOptionalReply(bot as unknown as Bot<never>, update, sink);
      if (replyPayload !== undefined) sendResponse(200, JSON.stringify(replyPayload), "application/json");
      else sendResponse(200, "OK");
    } catch (error) {
      await options.onError?.(error);
      sendResponse(500, "Internal Server Error");
    }
  };
}

function readHeader(req: IncomingMessage & { headers?: unknown }, name: string): string {
  const headers: unknown = req.headers;
  if (!headers || typeof headers !== "object") return "";
  if (typeof (headers as { get?: unknown }).get === "function") return (headers as unknown as Headers).get(name) ?? "";
  const value = (headers as Record<string, string | string[] | undefined>)[name];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
