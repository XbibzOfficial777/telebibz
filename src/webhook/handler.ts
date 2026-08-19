import type { Bot } from "../core/bot.js";
import type { Update } from "../api/types.js";

export interface WebhookOptions { secretToken?: string; maxBodyBytes?: number; onError?: (error: unknown) => void | Promise<void> }

export function createWebhookHandler<S extends object>(bot: Bot<S>, options: WebhookOptions = {}): (request: Request) => Promise<Response> {
  const maxBodyBytes = options.maxBodyBytes ?? 1_048_576;
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
    if (options.secretToken && request.headers.get("x-telegram-bot-api-secret-token") !== options.secretToken) return new Response("Unauthorized", { status: 401 });
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
