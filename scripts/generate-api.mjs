import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const candidates = [
  path.join(root, "schema", "telegram-api.md"),
  "/home/ubuntu/upload/core.telegram.org_bots_api_1787126043839.md"
];
const source = candidates.find((file) => fs.existsSync(file));
if (!source) {
  throw new Error("Telegram API documentation not found. Run npm run update:telegram first.");
}
const markdown = fs.readFileSync(source, "utf8");
const headings = [...markdown.matchAll(/^####  ([A-Za-z][A-Za-z0-9_]*)\s*$/gm)].map((match) => match[1]);
const methodNames = [];
for (let index = 0; index < headings.length; index += 1) {
  const name = headings[index];
  if (/^[a-z]/.test(name)) {
    methodNames.push(name);
  }
}
const uniqueMethods = [...new Set(methodNames)].sort();
const generated = `/* eslint-disable */\n/** Generated from the official Telegram Bot API documentation. Do not edit manually. */\nexport const TELEGRAM_API_VERSION = "10.2" as const;\nexport const TELEGRAM_METHOD_NAMES = ${JSON.stringify(uniqueMethods, null, 2)} as const;\nexport type TelegramMethodName = typeof TELEGRAM_METHOD_NAMES[number];\nexport type GeneratedMethodSpec = { params: Record<string, unknown>; result: unknown };\nexport type GeneratedTelegramMethodMap = { [K in TelegramMethodName]: GeneratedMethodSpec };\nexport const GENERATED_METHODS = Object.freeze(Object.fromEntries(TELEGRAM_METHOD_NAMES.map((name) => [name, name])) as Record<TelegramMethodName, TelegramMethodName>);\n`;
fs.mkdirSync(path.join(root, "generated"), { recursive: true });
fs.writeFileSync(path.join(root, "generated", "api.ts"), generated);
console.log(`Generated ${uniqueMethods.length} Telegram API method names from ${source}`);
