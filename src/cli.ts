import { access, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createWebhookHandler } from "./webhook/handler.js";
import { Bot } from "./core/bot.js";

async function commandDoctor(): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  console.log(JSON.stringify({ node: process.version, tokenPresent: Boolean(token), cwd: process.cwd(), package: "@xbibzlibrary/telebibz" }, null, 2));
  if (token) {
    const bot = new Bot(token);
    const health = await bot.health();
    console.log(JSON.stringify(health, null, 2));
    if (!health.apiReachable) process.exitCode = 1;
  }
}

async function commandStart(): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
  const bot = new Bot(token);
  await bot.start();
}

async function commandInit(name: string): Promise<void> {
  const dir = name || "my-telebibz-bot";
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.ts`, `import { Bot } from "@xbibzlibrary/telebibz";\n\nconst bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);\nbot.command("start", (ctx) => ctx.reply("Hello from telebibz"));\nawait bot.start();\n`);
  await writeFile(`${dir}/.env.example`, "TELEGRAM_BOT_TOKEN=\n");
  console.log(`Created ${dir}`);
}

async function run(name: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(name, args, { stdio: "inherit", shell: false });
    child.on("exit", (code, signal) => resolve(signal ? 1 : code ?? 1));
  });
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const [command, argument] = argv;
  switch (command) {
    case "start": await commandStart(); break;
    case "doctor": await commandDoctor(); break;
    case "init": await commandInit(argument ?? "my-telebibz-bot"); break;
    case "generate": process.exitCode = await run("node", ["scripts/generate-api.mjs"]); break;
    case "build": process.exitCode = await run("npm", ["run", "build"]); break;
    case "test": process.exitCode = await run("npm", ["test"]); break;
    case "webhook": {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
      const bot = new Bot(token);
      const webhookOptions = process.env.TELEGRAM_WEBHOOK_SECRET ? { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET } : {};
      const handler = createWebhookHandler(bot, webhookOptions);
      await access(".");
      console.log(`Webhook handler ready: ${typeof handler}`);
      break;
    }
    case "inspect": console.log(JSON.stringify({ cwd: process.cwd(), node: process.version }, null, 2)); break;
    default: console.log("telebibz commands: start, init, dev, generate, webhook, doctor, test, inspect, build");
  }
}

if (process.argv[1]?.endsWith("/cli.js") || process.argv[1]?.endsWith("/cli.ts")) void main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown CLI error";
  console.error(`telebibz: ${message}`);
  process.exitCode = 1;
});
