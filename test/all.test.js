// test/all.test.js — 14 kasus, 100% tanpa jaringan (transport disuntik).
'use strict';

const assert = require('assert');
const { TeleBibz, btn, url, kb, webApp, copy, humanize, File, InlineKeyboard,
  Menu, MenuContainer, iq, autoRetry, throttler, limiter, InputMediaBuilder } = require('..');

// Hitungan test otomatis: TOTAL diisi dari jumlah test yang terdaftar di akhir berkas,
// jadi menambah test tidak lagi perlu mengubah konstanta manual (dulu bisa "exit dini").
let N = 0, OK = 0, TOTAL = 0, REGISTERED = 0;
const t = (nama, fn) => {
  REGISTERED++;
  const done = () => { N++; if (TOTAL && N === TOTAL) { console.log(`\n${OK}/${N} lulus`); process.exit(OK === N ? 0 : 1); } };
  Promise.resolve()
    .then(fn)
    .then(() => { OK++; console.log(`  ✓ ${nama}`); done(); })
    .catch((e) => { console.error(`  ✗ ${nama}\n    ${e.stack || e}`); done(); });
};

/* ===== harness: bot dengan transport palsu (merekam panggilan API) ===== */
function buatBot(overrides = {}, options = {}) {
  const calls = [];
  const transport = async (method, payload = {}) => {
    calls.push({ method, payload });
    if (method === 'getMe') return { id: 99, is_bot: true, first_name: 'Tes', username: 'tesbot' };
    if (method === 'sendMessage') return { message_id: calls.length, ...payload };
    if (overrides[method]) return overrides[method](payload);
    return true;
  };
  const bot = new TeleBibz('123456:TESTTOKEN-TESTTOKEN-TESTTOKEN-TESTOKEN', { ...options, silent: true, transport });
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
  bot.api.config.use(async (prev, method, payload) => {
    if (method === 'sendMessage' && payload.chat_id === 99) {
      const e = new Error('Forbidden: bot was blocked by the user');
      e.description = 'bot was blocked by the user'; throw e;
    }
    return prev(method, payload);
  });
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

/* ===== Concurrency: 256 pengguna berbeda diproses tanpa serial menunggu ===== */
t('handleUpdate menjalankan 256 pengguna secara konkuren secara default', async () => {
  const { bot } = buatBot();
  await boot(bot);
  const target = 256;
  let active = 0, peak = 0, started = 0, release;
  const gate = new Promise((resolve) => { release = resolve; });
  const fallback = setTimeout(release, 1000);
  bot.on(':text', async () => {
    active++;
    started++;
    peak = Math.max(peak, active);
    if (started === target) release();
    await gate;
    active--;
  });
  const updates = Array.from({ length: target }, (_, i) => ({
    update_id: 10000 + i,
    message: { message_id: i + 1, date: 1, text: `user-${i}`, from: { id: i + 1 }, chat: { id: i + 1, type: 'private' } },
  }));
  await Promise.all(updates.map((update) => bot.handleUpdate(update)));
  clearTimeout(fallback);
  assert.equal(started, target);
  assert.equal(peak, target, 'semua 256 update harus dapat berjalan bersamaan');
});

t('maxConcurrentUpdates membatasi worker update dan memvalidasi nilai', async () => {
  const { bot } = buatBot({}, { maxConcurrentUpdates: 3 });
  await boot(bot);
  let active = 0, peak = 0;
  bot.on(':text', async () => {
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
  });
  const updates = Array.from({ length: 12 }, (_, i) => ({
    update_id: 20000 + i,
    message: { message_id: i + 1, date: 1, text: `user-${i}`, from: { id: i + 1 }, chat: { id: i + 1, type: 'private' } },
  }));
  await Promise.all(updates.map((update) => bot.handleUpdate(update)));
  assert.equal(peak, 3);
  assert.throws(() => new TeleBibz('123456:TESTTOKEN', { maxConcurrentUpdates: 0 }), /maxConcurrentUpdates/);
});

t('update dari session key sama tetap berurutan untuk menjaga state', async () => {
  const { bot } = buatBot();
  await boot(bot);
  const order = [];
  bot.on(':text', async (ctx) => {
    order.push(`start:${ctx.msg.text}`);
    await new Promise((resolve) => setTimeout(resolve, 5));
    order.push(`end:${ctx.msg.text}`);
  });
  const makeUpdate = (update_id, text) => ({
    update_id,
    message: { message_id: update_id, date: 1, text, from: { id: 700 }, chat: { id: 700, type: 'private' } },
  });
  await Promise.all([bot.handleUpdate(makeUpdate(1, 'first')), bot.handleUpdate(makeUpdate(2, 'second'))]);
  assert.deepEqual(order, ['start:first', 'end:first', 'start:second', 'end:second']);
});

/* ===== 15. Proxy API generik: metode apapun ===== */
t('Proxy: api.metodeBebas(payload) → callApi mentah', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  await bot.api.sendDiceCustom({ chat_id: 1, emoji: '🎲' });
  const c = calls.find((x) => x.method === 'sendDiceCustom');
  assert.ok(c && c.payload.emoji === '🎲');
});

