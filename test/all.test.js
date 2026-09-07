// test/all.test.js — 14 kasus, 100% tanpa jaringan (transport disuntik).
'use strict';

const assert = require('assert');
const { TeleBibz, btn, url, kb, webApp, copy, humanize, File, InlineKeyboard } = require('..');

let N = 0, OK = 0;
const TOTAL = 14;
const t = (nama, fn) => {
  const done = () => { N++; if (N === TOTAL) { console.log(`\n${OK}/${N} lulus`); process.exit(OK === N ? 0 : 1); } };
  Promise.resolve()
    .then(fn)
    .then(() => { OK++; console.log(`  ✓ ${nama}`); done(); })
    .catch((e) => { console.error(`  ✗ ${nama}\n    ${e.stack || e}`); done(); });
};

/* ===== harness: bot dengan transport palsu (merekam panggilan API) ===== */
function buatBot(overrides = {}) {
  const calls = [];
  const transport = async (method, payload = {}) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 99, is_bot: true, first_name: 'Tes', username: 'tesbot' };
    if (method === 'sendMessage') return { message_id: calls.length, ...payload };
    if (overrides[method]) return overrides[method](payload);
    return true;
  };
  const bot = new TeleBibz('123456:TESTTOKEN-TESTTOKEN-TESTTOKEN-TESTOKEN', { silent: true, transport });
  return { bot, calls, me: null };
}
async function boot(b) { await b.init(); }
const ME = { id: 99, is_bot: true, first_name: 'Tes', username: 'tesbot' };
const USER = { id: 555, is_bot: false, first_name: 'Budi' };
const CHAT = { id: 555, type: 'private', first_name: 'Budi' };
let uid = 0, mid = 0;
function uMsg(text, chat = CHAT) {
  return {
    update_id: ++uid,
    message: {
      message_id: ++mid, from: USER, chat, date: Math.floor(Date.now() / 1000),
      text,
      ...(text.startsWith('/') ? { entities: [{ type: 'bot_command', offset: 0, length: text.split(' ')[0].length }] } : {}),
    },
  };
}
const texts = (calls) => calls.filter((c) => c.method === 'sendMessage').map((c) => c.payload.text || '');

/* ===== 1. keyboard builder ===== */
t('btn()/url()/kb(): bentuk objek + warna + ikon', () => {
  assert.deepStrictEqual(btn('A', 'a'), { text: 'A', callback_data: 'a' });
  assert.deepStrictEqual(btn('B', 'b', 'danger', '123'), { text: 'B', callback_data: 'b', style: 'danger', icon_custom_emoji_id: '123' });
  assert.strictEqual(url('W', 'https://x', 'success').style, 'success');
  assert.strictEqual(webApp('App', 'https://w').web_app.url, 'https://w');
  assert.strictEqual(copy('Salin', 'kode').copy_text.text, 'kode');
  assert.ok(kb([[btn('X', 'x')]]).reply_markup.inline_keyboard[0][0].text === 'X');
  assert.ok(kb.confirm('y', 'n').reply_markup.inline_keyboard[0][0].style === 'success');
  const ik = new InlineKeyboard().text('A', 'a').url('B', 'https://b').row().text('C', 'c', 'danger').build();
  assert.strictEqual(ik.reply_markup.inline_keyboard.length, 2);
});

/* ===== 2. token guard ===== */
t('constructor menolak token ngaco cepat', () => {
  assert.throws(() => new TeleBibz('bukan-token'), /token tidak valid/i);
  assert.throws(() => new TeleBibz(), /token tidak valid/i);
});

/* ===== 3. cmd + hears ===== */
t('cmd & hears merespons via sendMessage', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  let startHit = 0;
  bot.cmd('start', (ctx) => { startHit++; return ctx.reply(`Halo ${ctx.from.first_name}`); });
  bot.hears(/halo/i, (ctx) => ctx.reply('halo juga'));
  await bot.handleUpdate(uMsg('/start'));
  await bot.handleUpdate(uMsg('Halo kawan'));
  assert.strictEqual(startHit, 1);
  const tx = texts(calls);
  assert.ok(tx.some((x) => /Halo Budi/.test(x)) && tx.some((x) => /halo juga/.test(x)));
});

/* ===== 4. action ===== */
t('action() menangkap callback_data', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
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

/* ===== 5. hears string persis ===== */
t('hears(string) hanya cocok teks persis (ci)', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.hears('ping', (ctx) => ctx.reply('pong'));
  await bot.handleUpdate(uMsg('PING'));
  await bot.handleUpdate(uMsg('ping pong'));
  const po = texts(calls).filter((x) => x === 'pong');
  assert.strictEqual(po.length, 1, 'hears string harus cocok persis sekali saja');
});

