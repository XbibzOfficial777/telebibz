# 📖 Analisis Lengkap telebibz v3.1.2

> Hasil studi kode repo `github.com/XbibzOfficial777/telebibz` —
> logic, fungsi, alur & workflow. Diperbarui 2026-09-28.
> Audit mendalam, test regresi, dan pembandingan Bot API resmi terbaru dicatat di [`VERIFIKASI-MENDALAM.md`](VERIFIKASI-MENDALAM.md).

---

## 1. Gambaran Umum

**telebibz** adalah library bot Telegram untuk Node.js (CommonJS, Node ≥ 18),
recode mandiri dari arsitektur [grammY](https://grammy.dev) (kredit MIT di
`NOTICE.md`), dengan dokumentasi bahasa Indonesia. Posisi pasarnya:
*fitur setara grammY, tetapi wizard/menu/rate-limit/broadcast jadi fitur bawaan
(bukan plugin), plus ketahanan polling 409 dan error yang dimanusiakan.*

- **Ukuran**: ±1.700 baris JS — 16 modul `lib/` + `index.js` + `index.d.ts`
- **Dependensi** (semuanya terpakai): `axios` (transport keep-alive),
  `mime-types` (content-type upload), `https-proxy-agent` (proxy VPS), `debug` (log)
- **Test**: 30 test fitur + 17 test audit/regresi offline; termasuk transport HTTP lokal, tidak memerlukan token Telegram.

---

## 2. Arsitektur

```
                        ┌────────────────────────────────────────────┐
 Telegram Bot API ─────►│  long-polling (runner.js) / webhook (bot)  │
                        └───────────────┬────────────────────────────┘
                                        │ update JSON mentah
                                        ▼
                        TeleBibz.handleUpdate(update)          [lib/telebibz.js]
                                        │
                                        ▼
                       new Context(update, api, me)            [lib/context.js]
                                        │
                ┌───────────────────────▼───────────────────────────┐
                │  Pohon middleware _root (urutan tetap):           │
                │  1. session()            [lib/session.js]         │
                │  2. wizard.middleware()  [lib/wizard.js]          │
                │  3. errorBoundary(_report)                        │
                │       └─► handler publik (use/cmd/hears/action/   │
                │           on/inlineQuery/Menu/Wizard)             │
                │           [lib/composer.js + lib/menus.js]        │
                └───────────────────────┬───────────────────────────┘
                                        │ ctx.reply / ctx.api.*
                                        ▼
            ApiBase + Proxy + transformer pipeline             [lib/api.js]
            (api.config.use → autoRetry/throttler)
                                        │
                                        ▼
            transport axios: JSON atau multipart attach://     [lib/net.js]
                                        │
                                        ▼
                               https://api.telegram.org
```

Poin desain kunci:

1. **Segmentasi jelas** — transport (`net`), protokol (`api`), routing
   (`composer`), konteks (`context`), fitur (`wizard/menus/keyboard/broadcast`)
   terpisah rapat; test menyuntik `transport` palsu sehingga 100% offline.
2. **`session` & `wizard` dipasang di depan handler user** — sesi selalu
   tersedia, dan wizard yang aktif "memiliki" percakapan (menelan update
   sampai selesai/batal).
3. **`errorBoundary` membungkus handler user** — semua shortcut (`cmd`,
   `hears`, `action`, dst.) otomatis terlindungi; error dialirkan ke
   `opts.onError` atau reporter `humanize()` (lib/errors.js).

---

## 3. Bedah Modul & Fungsi

### 3.1 `lib/net.js` — transport (115 baris)
| Fungsi | Peran |
|---|---|
| `createTransport(token, opts)` | axios keep-alive (64 socket), timeout 35 s (> long-poll 25 s), dukungan `proxy` via `https-proxy-agent`, `apiRoot` custom |
| `transport(method, payload)` | deep-walk payload → setiap `File` diganti `attach://fileN` + dikirim sebagai `FormData` multipart; tanpa file → JSON murni |
| `ApiError` | error terstruktur: `description`, `error_code`, `method`, `payload`, `parameters` (termasuk `retry_after`) |
| tag `err.network` | error jaringan murni ditandai agar runner tahu harus retry |