/* ===== 16. transformer pipeline ===== */
t('api.config.use: transformer melihat semua panggilan', async () => {
  const { bot } = buatBot(); await boot(bot);
  const seen = [];
  bot.api.config.use(async (prev, m, p) => { seen.push(m); return prev(m, p); });
  await bot.api.sendMessage(1, 'a'); await bot.api.getMyCommands();
  assert.deepStrictEqual(seen, ['sendMessage', 'getMyCommands']);
});

/* ===== 17. autoRetry menahan 429 sekali ===== */
t('autoRetry: 429 + retry_after dihormati lalu sukses', async () => {
  let hits = 0;
  const tr = async (m) => { hits++; if (hits === 1) { const e = new Error('Too Many Requests'); e.error_code = 429; e.parameters = { retry_after: 0 }; throw e; } return true; };
  const out = await autoRetry({ maxRetry: 2, baseDelayMs: 1 })(tr, 'sendMessage', {});
  assert.ok(out === true && hits === 2);
});

/* ===== 18. throttler memanggil berurutan ===== */
t('throttler: semua panggilan lolos berurutan', async () => {
  const order = []; const tr = async (m) => { order.push(m); return m; };
  const th = throttler({ perSecond: 1000 });
  await Promise.all([th(tr, 'a', {}), th(tr, 'b', {}), th(tr, 'c', {})]);
  assert.deepStrictEqual(order, ['a', 'b', 'c']);
});

/* ===== 19. limiter menahan spam ===== */
t('limiter: update ke-4 dalam window ditahan', async () => {
  const { bot } = buatBot(); await boot(bot);
  let hits = 0;
  bot.use(limiter({ windowMs: 60000, limit: 3 }));
  bot.on(':text', () => { hits++; });
  for (let i = 0; i < 5; i++) await bot.handleUpdate(uMsg('x' + i));
  assert.strictEqual(hits, 3);
});

/* ===== 20. Menu render + tekan ===== */
t('Menu: render keyboard & handler tombol jalan', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  const mc = new MenuContainer();
  const m = mc.create('cfg');
  let pressed = 0;
  m.text('Tombol', async (ctx) => { pressed++; await ctx.answerCallbackQuery('sip'); });
  bot.use(mc);
  const rm = await m.render({});
  const cbData = rm.inline_keyboard[0][0].callback_data;
  assert.strictEqual(cbData, 'cfg|0');
  await bot.handleUpdate({ update_id: ++uid, callback_query: { id: 'c1', from: USER, chat_instance: 'x', data: cbData, message: { message_id: 9, from: { id: 99, is_bot: true, first_name: 'B' }, chat: CHAT, date: 1 } } });
  assert.strictEqual(pressed, 1);
  assert.ok(calls.some((c) => c.method === 'answerCallbackQuery' && c.payload.text === 'sip'));
});

/* ===== 21. inlineQuery ===== */
t('inlineQuery: regex cocok, answerInlineQuery terkirim', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.inlineQuery(/kucing/i, async (ctx) => {
    await ctx.answerInlineQuery([iq.article('1', 'Kucing garong', { message_text: 'meong!' })], { cache_time: 0 });
  });
  await bot.handleUpdate({ update_id: ++uid, inline_query: { id: 'i1', from: USER, query: 'kucing lucu', offset: '' } });
  const c = calls.find((x) => x.method === 'answerInlineQuery');
  assert.ok(c && c.payload.results[0].type === 'article');
});

