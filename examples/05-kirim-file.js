// examples/05-kirim-file.js — kirim foto dari URL & dokumen dari Buffer.
'use strict';

const { TeleBibz, InputFile } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('kucing', async (ctx) => {
  const r = await fetch('https://cataas.com/cat');
  const buf = Buffer.from(await r.arrayBuffer());
  await ctx.replyWithPhoto(new InputFile(buf, 'kucing.jpg'), { caption: 'Meong 🐱' });
});

bot.cmd('laporan', async (ctx) => {
  const data = Buffer.from(`Laporan ${new Date().toISOString()}\nHalo dunia!`);
  await ctx.replyWithDocument(new InputFile(data, 'laporan.txt'));
});

bot.launch();
