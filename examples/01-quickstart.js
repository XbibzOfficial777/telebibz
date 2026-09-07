// examples/01-quickstart.js — bot jalan dalam 6 baris kode.
//   BOT_TOKEN=123:abc node examples/01-quickstart.js
'use strict';

const { TeleBibz } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('start', (ctx) => ctx.reply(`Halo ${ctx.from.first_name}! Aku hidup 🎉`));
bot.hears(/halo|hai/i, (ctx) => ctx.reply('Halo juga! 👋'));
bot.hears('ping', (ctx) => ctx.reply('pong 🏓'));

bot.launch();
