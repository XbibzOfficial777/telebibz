---
title: Wizard
description: Buat form percakapan bertahap dengan validasi, tombol, dan kontrol sesi.
---

# Wizard

Wizard menyimpan langkah dan jawaban sementara ke `ctx.session`, sehingga kamu tidak perlu membuat state percakapan sendiri. Secara default `bot.wizard(id, definition)` juga mendaftarkan command dengan ID yang sama—misalnya ID `daftar` akan dipicu oleh `/daftar`.

## Form teks dengan parsing dan validasi

```js
bot.wizard('daftar', {
  steps: [
    { key: 'nama', ask: 'Siapa namamu?' },
    {
      key: 'umur',
      ask: 'Berapa umurmu?',
      parse: Number,
      validate: (n) => (Number.isInteger(n) && n > 0 && n < 120
        ? null
        : 'Masukkan umur berupa angka yang valid:'),
    },
  ],
  done: (answers, ctx) =>
    ctx.reply(`Sip, ${answers.nama}! Umurmu ${answers.umur}.`),
});
```

Setiap step memerlukan `key` dan `ask`. `ask` dapat berupa string atau fungsi async `(ctx) => string`. `parse(input, ctx)` mengubah jawaban sebelum validasi; `validate(value, ctx)` mengembalikan `null` bila valid atau string pesan untuk percobaan ulang. `done(answers, ctx)` dijalankan setelah semua langkah selesai.

Kalau wizard perlu dimulai dari tombol/handler lain, panggil `bot.wizardStart(ctx, 'daftar')`. Argumen ketiga `bot.wizard(id, definition, bindCommand)` dapat bernilai `false` untuk tidak mendaftarkan command otomatis.

## Pilihan dengan tombol

Pilihan dapat menggunakan reply keyboard atau inline keyboard. Daftar flat tombol disusun maksimal dua per baris; array bertingkat menentukan baris secara eksplisit. Object `{ text, value }` memisahkan label yang terlihat dari nilai yang disimpan.

```js
bot.wizard('survey', {
  mode: 'edit',
  steps: [
    {
      key: 'pulau',
      ask: 'Kamu tinggal di pulau mana?',
      inline: true,
      onlyButtons: true,
      buttons: [[
        { text: 'Jawa', value: 'jawa' },
        { text: 'Sumatera', value: 'sumatera' },
      ]],
    },
    { key: 'catatan', ask: 'Ada catatan tambahan?' },
  ],
  done: (answers, ctx) => ctx.reply(`Tersimpan: ${answers.pulau}`),
});
```

`inline: true` membuat tombol callback; klik tombol menyimpan value tanpa mengetik. Tanpa `inline`, wizard menampilkan reply keyboard. `onlyButtons: true` menolak input bebas untuk step tersebut; berikan string sebagai `onlyButtons` untuk mengganti pesan penolakan.

## Mode tampilan dan pembersihan

- `mode: 'send'` (default): setiap pertanyaan dikirim sebagai pesan baru.
- `mode: 'edit'`: edit pesan pertanyaan terakhir menjadi pertanyaan selanjutnya.
- `mode: 'delete'`: hapus pesan pertanyaan sebelumnya, lalu kirim berikutnya.
- `mode` dapat diatur di level wizard atau dioverride per step.
- `opts` pada step diteruskan ke shortcut `ctx.reply`/edit, misalnya parse mode.
- `oneTime` hanya berlaku untuk reply keyboard.
- `cleanup: true` menghapus pesan pertanyaan terakhir ketika wizard selesai; default-nya `true` untuk mode delete dan `false` selain itu.
- `removeKeyboard` menghapus reply keyboard saat selesai; default aktif bila wizard pernah menampilkan reply keyboard.

Input non-teks saat wizard aktif tidak diteruskan ke handler lain; wizard tetap menunggu jawaban. Perintah pembatalan bawaan adalah `batal`, `/batal`, dan `cancel`; ubah dengan `cancelWords`. `onCancel(ctx)` dapat mengirim respons khusus. Saat memakai wizard pada production multi-instance, gunakan storage session bersama—Map default hanya hidup dalam satu proses.

## Kontrol dari aplikasi

```js
bot.action('mulai-survey', (ctx) => bot.wizardStart(ctx, 'survey'));

bot.cmd('batal-form', async (ctx) => {
  if (bot.wizardActive(ctx)) await bot.wizardCancel(ctx);
});
```

Method pengendali bot meliputi `wizardStart(ctx, id)`, `wizardActive(ctx)`, `wizardCancel(ctx)`, `wizardEdit(ctx, text, extra?)`, dan `wizardDelete(ctx)`. Untuk penyimpanan `ctx.session`, lihat [File & session](/guide/files-sessions#session-bawaan).