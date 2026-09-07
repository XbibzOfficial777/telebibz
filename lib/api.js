// lib/api.js — wrapper metode Bot API. Semua metode lain via api.callApi().
'use strict';

const { callTelegram } = require('./net');

class Api {
  /**
   * transport bisa disuntik (testing): (method, payload) => Promise<result>
   */
  constructor(token, transport) {
    this.token = token;
    this._t = transport || ((m, p) => callTelegram(token, m, p));
    // kompat gaya grammY: api.callApi / api.raw sama-sama memanggil nama metode mentah
    this.raw = this.callApi.bind(this);
  }

  /** Panggil metode Bot API APA PUN: api.callApi('setMyCommands', { commands }) */
  async callApi(method, payload = {}) { return this._t(method, payload); }

  /* ---- shortcut yang dipakai Context ---- */
  getMe() { return this.callApi('getMe'); }
  sendMessage(chat_id, text, extra = {}) { return this.callApi('sendMessage', { chat_id, text, ...extra }); }
  editMessageText(chat_id, message_id, text, extra = {}) { return this.callApi('editMessageText', { chat_id, message_id, text, ...extra }); }
  editMessageReplyMarkup(chat_id, message_id, extra = {}) { return this.callApi('editMessageReplyMarkup', { chat_id, message_id, ...extra }); }
  deleteMessage(chat_id, message_id) { return this.callApi('deleteMessage', { chat_id, message_id }); }
  answerCallbackQuery(id, extra = {}) { return this.callApi('answerCallbackQuery', { callback_query_id: id, ...extra }); }
  sendChatAction(chat_id, action) { return this.callApi('sendChatAction', { chat_id, action }); }
  getChat(chat_id) { return this.callApi('getChat', { chat_id }); }
  leaveChat(chat_id) { return this.callApi('leaveChat', { chat_id }); }

  _media(method, fileField, chatId, src, extra) {
    return this.callApi(method, { chat_id: chatId, [fileField]: src, ...extra });
  }
  sendPhoto(chat_id, photo, extra = {}) { return this._media('sendPhoto', 'photo', chat_id, photo, extra); }
  sendVideo(chat_id, video, extra = {}) { return this._media('sendVideo', 'video', chat_id, video, extra); }
  sendAudio(chat_id, audio, extra = {}) { return this._media('sendAudio', 'audio', chat_id, audio, extra); }
  sendDocument(chat_id, document, extra = {}) { return this._media('sendDocument', 'document', chat_id, document, extra); }
  sendAnimation(chat_id, animation, extra = {}) { return this._media('sendAnimation', 'animation', chat_id, animation, extra); }
  sendVoice(chat_id, voice, extra = {}) { return this._media('sendVoice', 'voice', chat_id, voice, extra); }
  sendSticker(chat_id, sticker, extra = {}) { return this._media('sendSticker', 'sticker', chat_id, sticker, extra); }
  sendLocation(chat_id, latitude, longitude, extra = {}) { return this.callApi('sendLocation', { chat_id, latitude, longitude, ...extra }); }

  /** Manajemen konten */
  banChatMember(chatId, userId, extra = {}) { return this.callApi('banChatMember', { chat_id: chatId, user_id: userId, ...extra }); }
  unbanChatMember(chatId, userId, extra = {}) { return this.callApi('unbanChatMember', { chat_id: chatId, user_id: userId, ...extra }); }
  restrictChatMember(chatId, userId, permissions, extra = {}) { return this.callApi('restrictChatMember', { chat_id: chatId, user_id: userId, permissions, ...extra }); }
  setChatPermissions(chatId, permissions, extra = {}) { return this.callApi('setChatPermissions', { chat_id: chatId, permissions, ...extra }); }
  pinChatMessage(chatId, messageId, extra = {}) { return this.callApi('pinChatMessage', { chat_id: chatId, message_id: messageId, ...extra }); }
  setMyCommands(commands, extra = {}) { return this.callApi('setMyCommands', { commands, ...extra }); }
}

module.exports = { Api };
