import { TeleBibz, rich, type TelegramMethodName, type TelegramMethodPayload, TelegramTypes } from '..';

const bot = new TeleBibz('123456:TESTTOKEN', { silent: true });
const message = rich.blocks([
  rich.heading('Typed rich content', 2),
  rich.paragraph(['Status: ', rich.bold('ready')]),
  rich.table([[{ text: 'Count', align: 'right', valign: 'middle' }]]),
]);

bot.api.callApi('sendRichMessage', { chat_id: 42, rich_message: message });
bot.api.callApi('sendMessageDraft', { chat_id: 42, draft_id: 1, text: 'Draft', can_stop: true });
bot.api.callApi('sendLivePhoto', { chat_id: 42, live_photo: 'video-id', photo: 'photo-id' });

const method: TelegramMethodName = 'answerGuestQuery';
const payload: TelegramMethodPayload<'answerGuestQuery'> = {
  guest_query_id: 'guest-query-id',
  result: { type: 'article', id: '1', title: 'Answer', input_message_content: { message_text: 'Hello' } },
};
void method;
void payload;
const draft: TelegramTypes.InputRichMessage<never> = rich.draftMarkdown('**streamed text**');
const blockDraft = rich.draftBlocks([rich.paragraph('partial'), rich.thinking('working')]);
bot.on('message', (ctx) => {
  void ctx.sendRichMessageDraft(2, draft);
  void ctx.sendRichMessageDraft(4, blockDraft);
});

// A normal rich message can contain media uploads; drafts have the stricter, no-upload schema.
// @ts-expect-error regular rich builder type may include uploadable media, so it is not a draft payload.
void bot.on('message', (ctx) => ctx.sendRichMessageDraft(3, rich.markdown('draft')));

type RichBlock = TelegramTypes.InputRichBlock<string>;
const block: RichBlock = { type: 'paragraph', text: 'Typed by the vendored Telegram API schema' };
void block;

// Invalid parameters must remain rejected by method-specific TypeScript typing.
// @ts-expect-error sendRichMessage requires chat_id and rich_message, not text.
bot.api.callApi('sendRichMessage', { chat_id: 42, text: 'not a rich message' });
// @ts-expect-error method name must exist in the official Bot API method schema.
bot.api.callApi('sendNotARealMethod', {});