/* ===== 6–8. wizard ===== */
t('wizard mengalir penuh: tanya → validasi → done', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  const jawab = [];
  bot.wizard('daftar', {
    steps: [
      { key: 'nama', ask: 'Nama?' },
      { key: 'umur', ask: 'Umur?', parse: (t) => parseInt(t, 10), validate: (n) => (n > 0 ? null : 'Ulangi angka:') },
    ],
    done: async (ans, ctx) => { jawab.push(ans); await ctx.reply('selesai'); },
  });
  const send = (t) => bot.handleUpdate(uMsg(t));
  await send('/daftar'); await send('Budi'); await send('abc'); await send('25');
  const tx = texts(calls);
  assert.deepStrictEqual(jawab, [{ nama: 'Budi', umur: 25 }]);
  assert.ok(tx.some((x) => /Nama\?/.test(x)) && tx.some((x) => /Ulangi angka/.test(x)) && tx.some((x) => /selesai/.test(x)));
});

t('wizard batal via kata batal', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.wizard('isi', { steps: [{ key: 'a', ask: 'A?' }], done: () => {} });
  await bot.handleUpdate(uMsg('/isi'));
  await bot.handleUpdate(uMsg('batal'));
  assert.ok(texts(calls).some((x) => /dibatalkan/i.test(x)));
});

t('pesan non-teks di tengah wizard tidak error & wizard lanjut', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  let doneHit = 0;
  bot.wizard('form', { steps: [{ key: 'a', ask: 'A?' }], done: () => doneHit++ });
  await bot.handleUpdate(uMsg('/form'));
  await bot.handleUpdate({ update_id: ++uid, message: { message_id: ++mid, from: USER, chat: CHAT, date: 1, photo: [{ file_id: 'f', width: 1, height: 1 }] } });
  await bot.handleUpdate(uMsg('oke'));
  assert.strictEqual(doneHit, 1);
  assert.ok(!texts(calls).some((x) => /error/i.test(x)));
});

/* ===== 9. broadcast ===== */
t('broadcast mengirim ke semua + merangkum kegagalan', async () => {
  const { bot } = buatBot(); await boot(bot);
  bot.api._t = async (method, payload) => {
    if (method === 'sendMessage' && payload.chat_id === 99) {
      const e = new Error('Forbidden: bot was blocked by the user');
      e.description = 'bot was blocked by the user'; throw e;
    }
    return { ok: true };
  };
  const hasil = await bot.broadcast([1, 99, 2], 'tes', { delay: 0 });
  assert.strictEqual(hasil.terkirim + hasil.gagal, 3);
  assert.strictEqual(hasil.gagal, 1);
  assert.strictEqual(hasil.errors[0].chatId, 99);
});

/* ===== 10. humanize ===== */
t('humanize menerjemahkan error API populer', () => {
  assert.ok(/diblokir/i.test(humanize(new Error('bot was blocked by the user')).saran));
  const asing = humanize(new Error('sesuatu yang tidak dikenal'));
  assert.strictEqual(asing.saran, null);
});

/* ===== 11. session default ===== */
t('ctx.session selalu {} tanpa setup apa pun', async () => {
  const { bot } = buatBot(); await boot(bot);
  let seen = null;
  bot.on('message:text', (ctx) => { seen = ctx.session; });
  await bot.handleUpdate(uMsg('cek sesi'));
  assert.ok(seen && typeof seen === 'object');
});

/* ===== 12. onError kustom ===== */
t('onError kustom menerima err+ctx, handler error TIDAK crash', async () => {
  const { bot } = buatBot(); await boot(bot);
  const got = [];
  bot.opts.onError = (err, ctx) => got.push([String(err), ctx && ctx.chat.id]);
  bot.cmd('boom', () => { throw new Error('meledak'); });
  await bot.handleUpdate(uMsg('/boom'));
  assert.strictEqual(got.length, 1);
  assert.ok(/meledak/.test(got[0][0]) && got[0][1] === 555);
});

/* ===== 13. polling 409 → auto-retry; stop bersih ===== */
t('launch: getUpdates 409 → retry halus; stop() resolve runPromise', async () => {
  let polls = 0;
  const transport = async (method) => {
    if (method === 'getMe') return { id: 1, is_bot: true, first_name: 'X', username: 'x' };
    if (method === 'getUpdates') {
      polls++;
      if (polls === 1) { const e = new Error('terminated by other getUpdates request'); e.error_code = 409; e.description = e.message; throw e; }
      await new Promise((r) => setTimeout(r, 40));
      return [];
    }
    return true;
  };
  const bot = new TeleBibz('123456:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', { silent: true, transport });
  await bot.launch({ noSignalHandlers: true, conflictDelay: 25 });
  await new Promise((r) => setTimeout(r, 200));
  bot.stop();
  await bot.runPromise;
  assert.ok(polls >= 2, `harus retry minimal sekali, polls=${polls}`);
});

/* ===== 14. webhook handler Node murni ===== */
t('webhook(): body JSON diproses handleUpdate', async () => {
  const { Readable } = require('stream');
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('start', (ctx) => ctx.reply('hai webhook'));
  const handler = bot.webhook();
  const upd = uMsg('/start');
  const req = Readable.from([JSON.stringify(upd)]);
  let status = 0, bodyOut = '';
  const res = { set statusCode(v) { status = v; }, get statusCode() { return status; }, setHeader() {}, end(b) { bodyOut = b; } };
  await handler(req, res);
  assert.strictEqual(status, 200);
  assert.ok(texts(calls).some((x) => /hai webhook/.test(x)));
});
