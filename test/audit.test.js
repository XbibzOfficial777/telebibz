'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');
const { Readable } = require('node:stream');
const { TeleBibz, File } = require('..');
const { Composer, BotError } = require('../lib/composer');
const { pollLoop } = require('../lib/runner');
const { createTransport, ApiError } = require('../lib/net');
const { makeApi } = require('../lib/api');

const checks = [];
async function test(name, fn) {
  await fn();
  checks.push(name);
  console.log(`  ✓ audit: ${name}`);
}

async function main() {
  await test('errorBoundary benar-benar membungkus handler dan memberi BotError + ctx', async () => {
    const root = new Composer();
    let received;
    root.errorBoundary((err) => { received = err; }, async () => { throw new Error('boom'); });
    const ctx = { update: {} };
    await root.run(ctx);
    assert.ok(received instanceof BotError);
    assert.equal(received.message, 'boom');
    assert.equal(received.ctx, ctx);
  });

  await test('regex global di hears/callback tidak kehilangan match berturut-turut', async () => {
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async () => true });
    let textHits = 0;
    bot.hears(/ping/g, () => { textHits++; });
    const msg = (text) => ({ message: { text, chat: { id: 1, type: 'private' }, from: { id: 1 } } });
    await bot.handleUpdate(msg('ping')); await bot.handleUpdate(msg('ping'));
    assert.equal(textHits, 2);
    let callbackHits = 0;
    bot.action(/go/g, () => { callbackHits++; });
    const cb = () => ({ callback_query: { id: 'q', data: 'go', from: { id: 1 }, message: { message_id: 1, chat: { id: 1 } } } });
    await bot.handleUpdate(cb()); await bot.handleUpdate(cb());
    assert.equal(callbackHits, 2);
    const { matchInlineQuery } = require('../lib/inline-query');
    const inlineMatcher = matchInlineQuery(/cat/g);
    assert.equal(inlineMatcher({ inline_query: { query: 'cat' } }), true);
    assert.equal(inlineMatcher({ inline_query: { query: 'cat' } }), true);
  });

  await test('Composer route/lazy/fork meneruskan middleware dan fork tidak memblokir', async () => {
    const c = new Composer();
    const order = [];
    c.route((ctx) => ctx.kind, { private: async (_ctx, next) => { order.push('route'); await next(); } });
    c.lazy(async () => async (_ctx, next) => { order.push('lazy'); await next(); });
    c.fork(async () => { await new Promise((r) => setTimeout(r, 5)); order.push('fork'); });
    await c.run({ kind: 'private' });
    assert.deepEqual(order, ['route', 'lazy']);
    await new Promise((r) => setTimeout(r, 15));
    assert.deepEqual(order, ['route', 'lazy', 'fork']);
  });

  await test('session adapter hasil deserialize ditulis ulang setelah update', async () => {
    const data = new Map();
    const storage = {
      read: async (key) => data.has(key) ? structuredClone(data.get(key)) : undefined,
      write: async (key, val) => data.set(key, structuredClone(val)),
      delete: async (key) => data.delete(key),
    };
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async () => true, session: { storage } });
    let observed = [];
    bot.on(':text', (ctx) => { observed.push(ctx.session.count || 0); ctx.session.count = (ctx.session.count || 0) + 1; });
    const update = (text) => ({ message: { text, from: { id: 7 }, chat: { id: 7, type: 'private' } } });
    await bot.handleUpdate(update('first')); await bot.handleUpdate(update('second'));
    assert.deepEqual(observed, [0, 1]);
    assert.equal(data.get('7:7').count, 2);
  });

  await test('guest_message diteruskan ke Context dan answerGuestQuery membentuk payload resmi', async () => {
    const calls = [];
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async (m, p) => { calls.push({ m, p }); return true; } });
    let seen;
    bot.on('guest_message:text', async (ctx) => {
      seen = { text: ctx.msg.text, chat: ctx.chat.id, query: ctx.guestQueryId };
      await ctx.answerGuestQuery({ type: 'article', id: '1', title: 'Balasan', input_message_content: { message_text: 'Hai' } });
    });
    await bot.handleUpdate({ guest_message: { guest_query_id: 'guest-1', text: 'halo', chat: { id: 22, type: 'private' }, from: { id: 9 } } });
    assert.deepEqual(seen, { text: 'halo', chat: 22, query: 'guest-1' });
    assert.deepEqual(calls[0], { m: 'answerGuestQuery', p: { guest_query_id: 'guest-1', result: { type: 'article', id: '1', title: 'Balasan', input_message_content: { message_text: 'Hai' } } } });
  });

  await test('business voice reply dan callback reaction membawa konteks yang benar', async () => {
    const calls = [];
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async (m, p) => { calls.push({ m, p }); return true; } });
    bot.on('business_message', (ctx) => ctx.replyWithVoice('voice-id'));
    await bot.handleUpdate({ business_message: { business_connection_id: 'biz-1', message_id: 8, from: { id: 3 }, chat: { id: 55, type: 'private' } } });
    bot.action('react', (ctx) => ctx.react('🔥'));
    await bot.handleUpdate({ callback_query: { id: 'cb', data: 'react', from: { id: 3 }, message: { message_id: 12, chat: { id: 56, type: 'private' } } } });
    const voice = calls.find((c) => c.m === 'sendVoice');
    const reaction = calls.find((c) => c.m === 'setMessageReaction');
    assert.equal(voice.p.business_connection_id, 'biz-1');
    assert.equal(reaction.p.chat_id, 56);
    assert.equal(reaction.p.message_id, 12);
  });

  await test('Bot API 10.3 seluruh tipe Update diminta saat polling default', async () => {
    let bot;
    let captured;
    const transport = async (method, payload) => {
      if (method === 'getMe') return { id: 1, is_bot: true, username: 'auditbot' };
      if (method === 'getUpdates') { captured = payload.allowed_updates; bot.stop(); return []; }
      return true;
    };
    bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport });
    await bot.launch({ noSignalHandlers: true });
    await bot.runPromise;
    for (const field of [
      'channel_post', 'edited_channel_post', 'deleted_business_messages', 'guest_message',
      'chat_boost', 'removed_chat_boost', 'stopped_message_generation', 'purchased_paid_media',
    ]) assert.ok(captured.includes(field), `allowed_updates hilang: ${field}`);
    assert.equal(new Set(captured).size, captured.length, 'allowed_updates berisi duplikat');
  });

  await test('poller retry ECONNRESET dan 429 sesuai retry_after tanpa fatal stop', async () => {
    let calls = 0, stopped = false, fatals = 0;
    const api = { callApi: async () => {
      calls++;
      if (calls === 1) { const e = new Error('socket reset'); e.code = 'ECONNRESET'; e.network = true; throw e; }
      if (calls === 2) { const e = new Error('Too Many Requests'); e.error_code = 429; e.parameters = { retry_after: 0 }; throw e; }
      stopped = true; return [];
    } };
    await pollLoop({ api, handleUpdate: async () => {}, allowedUpdates: [], dropPending: false, shouldStop: () => stopped, onFatal: () => fatals++ });
    assert.equal(calls, 3);
    assert.equal(fatals, 0);
  });

  await test('throttler tetap menjalankan antrean setelah satu request gagal', async () => {
    const { throttler } = require('../lib/ratelimit');
    const calls = [];
    const run = throttler({ perSecond: 10000 });
    const prev = async (_method, payload) => { calls.push(payload.id); if (payload.id === 1) throw new Error('one-off'); return payload.id; };
    const settled = await Promise.allSettled([run(prev, 'a', { id: 1 }), run(prev, 'b', { id: 2 })]);
    assert.equal(settled[0].status, 'rejected');
    assert.equal(settled[1].status, 'fulfilled');
    assert.deepEqual(calls, [1, 2]);
  });

  await test('transport lokal memvalidasi JSON, multipart attach://, dan ApiError', async () => {
    const received = [];
    const server = http.createServer((req, res) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        received.push({ url: req.url, type: req.headers['content-type'], body });
        if (req.url.endsWith('/bad')) {
          res.writeHead(400, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error_code: 400, description: 'bad payload', parameters: { retry_after: 2 } }));
        } else {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ ok: true, result: { accepted: true } }));
        }
      });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const root = `http://127.0.0.1:${server.address().port}`;
    try {
      const transport = createTransport('123456:TESTTOKEN', { apiRoot: root });
      assert.deepEqual(await transport('sendMessage', { chat_id: 1, text: 'hi' }), { accepted: true });
      assert.match(received[0].type, /application\/json/);
      assert.deepEqual(JSON.parse(received[0].body), { chat_id: 1, text: 'hi' });
      await transport('sendMediaGroup', { chat_id: 1, media: [{ type: 'photo', media: new File(Buffer.from('pic'), 'pic.jpg') }] });
      assert.match(received[1].type, /multipart\/form-data; boundary=/);
      assert.match(received[1].body, /attach:\/\/file0/);
      const { rich, InputMediaBuilder } = require('..');
      await transport('sendRichMessage', {
        chat_id: 1,
        rich_message: rich.blocks([rich.photo(InputMediaBuilder.photo(new File(Buffer.from('rich-image'), 'rich.jpg')))]),
      });
      assert.match(received[2].body, /attach:\/\/file0/);
      assert.match(received[2].body, /rich_message/);
      const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, apiRoot: root });
      assert.deepEqual(await bot.init(), { accepted: true });
      assert.ok(received.some((r) => r.url === '/bot123456:TESTTOKEN/getMe'));
      await assert.rejects(transport('bad', {}), (e) => e instanceof ApiError && e.error_code === 400 && e.method === 'bad' && e.parameters.retry_after === 2);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  await test('webhook memverifikasi secret token Telegram dan membatasi ukuran request', async () => {
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async () => true });
    let hits = 0;
    bot.on(':text', () => { hits++; });
    assert.throws(() => bot.webhook({ secretToken: '' }), /secretToken/);
    const handler = bot.webhook({ secretToken: 'secret-123', maxBodyBytes: 200 });
    const invoke = async (body, headers = {}, method = 'POST') => {
      const req = Readable.from([body]); req.headers = headers; req.method = method;
      let status = 0;
      const res = { set statusCode(v) { status = v; }, setHeader() {}, end() {} };
      await handler(req, res); return status;
    };
    const update = JSON.stringify({ message: { text: 'secure', from: { id: 1 }, chat: { id: 1, type: 'private' } } });
    assert.equal(await invoke(update), 401);
    assert.equal(await invoke(update, { 'x-telegram-bot-api-secret-token': 'secret-123' }), 200);
    assert.equal(await invoke('x'.repeat(201), { 'x-telegram-bot-api-secret-token': 'secret-123' }), 413);
    assert.equal(hits, 1);
  });

  await test('File input Buffer, Uint8Array, path, dan async stream', async () => {
    const tmp = path.join(os.tmpdir(), `telebibz-${process.pid}.bin`);
    await fs.writeFile(tmp, 'path-data');
    try {
      assert.equal((await new File(Buffer.from('buf')).data()).toString(), 'buf');
      assert.equal((await new File(new Uint8Array([65, 66])).data()).toString(), 'AB');
      assert.equal((await new File(tmp).data()).toString(), 'path-data');
      assert.equal((await new File(Readable.from(['stream-'])).data()).toString(), 'stream-');
    } finally { await fs.rm(tmp, { force: true }); }
  });

  await test('downloadFile menghormati apiRoot khusus dan menulis stream dengan benar', async () => {
    const dest = path.join(os.tmpdir(), `telebibz-download-${process.pid}.txt`);
    let requestedUrl;
    const api = makeApi('123456:TESTTOKEN', async (method) => method === 'getFile' ? { file_path: 'files/a.txt' } : true, { apiRoot: 'https://api.example.test' });
    try {
      await api.downloadFile('file-id', dest, { adapter: async (config) => {
        requestedUrl = config.url;
        return { data: Readable.from(['downloaded']), status: 200, statusText: 'OK', headers: {}, config };
      } });
      assert.equal(requestedUrl, 'https://api.example.test/file/bot123456:TESTTOKEN/files/a.txt');
      assert.equal(await fs.readFile(dest, 'utf8'), 'downloaded');
    } finally { await fs.rm(dest, { force: true }); }
  });

  await test('Proxy API current Bot API accepts modern methods via payload object', async () => {
    const calls = [];
    const api = makeApi('123456:TESTTOKEN', async (m, p) => { calls.push({ m, p }); return true; });
    await api.sendRichMessage({ chat_id: 1, rich_message: { blocks: [] }, ephemeral_message_parameters: {} });
    await api.sendLivePhoto({ chat_id: 1, live_photo: 'live-id', photo: 'photo-id' });
    await api.sendMessageDraft({ chat_id: 1, draft_id: 1, text: 'partial', can_stop: true });
    assert.equal(api.then, undefined, 'Proxy jangan berubah menjadi thenable');
    assert.equal(await api, api, 'await api tidak boleh mengirim request semu');
    assert.deepEqual(calls.map((c) => c.m), ['sendRichMessage', 'sendLivePhoto', 'sendMessageDraft']);
    assert.equal(calls[0].p.ephemeral_message_parameters !== undefined, true);
    assert.equal(calls[2].p.can_stop, true);
  });

  await test('Rich Message builder mencakup format, nested blocks, style dan validasi eksklusif', () => {
    const { rich, RichMessageBuilder, inputRichMessage, InputMediaBuilder, InputPaidMediaBuilder } = require('..');
    const message = rich.blocks([
      rich.heading('Ringkasan', 2),
      rich.paragraph(['Halo ', rich.bold('dunia'), ' ', rich.customEmoji('emoji-1', '✨')]),
      rich.list(['item satu', { blocks: [rich.code('x=1')], has_checkbox: true }]),
      rich.table([[{ text: 'A', align: 'left', valign: 'middle' }]], { compact: true, striped: true }),
      rich.details('Info', [rich.paragraph('Isi')], true),
      rich.buttons([rich.button('OK', { callback_data: 'ok' }, 'success')], 'center'),
    ]);
    assert.equal(message.blocks[0].type, 'heading');
    assert.deepEqual(message.blocks[1].text[1], { type: 'bold', text: 'dunia' });
    assert.equal(message.blocks[2].items[0].blocks[0].text, 'item satu');
    assert.equal(message.blocks[3].is_compact, true);
    assert.equal(message.blocks[4].is_open, true);
    assert.equal(message.blocks[5].buttons[0].callback_data, 'ok');
    assert.deepEqual(rich.buttonText('Inline', { callback_data: 'inline' }), { type: 'button', button: { text: 'Inline', callback_data: 'inline' } });
    assert.deepEqual(new RichMessageBuilder().add(rich.paragraph('ok')).rtl().build(), { blocks: [{ type: 'paragraph', text: 'ok' }], is_rtl: true });
    assert.deepEqual(new RichMessageBuilder().markdown('draft').buildDraft(), { markdown: 'draft' });
    assert.deepEqual(rich.draftBlocks([rich.paragraph('partial'), rich.thinking('working')]), { blocks: [{ type: 'paragraph', text: 'partial' }, { type: 'thinking', text: 'working' }] });
    assert.throws(() => rich.draftBlocks([rich.photo(InputMediaBuilder.photo(new File(Buffer.from('not allowed'), 'upload.jpg')))]), /tidak mendukung upload/);
    assert.throws(() => inputRichMessage({ html: 'x', markdown: 'y' }), /tepat satu/);
    assert.throws(() => rich.heading('bad', 7), /1–6/);
    assert.throws(() => rich.button('Link', { url: 'https://example.com' }, 'link'), /callback button/);
    assert.throws(() => rich.buttons([rich.button('OK', { callback_data: 'ok' })], 'justify'), /align/);
    assert.deepEqual(InputMediaBuilder.livePhoto('video', 'photo'), { type: 'live_photo', media: 'video', photo: 'photo' });
    assert.deepEqual(InputPaidMediaBuilder.livePhoto('video', 'photo'), { type: 'live_photo', media: 'video', photo: 'photo' });
  });

  await test('Seluruh family RichText dan InputRichBlock builder memancarkan discriminant schema', () => {
    const { rich } = require('..');
    const entities = [
      rich.bold('x'), rich.italic('x'), rich.underline('x'), rich.strikethrough('x'), rich.spoiler('x'),
      rich.subscript('x'), rich.superscript('x'), rich.marked('x'), rich.code('x'), rich.dateTime('now', 1),
      rich.textMention('x', { id: 1, is_bot: false, first_name: 'A' }), rich.customEmoji('emoji-id', '✨'),
      rich.mathText('x'), rich.url('x', 'https://example.com'), rich.email('a@b.com', 'a@b.com'),
      rich.phone('123', '+123'), rich.bankCard('1234', '1234'), rich.mention('@bot', 'bot'),
      rich.hashtag('#test', 'test'), rich.cashtag('$TEST', 'TEST'), rich.botCommand('/start', 'start'),
      rich.anchorText('anchor'), rich.anchorLink('link', 'anchor'), rich.reference('ref', 'anchor'),
      rich.referenceLink('ref', 'anchor'), rich.buttonText('btn', { callback_data: 'cb' }),
    ];
    assert.deepEqual(entities.map((entity) => entity.type), [
      'bold', 'italic', 'underline', 'strikethrough', 'spoiler', 'subscript', 'superscript', 'marked', 'code', 'date_time',
      'text_mention', 'custom_emoji', 'mathematical_expression', 'url', 'email_address', 'phone_number', 'bank_card_number',
      'mention', 'hashtag', 'cashtag', 'bot_command', 'anchor', 'anchor_link', 'reference', 'reference_link', 'button',
    ]);
    const media = (type) => ({ type, media: `${type}-file-id` });
    const blocks = [
      rich.paragraph('x'), rich.heading('x'), rich.pre('x'), rich.footer('x'), rich.divider(), rich.mathBlock('x'),
      rich.anchor('a'), rich.list(['x']), rich.quote([rich.paragraph('x')]), rich.expandableQuote('x'), rich.pullQuote('x'),
      rich.collage([rich.photo(media('photo'))]), rich.slideshow([rich.video(media('video'))]),
      rich.table([[{ text: 'x', align: 'left', valign: 'middle' }]]), rich.details('s', [rich.paragraph('x')]),
      rich.map({ latitude: 0, longitude: 0 }, 1, 100, 100), rich.animation(media('animation')), rich.audio(media('audio')),
      rich.document(media('document')), rich.photo(media('photo')), rich.video(media('video')),
      rich.voiceNote(media('voice_note')), rich.buttons([rich.button('x', { url: 'https://example.com' })]), rich.thinking('x'),
    ];
    assert.deepEqual(blocks.map((item) => item.type), [
      'paragraph', 'heading', 'pre', 'footer', 'divider', 'mathematical_expression', 'anchor', 'list', 'blockquote',
      'expandable_blockquote', 'pullquote', 'collage', 'slideshow', 'table', 'details', 'map', 'animation', 'audio',
      'document', 'photo', 'video', 'voice_note', 'buttons', 'thinking',
    ]);
  });

  await test('Context memetakan rich send/edit, live photo, ephemeral dan draft ke payload Bot API', async () => {
    const { rich } = require('..');
    const calls = [];
    const bot = new TeleBibz('123456:TESTTOKEN', { silent: true, transport: async (m, p) => { calls.push({ m, p }); return { message_id: 19 }; } });
    bot.cmd('features', async (ctx) => {
      const body = rich.markdown('**Rich**');
      await ctx.replyWithRichMessage(body, { message_thread_id: 7 });
      await ctx.replyWithLivePhoto('video-id', 'photo-id', { caption: 'Moment' });
      await ctx.replyEphemeral('Only you', ctx.from.id, { ephemeral_message_parameters: { callback_query_id: 'q' } });
      await ctx.sendMessageDraft(3, 'Draft', { can_stop: true });
      await ctx.sendRichMessageDraft(4, rich.blocks([rich.thinking('Thinking')]), { can_stop: true });
      await ctx.editRichMessage(body);
    });
    await bot.handleUpdate({ message: { message_id: 8, text: '/features', from: { id: 77 }, chat: { id: 77, type: 'private' } } });
    const payload = (method) => calls.find((c) => c.m === method).p;
    assert.deepEqual(payload('sendRichMessage').rich_message, rich.markdown('**Rich**'));
    assert.equal(payload('sendRichMessage').message_thread_id, 7);
    assert.equal(payload('sendLivePhoto').live_photo, 'video-id');
    assert.deepEqual(payload('sendMessage').ephemeral_message_parameters, { callback_query_id: 'q', receiver_user_id: 77 });
    assert.equal(payload('sendMessageDraft').can_stop, true);
    assert.equal(payload('sendRichMessageDraft').draft_id, 4);
    assert.equal(payload('editMessageText').rich_message.markdown, '**Rich**');
  });

  await test('Seluruh 185 nama metode Bot API 10.3 lewat jalur callApi generic', async () => {
    const { TELEGRAM_API_METHODS } = require('..');
    const calls = [];
    const api = makeApi('123456:TESTTOKEN', async (method, payload) => { calls.push([method, payload]); return true; });
    assert.equal(TELEGRAM_API_METHODS.length, 185);
    assert.equal(new Set(TELEGRAM_API_METHODS).size, TELEGRAM_API_METHODS.length, 'registry tidak boleh berisi duplikat');
    const methodTypes = await fs.readFile(path.join(__dirname, '../types/telegram-bot-api/methods.d.ts'), 'utf8');
    const declaredMethods = [...methodTypes.matchAll(/^ {4}([A-Za-z0-9_]+)\(/gm)].map((match) => match[1]);
    assert.deepEqual([...TELEGRAM_API_METHODS].sort(), declaredMethods.sort(), 'registry runtime harus sinkron dengan schema method TypeScript vendored');
    await Promise.all(TELEGRAM_API_METHODS.map((method) => api.callApi(method, {})));
    assert.deepEqual(calls.map(([method]) => method).sort(), [...TELEGRAM_API_METHODS].sort());
    for (const method of ['sendRichMessage', 'sendRichMessageDraft', 'editEphemeralMessageText', 'answerGuestQuery', 'setManagedBotAccessSettings']) {
      assert.ok(TELEGRAM_API_METHODS.includes(method), `${method} belum terdaftar`);
    }
  });

  console.log(`\n${checks.length}/${checks.length} audit checks passed`);
}

main().catch((err) => { console.error(err.stack || err); process.exitCode = 1; });
