'use strict';

const { TeleBibz, rich } = require('..');
const bot = new TeleBibz(process.env.BOT_TOKEN);

bot.cmd('rich', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Ringkasan transaksi', 2),
  rich.paragraph(['Status: ', rich.bold('berhasil'), ' · ', rich.customEmoji('5368324170671202286', '✅')]),
  rich.table([
    [{ text: 'Item', is_header: true, align: 'left', valign: 'middle' }, { text: 'Jumlah', is_header: true, align: 'right', valign: 'middle' }],
    [{ text: 'Pesanan #42', align: 'left', valign: 'middle' }, { text: 'Rp 125.000', align: 'right', valign: 'middle' }],
  ], { bordered: true, striped: true, compact: true }),
  rich.details('Rincian', [rich.paragraph('Diproses otomatis oleh bot.')]),
  rich.buttons([
    rich.button('Buka web', { url: 'https://example.com' }, 'primary'),
    rich.button('Konfirmasi', { callback_data: 'confirm:42' }, 'success'),
  ], 'center'),
])));

bot.action(/^confirm:\d+$/, (ctx) => ctx.answerCallbackQuery('Terkonfirmasi'));

bot.cmd('draft', async (ctx) => {
  const draftId = 1;
  await ctx.sendRichMessageDraft(draftId, rich.draftBlocks([
    rich.paragraph('Sedang menyusun jawaban…'),
    rich.thinking('Menganalisis permintaan'),
  ]), { can_stop: true, keep_on_stop: true });
  // Draft Bot API hanya preview sementara. Kirim pesan final agar tersimpan.
  await ctx.replyWithRichMessage(rich.markdown('**Jawaban final**\nSelesai diproses.'));
});

bot.cmd('privat', (ctx) => ctx.replyEphemeral('Pesan ini hanya terlihat oleh Anda.', ctx.from.id));

bot.launch();
