---
title: Rich Messages
description: Compose structured text, blocks, tables, buttons, media, and drafts with Telegram's Rich Messages API.
---

# Rich Messages

A Rich Message combines rich-text entities and structured blocks in one Telegram message. TeleBibz provides the `rich` helper, a fluent builder, Context shortcuts, and typed low-level API access. Feature availability and endpoint limits depend on the Telegram Bot API version and bot eligibility; check the [official Telegram documentation](https://core.telegram.org/bots/api) for current requirements.

::: warning Choose one content mode per message
A Rich Message must use exactly one primary content source: `html`, `markdown`, or `blocks`. Options such as media, text direction, and entity detection do not replace the content mode. Do not send more than one mode at a time.
:::

## Build a message from blocks

Each block helper returns a typed `InputRichBlock` object. Blocks can be nested—for example, paragraphs inside a details block—and combined with `rich.blocks(...)`.

```js
const { TeleBibz, rich } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.cmd('report', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Weekly report', 2),
  rich.paragraph(['Status: ', rich.bold('complete')]),
  rich.table([
    [
      { text: 'Metric', is_header: true, align: 'left', valign: 'middle' },
      { text: 'Value', is_header: true, align: 'right', valign: 'middle' },
    ],
    [
      { text: 'Orders', align: 'left', valign: 'middle' },
      { text: '42', align: 'right', valign: 'middle' },
    ],
  ], { bordered: true, striped: true, compact: true, caption: 'This week' }),
  rich.details('Details', [rich.paragraph('The report was generated automatically.')]),
  rich.buttons([
    rich.button('Open dashboard', { url: 'https://example.com' }, 'primary'),
    rich.button('Acknowledge', { callback_data: 'report:ack' }, 'success'),
  ], 'center'),
])));

bot.launch();
```

## HTML, Markdown, and blocks

```js
const message = rich.html('<b>Announcement</b><br>A new version is available.');
await ctx.replyWithRichMessage(message);
```

Use `rich.markdown(markdown, options)` for Markdown or `rich.blocks(blocks, options)` for blocks. `inputRichMessage(content, options)` validates that the payload selects only one content mode.

```js
const { inputRichMessage } = require('@xbibzlibrary/telebibz');

const payload = inputRichMessage({
  blocks: [rich.heading('Service status', 2)],
  is_rtl: false,
});
await ctx.replyWithRichMessage(payload);
```

`RichMessageBuilder` supports incremental construction. Calling `.html()`, `.markdown()`, or `.blocks()` a second time on the same builder is rejected; create a new builder to use another content mode.

```js
const { RichMessageBuilder } = require('@xbibzlibrary/telebibz');

const message = new RichMessageBuilder()
  .blocks([rich.heading('Status', 2)])
  .add(rich.paragraph('All services are operating normally.'))
  .rtl(false)
  .skipEntityDetection()
  .build();

await ctx.replyWithRichMessage(message);
```

The builder also provides `.media(items)`, `.buildDraft()`, `.rtl(value)`, and `.skipEntityDetection(value)`. Use `.media` with HTML/Markdown that references media IDs through `tg://...`; in block mode, add media directly as a block.

## Rich-text entities

Rich text can be a string, an array of strings and entities, or nested entities. Text helpers return entity objects that can be composed in `rich.paragraph(...)` or other block helpers.

| Helper | Purpose |
| --- | --- |
| `rich.bold(text)` | Bold. |
| `rich.italic(text)` | Italic. |
| `rich.underline(text)` | Underline. |
| `rich.strikethrough(text)` | Strikethrough. |
| `rich.spoiler(text)` | Spoiler text. |
| `rich.marked(text)` | Marked text. |
| `rich.code(text)` | Inline code. |
| `rich.subscript(text)`, `rich.superscript(text)` | Subscript and superscript. |
| `rich.url(text, url)` | Link with display text. |
| `rich.email(text, email)`, `rich.phone(text, phone)`, `rich.bankCard(text, number)` | Email, phone-number, and bank-card entities. |
| `rich.mention(text, username)` | Mention by username. |
| `rich.textMention(text, user)` | Mention using a Telegram User object. |
| `rich.hashtag(text, value)`, `rich.cashtag(text, value)`, `rich.botCommand(text, value)` | Hashtag, cashtag, and bot command. |
| `rich.dateTime(text, unixTime, format)` | Date/time entity with a Unix timestamp. |
| `rich.customEmoji(customEmojiId, alternativeText)` | Telegram custom emoji entity. The ID must be valid and available to the bot. |
| `rich.mathText(expression)` | Mathematical expression in text. |
| `rich.anchorText(name)`, `rich.anchorLink(text, name)` | Anchor and anchor link. |
| `rich.reference(text, name)`, `rich.referenceLink(text, name)` | Cross-reference within the content. |
| `rich.buttonText(text, action, style)` | Inline-button entity in rich text, distinct from a `buttons` block. |

Custom emoji require a real Telegram custom emoji ID. Alternative text is an accessibility/fallback label; a regular emoji character does not become a Telegram custom emoji automatically. Telegram may reject an ID unavailable to the bot or chat.

## Block catalog

| Group | Helpers | Notes |
| --- | --- | --- |
| Text | `paragraph(text)`, `heading(text, size)`, `pre(text, language)`, `footer(text)`, `divider()` | Heading sizes range from 1 to 6; `pre` can specify a language. |
| Math and anchors | `mathBlock(expression)`, `anchor(name)` | Math block and anchor target. |
| Lists and quotes | `list(items)`, `quote(blocks, credit)`, `expandableQuote(text, credit)`, `pullQuote(text, credit)` | List items can be strings or structured items; quotes may contain nested blocks. |
| Tables and disclosure | `table(cells, options)`, `details(summary, blocks, open)` | Tables support `bordered`, `striped`, `compact`, and `caption`; details can be open by default. |
| Map | `map(location, zoom, width, height, caption, credit)` | `location` has the shape `{ latitude, longitude }`. |
| Media | `animation(media, caption)`, `audio(media, caption)`, `document(media, caption)`, `photo(media, caption)`, `video(media, caption)`, `voiceNote(media, caption)` | Accept `InputMedia*` objects and support multipart uploads. |
| Galleries | `collage(blocks, caption, credit)`, `slideshow(blocks, caption, credit)` | Combine supported media blocks into a gallery or sequence. |
| Buttons | `buttons(buttons, align)`, `button(text, action, style)` | A button block holds 1–8 buttons; `align` can be `left`, `center`, or `right`. |
| Draft | `thinking(text)` | Preview-only block for `sendRichMessageDraft`, not a final message. |

### Table cells

A table cell is an object `{ text, align, valign }`. `align` can be `left`, `center`, or `right`; `valign` can be `top`, `middle`, or `bottom`. Set `is_header: true` for a header cell. The bundled schema currently allows up to 20 columns.

### Button actions

Each button must choose exactly one action, such as `url`, `callback_data`, `web_app`, `login_url`, `switch_inline_query`, `switch_inline_query_current_chat`, `switch_inline_query_chosen_chat`, `copy_text`, or `disabled`. `rich.button(...)` builds a button for a `buttons` block; `rich.buttonText(...)` creates a rich-text entity. Callback-button styles include `danger`, `success`, `primary`, and `link`; visual support depends on the Telegram app version.

## Media and multipart uploads

Previously uploaded Telegram media can be referenced by `file_id`. For a new upload, wrap bytes, a path, or a stream in `File` or `InputFile`, then use the matching media builder. TeleBibz collects attachments and sends them in multipart requests using `attach://`, including files nested in the payload.

```js
const fs = require('node:fs');
const { File, InputMediaBuilder, rich } = require('@xbibzlibrary/telebibz');

const photo = new File(fs.readFileSync('./hero.png'), 'hero.png');
const clip = new File(fs.readFileSync('./clip.mp4'), 'clip.mp4');
await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph('Media in a message:'),
  rich.photo(InputMediaBuilder.photo(photo)),
  rich.video(InputMediaBuilder.video(clip)),
]));
```

For HTML/Markdown, reference media with a unique ID and a matching `media` entry:

```js
const image = new File(fs.readFileSync('./hero.png'), 'hero.png');
await ctx.replyWithRichMessage(rich.html(
  '<b>Cover image</b><br><a href="tg://photo?id=hero">View photo</a>',
  { media: [{ id: 'hero', media: InputMediaBuilder.photo(image) }] },
));
```

Use a media builder that matches the file. A filename and MIME type help the library construct the multipart payload. Telegram remains the final authority on file formats, sizes, permissions, and method eligibility.

::: tip Media note
In direct tests of the Rich animation endpoint, MP4 was accepted while GIF returned `RICH_MESSAGE_VIDEO_INVALID`; the standalone `sendAnimation` endpoint accepted the same GIF. If a Rich animation block is rejected, try MP4. Live photos use a separate method and are not a regular block type.
:::

## Draft previews

A draft is not a permanent chat message. Use it for a temporary preview or streaming update, then send a final message to persist the content. `rich.draftHtml`, `rich.draftMarkdown`, `rich.draftBlocks`, and `RichMessageBuilder.buildDraft()` create values for `sendRichMessageDraft`.

```js
bot.cmd('preview', async (ctx) => {
  const draftId = Date.now();
  await ctx.sendMessageDraft(draftId, 'Preparing the report', { can_stop: true });
  await ctx.sendRichMessageDraft(draftId + 1, rich.draftBlocks([
    rich.paragraph(['Preparing your ', rich.bold('report')]),
    rich.thinking('Collecting data'),
  ]), { can_stop: true, keep_on_stop: true });

  return ctx.replyWithRichMessage(rich.markdown('**Report ready**'));
});
```

Use a non-zero draft ID that follows Telegram's rules. Do not use a draft builder to upload a new `File`; reference media that already has a `file_id` if the schema supports it.

## Live photos, paid media, and ephemeral messages

### Live photos

`ctx.replyWithLivePhoto(video, photo, extra?)` sends a related video and static photo. Either can use a file ID or `File`/`InputFile`; this method currently does not accept a direct URL.

```js
await ctx.replyWithLivePhoto('VIDEO_FILE_ID', 'PHOTO_FILE_ID', { caption: 'A moment' });
```

`InputMediaBuilder.livePhoto(video, photo)` and `InputPaidMediaBuilder.livePhoto(video, photo)` create the corresponding media objects.

### Paid media

`sendPaidMedia` uses Telegram Stars, and `star_count` must follow Telegram's supported range. This is a real payment feature: do not send test transactions to users without consent, and review product and Stars requirements before release.

```js
const { File, InputPaidMediaBuilder } = require('@xbibzlibrary/telebibz');
const paidImage = new File(require('node:fs').readFileSync('./paid.png'), 'paid.png');
await ctx.api.callApi('sendPaidMedia', {
  chat_id: ctx.chatId,
  star_count: 1,
  media: [InputPaidMediaBuilder.photo(paidImage)],
  caption: 'Paid-media example',
});
```

### Ephemeral messages

Ephemeral messages are sent to a specified recipient. Telegram determines bot eligibility, chat context, recipient, and permissions. Context shortcuts include `replyEphemeral`, `editEphemeralMessageText`, `editEphemeralRichMessage`, `editEphemeralMessageMedia`, `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup`, and `deleteEphemeralMessage`.

```js
await ctx.replyEphemeral('A temporary notice', ctx.from.id);
```

Telegram can reject this method with a permission error such as `BOT_NOT_ADMIN`. Handle API failures; a well-formed payload does not guarantee that the bot has the required permission in every chat.

## Edit a sent Rich Message

Use `ctx.editRichMessage(content, extra?)` when the current update has an editable message context, or call the API directly when you already have the target identifiers. The target is selected by `chat_id`/`message_id` or `inline_message_id`, depending on the context. Test with a message the bot is allowed to edit, not an incoming user message.

## Context shortcuts for Bot API 10.3

| Helper | Purpose |
| --- | --- |
| `ctx.replyWithRichMessage(content, extra?)` | Send a stored Rich Message to the current chat. |
| `ctx.editRichMessage(content, extra?)` | Edit an editable Rich Message in the current context. |
| `ctx.replyWithLivePhoto(video, photo, extra?)` | Send a live photo. |
| `ctx.sendMessageDraft(draftId, text, extra?)` | Send a temporary text preview. |
| `ctx.sendRichMessageDraft(draftId, richMessage, extra?)` | Send a temporary Rich Message preview. |
| `ctx.replyEphemeral(text, receiverUserId, extra?)` | Send an ephemeral message to a specified recipient. |
| `ctx.guestQueryId`, `ctx.answerGuestQuery(result)` | Read and answer a real guest-query update. |

Guest queries require a `guest_query_id` from an actual Telegram update. For an actual inline query, create an inline Rich Article with `iq.richArticle(id, title, richMessage, extra)`.

## Bot API access and types

The TeleBibz registry recognizes **185 method names** in this release and provides payload types for `api.callApi()` and `api.raw()` in TypeScript. The runtime proxy can also access a newly added method by name, but dynamic JavaScript proxy calls do not validate the payload automatically.

```js
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.markdown('**Report ready**'),
});
```

Exported types include `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, `TelegramApiPayloads`, and the `TelegramTypes` namespace. See [TypeScript](/en/reference/typescript) and the [185-method list](/en/reference/methods). Types do not guarantee that every method can succeed in a live request; some require a real update, admin rights, a purchase, or a particular chat context.

## Payload limits, errors, and validation

The bundled Bot API 10.3 schema records these Rich Message limits: **32,768 UTF-8 characters**, **500 blocks** including nested blocks, **16 nesting levels**, **50 media attachments**, and **20 table columns**. Map blocks allow zoom 0–24 and width/height 0–10,000; button blocks contain 1–8 buttons. Telegram can change these limits, so check the official documentation before building large payloads.

- `RICH_MESSAGE_VIDEO_INVALID`: try MP4 for a Rich animation block.
- `BOT_NOT_ADMIN`: check bot permissions and method eligibility; this does not always indicate invalid JSON.
- `chat not found`: a private recipient may need to open the bot and press **Start** first.
- Upload error: check the path or stream, MIME type, file size, and `File`/`InputFile` usage.

For API verification results and live-test caveats, see the [repository verification report](https://github.com/XbibzOfficial777/telebibz/blob/main/VERIFIKASI-MENDALAM.md). Not all 185 methods were tested live; payments, admin rights, user events, and interactive actions require a real setup.