/* ===== 22. replyWithMediaGroup ===== */
t('replyWithMediaGroup membentuk payload media', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('album', (ctx) => ctx.replyWithMediaGroup([
    InputMediaBuilder.photo('https://a/1.jpg'), InputMediaBuilder.photo('https://a/2.jpg', { caption: 'dua' }),
  ]));
  await bot.handleUpdate(uMsg('/album'));
  const c = calls.find((x) => x.method === 'sendMediaGroup');
  assert.ok(c && c.payload.media.length === 2 && c.payload.media[1].caption === 'dua');
});

/* ===== 23. composer lanjutan: branch/drop/filter ===== */
t('branch/drop/filter berperilaku benar (semantik grammY)', async () => {
  // bot A: branch memilih sub-pohon
  const A = buatBot(); await boot(A.bot);
  const tagA = [];
  A.bot.branch((ctx) => ctx.msg.text === 'yes', async () => { tagA.push('A'); }, async () => { tagA.push('B'); });
  await A.bot.handleUpdate(uMsg('yes'));
  await A.bot.handleUpdate(uMsg('no'));
  assert.deepStrictEqual(tagA, ['A', 'B']);

  // bot B: filter menjalankan hanya saat cocok; drop menahan saat cocok
  const B = buatBot(); await boot(B.bot);
  const tagB = [];
  B.bot.filter((ctx) => ctx.msg.text.startsWith('fi'), async () => { tagB.push('F'); });
  B.bot.drop((ctx) => ctx.msg.text === 'toxic', async () => { tagB.push('TERTAHAN'); });
  await B.bot.handleUpdate(uMsg('file update'));
  await B.bot.handleUpdate(uMsg('toxic'));        // drop(pred=true) → mw ditahan ✓
  await B.bot.handleUpdate(uMsg('bukan cocok'));  // drop(pred=false) → mw jalan ✓
  assert.deepStrictEqual(tagB, ['F', 'TERTAHAN']);
});

/* ===== 24. ctx.getFile pilih photo terbesar ===== */
t('ctx.getFile() memilih ukuran photo terbesar', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.on('message:photo', async (ctx) => { const f = await ctx.getFile(); await ctx.reply('got:' + f.file_path || 'x'); });
  await bot.handleUpdate({
    update_id: ++uid,
    message: { message_id: ++mid, from: USER, chat: CHAT, date: 1, photo: [
      { file_id: 'kecil', width: 90, height: 90 }, { file_id: 'besar', width: 800, height: 600 },
    ] },
  });
  const g = calls.find((c) => c.method === 'getFile');
  assert.ok(g && g.payload.file_id === 'besar');
});

/* ===== 14. webhook handler Node murni ===== */
function fakeRes() {
  const out = { status: 0, body: '', headers: {} };
  out.res = {
    set statusCode(v) { out.status = v; }, get statusCode() { return out.status; },
    setHeader(k, v) { out.headers[k] = v; }, end(b) { out.body = b === undefined ? '' : String(b); },
  };
  return out;
}
function fakeReq(update, headers = {}) {
  const { Readable } = require('stream');
  const req = Readable.from([JSON.stringify(update)]);
  req.method = 'POST';
  req.headers = headers;
  return req;
}

t('webhook(): balas 200 lebih dulu, handler jalan di latar belakang', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('start', async (ctx) => { await new Promise((r) => setTimeout(r, 20)); await ctx.reply('hai webhook'); });
  const handler = bot.webhook();
  const out = fakeRes();
  await handler(fakeReq(uMsg('/start')), out.res);
  assert.strictEqual(out.status, 200, 'harus 200 segera');
  assert.ok(!texts(calls).some((x) => /hai webhook/.test(x)), 'handler belum selesai saat respons dikirim');
  await bot.drainWebhook();
  assert.ok(texts(calls).some((x) => /hai webhook/.test(x)), 'handler tetap selesai setelah respons');
});

t('webhook(): update_id duplikat tidak diproses dua kali', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('start', (ctx) => ctx.reply('sekali saja'));
  const handler = bot.webhook({ awaitProcessing: true });
  const upd = uMsg('/start');
  const a = fakeRes(); await handler(fakeReq(upd), a.res);
  const b = fakeRes(); await handler(fakeReq(upd), b.res);
  assert.strictEqual(a.status, 200);
  assert.strictEqual(b.status, 200);
  assert.match(b.body, /duplicate/, 'duplikat ditandai di respons');
  assert.strictEqual(texts(calls).filter((x) => /sekali saja/.test(x)).length, 1);
});

