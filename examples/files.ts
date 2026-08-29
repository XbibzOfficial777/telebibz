/**
 * File upload and download in one bot:
 * - /doc <path>  validates the file, then uploads it as multipart
 * - /photo       downloads the largest photo of the message back to disk
 *
 * Run: TELEGRAM_BOT_TOKEN=<token> npx tsx examples/files.ts
 */
import { stat } from "node:fs/promises";
import { Bot, assertValidUpload } from "@xbibzlibrary/telebibz";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("doc", async (ctx) => {
  const filePath = ctx.message?.text?.split(/\s+/)[1];
  if (!filePath) {
    await ctx.reply("Usage: /doc <path-to-file>");
    return;
  }
  const info = await stat(filePath);
  assertValidUpload(
    { sizeBytes: info.size, fileName: filePath },
    { maxBytes: 50 * 1024 * 1024 },
  );
  const message = await ctx.replyWithDocument({ source: filePath });
  await ctx.reply(`Sent as document (message_id ${message.message_id}).`);
});

bot.on("message:photo", async (ctx) => {
  const photo = ctx.message?.photo?.at(-1);
  if (!photo) return;
  const downloaded = await ctx.downloadFile(photo.file_id, { destination: `downloads/${photo.file_unique_id}.jpg` });
  await ctx.reply(`Downloaded ${downloaded.fileName} (${downloaded.sizeBytes} bytes) to ${downloaded.savedTo}.`);
});

await bot.start();
