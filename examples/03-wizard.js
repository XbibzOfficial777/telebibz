// examples/03-wizard.js — form pendaftaran tanya-jawab, 0 boilerplate.
'use strict';

const { TeleBibz } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.wizard('daftar', {
  steps: [
    { key: 'nama', ask: '1️⃣ Siapa nama lengkapmu?' },
    {
      key: 'umur',
      ask: '2️⃣ Umur berapa?',
      parse: (t) => parseInt(t, 10),
      validate: (n) => (Number.isFinite(n) && n > 0 && n < 120 ? null : 'Umur tidak valid — ketik angka saja ya:'),
    },
    {
      key: 'kota',
      ask: '3️⃣ Tinggal di kota mana? (ketik "batal" untuk berhenti)',
      validate: (t) => (t && t.length >= 3 ? null : 'Nama kota minimal 3 huruf:'),
    },
  ],
  done: async (ans, ctx) => {
    await ctx.reply(`✅ Terdaftar!\nNama : ${ans.nama}\nUmur : ${ans.umur}\nKota : ${ans.kota}`);
  },
  onCancel: (ctx) => ctx.reply('👋 Pendaftaran dibatalkan.'),
});

bot.launch();