### 3.2 `lib/api.js` — lapisan API (154 baris)
- **±90 shortcut bertipe**: pesan (`sendMessage`…`deleteMessages`), media,
  admin grup, forum topic, pembayaran/Stars, webhook, konfigurasi bot.
- **`makeApi()` = `Proxy`**: `api.metodeApaPun({...})` yang tidak terdefinisi
  otomatis jadi `callApi(nama, payload)` — kompatibel dengan metode Bot API
  yang belum dirilis.
- **`ApiConfig.use(transformer)`**: pipeline `(prev, method, payload) => result`
  gaya grammY — dasar bagi `autoRetry` & `throttler`.
- `downloadFile(file_id, dest)`: streaming `file/bot<token>/<path>` → disk.

### 3.3 `lib/composer.js` — mesin middleware (174 baris)
- **Matcher**: `on(filter)` dengan compiler string — `'message:photo'`,
  `':text'` (pesan apa pun berteks), `'chat_type:private'`,
  `'callback_query:data'`, dsb.; `command()` menangani `/cmd@BotName arg`;
  `callbackQuery()` string/RegExp; `hears()` RegExp atas teks/caption.
- **Kombinator** (semantik grammY): `filter`, `drop`, `branch`, `route`,
  `lazy`, `fork` (jalan di latar belakang), `errorBoundary`.
- **`run()`**: dispatch berurutan; handler yang tidak memanggil `next()`
  menghentikan rantai; `next()` dua kali → error eksplisit.

### 3.4 `lib/context.js` — objek `Context` (190 baris)
- Accessor universal: `chat`, `from`, `chatId`, `msgId`, `senderChat`,
  `inlineMessageId`, `businessConnectionId`, dan `guestQueryId` — variasi update
  yang berisi pesan disatukan lewat `msgOf()`, termasuk update `guest_message`.
- **±70 shortcut**: `reply*` (18 varian media/teks/lokasi/poll/invoice),
  `editMessage*`/`deleteMessage*` (sadar callback_query & inline message),
  `react()`, admin grup, `forward/copyMessage`, `answerCallbackQuery`,
  `answerInlineQuery`, `answerGuestQuery`, `getFile()` pintar (photo terbesar) + `downloadFile()`.
- **Business flavor**: `business_connection_id` otomatis disisipkan pada
  balasan dalam konteks bisnis.

### 3.5 `lib/runner.js` + siklus hidup bot
`pollLoop()`: `getUpdates` (timeout 25 s) berulang dengan kebijakan:
- **409 Conflict** (instance lain polling) → log + retry tiap `conflictDelay` (5 dtk) — *tidak crash*, unggul atas grammY;
- error jaringan/time-out → jeda lalu coba lagi; 429 menghormati `retry_after`, 5xx mencoba ulang;
- konflik 409 → jeda `conflictDelay`; error API non-retryable → `onFatal` lalu berhenti bersih.
`launch()` = `init()` (getMe) → banner → `pollLoop` → handler SIGINT/SIGTERM.
`webhook()` mengembalikan handler `(req, res)` Node murni; opsional memverifikasi
header secret Telegram dan membatasi ukuran body. `handleUpdate()` adalah pintu
universal (webhook/serverless/test). Default `allowedUpdates` kini mencakup seluruh
tipe update Bot API 10.3, termasuk `guest_message` dan `stopped_message_generation`.

### 3.6 `lib/session.js`
Key default `${from.id}:${chat.id}`, storage Map memori, swappable
(`{read, write, delete}`), `initial()` factory. `ctx.session` dibungkus Proxy
serta ditulis kembali sesudah middleware agar storage hasil deserialize ikut persisten;
penanda `__deleted` menghapus entry storage saat request selesai.

### 3.7 `lib/ratelimit.js` — keandalan
| Fungsi | Mekanisme |
|---|---|
| `autoRetry({maxRetry, baseDelayMs})` | transformer; tangkap 429, tidur `retry_after·1000 + backoff`, coba ulang ≤ maxRetry |
| `throttler({perSecond=28})` | antrean global: jarak minimum antar panggilan API |
| `limiter({windowMs, limit, onExceeded})` | middleware anti-spam per-user (sliding window) |

