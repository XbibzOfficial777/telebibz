// lib/context.js — objek konteks per-update: data + pintasan kirim-balik.
'use strict';

/** Objek "pesan" dari update apa pun (mirip grammY ctx.msg). */
function msgOf(update) {
  return update.message || update.edited_message || update.channel_post ||
    update.edited_channel_post || update.business_message || update.edited_business_message || null;
}

class Context {
  constructor(update, api, me) {
    this.update = update;
    this.api = api;
    this.me = me;
    this.update_id = update.update_id;

    // Referensi langsung (tak disalin — identik dengan isi update asli)
    for (const k of ['message', 'edited_message', 'channel_post', 'edited_channel_post',
      'business_message', 'edited_business_message', 'callback_query', 'inline_query',
      'chat_join_request', 'chat_member', 'my_chat_member', 'message_reaction',
      'message_reaction_count', 'business_connection', 'poll', 'poll_answer'])
      if (update[k] !== undefined) this[k] = update[k];

    this.msg = msgOf(update);
  }

  get chat() {
    if (this.msg) return this.msg.chat;
    if (this.callback_query && this.callback_query.message) return this.callback_query.message.chat;
    if (this.business_connection) return this.business_connection.user;
    if (this.chat_join_request) return this.chat_join_request.chat;
    if (this.my_chat_member) return this.my_chat_member.chat;
    return undefined;
  }
  get from() {
    const u = this.msg || this.callback_query || this.inline_query || this.chat_join_request ||
      this.chat_member || this.my_chat_member || this.business_connection || this.poll_answer;
    return u && (u.from || u.user) ? (u.from || u.user) : undefined;
  }
  get chatId() { const c = this.chat; return c ? c.id : undefined; }
  get msgId() { return this.msg ? this.msg.message_id : undefined; }

  _cid(cid) { if (cid === undefined) { const c = this.chatId; if (c === undefined) throw new Error('telebibz: ctx tanpa chat (update non-pesan?)'); return c; } return cid; }

  /* ---- pintasan balasan ---- */
  reply(text, extra = {}) { return this.api.sendMessage(this._cid(), text, extra); }
  replyWithPhoto(src, extra = {}) { return this.api.sendPhoto(this._cid(), src, extra); }
  replyWithVideo(src, extra = {}) { return this.api.sendVideo(this._cid(), src, extra); }
  replyWithAudio(src, extra = {}) { return this.api.sendAudio(this._cid(), src, extra); }
  replyWithDocument(src, extra = {}) { return this.api.sendDocument(this._cid(), src, extra); }
  replyWithAnimation(src, extra = {}) { return this.api.sendAnimation(this._cid(), src, extra); }
  replyWithVoice(src, extra = {}) { return this.api.sendVoice(this._cid(), src, extra); }
  replyWithSticker(src, extra = {}) { return this.api.sendSticker(this._cid(), src, extra); }
  replyWithHTML(text, extra = {}) { return this.reply(text, { parse_mode: 'HTML', ...extra }); }
  replyWithMarkdown(text, extra = {}) { return this.reply(text, { parse_mode: 'MarkdownV2', ...extra }); }

  /* ---- edit & callback ---- */
  editMessageText(text, extra = {}) {
    if (this.callback_query && this.callback_query.inline_message_id)
      return this.api.callApi('editMessageText', { inline_message_id: this.callback_query.inline_message_id, text, ...extra });
    const m = this.callback_query && this.callback_query.message;
    return this.api.editMessageText(this._cid(m ? m.chat.id : undefined), m ? m.message_id : this.msgId, text, extra);
  }
  editMessageReplyMarkup(extra = {}) {
    const m = this.callback_query && this.callback_query.message;
    return this.api.editMessageReplyMarkup(m ? m.chat.id : this._cid(), m ? m.message_id : this.msgId, extra);
  }
  deleteMessage(chatId, messageId) {
    if (chatId !== undefined && messageId !== undefined) return this.api.deleteMessage(chatId, messageId);
    const m = this.callback_query && this.callback_query.message;
    return this.api.deleteMessage(m ? m.chat.id : this._cid(), m ? m.message_id : this.msgId);
  }
  answerCallbackQuery(extra = {}) {
    if (typeof extra === 'string') extra = { text: extra };
    if (!this.callback_query) return Promise.resolve(false);
    return this.api.answerCallbackQuery(this.callback_query.id, extra);
  }
  sendChatAction(action = 'typing') { return this.api.sendChatAction(this._cid(), action); }
}

module.exports = { Context, msgOf };
