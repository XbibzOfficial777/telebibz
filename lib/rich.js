// lib/rich.js — builders for Telegram Bot API 10.3 Rich Messages.
'use strict';

const { File } = require('./file');
const CONTENT_FIELDS = ['html', 'markdown', 'blocks'];
const INPUT_BLOCK_TYPES = new Set([
  'paragraph', 'heading', 'pre', 'footer', 'divider', 'mathematical_expression', 'anchor',
  'list', 'blockquote', 'expandable_blockquote', 'pullquote', 'collage', 'slideshow',
  'table', 'details', 'map', 'animation', 'audio', 'document', 'photo', 'video',
  'voice_note', 'buttons', 'thinking',
]);

function inputRichMessage(content, options = {}) {
  const fields = CONTENT_FIELDS.filter((key) => Object.hasOwn(content, key));
  if (fields.length !== 1) throw new TypeError('InputRichMessage harus memiliki tepat satu dari html, markdown, atau blocks');
  if (fields[0] === 'blocks' && !Array.isArray(content.blocks)) throw new TypeError('InputRichMessage.blocks harus berupa array');
  for (const key of CONTENT_FIELDS) {
    if (Object.hasOwn(options, key)) throw new TypeError(`Gunakan rich.${key}() untuk menetapkan konten, jangan lewat options`);
  }
  return { ...content, ...options };
}

function assertDraftHasNoFileUpload(value) {
  if (value instanceof File) throw new TypeError('Rich message draft tidak mendukung upload File baru; gunakan file_id Telegram bila perlu');
  if (!value || typeof value !== 'object') return;
  for (const child of Array.isArray(value) ? value : Object.values(value)) assertDraftHasNoFileUpload(child);
}

function draftRichMessage(content, options = {}) {
  const result = inputRichMessage(content, options);
  assertDraftHasNoFileUpload(result);
  return result;
}

function block(type, props = {}) {
  if (!INPUT_BLOCK_TYPES.has(type)) throw new TypeError(`Jenis InputRichBlock tidak dikenal: ${type}`);
  const { type: _ignored, ...rest } = props;
  return { ...rest, type };
}

const textEntity = (type, text, extra = {}) => ({ type, text, ...extra });
const caption = (text, credit) => ({ text, ...(credit !== undefined ? { credit } : {}) });
function richMessageButton(text, action, style) {
  if (!action || typeof action !== 'object') throw new TypeError('rich.button() membutuhkan satu jenis aksi button');
  const keys = ['url', 'callback_data', 'web_app', 'login_url', 'switch_inline_query', 'switch_inline_query_current_chat', 'switch_inline_query_chosen_chat', 'copy_text', 'disabled'];
  const defined = keys.filter((key) => Object.hasOwn(action, key));
  if (defined.length !== 1) throw new TypeError('RichMessageButton harus memiliki tepat satu field aksi');
  if (style !== undefined && !['danger', 'success', 'primary', 'link'].includes(style)) {
    throw new TypeError('Style rich button harus danger, success, primary, atau link');
  }
  if (style === 'link' && defined[0] !== 'callback_data') {
    throw new TypeError('Style link hanya didukung pada rich callback button');
  }
  return { text, ...action, ...(style ? { style } : {}) };
}