### 3.8 `lib/keyboard.js` & `lib/menus.js`
- `btn/url/webApp/copy` — tombol dengan `style` warna (Bot API 9.4:
  danger/success/primary) dan `icon_custom_emoji_id`; `kb(rows)`,
  `kb.confirm()`; kelas fluent `InlineKeyboard` & `Keyboard` (reply).
- **`Menu`/`MenuContainer`**: callback_data `menuId|indeks`; tombol
  `text/url/webApp/submenu/back/row`; render asinkron; klik tombol usang →
  alert aman.

### 3.9 `lib/wizard.js` ⭐ (ditingkatkan ke v3.1)
Mesin form berbasis sesi. State: `ctx.session.__telebibz_wizard =
{ id, i, ans, cb, chatId, msgId, rk }`.

| Fungsi | Peran |
|---|---|
| `define(id, def)` | validasi & registrasi (butuh `steps[]` + `done`) |
| `start(ctx, id)` | set state, tampilkan langkah 0 (mode apa pun) |
| `middleware()` | cegat jawaban selama wizard aktif: teks, tombol reply (cocok label), tombol inline (callback `wiz:<token>:<step>:<idx>`), kata batal |
| `normalizeButtons()` | 4 format: `['A']`, `[{text,value}]`, `[['A','B']]`, baris objek |
| `stepExtra()` | bangun `reply_markup` (reply keyboard / inline callback_data ber-token anti-usang) |
| `tampil()` | render langkah sesuai mode — `'send'` kirim baru, `'edit'` editMessageText (fallback kirim jika pesan hilang; toleran *not modified*), `'delete'` hapus dulu baru kirim |
| `jawab()` | `parse` → `validate` → simpan `ans[key]` → langkah berikutnya / `done()` |
| `bersih()` | `cleanup` hapus pesan tanya terakhir + `removeKeyboard` otomatis |
| `cancel/editAsk/deleteAsk` | kendali programatis (shortcut: `bot.wizardCancel/Edit/Delete`) |

Alur klik tombol inline:
`callback_query wiz:abc123:1:0` → validasi token & indeks langkah (salah →
alert "tombol usang", tanpa crash) → `answerCallbackQuery` → `jawab(nilai)`.

### 3.10 Modul pendukung
- `broadcast.js`: kirim ber-pacing (default 35 ms ≈ 28 pesan/dtk, aman limit),
  pesan boleh string/objek/fungsi per-penerima; return `{terkirim, gagal, errors}`.
- `file.js`: `File/InputFile` (Buffer/path/stream/async-iterator) +
  `InputMediaBuilder` untuk album.
- `inline-query.js`: matcher trigger + builder hasil `iq.article/photo/...`.
- `errors.js`: `humanize()` — 15 pola error Telegram → saran bahasa Indonesia.
- `logger.js`: log berwarna + banner boot ASCII.

---

## 4. Workflow End-to-End

### 4.1 Lifecycle satu update (mis. `/start`)
```
getUpdates → runner.pollLoop
  → bot.handleUpdate(update)
    → new Context(update, api, me)
      → _root.run(ctx):
          session()          → ctx.session dimuat (atau initial())
          wizard.middleware  → sesi wizard? tidak → next()
          errorBoundary      → handler publik:
              cmd('start') match → set ctx.match → handler user
                → ctx.reply() → api.sendMessage → transformer pipeline
                  → transport axios JSON → Telegram
```
Setiap handler yang melempar → `BotError` → `onError`/`printError(humanize)`.

