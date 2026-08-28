import { timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Bot } from "../core/bot.js";
import type { Update } from "../api/types.js";

export interface WebhookOptions { secretToken?: string; maxBodyBytes?: number; onError?: (error: unknown) => void | Promise<void> }
export type WebhookFramework = "express" | "http" | "fastify" | "koa";

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
      await bot.handleUpdate(update);
      return new Response("OK", { status: 200 });
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

    const sendResponse = (status: number, message: string) => {
      if (rawRes && typeof rawRes.writeHead === "function" && typeof rawRes.end === "function") {
        rawRes.writeHead(status, { "Content-Type": "text/plain" });
        rawRes.end(message);
      } else if (rawRes && typeof (rawRes as { status?: Function }).status === "function") {
        (rawRes as { status: Function; send: Function }).status(status).send(message);
      }
    };

    if (rawReq.method !== "POST") {
      sendResponse(405, "Method Not Allowed");
      return;
    }

    if (options.secretToken) {
      const tokenHeader = rawReq.headers?.["x-telegram-bot-api-secret-token"];
      const headerStr = Array.isArray(tokenHeader) ? tokenHeader[0] ?? "" : tokenHeader ?? "";
      if (!secureEqual(headerStr, options.secretToken)) {
        sendResponse(401, "Unauthorized");
        return;
      }
    }

    try {
      let update: Update;
      if (rawReq.body && typeof rawReq.body === "object") {
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

      await bot.handleUpdate(update);
      sendResponse(200, "OK");
    } catch (error) {
      await options.onError?.(error);
      sendResponse(500, "Internal Server Error");
    }
  };
}

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
