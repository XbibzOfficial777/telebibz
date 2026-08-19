import { mkdir, writeFile } from "node:fs/promises";

const url = "https://core.telegram.org/bots/api";
const response = await fetch(url, { headers: { "user-agent": "telebibz-schema-updater/0.1.0" } });
if (!response.ok) throw new Error(`Failed to fetch Telegram Bot API: ${response.status}`);
const html = await response.text();
const headings = [...html.matchAll(/<h4[^>]*>[\s\S]*?<\/h4>/gi)].map((match) => match[0].replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim()).filter((name) => /^[A-Za-z][A-Za-z0-9_]*$/.test(name));
if (headings.length === 0) throw new Error("No Telegram API headings were found in the official page.");
const schema = `# Telegram Bot API schema snapshot\n\n${[...new Set(headings)].map((name) => `####  ${name}`).join("\n\n")}\n`;
await mkdir("schema", { recursive: true });
await writeFile("schema/telegram-api.md", schema);
console.log(`Fetched ${new Set(headings).size} Telegram API headings from ${url}.`);
