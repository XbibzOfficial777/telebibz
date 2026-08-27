import { createServer } from "node:http";
import { Bot, createWebhookHandler } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
const port = Number(process.env.PORT ?? 3000);

if (!token) throw new Error("Set TELEGRAM_BOT_TOKEN before starting the example.");
if (!webhookSecret) throw new Error("Set TELEGRAM_WEBHOOK_SECRET before starting the example.");
if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("PORT must be a valid TCP port.");

const bot = new Bot(token);
bot.command("start", async (ctx) => { await ctx.reply("Webhook bot is active."); });

const webhook = createWebhookHandler(bot, {
  secretToken: webhookSecret,
  onError: (error) => console.error("Webhook update failed", error),
});

const server = createServer(async (request, response) => {
  try {
    const body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk: Buffer | string) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      request.on("end", () => resolve(Buffer.concat(chunks)));
      request.on("error", reject);
    });
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) if (typeof value === "string") headers.set(key, value);
    const requestInit: RequestInit = { method: request.method ?? "GET", headers };
    if (request.method === "POST") requestInit.body = body.toString("utf8");
    const result = await webhook(new Request(`http://${request.headers.host ?? "localhost"}${request.url ?? "/"}`, requestInit));
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
    console.error("Webhook server failed", error);
  }
});

server.listen(port, () => console.log(`Telebibz webhook listening on http://localhost:${port}`));
