---
title: TypeScript
description: Type handlers, Bot API payloads, rich messages, and TeleBibz configuration.
---

# TypeScript

TeleBibz ships `.d.ts` declarations. The package currently uses CommonJS; use a Node-compatible module resolution setting in your TypeScript project.

## Create a bot

```ts
import { TeleBibz } from '@xbibzlibrary/telebibz';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set');

const bot = new TeleBibz(token, {
  silent: true,
  onError: (err, ctx) => {
    console.error('Update failed:', err, ctx?.chatId);
  },
});

bot.cmd('start', (ctx) => ctx.reply(`Hello ${ctx.from?.first_name ?? 'there'}!`));
bot.hears(/ping/i, (ctx) => ctx.reply('pong'));

async function main() {
  await bot.launch();
}
main().catch(console.error);
```

Handlers receive a `Context`; fields that are not present in every update are optional. See the [Context reference](/en/reference/context).

## Method names, payloads, and results

`TelegramMethodName`, `TelegramMethodPayload<M>`, and `TelegramMethodResult<M>` are derived from the Telegram Bot API schema included in the package. `callApi()` and `raw()` infer payload and response types from the method name:

```ts
import {
  TeleBibz,
  type TelegramMethodName,
  type TelegramMethodPayload,
  type TelegramMethodResult,
} from '@xbibzlibrary/telebibz';

const bot = new TeleBibz(process.env.BOT_TOKEN!);
const method = 'sendMessage' satisfies TelegramMethodName;
const payload: TelegramMethodPayload<typeof method> = {
  chat_id: 123456789,
  text: 'Hello from TypeScript',
};

async function send() {
  const result: TelegramMethodResult<typeof method> = await bot.api.callApi(method, payload);
  return result;
}
```

Payload fields follow Telegram's naming, generally `snake_case`. A method not covered by declarations can still be reached through the JavaScript proxy, but dynamic proxy access has less type validation.

## Rich Messages and files

Helpers include `InputRichBlock`, `InputRichMessage`, `InputRichMessageMedia`, `RichMessageButton`, `TelegramTypes`, and the `rich` builder:

```ts
import { TeleBibz, rich } from '@xbibzlibrary/telebibz';

const bot = new TeleBibz(process.env.BOT_TOKEN!);
bot.cmd('status', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('Service status', 2),
  rich.paragraph(['API: ', rich.bold('online')]),
])));
```

File inputs support strings or paths, `Buffer`, `Uint8Array`, and streams through `File` or `InputFile`. See [Rich Messages](/en/guide/rich-messages) for multipart media and draft limitations.

## Exported types

- `TeleBibzOptions`, `SessionOptions`, `Handler`, `Context`, `Composer`, `BotError`, `ApiClient`, and `ApiError`.
- `TelegramFileInput`, `TelegramMethodName`, `TelegramMethodPayload<M>`, `TelegramMethodResult<M>`, `TelegramApiMethods`, and `TelegramApiPayloads`.
- `TelegramTypes` as a type namespace for Bot API objects.
- Rich Message types and file-input types.

The bundled schema follows the TeleBibz package version and does not replace Telegram's docs for runtime requirements, permissions, or limits. Run `npm run typecheck` and your application tests when upgrading the library.
