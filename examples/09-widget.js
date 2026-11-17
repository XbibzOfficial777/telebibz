// examples/09-widget.js — Bot API 10.4: HTML widget, query dari widget, edit data.
//
// Jalankan:  BOT_TOKEN=123:ABC node examples/09-widget.js
// Lalu di Telegram: /widget  ·  tekan tombol "Perbarui"  ·  /hapus
//
// Catatan Telegram (bukan batasan TeleBibz):
//   - widget hanya bisa dikirim ke private chat di lingkungan produksi;
//   - widget otomatis protected content (tidak bisa diforward / copyMessage);
//   - query harus dijawab ≤ 15 detik, maksimal 5 query / 5 detik per pengguna.

'use strict';

const { TeleBibz, btn, kb } = require('..');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN belum diatur. Contoh: BOT_TOKEN=123:ABC node examples/09-widget.js');

const bot = new TeleBibz(token);
let sentMessageId;

const html = (status) => `
  <div style="font:600 16px system-ui">Status layanan</div>
  <div style="opacity:.7">${status}</div>
  <div style="margin-top:8px;font:12px ui-monospace">${new Date().toLocaleString('id-ID')}</div>
`;

bot.start((ctx) => ctx.replyWithHTML(
  '<b>Contoh HTML widget (Bot API 10.4)</b>\n\n' +
  '/widget — kirim widget berisi tombol\n' +
  '/hapus — hapus widget terakhir',
));

// 1) Kirim widget. `allow_queries` wajib bila widget mengirim query ke bot.
bot.cmd('widget', async (ctx) => {
  const msg = await ctx.replyWithWidget(html('Semua sistem normal'), {
    width: 320,
    height: 120,
    caption: 'Diperbarui otomatis',
    allow_queries: true,   // izinkan widget memanggil bot
    is_shared: false,      // true → bisa dikirim ulang via widget_id
    reply_markup: kb.markup([[btn('🔄 Perbarui', 'widget:refresh', 'primary')]]),
  });
  sentMessageId = msg.message_id;
});

// 2) Query dari widget. Filter 'widget_query' sudah dikenali otomatis.
bot.on('widget_query', async (ctx) => {
  console.log('query dari widget:', ctx.widgetQueryId, ctx.widget_query.data, ctx.widget_query.type.type);
  // Wajib dijawab dalam 15 detik, kalau tidak widget menampilkan error.
  await ctx.answerWidgetQuery('diterima:' + Date.now());
});

// Query dari widget yang sudah diforward (shared widget).
bot.on('shared_widget_query:data', async (ctx) => {
  console.log('shared widget query, widget_id =', ctx.widget_query.widget_id);
  await ctx.answerWidgetQuery('ok');
});

// 3) Ubah data widget di pesan yang sama tanpa mengirim pesan baru.
bot.action('widget:refresh', async (ctx) => {
  await ctx.editWidgetData({ public_data: 'diperbarui:' + Date.now() });
  await ctx.answerCallbackQuery('Data widget diperbarui');
});

// 4) Hapus widget terakhir.
bot.cmd('hapus', async (ctx) => {
  if (!sentMessageId) return ctx.reply('Belum ada widget — kirim /widget dulu.');
  await ctx.api.deleteMessage(ctx.chatId, sentMessageId);
  sentMessageId = undefined;
  return ctx.reply('Widget dihapus.');
});

bot.launch();
