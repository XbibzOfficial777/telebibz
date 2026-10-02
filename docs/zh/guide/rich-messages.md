---
title: Rich Messages
description: 使用 Telegram Rich Messages API 组合结构化文本、区块与媒体。
---

# Rich Messages

Rich Message 是 Telegram 的结构化消息格式，可在单条消息中组合富文本实体与区块。TeleBibz 提供类型化 `rich` helper、渐进式 Builder、Context 快捷方法和原始类型化 API。功能与接口限制取决于 Telegram Bot API 和机器人资格；最终要求请参阅 [Telegram 官方文档](https://core.telegram.org/bots/api)。

::: warning 每条消息只能选择一种主要内容模式
Rich Message 的主要内容必须且只能是 `html`、`markdown` 或 `blocks` 之一。媒体、文字方向和实体检测选项不能替代内容模式；不要同时发送多种模式。
:::

## 使用 blocks 构建消息

每个区块 helper 会生成 `InputRichBlock` 对象。区块可以嵌套，例如在 details 中放入段落，再组成 `rich.blocks(...)`。

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

Markdown 模式使用 `rich.markdown(markdown, options)`，blocks 模式使用 `rich.blocks(blocks, options)`。`inputRichMessage(content, options)` 会验证 payload 是否只选择一种模式。`RichMessageBuilder` 可逐步构造 payload：

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

Builder 还提供 `.media(items)`、`.buildDraft()`、`.rtl(value)` 和 `.skipEntityDetection(value)`。第二次调用 `.html()`、`.markdown()` 或 `.blocks()` 会被拒绝；需要更改内容模式时请新建 Builder。`.media` 用于引用 `tg://...` 媒体 ID 的 HTML/Markdown；blocks 模式应在对应区块中插入媒体。

## 富文本实体

文本 helper 返回的实体对象可组合到 `rich.paragraph(...)` 或其他区块中。常用 helper 有 `rich.bold`、`rich.italic`、`rich.underline`、`rich.strikethrough`、`rich.spoiler`、`rich.marked`、`rich.code`、`rich.subscript`、`rich.superscript`、`rich.url`、`rich.email`、`rich.phone`、`rich.bankCard`、`rich.mention`、`rich.textMention`、`rich.hashtag`、`rich.cashtag`、`rich.botCommand`、`rich.dateTime`、`rich.customEmoji`、`rich.mathText`、`rich.anchorText`、`rich.anchorLink`、`rich.reference`、`rich.referenceLink` 和 `rich.buttonText`。

Custom emoji 需要真实有效且机器人可用的 Telegram custom emoji ID。替代文字是无障碍/回退标签；普通字符不会自动成为 custom emoji。Telegram 可能拒绝机器人或聊天不可用的 ID。

## 区块目录

`rich` 提供 `paragraph`、`heading`、`pre`、`footer`、`divider`、`mathBlock`、`anchor`、`list`、`quote`、`expandableQuote`、`pullQuote`、`table`、`details`、`map`、`animation`、`audio`、`document`、`photo`、`video`、`voiceNote`、`collage`、`slideshow`、`buttons`、`button` 和 `thinking` 等区块 helper。Heading 尺寸为 1–6；表格可配置 `bordered`、`striped`、`compact` 和 `caption`；地图使用 `{ latitude, longitude }`；按钮区块支持 1–8 个按钮。

表格单元格格式为 `{ text, align, valign }`，可通过 `is_header: true` 标记表头。水平对齐可为 `left`、`center` 或 `right`；垂直对齐可为 `top`、`middle` 或 `bottom`。当前 schema 最多支持 20 列。

每个按钮只选择一种动作，例如 `url`、`callback_data`、`web_app`、`login_url`、`switch_inline_query`、`copy_text` 或 `disabled`。回调按钮样式包括 `danger`、`success`、`primary` 和 `link`；显示效果依赖 Telegram 应用版本。

## 媒体与 multipart 上传

已存储在 Telegram 的媒体可通过 `file_id` 引用。上传新文件时，使用 `File`/`InputFile` 包装字节、路径或 Stream，并选择对应的媒体 Builder。TeleBibz 会收集附件并通过 multipart `attach://` 发送，包括嵌套 payload 中的文件。

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

HTML/Markdown 可使用唯一 ID 和匹配的 `media` 条目引用媒体。文件格式、大小、权限与方法资格由 Telegram 最终校验。

::: tip 媒体备注
对 rich animation 接口的直接测试中，MP4 可用，而 GIF 返回 `RICH_MESSAGE_VIDEO_INVALID`；独立的 `sendAnimation` 接口可接受相同 GIF。Rich animation 区块被拒绝时，可尝试 MP4。Live photo 使用独立方法，不是普通区块类型。
:::

## 草稿：临时预览

草稿不是永久聊天消息，可用于临时预览或流式内容，完成后再发送正式消息。`rich.draftHtml`、`rich.draftMarkdown`、`rich.draftBlocks` 与 `RichMessageBuilder.buildDraft()` 可生成 `sendRichMessageDraft` 所需数据。

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

草稿 ID 必须为非零值并符合 Telegram 规则。不要用草稿 Builder 上传新的 `File`；若 schema 支持，可引用已有 `file_id`。

## Live photo、付费媒体与临时消息

`ctx.replyWithLivePhoto(video, photo, extra?)` 会发送相关联的视频和静态照片，两者可使用文件 ID 或 `File`/`InputFile`；当前接口不接受直接 URL。`InputMediaBuilder.livePhoto(video, photo)` 和 `InputPaidMediaBuilder.livePhoto(video, photo)` 可创建对应媒体对象。

`sendPaidMedia` 使用 Telegram Stars，`star_count` 必须符合 Telegram 规定范围。这是真实支付功能；发送前请获得用户同意并确认产品要求。付费图片示例：

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

Ephemeral 临时消息会发送给指定接收者。机器人资格、聊天类型、接收者和权限均由 Telegram 决定。Context 快捷方法包括 `replyEphemeral`、`editEphemeralMessageText`、`editEphemeralRichMessage`、`editEphemeralMessageMedia`、`editEphemeralMessageCaption`、`editEphemeralMessageReplyMarkup` 和 `deleteEphemeralMessage`。Telegram 可能以 `BOT_NOT_ADMIN` 等错误拒绝请求；请处理 API 错误。

## 编辑 Rich Message 与 Context 快捷方法

若当前更新包含可编辑消息，可使用 `ctx.editRichMessage(content, extra?)`。其他 Bot API 10.3 快捷方法包括 `replyWithRichMessage`、`replyWithLivePhoto`、`sendMessageDraft`、`sendRichMessageDraft`、`replyEphemeral`、`guestQueryId` 和 `answerGuestQuery`。Guest query 必须来自真实 Telegram 更新；Inline Rich Article 可通过 `iq.richArticle(id, title, richMessage, extra)` 构造。

## Bot API 访问与限制

本版本的 TeleBibz 注册表识别 **185 个方法名称**，并为 `api.callApi()`/`api.raw()` 提供 TypeScript payload 类型。运行时代理也可按名称访问新增方法，但 JavaScript 中的动态代理不会自动检查 payload。

内置 Bot API 10.3 schema 记录的限制包括 **32,768 个 UTF-8 字符**、含嵌套区块的 **500 个区块**、**16 层嵌套**、**50 个媒体附件**和**20 列表格**。Map 缩放范围为 0–24，宽高为 0–10,000；按钮区块包含 1–8 个按钮。Telegram 限制可能变化，大型 payload 构造前请核对[官方文档](https://core.telegram.org/bots/api)。

- `RICH_MESSAGE_VIDEO_INVALID`：Rich animation 区块可尝试使用 MP4。
- `BOT_NOT_ADMIN`：检查机器人权限与方法资格；该错误不一定代表 JSON payload 错误。
- `chat not found`：私聊接收者通常需先打开机器人并点击 **Start**。
- 上传错误：检查路径或 Stream、MIME 类型、文件大小及 `File`/`InputFile` 用法。

API 验证结果与实时测试限制请参阅[仓库验证报告](https://github.com/XbibzOfficial777/telebibz/blob/main/VERIFIKASI-MENDALAM.md)。并非所有 185 个方法都进行过实时调用；支付、管理员权限、用户事件和交互操作需要真实环境。
