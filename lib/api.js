// lib/api.js — akses penuh Bot API: ~60 shortcut + PROXY untuk SEGALA metode +
// transformer pipeline (api.config.use) gaya grammY + download file.
'use strict';

const { createTransport } = require('./net');

class ApiConfig {
  constructor() { this.transformers = []; }
  /** Sisipkan transformer: (prev, method, payload) => result */
  use(t) { this.transformers.push(t); return this; }
}

class ApiBase {
  constructor(token, transport, transportOpts = {}) {
    this.token = token;
    this.transportOpts = transportOpts;
    this.apiRoot = (transportOpts.apiRoot || 'https://api.telegram.org').replace(/\/$/, '');
    this.config = new ApiConfig();
    this._base = transport || createTransport(token, transportOpts);
    this.raw = (method, payload = {}) => this.callApi(method, payload);
  }

  async callApi(method, payload = {}) {
    let fn = this._base;
    for (const t of this.config.transformers) {
      const prev = fn;
      fn = (m, p) => t(prev, m, p);
    }
    return fn(method, payload);
  }

  /* =============== metode umum =============== */
  getMe() { return this.callApi('getMe'); }
  logOut() { return this.callApi('logOut'); }
  close() { return this.callApi('close'); }

  /* ---- pesan ---- */
  sendMessage(chat_id, text, extra = {}) { return this.callApi('sendMessage', { chat_id, text, ...extra }); }

  // Bot API 10.x rich content, streaming drafts, guest queries and ephemeral messages.
  sendRichMessage(payload) { return this.callApi('sendRichMessage', payload); }
  sendLivePhoto(payload) { return this.callApi('sendLivePhoto', payload); }
  sendMessageDraft(payload) { return this.callApi('sendMessageDraft', payload); }
  sendRichMessageDraft(payload) { return this.callApi('sendRichMessageDraft', payload); }
  answerGuestQuery(payload) { return this.callApi('answerGuestQuery', payload); }
  editEphemeralMessageText(payload) { return this.callApi('editEphemeralMessageText', payload); }
  editEphemeralMessageMedia(payload) { return this.callApi('editEphemeralMessageMedia', payload); }
  editEphemeralMessageCaption(payload) { return this.callApi('editEphemeralMessageCaption', payload); }
  editEphemeralMessageReplyMarkup(payload) { return this.callApi('editEphemeralMessageReplyMarkup', payload); }
  deleteEphemeralMessage(payload) { return this.callApi('deleteEphemeralMessage', payload); }
  forwardMessage(chat_id, from_chat_id, message_id, extra = {}) { return this.callApi('forwardMessage', { chat_id, from_chat_id, message_id, ...extra }); }
  forwardMessages(chat_id, from_chat_id, message_ids, extra = {}) { return this.callApi('forwardMessages', { chat_id, from_chat_id, message_ids, ...extra }); }
  copyMessage(chat_id, from_chat_id, message_id, extra = {}) { return this.callApi('copyMessage', { chat_id, from_chat_id, message_id, ...extra }); }
  copyMessages(chat_id, from_chat_id, message_ids, extra = {}) { return this.callApi('copyMessages', { chat_id, from_chat_id, message_ids, ...extra }); }
  editMessageText(chat_id, message_id, text, extra = {}) { return this.callApi('editMessageText', { chat_id, message_id, text, ...extra }); }
  editMessageCaption(chat_id, message_id, extra = {}) { return this.callApi('editMessageCaption', { chat_id, message_id, ...extra }); }
  editMessageMedia(chat_id, message_id, media, extra = {}) { return this.callApi('editMessageMedia', { chat_id, message_id, media, ...extra }); }
  editMessageReplyMarkup(chat_id, message_id, extra = {}) { return this.callApi('editMessageReplyMarkup', { chat_id, message_id, ...extra }); }
  deleteMessage(chat_id, message_id) { return this.callApi('deleteMessage', { chat_id, message_id }); }
  deleteMessages(chat_id, message_ids) { return this.callApi('deleteMessages', { chat_id, message_ids }); }
  setMessageReaction(chat_id, message_id, reaction, extra = {}) { return this.callApi('setMessageReaction', { chat_id, message_id, reaction, ...extra }); }
  sendChatAction(chat_id, action, extra = {}) { return this.callApi('sendChatAction', { chat_id, action, ...extra }); }

