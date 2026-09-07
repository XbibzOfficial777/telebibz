// lib/errors.js — terjemahan error Telegram jadi saran yang bisa ditindaklanjuti.
'use strict';

const HINTS = [
  [/401|unauthorized|not found.*token|404/i, 'Token salah/kadaluarsa — buat ulang lewat @BotFather (/revoke).'],
  [/chat not found/i, 'Chat tak ditemukan — user belum pernah /start botmu, atau ID chat salah.'],
  [/bot was blocked/i, 'Bot diblokir pengguna — jangan kirim ulang, hapus dari daftar broadcast.'],
  [/user is deactivated/i, 'Akun pengguna sudah dihapus.'],
  [/not enough rights|not enough permission/i, 'Bot bukan admin / kekurangan hak di grup itu.'],
  [/can.t parse entities/i, 'Format teks rusak — cek tag HTML/Markdown yang belum ditutup.'],
  [/message is not modified/i, 'Isi pesan sama — edit dibatalkan Telegram (aman diabaikan).'],
  [/message to delete not found/i, 'Pesan sudah terhapus lebih dulu.'],
  [/too many requests|retry after/i, 'Kena rate limit — kirim lebih lambat (lihat bot.broadcast()).'],
  [/query is too old|query id is invalid/i, 'Callback basi (>±1 menit) — abaikan, user klik tombol lama.'],
  [/button_data_invalid|BUTTON_DATA_INVALID/i, 'callback_data >64 byte / kosong.'],
  [/file is too big/i, 'File >50 MB (limit upload bot).'],
  [/wrong file identifier/i, 'file_id usang — kirim ulang dari sumbernya.'],
  [/group chat was upgraded/i, 'Grup berubah jadi supergroup — pakai chat ID baru.'],
  [/can't initiate conversation/i, 'Bot tak bisa PM user duluan — minta user /start botmu.'],
];

/** Ubah error telegraf/grammy jadi { pesan, saran } bahasa manusia. */
function humanize(err) {
  const desc =
    (err && (err.description || err.message)) || String(err);
  const found = HINTS.find(([re]) => re.test(desc));
  return {
    pesan: desc,
    saran: found ? found[1] : null,
    method: err && err.method,
    code: err && (err.error_code || err.code),
  };
}

module.exports = { humanize, HINTS };