t('webhook(): awaitProcessing=true menunggu handler (mode serverless)', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('start', (ctx) => ctx.reply('tunggu dulu'));
  const handler = bot.webhook({ awaitProcessing: true });
  const out = fakeRes();
  await handler(fakeReq(uMsg('/start')), out.res);
  assert.strictEqual(out.status, 200);
  assert.ok(texts(calls).some((x) => /tunggu dulu/.test(x)), 'handler sudah selesai sebelum respons');
});

t('webhook(): secret token salah ditolak 401, benar diterima', async () => {
  const { bot } = buatBot(); await boot(bot);
  const handler = bot.webhook({ secretToken: 'rahasia_123' });
  const bad = fakeRes(); await handler(fakeReq(uMsg('/x'), { 'x-telegram-bot-api-secret-token': 'salah' }), bad.res);
  assert.strictEqual(bad.status, 401);
  const good = fakeRes();
  await handler(fakeReq(uMsg('/x'), { 'x-telegram-bot-api-secret-token': 'rahasia_123' }), good.res);
  assert.strictEqual(good.status, 200);
});
/* ===== 25–30. wizard v3.1: tombol + edit/delete ===== */
t('wizard v3.1: tombol reply — label cocok → nilai; onlyButtons menahan ketikan bebas', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  const jawab = [];
  bot.wizard('survey', {
    steps: [
      { key: 'jk', ask: 'Jenis kelamin?', buttons: ['Laki-laki', 'Perempuan'], onlyButtons: true },
      { key: 'kota', ask: 'Kota?' },
    ],
    done: async (ans) => { jawab.push(ans); },
  });
  await bot.handleUpdate(uMsg('/survey'));
  const ask = calls.find((c) => c.method === 'sendMessage' && c.payload.text === 'Jenis kelamin?');
  assert.ok(ask && ask.payload.reply_markup.keyboard[0][0].text === 'Laki-laki');
  await bot.handleUpdate(uMsg('terserah'));         // bukan tombol → ditolak, wizard tetap di langkah 1
  assert.strictEqual(jawab.length, 0);
  await bot.handleUpdate(uMsg('Perempuan'));        // ketuk tombol
  await bot.handleUpdate(uMsg('Magetan'));
  assert.deepStrictEqual(jawab, [{ jk: 'Perempuan', kota: 'Magetan' }]);
});

t('wizard v3.1: tombol inline + mode edit → editMessageText, bukan pesan baru', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  const jawab = [];
  bot.wizard('vote', {
    mode: 'edit',
    steps: [
      { key: 'pilih', ask: 'Pilih salah satu', inline: true, buttons: [[{ text: 'Opsi A', value: 'a' }, { text: 'Opsi B', value: 'b' }]] },
      { key: 'nama', ask: 'Siapa namamu?' },
    ],
    done: async (ans) => { jawab.push(ans); },
  });
  await bot.handleUpdate(uMsg('/vote'));
  const ask = calls.find((c) => c.method === 'sendMessage' && c.payload.text === 'Pilih salah satu');
  const data = ask.payload.reply_markup.inline_keyboard[0][1].callback_data;
  assert.ok(/^wiz:[a-z0-9]+:0:1$/.test(data));
  await bot.handleUpdate({ update_id: ++uid, callback_query: {
    id: 'wq1', from: USER, chat_instance: 'x', data,
    message: { message_id: ask.message_id, from: { id: 99, is_bot: true, first_name: 'B' }, chat: CHAT, date: 1 },
  } });
  assert.ok(calls.some((c) => c.method === 'editMessageText' && c.payload.text === 'Siapa namamu?'), 'langkah 2 harus lewat editMessageText');
  assert.ok(!calls.some((c) => c.method === 'sendMessage' && c.payload.text === 'Siapa namamu?'), 'tidak boleh kirim pesan baru');
  assert.ok(calls.some((c) => c.method === 'answerCallbackQuery' && c.payload.callback_query_id === 'wq1'));
  await bot.handleUpdate(uMsg('Budi'));
  assert.deepStrictEqual(jawab, [{ pilih: 'b', nama: 'Budi' }]);
});