  /* ---- media ---- */
  sendPhoto(c, photo, e = {}) { return this.callApi('sendPhoto', { chat_id: c, photo, ...e }); }
  sendVideo(c, video, e = {}) { return this.callApi('sendVideo', { chat_id: c, video, ...e }); }
  sendAudio(c, audio, e = {}) { return this.callApi('sendAudio', { chat_id: c, audio, ...e }); }
  sendDocument(c, document, e = {}) { return this.callApi('sendDocument', { chat_id: c, document, ...e }); }
  sendAnimation(c, animation, e = {}) { return this.callApi('sendAnimation', { chat_id: c, animation, ...e }); }
  sendVoice(c, voice, e = {}) { return this.callApi('sendVoice', { chat_id: c, voice, ...e }); }
  sendVideoNote(c, vn, e = {}) { return this.callApi('sendVideoNote', { chat_id: c, video_note: vn, ...e }); }
  sendSticker(c, sticker, e = {}) { return this.callApi('sendSticker', { chat_id: c, sticker, ...e }); }
  sendMediaGroup(c, media, e = {}) { return this.callApi('sendMediaGroup', { chat_id: c, media, ...e }); }
  sendLocation(c, lat, lon, e = {}) { return this.callApi('sendLocation', { chat_id: c, latitude: lat, longitude: lon, ...e }); }
  sendVenue(c, lat, lon, title, address, e = {}) { return this.callApi('sendVenue', { chat_id: c, latitude: lat, longitude: lon, title, address, ...e }); }
  sendContact(c, phone, first, e = {}) { return this.callApi('sendContact', { chat_id: c, phone_number: phone, first_name: first, ...e }); }
  sendPoll(c, question, options, e = {}) { return this.callApi('sendPoll', { chat_id: c, question, options, ...e }); }
  sendDice(c, emoji, e = {}) { return this.callApi('sendDice', { chat_id: c, ...(emoji ? { emoji } : {}), ...e }); }
  stopPoll(c, message_id, e = {}) { return this.callApi('stopPoll', { chat_id: c, message_id, ...e }); }

  /* ---- file ---- */
  getFile(file_id) { return this.callApi('getFile', { file_id }); }
  /** Unduh file_id ke disk; return path tujuan. */
  async downloadFile(file_id, dest, axiosOpts = {}) {
    const f = await this.getFile(file_id);
    const axios = require('axios');
    const fs = require('fs');
    const url = `${this.apiRoot}/file/bot${this.token}/${f.file_path}`;
    const res = await axios.get(url, { responseType: 'stream', ...axiosOpts });
    const out = fs.createWriteStream(dest);
    await new Promise((ok, no) => { res.data.pipe(out); out.on('finish', ok); out.on('error', no); res.data.on('error', no); });
    return dest;
  }

  /* ---- callback & inline ---- */
  answerCallbackQuery(id, e = {}) { return this.callApi('answerCallbackQuery', { callback_query_id: id, ...e }); }
  answerInlineQuery(id, results, e = {}) { return this.callApi('answerInlineQuery', { inline_query_id: id, results, ...e }); }

