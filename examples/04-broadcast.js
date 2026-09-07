// examples/04-broadcast.js — blast pesan ke banyak chat tanpa kena limit.
'use strict';

const { TeleBibz, kb, url } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);
const subscribers = new Set(); // produksi: simpan di DB

bot.cmd('start', (ctx) => {
  subscribers.add(ctx.chat.id);
  ctx.reply('Kamu terdaftar! Admin bisa /blast untuk info ke semua.');
});

bot.cmd('blast', async (ctx) => {
  if (String(ctx.from.id) !== process.env.ADMIN_ID) return ctx.reply('Khusus admin.');
  const teks = ctx.message.text.replace(/^\/blast\s*/i, '').trim();
  if (!teks) return ctx.reply('Pakai: /blast isi pesannya');

  const proses = await ctx.reply(`Mengirim ke ${subscribers.size} chat…`);
  const hasil = await bot.broadcast([...subscribers], { text: teks, ...kb([[url('Info', 'https://example.com')]]) });
  await ctx.reply(`Selesai ✅ terkirim ${hasil.terkirim}, gagal ${hasil.gagal}`);
  await ctx.api.deleteMessage(ctx.chat.id, proses.message_id).catch(() => {});
});

bot.launch();