t('wizard v3.1: mode delete → pesan lama dihapus; cleanup hapus pesan tanya terakhir', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.wizard('hapus', {
    mode: 'delete',
    steps: [{ key: 'a', ask: 'Pertanyaan A?' }, { key: 'b', ask: 'Pertanyaan B?' }],
    done: () => {},
  });
  await bot.handleUpdate(uMsg('/hapus'));
  const idxA = calls.findIndex((c) => c.method === 'sendMessage' && c.payload.text === 'Pertanyaan A?');
  assert.ok(idxA >= 0);
  const idA = idxA + 1; // stub transport: message_id = calls.length saat push
  await bot.handleUpdate(uMsg('satu'));
  const dihapus = () => calls.filter((c) => c.method === 'deleteMessage').map((c) => c.payload.message_id);
  assert.ok(dihapus().includes(idA), 'pesan A harus dihapus sebelum tanya B');
  const idxB = calls.findIndex((c) => c.method === 'sendMessage' && c.payload.text === 'Pertanyaan B?');
  await bot.handleUpdate(uMsg('dua'));
  assert.ok(dihapus().includes(idxB + 1), 'cleanup: pesan tanya terakhir ikut dihapus');
});

t('wizard v3.1: reply keyboard otomatis disingkirkan saat wizard selesai', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.wizard('kbd', { steps: [{ key: 'x', ask: 'Pilih:', buttons: ['Ok', 'Tidak'] }], done: () => {} });
  await bot.handleUpdate(uMsg('/kbd'));
  await bot.handleUpdate(uMsg('Ok'));
  assert.ok(calls.some((c) => c.method === 'sendMessage' &&
    c.payload.reply_markup && c.payload.reply_markup.remove_keyboard === true));
});

t('wizard v3.1: klik tombol usang → alert aman, wizard tidak rusak', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.wizard('prog', { steps: [{ key: 'a', ask: 'A?', inline: true, buttons: ['X'] }], done: () => {} });
  await bot.handleUpdate(uMsg('/prog'));
  await bot.handleUpdate({ update_id: ++uid, callback_query: {
    id: 'wq2', from: USER, chat_instance: 'x', data: 'wiz:tokenpalsu:0:0',
    message: { message_id: 1, from: { id: 99, is_bot: true, first_name: 'B' }, chat: CHAT, date: 1 },
  } });
  const alert = calls.find((c) => c.method === 'answerCallbackQuery' && /usang/i.test(c.payload.text || ''));
  assert.ok(alert && alert.payload.show_alert === true);
  await bot.handleUpdate(uMsg('jawaban asli'));   // wizard masih berjalan normal
});

t('wizard v3.1: wizard.cancel() membatalkan sesi secara programatis', async () => {
  const wiz = require('../lib/wizard');
  wiz.define('manual', { steps: [{ key: 'a', ask: 'A?' }], done: () => {}, onCancel: () => {} });
  const replies = [];
  const ctx = {
    session: {},
    chatId: 555,
    reply: async (t) => { replies.push(t); return { message_id: 42 }; },
    api: { editMessageText: async () => true, deleteMessage: async () => true, sendMessage: async () => true },
  };
  await wiz.start(ctx, 'manual');
  assert.strictEqual(wiz.active(ctx), true);
  assert.deepStrictEqual(replies, ['A?']);
  assert.strictEqual(await wiz.cancel(ctx), true);
  assert.strictEqual(wiz.active(ctx), false);
  assert.strictEqual(await wiz.cancel(ctx), false); // sudah tidak aktif
});

/* ===== 31+. Bot API 10.4: widget, ephemeral callback, filter baru ===== */

t('registry memuat seluruh 193 metode Bot API 10.4', async () => {
  const { TELEGRAM_API_METHODS } = require('..');
  assert.strictEqual(TELEGRAM_API_METHODS.length, 193);
  for (const m of ['sendWidget', 'sendSharedWidget', 'answerWidgetQuery', 'editMessageWidgetData',
    'editSharedWidgetData', 'getUniqueGift', 'deleteBusinessAccountGift', 'getChatShareThemeBackdrops']) {
    assert.ok(TELEGRAM_API_METHODS.includes(m), `${m} belum ada di registry`);
  }
});

