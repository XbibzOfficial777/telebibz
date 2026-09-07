// examples/06-menu.js — Menu inline ala @grammyjs/menu dengan submenu.
'use strict';

const { TeleBibz, MenuContainer } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);
const mc = new MenuContainer();

const utama = mc.create('utama');
const setelan = mc.create('setelan');

const state = { notif: true };

utama
  .text('⚙️  Setelan', async (ctx) => {
    await ctx.editMessageReplyMarkup({ reply_markup: await setelan.render(ctx) });
    await ctx.answerCallbackQuery();
  })
  .row()
  .url('📚 Dokumentasi', 'https://github.com/XbibzOfficial777/telebibz');

setelan
  .text('🔔 Toggle Notif', async (ctx) => {
    state.notif = !state.notif;
    await ctx.answerCallbackQuery({ text: `Notif ${state.notif ? 'ON ✅' : 'OFF ❌'}` });
  })
  .back('◀️ Kembali', 'utama');

bot.use(mc);

bot.cmd('menu', async (ctx) => {
  await ctx.reply('Pilih menu:', { reply_markup: await utama.render(ctx) });
});

bot.launch();
