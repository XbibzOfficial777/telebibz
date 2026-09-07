// test/all.test.js — suite tanpa jaringan: semua panggilan API dicegat transformer.
'use strict';

const assert = require('assert');
const { TeleBibz, btn, url, kb, webApp, copy, wizard, humanize } = require('..');

let N = 0, OK = 0;
const t = (nama, fn) => {
  try { Promise.resolve(fn()).then(() => { N++; OK++; console.log(`  ✓ ${nama}`); selesai(); })
        .catch((e) => { N++; console.error(`  ✗ ${nama}\n    ${e.stack || e}`); selesai(); });
  } catch (e) { N++; console.error(`  ✗ ${nama}\n    ${e.stack || e}`); selesai(); }
};
let TOTAL = 12;
function selesai() {
  if (N === TOTAL) {
    console.log(`\n${OK}/${N} lulus`);
    process.exit(OK === N ? 0 : 1);
  }
}

/* ===== harness update manual ===== */
function buatBot() {
  const bot = new TeleBibz('123456:TESTTOKEN-TESTTOKEN-TESTTOKEN-TESTOKEN', { silent: true });
  const calls = [];
  bot.api.config.use(async (prev, method, payload = {}) => {
    calls.push({ method, payload });
    const ok = (v) => ({ ok: true, result: v });
    if (method === 'getMe') return ok({ id: 99, is_bot: true, first_name: 'Tes', username: 'tesbot' });
    if (method === 'sendMessage') return ok({ message_id: 1, ...payload });
    return ok(true);
  });
  bot.bot.botInfo = { id: 99, is_bot: true, first_name: 'Tes', username: 'tesbot' };
  return { bot, calls };
}
const USER = { id: 555, is_bot: false, first_name: 'Budi' };
const CHAT = { id: 555, type: 'private', first_name: 'Budi' };
let uid = 0, mid = 0;
function uMsg(text) {
  return {
    update_id: ++uid,
    message: {
      message_id: ++mid, from: USER, chat: CHAT, date: Math.floor(Date.now() / 1000),
      text,
      ...(text.startsWith('/') ? { entities: [{ type: 'bot_command', offset: 0, length: text.split(' ')[0].length }] } : {}),
    },
  };
}

/* ===== 1. keyboard builder ===== */
t('btn() membentuk objek tombol + warna + ikon', () => {
  assert.deepStrictEqual(btn('A', 'a'), { text: 'A', callback_data: 'a' });
  assert.deepStrictEqual(btn('B', 'b', 'danger', '123'), { text: 'B', callback_data: 'b', style: 'danger', icon_custom_emoji_id: '123' });
  assert.deepStrictEqual(url('W', 'https://x', 'success'), { text: 'W', url: 'https://x', style: 'success' });
  assert.strictEqual(webApp('App', 'https://w').web_app.url, 'https://w');
  assert.strictEqual(copy('Salin', 'kode').copy_text.text, 'kode');
  assert.deepStrictEqual(kb([[btn('X', 'x')]]), { reply_markup: { inline_keyboard: [[{ text: 'X', callback_data: 'x' }]] } });
  assert.ok(kb.confirm('y', 'n').reply_markup.inline_keyboard[0][0].style === 'success');
});

/* ===== 2. token tidak valid ditolak cepat ===== */
t('constructor menolak token ngaco', () => {
  assert.throws(() => new TeleBibz('bukan-token'), /token tidak valid/i);
  assert.throws(() => new TeleBibz(), /token tidak valid/i);
});

/* ===== 3. cmd + hears ===== */
t('cmd & hears merespons lewat sendMessage', async () => {
  const { bot, calls } = buatBot();
  let startHit = 0;
  bot.cmd('start', (ctx) => { startHit++; return ctx.reply(`Halo ${ctx.from.first_name}`); });
  bot.hears(/halo/i, (ctx) => ctx.reply('halo juga'));
  await bot.handleUpdate(uMsg('/start'));
  await bot.handleUpdate(uMsg('Halo kawan'));
  const s = calls.filter((c) => c.method === 'sendMessage');
  assert.strictEqual(startHit, 1);
  assert.ok(s.some((c) => /Halo Budi/.test(c.payload.text)));
  assert.ok(s.some((c) => /halo juga/.test(c.payload.text)));
});

/* ===== 4. action (callback) ===== */
t('action() menangkap callback_data', async () => {
  const { bot, calls } = buatBot();
  bot.action('menu:premium', (ctx) => ctx.editMessageText('premium dibuka'));
  await bot.handleUpdate({
    update_id: ++uid,
    callback_query: {
      id: 'q1', from: USER, chat_instance: 'ci', data: 'menu:premium',
      message: { message_id: 7, from: { id: 99, is_bot: true, first_name: 'T' }, chat: CHAT, date: 1 },
    },
  });
  assert.ok(calls.some((c) => c.method === 'editMessageText' && /premium dibuka/.test(c.payload.text)));
});

