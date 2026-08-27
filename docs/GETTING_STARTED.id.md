# Memulai dengan Telebibz

Panduan ini membawa developer baru dari instalasi hingga bot Telegram yang berjalan dalam beberapa menit.

## 1. Buat token bot

Buat bot melalui akun resmi pengelola bot Telegram dan simpan token di environment deployment. Jangan pernah commit token ke source control.

## 2. Instal Telebibz

```bash
mkdir my-telebibz-bot && cd my-telebibz-bot
npm init -y
npm install @xbibzlibrary/telebibz
npm install --save-dev tsx typescript
```

Atur secret melalui secret manager atau export variable pada shell:

```bash
export TELEGRAM_BOT_TOKEN="<token-bot-kamu>"
```

## 3. Tulis bot pertama

Buat `index.ts`:

```ts
import { Bot } from "@xbibzlibrary/telebibz";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN wajib diisi.");

const bot = new Bot(token);
bot.command("start", async (ctx) => { await ctx.reply("Telebibz berhasil berjalan."); });
bot.onText("ping", async (ctx) => { await ctx.reply("pong"); });

await bot.start();
```

Jalankan:

```bash
npx tsx index.ts
```

Kirim `/start` atau `ping` ke bot. Terminal akan menampilkan branding Telebibz dan log terstruktur. Gunakan format logger `json` jika output akan dikonsumsi log collector.

## 4. Tambahkan wizard multi-langkah

Gunakan `Wizard` dan `bot.useWizard()` ketika jawaban harus melanjutkan step aktif. Mulai flow secara eksplisit dengan `wizard.run(ctx)`:

```ts
const wizard = new Wizard()
  .step({ id: "name", run: async (flow) => {
    flow.set("name", flow.ctx.message?.text?.trim()).next();
    await flow.ctx.reply("Berapa umur kamu?");
  }})
  .step({ id: "age", run: async (flow) => {
    const age = Number(flow.ctx.message?.text?.trim());
    if (!Number.isInteger(age)) { await flow.ctx.reply("Kirim angka bulat."); return; }
    flow.set("age", age).next();
    await flow.ctx.reply("Registrasi selesai.");
  }});

bot.useWizard(wizard);
bot.command("register", async (ctx) => {
  await wizard.run(ctx);
  await ctx.reply("Siapa nama kamu?");
});
```

Conversation manager default tetap digunakan selama instance wizard hidup, sedangkan key dibuat dari identitas chat dan pengirim. `/cancel` membatalkan flow aktif secara default.

## 5. Checklist production

Gunakan HTTPS untuk webhook, validasi secret webhook Telegram, simpan token di secret manager, gunakan structured JSON logs, tambahkan health check, gunakan persistent storage untuk session yang harus bertahan setelah restart, dan jalankan `npm run typecheck`, `npm run test:types`, `npm run test:examples`, `npm test`, `npm run build`, serta `npm run security` sebelum deploy.

## Langkah berikutnya

- [Runnable examples](../examples/README.md)
- [Referensi API lengkap](API.id.md)
- [Webhook API](API.id.md#10-webhook)
- [Conversation dan wizard](API.id.md#8-state-session-and-conversations)
- [Panduan kontribusi](../CONTRIBUTING.md)