  /* ---- grup & admin ---- */
  banChatMember(c, u, e = {}) { return this.callApi('banChatMember', { chat_id: c, user_id: u, ...e }); }
  unbanChatMember(c, u, e = {}) { return this.callApi('unbanChatMember', { chat_id: c, user_id: u, ...e }); }
  restrictChatMember(c, u, permissions, e = {}) { return this.callApi('restrictChatMember', { chat_id: c, user_id: u, permissions, ...e }); }
  promoteChatMember(c, u, e = {}) { return this.callApi('promoteChatMember', { chat_id: c, user_id: u, ...e }); }
  setChatAdministratorCustomTitle(c, u, t) { return this.callApi('setChatAdministratorCustomTitle', { chat_id: c, user_id: u, custom_title: t }); }
  approveChatJoinRequest(c, u) { return this.callApi('approveChatJoinRequest', { chat_id: c, user_id: u }); }
  declineChatJoinRequest(c, u) { return this.callApi('declineChatJoinRequest', { chat_id: c, user_id: u }); }
  getChat(c) { return this.callApi('getChat', { chat_id: c }); }
  getChatAdministrators(c) { return this.callApi('getChatAdministrators', { chat_id: c }); }
  getChatMemberCount(c) { return this.callApi('getChatMemberCount', { chat_id: c }); }
  getChatMember(c, u) { return this.callApi('getChatMember', { chat_id: c, user_id: u }); }
  leaveChat(c) { return this.callApi('leaveChat', { chat_id: c }); }
  setChatTitle(c, title) { return this.callApi('setChatTitle', { chat_id: c, title }); }
  setChatDescription(c, description) { return this.callApi('setChatDescription', { chat_id: c, description }); }
  setChatPhoto(c, photo) { return this.callApi('setChatPhoto', { chat_id: c, photo }); }
  setChatPermissions(c, permissions, e = {}) { return this.callApi('setChatPermissions', { chat_id: c, permissions, ...e }); }
  pinChatMessage(c, m, e = {}) { return this.callApi('pinChatMessage', { chat_id: c, message_id: m, ...e }); }
  unpinChatMessage(c, e = {}) { return this.callApi('unpinChatMessage', { chat_id: c, ...e }); }
  unpinAllChatMessages(c) { return this.callApi('unpinAllChatMessages', { chat_id: c }); }
  exportChatInviteLink(c) { return this.callApi('exportChatInviteLink', { chat_id: c }); }

  /* ---- konfigurasi bot ---- */
  setMyCommands(commands, e = {}) { return this.callApi('setMyCommands', { commands, ...e }); }
  getMyCommands(e = {}) { return this.callApi('getMyCommands', e); }
  deleteMyCommands(e = {}) { return this.callApi('deleteMyCommands', e); }
  setMyName(e = {}) { return this.callApi('setMyName', e); }
  getMyName(e = {}) { return this.callApi('getMyName', e); }
  setMyDescription(e = {}) { return this.callApi('setMyDescription', e); }
  getMyDescription(e = {}) { return this.callApi('getMyDescription', e); }
  setMyShortDescription(e = {}) { return this.callApi('setMyShortDescription', e); }
  setChatMenuButton(e = {}) { return this.callApi('setChatMenuButton', e); }

  /* ---- webhook ---- */
  setWebhook(url, e = {}) { return this.callApi('setWebhook', { url, ...e }); }
  deleteWebhook(e = {}) { return this.callApi('deleteWebhook', e); }
  getWebhookInfo() { return this.callApi('getWebhookInfo'); }

  /* ---- forum topic ---- */
  createForumTopic(c, name, e = {}) { return this.callApi('createForumTopic', { chat_id: c, name, ...e }); }
  closeForumTopic(c, tid) { return this.callApi('closeForumTopic', { chat_id: c, message_thread_id: tid }); }

  /* ---- pembayaran & stars ---- */
  sendInvoice(c, title, description, payload, currency, prices, e = {}) { return this.callApi('sendInvoice', { chat_id: c, title, description, payload, currency, prices, ...e }); }
  refundStarPayment(user_id, telegram_payment_charge_id) { return this.callApi('refundStarPayment', { user_id, telegram_payment_charge_id }); }
  getStarTransactions(e = {}) { return this.callApi('getStarTransactions', e); }
}

/**
 * Api = ApiBase + Proxy: metode APA PUN di Bot API bisa dipanggil
 *   api.setWebhookCustom({ url })  →  callApi('setWebhookCustom', {...})
 * Implementasi: kalau nama ada di ApiBase, pakai definisi resminya; kalau
 * tidak, fallback jadi satu-argumen-payload.
 */
function makeApi(token, transport, transportOpts = {}) {
  const base = new ApiBase(token, transport, transportOpts);
  return new Proxy(base, {
    get(target, prop, recv) {
      const v = Reflect.get(target, prop, recv);
      if (v !== undefined) return typeof v === 'function' ? v.bind(target) : v;
      if (typeof prop === 'string' && !['then', 'catch', 'finally'].includes(prop) && /^[a-z][a-zA-Z0-9]*$/.test(prop)) {
        return (payload = {}) => target.callApi(prop, payload);
      }
      return undefined;
    },
    set(target, prop, value) { Reflect.set(target, prop, value); return true; },
  });
}

module.exports = { makeApi, ApiBase };