const rich = {
  html: (html, options = {}) => inputRichMessage({ html: String(html) }, options),
  markdown: (markdown, options = {}) => inputRichMessage({ markdown: String(markdown) }, options),
  blocks: (blocks, options = {}) => inputRichMessage({ blocks: [...blocks] }, options),
  draftHtml: (html, options = {}) => draftRichMessage({ html: String(html) }, options),
  draftMarkdown: (markdown, options = {}) => draftRichMessage({ markdown: String(markdown) }, options),
  draftBlocks: (blocks, options = {}) => draftRichMessage({ blocks: [...blocks] }, options),
  block,

  // RichText inline entities.
  bold: (text) => textEntity('bold', text),
  italic: (text) => textEntity('italic', text),
  underline: (text) => textEntity('underline', text),
  strikethrough: (text) => textEntity('strikethrough', text),
  spoiler: (text) => textEntity('spoiler', text),
  subscript: (text) => textEntity('subscript', text),
  superscript: (text) => textEntity('superscript', text),
  marked: (text) => textEntity('marked', text),
  code: (text) => textEntity('code', text),
  dateTime: (text, unixTime, format = 'r') => ({ type: 'date_time', text, unix_time: unixTime, date_time_format: format }),
  textMention: (text, user) => ({ type: 'text_mention', text, user }),
  customEmoji: (customEmojiId, alternativeText) => ({ type: 'custom_emoji', custom_emoji_id: String(customEmojiId), alternative_text: alternativeText }),
  mathText: (expression) => ({ type: 'mathematical_expression', expression }),
  url: (text, url) => textEntity('url', text, { url }),
  email: (text, emailAddress) => textEntity('email_address', text, { email_address: emailAddress }),
  phone: (text, phoneNumber) => textEntity('phone_number', text, { phone_number: phoneNumber }),
  bankCard: (text, bankCardNumber) => textEntity('bank_card_number', text, { bank_card_number: bankCardNumber }),
  mention: (text, username) => textEntity('mention', text, { username }),
  hashtag: (text, hashtag) => textEntity('hashtag', text, { hashtag }),
  cashtag: (text, cashtag) => textEntity('cashtag', text, { cashtag }),
  botCommand: (text, botCommand) => textEntity('bot_command', text, { bot_command: botCommand }),
  anchorText: (name) => ({ type: 'anchor', name }),
  anchorLink: (text, anchorName) => textEntity('anchor_link', text, { anchor_name: anchorName }),
  reference: (text, name) => textEntity('reference', text, { name }),
  referenceLink: (text, referenceName) => textEntity('reference_link', text, { reference_name: referenceName }),
  button: (text, action, style) => richMessageButton(text, action, style),
  buttonText: (text, action, style) => ({ type: 'button', button: richMessageButton(text, action, style) }),

  // InputRichBlock builders.
  paragraph: (text) => block('paragraph', { text }),
  heading: (text, size = 2) => {
    if (!Number.isInteger(size) || size < 1 || size > 6) throw new RangeError('rich.heading(): size harus 1–6');
    return block('heading', { text, size });
  },
  pre: (text, language) => block('pre', { text, ...(language ? { language } : {}) }),
  footer: (text) => block('footer', { text }),
  divider: () => block('divider'),
  mathBlock: (expression) => block('mathematical_expression', { expression }),
  anchor: (name) => block('anchor', { name }),
  list: (items) => block('list', { items: items.map((item) => {
    if (Array.isArray(item)) return { blocks: item };
    if (typeof item === 'string' || typeof item === 'number') return { blocks: [block('paragraph', { text: String(item) })] };
    return item;
  }) }),
  quote: (blocks, credit) => block('blockquote', { blocks, ...(credit !== undefined ? { credit } : {}) }),
  expandableQuote: (text, credit) => block('expandable_blockquote', { text, ...(credit !== undefined ? { credit } : {}) }),
  pullQuote: (text, credit) => block('pullquote', { text, ...(credit !== undefined ? { credit } : {}) }),
  collage: (blocks, captionText, credit) => block('collage', { blocks, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  slideshow: (blocks, captionText, credit) => block('slideshow', { blocks, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  table: (cells, options = {}) => block('table', {
    cells,
    ...(options.bordered ? { is_bordered: true } : {}),
    ...(options.striped ? { is_striped: true } : {}),
    ...(options.compact ? { is_compact: true } : {}),
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
  }),
  details: (summary, blocks, open = false) => block('details', { summary, blocks, ...(open ? { is_open: true } : {}) }),
  map: (location, zoom, width, height, captionText, credit) => block('map', {
    location, zoom, width, height,
    ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}),
  }),
  animation: (animation, captionText, credit) => block('animation', { animation, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  audio: (audio, captionText, credit) => block('audio', { audio, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  document: (document, captionText, credit) => block('document', { document, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  photo: (photo, captionText, credit) => block('photo', { photo, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  video: (video, captionText, credit) => block('video', { video, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  voiceNote: (voiceNote, captionText, credit) => block('voice_note', { voice_note: voiceNote, ...(captionText !== undefined ? { caption: caption(captionText, credit) } : {}) }),
  buttons: (buttons, align) => {
    if (!Array.isArray(buttons) || buttons.length < 1 || buttons.length > 8) {
      throw new RangeError('rich.buttons(): harus berisi 1–8 button');
    }
    if (align !== undefined && !['left', 'center', 'right'].includes(align)) {
      throw new TypeError('rich.buttons(): align harus left, center, atau right');
    }
    return block('buttons', { buttons, ...(align ? { align } : {}) });
  },
  thinking: (text = '') => block('thinking', { text }),
};

class RichMessageBuilder {
  constructor() { this._content = null; this._options = {}; }
  _set(field, value) {
    if (this._content) throw new Error('RichMessageBuilder: tentukan satu mode saja (html, markdown, atau blocks)');
    this._content = { [field]: value };
    return this;
  }
  html(value) { return this._set('html', String(value)); }
  markdown(value) { return this._set('markdown', String(value)); }
  blocks(value = []) { return this._set('blocks', [...value]); }
  add(...items) {
    if (!this._content) this._content = { blocks: [] };
    if (!Array.isArray(this._content.blocks)) throw new Error('RichMessageBuilder.add() hanya bisa dipakai pada mode blocks');
    this._content.blocks.push(...items);
    return this;
  }
  media(items) { this._options.media = [...items]; return this; }
  rtl(value = true) { this._options.is_rtl = Boolean(value); return this; }
  skipEntityDetection(value = true) { this._options.skip_entity_detection = Boolean(value); return this; }
  build() {
    if (!this._content) throw new Error('RichMessageBuilder: konten belum diisi');
    return inputRichMessage(this._content, this._options);
  }
  buildDraft() {
    if (!this._content) throw new Error('RichMessageBuilder: konten belum diisi');
    return draftRichMessage(this._content, this._options);
  }
}

module.exports = { rich, RichMessageBuilder, inputRichMessage };
