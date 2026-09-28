// lib/inline-query.js — helper mode inline: matcher query + builder hasil.
'use strict';

/** bot.inlineQuery(/kucing|anjing/i, handler) atau bot.inlineQuery('*', handler) */
function matchInlineQuery(trigger) {
  return (ctx) => {
    const q = ctx.inline_query;
    if (!q) return false;
    if (trigger === undefined || trigger === '*') return true;
    const list = [].concat(trigger);
    const text = q.query || '';
    return list.some((t) => {
      if (!(t instanceof RegExp)) return text.toLowerCase().includes(String(t).toLowerCase());
      t.lastIndex = 0;
      return t.test(text);
    });
  };
}

/** Builder hasil inline (persis spek Bot API). */
const iq = {
  article: (id, title, extra = {}) => ({ type: 'article', id: String(id), title, input_message_content: { message_text: extra.message_text || title, ...(extra.input_message_content || {}) }, ...omit(extra, ['message_text', 'input_message_content']) }),
  richArticle: (id, title, richMessage, extra = {}) => ({ type: 'article', id: String(id), title, input_message_content: { rich_message: richMessage }, ...omit(extra, ['input_message_content']) }),
  photo: (id, url, thumb, extra = {}) => ({ type: 'photo', id: String(id), photo_url: url, thumbnail_url: thumb || url, ...extra }),
  gif: (id, url, thumb, extra = {}) => ({ type: 'gif', id: String(id), gif_url: url, thumbnail_url: thumb || url, ...extra }),
  video: (id, url, thumb, title, extra = {}) => ({ type: 'video', id: String(id), video_url: url, thumbnail_url: thumb, title, mime_type: 'video/mp4', input_message_content: { message_text: url }, ...extra }),
  audio: (id, url, title, extra = {}) => ({ type: 'audio', id: String(id), audio_url: url, title, ...extra }),
  location: (id, lat, lon, title, extra = {}) => ({ type: 'location', id: String(id), latitude: lat, longitude: lon, title, ...extra }),
  sticker: (id, fileId, extra = {}) => ({ type: 'sticker', id: String(id), sticker_file_id: fileId, ...extra }),
};
function omit(o, keys) { const c = { ...o }; for (const k of keys) delete c[k]; return c; }

module.exports = { matchInlineQuery, iq };
