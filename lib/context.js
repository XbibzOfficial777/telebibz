// lib/context.js — objek konteks: SEMUA accessor update + ~60 pintasan aksi.
'use strict';

const { File } = require('./file');
const axios = require('axios');
const fs = require('fs');

/** Objek "pesan" dari berbagai field update (gaya ctx.msg). */
function msgOf(update) {
  return update.message || update.edited_message || update.channel_post ||
    update.edited_channel_post || update.business_message || update.edited_business_message || null;
}

const UPDATE_KEYS = [
  'message', 'edited_message', 'channel_post', 'edited_channel_post',
  'business_message', 'edited_business_message', 'callback_query', 'inline_query',
  'chosen_inline_result', 'chat_join_request', 'chat_member', 'my_chat_member',
  'message_reaction', 'message_reaction_count', 'business_connection',
  'poll', 'poll_answer', 'shipping_query', 'pre_checkout_query', 'purchased_paid_media',
];

class Context {
  constructor(update, api, me) {
    this.update = update;
    this.api = api;
    this.me = me;
    this.update_id = update.update_id;
    for (const k of UPDATE_KEYS) if (update[k] !== undefined) this[k] = update[k];
    this.msg = msgOf(update);
  }

  /* ---------- accessor dasar ---------- */
  get chat() {
    if (this.msg) return this.msg.chat;
    if (this.callback_query) return this.callback_query.message && this.callback_query.message.chat;
    if (this.inline_query || this.chosen_inline_result) return undefined;
    if (this.chat_join_request) return this.chat_join_request.chat;
    if (this.chat_member) return this.chat_member.chat;
    if (this.my_chat_member) return this.my_chat_member.chat;
    return undefined;
  }
  get from() {
    const u = this.msg || this.callback_query || this.inline_query || this.chosen_inline_result ||
      this.chat_join_request || this.chat_member || this.my_chat_member ||
      this.business_connection || this.poll_answer || this.shipping_query || this.pre_checkout_query;
    if (!u) return undefined;
    return u.from || u.user || (u.voter_user !== undefined ? u.voter_user : undefined);
  }
  get chatId() { const c = this.chat; return c ? c.id : undefined; }
  get msgId() { return this.msg ? this.msg.message_id : undefined; }
  get businessConnectionId() {
    return (this.business_connection && this.business_connection.id) ||
      (this.msg && this.msg.business_connection_id) || undefined;
  }
  get senderChat() { return this.msg ? this.msg.sender_chat : undefined; }
  get inlineMessageId() { return this.callback_query ? this.callback_query.inline_message_id : undefined; }

  _cid(cid) {
    if (cid !== undefined) return cid;
    const c = this.chatId;
    if (c === undefined) throw new Error('telebibz: ctx tanpa chat (update inline/business?)');
    return c;
  }
  _biz(extra = {}) {
    // Otomatis sertakan business_connection_id pada pesan business (gaya BizWrapper)
    const bc = this.businessConnectionId;
    return bc && this.msg && this.msg.business_connection_id ? { business_connection_id: bc, ...extra } : extra;
  }

  /* ---------- kirim balasan ---------- */
  reply(text, extra = {}) { return this.api.sendMessage(this._cid(), text, this._biz(extra)); }
  replyWithHTML(text, extra = {}) { return this.reply(text, { parse_mode: 'HTML', ...extra }); }
  replyWithMarkdown(text, extra = {}) { return this.reply(text, { parse_mode: 'MarkdownV2', ...extra }); }
  replyWithPhoto(p, e = {}) { return this.api.sendPhoto(this._cid(), p, this._biz(e)); }
  replyWithVideo(v, e = {}) { return this.api.sendVideo(this._cid(), v, this._biz(e)); }
  replyWithAudio(a, e = {}) { return this.api.sendAudio(this._cid(), a, this._biz(e)); }
  replyWithDocument(d, e = {}) { return this.api.sendDocument(this._cid(), d, this._biz(e)); }
  replyWithAnimation(a, e = {}) { return this.api.sendAnimation(this._cid(), a, this._biz(e)); }
  replyWithVoice(v, e = {}) { return this.api.sendVoice(this._cid(), v, { caption: e.caption, ...e }); }
  replyWithVideoNote(v, e = {}) { return this.api.sendVideoNote(this._cid(), v, e); }
  replyWithSticker(s, e = {}) { return this.api.sendSticker(this._cid(), s, e); }
  replyWithMediaGroup(media, e = {}) { return this.api.sendMediaGroup(this._cid(), media, e); }
  replyWithLocation(lat, lon, e = {}) { return this.api.sendLocation(this._cid(), lat, lon, e); }
  replyWithVenue(lat, lon, title, address, e = {}) { return this.api.sendVenue(this._cid(), lat, lon, title, address, e); }
  replyWithContact(phone, first, e = {}) { return this.api.sendContact(this._cid(), phone, first, e); }
  replyWithPoll(question, options, e = {}) { return this.api.sendPoll(this._cid(), question, options, e); }
  replyWithDice(emoji, e = {}) { return this.api.sendDice(this._cid(), emoji, e); }
  replyWithInvoice(title, description, payload, currency, prices, e = {}) {
    return this.api.sendInvoice(this._cid(), title, description, payload, currency, prices, e);
  }
  replyWithChatAction(action = 'typing', e = {}) { return this.api.sendChatAction(this._cid(), action, e); }

  /* ---------- teruskan & salin ---------- */
  forwardMessage(to, from, messageId, e = {}) {
    if (messageId === undefined) return this.api.forwardMessage(to, this._cid(from), this.msgId, e || {});
    return this.api.forwardMessage(to, from, messageId, e);
  }
  copyMessage(to, from, messageId, e = {}) {
    if (messageId === undefined) return this.api.copyMessage(to, this._cid(from), this.msgId, e || {});
    return this.api.copyMessage(to, from, messageId, e);
  }