/* ===== 5–7. wizard ===== */
t('wizard mengalir penuh: tanya → validasi → done', async () => {
  const { bot, calls } = buatBot();
  const jawab = [];
  bot.wizard('daftar', {
    steps: [
      { key: 'nama', ask: 'Nama?' },
      { key: 'umur', ask: 'Umur?', parse: (t) => parseInt(t, 10), validate: (n) => (n > 0 ? null : 'Ulangi angka:') },
    ],
    done: async (ans, ctx) => { jawab.push(ans); await ctx.reply('selesai'); },
  });
  const send = (t) => bot.handleUpdate(uMsg(t));
  await send('/daftar');           // tanya 1
  await send('Budi');              // tanya 2
  await send('abc');               // validasi gagal → ulangi
  await send('25');                // done
  const texts = calls.filter((c) => c.method === 'sendMessage').map((c) => c.payload.text);
  assert.deepStrictEqual(jawab, [{ nama: 'Budi', umur: 25 }]);
  assert.ok(texts.some((x) => /Nama\?/.test(x)) && texts.some((x) => /Ulangi angka/.test(x)) && texts.some((x) => /selesai/.test(x)));
});

t('wizard batal via kata batal', async () => {
  const { bot, calls } = buatBot();
  bot.wizard('isi', { steps: [{ key: 'a', ask: 'A?' }], done: () => {} });
  await bot.handleUpdate(uMsg('/isi'));
  await bot.handleUpdate(uMsg('batal'));
  assert.ok(calls.some((c) => c.method === 'sendMessage' && /dibatalkan/i.test(c.payload.text)));
});

t('wizard non-teks di tengah sesi diabaikan (tidak mendahului handler lain)', async () => {
  const { bot, calls } = buatBot();
  bot.wizard('fotoform', { steps: [{ key: 'a', ask: 'kirim apa saja' }], done: () => {} });
  await bot.handleUpdate(uMsg('/fotoform'));
  await bot.handleUpdate({
    update_id: ++uid,
    message: { message_id: ++mid, from: USER, chat: CHAT, date: 1, photo: [{ file_id: 'f', width: 1, height: 1 }] },
  });
  assert.ok(!calls.some((c) => c.method === 'sendMessage' && /dibatalkan/.test(c.payload.text)), 'non-teks malah membatalkan');
  await bot.handleUpdate(uMsg('ok')); // jawaban teks tetap menyelesaikan
  assert.ok(calls.every((c) => c.method !== 'sendMessage' || !/dibatalkan/i.test(c.payload.text || '')));
});

/* ===== 8. broadcast ===== */
t('broadcast mengirim ke semua + merangkum kegagalan', async () => {
  const { bot } = buatBot();
  // buat 1 chat gagal
  bot.api.config.use(async (prev, method, payload) => {
    if (method === 'sendMessage' && payload.chat_id === 99) {
      const e = new Error('Forbidden: bot was blocked by the user');
      e.description = 'bot was blocked by the user';
      throw e;
    }
    return { ok: true, result: true };
  });
  const hasil = await bot.broadcast([1, 99, 2], 'tes', { delay: 0 });
  assert.strictEqual(hasil.terkirim, 2);
  assert.strictEqual(hasil.gagal, 1);
  assert.strictEqual(hasil.errors[0].chatId, 99);
});

/* ===== 9. humanize error ===== */
t('humanize menerjemahkan error API populer', () => {
  assert.ok(/diblokir/i.test(humanize(new Error('bot was blocked by the user')).saran));
  const asing = humanize(new Error('sesuatu yang tidak dikenal'));
  assert.strictEqual(asing.saran, null);
  assert.ok(asing.pesan.includes('tidak dikenal'));
});

/* ===== 10. session selalu ada ===== */
t('session default {} tanpa setup apa pun', async () => {
  const { bot } = buatBot();
  let seen = null;
  bot.on('message:text', (ctx) => { seen = ctx.session; });
  await bot.handleUpdate(uMsg('cek sesi'));
  assert.ok(seen && typeof seen === 'object');
});

/* ===== 12. 409 auto-retry tidak crash ===== */
t('launch: 409 Conflict di-retry, tidak crash, stop() beres', async () => {
  const bot = new TeleBibz('123456:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', { silent: true });
  let polls = 0;
  bot.api.config.use(async (prev, method) => {
    if (method === 'getMe') return { ok: true, result: { id: 1, is_bot: true, first_name: 'X', username: 'x' } };
    if (method === 'getUpdates') {
      polls++;
      if (polls === 1) {
        const e = new Error('Conflict'); e.error_code = 409; e.description = 'terminated by other getUpdates request'; throw e;
      }
      await new Promise((r) => setTimeout(r, 60)); // poll sukses nganggur
      return { ok: true, result: [] };
    }
    return { ok: true, result: true };
  });
  // 409 di poll pertama → retry loop; stop() membuat loop selesai bersih
  await bot.launch();
  await new Promise((r) => setTimeout(r, 300));
  await bot.stop();
  await bot._runPromise; // harus resolve bersih (tidak reject)
  assert.ok(polls >= 1);
});

/* ===== 11. onError kustom ===== */
t('onError kustom menerima err+ctx', async () => {
  const { bot } = buatBot();
  const got = [];
  bot.opts.onError = (err, ctx) => got.push([String(err), ctx && ctx.chat.id]);
  bot.cmd('boom', () => { throw new Error('meledak'); });
  await bot.handleUpdate(uMsg('/boom'));
  assert.strictEqual(got.length, 1);
  assert.ok(/meledak/.test(got[0][0]) && got[0][1] === 555);
});
