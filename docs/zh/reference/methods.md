---
title: Bot API 方法列表
description: TeleBibz Bot API 方法及其 payload 字段、类型、必填状态和说明。
---

# Bot API 方法列表

TeleBibz 注册表包含 **185 个方法名称**。本索引由仓库注册表和 Bot API 声明生成。

> 本索引包含 **185 个方法**和 **950 个 payload 参数**。字段以 package 声明为准；最新权限规则和限制仍以 Telegram 为准。

> 方法名称不代表请求一定可用。实际调用仍受 Telegram 权限、聊天上下文、更新类型和接口限制约束。

## 调用方法

```js
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'Hello' });
await bot.api.getMe();
```

::: tip 如何阅读此参考
展开方法可查看 payload 状态、字段、类型、必填/可选状态、说明和返回类型。参数表由 `types/telegram-bot-api/methods.d.ts` 生成；method 与 field 说明保留 Bot API 英文注释，以避免改变技术含义。最新接口规则请以 Telegram 链接为准。
:::

## 消息、媒体与互动

- [sendMessage](#sendmessage)
- [sendRichMessage](#sendrichmessage)
- [forwardMessage](#forwardmessage)
- [forwardMessages](#forwardmessages)
- [copyMessage](#copymessage)
- [copyMessages](#copymessages)
- [sendPhoto](#sendphoto)
- [sendLivePhoto](#sendlivephoto)
- [sendAudio](#sendaudio)
- [sendDocument](#senddocument)
- [sendVideo](#sendvideo)
- [sendAnimation](#sendanimation)
- [sendVoice](#sendvoice)
- [sendVideoNote](#sendvideonote)
- [sendPaidMedia](#sendpaidmedia)
- [sendMediaGroup](#sendmediagroup)
- [sendLocation](#sendlocation)
- [editMessageLiveLocation](#editmessagelivelocation)
- [sendVenue](#sendvenue)
- [sendContact](#sendcontact)
- [sendPoll](#sendpoll)
- [sendChecklist](#sendchecklist)
- [editMessageChecklist](#editmessagechecklist)
- [sendDice](#senddice)
- [sendMessageDraft](#sendmessagedraft)
- [sendRichMessageDraft](#sendrichmessagedraft)
- [sendChatAction](#sendchataction)
- [setMessageReaction](#setmessagereaction)
- [sendChatJoinRequestWebApp](#sendchatjoinrequestwebapp)
- [editMessageText](#editmessagetext)
- [editMessageCaption](#editmessagecaption)
- [editMessageMedia](#editmessagemedia)
- [editMessageReplyMarkup](#editmessagereplymarkup)
- [deleteMessage](#deletemessage)
- [deleteMessages](#deletemessages)
- [deleteMessageReaction](#deletemessagereaction)
- [sendSticker](#sendsticker)
- [sendGift](#sendgift)
- [sendInvoice](#sendinvoice)
- [sendGame](#sendgame)

<span id="sendmessage" aria-hidden="true"></span>
::: details sendMessage · 17 个字段

**Telegram 文档:** [sendMessage](https://core.telegram.org/bots/api#sendmessage)

Use this method to send text messages. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>text</code> | 必填 | <code>string</code> | Text of the message to be sent, 1-4096 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message text. See formatting options for more details. |
| <code>entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in message text, which can be specified instead of parse_mode |
| <code>link_preview_options</code> | 可选 | <code>LinkPreviewOptions</code> | Link preview generation options for the message |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendrichmessage" aria-hidden="true"></span>
::: details sendRichMessage · 13 个字段

**Telegram 文档:** [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage)

Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendRichMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendRichMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>rich_message</code> | 必填 | <code>InputRichMessage&lt;F&gt;</code> | The message to be sent |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |

:::

<span id="forwardmessage" aria-hidden="true"></span>
::: details forwardMessage · 10 个字段

**Telegram 文档:** [forwardMessage](https://core.telegram.org/bots/api#forwardmessage)

Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'forwardMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'forwardMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat |
| <code>from_chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format &#96;@username&#96;) |
| <code>video_start_timestamp</code> | 可选 | <code>number</code> | New start timestamp for the copied video in the message |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; only available when forwarding to private chats |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the forwarded message from forwarding and saving |
| <code>message_id</code> | 必填 | <code>number</code> | Message identifier in the chat specified in from_chat_id |

:::

<span id="forwardmessages" aria-hidden="true"></span>
::: details forwardMessages · 7 个字段

**Telegram 文档:** [forwardMessages](https://core.telegram.org/bots/api#forwardmessages)

Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.

- 参数: `TelegramMethodArguments<'forwardMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'forwardMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat |
| <code>from_chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format &#96;@username&#96;) |
| <code>message_ids</code> | 必填 | <code>number[]</code> | A list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the messages silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the forwarded messages from forwarding and saving |

:::

<span id="copymessage" aria-hidden="true"></span>
::: details copyMessage · 18 个字段

**Telegram 文档:** [copyMessage](https://core.telegram.org/bots/api#copymessage)

Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.

- 参数: `TelegramMethodArguments<'copyMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'copyMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>from_chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format &#96;@username&#96;) |
| <code>message_id</code> | 必填 | <code>number</code> | Message identifier in the chat specified in from_chat_id |
| <code>video_start_timestamp</code> | 可选 | <code>number</code> | New start timestamp for the copied video in the message |
| <code>caption</code> | 可选 | <code>string</code> | New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept. |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the new caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the new caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; only available when copying to private chats |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="copymessages" aria-hidden="true"></span>
::: details copyMessages · 8 个字段

**Telegram 文档:** [copyMessages](https://core.telegram.org/bots/api#copymessages)

Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.

- 参数: `TelegramMethodArguments<'copyMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'copyMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat |
| <code>from_chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format &#96;@username&#96;) |
| <code>message_ids</code> | 必填 | <code>number[]</code> | A list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the messages silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent messages from forwarding and saving |
| <code>remove_caption</code> | 可选 | <code>boolean</code> | Pass True to copy the messages without their captions |

:::

<span id="sendphoto" aria-hidden="true"></span>
::: details sendPhoto · 19 个字段

**Telegram 文档:** [sendPhoto](https://core.telegram.org/bots/api#sendphoto)

Use this method to send photos. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendPhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendPhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>photo</code> | 必填 | <code>F &#124; string</code> | Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. |
| <code>caption</code> | 可选 | <code>string</code> | Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the photo caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media |
| <code>has_spoiler</code> | 可选 | <code>boolean</code> | Pass True if the photo needs to be covered with a spoiler animation |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendlivephoto" aria-hidden="true"></span>
::: details sendLivePhoto · 19 个字段

**Telegram 文档:** [sendLivePhoto](https://core.telegram.org/bots/api#sendlivephoto)

Use this method to send live photos. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendLivePhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendLivePhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel (in the format @channelusername) |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>live_photo</code> | 必填 | <code>F &#124; string</code> | Live photo video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. Sending live photos by a URL is currently unsupported. |
| <code>photo</code> | 必填 | <code>F &#124; string</code> | The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. Sending live photos by a URL is currently unsupported. |
| <code>caption</code> | 可选 | <code>string</code> | Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the video caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media |
| <code>has_spoiler</code> | 可选 | <code>boolean</code> | Pass True if the video needs to be covered with a spoiler animation |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |

:::

<span id="sendaudio" aria-hidden="true"></span>
::: details sendAudio · 21 个字段

**Telegram 文档:** [sendAudio](https://core.telegram.org/bots/api#sendaudio)

Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future. For sending voice messages, use the sendVoice method instead.

- 参数: `TelegramMethodArguments<'sendAudio'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendAudio'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>audio</code> | 必填 | <code>F &#124; string</code> | Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. |
| <code>caption</code> | 可选 | <code>string</code> | Audio caption, 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the audio caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>duration</code> | 可选 | <code>number</code> | Duration of the audio in seconds |
| <code>performer</code> | 可选 | <code>string</code> | Performer |
| <code>title</code> | 可选 | <code>string</code> | Track name |
| <code>thumbnail</code> | 可选 | <code>F</code> | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://\&lt;file_attach_name&gt;" if the thumbnail was uploaded using multipart/form-data under \&lt;file_attach_name&gt;. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="senddocument" aria-hidden="true"></span>
::: details sendDocument · 19 个字段

**Telegram 文档:** [sendDocument](https://core.telegram.org/bots/api#senddocument)

Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.

- 参数: `TelegramMethodArguments<'sendDocument'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendDocument'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>document</code> | 必填 | <code>F &#124; string</code> | File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. |
| <code>thumbnail</code> | 可选 | <code>F</code> | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://\&lt;file_attach_name&gt;" if the thumbnail was uploaded using multipart/form-data under \&lt;file_attach_name&gt;. |
| <code>caption</code> | 可选 | <code>string</code> | Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the document caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>disable_content_type_detection</code> | 可选 | <code>boolean</code> | Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always true, if the document is sent as part of an album. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendvideo" aria-hidden="true"></span>
::: details sendVideo · 26 个字段

**Telegram 文档:** [sendVideo](https://core.telegram.org/bots/api#sendvideo)

Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.

- 参数: `TelegramMethodArguments<'sendVideo'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendVideo'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>video</code> | 必填 | <code>F &#124; string</code> | Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. |
| <code>duration</code> | 可选 | <code>number</code> | Duration of sent video in seconds |
| <code>width</code> | 可选 | <code>number</code> | Video width |
| <code>height</code> | 可选 | <code>number</code> | Video height |
| <code>thumbnail</code> | 可选 | <code>F</code> | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://\&lt;file_attach_name&gt;" if the thumbnail was uploaded using multipart/form-data under \&lt;file_attach_name&gt;. |
| <code>cover</code> | 可选 | <code>F &#124; string</code> | Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://\&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under \&lt;file_attach_name&gt; name. |
| <code>start_timestamp</code> | 可选 | <code>number</code> | Start timestamp for the video in the message |
| <code>caption</code> | 可选 | <code>string</code> | Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the video caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media |
| <code>has_spoiler</code> | 可选 | <code>boolean</code> | Pass True if the video needs to be covered with a spoiler animation |
| <code>supports_streaming</code> | 可选 | <code>boolean</code> | Pass True if the uploaded video is suitable for streaming |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendanimation" aria-hidden="true"></span>
::: details sendAnimation · 23 个字段

**Telegram 文档:** [sendAnimation](https://core.telegram.org/bots/api#sendanimation)

Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

- 参数: `TelegramMethodArguments<'sendAnimation'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendAnimation'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>animation</code> | 必填 | <code>F &#124; string</code> | Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. |
| <code>duration</code> | 可选 | <code>number</code> | Duration of sent animation in seconds |
| <code>width</code> | 可选 | <code>number</code> | Animation width |
| <code>height</code> | 可选 | <code>number</code> | Animation height |
| <code>thumbnail</code> | 可选 | <code>F</code> | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://\&lt;file_attach_name&gt;" if the thumbnail was uploaded using multipart/form-data under \&lt;file_attach_name&gt;. |
| <code>caption</code> | 可选 | <code>string</code> | Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the animation caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media |
| <code>has_spoiler</code> | 可选 | <code>boolean</code> | Pass True if the animation needs to be covered with a spoiler animation |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendvoice" aria-hidden="true"></span>
::: details sendVoice · 18 个字段

**Telegram 文档:** [sendVoice](https://core.telegram.org/bots/api#sendvoice)

Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.

- 参数: `TelegramMethodArguments<'sendVoice'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendVoice'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>voice</code> | 必填 | <code>F &#124; string</code> | Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. |
| <code>caption</code> | 可选 | <code>string</code> | Voice message caption, 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the voice message caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>duration</code> | 可选 | <code>number</code> | Duration of the voice message in seconds |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendvideonote" aria-hidden="true"></span>
::: details sendVideoNote · 17 个字段

**Telegram 文档:** [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote)

Use this method to send video messages. On success, the sent Message is returned. As of v.4.0, Telegram clients support rounded square MPEG4 videos of up to 1 minute long.

- 参数: `TelegramMethodArguments<'sendVideoNote'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendVideoNote'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>video_note</code> | 必填 | <code>F &#124; string</code> | Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data.. Sending video notes by a URL is currently unsupported |
| <code>duration</code> | 可选 | <code>number</code> | Duration of sent video in seconds |
| <code>length</code> | 可选 | <code>number</code> | Video width and height, i.e. diameter of the video message |
| <code>thumbnail</code> | 可选 | <code>F</code> | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://\&lt;file_attach_name&gt;" if the thumbnail was uploaded using multipart/form-data under \&lt;file_attach_name&gt;. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendpaidmedia" aria-hidden="true"></span>
::: details sendPaidMedia · 17 个字段

**Telegram 文档:** [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia)

Use this method to send paid media. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendPaidMedia'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendPaidMedia'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance. |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>star_count</code> | 必填 | <code>number</code> | The number of Telegram Stars that must be paid to buy access to the media; 1-25000 |
| <code>media</code> | 必填 | <code>InputPaidMedia&lt;F&gt;[]</code> | An Array describing the media to be sent; up to 10 items |
| <code>payload</code> | 可选 | <code>string</code> | Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| <code>caption</code> | 可选 | <code>string</code> | Media caption, 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the media caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user |

:::

<span id="sendmediagroup" aria-hidden="true"></span>
::: details sendMediaGroup · 11 个字段

**Telegram 文档:** [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup)

Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.

- 参数: `TelegramMethodArguments<'sendMediaGroup'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendMediaGroup'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat |
| <code>media</code> | 必填 | <code>ReadonlyArray&lt;InputMediaAudio&lt;F&gt;&gt; &#124; ReadonlyArray&lt;InputMediaDocument&lt;F&gt;&gt; &#124; ReadonlyArray&lt;InputMediaLivePhoto&lt;F&gt; &#124; InputMediaPhoto&lt;F&gt; &#124; InputMediaVideo&lt;F&gt;&gt;</code> | An Array describing messages to be sent, must include 2-10 items |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the messages silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent messages from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendlocation" aria-hidden="true"></span>
::: details sendLocation · 19 个字段

**Telegram 文档:** [sendLocation](https://core.telegram.org/bots/api#sendlocation)

Use this method to send point on the map. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendLocation'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendLocation'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>latitude</code> | 必填 | <code>number</code> | Latitude of the location |
| <code>longitude</code> | 必填 | <code>number</code> | Longitude of the location |
| <code>horizontal_accuracy</code> | 可选 | <code>number</code> | The radius of uncertainty for the location, measured in meters; 0-1500 |
| <code>live_period</code> | 可选 | <code>number</code> | Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages. |
| <code>heading</code> | 可选 | <code>number</code> | The direction in which user is moving, in degrees; 1-360. For active live locations only. |
| <code>proximity_alert_radius</code> | 可选 | <code>number</code> | The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="editmessagelivelocation" aria-hidden="true"></span>
::: details editMessageLiveLocation · 11 个字段

**Telegram 文档:** [editMessageLiveLocation](https://core.telegram.org/bots/api#editmessagelivelocation)

Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.

- 参数: `TelegramMethodArguments<'editMessageLiveLocation'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageLiveLocation'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message to edit. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| <code>latitude</code> | 必填 | <code>number</code> | Latitude of new location |
| <code>longitude</code> | 必填 | <code>number</code> | Longitude of new location |
| <code>live_period</code> | 可选 | <code>number</code> | New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged. |
| <code>horizontal_accuracy</code> | 可选 | <code>number</code> | The radius of uncertainty for the location, measured in meters; 0-1500 |
| <code>heading</code> | 可选 | <code>number</code> | The direction in which user is moving, in degrees; 1-360. For active live locations only. |
| <code>proximity_alert_radius</code> | 可选 | <code>number</code> | The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for a new inline keyboard |

:::

<span id="sendvenue" aria-hidden="true"></span>
::: details sendVenue · 21 个字段

**Telegram 文档:** [sendVenue](https://core.telegram.org/bots/api#sendvenue)

Use this method to send information about a venue. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendVenue'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendVenue'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>latitude</code> | 必填 | <code>number</code> | Latitude of the venue |
| <code>longitude</code> | 必填 | <code>number</code> | Longitude of the venue |
| <code>title</code> | 必填 | <code>string</code> | Name of the venue |
| <code>address</code> | 必填 | <code>string</code> | Address of the venue |
| <code>foursquare_id</code> | 可选 | <code>string</code> | Foursquare identifier of the venue |
| <code>foursquare_type</code> | 可选 | <code>string</code> | Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) |
| <code>google_place_id</code> | 可选 | <code>string</code> | Google Places identifier of the venue |
| <code>google_place_type</code> | 可选 | <code>string</code> | Google Places type of the venue. (See supported types.) |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendcontact" aria-hidden="true"></span>
::: details sendContact · 17 个字段

**Telegram 文档:** [sendContact](https://core.telegram.org/bots/api#sendcontact)

Use this method to send phone contacts. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendContact'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendContact'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>phone_number</code> | 必填 | <code>string</code> | Contact's phone number |
| <code>first_name</code> | 必填 | <code>string</code> | Contact's first name |
| <code>last_name</code> | 可选 | <code>string</code> | Contact's last name |
| <code>vcard</code> | 可选 | <code>string</code> | Additional data about the contact in the form of a vCard, 0-2048 bytes |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendpoll" aria-hidden="true"></span>
::: details sendPoll · 35 个字段

**Telegram 文档:** [sendPoll](https://core.telegram.org/bots/api#sendpoll)

Use this method to send a native poll. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendPoll'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendPoll'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. Polls can't be sent to channel direct messages chats. |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>question</code> | 必填 | <code>string</code> | Poll question, 1-300 characters |
| <code>question_parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed. |
| <code>question_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the poll question. It can be specified instead of question_parse_mode. |
| <code>options</code> | 必填 | <code>InputPollOption&lt;F&gt;[]</code> | A list of 1-12 answer options |
| <code>is_anonymous</code> | 可选 | <code>boolean</code> | True, if the poll needs to be anonymous, defaults to True |
| <code>type</code> | 可选 | <code>"quiz" &#124; "regular"</code> | Poll type, “quiz” or “regular”, defaults to “regular” |
| <code>allows_multiple_answers</code> | 可选 | <code>boolean</code> | Pass True if the poll allows multiple answers, defaults to False |
| <code>allows_revoting</code> | 可选 | <code>boolean</code> | Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls |
| <code>shuffle_options</code> | 可选 | <code>boolean</code> | Pass True if the poll options must be shown in random order |
| <code>allow_adding_options</code> | 可选 | <code>boolean</code> | Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes |
| <code>hide_results_until_closes</code> | 可选 | <code>boolean</code> | Pass True if poll results must be shown only after the poll closes |
| <code>members_only</code> | 可选 | <code>boolean</code> | Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only |
| <code>country_codes</code> | 可选 | <code>string[]</code> | A list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use “FT” as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll. |
| <code>correct_option_ids</code> | 可选 | <code>number[]</code> | A list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode |
| <code>explanation</code> | 可选 | <code>string</code> | Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing |
| <code>explanation_parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the explanation. See formatting options for more details. |
| <code>explanation_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode |
| <code>explanation_media</code> | 可选 | <code>InputPollMedia&lt;F&gt;</code> | Media added to the quiz explanation |
| <code>description</code> | 可选 | <code>string</code> | Description of the poll to be sent, 0-1024 characters after entities parsing |
| <code>description_parse_mode</code> | 可选 | <code>string</code> | Mode for parsing entities in the poll description. See formatting options for more details. |
| <code>description_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the poll description, which can be specified instead of description_parse_mode |
| <code>media</code> | 可选 | <code>InputPollMedia&lt;F&gt;</code> | Media added to the poll description |
| <code>open_period</code> | 可选 | <code>number</code> | Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date. |
| <code>close_date</code> | 可选 | <code>number</code> | Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period. |
| <code>is_closed</code> | 可选 | <code>boolean</code> | Pass True if the poll needs to be immediately closed. This can be useful for poll preview. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendchecklist" aria-hidden="true"></span>
::: details sendChecklist · 8 个字段

**Telegram 文档:** [sendChecklist](https://core.telegram.org/bots/api#sendchecklist)

Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendChecklist'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendChecklist'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot in the format &#96;@username&#96; |
| <code>checklist</code> | 必填 | <code>InputChecklist</code> | An object for the checklist to send |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | An object for description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editmessagechecklist" aria-hidden="true"></span>
::: details editMessageChecklist · 5 个字段

**Telegram 文档:** [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist)

Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.

- 参数: `TelegramMethodArguments<'editMessageChecklist'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageChecklist'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot in the format &#96;@username&#96; |
| <code>message_id</code> | 必填 | <code>number</code> | Unique identifier for the target message |
| <code>checklist</code> | 必填 | <code>InputChecklist</code> | An object for the new checklist |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for the new inline keyboard for the message |

:::

<span id="senddice" aria-hidden="true"></span>
::: details sendDice · 13 个字段

**Telegram 文档:** [sendDice](https://core.telegram.org/bots/api#senddice)

Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendDice'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendDice'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>emoji</code> | 可选 | <code>(string &amp; Record&lt;never, never&gt;) &#124; "🎲" &#124; "🎯" &#124; "🏀" &#124; "⚽" &#124; "🎳" &#124; "🎰"</code> | Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲". |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendmessagedraft" aria-hidden="true"></span>
::: details sendMessageDraft · 8 个字段

**Telegram 文档:** [sendMessageDraft](https://core.telegram.org/bots/api#sendmessagedraft)

Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.

- 参数: `TelegramMethodArguments<'sendMessageDraft'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendMessageDraft'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number</code> | Unique identifier for the target private chat |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread |
| <code>draft_id</code> | 必填 | <code>number</code> | Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. |
| <code>text</code> | 可选 | <code>string</code> | Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a “Thinking…” placeholder. |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message text. See formatting options for more details. |
| <code>entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in message text, which can be specified instead of parse_mode |
| <code>can_stop</code> | 可选 | <code>boolean</code> | Pass True to show the user a button to stop further drafts. The bot will receive an Update “stopped_message_generation” if the user presses the button. |
| <code>keep_on_stop</code> | 可选 | <code>boolean</code> | Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. |

:::

<span id="sendrichmessagedraft" aria-hidden="true"></span>
::: details sendRichMessageDraft · 6 个字段

**Telegram 文档:** [sendRichMessageDraft](https://core.telegram.org/bots/api#sendrichmessagedraft)

Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.

- 参数: `TelegramMethodArguments<'sendRichMessageDraft'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendRichMessageDraft'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number</code> | Unique identifier for the target private chat |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread |
| <code>draft_id</code> | 必填 | <code>number</code> | Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. |
| <code>rich_message</code> | 必填 | <code>InputRichMessage&lt;never&gt;</code> | The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported. |
| <code>can_stop</code> | 可选 | <code>boolean</code> | Pass True to show the user a button to stop further drafts. The bot will receive an Update “stopped_message_generation” if the user presses the button. |
| <code>keep_on_stop</code> | 可选 | <code>boolean</code> | Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. |

:::

<span id="sendchataction" aria-hidden="true"></span>
::: details sendChatAction · 4 个字段

**Telegram 文档:** [sendChatAction](https://core.telegram.org/bots/api#sendchataction)

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success. Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of "Retrieving image, please wait...", the bot may use sendChatAction with action = upload_photo. The user will see a "sending photo" status for the bot. We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.

- 参数: `TelegramMethodArguments<'sendChatAction'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendChatAction'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the action will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot or supergroup in the format &#96;@username&#96;. Channel chats and channel direct messages chats aren't supported. |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only |
| <code>action</code> | 必填 | <code>"typing" &#124; "upload_photo" &#124; "record_video" &#124; "upload_video" &#124; "record_voice" &#124; "upload_voice" &#124; "upload_document" &#124; "choose_sticker" &#124; "find_location" &#124; "record_video_note" &#124; "upload_video_note"</code> | Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes. |

:::

<span id="setmessagereaction" aria-hidden="true"></span>
::: details setMessageReaction · 4 个字段

**Telegram 文档:** [setMessageReaction](https://core.telegram.org/bots/api#setmessagereaction)

Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.

- 参数: `TelegramMethodArguments<'setMessageReaction'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMessageReaction'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel (in the format &#96;@channelusername&#96;) |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of the target message |
| <code>reaction</code> | 可选 | <code>ReactionType[]</code> | A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots. |
| <code>is_big</code> | 可选 | <code>boolean</code> | Pass True to set the reaction with a big animation |

:::

<span id="sendchatjoinrequestwebapp" aria-hidden="true"></span>
::: details sendChatJoinRequestWebApp · 2 个字段

**Telegram 文档:** [sendChatJoinRequestWebApp](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp)

Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Returns True on success.

- 参数: `TelegramMethodArguments<'sendChatJoinRequestWebApp'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendChatJoinRequestWebApp'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_join_request_query_id</code> | 必填 | <code>string</code> | Unique identifier of the join request query |
| <code>web_app_url</code> | 必填 | <code>string</code> | An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps |

:::

<span id="editmessagetext" aria-hidden="true"></span>
::: details editMessageText · 10 个字段

**Telegram 文档:** [editMessageText](https://core.telegram.org/bots/api#editmessagetext)

Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.

- 参数: `TelegramMethodArguments<'editMessageText'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageText'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message to edit. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| <code>text</code> | 可选 | <code>string</code> | New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message text. See formatting options for more details. |
| <code>entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in message text, which can be specified instead of parse_mode |
| <code>link_preview_options</code> | 可选 | <code>LinkPreviewOptions</code> | Link preview generation options for the message |
| <code>rich_message</code> | 可选 | <code>InputRichMessage&lt;F&gt;</code> | New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited. |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editmessagecaption" aria-hidden="true"></span>
::: details editMessageCaption · 9 个字段

**Telegram 文档:** [editMessageCaption](https://core.telegram.org/bots/api#editmessagecaption)

Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.

- 参数: `TelegramMethodArguments<'editMessageCaption'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageCaption'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message to edit. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| <code>caption</code> | 可选 | <code>string</code> | New caption of the message, 0-1024 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editmessagemedia" aria-hidden="true"></span>
::: details editMessageMedia · 6 个字段

**Telegram 文档:** [editMessageMedia](https://core.telegram.org/bots/api#editmessagemedia)

Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.

- 参数: `TelegramMethodArguments<'editMessageMedia'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageMedia'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message to edit. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| <code>media</code> | 必填 | <code>InputMedia&lt;F&gt;</code> | An object for a new media content of the message |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for a new inline keyboard |

:::

<span id="editmessagereplymarkup" aria-hidden="true"></span>
::: details editMessageReplyMarkup · 5 个字段

**Telegram 文档:** [editMessageReplyMarkup](https://core.telegram.org/bots/api#editmessagereplymarkup)

Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.

- 参数: `TelegramMethodArguments<'editMessageReplyMarkup'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editMessageReplyMarkup'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message to edit |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard. |

:::

<span id="deletemessage" aria-hidden="true"></span>
::: details deleteMessage · 2 个字段

**Telegram 文档:** [deleteMessage](https://core.telegram.org/bots/api#deletemessage)

Use this method to delete a message, including service messages, with the following limitations: - A message can only be deleted if it was sent less than 48 hours ago. - Service messages about a supergroup, channel, or forum topic creation can't be deleted. - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago. - Bots can delete outgoing messages in private chats, groups, and supergroups. - Bots can delete incoming messages in private chats. - Bots granted can_post_messages permissions can delete outgoing messages in channels. - If the bot is an administrator of a group, it can delete any message there. - If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there. - If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of the message to delete |

:::

<span id="deletemessages" aria-hidden="true"></span>
::: details deleteMessages · 2 个字段

**Telegram 文档:** [deleteMessages](https://core.telegram.org/bots/api#deletemessages)

Use this method to delete multiple messages simultaneously. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_ids</code> | 必填 | <code>number[]</code> | A list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted |

:::

<span id="deletemessagereaction" aria-hidden="true"></span>
::: details deleteMessageReaction · 4 个字段

**Telegram 文档:** [deleteMessageReaction](https://core.telegram.org/bots/api#deletemessagereaction)

Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteMessageReaction'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteMessageReaction'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of the target message |
| <code>user_id</code> | 可选 | <code>number</code> | Identifier of the user whose reaction will be removed, if the reaction was added by a user |
| <code>actor_chat_id</code> | 可选 | <code>number</code> | Identifier of the chat whose reaction will be removed, if the reaction was added by a chat |

:::

<span id="sendsticker" aria-hidden="true"></span>
::: details sendSticker · 15 个字段

**Telegram 文档:** [sendSticker](https://core.telegram.org/bots/api#sendsticker)

Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendSticker'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendSticker'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>ephemeral_message_parameters</code> | 可选 | <code>EphemeralMessageParameters</code> | An object containing the parameters of the ephemeral message to send |
| <code>sticker</code> | 必填 | <code>F &#124; string</code> | Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. Video and animated stickers can't be sent via an HTTP URL. |
| <code>emoji</code> | 可选 | <code>string</code> | Emoji associated with the sticker; only for just uploaded stickers |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup &#124; ReplyKeyboardMarkup &#124; ReplyKeyboardRemove &#124; ForceReply</code> | Additional interface options. An object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendgift" aria-hidden="true"></span>
::: details sendGift · 7 个字段

**Telegram 文档:** [sendGift](https://core.telegram.org/bots/api#sendgift)

Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.

- 参数: `TelegramMethodArguments<'sendGift'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendGift'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 可选 | <code>number</code> | Required if chat_id is not specified. Unique identifier of the target user who will receive the gift. |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if user_id is not specified. Unique identifier for the chat or username of the channel (in the format &#96;@username&#96;) that will receive the gift. |
| <code>gift_id</code> | 必填 | <code>string</code> | Identifier of the gift |
| <code>pay_for_upgrade</code> | 可选 | <code>boolean</code> | Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver |
| <code>text</code> | 可选 | <code>string</code> | Text that will be shown along with the gift; 0-128 characters |
| <code>text_parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the text. See formatting options for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored. |
| <code>text_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored. |

:::

<span id="sendinvoice" aria-hidden="true"></span>
::: details sendInvoice · 32 个字段

**Telegram 文档:** [sendInvoice](https://core.telegram.org/bots/api#sendinvoice)

Use this method to send invoices. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendInvoice'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendInvoice'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>direct_messages_topic_id</code> | 可选 | <code>number</code> | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| <code>title</code> | 必填 | <code>string</code> | Product name, 1-32 characters |
| <code>description</code> | 必填 | <code>string</code> | Product description, 1-255 characters |
| <code>payload</code> | 必填 | <code>string</code> | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| <code>provider_token</code> | 可选 | <code>string</code> | Payment provider token, obtained via BotFather. Pass an empty string for payments in Telegram Stars. |
| <code>currency</code> | 必填 | <code>string</code> | Three-letter ISO 4217 currency code, see more on currencies. Pass “XTR” for payments in Telegram Stars. |
| <code>prices</code> | 必填 | <code>readonly LabeledPrice[]</code> | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. |
| <code>max_tip_amount</code> | 可选 | <code>number</code> | The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. |
| <code>suggested_tip_amounts</code> | 可选 | <code>number[]</code> | An Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. |
| <code>start_parameter</code> | 可选 | <code>string</code> | Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter. |
| <code>provider_data</code> | 可选 | <code>string</code> | Data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| <code>photo_url</code> | 可选 | <code>string</code> | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. |
| <code>photo_size</code> | 可选 | <code>number</code> | Photo size in bytes |
| <code>photo_width</code> | 可选 | <code>number</code> | Photo width |
| <code>photo_height</code> | 可选 | <code>number</code> | Photo height |
| <code>need_name</code> | 可选 | <code>boolean</code> | Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. |
| <code>need_phone_number</code> | 可选 | <code>boolean</code> | Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. |
| <code>need_email</code> | 可选 | <code>boolean</code> | Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. |
| <code>need_shipping_address</code> | 可选 | <code>boolean</code> | Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. |
| <code>send_phone_number_to_provider</code> | 可选 | <code>boolean</code> | Pass True if the user's phone number should be sent to provider. Ignored for payments in Telegram Stars. |
| <code>send_email_to_provider</code> | 可选 | <code>boolean</code> | Pass True if the user's email address should be sent to provider. Ignored for payments in Telegram Stars. |
| <code>is_flexible</code> | 可选 | <code>boolean</code> | Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. |
| <code>suggested_post_parameters</code> | 可选 | <code>SuggestedPostParameters</code> | An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

<span id="sendgame" aria-hidden="true"></span>
::: details sendGame · 11 个字段

**Telegram 文档:** [sendGame](https://core.telegram.org/bots/api#sendgame)

Use this method to send a game. On success, the sent Message is returned.

- 参数: `TelegramMethodArguments<'sendGame'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'sendGame'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot in the format &#96;@username&#96;. Games can't be sent to channel direct messages chats and channel chats. |
| <code>message_thread_id</code> | 可选 | <code>number</code> | Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only |
| <code>game_short_name</code> | 必填 | <code>string</code> | Short name of the game, serves as the unique identifier for the game. Set up your games via BotFather. |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Sends the message silently. Users will receive a notification with no sound. |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Protects the contents of the sent message from forwarding and saving |
| <code>allow_paid_broadcast</code> | 可选 | <code>boolean</code> | Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. |
| <code>message_effect_id</code> | 可选 | <code>string</code> | Unique identifier of the message effect to be added to the message; for private chats only |
| <code>reply_parameters</code> | 可选 | <code>ReplyParameters</code> | Description of the message to reply to |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game. |
| <code>reply_to_message_id</code> | 可选 | <code>number</code> | @deprecated Use &#96;reply_parameters&#96; instead. |

:::

## 聊天、成员与管理

- [banChatMember](#banchatmember)
- [unbanChatMember](#unbanchatmember)
- [restrictChatMember](#restrictchatmember)
- [promoteChatMember](#promotechatmember)
- [setChatAdministratorCustomTitle](#setchatadministratorcustomtitle)
- [setChatMemberTag](#setchatmembertag)
- [banChatSenderChat](#banchatsenderchat)
- [unbanChatSenderChat](#unbanchatsenderchat)
- [setChatPermissions](#setchatpermissions)
- [exportChatInviteLink](#exportchatinvitelink)
- [createChatInviteLink](#createchatinvitelink)
- [editChatInviteLink](#editchatinvitelink)
- [createChatSubscriptionInviteLink](#createchatsubscriptioninvitelink)
- [editChatSubscriptionInviteLink](#editchatsubscriptioninvitelink)
- [revokeChatInviteLink](#revokechatinvitelink)
- [approveChatJoinRequest](#approvechatjoinrequest)
- [declineChatJoinRequest](#declinechatjoinrequest)
- [answerChatJoinRequestQuery](#answerchatjoinrequestquery)
- [approveSuggestedPost](#approvesuggestedpost)
- [declineSuggestedPost](#declinesuggestedpost)
- [setChatPhoto](#setchatphoto)
- [deleteChatPhoto](#deletechatphoto)
- [setChatTitle](#setchattitle)
- [setChatDescription](#setchatdescription)
- [pinChatMessage](#pinchatmessage)
- [unpinChatMessage](#unpinchatmessage)
- [unpinAllChatMessages](#unpinallchatmessages)
- [leaveChat](#leavechat)
- [getChat](#getchat)
- [getChatAdministrators](#getchatadministrators)
- [getChatMemberCount](#getchatmembercount)
- [getChatMember](#getchatmember)
- [getUserPersonalChatMessages](#getuserpersonalchatmessages)
- [setChatStickerSet](#setchatstickerset)
- [deleteChatStickerSet](#deletechatstickerset)
- [getUserChatBoosts](#getuserchatboosts)
- [getChatGifts](#getchatgifts)
- [setChatMenuButton](#setchatmenubutton)
- [getChatMenuButton](#getchatmenubutton)
- [verifyChat](#verifychat)
- [removeChatVerification](#removechatverification)

<span id="banchatmember" aria-hidden="true"></span>
::: details banChatMember · 4 个字段

**Telegram 文档:** [banChatMember](https://core.telegram.org/bots/api#banchatmember)

Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'banChatMember'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'banChatMember'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target group or username of the target supergroup or channel in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>until_date</code> | 可选 | <code>number</code> | Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. |
| <code>revoke_messages</code> | 可选 | <code>boolean</code> | Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels. |

:::

<span id="unbanchatmember" aria-hidden="true"></span>
::: details unbanChatMember · 3 个字段

**Telegram 文档:** [unbanChatMember](https://core.telegram.org/bots/api#unbanchatmember)

Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.

- 参数: `TelegramMethodArguments<'unbanChatMember'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unbanChatMember'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target group or username of the target supergroup or channel in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>only_if_banned</code> | 可选 | <code>boolean</code> | Do nothing if the user is not banned |

:::

<span id="restrictchatmember" aria-hidden="true"></span>
::: details restrictChatMember · 5 个字段

**Telegram 文档:** [restrictChatMember](https://core.telegram.org/bots/api#restrictchatmember)

Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.

- 参数: `TelegramMethodArguments<'restrictChatMember'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'restrictChatMember'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>permissions</code> | 必填 | <code>ChatPermissions</code> | An object for new user permissions |
| <code>use_independent_chat_permissions</code> | 可选 | <code>boolean</code> | Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. |
| <code>until_date</code> | 可选 | <code>number</code> | Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever. |

:::

<span id="promotechatmember" aria-hidden="true"></span>
::: details promoteChatMember · 20 个字段

**Telegram 文档:** [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember)

Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.

- 参数: `TelegramMethodArguments<'promoteChatMember'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'promoteChatMember'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>is_anonymous</code> | 可选 | <code>boolean</code> | Pass True if the administrator's presence in the chat is hidden |
| <code>can_manage_chat</code> | 可选 | <code>boolean</code> | Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. |
| <code>can_delete_messages</code> | 可选 | <code>boolean</code> | Pass True if the administrator can delete messages of other users |
| <code>can_manage_video_chats</code> | 可选 | <code>boolean</code> | Pass True if the administrator can manage video chats |
| <code>can_restrict_members</code> | 可选 | <code>boolean</code> | Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators. |
| <code>can_promote_members</code> | 可选 | <code>boolean</code> | Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him) |
| <code>can_change_info</code> | 可选 | <code>boolean</code> | Pass True if the administrator can change chat title, photo and other settings |
| <code>can_invite_users</code> | 可选 | <code>boolean</code> | Pass True if the administrator can invite new users to the chat |
| <code>can_manage_tags</code> | 可选 | <code>boolean</code> | Pass True if the administrator can edit the tags of regular members; for groups and supergroups only |
| <code>can_post_stories</code> | 可选 | <code>boolean</code> | True if the administrator can post stories to the chat |
| <code>can_edit_stories</code> | 可选 | <code>boolean</code> | Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive |
| <code>can_delete_stories</code> | 可选 | <code>boolean</code> | True if the administrator can delete stories posted by other users |
| <code>can_post_messages</code> | 可选 | <code>boolean</code> | Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only |
| <code>can_edit_messages</code> | 可选 | <code>boolean</code> | True if the administrator can edit messages of other users and can pin messages; for channels only |
| <code>can_pin_messages</code> | 可选 | <code>boolean</code> | True if the administrator can pin messages; for supergroups only |
| <code>can_manage_topics</code> | 可选 | <code>boolean</code> | True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only |
| <code>can_manage_direct_messages</code> | 可选 | <code>boolean</code> | Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only |
| <code>can_send_welcome_messages</code> | 可选 | <code>boolean</code> | Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots |

:::

<span id="setchatadministratorcustomtitle" aria-hidden="true"></span>
::: details setChatAdministratorCustomTitle · 3 个字段

**Telegram 文档:** [setChatAdministratorCustomTitle](https://core.telegram.org/bots/api#setchatadministratorcustomtitle)

Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatAdministratorCustomTitle'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatAdministratorCustomTitle'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>custom_title</code> | 必填 | <code>string</code> | New custom title for the administrator; 0-16 characters, emoji are not allowed |

:::

<span id="setchatmembertag" aria-hidden="true"></span>
::: details setChatMemberTag · 3 个字段

**Telegram 文档:** [setChatMemberTag](https://core.telegram.org/bots/api#setchatmembertag)

Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the “can_manage_tags” administrator right. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatMemberTag'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatMemberTag'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>tag</code> | 可选 | <code>string</code> | New tag for the member; 0-16 characters, emoji are not allowed |

:::

<span id="banchatsenderchat" aria-hidden="true"></span>
::: details banChatSenderChat · 2 个字段

**Telegram 文档:** [banChatSenderChat](https://core.telegram.org/bots/api#banchatsenderchat)

Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'banChatSenderChat'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'banChatSenderChat'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>sender_chat_id</code> | 必填 | <code>number</code> | Unique identifier of the target sender chat |

:::

<span id="unbanchatsenderchat" aria-hidden="true"></span>
::: details unbanChatSenderChat · 2 个字段

**Telegram 文档:** [unbanChatSenderChat](https://core.telegram.org/bots/api#unbanchatsenderchat)

Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'unbanChatSenderChat'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unbanChatSenderChat'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>sender_chat_id</code> | 必填 | <code>number</code> | Unique identifier of the target sender chat |

:::

<span id="setchatpermissions" aria-hidden="true"></span>
::: details setChatPermissions · 3 个字段

**Telegram 文档:** [setChatPermissions](https://core.telegram.org/bots/api#setchatpermissions)

Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatPermissions'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatPermissions'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>permissions</code> | 必填 | <code>ChatPermissions</code> | An object for new default chat permissions |
| <code>use_independent_chat_permissions</code> | 可选 | <code>boolean</code> | Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. |

:::

<span id="exportchatinvitelink" aria-hidden="true"></span>
::: details exportChatInviteLink · 1 个字段

**Telegram 文档:** [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink)

Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success. Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink or by calling the getChat method. If your bot needs to generate a new primary invite link replacing its previous one, use exportChatInviteLink again.

- 参数: `TelegramMethodArguments<'exportChatInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'exportChatInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |

:::

<span id="createchatinvitelink" aria-hidden="true"></span>
::: details createChatInviteLink · 5 个字段

**Telegram 文档:** [createChatInviteLink](https://core.telegram.org/bots/api#createchatinvitelink)

Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.

- 参数: `TelegramMethodArguments<'createChatInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'createChatInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>name</code> | 可选 | <code>string</code> | Invite link name; 0-32 characters |
| <code>expire_date</code> | 可选 | <code>number</code> | Point in time (Unix timestamp) when the link will expire |
| <code>member_limit</code> | 可选 | <code>number</code> | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 |
| <code>creates_join_request</code> | 可选 | <code>boolean</code> | True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. |

:::

<span id="editchatinvitelink" aria-hidden="true"></span>
::: details editChatInviteLink · 6 个字段

**Telegram 文档:** [editChatInviteLink](https://core.telegram.org/bots/api#editchatinvitelink)

Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.

- 参数: `TelegramMethodArguments<'editChatInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editChatInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>invite_link</code> | 必填 | <code>string</code> | The invite link to edit |
| <code>name</code> | 可选 | <code>string</code> | Invite link name; 0-32 characters |
| <code>expire_date</code> | 可选 | <code>number</code> | Point in time (Unix timestamp) when the link will expire |
| <code>member_limit</code> | 可选 | <code>number</code> | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 |
| <code>creates_join_request</code> | 可选 | <code>boolean</code> | True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. |

:::

<span id="createchatsubscriptioninvitelink" aria-hidden="true"></span>
::: details createChatSubscriptionInviteLink · 4 个字段

**Telegram 文档:** [createChatSubscriptionInviteLink](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink)

Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.

- 参数: `TelegramMethodArguments<'createChatSubscriptionInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'createChatSubscriptionInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target channel chat or username of the target channel in the format &#96;@username&#96; |
| <code>name</code> | 可选 | <code>string</code> | Invite link name; 0-32 characters |
| <code>subscription_period</code> | 必填 | <code>number</code> | The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days). |
| <code>subscription_price</code> | 必填 | <code>number</code> | The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-2500 |

:::

<span id="editchatsubscriptioninvitelink" aria-hidden="true"></span>
::: details editChatSubscriptionInviteLink · 3 个字段

**Telegram 文档:** [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink)

Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.

- 参数: `TelegramMethodArguments<'editChatSubscriptionInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editChatSubscriptionInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>invite_link</code> | 必填 | <code>string</code> | The invite link to edit |
| <code>name</code> | 可选 | <code>string</code> | Invite link name; 0-32 characters |

:::

<span id="revokechatinvitelink" aria-hidden="true"></span>
::: details revokeChatInviteLink · 2 个字段

**Telegram 文档:** [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink)

Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.

- 参数: `TelegramMethodArguments<'revokeChatInviteLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'revokeChatInviteLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier of the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>invite_link</code> | 必填 | <code>string</code> | The invite link to revoke |

:::

<span id="approvechatjoinrequest" aria-hidden="true"></span>
::: details approveChatJoinRequest · 2 个字段

**Telegram 文档:** [approveChatJoinRequest](https://core.telegram.org/bots/api#approvechatjoinrequest)

Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.

- 参数: `TelegramMethodArguments<'approveChatJoinRequest'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'approveChatJoinRequest'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |

:::

<span id="declinechatjoinrequest" aria-hidden="true"></span>
::: details declineChatJoinRequest · 2 个字段

**Telegram 文档:** [declineChatJoinRequest](https://core.telegram.org/bots/api#declinechatjoinrequest)

Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.

- 参数: `TelegramMethodArguments<'declineChatJoinRequest'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'declineChatJoinRequest'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |

:::

<span id="answerchatjoinrequestquery" aria-hidden="true"></span>
::: details answerChatJoinRequestQuery · 2 个字段

**Telegram 文档:** [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery)

Use this method to process a received chat join request query. Returns True on success.

- 参数: `TelegramMethodArguments<'answerChatJoinRequestQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerChatJoinRequestQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_join_request_query_id</code> | 必填 | <code>string</code> | Unique identifier of the join request query |
| <code>result</code> | 必填 | <code>"approve" &#124; "decline" &#124; "queue"</code> | Result of the query. Must be either “approve” to allow the user to join the chat, “decline” to disallow the user to join the chat, or “queue” to leave the decision to other administrators. |

:::

<span id="approvesuggestedpost" aria-hidden="true"></span>
::: details approveSuggestedPost · 3 个字段

**Telegram 文档:** [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost)

Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.

- 参数: `TelegramMethodArguments<'approveSuggestedPost'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'approveSuggestedPost'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number</code> | Unique identifier for the target direct messages chat |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of a suggested post message to approve |
| <code>send_date</code> | 可选 | <code>number</code> | Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future. |

:::

<span id="declinesuggestedpost" aria-hidden="true"></span>
::: details declineSuggestedPost · 3 个字段

**Telegram 文档:** [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost)

Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.

- 参数: `TelegramMethodArguments<'declineSuggestedPost'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'declineSuggestedPost'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number</code> | Unique identifier for the target direct messages chat |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of a suggested post message to decline |
| <code>comment</code> | 可选 | <code>string</code> | Comment for the creator of the suggested post; 0-128 characters |

:::

<span id="setchatphoto" aria-hidden="true"></span>
::: details setChatPhoto · 2 个字段

**Telegram 文档:** [setChatPhoto](https://core.telegram.org/bots/api#setchatphoto)

Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatPhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatPhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>photo</code> | 必填 | <code>F</code> | New chat photo, uploaded using multipart/form-data |

:::

<span id="deletechatphoto" aria-hidden="true"></span>
::: details deleteChatPhoto · 1 个字段

**Telegram 文档:** [deleteChatPhoto](https://core.telegram.org/bots/api#deletechatphoto)

Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteChatPhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteChatPhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |

:::

<span id="setchattitle" aria-hidden="true"></span>
::: details setChatTitle · 2 个字段

**Telegram 文档:** [setChatTitle](https://core.telegram.org/bots/api#setchattitle)

Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatTitle'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatTitle'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>title</code> | 必填 | <code>string</code> | New chat title, 1-128 characters |

:::

<span id="setchatdescription" aria-hidden="true"></span>
::: details setChatDescription · 2 个字段

**Telegram 文档:** [setChatDescription](https://core.telegram.org/bots/api#setchatdescription)

Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatDescription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatDescription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>description</code> | 可选 | <code>string</code> | New chat description, 0-255 characters |

:::

<span id="pinchatmessage" aria-hidden="true"></span>
::: details pinChatMessage · 4 个字段

**Telegram 文档:** [pinChatMessage](https://core.telegram.org/bots/api#pinchatmessage)

Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.

- 参数: `TelegramMethodArguments<'pinChatMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'pinChatMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be pinned |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of a message to pin |
| <code>disable_notification</code> | 可选 | <code>boolean</code> | Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. |

:::

<span id="unpinchatmessage" aria-hidden="true"></span>
::: details unpinChatMessage · 3 个字段

**Telegram 文档:** [unpinChatMessage](https://core.telegram.org/bots/api#unpinchatmessage)

Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.

- 参数: `TelegramMethodArguments<'unpinChatMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unpinChatMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message will be unpinned |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>message_id</code> | 可选 | <code>number</code> | Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned. |

:::

<span id="unpinallchatmessages" aria-hidden="true"></span>
::: details unpinAllChatMessages · 1 个字段

**Telegram 文档:** [unpinAllChatMessages](https://core.telegram.org/bots/api#unpinallchatmessages)

Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.

- 参数: `TelegramMethodArguments<'unpinAllChatMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unpinAllChatMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |

:::

<span id="leavechat" aria-hidden="true"></span>
::: details leaveChat · 1 个字段

**Telegram 文档:** [leaveChat](https://core.telegram.org/bots/api#leavechat)

Use this method for your bot to leave a group, supergroup or channel. Returns True on success.

- 参数: `TelegramMethodArguments<'leaveChat'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'leaveChat'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup or channel in the format &#96;@username&#96;. Channel direct messages chats aren't supported; leave the corresponding channel instead. |

:::

<span id="getchat" aria-hidden="true"></span>
::: details getChat · 1 个字段

**Telegram 文档:** [getChat](https://core.telegram.org/bots/api#getchat)

Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.

- 参数: `TelegramMethodArguments<'getChat'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChat'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup or channel in the format &#96;@username&#96; |

:::

<span id="getchatadministrators" aria-hidden="true"></span>
::: details getChatAdministrators · 2 个字段

**Telegram 文档:** [getChatAdministrators](https://core.telegram.org/bots/api#getchatadministrators)

Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.

- 参数: `TelegramMethodArguments<'getChatAdministrators'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChatAdministrators'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup or channel in the format &#96;@username&#96; |
| <code>return_bots</code> | 可选 | <code>boolean</code> | Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted. |

:::

<span id="getchatmembercount" aria-hidden="true"></span>
::: details getChatMemberCount · 1 个字段

**Telegram 文档:** [getChatMemberCount](https://core.telegram.org/bots/api#getchatmembercount)

Use this method to get the number of members in a chat. Returns Integer on success.

- 参数: `TelegramMethodArguments<'getChatMemberCount'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChatMemberCount'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup or channel in the format &#96;@username&#96; |

:::

<span id="getchatmember" aria-hidden="true"></span>
::: details getChatMember · 2 个字段

**Telegram 文档:** [getChatMember](https://core.telegram.org/bots/api#getchatmember)

Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.

- 参数: `TelegramMethodArguments<'getChatMember'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChatMember'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup or channel (in the format &#96;@channelusername&#96;) |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |

:::

<span id="getuserpersonalchatmessages" aria-hidden="true"></span>
::: details getUserPersonalChatMessages · 2 个字段

**Telegram 文档:** [getUserPersonalChatMessages](https://core.telegram.org/bots/api#getuserpersonalchatmessages)

Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.

- 参数: `TelegramMethodArguments<'getUserPersonalChatMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getUserPersonalChatMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier for the target user |
| <code>limit</code> | 必填 | <code>number</code> | The maximum number of messages to return; 1-20 |

:::

<span id="setchatstickerset" aria-hidden="true"></span>
::: details setChatStickerSet · 2 个字段

**Telegram 文档:** [setChatStickerSet](https://core.telegram.org/bots/api#setchatstickerset)

Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatStickerSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatStickerSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>sticker_set_name</code> | 必填 | <code>string</code> | Name of the sticker set to be set as the group sticker set |

:::

<span id="deletechatstickerset" aria-hidden="true"></span>
::: details deleteChatStickerSet · 1 个字段

**Telegram 文档:** [deleteChatStickerSet](https://core.telegram.org/bots/api#deletechatstickerset)

Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteChatStickerSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteChatStickerSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="getuserchatboosts" aria-hidden="true"></span>
::: details getUserChatBoosts · 2 个字段

**Telegram 文档:** [getUserChatBoosts](https://core.telegram.org/bots/api#getuserchatboosts)

Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.

- 参数: `TelegramMethodArguments<'getUserChatBoosts'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getUserChatBoosts'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the chat or username of the channel (in the format &#96;@channelusername&#96;) |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |

:::

<span id="getchatgifts" aria-hidden="true"></span>
::: details getChatGifts · 11 个字段

**Telegram 文档:** [getChatGifts](https://core.telegram.org/bots/api#getchatgifts)

Returns the gifts owned by a chat. Returns OwnedGifts on success.

- 参数: `TelegramMethodArguments<'getChatGifts'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChatGifts'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target channel in the format &#96;@username&#96; |
| <code>exclude_unsaved</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel. |
| <code>exclude_saved</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel. |
| <code>exclude_unlimited</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased an unlimited number of times |
| <code>exclude_limited_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique |
| <code>exclude_limited_non_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique |
| <code>exclude_from_blockchain</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram |
| <code>exclude_unique</code> | 可选 | <code>boolean</code> | Pass True to exclude unique gifts |
| <code>sort_by_price</code> | 可选 | <code>boolean</code> | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| <code>offset</code> | 可选 | <code>string</code> | Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results |
| <code>limit</code> | 可选 | <code>number</code> | The maximum number of gifts to be returned; 1-100. Defaults to 100. |

:::

<span id="setchatmenubutton" aria-hidden="true"></span>
::: details setChatMenuButton · 2 个字段

**Telegram 文档:** [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton)

Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.

- 参数: `TelegramMethodArguments<'setChatMenuButton'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setChatMenuButton'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 可选 | <code>number</code> | Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed. |
| <code>menu_button</code> | 可选 | <code>MenuButton</code> | An object for the bot's new menu button. Defaults to MenuButtonDefault. |

:::

<span id="getchatmenubutton" aria-hidden="true"></span>
::: details getChatMenuButton · 1 个字段

**Telegram 文档:** [getChatMenuButton](https://core.telegram.org/bots/api#getchatmenubutton)

Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.

- 参数: `TelegramMethodArguments<'getChatMenuButton'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getChatMenuButton'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 可选 | <code>number</code> | Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned. |

:::

<span id="verifychat" aria-hidden="true"></span>
::: details verifyChat · 2 个字段

**Telegram 文档:** [verifyChat](https://core.telegram.org/bots/api#verifychat)

Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'verifyChat'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'verifyChat'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96;. Channel direct messages chats can't be verified. |
| <code>custom_description</code> | 可选 | <code>string</code> | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |

:::

<span id="removechatverification" aria-hidden="true"></span>
::: details removeChatVerification · 1 个字段

**Telegram 文档:** [removeChatVerification](https://core.telegram.org/bots/api#removechatverification)

Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'removeChatVerification'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'removeChatVerification'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot or channel in the format &#96;@username&#96; |

:::

## 论坛、话题与贴纸

- [createForumTopic](#createforumtopic)
- [editForumTopic](#editforumtopic)
- [closeForumTopic](#closeforumtopic)
- [reopenForumTopic](#reopenforumtopic)
- [deleteForumTopic](#deleteforumtopic)
- [unpinAllForumTopicMessages](#unpinallforumtopicmessages)
- [editGeneralForumTopic](#editgeneralforumtopic)
- [closeGeneralForumTopic](#closegeneralforumtopic)
- [reopenGeneralForumTopic](#reopengeneralforumtopic)
- [hideGeneralForumTopic](#hidegeneralforumtopic)
- [unhideGeneralForumTopic](#unhidegeneralforumtopic)
- [unpinAllGeneralForumTopicMessages](#unpinallgeneralforumtopicmessages)
- [getStickerSet](#getstickerset)
- [getCustomEmojiStickers](#getcustomemojistickers)
- [uploadStickerFile](#uploadstickerfile)
- [createNewStickerSet](#createnewstickerset)
- [addStickerToSet](#addstickertoset)
- [setStickerPositionInSet](#setstickerpositioninset)
- [deleteStickerFromSet](#deletestickerfromset)
- [replaceStickerInSet](#replacestickerinset)
- [setStickerEmojiList](#setstickeremojilist)
- [setStickerKeywords](#setstickerkeywords)
- [setStickerMaskPosition](#setstickermaskposition)
- [setStickerSetTitle](#setstickersettitle)
- [deleteStickerSet](#deletestickerset)
- [setStickerSetThumbnail](#setstickersetthumbnail)
- [setCustomEmojiStickerSetThumbnail](#setcustomemojistickersetthumbnail)
- [getForumTopicIconStickers](#getforumtopiciconstickers)

<span id="createforumtopic" aria-hidden="true"></span>
::: details createForumTopic · 4 个字段

**Telegram 文档:** [createForumTopic](https://core.telegram.org/bots/api#createforumtopic)

Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. Returns information about the created topic as a ForumTopic object.

- 参数: `TelegramMethodArguments<'createForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'createForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>name</code> | 必填 | <code>string</code> | Topic name, 1-128 characters |
| <code>icon_color</code> | 可选 | <code>0x6FB9F0 &#124; 0xFFD67E &#124; 0xCB86DB &#124; 0x8EEE98 &#124; 0xFF93B2 &#124; 0xFB6F5F</code> | Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F). |
| <code>icon_custom_emoji_id</code> | 可选 | <code>string</code> | Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. |

:::

<span id="editforumtopic" aria-hidden="true"></span>
::: details editForumTopic · 4 个字段

**Telegram 文档:** [editForumTopic](https://core.telegram.org/bots/api#editforumtopic)

Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.

- 参数: `TelegramMethodArguments<'editForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 必填 | <code>number</code> | Unique identifier for the target message thread of the forum topic |
| <code>name</code> | 可选 | <code>string</code> | New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept. |
| <code>icon_custom_emoji_id</code> | 可选 | <code>string</code> | New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept. |

:::

<span id="closeforumtopic" aria-hidden="true"></span>
::: details closeForumTopic · 2 个字段

**Telegram 文档:** [closeForumTopic](https://core.telegram.org/bots/api#closeforumtopic)

Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.

- 参数: `TelegramMethodArguments<'closeForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'closeForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 必填 | <code>number</code> | Unique identifier for the target message thread of the forum topic |

:::

<span id="reopenforumtopic" aria-hidden="true"></span>
::: details reopenForumTopic · 2 个字段

**Telegram 文档:** [reopenForumTopic](https://core.telegram.org/bots/api#reopenforumtopic)

Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.

- 参数: `TelegramMethodArguments<'reopenForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'reopenForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 必填 | <code>number</code> | Unique identifier for the target message thread of the forum topic |

:::

<span id="deleteforumtopic" aria-hidden="true"></span>
::: details deleteForumTopic · 2 个字段

**Telegram 文档:** [deleteForumTopic](https://core.telegram.org/bots/api#deleteforumtopic)

Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 必填 | <code>number</code> | Unique identifier for the target message thread of the forum topic |

:::

<span id="unpinallforumtopicmessages" aria-hidden="true"></span>
::: details unpinAllForumTopicMessages · 2 个字段

**Telegram 文档:** [unpinAllForumTopicMessages](https://core.telegram.org/bots/api#unpinallforumtopicmessages)

Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.

- 参数: `TelegramMethodArguments<'unpinAllForumTopicMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unpinAllForumTopicMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>message_thread_id</code> | 必填 | <code>number</code> | Unique identifier for the target message thread of the forum topic |

:::

<span id="editgeneralforumtopic" aria-hidden="true"></span>
::: details editGeneralForumTopic · 2 个字段

**Telegram 文档:** [editGeneralForumTopic](https://core.telegram.org/bots/api#editgeneralforumtopic)

Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'editGeneralForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editGeneralForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>name</code> | 必填 | <code>string</code> | New topic name, 1-128 characters |

:::

<span id="closegeneralforumtopic" aria-hidden="true"></span>
::: details closeGeneralForumTopic · 1 个字段

**Telegram 文档:** [closeGeneralForumTopic](https://core.telegram.org/bots/api#closegeneralforumtopic)

Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'closeGeneralForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'closeGeneralForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="reopengeneralforumtopic" aria-hidden="true"></span>
::: details reopenGeneralForumTopic · 1 个字段

**Telegram 文档:** [reopenGeneralForumTopic](https://core.telegram.org/bots/api#reopengeneralforumtopic)

Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.

- 参数: `TelegramMethodArguments<'reopenGeneralForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'reopenGeneralForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="hidegeneralforumtopic" aria-hidden="true"></span>
::: details hideGeneralForumTopic · 1 个字段

**Telegram 文档:** [hideGeneralForumTopic](https://core.telegram.org/bots/api#hidegeneralforumtopic)

Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.

- 参数: `TelegramMethodArguments<'hideGeneralForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'hideGeneralForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="unhidegeneralforumtopic" aria-hidden="true"></span>
::: details unhideGeneralForumTopic · 1 个字段

**Telegram 文档:** [unhideGeneralForumTopic](https://core.telegram.org/bots/api#unhidegeneralforumtopic)

Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.

- 参数: `TelegramMethodArguments<'unhideGeneralForumTopic'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unhideGeneralForumTopic'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="unpinallgeneralforumtopicmessages" aria-hidden="true"></span>
::: details unpinAllGeneralForumTopicMessages · 1 个字段

**Telegram 文档:** [unpinAllGeneralForumTopicMessages](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages)

Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.

- 参数: `TelegramMethodArguments<'unpinAllGeneralForumTopicMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'unpinAllGeneralForumTopicMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |

:::

<span id="getstickerset" aria-hidden="true"></span>
::: details getStickerSet · 1 个字段

**Telegram 文档:** [getStickerSet](https://core.telegram.org/bots/api#getstickerset)

Use this method to get a sticker set. On success, a StickerSet object is returned.

- 参数: `TelegramMethodArguments<'getStickerSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getStickerSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 必填 | <code>string</code> | Name of the sticker set |

:::

<span id="getcustomemojistickers" aria-hidden="true"></span>
::: details getCustomEmojiStickers · 1 个字段

**Telegram 文档:** [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers)

Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.

- 参数: `TelegramMethodArguments<'getCustomEmojiStickers'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getCustomEmojiStickers'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>custom_emoji_ids</code> | 必填 | <code>string[]</code> | A list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified. |

:::

<span id="uploadstickerfile" aria-hidden="true"></span>
::: details uploadStickerFile · 3 个字段

**Telegram 文档:** [uploadStickerFile](https://core.telegram.org/bots/api#uploadstickerfile)

Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.

- 参数: `TelegramMethodArguments<'uploadStickerFile'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'uploadStickerFile'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of sticker file owner |
| <code>sticker_format</code> | 必填 | <code>"static" &#124; "animated" &#124; "video"</code> | Format of the sticker, must be one of “static”, “animated”, “video” |
| <code>sticker</code> | 必填 | <code>F</code> | A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. |

:::

<span id="createnewstickerset" aria-hidden="true"></span>
::: details createNewStickerSet · 6 个字段

**Telegram 文档:** [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset)

Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.

- 参数: `TelegramMethodArguments<'createNewStickerSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'createNewStickerSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of created sticker set owner |
| <code>name</code> | 必填 | <code>string</code> | Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_\&lt;bot_username&gt;". \&lt;bot_username&gt; is case insensitive. 1-64 characters. |
| <code>title</code> | 必填 | <code>string</code> | Sticker set title, 1-64 characters |
| <code>stickers</code> | 必填 | <code>InputSticker&lt;F&gt;[]</code> | A list of 1-50 initial stickers to be added to the sticker set |
| <code>sticker_type</code> | 可选 | <code>"regular" &#124; "mask" &#124; "custom_emoji"</code> | Type of stickers in the set, pass “regular”, “mask”, or “custom_emoji”. By default, a regular sticker set is created. |
| <code>needs_repainting</code> | 可选 | <code>boolean</code> | Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only |

:::

<span id="addstickertoset" aria-hidden="true"></span>
::: details addStickerToSet · 3 个字段

**Telegram 文档:** [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset)

Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.

- 参数: `TelegramMethodArguments<'addStickerToSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'addStickerToSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of sticker set owner |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |
| <code>sticker</code> | 必填 | <code>InputSticker&lt;F&gt;</code> | An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed. |

:::

<span id="setstickerpositioninset" aria-hidden="true"></span>
::: details setStickerPositionInSet · 2 个字段

**Telegram 文档:** [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset)

Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerPositionInSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerPositionInSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>sticker</code> | 必填 | <code>string</code> | File identifier of the sticker |
| <code>position</code> | 必填 | <code>number</code> | New sticker position in the set, zero-based |

:::

<span id="deletestickerfromset" aria-hidden="true"></span>
::: details deleteStickerFromSet · 1 个字段

**Telegram 文档:** [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset)

Use this method to delete a sticker from a set created by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteStickerFromSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteStickerFromSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>sticker</code> | 必填 | <code>string</code> | File identifier of the sticker |

:::

<span id="replacestickerinset" aria-hidden="true"></span>
::: details replaceStickerInSet · 4 个字段

**Telegram 文档:** [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset)

Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.

- 参数: `TelegramMethodArguments<'replaceStickerInSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'replaceStickerInSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the sticker set owner |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |
| <code>old_sticker</code> | 必填 | <code>string</code> | File identifier of the replaced sticker |
| <code>sticker</code> | 必填 | <code>InputSticker&lt;F&gt;</code> | An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.:x |

:::

<span id="setstickeremojilist" aria-hidden="true"></span>
::: details setStickerEmojiList · 2 个字段

**Telegram 文档:** [setStickerEmojiList](https://core.telegram.org/bots/api#setstickeremojilist)

Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerEmojiList'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerEmojiList'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>sticker</code> | 必填 | <code>string</code> | File identifier of the sticker |
| <code>emoji_list</code> | 必填 | <code>string[]</code> | A list of 1-20 emoji associated with the sticker |

:::

<span id="setstickerkeywords" aria-hidden="true"></span>
::: details setStickerKeywords · 2 个字段

**Telegram 文档:** [setStickerKeywords](https://core.telegram.org/bots/api#setstickerkeywords)

Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerKeywords'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerKeywords'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>sticker</code> | 必填 | <code>string</code> | File identifier of the sticker |
| <code>keywords</code> | 可选 | <code>string[]</code> | A list of 0-20 search keywords for the sticker with total length of up to 64 characters |

:::

<span id="setstickermaskposition" aria-hidden="true"></span>
::: details setStickerMaskPosition · 2 个字段

**Telegram 文档:** [setStickerMaskPosition](https://core.telegram.org/bots/api#setstickermaskposition)

Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerMaskPosition'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerMaskPosition'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>sticker</code> | 必填 | <code>string</code> | File identifier of the sticker |
| <code>mask_position</code> | 可选 | <code>MaskPosition</code> | An object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position. |

:::

<span id="setstickersettitle" aria-hidden="true"></span>
::: details setStickerSetTitle · 2 个字段

**Telegram 文档:** [setStickerSetTitle](https://core.telegram.org/bots/api#setstickersettitle)

Use this method to set the title of a created sticker set. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerSetTitle'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerSetTitle'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |
| <code>title</code> | 必填 | <code>string</code> | Sticker set title, 1-64 characters |

:::

<span id="deletestickerset" aria-hidden="true"></span>
::: details deleteStickerSet · 1 个字段

**Telegram 文档:** [deleteStickerSet](https://core.telegram.org/bots/api#deletestickerset)

Use this method to delete a sticker set that was created by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteStickerSet'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteStickerSet'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |

:::

<span id="setstickersetthumbnail" aria-hidden="true"></span>
::: details setStickerSetThumbnail · 4 个字段

**Telegram 文档:** [setStickerSetThumbnail](https://core.telegram.org/bots/api#setstickersetthumbnail)

Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.

- 参数: `TelegramMethodArguments<'setStickerSetThumbnail'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setStickerSetThumbnail'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the sticker set owner |
| <code>thumbnail</code> | 可选 | <code>F &#124; string</code> | A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail. |
| <code>format</code> | 必填 | <code>"static" &#124; "animated" &#124; "video"</code> | Format of the thumbnail, must be one of “static” for a .WEBP or .PNG image, “animated” for a .TGS animation, or “video” for a .WEBM video |

:::

<span id="setcustomemojistickersetthumbnail" aria-hidden="true"></span>
::: details setCustomEmojiStickerSetThumbnail · 2 个字段

**Telegram 文档:** [setCustomEmojiStickerSetThumbnail](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail)

Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.

- 参数: `TelegramMethodArguments<'setCustomEmojiStickerSetThumbnail'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setCustomEmojiStickerSetThumbnail'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 必填 | <code>string</code> | Sticker set name |
| <code>custom_emoji_id</code> | 可选 | <code>string</code> | Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail |

:::

<span id="getforumtopiciconstickers" aria-hidden="true"></span>
::: details getForumTopicIconStickers · 此方法没有 payload 参数。

**Telegram 文档:** [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers)

Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.

- 参数: `TelegramMethodArguments<'getForumTopicIconStickers'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'getForumTopicIconStickers'>>`

此方法没有 payload 参数。

:::

## Inline 查询、Web App 与访客更新

- [answerGuestQuery](#answerguestquery)
- [answerInlineQuery](#answerinlinequery)
- [answerWebAppQuery](#answerwebappquery)
- [savePreparedInlineMessage](#savepreparedinlinemessage)
- [savePreparedKeyboardButton](#savepreparedkeyboardbutton)

<span id="answerguestquery" aria-hidden="true"></span>
::: details answerGuestQuery · 2 个字段

**Telegram 文档:** [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery)

Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.

- 参数: `TelegramMethodArguments<'answerGuestQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerGuestQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>guest_query_id</code> | 必填 | <code>string</code> | Unique identifier for the query to be answered |
| <code>result</code> | 必填 | <code>InlineQueryResult</code> | An object describing the message to be sent |

:::

<span id="answerinlinequery" aria-hidden="true"></span>
::: details answerInlineQuery · 6 个字段

**Telegram 文档:** [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)

Use this method to send answers to an inline query. On success, True is returned. No more than 50 results per query are allowed. Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.

- 参数: `TelegramMethodArguments<'answerInlineQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerInlineQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>inline_query_id</code> | 必填 | <code>string</code> | Unique identifier for the answered query |
| <code>results</code> | 必填 | <code>readonly InlineQueryResult[]</code> | An Array of results for the inline query |
| <code>cache_time</code> | 可选 | <code>number</code> | The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. |
| <code>is_personal</code> | 可选 | <code>boolean</code> | Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query. |
| <code>next_offset</code> | 可选 | <code>string</code> | Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. |
| <code>button</code> | 可选 | <code>InlineQueryResultsButton</code> | An object describing a button to be shown above inline query results |

:::

<span id="answerwebappquery" aria-hidden="true"></span>
::: details answerWebAppQuery · 2 个字段

**Telegram 文档:** [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery)

Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.

- 参数: `TelegramMethodArguments<'answerWebAppQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerWebAppQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>web_app_query_id</code> | 必填 | <code>string</code> | Unique identifier for the query to be answered |
| <code>result</code> | 必填 | <code>InlineQueryResult</code> | An object describing the message to be sent |

:::

<span id="savepreparedinlinemessage" aria-hidden="true"></span>
::: details savePreparedInlineMessage · 6 个字段

**Telegram 文档:** [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage)

Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.

- 参数: `TelegramMethodArguments<'savePreparedInlineMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'savePreparedInlineMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user that can use the prepared message |
| <code>result</code> | 必填 | <code>InlineQueryResult</code> | An object describing the message to be sent |
| <code>allow_user_chats</code> | 可选 | <code>boolean</code> | Pass True if the message can be sent to private chats with users |
| <code>allow_bot_chats</code> | 可选 | <code>boolean</code> | Pass True if the message can be sent to private chats with bots |
| <code>allow_group_chats</code> | 可选 | <code>boolean</code> | Pass True if the message can be sent to group and supergroup chats |
| <code>allow_channel_chats</code> | 可选 | <code>boolean</code> | Pass True if the message can be sent to channel chats |

:::

<span id="savepreparedkeyboardbutton" aria-hidden="true"></span>
::: details savePreparedKeyboardButton · 2 个字段

**Telegram 文档:** [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)

Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.

- 参数: `TelegramMethodArguments<'savePreparedKeyboardButton'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'savePreparedKeyboardButton'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user that can use the button |
| <code>button</code> | 必填 | <code>KeyboardButton.RequestUsersButton &#124; KeyboardButton.RequestChatButton &#124; KeyboardButton.RequestManagedBotButton</code> | An object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot. |

:::

## Business 与临时消息

- [getBusinessConnection](#getbusinessconnection)
- [editEphemeralMessageText](#editephemeralmessagetext)
- [editEphemeralMessageMedia](#editephemeralmessagemedia)
- [editEphemeralMessageCaption](#editephemeralmessagecaption)
- [editEphemeralMessageReplyMarkup](#editephemeralmessagereplymarkup)
- [deleteEphemeralMessage](#deleteephemeralmessage)
- [deleteBusinessMessages](#deletebusinessmessages)
- [setBusinessAccountName](#setbusinessaccountname)
- [setBusinessAccountUsername](#setbusinessaccountusername)
- [setBusinessAccountBio](#setbusinessaccountbio)
- [setBusinessAccountProfilePhoto](#setbusinessaccountprofilephoto)
- [removeBusinessAccountProfilePhoto](#removebusinessaccountprofilephoto)
- [setBusinessAccountGiftSettings](#setbusinessaccountgiftsettings)
- [getBusinessAccountStarBalance](#getbusinessaccountstarbalance)
- [transferBusinessAccountStars](#transferbusinessaccountstars)
- [getBusinessAccountGifts](#getbusinessaccountgifts)
- [readBusinessMessage](#readbusinessmessage)

<span id="getbusinessconnection" aria-hidden="true"></span>
::: details getBusinessConnection · 1 个字段

**Telegram 文档:** [getBusinessConnection](https://core.telegram.org/bots/api#getbusinessconnection)

Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.

- 参数: `TelegramMethodArguments<'getBusinessConnection'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getBusinessConnection'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |

:::

<span id="editephemeralmessagetext" aria-hidden="true"></span>
::: details editEphemeralMessageText · 9 个字段

**Telegram 文档:** [editEphemeralMessageText](https://core.telegram.org/bots/api#editephemeralmessagetext)

Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.

- 参数: `TelegramMethodArguments<'editEphemeralMessageText'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageText'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>receiver_user_id</code> | 必填 | <code>number</code> | Identifier of the user who received the message |
| <code>ephemeral_message_id</code> | 必填 | <code>number</code> | Identifier of the ephemeral message to edit |
| <code>text</code> | 可选 | <code>string</code> | New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message text. See formatting options for more details. |
| <code>entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in message text, which can be specified instead of parse_mode |
| <code>link_preview_options</code> | 可选 | <code>LinkPreviewOptions</code> | Link preview generation options for the message |
| <code>rich_message</code> | 可选 | <code>InputRichMessage&lt;F&gt;</code> | New rich content of the message; required if text isn't specified |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editephemeralmessagemedia" aria-hidden="true"></span>
::: details editEphemeralMessageMedia · 5 个字段

**Telegram 文档:** [editEphemeralMessageMedia](https://core.telegram.org/bots/api#editephemeralmessagemedia)

Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.

- 参数: `TelegramMethodArguments<'editEphemeralMessageMedia'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageMedia'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>receiver_user_id</code> | 必填 | <code>number</code> | Identifier of the user who received the message |
| <code>ephemeral_message_id</code> | 必填 | <code>number</code> | Identifier of the ephemeral message to edit |
| <code>media</code> | 必填 | <code>InputMedia&lt;F&gt;</code> | An object for the new media content of the message |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editephemeralmessagecaption" aria-hidden="true"></span>
::: details editEphemeralMessageCaption · 8 个字段

**Telegram 文档:** [editEphemeralMessageCaption](https://core.telegram.org/bots/api#editephemeralmessagecaption)

Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.

- 参数: `TelegramMethodArguments<'editEphemeralMessageCaption'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageCaption'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>receiver_user_id</code> | 必填 | <code>number</code> | Identifier of the user who received the message |
| <code>ephemeral_message_id</code> | 必填 | <code>number</code> | Identifier of the ephemeral message to edit |
| <code>caption</code> | 可选 | <code>string</code> | New caption of the message, 0-1024 characters after entities parsing |
| <code>show_caption_above_media</code> | 可选 | <code>boolean</code> | Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the message caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="editephemeralmessagereplymarkup" aria-hidden="true"></span>
::: details editEphemeralMessageReplyMarkup · 4 个字段

**Telegram 文档:** [editEphemeralMessageReplyMarkup](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup)

Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.

- 参数: `TelegramMethodArguments<'editEphemeralMessageReplyMarkup'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageReplyMarkup'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>receiver_user_id</code> | 必填 | <code>number</code> | Identifier of the user who received the message |
| <code>ephemeral_message_id</code> | 必填 | <code>number</code> | Identifier of the ephemeral message to edit |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for an inline keyboard |

:::

<span id="deleteephemeralmessage" aria-hidden="true"></span>
::: details deleteEphemeralMessage · 3 个字段

**Telegram 文档:** [deleteEphemeralMessage](https://core.telegram.org/bots/api#deleteephemeralmessage)

Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteEphemeralMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteEphemeralMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>receiver_user_id</code> | 必填 | <code>number</code> | Identifier of the user who received the message |
| <code>ephemeral_message_id</code> | 必填 | <code>number</code> | Identifier of the ephemeral message to delete |

:::

<span id="deletebusinessmessages" aria-hidden="true"></span>
::: details deleteBusinessMessages · 2 个字段

**Telegram 文档:** [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages)

Delete messages on behalf of a business account. Requires the can_delete_outgoing_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteBusinessMessages'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteBusinessMessages'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection on behalf of which to delete the messages |
| <code>message_ids</code> | 必填 | <code>number[]</code> | A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted. |

:::

<span id="setbusinessaccountname" aria-hidden="true"></span>
::: details setBusinessAccountName · 3 个字段

**Telegram 文档:** [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname)

Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'setBusinessAccountName'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountName'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>first_name</code> | 必填 | <code>string</code> | The new value of the first name for the business account; 1-64 characters |
| <code>last_name</code> | 可选 | <code>string</code> | The new value of the last name for the business account; 0-64 characters |

:::

<span id="setbusinessaccountusername" aria-hidden="true"></span>
::: details setBusinessAccountUsername · 2 个字段

**Telegram 文档:** [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername)

Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'setBusinessAccountUsername'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountUsername'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>username</code> | 可选 | <code>string</code> | The new value of the username for the business account; 0-32 characters |

:::

<span id="setbusinessaccountbio" aria-hidden="true"></span>
::: details setBusinessAccountBio · 2 个字段

**Telegram 文档:** [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio)

Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'setBusinessAccountBio'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountBio'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>bio</code> | 可选 | <code>string</code> | The new value of the bio for the business account; 0-140 characters |

:::

<span id="setbusinessaccountprofilephoto" aria-hidden="true"></span>
::: details setBusinessAccountProfilePhoto · 3 个字段

**Telegram 文档:** [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto)

Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'setBusinessAccountProfilePhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountProfilePhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>photo</code> | 必填 | <code>InputProfilePhoto&lt;F&gt;</code> | The new profile photo to set |
| <code>is_public</code> | 可选 | <code>boolean</code> | Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo. |

:::

<span id="removebusinessaccountprofilephoto" aria-hidden="true"></span>
::: details removeBusinessAccountProfilePhoto · 2 个字段

**Telegram 文档:** [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto)

Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'removeBusinessAccountProfilePhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'removeBusinessAccountProfilePhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>is_public</code> | 可选 | <code>boolean</code> | Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo. |

:::

<span id="setbusinessaccountgiftsettings" aria-hidden="true"></span>
::: details setBusinessAccountGiftSettings · 3 个字段

**Telegram 文档:** [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings)

Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'setBusinessAccountGiftSettings'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountGiftSettings'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>show_gift_button</code> | 必填 | <code>boolean</code> | Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field |
| <code>accepted_gift_types</code> | 必填 | <code>AcceptedGiftTypes</code> | Types of gifts accepted by the business account |

:::

<span id="getbusinessaccountstarbalance" aria-hidden="true"></span>
::: details getBusinessAccountStarBalance · 1 个字段

**Telegram 文档:** [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance)

Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.

- 参数: `TelegramMethodArguments<'getBusinessAccountStarBalance'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getBusinessAccountStarBalance'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |

:::

<span id="transferbusinessaccountstars" aria-hidden="true"></span>
::: details transferBusinessAccountStars · 2 个字段

**Telegram 文档:** [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars)

Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'transferBusinessAccountStars'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'transferBusinessAccountStars'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>star_count</code> | 必填 | <code>number</code> | Number of Telegram Stars to transfer; 1-10000 |

:::

<span id="getbusinessaccountgifts" aria-hidden="true"></span>
::: details getBusinessAccountGifts · 11 个字段

**Telegram 文档:** [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts)

Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.

- 参数: `TelegramMethodArguments<'getBusinessAccountGifts'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getBusinessAccountGifts'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>exclude_unsaved</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that aren't saved to the account's profile page |
| <code>exclude_saved</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that are saved to the account's profile page |
| <code>exclude_unlimited</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased an unlimited number of times |
| <code>exclude_limited_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique |
| <code>exclude_limited_non_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique |
| <code>exclude_from_blockchain</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram |
| <code>exclude_unique</code> | 可选 | <code>boolean</code> | Pass True to exclude unique gifts |
| <code>sort_by_price</code> | 可选 | <code>boolean</code> | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| <code>offset</code> | 可选 | <code>string</code> | Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results |
| <code>limit</code> | 可选 | <code>number</code> | The maximum number of gifts to be returned; 1-100. Defaults to 100. |

:::

<span id="readbusinessmessage" aria-hidden="true"></span>
::: details readBusinessMessage · 3 个字段

**Telegram 文档:** [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage)

Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'readBusinessMessage'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'readBusinessMessage'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection on behalf of which to read the message |
| <code>chat_id</code> | 必填 | <code>number</code> | Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours. |
| <code>message_id</code> | 必填 | <code>number</code> | Unique identifier of the message to mark as read |

:::

## 支付、Stars 与礼物

- [getUserGifts](#getusergifts)
- [convertGiftToStars](#convertgifttostars)
- [upgradeGift](#upgradegift)
- [transferGift](#transfergift)
- [giftPremiumSubscription](#giftpremiumsubscription)
- [createInvoiceLink](#createinvoicelink)
- [answerShippingQuery](#answershippingquery)
- [answerPreCheckoutQuery](#answerprecheckoutquery)
- [getStarTransactions](#getstartransactions)
- [refundStarPayment](#refundstarpayment)
- [editUserStarSubscription](#edituserstarsubscription)
- [getMyStarBalance](#getmystarbalance)
- [getAvailableGifts](#getavailablegifts)

<span id="getusergifts" aria-hidden="true"></span>
::: details getUserGifts · 9 个字段

**Telegram 文档:** [getUserGifts](https://core.telegram.org/bots/api#getusergifts)

Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.

- 参数: `TelegramMethodArguments<'getUserGifts'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getUserGifts'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the user |
| <code>exclude_unlimited</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased an unlimited number of times |
| <code>exclude_limited_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique |
| <code>exclude_limited_non_upgradable</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique |
| <code>exclude_from_blockchain</code> | 可选 | <code>boolean</code> | Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram |
| <code>exclude_unique</code> | 可选 | <code>boolean</code> | Pass True to exclude unique gifts |
| <code>sort_by_price</code> | 可选 | <code>boolean</code> | Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. |
| <code>offset</code> | 可选 | <code>string</code> | Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results |
| <code>limit</code> | 可选 | <code>number</code> | The maximum number of gifts to be returned; 1-100. Defaults to 100. |

:::

<span id="convertgifttostars" aria-hidden="true"></span>
::: details convertGiftToStars · 2 个字段

**Telegram 文档:** [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars)

Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'convertGiftToStars'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'convertGiftToStars'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>owned_gift_id</code> | 必填 | <code>string</code> | Unique identifier of the regular gift that should be converted to Telegram Stars |

:::

<span id="upgradegift" aria-hidden="true"></span>
::: details upgradeGift · 4 个字段

**Telegram 文档:** [upgradeGift](https://core.telegram.org/bots/api#upgradegift)

Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.

- 参数: `TelegramMethodArguments<'upgradeGift'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'upgradeGift'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>owned_gift_id</code> | 必填 | <code>string</code> | Unique identifier of the regular gift that should be upgraded to a unique one |
| <code>keep_original_details</code> | 可选 | <code>boolean</code> | Pass True to keep the original gift text, sender and receiver in the upgraded gift |
| <code>star_count</code> | 可选 | <code>number</code> | The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count &gt; 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed. |

:::

<span id="transfergift" aria-hidden="true"></span>
::: details transferGift · 4 个字段

**Telegram 文档:** [transferGift](https://core.telegram.org/bots/api#transfergift)

Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.

- 参数: `TelegramMethodArguments<'transferGift'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'transferGift'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>owned_gift_id</code> | 必填 | <code>string</code> | Unique identifier of the regular gift that should be transferred |
| <code>new_owner_chat_id</code> | 必填 | <code>number</code> | Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours. |
| <code>star_count</code> | 必填 | <code>number</code> | The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required. |

:::

<span id="giftpremiumsubscription" aria-hidden="true"></span>
::: details giftPremiumSubscription · 6 个字段

**Telegram 文档:** [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription)

Gifts a Telegram Premium subscription to the given user. Returns True on success.

- 参数: `TelegramMethodArguments<'giftPremiumSubscription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'giftPremiumSubscription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user who will receive a Telegram Premium subscription |
| <code>month_count</code> | 必填 | <code>3 &#124; 6 &#124; 12</code> | Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12 |
| <code>star_count</code> | 必填 | <code>1000 &#124; 1500 &#124; 2500</code> | Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months |
| <code>text</code> | 可选 | <code>string</code> | Text that will be shown along with the service message about the subscription; 0-128 characters |
| <code>text_parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the text. See formatting options for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored. |
| <code>text_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored. |

:::

<span id="createinvoicelink" aria-hidden="true"></span>
::: details createInvoiceLink · 22 个字段

**Telegram 文档:** [createInvoiceLink](https://core.telegram.org/bots/api#createinvoicelink)

Use this method to create a link for an invoice. Returns the created invoice link as String on success.

- 参数: `TelegramMethodArguments<'createInvoiceLink'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'createInvoiceLink'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the link will be created |
| <code>title</code> | 必填 | <code>string</code> | Product name, 1-32 characters |
| <code>description</code> | 必填 | <code>string</code> | Product description, 1-255 characters |
| <code>payload</code> | 必填 | <code>string</code> | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| <code>provider_token</code> | 可选 | <code>string</code> | Payment provider token, obtained via &#96;@BotFather&#96;. Pass an empty string for payments in Telegram Stars. |
| <code>currency</code> | 必填 | <code>string</code> | Three-letter ISO 4217 currency code, see more on currencies |
| <code>prices</code> | 必填 | <code>LabeledPrice[]</code> | Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.) |
| <code>subscription_period</code> | 可选 | <code>number</code> | The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. |
| <code>max_tip_amount</code> | 可选 | <code>number</code> | The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0 |
| <code>suggested_tip_amounts</code> | 可选 | <code>number[]</code> | An Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. |
| <code>provider_data</code> | 可选 | <code>string</code> | Data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| <code>photo_url</code> | 可选 | <code>string</code> | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. |
| <code>photo_size</code> | 可选 | <code>number</code> | Photo size in bytes |
| <code>photo_width</code> | 可选 | <code>number</code> | Photo width |
| <code>photo_height</code> | 可选 | <code>number</code> | Photo height |
| <code>need_name</code> | 可选 | <code>boolean</code> | Pass True if you require the user's full name to complete the order |
| <code>need_phone_number</code> | 可选 | <code>boolean</code> | Pass True if you require the user's phone number to complete the order |
| <code>need_email</code> | 可选 | <code>boolean</code> | Pass True if you require the user's email address to complete the order |
| <code>need_shipping_address</code> | 可选 | <code>boolean</code> | Pass True if you require the user's shipping address to complete the order |
| <code>send_phone_number_to_provider</code> | 可选 | <code>boolean</code> | Pass True if the user's phone number should be sent to the provider |
| <code>send_email_to_provider</code> | 可选 | <code>boolean</code> | Pass True if the user's email address should be sent to the provider |
| <code>is_flexible</code> | 可选 | <code>boolean</code> | Pass True if the final price depends on the shipping method |

:::

<span id="answershippingquery" aria-hidden="true"></span>
::: details answerShippingQuery · 4 个字段

**Telegram 文档:** [answerShippingQuery](https://core.telegram.org/bots/api#answershippingquery)

If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.

- 参数: `TelegramMethodArguments<'answerShippingQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerShippingQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>shipping_query_id</code> | 必填 | <code>string</code> | Unique identifier for the query to be answered |
| <code>ok</code> | 必填 | <code>boolean</code> | Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible) |
| <code>shipping_options</code> | 可选 | <code>readonly ShippingOption[]</code> | Required if ok is True. An Array of available shipping options. |
| <code>error_message</code> | 可选 | <code>string</code> | Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user. |

:::

<span id="answerprecheckoutquery" aria-hidden="true"></span>
::: details answerPreCheckoutQuery · 3 个字段

**Telegram 文档:** [answerPreCheckoutQuery](https://core.telegram.org/bots/api#answerprecheckoutquery)

Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.

- 参数: `TelegramMethodArguments<'answerPreCheckoutQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerPreCheckoutQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>pre_checkout_query_id</code> | 必填 | <code>string</code> | Unique identifier for the query to be answered |
| <code>ok</code> | 必填 | <code>boolean</code> | Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems. |
| <code>error_message</code> | 可选 | <code>string</code> | Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. |

:::

<span id="getstartransactions" aria-hidden="true"></span>
::: details getStarTransactions · 2 个字段

**Telegram 文档:** [getStarTransactions](https://core.telegram.org/bots/api#getstartransactions)

Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.

- 参数: `TelegramMethodArguments<'getStarTransactions'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getStarTransactions'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>offset</code> | 可选 | <code>number</code> | Number of transactions to skip in the response |
| <code>limit</code> | 可选 | <code>number</code> | The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100. |

:::

<span id="refundstarpayment" aria-hidden="true"></span>
::: details refundStarPayment · 2 个字段

**Telegram 文档:** [refundStarPayment](https://core.telegram.org/bots/api#refundstarpayment)

Refunds a successful payment in Telegram Stars. Returns True on success.

- 参数: `TelegramMethodArguments<'refundStarPayment'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'refundStarPayment'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Identifier of the user whose payment will be refunded |
| <code>telegram_payment_charge_id</code> | 必填 | <code>string</code> | Telegram payment identifier |

:::

<span id="edituserstarsubscription" aria-hidden="true"></span>
::: details editUserStarSubscription · 3 个字段

**Telegram 文档:** [editUserStarSubscription](https://core.telegram.org/bots/api#edituserstarsubscription)

Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.

- 参数: `TelegramMethodArguments<'editUserStarSubscription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editUserStarSubscription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Identifier of the user whose subscription will be edited |
| <code>telegram_payment_charge_id</code> | 必填 | <code>string</code> | Telegram payment identifier for the subscription |
| <code>is_canceled</code> | 必填 | <code>boolean</code> | Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot. |

:::

<span id="getmystarbalance" aria-hidden="true"></span>
::: details getMyStarBalance · 此方法没有 payload 参数。

**Telegram 文档:** [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance)

A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object.

- 参数: `TelegramMethodArguments<'getMyStarBalance'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'getMyStarBalance'>>`

此方法没有 payload 参数。

:::

<span id="getavailablegifts" aria-hidden="true"></span>
::: details getAvailableGifts · 此方法没有 payload 参数。

**Telegram 文档:** [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts)

Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object.

- 参数: `TelegramMethodArguments<'getAvailableGifts'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'getAvailableGifts'>>`

此方法没有 payload 参数。

:::

## 游戏

- [setGameScore](#setgamescore)
- [getGameHighScores](#getgamehighscores)

<span id="setgamescore" aria-hidden="true"></span>
::: details setGameScore · 7 个字段

**Telegram 文档:** [setGameScore](https://core.telegram.org/bots/api#setgamescore)

Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.

- 参数: `TelegramMethodArguments<'setGameScore'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setGameScore'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier |
| <code>score</code> | 必填 | <code>number</code> | New score, must be non-negative |
| <code>force</code> | 可选 | <code>boolean</code> | Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters. |
| <code>disable_edit_message</code> | 可选 | <code>boolean</code> | Pass True if the game message should not be automatically edited to include the current scoreboard |
| <code>chat_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Unique identifier for the target chat. |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the sent message. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |

:::

<span id="getgamehighscores" aria-hidden="true"></span>
::: details getGameHighScores · 4 个字段

**Telegram 文档:** [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores)

Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects. This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.

- 参数: `TelegramMethodArguments<'getGameHighScores'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getGameHighScores'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Target user id |
| <code>chat_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Unique identifier for the target chat. |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the sent message. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |

:::

## 机器人、文件、更新与账户信息

- [getUpdates](#getupdates)
- [setWebhook](#setwebhook)
- [deleteWebhook](#deletewebhook)
- [stopMessageLiveLocation](#stopmessagelivelocation)
- [getUserProfilePhotos](#getuserprofilephotos)
- [getUserProfileAudios](#getuserprofileaudios)
- [setUserEmojiStatus](#setuseremojistatus)
- [getFile](#getfile)
- [answerCallbackQuery](#answercallbackquery)
- [getManagedBotToken](#getmanagedbottoken)
- [replaceManagedBotToken](#replacemanagedbottoken)
- [getManagedBotAccessSettings](#getmanagedbotaccesssettings)
- [setManagedBotAccessSettings](#setmanagedbotaccesssettings)
- [setMyCommands](#setmycommands)
- [deleteMyCommands](#deletemycommands)
- [getMyCommands](#getmycommands)
- [setMyName](#setmyname)
- [getMyName](#getmyname)
- [setMyDescription](#setmydescription)
- [getMyDescription](#getmydescription)
- [setMyShortDescription](#setmyshortdescription)
- [getMyShortDescription](#getmyshortdescription)
- [setMyProfilePhoto](#setmyprofilephoto)
- [setMyDefaultAdministratorRights](#setmydefaultadministratorrights)
- [getMyDefaultAdministratorRights](#getmydefaultadministratorrights)
- [stopPoll](#stoppoll)
- [deleteAllMessageReactions](#deleteallmessagereactions)
- [postStory](#poststory)
- [repostStory](#repoststory)
- [editStory](#editstory)
- [deleteStory](#deletestory)
- [verifyUser](#verifyuser)
- [removeUserVerification](#removeuserverification)
- [setPassportDataErrors](#setpassportdataerrors)
- [getWebhookInfo](#getwebhookinfo)
- [getMe](#getme)
- [logOut](#logout)
- [close](#close)
- [removeMyProfilePhoto](#removemyprofilephoto)

<span id="getupdates" aria-hidden="true"></span>
::: details getUpdates · 4 个字段

**Telegram 文档:** [getUpdates](https://core.telegram.org/bots/api#getupdates)

Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects. Notes 1. This method will not work if an outgoing webhook is set up. 2. In order to avoid getting duplicate updates, recalculate offset after each server response.

- 参数: `TelegramMethodArguments<'getUpdates'>`
- Payload: 可选
- 返回值: `Promise<TelegramMethodResult<'getUpdates'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>offset</code> | 可选 | <code>number</code> | Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten. |
| <code>limit</code> | 可选 | <code>number</code> | Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| <code>timeout</code> | 可选 | <code>number</code> | Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. |
| <code>allowed_updates</code> | 可选 | <code>ReadonlyArray&lt;Exclude&lt;keyof Update, "update_id"&gt;&gt;</code> | A list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time. |

:::

<span id="setwebhook" aria-hidden="true"></span>
::: details setWebhook · 7 个字段

**Telegram 文档:** [setWebhook](https://core.telegram.org/bots/api#setwebhook)

Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success. If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content. Notes 1. You will not be able to receive updates using getUpdates for as long as an outgoing webhook is set up. 2. To use a self-signed certificate, you need to upload your public key certificate using certificate parameter. Please upload as InputFile, sending a String will not work. 3. Ports currently supported for Webhooks: 443, 80, 88, 8443. If you're having any trouble setting up webhooks, please check out this amazing guide to webhooks.

- 参数: `TelegramMethodArguments<'setWebhook'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setWebhook'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>url</code> | 必填 | <code>string</code> | HTTPS URL to send updates to. Use an empty string to remove webhook integration. |
| <code>certificate</code> | 可选 | <code>F</code> | Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details. |
| <code>ip_address</code> | 可选 | <code>string</code> | The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS |
| <code>max_connections</code> | 可选 | <code>number</code> | The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. |
| <code>allowed_updates</code> | 可选 | <code>ReadonlyArray&lt;Exclude&lt;keyof Update, "update_id"&gt;&gt;</code> | A list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time. |
| <code>drop_pending_updates</code> | 可选 | <code>boolean</code> | Pass True to drop all pending updates |
| <code>secret_token</code> | 可选 | <code>string</code> | A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you. |

:::

<span id="deletewebhook" aria-hidden="true"></span>
::: details deleteWebhook · 1 个字段

**Telegram 文档:** [deleteWebhook](https://core.telegram.org/bots/api#deletewebhook)

Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteWebhook'>`
- Payload: 可选
- 返回值: `Promise<TelegramMethodResult<'deleteWebhook'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>drop_pending_updates</code> | 可选 | <code>boolean</code> | Pass True to drop all pending updates |

:::

<span id="stopmessagelivelocation" aria-hidden="true"></span>
::: details stopMessageLiveLocation · 5 个字段

**Telegram 文档:** [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation)

Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.

- 参数: `TelegramMethodArguments<'stopMessageLiveLocation'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'stopMessageLiveLocation'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 可选 | <code>number &#124; string</code> | Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_id</code> | 可选 | <code>number</code> | Required if inline_message_id is not specified. Identifier of the message with live location to stop. |
| <code>inline_message_id</code> | 可选 | <code>string</code> | Required if chat_id and message_id are not specified. Identifier of the inline message. |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for a new inline keyboard |

:::

<span id="getuserprofilephotos" aria-hidden="true"></span>
::: details getUserProfilePhotos · 3 个字段

**Telegram 文档:** [getUserProfilePhotos](https://core.telegram.org/bots/api#getuserprofilephotos)

Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.

- 参数: `TelegramMethodArguments<'getUserProfilePhotos'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getUserProfilePhotos'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>offset</code> | 可选 | <code>number</code> | Sequential number of the first photo to be returned. By default, all photos are returned. |
| <code>limit</code> | 可选 | <code>number</code> | Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. |

:::

<span id="getuserprofileaudios" aria-hidden="true"></span>
::: details getUserProfileAudios · 3 个字段

**Telegram 文档:** [getUserProfileAudios](https://core.telegram.org/bots/api#getuserprofileaudios)

Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.

- 参数: `TelegramMethodArguments<'getUserProfileAudios'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getUserProfileAudios'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>offset</code> | 可选 | <code>number</code> | Sequential number of the first audio to be returned. By default, all audios are returned. |
| <code>limit</code> | 可选 | <code>number</code> | Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100. |

:::

<span id="setuseremojistatus" aria-hidden="true"></span>
::: details setUserEmojiStatus · 3 个字段

**Telegram 文档:** [setUserEmojiStatus](https://core.telegram.org/bots/api#setuseremojistatus)

Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.

- 参数: `TelegramMethodArguments<'setUserEmojiStatus'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setUserEmojiStatus'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>emoji_status_custom_emoji_id</code> | 可选 | <code>string</code> | Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status. |
| <code>emoji_status_expiration_date</code> | 可选 | <code>number</code> | Expiration date of the emoji status, if any |

:::

<span id="getfile" aria-hidden="true"></span>
::: details getFile · 1 个字段

**Telegram 文档:** [getFile](https://core.telegram.org/bots/api#getfile)

Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot&lt;token&gt;/\&lt;file_path&gt;, where \&lt;file_path&gt; is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again. Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.

- 参数: `TelegramMethodArguments<'getFile'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getFile'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>file_id</code> | 必填 | <code>string</code> | File identifier to get information about |

:::

<span id="answercallbackquery" aria-hidden="true"></span>
::: details answerCallbackQuery · 5 个字段

**Telegram 文档:** [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery)

Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned. Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via `@BotFather` and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.

- 参数: `TelegramMethodArguments<'answerCallbackQuery'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'answerCallbackQuery'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>callback_query_id</code> | 必填 | <code>string</code> | Unique identifier for the query to be answered |
| <code>text</code> | 可选 | <code>string</code> | Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters. |
| <code>show_alert</code> | 可选 | <code>boolean</code> | If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False. |
| <code>url</code> | 可选 | <code>string</code> | URL that will be opened by the user's client. If you have created a Game and accepted the conditions via &#96;@BotFather&#96;, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter. |
| <code>cache_time</code> | 可选 | <code>number</code> | The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0. |

:::

<span id="getmanagedbottoken" aria-hidden="true"></span>
::: details getManagedBotToken · 1 个字段

**Telegram 文档:** [getManagedBotToken](https://core.telegram.org/bots/api#getmanagedbottoken)

Use this method to get the token of a managed bot. Returns the token as String on success.

- 参数: `TelegramMethodArguments<'getManagedBotToken'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getManagedBotToken'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the managed bot whose token will be returned |

:::

<span id="replacemanagedbottoken" aria-hidden="true"></span>
::: details replaceManagedBotToken · 1 个字段

**Telegram 文档:** [replaceManagedBotToken](https://core.telegram.org/bots/api#replacemanagedbottoken)

Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.

- 参数: `TelegramMethodArguments<'replaceManagedBotToken'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'replaceManagedBotToken'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the managed bot whose token will be replaced |

:::

<span id="getmanagedbotaccesssettings" aria-hidden="true"></span>
::: details getManagedBotAccessSettings · 1 个字段

**Telegram 文档:** [getManagedBotAccessSettings](https://core.telegram.org/bots/api#getmanagedbotaccesssettings)

Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.

- 参数: `TelegramMethodArguments<'getManagedBotAccessSettings'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getManagedBotAccessSettings'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the managed bot whose access settings will be returned |

:::

<span id="setmanagedbotaccesssettings" aria-hidden="true"></span>
::: details setManagedBotAccessSettings · 3 个字段

**Telegram 文档:** [setManagedBotAccessSettings](https://core.telegram.org/bots/api#setmanagedbotaccesssettings)

Use this method to change the access settings of a managed bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setManagedBotAccessSettings'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setManagedBotAccessSettings'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier of the managed bot whose access settings will be changed |
| <code>is_access_restricted</code> | 必填 | <code>boolean</code> | Pass True if only selected users can access the bot. The bot's owner can always access it. |
| <code>added_user_ids</code> | 可选 | <code>number[]</code> | A list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False. |

:::

<span id="setmycommands" aria-hidden="true"></span>
::: details setMyCommands · 3 个字段

**Telegram 文档:** [setMyCommands](https://core.telegram.org/bots/api#setmycommands)

Use this method to change the list of the bot's commands. See https://core.telegram.org/bots/features#commands for more details about bot commands. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyCommands'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyCommands'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>commands</code> | 必填 | <code>readonly BotCommand[]</code> | A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. |
| <code>scope</code> | 可选 | <code>BotCommandScope</code> | An object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. |

:::

<span id="deletemycommands" aria-hidden="true"></span>
::: details deleteMyCommands · 2 个字段

**Telegram 文档:** [deleteMyCommands](https://core.telegram.org/bots/api#deletemycommands)

Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteMyCommands'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteMyCommands'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>scope</code> | 可选 | <code>BotCommandScope</code> | An object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. |

:::

<span id="getmycommands" aria-hidden="true"></span>
::: details getMyCommands · 2 个字段

**Telegram 文档:** [getMyCommands](https://core.telegram.org/bots/api#getmycommands)

Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.

- 参数: `TelegramMethodArguments<'getMyCommands'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getMyCommands'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>scope</code> | 可选 | <code>BotCommandScope</code> | An object, describing scope of users. Defaults to BotCommandScopeDefault. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code or an empty string |

:::

<span id="setmyname" aria-hidden="true"></span>
::: details setMyName · 2 个字段

**Telegram 文档:** [setMyName](https://core.telegram.org/bots/api#setmyname)

Use this method to change the bot's name. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyName'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyName'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>name</code> | 可选 | <code>string</code> | New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name. |

:::

<span id="getmyname" aria-hidden="true"></span>
::: details getMyName · 1 个字段

**Telegram 文档:** [getMyName](https://core.telegram.org/bots/api#getmyname)

Use this method to get the current bot name for the given user language. Returns BotName on success.

- 参数: `TelegramMethodArguments<'getMyName'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getMyName'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code or an empty string |

:::

<span id="setmydescription" aria-hidden="true"></span>
::: details setMyDescription · 2 个字段

**Telegram 文档:** [setMyDescription](https://core.telegram.org/bots/api#setmydescription)

Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyDescription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyDescription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>description</code> | 可选 | <code>string</code> | New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description. |

:::

<span id="getmydescription" aria-hidden="true"></span>
::: details getMyDescription · 1 个字段

**Telegram 文档:** [getMyDescription](https://core.telegram.org/bots/api#getmydescription)

Use this method to get the current bot description for the given user language. Returns BotDescription on success.

- 参数: `TelegramMethodArguments<'getMyDescription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getMyDescription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code or an empty string |

:::

<span id="setmyshortdescription" aria-hidden="true"></span>
::: details setMyShortDescription · 2 个字段

**Telegram 文档:** [setMyShortDescription](https://core.telegram.org/bots/api#setmyshortdescription)

Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyShortDescription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyShortDescription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>short_description</code> | 可选 | <code>string</code> | New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language. |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description. |

:::

<span id="getmyshortdescription" aria-hidden="true"></span>
::: details getMyShortDescription · 1 个字段

**Telegram 文档:** [getMyShortDescription](https://core.telegram.org/bots/api#getmyshortdescription)

Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.

- 参数: `TelegramMethodArguments<'getMyShortDescription'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getMyShortDescription'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>language_code</code> | 可选 | <code>LanguageCode</code> | A two-letter ISO 639-1 language code or an empty string |

:::

<span id="setmyprofilephoto" aria-hidden="true"></span>
::: details setMyProfilePhoto · 1 个字段

**Telegram 文档:** [setMyProfilePhoto](https://core.telegram.org/bots/api#setmyprofilephoto)

Changes the profile photo of the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyProfilePhoto'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyProfilePhoto'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>photo</code> | 必填 | <code>InputProfilePhoto&lt;F&gt;</code> | The new profile photo to set |

:::

<span id="setmydefaultadministratorrights" aria-hidden="true"></span>
::: details setMyDefaultAdministratorRights · 2 个字段

**Telegram 文档:** [setMyDefaultAdministratorRights](https://core.telegram.org/bots/api#setmydefaultadministratorrights)

Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'setMyDefaultAdministratorRights'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setMyDefaultAdministratorRights'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>rights</code> | 可选 | <code>ChatAdministratorRights</code> | An object describing new default administrator rights. If not specified, the default administrator rights will be cleared. |
| <code>for_channels</code> | 可选 | <code>boolean</code> | Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed. |

:::

<span id="getmydefaultadministratorrights" aria-hidden="true"></span>
::: details getMyDefaultAdministratorRights · 1 个字段

**Telegram 文档:** [getMyDefaultAdministratorRights](https://core.telegram.org/bots/api#getmydefaultadministratorrights)

Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.

- 参数: `TelegramMethodArguments<'getMyDefaultAdministratorRights'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'getMyDefaultAdministratorRights'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>for_channels</code> | 可选 | <code>boolean</code> | Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned. |

:::

<span id="stoppoll" aria-hidden="true"></span>
::: details stopPoll · 4 个字段

**Telegram 文档:** [stopPoll](https://core.telegram.org/bots/api#stoppoll)

Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.

- 参数: `TelegramMethodArguments<'stopPoll'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'stopPoll'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 可选 | <code>string</code> | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target bot, supergroup or channel in the format &#96;@username&#96; |
| <code>message_id</code> | 必填 | <code>number</code> | Identifier of the original message with the poll |
| <code>reply_markup</code> | 可选 | <code>InlineKeyboardMarkup</code> | An object for a new message inline keyboard |

:::

<span id="deleteallmessagereactions" aria-hidden="true"></span>
::: details deleteAllMessageReactions · 3 个字段

**Telegram 文档:** [deleteAllMessageReactions](https://core.telegram.org/bots/api#deleteallmessagereactions)

Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteAllMessageReactions'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteAllMessageReactions'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>chat_id</code> | 必填 | <code>number &#124; string</code> | Unique identifier for the target chat or username of the target supergroup in the format &#96;@username&#96; |
| <code>user_id</code> | 可选 | <code>number</code> | Identifier of the user whose reactions will be removed, if the reactions were added by a user |
| <code>actor_chat_id</code> | 可选 | <code>number</code> | Identifier of the chat whose reactions will be removed, if the reactions were added by a chat |

:::

<span id="poststory" aria-hidden="true"></span>
::: details postStory · 9 个字段

**Telegram 文档:** [postStory](https://core.telegram.org/bots/api#poststory)

Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.

- 参数: `TelegramMethodArguments<'postStory'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'postStory'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>content</code> | 必填 | <code>InputStoryContent&lt;F&gt;</code> | Content of the story |
| <code>active_period</code> | 必填 | <code>number</code> | Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400 |
| <code>caption</code> | 可选 | <code>string</code> | Caption of the story, 0-2048 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the story caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>areas</code> | 可选 | <code>StoryArea[]</code> | A list of clickable areas to be shown on the story |
| <code>post_to_chat_page</code> | 可选 | <code>boolean</code> | Pass True to keep the story accessible after it expires |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Pass True if the content of the story must be protected from forwarding and screenshotting |

:::

<span id="repoststory" aria-hidden="true"></span>
::: details repostStory · 6 个字段

**Telegram 文档:** [repostStory](https://core.telegram.org/bots/api#repoststory)

Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.

- 参数: `TelegramMethodArguments<'repostStory'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'repostStory'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>from_chat_id</code> | 必填 | <code>number</code> | Unique identifier of the chat which posted the story that should be reposted |
| <code>from_story_id</code> | 必填 | <code>number</code> | Unique identifier of the story that should be reposted |
| <code>active_period</code> | 必填 | <code>number</code> | Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400 |
| <code>post_to_chat_page</code> | 可选 | <code>boolean</code> | Pass True to keep the story accessible after it expires |
| <code>protect_content</code> | 可选 | <code>boolean</code> | Pass True if the content of the story must be protected from forwarding and screenshotting |

:::

<span id="editstory" aria-hidden="true"></span>
::: details editStory · 7 个字段

**Telegram 文档:** [editStory](https://core.telegram.org/bots/api#editstory)

Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.

- 参数: `TelegramMethodArguments<'editStory'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'editStory'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>story_id</code> | 必填 | <code>number</code> | Unique identifier of the story to edit |
| <code>content</code> | 必填 | <code>InputStoryContent&lt;F&gt;</code> | Content of the story |
| <code>caption</code> | 可选 | <code>string</code> | Caption of the story, 0-2048 characters after entities parsing |
| <code>parse_mode</code> | 可选 | <code>ParseMode</code> | Mode for parsing entities in the story caption. See formatting options for more details. |
| <code>caption_entities</code> | 可选 | <code>MessageEntity[]</code> | A list of special entities that appear in the caption, which can be specified instead of parse_mode |
| <code>areas</code> | 可选 | <code>StoryArea</code> | A list of clickable areas to be shown on the story |

:::

<span id="deletestory" aria-hidden="true"></span>
::: details deleteStory · 2 个字段

**Telegram 文档:** [deleteStory](https://core.telegram.org/bots/api#deletestory)

Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.

- 参数: `TelegramMethodArguments<'deleteStory'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'deleteStory'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>business_connection_id</code> | 必填 | <code>string</code> | Unique identifier of the business connection |
| <code>story_id</code> | 必填 | <code>number</code> | Unique identifier of the story to delete |

:::

<span id="verifyuser" aria-hidden="true"></span>
::: details verifyUser · 2 个字段

**Telegram 文档:** [verifyUser](https://core.telegram.org/bots/api#verifyuser)

Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'verifyUser'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'verifyUser'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |
| <code>custom_description</code> | 可选 | <code>string</code> | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |

:::

<span id="removeuserverification" aria-hidden="true"></span>
::: details removeUserVerification · 1 个字段

**Telegram 文档:** [removeUserVerification](https://core.telegram.org/bots/api#removeuserverification)

Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.

- 参数: `TelegramMethodArguments<'removeUserVerification'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'removeUserVerification'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | Unique identifier of the target user |

:::

<span id="setpassportdataerrors" aria-hidden="true"></span>
::: details setPassportDataErrors · 2 个字段

**Telegram 文档:** [setPassportDataErrors](https://core.telegram.org/bots/api#setpassportdataerrors)

Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success. Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.

- 参数: `TelegramMethodArguments<'setPassportDataErrors'>`
- Payload: 必需
- 返回值: `Promise<TelegramMethodResult<'setPassportDataErrors'>>`

**Payload 参数:**

| 字段 | 状态 | 类型 | 说明 |
| --- | --- | --- | --- |
| <code>user_id</code> | 必填 | <code>number</code> | User identifier |
| <code>errors</code> | 必填 | <code>readonly PassportElementError[]</code> | An Array describing the errors |

:::

<span id="getwebhookinfo" aria-hidden="true"></span>
::: details getWebhookInfo · 此方法没有 payload 参数。

**Telegram 文档:** [getWebhookInfo](https://core.telegram.org/bots/api#getwebhookinfo)

Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.

- 参数: `TelegramMethodArguments<'getWebhookInfo'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'getWebhookInfo'>>`

此方法没有 payload 参数。

:::

<span id="getme" aria-hidden="true"></span>
::: details getMe · 此方法没有 payload 参数。

**Telegram 文档:** [getMe](https://core.telegram.org/bots/api#getme)

A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.

- 参数: `TelegramMethodArguments<'getMe'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'getMe'>>`

此方法没有 payload 参数。

:::

<span id="logout" aria-hidden="true"></span>
::: details logOut · 此方法没有 payload 参数。

**Telegram 文档:** [logOut](https://core.telegram.org/bots/api#logout)

Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.

- 参数: `TelegramMethodArguments<'logOut'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'logOut'>>`

此方法没有 payload 参数。

:::

<span id="close" aria-hidden="true"></span>
::: details close · 此方法没有 payload 参数。

**Telegram 文档:** [close](https://core.telegram.org/bots/api#close)

Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.

- 参数: `TelegramMethodArguments<'close'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'close'>>`

此方法没有 payload 参数。

:::

<span id="removemyprofilephoto" aria-hidden="true"></span>
::: details removeMyProfilePhoto · 此方法没有 payload 参数。

**Telegram 文档:** [removeMyProfilePhoto](https://core.telegram.org/bots/api#removemyprofilephoto)

Removes the profile photo of the bot. Requires no parameters. Returns True on success.

- 参数: `TelegramMethodArguments<'removeMyProfilePhoto'>`
- Payload: 无
- 返回值: `Promise<TelegramMethodResult<'removeMyProfilePhoto'>>`

此方法没有 payload 参数。

:::

## 相关参考

- [Bot API 参考](/zh/reference/api)
- [TypeScript](/zh/reference/typescript)
- [Bot 配置项](/zh/reference/options)
