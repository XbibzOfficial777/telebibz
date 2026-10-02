---
title: TypeScript
description: 为处理器、Bot API payload、Rich Message 与 TeleBibz 配置使用类型。
---

# TypeScript

TeleBibz 附带 `.d.ts` 类型声明。软件包当前使用 CommonJS；请在 TypeScript 项目中采用兼容 Node.js 的模块解析设置。

## 创建机器人

```ts
import { TeleBibz } from '@xbibzlibrary/telebibz';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('尚未设置 BOT_TOKEN');

const bot = new TeleBibz(token, {
  silent: true,
  onError: (err, ctx) => {
    console.error('更新处理失败：', err, ctx?.chatId);
  },
});

bot.cmd('start', (ctx) => ctx.reply(`你好，${ctx.from?.first_name ?? '朋友'}！`));
bot.hears(/ping/i, (ctx) => ctx.reply('pong'));

async function main() {
  await bot.launch();
}
main().catch(console.error);
```

处理器收到 `Context`；并非每种更新都会提供的字段均为可选。详见 [Context 参考](/zh/reference/context)。

## 方法名、payload 与返回值

`TelegramMethodName`、`TelegramMethodPayload<M>` 和 `TelegramMethodResult<M>` 源自软件包附带的 Telegram Bot API schema。`callApi()` 和 `raw()` 会根据方法名推断 payload 与响应类型：

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
  text: '来自 TypeScript 的问候',
};

async function send() {
  const result: TelegramMethodResult<typeof method> = await bot.api.callApi(method, payload);
  return result;
}
```

Payload 字段遵循 Telegram 命名方式，通常为 `snake_case`。未包含在声明中的方法仍可通过 JavaScript 代理调用，但动态代理不会提供同等程度的类型检查。

## Rich Message 与文件

类型辅助包括 `InputRichBlock`、`InputRichMessage`、`InputRichMessageMedia`、`RichMessageButton`、`TelegramTypes` 和 `rich` Builder：

```ts
import { TeleBibz, rich } from '@xbibzlibrary/telebibz';

const bot = new TeleBibz(process.env.BOT_TOKEN!);
bot.cmd('status', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('服务状态', 2),
  rich.paragraph(['API：', rich.bold('在线')]),
])));
```

文件输入支持字符串或路径、`Buffer`、`Uint8Array`，以及通过 `File` 或 `InputFile` 传入的 Stream。媒体 multipart 上传与草稿限制详见 [Rich Messages](/zh/guide/rich-messages)。

## 导出的类型

- `TeleBibzOptions`、`SessionOptions`、`Handler`、`Context`、`Composer`、`BotError`、`ApiClient` 和 `ApiError`。
- `TelegramFileInput`、`TelegramMethodName`、`TelegramMethodPayload<M>`、`TelegramMethodResult<M>`、`TelegramApiMethods` 和 `TelegramApiPayloads`。
- 作为 Bot API 对象类型命名空间的 `TelegramTypes`。
- Rich Message 类型和文件输入类型。

内置 schema 对应 TeleBibz 软件包版本，不替代 Telegram 关于运行要求、权限和限制的文档。升级库后请运行 `npm run typecheck` 和应用测试。
