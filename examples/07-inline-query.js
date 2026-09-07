// examples/07-inline-query.js — mode inline: ketik @botkamu apa saja di chat apa pun.
'use strict';

const { TeleBibz, iq } = require('..');

const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.inlineQuery('*', async (ctx) => {
  const q = (ctx.inline_query.query || '').trim();
  const hasil = [
    iq.article('echo', `Echo: ${q || '…'}`, { message_text: q || 'ketik sesuatu setelah @botkamu' }),
    iq.article('caps', 'HURUF BESAR', { message_text: (q || 'HALO').toUpperCase() }),
    iq.article('terbalik', 'Balik teks', { message_text: [...(q || 'halo')].reverse().join('') }),
  ];
  await ctx.answerInlineQuery(hasil, { cache_time: 0, is_personal: true });
});

bot.launch();
