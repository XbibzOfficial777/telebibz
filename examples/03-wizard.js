// examples/03-wizard.js — form pendaftaran tanya-jawab + TOMBOL + mode edit/delete.
//   BOT_TOKEN=123:abc node examples/03-wizard.js
'use strict';

const { TeleBibz } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.wizard('daftar', {
  // mode tampilan pertanyaan:
  //   'send'   → tiap pertanyaan jadi pesan baru (default)
  //   'edit'   → SATU pesan diedit terus dari awal sampai akhir
  //   'delete' → pesan lama dihapus dulu, baru tanya berikutnya
  mode: 'edit',

  steps: [
    { key: 'nama', ask: '1️⃣ Siapa nama lengkapmu?' },

    {
      // TOMBOL reply keyboard — user tinggal ketuk, tak perlu mengetik
      key: 'jk',
      ask: '2️⃣ Jenis kelamin?',
      buttons: ['👨 Laki-laki', '👩 Perempuan'],
      onlyButtons: true, // tolak ketikan bebas
    },

    {
      // TOMBOL inline (callback) — nilai bisa beda dari label,
      // dan pesan langsung diedit ke langkah berikutnya
      key: 'domisili',
      ask: '3️⃣ Domisili pulau mana?',
      inline: true,
      onlyButtons: true,
      buttons: [
        [{ text: '🌋 Jawa', value: 'jawa' }, { text: '🌴 Sumatera', value: 'sumatera' }],
        [{ text: '🏝️ Lainnya', value: 'lainnya' }],
      ],
    },

    {
      key: 'umur',
      ask: '4️⃣ Umur berapa? (ketik "batal" untuk berhenti)',
      parse: (t) => parseInt(t, 10),
      validate: (n) => (Number.isFinite(n) && n > 0 && n < 120 ? null : 'Umur tidak valid — ketik angka saja ya:'),
    },
  ],

  // cleanup bawaan: pesan tanya terakhir otomatis dibereskan,
  // reply keyboard otomatis disingkirkan (nonaktif: removeKeyboard: false)
  done: async (ans, ctx) => {
    await ctx.reply(
      `✅ Terdaftar!\nNama     : ${ans.nama}\nJK       : ${ans.jk}\nDomisili : ${ans.domisili}\nUmur     : ${ans.umur}`,
    );
  },
  onCancel: (ctx) => ctx.reply('👋 Pendaftaran dibatalkan.'),
});

bot.launch();
