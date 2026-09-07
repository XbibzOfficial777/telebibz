// examples/02-menu-tombol.js — inline keyboard berwarna + ikon animated.
'use strict';

const { TeleBibz, btn, url, kb } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('menu', (ctx) =>
  ctx.reply('Pilih menu:', kb([
    [btn('💎 Premium', 'premium', 'primary'), btn('📞 Bantuan', 'bantuan')],
    [url('🌐 Website', 'https://example.com', 'success')],
    [btn('❌ Tutup', 'tutup', 'danger')],
  ])));

bot.action('premium', async (ctx) => {
  await ctx.answerCallbackQuery('Menuju halaman premium…');
  await ctx.reply('💎 Daftar paket premium…');
});
bot.action('bantuan', (ctx) => ctx.answerCallbackQuery({ text: 'Hubungi @admin ya!', show_alert: true }));
bot.action('tutup', (ctx) => ctx.deleteMessage().catch(() => {}));

bot.launch();