### 4.2 Wizard penuh (fitur baru v3.1)
```
/daftar → wizard.start → tampil(step0, mode)      [tanya + tombol?]
user menjawab (teks / ketuk tombol reply / klik inline):
  → middleware wizard (sebelum handler user)
    → cek kata batal → bersih() + onCancel
    → cocok label tombol → pakai value tombol
    → callback_query wiz:* → validasi token+langkah → value tombol
  → jawab(): parse → validate
      salah → mode send: pesan baru / edit|delete: ubah pesan yang sama
      benar → ans[key]=value → langkah berikutnya via tampil()
          'edit'   → editMessageText(chatId, msgId, tanya)
          'delete' → deleteMessage(lama) → kirim tanya baru
  → langkah habis → bersih() (cleanup + removeKeyboard) → done(ans, ctx)
```

### 4.3 Menu interaktif
`menu.render(ctx)` → keyboard `id|indeks`; klik → regex `^id\|` → op ke-i →
handler / pindah submenu (`editMessageReplyMarkup`) / `back()`.

### 4.4 Broadcast
`bot.broadcast(ids, pesan)` → loop `sendMessage` + pacing → rangkuman hasil.

### 4.5 Upload file
`InputFile` → `collectAttach()` deep-walk → multipart `FormData` dengan
`attach://fileN` + Blob ber-mime-type → POST.

---

## 5. Temuan & Catatan

**Positif**
1. Arsitektur bersih dan mudah dites — injeksi transport membuat 30 test
   berjalan tanpa jaringan.
2. Ketahanan 409 + `humanize()` + `autoRetry` bawaan adalah nilai nyata
   dibanding grammY polosan.
3. Proxy API generik membuat library otomatis kompatibel dengan metode baru
   Telegram tanpa update kode.

**Perbaikan yang ditemukan dan ditangani pada audit mendalam (2026-09-28)**
1. Error boundary sebelumnya dipasang sebelum handler publik sehingga handler
   publik tidak benar-benar berada di dalam boundary. Kini middleware handler
   dimasukkan langsung sebagai sub-pohon yang dilindungi.
2. Matcher regex global (`/g`) sebelumnya bisa melewatkan match berikutnya;
   `hears`, `callbackQuery`, dan inline-query matcher kini mereset `lastIndex`.
3. Adapter sesi serialisasi kini ditulis ulang setelah tiap update; throttler tidak
   lagi macet setelah satu request gagal; limiter membersihkan bucket lama berkala.
4. Poller sekarang retry error jaringan ECONN*, 429 memakai `retry_after`, dan
   error 5xx; error API non-retryable tetap fatal.
5. Opsi `apiRoot` diteruskan ke transport dan unduhan file; webhook dapat memakai
   secret token Telegram serta batas ukuran request.
6. Default subscription, `Context`, dan matcher update diperbarui untuk update
   Bot API 10.3, termasuk `guest_message`, boost, penghapusan pesan bisnis, dan
   `stopped_message_generation`.
7. Proxy API menghindari nama `then/catch/finally` agar objek API tidak menjadi
   thenable palsu; deklarasi TypeScript diperbarui dan diverifikasi.

**Catatan sisa / batas verifikasi**
1. `launch()` tidak otomatis memanggil `deleteWebhook`; perpindahan dari webhook ke
   polling perlu dikelola eksplisit. Konflik 409 akan retry terus, bukan sukses.
2. Proxy API menerima metode Bot API baru sebagai `api.method({ ...payload })`,
   tetapi tidak melakukan validasi schema/parameter runtime untuk semua metode.
3. Upload multipart membaca file ke memori sebelum mengirim; file sangat besar
   berpotensi menaikkan penggunaan RAM.
4. Uji jaringan memakai HTTP server lokal dan mock. Tidak ada token bot yang
   diberikan, sehingga autentikasi, hak akses chat, serta penerimaan setiap metode
   pada layanan Telegram produksi tidak diuji.

**Yang dikerjakan pada studi ini (versi awal v3.1)**
- ✅ Wizard mendukung tombol pilihan, mode edit/delete, cleanup, dan tombol anti-usang.
- ✅ Branding diubah menjadi `Xbibz Technology ID`; log boot memakai blok warna
  dengan identitas developer di atasnya.
- ✅ Test fitur **30/30** dan test audit/regresi **17/17** lulus.

---

*Dokumen ini bagian dari workspace `/home/user/telebibz`.*
