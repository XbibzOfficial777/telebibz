---
title: Rich Messages
description: 使用 Telegram Rich Messages API 组合富文本、结构化区块、按钮与媒体。
---

# Rich Messages

Rich Message 是 Telegram 的结构化消息格式，可在一条消息中组合富文本实体和区块。TeleBibz 提供 `rich` helper、渐进式 Builder、Context 快捷方法以及类型化的原始 API。功能和接口限制取决于 Telegram Bot API 与机器人资格；最终规则请参阅 [Telegram 官方文档](https://core.telegram.org/bots/api)。

::: warning 每条消息只能选择一种主要内容模式
Rich Message 必须且只能选择一种主要内容来源：`html`、`markdown` 或 `blocks`。媒体、文本方向和实体检测等选项不能替代内容模式；不要同时发送多种模式。
:::

## 使用 blocks 构建消息

每个区块 helper 都会生成类型化的 `InputRichBlock` 对象。区块可以嵌套，例如在 details 中放入段落，再组合到 `rich.blocks(...)`。

```js
const { TeleBibz, rich } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
bot.cmd('report', (ctx) => ctx.replyWithRichMessage(rich.blocks([
  rich.heading('每周报告', 2),
  rich.paragraph(['状态：', rich.bold('已完成')]),
  rich.table([
    [
      { text: '指标', is_header: true, align: 'left', valign: 'middle' },
      { text: '数值', is_header: true, align: 'right', valign: 'middle' },
    ],
    [
      { text: '订单', align: 'left', valign: 'middle' },
      { text: '42', align: 'right', valign: 'middle' },
    ],
  ], { bordered: true, striped: true, compact: true, caption: '本周' }),
  rich.details('详情', [rich.paragraph('报告已自动生成。')]),
  rich.buttons([
    rich.button('打开仪表板', { url: 'https://example.com' }, 'primary'),
    rich.button('确认', { callback_data: 'report:ack' }, 'success'),
  ], 'center'),
])));

bot.launch();
```

## HTML、Markdown 与 blocks 模式

```js
const message = rich.html('<b>公告</b><br>新版本现已发布。');
await ctx.replyWithRichMessage(message);
```

Markdown 模式使用 `rich.markdown(markdown, options)`，blocks 模式使用 `rich.blocks(blocks, options)`。`inputRichMessage(content, options)` 会验证 payload 是否只选择一种内容模式。

```js
const { inputRichMessage } = require('@xbibzlibrary/telebibz');

const payload = inputRichMessage({
  blocks: [rich.heading('服务状态', 2)],
  is_rtl: false,
});
await ctx.replyWithRichMessage(payload);
```

`RichMessageBuilder` 可逐步构造 payload。同一个 Builder 第二次调用 `.html()`、`.markdown()` 或 `.blocks()` 会被拒绝；需要切换内容模式时请新建 Builder。

```js
const { RichMessageBuilder } = require('@xbibzlibrary/telebibz');

const message = new RichMessageBuilder()
  .blocks([rich.heading('状态', 2)])
  .add(rich.paragraph('所有服务运行正常。'))
  .rtl(false)
  .skipEntityDetection()
  .build();

await ctx.replyWithRichMessage(message);
```

Builder 还提供 `.media(items)`、`.buildDraft()`、`.rtl(value)` 和 `.skipEntityDetection(value)`。`.media` 可与引用 `tg://...` 媒体 ID 的 HTML/Markdown 配合使用；在 blocks 模式中，应把媒体直接放入相应区块。

## 富文本实体

富文本内容可以是字符串、字符串与实体组成的数组，或嵌套实体。文本 helper 返回的实体对象可组合到 `rich.paragraph(...)` 或其他区块中。

| Helper | 用途 |
| --- | --- |
| `rich.bold(text)` | 粗体。 |
| `rich.italic(text)` | 斜体。 |
| `rich.underline(text)` | 下划线。 |
| `rich.strikethrough(text)` | 删除线。 |
| `rich.spoiler(text)` | 剧透文本。 |
| `rich.marked(text)` | 标记文本。 |
| `rich.code(text)` | 行内代码。 |
| `rich.subscript(text)`, `rich.superscript(text)` | 下标和上标。 |
| `rich.url(text, url)` | 显示自定义文字的链接。 |
| `rich.email(text, email)`, `rich.phone(text, phone)`, `rich.bankCard(text, number)` | 邮箱、电话号码和银行卡号实体。 |
| `rich.mention(text, username)` | 根据用户名创建 mention。 |
| `rich.textMention(text, user)` | 根据 Telegram User 对象创建 mention。 |
| `rich.hashtag(text, value)`, `rich.cashtag(text, value)`, `rich.botCommand(text, value)` | hashtag、cashtag 和 bot 命令。 |
| `rich.dateTime(text, unixTime, format)` | 使用 Unix 时间戳的日期/时间实体。 |
| `rich.customEmoji(customEmojiId, alternativeText)` | Telegram custom emoji 实体；ID 必须有效且机器人可用。 |
| `rich.mathText(expression)` | 文本中的数学公式实体。 |
| `rich.anchorText(name)`, `rich.anchorLink(text, name)` | 锚点与锚点链接。 |
| `rich.reference(text, name)`, `rich.referenceLink(text, name)` | 内容中的交叉引用。 |
| `rich.buttonText(text, action, style)` | 富文本内的 inline 按钮实体；不同于 `buttons` 区块。 |

Custom emoji 必须使用真实的 Telegram custom emoji ID。替代文字仅作为无障碍/回退标签；普通 emoji 字符不会自动变成 Telegram custom emoji。若机器人或聊天不可使用该 ID，Telegram 可能拒绝请求。

## 区块目录

| 类别 | Helper | 说明 |
| --- | --- | --- |
| 文本 | `paragraph(text)`, `heading(text, size)`, `pre(text, language)`, `footer(text)`, `divider()` | Heading 尺寸为 1–6；`pre` 可指定代码语言。 |
| 公式与锚点 | `mathBlock(expression)`, `anchor(name)` | 公式区块与锚点目标。 |
| 列表与引用 | `list(items)`, `quote(blocks, credit)`, `expandableQuote(text, credit)`, `pullQuote(text, credit)` | 列表项可为字符串或结构化对象；引用可嵌套区块。 |
| 表格与折叠内容 | `table(cells, options)`, `details(summary, blocks, open)` | 表格支持 `bordered`、`striped`、`compact`、`caption`；details 可默认展开。 |
| 位置 | `map(location, zoom, width, height, caption, credit)` | `location` 格式为 `{ latitude, longitude }`。 |
| 媒体 | `animation(media, caption)`, `audio(media, caption)`, `document(media, caption)`, `photo(media, caption)`, `video(media, caption)`, `voiceNote(media, caption)` | 接收 `InputMedia*` 对象并支持 multipart 上传。 |
| 画廊 | `collage(blocks, caption, credit)`, `slideshow(blocks, caption, credit)` | 将受支持的媒体区块组合为画廊或序列。 |
| 按钮 | `buttons(buttons, align)`, `button(text, action, style)` | 一个按钮区块包含 1–8 个按钮；`align` 可为 `left`、`center` 或 `right`。 |
| 草稿 | `thinking(text)` | 用于 `sendRichMessageDraft` 临时预览的区块，不是最终消息。 |

### 表格单元格

每个表格单元格格式为 `{ text, align, valign }`。`align` 可为 `left`、`center` 或 `right`；`valign` 可为 `top`、`middle` 或 `bottom`。设置 `is_header: true` 可标记表头。当前 payload schema 最多支持 20 列。

### 按钮动作

每个按钮只能选择一种动作，例如 `url`、`callback_data`、`web_app`、`login_url`、`switch_inline_query`、`switch_inline_query_current_chat`、`switch_inline_query_chosen_chat`、`copy_text` 或 `disabled`。`rich.button(...)` 用于 `buttons` 区块；`rich.buttonText(...)` 用于富文本实体。Callback 样式包括 `danger`、`success`、`primary` 和 `link`；最终显示效果取决于 Telegram 客户端版本。

## 媒体与 multipart 上传

已存储在 Telegram 的媒体可通过 `file_id` 引用。上传新文件时，使用 `File`/`InputFile` 包装 bytes、路径或 stream，并选择对应的媒体 Builder。TeleBibz 会收集附件并通过 multipart `attach://` 发送，包括嵌套 payload 中的文件。

```js
const fs = require('node:fs');
const { File, InputMediaBuilder, rich } = require('@xbibzlibrary/telebibz');

const photo = new File(fs.readFileSync('./hero.png'), 'hero.png');
const clip = new File(fs.readFileSync('./clip.mp4'), 'clip.mp4');
await ctx.replyWithRichMessage(rich.blocks([
  rich.paragraph('消息中的媒体示例：'),
  rich.photo(InputMediaBuilder.photo(photo)),
  rich.video(InputMediaBuilder.video(clip)),
]));
```

HTML/Markdown 可通过唯一 ID 和匹配的 `media` 条目引用媒体：

```js
const image = new File(fs.readFileSync('./hero.png'), 'hero.png');
await ctx.replyWithRichMessage(rich.html(
  '<b>主图</b><br><a href="tg://photo?id=hero">查看图片</a>',
  { media: [{ id: 'hero', media: InputMediaBuilder.photo(image) }] },
));
```

请为文件选择匹配的 Builder。文件名和 MIME 类型有助于构造 multipart payload；文件格式、大小、权限和接口资格仍由 Telegram 最终校验。

::: tip 媒体备注
对 rich animation 接口的直接测试中，MP4 可用，而 GIF 返回 `RICH_MESSAGE_VIDEO_INVALID`；独立的 `sendAnimation` 接口可接受相同 GIF。Rich animation 区块被拒绝时可尝试 MP4。Live photo 使用独立方法，不是普通区块类型。
:::

## 草稿：临时预览

草稿不是永久聊天消息。可使用它发送预览或流式内容，完成后再发送正式消息以保存内容。`rich.draftHtml`、`rich.draftMarkdown`、`rich.draftBlocks` 和 `RichMessageBuilder.buildDraft()` 会生成 `sendRichMessageDraft` 所需的数据。

```js
bot.cmd('preview', async (ctx) => {
  const draftId = Date.now();
  await ctx.sendMessageDraft(draftId, '正在准备报告', { can_stop: true });
  await ctx.sendRichMessageDraft(draftId + 1, rich.draftBlocks([
    rich.paragraph(['正在处理你的', rich.bold('报告')]),
    rich.thinking('正在收集数据'),
  ]), { can_stop: true, keep_on_stop: true });

  return ctx.replyWithRichMessage(rich.markdown('**报告已就绪**'));
});
```

草稿 ID 必须为非零值并符合 Telegram 规则。不要使用草稿 Builder 上传新的 `File`；若 schema 支持，可引用已有 `file_id`。

## Live photo、付费媒体与临时消息

### Live photo

`ctx.replyWithLivePhoto(video, photo, extra?)` 会发送相关联的视频和静态照片。两者都可使用 file ID 或 `File`/`InputFile`；当前接口不接受直接 URL。

```js
await ctx.replyWithLivePhoto('VIDEO_FILE_ID', 'PHOTO_FILE_ID', { caption: '珍贵时刻' });
```

`InputMediaBuilder.livePhoto(video, photo)` 和 `InputPaidMediaBuilder.livePhoto(video, photo)` 可创建对应媒体对象。

### 付费媒体

`sendPaidMedia` 使用 Telegram Stars，`star_count` 必须符合 Telegram 规定范围。这是真实支付功能；发送前请获得用户同意，并在发布前核对产品与 Stars 要求。

```js
const { File, InputPaidMediaBuilder } = require('@xbibzlibrary/telebibz');
const paidImage = new File(require('node:fs').readFileSync('./paid.png'), 'paid.png');
await ctx.api.callApi('sendPaidMedia', {
  chat_id: ctx.chatId,
  star_count: 1,
  media: [InputPaidMediaBuilder.photo(paidImage)],
  caption: '付费媒体示例',
});
```

### Ephemeral 临时消息

Ephemeral 消息会发送给指定接收者。机器人资格、聊天类型、接收者和权限由 Telegram 决定。Context 快捷方法包括 `replyEphemeral`、`editEphemeralMessageText`、`editEphemeralRichMessage`、`editEphemeralMessageMedia`、`editEphemeralMessageCaption`、`editEphemeralMessageReplyMarkup` 和 `deleteEphemeralMessage`。

```js
await ctx.replyEphemeral('临时通知', ctx.from.id);
```

Telegram 可能因权限问题以 `BOT_NOT_ADMIN` 等错误拒绝请求。请处理 API 错误；payload 格式正确不代表所有聊天都具备调用资格。

## 编辑 Rich Message

如果当前更新包含可编辑消息，可使用 `ctx.editRichMessage(content, extra?)`。目标由上下文中的 `chat_id`/`message_id` 或 `inline_message_id` 决定。请针对机器人自己发送且确实可以编辑的消息进行测试。

## Bot API 10.3 的 Context 快捷方法

| Helper | 用途 |
| --- | --- |
| `ctx.replyWithRichMessage(content, extra?)` | 向当前聊天发送已保存的 Rich Message。 |
| `ctx.editRichMessage(content, extra?)` | 编辑当前上下文中可编辑的 Rich Message。 |
| `ctx.replyWithLivePhoto(video, photo, extra?)` | 发送 live photo。 |
| `ctx.sendMessageDraft(draftId, text, extra?)` | 发送临时文本预览。 |
| `ctx.sendRichMessageDraft(draftId, richMessage, extra?)` | 发送临时 Rich Message 预览。 |
| `ctx.replyEphemeral(text, receiverUserId, extra?)` | 向指定接收者发送 ephemeral 消息。 |
| `ctx.guestQueryId`, `ctx.answerGuestQuery(result)` | 读取并回答真实的 guest-query 更新。 |

Guest query 必须包含来自真实 Telegram 更新的 `guest_query_id`。对于实际收到的 inline query，可使用 `iq.richArticle(id, title, richMessage, extra)` 构造 Inline Rich Article。

## Bot API 访问与类型

此版本的 TeleBibz 注册表识别 **185 个方法名称**，并为 TypeScript 中的 `api.callApi()` 和 `api.raw()` 提供 payload 类型。运行时代理也可按名称访问新增方法，但 JavaScript 的动态代理调用不会自动验证 payload。

```js
await ctx.api.callApi('sendRichMessage', {
  chat_id: ctx.chatId,
  rich_message: rich.markdown('**报告已就绪**'),
});
```

导出的类型包括 `TelegramMethodName`、`TelegramMethodPayload<M>`、`TelegramMethodResult<M>`、`TelegramApiMethods`、`TelegramApiPayloads` 和 `TelegramTypes` namespace。请参阅 [TypeScript](/zh/reference/typescript) 与 [185 个方法列表](/zh/reference/methods)。类型定义不保证每个方法都能通过真实请求；部分方法需要真实 update、管理员权限、购买行为或特定聊天上下文。

## Payload 限制、错误与校验

随包提供的 Bot API 10.3 schema 记录了 Rich Message 限制：**32,768 个 UTF-8 字符**、包含嵌套区块在内的 **500 个区块**、**16 层嵌套**、**50 个媒体附件**和**20 列表格**。Map 区块的缩放范围为 0–24，宽高为 0–10,000；按钮区块包含 1–8 个按钮。Telegram 可能调整限制；构造大型 payload 前请核对[官方文档](https://core.telegram.org/bots/api)。

- `RICH_MESSAGE_VIDEO_INVALID`：Rich animation 区块可尝试 MP4。
- `BOT_NOT_ADMIN`：检查机器人权限和方法资格；该错误不一定表示 JSON payload 无效。
- `chat not found`：私聊接收者通常需要先打开机器人并点击 **Start**。
- 上传错误：检查路径或 stream、MIME 类型、文件大小以及 `File`/`InputFile` 用法。

API 验证结果和实时测试限制请参阅[仓库验证报告](https://github.com/XbibzOfficial777/telebibz/blob/main/VERIFIKASI-MENDALAM.md)。并非所有 185 个方法都经过实时调用；支付、管理员权限、用户事件和交互操作需要真实环境。