t('allowedUpdates kosong ditolak cepat dengan pesan jelas', async () => {
  const { TeleBibz } = require('..');
  assert.throws(() => new TeleBibz('123456:TESTTOKEN', { allowedUpdates: [], silent: true, transport: async () => true }), /allowedUpdates/);
  assert.throws(() => new TeleBibz('123456:TESTTOKEN', { allowedUpdates: ['message', 7], silent: true, transport: async () => true }), /string/);
  assert.doesNotThrow(() => new TeleBibz('123456:TESTTOKEN', { allowedUpdates: ['message'], silent: true, transport: async () => true }));
});

t('widget_query: routing, ctx.widgetQueryId, dan answerWidgetQuery', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  let seen;
  bot.on('widget_query', async (ctx) => {
    seen = { id: ctx.widgetQueryId, from: ctx.from.id, data: ctx.widget_query.data };
    await ctx.answerWidgetQuery('terima-kasih');
  });
  await bot.handleUpdate({
    update_id: ++uid,
    widget_query: {
      id: 'wq-1', from: { id: 777, is_bot: false, first_name: 'Sari' },
      chat: { id: 777, type: 'private' }, message_id: 9, chat_instance: 'ci',
      type: { type: 'data' }, data: 'klik', widget_id: 'wid-9',
    },
  });
  assert.deepStrictEqual(seen, { id: 'wq-1', from: 777, data: 'klik' });
  const ans = calls.find((c) => c.method === 'answerWidgetQuery');
  assert.ok(ans, 'answerWidgetQuery harus terkirim');
  assert.deepStrictEqual(ans.payload, { widget_query_id: 'wq-1', data: 'terima-kasih' });
});

t('shared_widget_query juga dirutekan dan bisa dijawab', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.on('shared_widget_query:data', (ctx) => ctx.answerWidgetQuery('ok'));
  await bot.handleUpdate({
    update_id: ++uid,
    shared_widget_query: { id: 'sq-1', from: { id: 5 }, type: { type: 'data' }, data: 'x', widget_id: 'wid' },
  });
  assert.ok(calls.some((c) => c.method === 'answerWidgetQuery' && c.payload.widget_query_id === 'sq-1'));
});

t('filter baru: :live_photo, :rich_message, dan message:widget', async () => {
  const { bot } = buatBot(); await boot(bot);
  const hits = [];
  bot.on(':live_photo', () => { hits.push('live'); });
  bot.on(':rich_message', () => { hits.push('rich'); });
  bot.on('message:widget', () => { hits.push('widget'); });
  const base = { from: USER, chat: CHAT, date: 1 };
  await bot.handleUpdate({ update_id: ++uid, message: { message_id: ++mid, ...base, live_photo: { file_id: 'l', file_unique_id: 'l', width: 1, height: 1, duration: 1 } } });
  await bot.handleUpdate({ update_id: ++uid, message: { message_id: ++mid, ...base, rich_message: { blocks: [] } } });
  await bot.handleUpdate({ update_id: ++uid, message: { message_id: ++mid, ...base, widget: { html: '<b>x</b>' } } });
  assert.deepStrictEqual(hits, ['live', 'rich', 'widget']);
});

t('ctx.replyWithWidget / replyWithSharedWidget / editWidgetData memetakan payload resmi', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.cmd('widget', async (ctx) => {
    await ctx.replyWithWidget('<b>halo</b>', { is_shared: true, allow_queries: true });
    await ctx.replyWithSharedWidget('wid-1', { caption: 'lagi' });
  });
  await bot.handleUpdate(uMsg('/widget'));
  const [w, sw] = [calls.find((c) => c.method === 'sendWidget'), calls.find((c) => c.method === 'sendSharedWidget')];
  assert.strictEqual(w.payload.html, '<b>halo</b>');
  assert.strictEqual(w.payload.is_shared, true);
  assert.strictEqual(w.payload.allow_queries, true);
  assert.strictEqual(sw.payload.widget_id, 'wid-1');

  const c2 = buatBot(); await boot(c2.bot);
  c2.bot.action('wdata', (ctx) => ctx.editWidgetData({ public_data: 'v2' }));
  await c2.bot.handleUpdate({ update_id: ++uid, callback_query: { id: 'cbw', data: 'wdata', from: USER, message: { message_id: 33, chat: CHAT, date: 1 } } });
  const edit = c2.calls.find((c) => c.method === 'editMessageWidgetData');
  assert.deepStrictEqual(edit.payload, { chat_id: CHAT.id, message_id: 33, public_data: 'v2' });
});

