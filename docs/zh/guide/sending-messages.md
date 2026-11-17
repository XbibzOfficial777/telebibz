---
title: 发送消息
description: "使用 TeleBibz 发送文本、格式化内容、媒体、相册、按钮，以及编辑和删除消息的完整做法。"
---

# 发送消息

本页是发送消息的完整清单：纯文本、HTML/Markdown 格式化、单个媒体、相册、内联与回复键盘、可编辑消息、回答 callback 与 widget 查询。

第一次使用请先看[快速开始](/zh/guide/getting-started)。要发送结构化内容（标题、表格、可折叠块）请使用 [Rich Messages](/zh/guide/rich-messages)。

## 1. 基础文本

```js
const { TeleBibz } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('你好！我随时待命。'));
bot.cmd('ping', (ctx) => ctx.reply('pong 🏓'));
bot.launch();
```

`ctx.reply(text, extra)` 会自动使用当前 update 的 `chat_id`。`extra` 会原样传给 `sendMessage`，因此**所有 Bot API 字段都可使用**：

```js
bot.cmd('promo', (ctx) => ctx.reply('今天五折！', {
  disable_notification: true,
  protect_content: true,
  link_preview_options: { is_disabled: true },
  reply_parameters: { message_id: ctx.msgId },
}));
```

### 在 `ctx` 之外发送

```js
await bot.api.sendMessage(123456789, '日报已生成', { parse_mode: 'HTML' });

await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'hi' }); // 完整类型
await bot.api.raw('sendMessage', { chat_id: chatId, text: 'hi' });     // callApi 别名
```

## 2. 格式化（HTML 与 Markdown）

```js
ctx.replyWithHTML('<b>姓名：</b> <code>Budi</code>');
ctx.replyWithMarkdown('*姓名：* `Budi`');   // MarkdownV2，需转义特殊字符
```

务必转义用户输入，否则 Telegram 会返回 `can't parse entities`：

```js
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
bot.on(':text', (ctx) => ctx.replyWithHTML(`你写了：<i>${esc(ctx.msg.text)}</i>`));
```

## 3. 媒体

```js
const { File } = require('@xbibzlibrary/telebibz');

ctx.replyWithPhoto('https://example.com/a.jpg', { caption: '来自 URL' });
ctx.replyWithDocument(new File('./report.pdf'), { caption: '季度报告' });
ctx.replyWithVoice(new File('./hello.ogg'));
ctx.replyWithVideo('existing_file_id', { supports_streaming: true });
```

| 来源 | 示例 | 说明 |
|---|---|---|
| `file_id` | `'AgACAgUAAxkB...'` | 最快，无需重新上传 |
| 公网 URL | `'https://…'` | Telegram 自行下载，最大 20 MB |
| 上传 | `new File(pathOrBufferOrStream)` | 云 Bot 上传上限 50 MB（自建 Bot API 服务器 2 GB） |

### 相册

```js
const { InputMediaBuilder: M } = require('@xbibzlibrary/telebibz');
ctx.replyWithMediaGroup([
  M.photo('file_id_1', { caption: '第一张' }),
  M.photo(new File('./2.jpg')),
  M.video(new File('./clip.mp4'), { supports_streaming: true }),
]);
```

### 下载用户文件

```js
bot.on('message:document', async (ctx) => {
  const path = await ctx.downloadFile('./download.pdf', { maxBytes: 20 * 1024 * 1024 });
});
```

`ctx.downloadFile()` 与 `api.downloadFile()` 都会遵循 `apiRoot`（自建服务器）、代理、超时和 `maxBytes` 限制。

## 4. 按钮与键盘

```js
const { btn, InlineKeyboard, Keyboard, kb } = require('@xbibzlibrary/telebibz');

ctx.reply('请选择：', { reply_markup: kb.markup([[btn('是', 'yes'), btn('否', 'no')]]) });
ctx.reply('确认', { reply_markup: kb.markup([[btn('同意', 'ok', 'success'), btn('取消', 'no', 'danger')]]) });

const ikb = new InlineKeyboard().text('资料', 'profile').row().url('官网', 'https://example.com').disabled('即将上线').build();
```

处理点击：

```js
bot.action('ok', (ctx) => ctx.answerCallbackQuery('谢谢！'));
bot.action(/^item:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText('你选择了第 ' + ctx.callback_query.data.split(':')[1] + ' 项');
});
```

::: tip 始终回答 callback
不调用 `answerCallbackQuery()` 时，用户会一直看到加载动画直到超时。
:::

## 5. 编辑、删除、表情回应

```js
const sent = await ctx.reply('版本 1');
await bot.api.editMessageText(ctx.chatId, sent.message_id, '版本 2');
await bot.api.setMessageReaction(ctx.chatId, sent.message_id, [{ type: 'emoji', emoji: '🔥' }]);
```

`message is not modified` 表示内容相同，属正常现象，可忽略。

## 6. 群组中的临时消息（ephemeral）

```js
bot.action('hint', (ctx) => ctx.replyEphemeralToCallback('只有你能看到 ✨'));
bot.cmd('secret', (ctx) => ctx.replyEphemeral('私密说明', ctx.from.id));
```

## 7. 流式草稿

```js
bot.cmd('ai', async (ctx) => {
  const draftId = Date.now() % 2147483647;
  let text = '';
  for (const chunk of ['你好', '，', '这是', '逐步', '输出的回答。']) {
    text += chunk;
    await ctx.sendMessageDraft(draftId, text);
  }
  await ctx.reply(text);
});
```

## 8. 限制与常见陷阱

| 项目 | 限制 |
|---|---|
| 文本长度 | 4,096 字符（rich message 32,768） |
| 媒体说明 | 1,024 字符 |
| 上传 / 下载 | 50 MB / 20 MB |
| 相册 | 2–10 项 |
| `callback_data` | ≤ 64 字节 |
| 速率 | 约 30 条/秒（机器人）、20 条/分钟（群组） |

```js
const { autoRetry, throttler } = require('@xbibzlibrary/telebibz');
bot.api.config.use(autoRetry({ maxRetry: 3 }));
bot.api.config.use(throttler({ perSecond: 28 }));
```

另见：[速率与错误](/zh/guide/reliability)、[Context 与键盘](/zh/guide/context-keyboards)、[文件与会话](/zh/guide/files-sessions)、[Widget（Bot API 10.4）](/zh/guide/widgets)。