  /* ---------- edit & hapus ---------- */
  editMessageText(text, e = {}) {
    if (this.inlineMessageId) return this.api.callApi('editMessageText', { inline_message_id: this.inlineMessageId, text, ...e });
    const m = this.callback_query && this.callback_query.message;
    return this.api.editMessageText(this._cid(m ? m.chat.id : undefined), m ? m.message_id : this.msgId, text, e);
  }
  editMessageCaption(e = {}) {
    const m = this.callback_query && this.callback_query.message;
    if (this.inlineMessageId) return this.api.callApi('editMessageCaption', { inline_message_id: this.inlineMessageId, ...e });
    return this.api.editMessageCaption(this._cid(m ? m.chat.id : undefined), m ? m.message_id : this.msgId, e);
  }
  editMessageMedia(media, e = {}) {
    const m = this.callback_query && this.callback_query.message;
    if (this.inlineMessageId) return this.api.callApi('editMessageMedia', { inline_message_id: this.inlineMessageId, media, ...e });
    return this.api.editMessageMedia(this._cid(m ? m.chat.id : undefined), m ? m.message_id : this.msgId, media, e);
  }
  editMessageReplyMarkup(e = {}) {
    const m = this.callback_query && this.callback_query.message;
    if (this.inlineMessageId) return this.api.callApi('editMessageReplyMarkup', { inline_message_id: this.inlineMessageId, ...e });
    return this.api.editMessageReplyMarkup(this._cid(m ? m.chat.id : undefined), m ? m.message_id : this.msgId, e);
  }
  deleteMessage(chatId, messageId) {
    if (messageId !== undefined) return this.api.deleteMessage(chatId, messageId);
    const m = this.callback_query && this.callback_query.message;
    return this.api.deleteMessage(m ? m.chat.id : this._cid(chatId), m ? m.message_id : this.msgId);
  }
  deleteMessages(ids) { return this.api.deleteMessages(this._cid(), ids); }
  react(emoji = '👍', e = {}) {
    const reaction = [{ type: 'emoji', emoji }];
    return this.api.setMessageReaction(this._cid(), this.msgId, reaction, e);
  }

  /* ---------- callback & inline ---------- */
  answerCallbackQuery(e = {}) {
    if (typeof e === 'string') e = { text: e };
    if (!this.callback_query) return Promise.resolve(false);
    return this.api.answerCallbackQuery(this.callback_query.id, e);
  }
  answerInlineQuery(results, e = {}) {
    if (!this.inline_query) return Promise.resolve(false);
    return this.api.answerInlineQuery(this.inline_query.id, results, e);
  }

  /* ---------- admin & grup ---------- */
  banChatMember(cid, uid, e = {}) { return this.api.banChatMember(cid, uid, e); }
  unbanChatMember(cid, uid, e = {}) { return this.api.unbanChatMember(cid, uid, e); }
  restrictChatMember(cid, uid, permissions, e = {}) { return this.api.restrictChatMember(cid, uid, permissions, e); }
  kickChatMember(cid, uid, e = {}) { return this.api.banChatMember(cid, uid, e); } // alias
  banAuthor(e = {}) { return this.api.banChatMember(this._cid(), this.from.id, e); }
  kickAuthor(e = {}) { return this.api.banChatMember(this._cid(), this.from.id, e); }
  restrictAuthor(permissions, e = {}) { return this.api.restrictChatMember(this._cid(), this.from.id, permissions, e); }
  getChat(cid) { return this.api.getChat(this._cid(cid)); }
  getChatAdministrators(cid) { return this.api.getChatAdministrators(this._cid(cid)); }
  getChatMemberCount(cid) { return this.api.getChatMemberCount(this._cid(cid)); }
  getChatMember(uid, cid) { return this.api.getChatMember(this._cid(cid), uid); }
  getAuthor(cid) { return this.api.getChatMember(this._cid(cid), this.from.id); }
  leaveChat(cid) { return this.api.leaveChat(this._cid(cid)); }
  setChatTitle(title, cid) { return this.api.setChatTitle(this._cid(cid), title); }
  setChatDescription(d, cid) { return this.api.setChatDescription(this._cid(cid), d); }
  pinChatMessage(cid, mid, e = {}) { return this.api.pinChatMessage(this._cid(cid || undefined), mid !== undefined ? mid : this.msgId, e); }
  unpinChatMessage(e = {}) { return this.api.unpinChatMessage(this._cid(), e); }

  /* ---------- download ---------- */
  /** getFile() pesan terkait (photo terbesar / document / voice / video) lalu unduh. */
  async getFile() {
    const m = this.msg || {};
    const f = m.document || m.audio || m.video || m.voice || m.video_note || m.sticker ||
      (Array.isArray(m.photo) && m.photo.length ? m.photo[m.photo.length - 1] : null) ||
      m.animation;
    if (!f) throw new Error('telebibz: ctx.msg tanpa file');
    return this.api.getFile(f.file_id);
  }
  async downloadFile(dest) {
    const f = await this.getFile();
    const url = `https://api.telegram.org/file/bot${this.api.token}/${f.file_path}`;
    const res = await axios.get(url, { responseType: 'stream' });
    const out = fs.createWriteStream(dest);
    await new Promise((ok, no) => { res.data.pipe(out); out.on('finish', ok); out.on('error', no); });
    return dest;
  }

  /* ---------- re-export util ---------- */
  static File() { return File; }
}

module.exports = { Context, msgOf };