t('ctx.replyEphemeralToCallback memakai callback_query_id tanpa receiver_user_id', async () => {
  const { bot, calls } = buatBot(); await boot(bot);
  bot.action('hint', (ctx) => ctx.replyEphemeralToCallback('cuma kamu'));
  await bot.handleUpdate({ update_id: ++uid, callback_query: { id: 'cb-eph', data: 'hint', from: USER, message: { message_id: 44, chat: CHAT, date: 1 } } });
  const send = calls.find((c) => c.method === 'sendMessage');
  assert.deepStrictEqual(send.payload.ephemeral_message_parameters, { callback_query_id: 'cb-eph' });
  assert.strictEqual(send.payload.ephemeral_message_parameters.receiver_user_id, undefined);
});

t('ctx.downloadFile menghormati apiRoot custom dan menulis file', async () => {
  const http = require('http'); const fs = require('fs'); const os = require('os'); const path = require('path');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('isi:' + req.url); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const dest = path.join(os.tmpdir(), `telebibz-ctxdl-${process.pid}.txt`);
  try {
    const { bot } = buatBot({ getFile: () => ({ file_id: 'f1', file_path: 'docs/a.txt' }) }, { apiRoot: `http://127.0.0.1:${port}` });
    await boot(bot);
    bot.on('message:document', (ctx) => ctx.downloadFile(dest));
    await bot.handleUpdate({ update_id: ++uid, message: { message_id: ++mid, from: USER, chat: CHAT, date: 1, document: { file_id: 'f1', file_unique_id: 'u1' } } });
    assert.match(fs.readFileSync(dest, 'utf8'), new RegExp(`^isi:/file/bot[^/]+/docs/a\\.txt$`));
  } finally {
    if (fs.existsSync(dest)) fs.rmSync(dest, { force: true });
    server.close();
  }
});

t('tombol nonaktif Bot API 10.3: btn.disabled dan InlineKeyboard.disabled', async () => {
  const { btn, InlineKeyboard } = require('..');
  assert.deepStrictEqual(btn.disabled('Segera'), { text: 'Segera', disabled: {} });
  assert.deepStrictEqual(btn('Matikan', null, 'danger'), { text: 'Matikan', disabled: {}, style: 'danger' });
  const ikb = new InlineKeyboard().text('Aktif', 'a').disabled('Mati').build();
  assert.deepStrictEqual(ikb.reply_markup.inline_keyboard[0][1], { text: 'Mati', disabled: {} });
});

t('session onlyWhenChanged tidak menulis ulang session yang tidak berubah', async () => {
  const { session } = require('../lib/session');
  const store = new Map();
  let writes = 0;
  const storage = {
    get: (k) => store.get(k),
    set: (k, v) => { writes += 1; store.set(k, v); },
    delete: (k) => store.delete(k),
  };
  const mw = session({ initial: () => ({ n: 0 }), storage, onlyWhenChanged: true });
  await mw({ from: { id: 1 }, chat: { id: 2 }, session: undefined }, async () => {});
  assert.strictEqual(writes, 1, 'session baru tetap ditulis sekali');
  await mw({ from: { id: 1 }, chat: { id: 2 } }, async () => {});
  assert.strictEqual(writes, 1, 'tidak ada perubahan → tidak menulis');
  const ctx2 = { from: { id: 1 }, chat: { id: 2 } };
  await mw(ctx2, async () => { ctx2.session.n = 5; });
  assert.strictEqual(writes, 2, 'ada perubahan → menulis');
  // default (tanpa onlyWhenChanged) tetap menulis setiap update seperti sebelumnya
  const mw2 = session({ initial: () => ({ n: 0 }), storage });
  await mw2({ from: { id: 9 }, chat: { id: 9 } }, async () => {});
  await mw2({ from: { id: 9 }, chat: { id: 9 } }, async () => {});
  assert.strictEqual(writes, 4);
});

/* Kunci jumlah test: TOTAL baru diketahui setelah semua test terdaftar di atas. */
TOTAL = REGISTERED;
