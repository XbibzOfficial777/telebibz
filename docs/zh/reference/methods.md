---
title: Bot API 方法列表
description: TeleBibz 注册表中的 Bot API 方法。
---

# Bot API 方法列表

TeleBibz 注册表包含 **185 个方法名称**。本页在文档构建时根据源码自动生成。

> 方法名称不代表请求一定可用。实际调用仍受 Telegram 权限、聊天上下文、更新类型和接口限制约束。

## 调用方法

```js
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'Hello' });
await bot.api.getMe();
```

以下索引根据方法注册表和 package 声明生成。每个条目都链接到可由 IDE 检查的参数元组、payload 和返回类型；字段说明与接口限制请查看 Telegram 链接。

## 消息、媒体与互动

- [sendMessage](https://core.telegram.org/bots/api#sendmessage)
- [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage)
- [forwardMessage](https://core.telegram.org/bots/api#forwardmessage)
- [forwardMessages](https://core.telegram.org/bots/api#forwardmessages)
- [copyMessage](https://core.telegram.org/bots/api#copymessage)
- [copyMessages](https://core.telegram.org/bots/api#copymessages)
- [sendPhoto](https://core.telegram.org/bots/api#sendphoto)
- [sendLivePhoto](https://core.telegram.org/bots/api#sendlivephoto)
- [sendAudio](https://core.telegram.org/bots/api#sendaudio)
- [sendDocument](https://core.telegram.org/bots/api#senddocument)
- [sendVideo](https://core.telegram.org/bots/api#sendvideo)
- [sendAnimation](https://core.telegram.org/bots/api#sendanimation)
- [sendVoice](https://core.telegram.org/bots/api#sendvoice)
- [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote)
- [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia)
- [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup)
- [sendLocation](https://core.telegram.org/bots/api#sendlocation)
- [editMessageLiveLocation](https://core.telegram.org/bots/api#editmessagelivelocation)
- [sendVenue](https://core.telegram.org/bots/api#sendvenue)
- [sendContact](https://core.telegram.org/bots/api#sendcontact)
- [sendPoll](https://core.telegram.org/bots/api#sendpoll)
- [sendChecklist](https://core.telegram.org/bots/api#sendchecklist)
- [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist)
- [sendDice](https://core.telegram.org/bots/api#senddice)
- [sendMessageDraft](https://core.telegram.org/bots/api#sendmessagedraft)
- [sendRichMessageDraft](https://core.telegram.org/bots/api#sendrichmessagedraft)
- [sendChatAction](https://core.telegram.org/bots/api#sendchataction)
- [setMessageReaction](https://core.telegram.org/bots/api#setmessagereaction)
- [sendChatJoinRequestWebApp](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp)
- [editMessageText](https://core.telegram.org/bots/api#editmessagetext)
- [editMessageCaption](https://core.telegram.org/bots/api#editmessagecaption)
- [editMessageMedia](https://core.telegram.org/bots/api#editmessagemedia)
- [editMessageReplyMarkup](https://core.telegram.org/bots/api#editmessagereplymarkup)
- [deleteMessage](https://core.telegram.org/bots/api#deletemessage)
- [deleteMessages](https://core.telegram.org/bots/api#deletemessages)
- [deleteMessageReaction](https://core.telegram.org/bots/api#deletemessagereaction)
- [sendSticker](https://core.telegram.org/bots/api#sendsticker)
- [sendGift](https://core.telegram.org/bots/api#sendgift)
- [sendInvoice](https://core.telegram.org/bots/api#sendinvoice)
- [sendGame](https://core.telegram.org/bots/api#sendgame)

### 类型化 payload 与结果

::: details sendMessage

- 参数: `TelegramMethodArguments<'sendMessage'>`
- Payload: `TelegramMethodPayload<'sendMessage'>`
- 返回值: `Promise<TelegramMethodResult<'sendMessage'>>`
- 字段定义与接口限制: [sendMessage](https://core.telegram.org/bots/api#sendmessage).

:::

::: details sendRichMessage

- 参数: `TelegramMethodArguments<'sendRichMessage'>`
- Payload: `TelegramMethodPayload<'sendRichMessage'>`
- 返回值: `Promise<TelegramMethodResult<'sendRichMessage'>>`
- 字段定义与接口限制: [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage).

:::

::: details forwardMessage

- 参数: `TelegramMethodArguments<'forwardMessage'>`
- Payload: `TelegramMethodPayload<'forwardMessage'>`
- 返回值: `Promise<TelegramMethodResult<'forwardMessage'>>`
- 字段定义与接口限制: [forwardMessage](https://core.telegram.org/bots/api#forwardmessage).

:::

::: details forwardMessages

- 参数: `TelegramMethodArguments<'forwardMessages'>`
- Payload: `TelegramMethodPayload<'forwardMessages'>`
- 返回值: `Promise<TelegramMethodResult<'forwardMessages'>>`
- 字段定义与接口限制: [forwardMessages](https://core.telegram.org/bots/api#forwardmessages).

:::

::: details copyMessage

- 参数: `TelegramMethodArguments<'copyMessage'>`
- Payload: `TelegramMethodPayload<'copyMessage'>`
- 返回值: `Promise<TelegramMethodResult<'copyMessage'>>`
- 字段定义与接口限制: [copyMessage](https://core.telegram.org/bots/api#copymessage).

:::

::: details copyMessages

- 参数: `TelegramMethodArguments<'copyMessages'>`
- Payload: `TelegramMethodPayload<'copyMessages'>`
- 返回值: `Promise<TelegramMethodResult<'copyMessages'>>`
- 字段定义与接口限制: [copyMessages](https://core.telegram.org/bots/api#copymessages).

:::

::: details sendPhoto

- 参数: `TelegramMethodArguments<'sendPhoto'>`
- Payload: `TelegramMethodPayload<'sendPhoto'>`
- 返回值: `Promise<TelegramMethodResult<'sendPhoto'>>`
- 字段定义与接口限制: [sendPhoto](https://core.telegram.org/bots/api#sendphoto).

:::

::: details sendLivePhoto

- 参数: `TelegramMethodArguments<'sendLivePhoto'>`
- Payload: `TelegramMethodPayload<'sendLivePhoto'>`
- 返回值: `Promise<TelegramMethodResult<'sendLivePhoto'>>`
- 字段定义与接口限制: [sendLivePhoto](https://core.telegram.org/bots/api#sendlivephoto).

:::

::: details sendAudio

- 参数: `TelegramMethodArguments<'sendAudio'>`
- Payload: `TelegramMethodPayload<'sendAudio'>`
- 返回值: `Promise<TelegramMethodResult<'sendAudio'>>`
- 字段定义与接口限制: [sendAudio](https://core.telegram.org/bots/api#sendaudio).

:::

::: details sendDocument

- 参数: `TelegramMethodArguments<'sendDocument'>`
- Payload: `TelegramMethodPayload<'sendDocument'>`
- 返回值: `Promise<TelegramMethodResult<'sendDocument'>>`
- 字段定义与接口限制: [sendDocument](https://core.telegram.org/bots/api#senddocument).

:::

::: details sendVideo

- 参数: `TelegramMethodArguments<'sendVideo'>`
- Payload: `TelegramMethodPayload<'sendVideo'>`
- 返回值: `Promise<TelegramMethodResult<'sendVideo'>>`
- 字段定义与接口限制: [sendVideo](https://core.telegram.org/bots/api#sendvideo).

:::

::: details sendAnimation

- 参数: `TelegramMethodArguments<'sendAnimation'>`
- Payload: `TelegramMethodPayload<'sendAnimation'>`
- 返回值: `Promise<TelegramMethodResult<'sendAnimation'>>`
- 字段定义与接口限制: [sendAnimation](https://core.telegram.org/bots/api#sendanimation).

:::

::: details sendVoice

- 参数: `TelegramMethodArguments<'sendVoice'>`
- Payload: `TelegramMethodPayload<'sendVoice'>`
- 返回值: `Promise<TelegramMethodResult<'sendVoice'>>`
- 字段定义与接口限制: [sendVoice](https://core.telegram.org/bots/api#sendvoice).

:::

::: details sendVideoNote

- 参数: `TelegramMethodArguments<'sendVideoNote'>`
- Payload: `TelegramMethodPayload<'sendVideoNote'>`
- 返回值: `Promise<TelegramMethodResult<'sendVideoNote'>>`
- 字段定义与接口限制: [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote).

:::

::: details sendPaidMedia

- 参数: `TelegramMethodArguments<'sendPaidMedia'>`
- Payload: `TelegramMethodPayload<'sendPaidMedia'>`
- 返回值: `Promise<TelegramMethodResult<'sendPaidMedia'>>`
- 字段定义与接口限制: [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia).

:::

::: details sendMediaGroup

- 参数: `TelegramMethodArguments<'sendMediaGroup'>`
- Payload: `TelegramMethodPayload<'sendMediaGroup'>`
- 返回值: `Promise<TelegramMethodResult<'sendMediaGroup'>>`
- 字段定义与接口限制: [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup).

:::

::: details sendLocation

- 参数: `TelegramMethodArguments<'sendLocation'>`
- Payload: `TelegramMethodPayload<'sendLocation'>`
- 返回值: `Promise<TelegramMethodResult<'sendLocation'>>`
- 字段定义与接口限制: [sendLocation](https://core.telegram.org/bots/api#sendlocation).

:::

::: details editMessageLiveLocation

- 参数: `TelegramMethodArguments<'editMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'editMessageLiveLocation'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageLiveLocation'>>`
- 字段定义与接口限制: [editMessageLiveLocation](https://core.telegram.org/bots/api#editmessagelivelocation).

:::

::: details sendVenue

- 参数: `TelegramMethodArguments<'sendVenue'>`
- Payload: `TelegramMethodPayload<'sendVenue'>`
- 返回值: `Promise<TelegramMethodResult<'sendVenue'>>`
- 字段定义与接口限制: [sendVenue](https://core.telegram.org/bots/api#sendvenue).

:::

::: details sendContact

- 参数: `TelegramMethodArguments<'sendContact'>`
- Payload: `TelegramMethodPayload<'sendContact'>`
- 返回值: `Promise<TelegramMethodResult<'sendContact'>>`
- 字段定义与接口限制: [sendContact](https://core.telegram.org/bots/api#sendcontact).

:::

::: details sendPoll

- 参数: `TelegramMethodArguments<'sendPoll'>`
- Payload: `TelegramMethodPayload<'sendPoll'>`
- 返回值: `Promise<TelegramMethodResult<'sendPoll'>>`
- 字段定义与接口限制: [sendPoll](https://core.telegram.org/bots/api#sendpoll).

:::

::: details sendChecklist

- 参数: `TelegramMethodArguments<'sendChecklist'>`
- Payload: `TelegramMethodPayload<'sendChecklist'>`
- 返回值: `Promise<TelegramMethodResult<'sendChecklist'>>`
- 字段定义与接口限制: [sendChecklist](https://core.telegram.org/bots/api#sendchecklist).

:::

::: details editMessageChecklist

- 参数: `TelegramMethodArguments<'editMessageChecklist'>`
- Payload: `TelegramMethodPayload<'editMessageChecklist'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageChecklist'>>`
- 字段定义与接口限制: [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist).

:::

::: details sendDice

- 参数: `TelegramMethodArguments<'sendDice'>`
- Payload: `TelegramMethodPayload<'sendDice'>`
- 返回值: `Promise<TelegramMethodResult<'sendDice'>>`
- 字段定义与接口限制: [sendDice](https://core.telegram.org/bots/api#senddice).

:::

::: details sendMessageDraft

- 参数: `TelegramMethodArguments<'sendMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendMessageDraft'>`
- 返回值: `Promise<TelegramMethodResult<'sendMessageDraft'>>`
- 字段定义与接口限制: [sendMessageDraft](https://core.telegram.org/bots/api#sendmessagedraft).

:::

::: details sendRichMessageDraft

- 参数: `TelegramMethodArguments<'sendRichMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendRichMessageDraft'>`
- 返回值: `Promise<TelegramMethodResult<'sendRichMessageDraft'>>`
- 字段定义与接口限制: [sendRichMessageDraft](https://core.telegram.org/bots/api#sendrichmessagedraft).

:::

::: details sendChatAction

- 参数: `TelegramMethodArguments<'sendChatAction'>`
- Payload: `TelegramMethodPayload<'sendChatAction'>`
- 返回值: `Promise<TelegramMethodResult<'sendChatAction'>>`
- 字段定义与接口限制: [sendChatAction](https://core.telegram.org/bots/api#sendchataction).

:::

::: details setMessageReaction

- 参数: `TelegramMethodArguments<'setMessageReaction'>`
- Payload: `TelegramMethodPayload<'setMessageReaction'>`
- 返回值: `Promise<TelegramMethodResult<'setMessageReaction'>>`
- 字段定义与接口限制: [setMessageReaction](https://core.telegram.org/bots/api#setmessagereaction).

:::

::: details sendChatJoinRequestWebApp

- 参数: `TelegramMethodArguments<'sendChatJoinRequestWebApp'>`
- Payload: `TelegramMethodPayload<'sendChatJoinRequestWebApp'>`
- 返回值: `Promise<TelegramMethodResult<'sendChatJoinRequestWebApp'>>`
- 字段定义与接口限制: [sendChatJoinRequestWebApp](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp).

:::

::: details editMessageText

- 参数: `TelegramMethodArguments<'editMessageText'>`
- Payload: `TelegramMethodPayload<'editMessageText'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageText'>>`
- 字段定义与接口限制: [editMessageText](https://core.telegram.org/bots/api#editmessagetext).

:::

::: details editMessageCaption

- 参数: `TelegramMethodArguments<'editMessageCaption'>`
- Payload: `TelegramMethodPayload<'editMessageCaption'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageCaption'>>`
- 字段定义与接口限制: [editMessageCaption](https://core.telegram.org/bots/api#editmessagecaption).

:::

::: details editMessageMedia

- 参数: `TelegramMethodArguments<'editMessageMedia'>`
- Payload: `TelegramMethodPayload<'editMessageMedia'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageMedia'>>`
- 字段定义与接口限制: [editMessageMedia](https://core.telegram.org/bots/api#editmessagemedia).

:::

::: details editMessageReplyMarkup

- 参数: `TelegramMethodArguments<'editMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editMessageReplyMarkup'>`
- 返回值: `Promise<TelegramMethodResult<'editMessageReplyMarkup'>>`
- 字段定义与接口限制: [editMessageReplyMarkup](https://core.telegram.org/bots/api#editmessagereplymarkup).

:::

::: details deleteMessage

- 参数: `TelegramMethodArguments<'deleteMessage'>`
- Payload: `TelegramMethodPayload<'deleteMessage'>`
- 返回值: `Promise<TelegramMethodResult<'deleteMessage'>>`
- 字段定义与接口限制: [deleteMessage](https://core.telegram.org/bots/api#deletemessage).

:::

::: details deleteMessages

- 参数: `TelegramMethodArguments<'deleteMessages'>`
- Payload: `TelegramMethodPayload<'deleteMessages'>`
- 返回值: `Promise<TelegramMethodResult<'deleteMessages'>>`
- 字段定义与接口限制: [deleteMessages](https://core.telegram.org/bots/api#deletemessages).

:::

::: details deleteMessageReaction

- 参数: `TelegramMethodArguments<'deleteMessageReaction'>`
- Payload: `TelegramMethodPayload<'deleteMessageReaction'>`
- 返回值: `Promise<TelegramMethodResult<'deleteMessageReaction'>>`
- 字段定义与接口限制: [deleteMessageReaction](https://core.telegram.org/bots/api#deletemessagereaction).

:::

::: details sendSticker

- 参数: `TelegramMethodArguments<'sendSticker'>`
- Payload: `TelegramMethodPayload<'sendSticker'>`
- 返回值: `Promise<TelegramMethodResult<'sendSticker'>>`
- 字段定义与接口限制: [sendSticker](https://core.telegram.org/bots/api#sendsticker).

:::

::: details sendGift

- 参数: `TelegramMethodArguments<'sendGift'>`
- Payload: `TelegramMethodPayload<'sendGift'>`
- 返回值: `Promise<TelegramMethodResult<'sendGift'>>`
- 字段定义与接口限制: [sendGift](https://core.telegram.org/bots/api#sendgift).

:::

::: details sendInvoice

- 参数: `TelegramMethodArguments<'sendInvoice'>`
- Payload: `TelegramMethodPayload<'sendInvoice'>`
- 返回值: `Promise<TelegramMethodResult<'sendInvoice'>>`
- 字段定义与接口限制: [sendInvoice](https://core.telegram.org/bots/api#sendinvoice).

:::

::: details sendGame

- 参数: `TelegramMethodArguments<'sendGame'>`
- Payload: `TelegramMethodPayload<'sendGame'>`
- 返回值: `Promise<TelegramMethodResult<'sendGame'>>`
- 字段定义与接口限制: [sendGame](https://core.telegram.org/bots/api#sendgame).

:::

## 聊天、成员与管理

- [banChatMember](https://core.telegram.org/bots/api#banchatmember)
- [unbanChatMember](https://core.telegram.org/bots/api#unbanchatmember)
- [restrictChatMember](https://core.telegram.org/bots/api#restrictchatmember)
- [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember)
- [setChatAdministratorCustomTitle](https://core.telegram.org/bots/api#setchatadministratorcustomtitle)
- [setChatMemberTag](https://core.telegram.org/bots/api#setchatmembertag)
- [banChatSenderChat](https://core.telegram.org/bots/api#banchatsenderchat)
- [unbanChatSenderChat](https://core.telegram.org/bots/api#unbanchatsenderchat)
- [setChatPermissions](https://core.telegram.org/bots/api#setchatpermissions)
- [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink)
- [createChatInviteLink](https://core.telegram.org/bots/api#createchatinvitelink)
- [editChatInviteLink](https://core.telegram.org/bots/api#editchatinvitelink)
- [createChatSubscriptionInviteLink](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink)
- [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink)
- [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink)
- [approveChatJoinRequest](https://core.telegram.org/bots/api#approvechatjoinrequest)
- [declineChatJoinRequest](https://core.telegram.org/bots/api#declinechatjoinrequest)
- [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery)
- [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost)
- [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost)
- [setChatPhoto](https://core.telegram.org/bots/api#setchatphoto)
- [deleteChatPhoto](https://core.telegram.org/bots/api#deletechatphoto)
- [setChatTitle](https://core.telegram.org/bots/api#setchattitle)
- [setChatDescription](https://core.telegram.org/bots/api#setchatdescription)
- [pinChatMessage](https://core.telegram.org/bots/api#pinchatmessage)
- [unpinChatMessage](https://core.telegram.org/bots/api#unpinchatmessage)
- [unpinAllChatMessages](https://core.telegram.org/bots/api#unpinallchatmessages)
- [leaveChat](https://core.telegram.org/bots/api#leavechat)
- [getChat](https://core.telegram.org/bots/api#getchat)
- [getChatAdministrators](https://core.telegram.org/bots/api#getchatadministrators)
- [getChatMemberCount](https://core.telegram.org/bots/api#getchatmembercount)
- [getChatMember](https://core.telegram.org/bots/api#getchatmember)
- [getUserPersonalChatMessages](https://core.telegram.org/bots/api#getuserpersonalchatmessages)
- [setChatStickerSet](https://core.telegram.org/bots/api#setchatstickerset)
- [deleteChatStickerSet](https://core.telegram.org/bots/api#deletechatstickerset)
- [getUserChatBoosts](https://core.telegram.org/bots/api#getuserchatboosts)
- [getChatGifts](https://core.telegram.org/bots/api#getchatgifts)
- [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton)
- [getChatMenuButton](https://core.telegram.org/bots/api#getchatmenubutton)
- [verifyChat](https://core.telegram.org/bots/api#verifychat)
- [removeChatVerification](https://core.telegram.org/bots/api#removechatverification)

### 类型化 payload 与结果

::: details banChatMember

- 参数: `TelegramMethodArguments<'banChatMember'>`
- Payload: `TelegramMethodPayload<'banChatMember'>`
- 返回值: `Promise<TelegramMethodResult<'banChatMember'>>`
- 字段定义与接口限制: [banChatMember](https://core.telegram.org/bots/api#banchatmember).

:::

::: details unbanChatMember

- 参数: `TelegramMethodArguments<'unbanChatMember'>`
- Payload: `TelegramMethodPayload<'unbanChatMember'>`
- 返回值: `Promise<TelegramMethodResult<'unbanChatMember'>>`
- 字段定义与接口限制: [unbanChatMember](https://core.telegram.org/bots/api#unbanchatmember).

:::

::: details restrictChatMember

- 参数: `TelegramMethodArguments<'restrictChatMember'>`
- Payload: `TelegramMethodPayload<'restrictChatMember'>`
- 返回值: `Promise<TelegramMethodResult<'restrictChatMember'>>`
- 字段定义与接口限制: [restrictChatMember](https://core.telegram.org/bots/api#restrictchatmember).

:::

::: details promoteChatMember

- 参数: `TelegramMethodArguments<'promoteChatMember'>`
- Payload: `TelegramMethodPayload<'promoteChatMember'>`
- 返回值: `Promise<TelegramMethodResult<'promoteChatMember'>>`
- 字段定义与接口限制: [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember).

:::

::: details setChatAdministratorCustomTitle

- 参数: `TelegramMethodArguments<'setChatAdministratorCustomTitle'>`
- Payload: `TelegramMethodPayload<'setChatAdministratorCustomTitle'>`
- 返回值: `Promise<TelegramMethodResult<'setChatAdministratorCustomTitle'>>`
- 字段定义与接口限制: [setChatAdministratorCustomTitle](https://core.telegram.org/bots/api#setchatadministratorcustomtitle).

:::

::: details setChatMemberTag

- 参数: `TelegramMethodArguments<'setChatMemberTag'>`
- Payload: `TelegramMethodPayload<'setChatMemberTag'>`
- 返回值: `Promise<TelegramMethodResult<'setChatMemberTag'>>`
- 字段定义与接口限制: [setChatMemberTag](https://core.telegram.org/bots/api#setchatmembertag).

:::

::: details banChatSenderChat

- 参数: `TelegramMethodArguments<'banChatSenderChat'>`
- Payload: `TelegramMethodPayload<'banChatSenderChat'>`
- 返回值: `Promise<TelegramMethodResult<'banChatSenderChat'>>`
- 字段定义与接口限制: [banChatSenderChat](https://core.telegram.org/bots/api#banchatsenderchat).

:::

::: details unbanChatSenderChat

- 参数: `TelegramMethodArguments<'unbanChatSenderChat'>`
- Payload: `TelegramMethodPayload<'unbanChatSenderChat'>`
- 返回值: `Promise<TelegramMethodResult<'unbanChatSenderChat'>>`
- 字段定义与接口限制: [unbanChatSenderChat](https://core.telegram.org/bots/api#unbanchatsenderchat).

:::

::: details setChatPermissions

- 参数: `TelegramMethodArguments<'setChatPermissions'>`
- Payload: `TelegramMethodPayload<'setChatPermissions'>`
- 返回值: `Promise<TelegramMethodResult<'setChatPermissions'>>`
- 字段定义与接口限制: [setChatPermissions](https://core.telegram.org/bots/api#setchatpermissions).

:::

::: details exportChatInviteLink

- 参数: `TelegramMethodArguments<'exportChatInviteLink'>`
- Payload: `TelegramMethodPayload<'exportChatInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'exportChatInviteLink'>>`
- 字段定义与接口限制: [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink).

:::

::: details createChatInviteLink

- 参数: `TelegramMethodArguments<'createChatInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'createChatInviteLink'>>`
- 字段定义与接口限制: [createChatInviteLink](https://core.telegram.org/bots/api#createchatinvitelink).

:::

::: details editChatInviteLink

- 参数: `TelegramMethodArguments<'editChatInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'editChatInviteLink'>>`
- 字段定义与接口限制: [editChatInviteLink](https://core.telegram.org/bots/api#editchatinvitelink).

:::

::: details createChatSubscriptionInviteLink

- 参数: `TelegramMethodArguments<'createChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatSubscriptionInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'createChatSubscriptionInviteLink'>>`
- 字段定义与接口限制: [createChatSubscriptionInviteLink](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink).

:::

::: details editChatSubscriptionInviteLink

- 参数: `TelegramMethodArguments<'editChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatSubscriptionInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'editChatSubscriptionInviteLink'>>`
- 字段定义与接口限制: [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink).

:::

::: details revokeChatInviteLink

- 参数: `TelegramMethodArguments<'revokeChatInviteLink'>`
- Payload: `TelegramMethodPayload<'revokeChatInviteLink'>`
- 返回值: `Promise<TelegramMethodResult<'revokeChatInviteLink'>>`
- 字段定义与接口限制: [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink).

:::

::: details approveChatJoinRequest

- 参数: `TelegramMethodArguments<'approveChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'approveChatJoinRequest'>`
- 返回值: `Promise<TelegramMethodResult<'approveChatJoinRequest'>>`
- 字段定义与接口限制: [approveChatJoinRequest](https://core.telegram.org/bots/api#approvechatjoinrequest).

:::

::: details declineChatJoinRequest

- 参数: `TelegramMethodArguments<'declineChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'declineChatJoinRequest'>`
- 返回值: `Promise<TelegramMethodResult<'declineChatJoinRequest'>>`
- 字段定义与接口限制: [declineChatJoinRequest](https://core.telegram.org/bots/api#declinechatjoinrequest).

:::

::: details answerChatJoinRequestQuery

- 参数: `TelegramMethodArguments<'answerChatJoinRequestQuery'>`
- Payload: `TelegramMethodPayload<'answerChatJoinRequestQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerChatJoinRequestQuery'>>`
- 字段定义与接口限制: [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery).

:::

::: details approveSuggestedPost

- 参数: `TelegramMethodArguments<'approveSuggestedPost'>`
- Payload: `TelegramMethodPayload<'approveSuggestedPost'>`
- 返回值: `Promise<TelegramMethodResult<'approveSuggestedPost'>>`
- 字段定义与接口限制: [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost).

:::

::: details declineSuggestedPost

- 参数: `TelegramMethodArguments<'declineSuggestedPost'>`
- Payload: `TelegramMethodPayload<'declineSuggestedPost'>`
- 返回值: `Promise<TelegramMethodResult<'declineSuggestedPost'>>`
- 字段定义与接口限制: [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost).

:::

::: details setChatPhoto

- 参数: `TelegramMethodArguments<'setChatPhoto'>`
- Payload: `TelegramMethodPayload<'setChatPhoto'>`
- 返回值: `Promise<TelegramMethodResult<'setChatPhoto'>>`
- 字段定义与接口限制: [setChatPhoto](https://core.telegram.org/bots/api#setchatphoto).

:::

::: details deleteChatPhoto

- 参数: `TelegramMethodArguments<'deleteChatPhoto'>`
- Payload: `TelegramMethodPayload<'deleteChatPhoto'>`
- 返回值: `Promise<TelegramMethodResult<'deleteChatPhoto'>>`
- 字段定义与接口限制: [deleteChatPhoto](https://core.telegram.org/bots/api#deletechatphoto).

:::

::: details setChatTitle

- 参数: `TelegramMethodArguments<'setChatTitle'>`
- Payload: `TelegramMethodPayload<'setChatTitle'>`
- 返回值: `Promise<TelegramMethodResult<'setChatTitle'>>`
- 字段定义与接口限制: [setChatTitle](https://core.telegram.org/bots/api#setchattitle).

:::

::: details setChatDescription

- 参数: `TelegramMethodArguments<'setChatDescription'>`
- Payload: `TelegramMethodPayload<'setChatDescription'>`
- 返回值: `Promise<TelegramMethodResult<'setChatDescription'>>`
- 字段定义与接口限制: [setChatDescription](https://core.telegram.org/bots/api#setchatdescription).

:::

::: details pinChatMessage

- 参数: `TelegramMethodArguments<'pinChatMessage'>`
- Payload: `TelegramMethodPayload<'pinChatMessage'>`
- 返回值: `Promise<TelegramMethodResult<'pinChatMessage'>>`
- 字段定义与接口限制: [pinChatMessage](https://core.telegram.org/bots/api#pinchatmessage).

:::

::: details unpinChatMessage

- 参数: `TelegramMethodArguments<'unpinChatMessage'>`
- Payload: `TelegramMethodPayload<'unpinChatMessage'>`
- 返回值: `Promise<TelegramMethodResult<'unpinChatMessage'>>`
- 字段定义与接口限制: [unpinChatMessage](https://core.telegram.org/bots/api#unpinchatmessage).

:::

::: details unpinAllChatMessages

- 参数: `TelegramMethodArguments<'unpinAllChatMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllChatMessages'>`
- 返回值: `Promise<TelegramMethodResult<'unpinAllChatMessages'>>`
- 字段定义与接口限制: [unpinAllChatMessages](https://core.telegram.org/bots/api#unpinallchatmessages).

:::

::: details leaveChat

- 参数: `TelegramMethodArguments<'leaveChat'>`
- Payload: `TelegramMethodPayload<'leaveChat'>`
- 返回值: `Promise<TelegramMethodResult<'leaveChat'>>`
- 字段定义与接口限制: [leaveChat](https://core.telegram.org/bots/api#leavechat).

:::

::: details getChat

- 参数: `TelegramMethodArguments<'getChat'>`
- Payload: `TelegramMethodPayload<'getChat'>`
- 返回值: `Promise<TelegramMethodResult<'getChat'>>`
- 字段定义与接口限制: [getChat](https://core.telegram.org/bots/api#getchat).

:::

::: details getChatAdministrators

- 参数: `TelegramMethodArguments<'getChatAdministrators'>`
- Payload: `TelegramMethodPayload<'getChatAdministrators'>`
- 返回值: `Promise<TelegramMethodResult<'getChatAdministrators'>>`
- 字段定义与接口限制: [getChatAdministrators](https://core.telegram.org/bots/api#getchatadministrators).

:::

::: details getChatMemberCount

- 参数: `TelegramMethodArguments<'getChatMemberCount'>`
- Payload: `TelegramMethodPayload<'getChatMemberCount'>`
- 返回值: `Promise<TelegramMethodResult<'getChatMemberCount'>>`
- 字段定义与接口限制: [getChatMemberCount](https://core.telegram.org/bots/api#getchatmembercount).

:::

::: details getChatMember

- 参数: `TelegramMethodArguments<'getChatMember'>`
- Payload: `TelegramMethodPayload<'getChatMember'>`
- 返回值: `Promise<TelegramMethodResult<'getChatMember'>>`
- 字段定义与接口限制: [getChatMember](https://core.telegram.org/bots/api#getchatmember).

:::

::: details getUserPersonalChatMessages

- 参数: `TelegramMethodArguments<'getUserPersonalChatMessages'>`
- Payload: `TelegramMethodPayload<'getUserPersonalChatMessages'>`
- 返回值: `Promise<TelegramMethodResult<'getUserPersonalChatMessages'>>`
- 字段定义与接口限制: [getUserPersonalChatMessages](https://core.telegram.org/bots/api#getuserpersonalchatmessages).

:::

::: details setChatStickerSet

- 参数: `TelegramMethodArguments<'setChatStickerSet'>`
- Payload: `TelegramMethodPayload<'setChatStickerSet'>`
- 返回值: `Promise<TelegramMethodResult<'setChatStickerSet'>>`
- 字段定义与接口限制: [setChatStickerSet](https://core.telegram.org/bots/api#setchatstickerset).

:::

::: details deleteChatStickerSet

- 参数: `TelegramMethodArguments<'deleteChatStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteChatStickerSet'>`
- 返回值: `Promise<TelegramMethodResult<'deleteChatStickerSet'>>`
- 字段定义与接口限制: [deleteChatStickerSet](https://core.telegram.org/bots/api#deletechatstickerset).

:::

::: details getUserChatBoosts

- 参数: `TelegramMethodArguments<'getUserChatBoosts'>`
- Payload: `TelegramMethodPayload<'getUserChatBoosts'>`
- 返回值: `Promise<TelegramMethodResult<'getUserChatBoosts'>>`
- 字段定义与接口限制: [getUserChatBoosts](https://core.telegram.org/bots/api#getuserchatboosts).

:::

::: details getChatGifts

- 参数: `TelegramMethodArguments<'getChatGifts'>`
- Payload: `TelegramMethodPayload<'getChatGifts'>`
- 返回值: `Promise<TelegramMethodResult<'getChatGifts'>>`
- 字段定义与接口限制: [getChatGifts](https://core.telegram.org/bots/api#getchatgifts).

:::

::: details setChatMenuButton

- 参数: `TelegramMethodArguments<'setChatMenuButton'>`
- Payload: `TelegramMethodPayload<'setChatMenuButton'>`
- 返回值: `Promise<TelegramMethodResult<'setChatMenuButton'>>`
- 字段定义与接口限制: [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton).

:::

::: details getChatMenuButton

- 参数: `TelegramMethodArguments<'getChatMenuButton'>`
- Payload: `TelegramMethodPayload<'getChatMenuButton'>`
- 返回值: `Promise<TelegramMethodResult<'getChatMenuButton'>>`
- 字段定义与接口限制: [getChatMenuButton](https://core.telegram.org/bots/api#getchatmenubutton).

:::

::: details verifyChat

- 参数: `TelegramMethodArguments<'verifyChat'>`
- Payload: `TelegramMethodPayload<'verifyChat'>`
- 返回值: `Promise<TelegramMethodResult<'verifyChat'>>`
- 字段定义与接口限制: [verifyChat](https://core.telegram.org/bots/api#verifychat).

:::

::: details removeChatVerification

- 参数: `TelegramMethodArguments<'removeChatVerification'>`
- Payload: `TelegramMethodPayload<'removeChatVerification'>`
- 返回值: `Promise<TelegramMethodResult<'removeChatVerification'>>`
- 字段定义与接口限制: [removeChatVerification](https://core.telegram.org/bots/api#removechatverification).

:::

## 论坛、话题与贴纸

- [createForumTopic](https://core.telegram.org/bots/api#createforumtopic)
- [editForumTopic](https://core.telegram.org/bots/api#editforumtopic)
- [closeForumTopic](https://core.telegram.org/bots/api#closeforumtopic)
- [reopenForumTopic](https://core.telegram.org/bots/api#reopenforumtopic)
- [deleteForumTopic](https://core.telegram.org/bots/api#deleteforumtopic)
- [unpinAllForumTopicMessages](https://core.telegram.org/bots/api#unpinallforumtopicmessages)
- [editGeneralForumTopic](https://core.telegram.org/bots/api#editgeneralforumtopic)
- [closeGeneralForumTopic](https://core.telegram.org/bots/api#closegeneralforumtopic)
- [reopenGeneralForumTopic](https://core.telegram.org/bots/api#reopengeneralforumtopic)
- [hideGeneralForumTopic](https://core.telegram.org/bots/api#hidegeneralforumtopic)
- [unhideGeneralForumTopic](https://core.telegram.org/bots/api#unhidegeneralforumtopic)
- [unpinAllGeneralForumTopicMessages](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages)
- [getStickerSet](https://core.telegram.org/bots/api#getstickerset)
- [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers)
- [uploadStickerFile](https://core.telegram.org/bots/api#uploadstickerfile)
- [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset)
- [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset)
- [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset)
- [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset)
- [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset)
- [setStickerEmojiList](https://core.telegram.org/bots/api#setstickeremojilist)
- [setStickerKeywords](https://core.telegram.org/bots/api#setstickerkeywords)
- [setStickerMaskPosition](https://core.telegram.org/bots/api#setstickermaskposition)
- [setStickerSetTitle](https://core.telegram.org/bots/api#setstickersettitle)
- [deleteStickerSet](https://core.telegram.org/bots/api#deletestickerset)
- [setStickerSetThumbnail](https://core.telegram.org/bots/api#setstickersetthumbnail)
- [setCustomEmojiStickerSetThumbnail](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail)
- [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers)

### 类型化 payload 与结果

::: details createForumTopic

- 参数: `TelegramMethodArguments<'createForumTopic'>`
- Payload: `TelegramMethodPayload<'createForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'createForumTopic'>>`
- 字段定义与接口限制: [createForumTopic](https://core.telegram.org/bots/api#createforumtopic).

:::

::: details editForumTopic

- 参数: `TelegramMethodArguments<'editForumTopic'>`
- Payload: `TelegramMethodPayload<'editForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'editForumTopic'>>`
- 字段定义与接口限制: [editForumTopic](https://core.telegram.org/bots/api#editforumtopic).

:::

::: details closeForumTopic

- 参数: `TelegramMethodArguments<'closeForumTopic'>`
- Payload: `TelegramMethodPayload<'closeForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'closeForumTopic'>>`
- 字段定义与接口限制: [closeForumTopic](https://core.telegram.org/bots/api#closeforumtopic).

:::

::: details reopenForumTopic

- 参数: `TelegramMethodArguments<'reopenForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'reopenForumTopic'>>`
- 字段定义与接口限制: [reopenForumTopic](https://core.telegram.org/bots/api#reopenforumtopic).

:::

::: details deleteForumTopic

- 参数: `TelegramMethodArguments<'deleteForumTopic'>`
- Payload: `TelegramMethodPayload<'deleteForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'deleteForumTopic'>>`
- 字段定义与接口限制: [deleteForumTopic](https://core.telegram.org/bots/api#deleteforumtopic).

:::

::: details unpinAllForumTopicMessages

- 参数: `TelegramMethodArguments<'unpinAllForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllForumTopicMessages'>`
- 返回值: `Promise<TelegramMethodResult<'unpinAllForumTopicMessages'>>`
- 字段定义与接口限制: [unpinAllForumTopicMessages](https://core.telegram.org/bots/api#unpinallforumtopicmessages).

:::

::: details editGeneralForumTopic

- 参数: `TelegramMethodArguments<'editGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'editGeneralForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'editGeneralForumTopic'>>`
- 字段定义与接口限制: [editGeneralForumTopic](https://core.telegram.org/bots/api#editgeneralforumtopic).

:::

::: details closeGeneralForumTopic

- 参数: `TelegramMethodArguments<'closeGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'closeGeneralForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'closeGeneralForumTopic'>>`
- 字段定义与接口限制: [closeGeneralForumTopic](https://core.telegram.org/bots/api#closegeneralforumtopic).

:::

::: details reopenGeneralForumTopic

- 参数: `TelegramMethodArguments<'reopenGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenGeneralForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'reopenGeneralForumTopic'>>`
- 字段定义与接口限制: [reopenGeneralForumTopic](https://core.telegram.org/bots/api#reopengeneralforumtopic).

:::

::: details hideGeneralForumTopic

- 参数: `TelegramMethodArguments<'hideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'hideGeneralForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'hideGeneralForumTopic'>>`
- 字段定义与接口限制: [hideGeneralForumTopic](https://core.telegram.org/bots/api#hidegeneralforumtopic).

:::

::: details unhideGeneralForumTopic

- 参数: `TelegramMethodArguments<'unhideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'unhideGeneralForumTopic'>`
- 返回值: `Promise<TelegramMethodResult<'unhideGeneralForumTopic'>>`
- 字段定义与接口限制: [unhideGeneralForumTopic](https://core.telegram.org/bots/api#unhidegeneralforumtopic).

:::

::: details unpinAllGeneralForumTopicMessages

- 参数: `TelegramMethodArguments<'unpinAllGeneralForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllGeneralForumTopicMessages'>`
- 返回值: `Promise<TelegramMethodResult<'unpinAllGeneralForumTopicMessages'>>`
- 字段定义与接口限制: [unpinAllGeneralForumTopicMessages](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages).

:::

::: details getStickerSet

- 参数: `TelegramMethodArguments<'getStickerSet'>`
- Payload: `TelegramMethodPayload<'getStickerSet'>`
- 返回值: `Promise<TelegramMethodResult<'getStickerSet'>>`
- 字段定义与接口限制: [getStickerSet](https://core.telegram.org/bots/api#getstickerset).

:::

::: details getCustomEmojiStickers

- 参数: `TelegramMethodArguments<'getCustomEmojiStickers'>`
- Payload: `TelegramMethodPayload<'getCustomEmojiStickers'>`
- 返回值: `Promise<TelegramMethodResult<'getCustomEmojiStickers'>>`
- 字段定义与接口限制: [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers).

:::

::: details uploadStickerFile

- 参数: `TelegramMethodArguments<'uploadStickerFile'>`
- Payload: `TelegramMethodPayload<'uploadStickerFile'>`
- 返回值: `Promise<TelegramMethodResult<'uploadStickerFile'>>`
- 字段定义与接口限制: [uploadStickerFile](https://core.telegram.org/bots/api#uploadstickerfile).

:::

::: details createNewStickerSet

- 参数: `TelegramMethodArguments<'createNewStickerSet'>`
- Payload: `TelegramMethodPayload<'createNewStickerSet'>`
- 返回值: `Promise<TelegramMethodResult<'createNewStickerSet'>>`
- 字段定义与接口限制: [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset).

:::

::: details addStickerToSet

- 参数: `TelegramMethodArguments<'addStickerToSet'>`
- Payload: `TelegramMethodPayload<'addStickerToSet'>`
- 返回值: `Promise<TelegramMethodResult<'addStickerToSet'>>`
- 字段定义与接口限制: [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset).

:::

::: details setStickerPositionInSet

- 参数: `TelegramMethodArguments<'setStickerPositionInSet'>`
- Payload: `TelegramMethodPayload<'setStickerPositionInSet'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerPositionInSet'>>`
- 字段定义与接口限制: [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset).

:::

::: details deleteStickerFromSet

- 参数: `TelegramMethodArguments<'deleteStickerFromSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerFromSet'>`
- 返回值: `Promise<TelegramMethodResult<'deleteStickerFromSet'>>`
- 字段定义与接口限制: [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset).

:::

::: details replaceStickerInSet

- 参数: `TelegramMethodArguments<'replaceStickerInSet'>`
- Payload: `TelegramMethodPayload<'replaceStickerInSet'>`
- 返回值: `Promise<TelegramMethodResult<'replaceStickerInSet'>>`
- 字段定义与接口限制: [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset).

:::

::: details setStickerEmojiList

- 参数: `TelegramMethodArguments<'setStickerEmojiList'>`
- Payload: `TelegramMethodPayload<'setStickerEmojiList'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerEmojiList'>>`
- 字段定义与接口限制: [setStickerEmojiList](https://core.telegram.org/bots/api#setstickeremojilist).

:::

::: details setStickerKeywords

- 参数: `TelegramMethodArguments<'setStickerKeywords'>`
- Payload: `TelegramMethodPayload<'setStickerKeywords'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerKeywords'>>`
- 字段定义与接口限制: [setStickerKeywords](https://core.telegram.org/bots/api#setstickerkeywords).

:::

::: details setStickerMaskPosition

- 参数: `TelegramMethodArguments<'setStickerMaskPosition'>`
- Payload: `TelegramMethodPayload<'setStickerMaskPosition'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerMaskPosition'>>`
- 字段定义与接口限制: [setStickerMaskPosition](https://core.telegram.org/bots/api#setstickermaskposition).

:::

::: details setStickerSetTitle

- 参数: `TelegramMethodArguments<'setStickerSetTitle'>`
- Payload: `TelegramMethodPayload<'setStickerSetTitle'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerSetTitle'>>`
- 字段定义与接口限制: [setStickerSetTitle](https://core.telegram.org/bots/api#setstickersettitle).

:::

::: details deleteStickerSet

- 参数: `TelegramMethodArguments<'deleteStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerSet'>`
- 返回值: `Promise<TelegramMethodResult<'deleteStickerSet'>>`
- 字段定义与接口限制: [deleteStickerSet](https://core.telegram.org/bots/api#deletestickerset).

:::

::: details setStickerSetThumbnail

- 参数: `TelegramMethodArguments<'setStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setStickerSetThumbnail'>`
- 返回值: `Promise<TelegramMethodResult<'setStickerSetThumbnail'>>`
- 字段定义与接口限制: [setStickerSetThumbnail](https://core.telegram.org/bots/api#setstickersetthumbnail).

:::

::: details setCustomEmojiStickerSetThumbnail

- 参数: `TelegramMethodArguments<'setCustomEmojiStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setCustomEmojiStickerSetThumbnail'>`
- 返回值: `Promise<TelegramMethodResult<'setCustomEmojiStickerSetThumbnail'>>`
- 字段定义与接口限制: [setCustomEmojiStickerSetThumbnail](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail).

:::

::: details getForumTopicIconStickers

- 参数: `TelegramMethodArguments<'getForumTopicIconStickers'>`
- Payload: `TelegramMethodPayload<'getForumTopicIconStickers'>`
- 返回值: `Promise<TelegramMethodResult<'getForumTopicIconStickers'>>`
- 字段定义与接口限制: [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers).

:::

## Inline 查询、Web App 与访客更新

- [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery)
- [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)
- [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery)
- [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage)
- [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)

### 类型化 payload 与结果

::: details answerGuestQuery

- 参数: `TelegramMethodArguments<'answerGuestQuery'>`
- Payload: `TelegramMethodPayload<'answerGuestQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerGuestQuery'>>`
- 字段定义与接口限制: [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery).

:::

::: details answerInlineQuery

- 参数: `TelegramMethodArguments<'answerInlineQuery'>`
- Payload: `TelegramMethodPayload<'answerInlineQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerInlineQuery'>>`
- 字段定义与接口限制: [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery).

:::

::: details answerWebAppQuery

- 参数: `TelegramMethodArguments<'answerWebAppQuery'>`
- Payload: `TelegramMethodPayload<'answerWebAppQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerWebAppQuery'>>`
- 字段定义与接口限制: [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

:::

::: details savePreparedInlineMessage

- 参数: `TelegramMethodArguments<'savePreparedInlineMessage'>`
- Payload: `TelegramMethodPayload<'savePreparedInlineMessage'>`
- 返回值: `Promise<TelegramMethodResult<'savePreparedInlineMessage'>>`
- 字段定义与接口限制: [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage).

:::

::: details savePreparedKeyboardButton

- 参数: `TelegramMethodArguments<'savePreparedKeyboardButton'>`
- Payload: `TelegramMethodPayload<'savePreparedKeyboardButton'>`
- 返回值: `Promise<TelegramMethodResult<'savePreparedKeyboardButton'>>`
- 字段定义与接口限制: [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton).

:::

## Business 与临时消息

- [getBusinessConnection](https://core.telegram.org/bots/api#getbusinessconnection)
- [editEphemeralMessageText](https://core.telegram.org/bots/api#editephemeralmessagetext)
- [editEphemeralMessageMedia](https://core.telegram.org/bots/api#editephemeralmessagemedia)
- [editEphemeralMessageCaption](https://core.telegram.org/bots/api#editephemeralmessagecaption)
- [editEphemeralMessageReplyMarkup](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup)
- [deleteEphemeralMessage](https://core.telegram.org/bots/api#deleteephemeralmessage)
- [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages)
- [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname)
- [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername)
- [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio)
- [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto)
- [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto)
- [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings)
- [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance)
- [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars)
- [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts)
- [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage)

### 类型化 payload 与结果

::: details getBusinessConnection

- 参数: `TelegramMethodArguments<'getBusinessConnection'>`
- Payload: `TelegramMethodPayload<'getBusinessConnection'>`
- 返回值: `Promise<TelegramMethodResult<'getBusinessConnection'>>`
- 字段定义与接口限制: [getBusinessConnection](https://core.telegram.org/bots/api#getbusinessconnection).

:::

::: details editEphemeralMessageText

- 参数: `TelegramMethodArguments<'editEphemeralMessageText'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageText'>`
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageText'>>`
- 字段定义与接口限制: [editEphemeralMessageText](https://core.telegram.org/bots/api#editephemeralmessagetext).

:::

::: details editEphemeralMessageMedia

- 参数: `TelegramMethodArguments<'editEphemeralMessageMedia'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageMedia'>`
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageMedia'>>`
- 字段定义与接口限制: [editEphemeralMessageMedia](https://core.telegram.org/bots/api#editephemeralmessagemedia).

:::

::: details editEphemeralMessageCaption

- 参数: `TelegramMethodArguments<'editEphemeralMessageCaption'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageCaption'>`
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageCaption'>>`
- 字段定义与接口限制: [editEphemeralMessageCaption](https://core.telegram.org/bots/api#editephemeralmessagecaption).

:::

::: details editEphemeralMessageReplyMarkup

- 参数: `TelegramMethodArguments<'editEphemeralMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageReplyMarkup'>`
- 返回值: `Promise<TelegramMethodResult<'editEphemeralMessageReplyMarkup'>>`
- 字段定义与接口限制: [editEphemeralMessageReplyMarkup](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup).

:::

::: details deleteEphemeralMessage

- 参数: `TelegramMethodArguments<'deleteEphemeralMessage'>`
- Payload: `TelegramMethodPayload<'deleteEphemeralMessage'>`
- 返回值: `Promise<TelegramMethodResult<'deleteEphemeralMessage'>>`
- 字段定义与接口限制: [deleteEphemeralMessage](https://core.telegram.org/bots/api#deleteephemeralmessage).

:::

::: details deleteBusinessMessages

- 参数: `TelegramMethodArguments<'deleteBusinessMessages'>`
- Payload: `TelegramMethodPayload<'deleteBusinessMessages'>`
- 返回值: `Promise<TelegramMethodResult<'deleteBusinessMessages'>>`
- 字段定义与接口限制: [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages).

:::

::: details setBusinessAccountName

- 参数: `TelegramMethodArguments<'setBusinessAccountName'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountName'>`
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountName'>>`
- 字段定义与接口限制: [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname).

:::

::: details setBusinessAccountUsername

- 参数: `TelegramMethodArguments<'setBusinessAccountUsername'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountUsername'>`
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountUsername'>>`
- 字段定义与接口限制: [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername).

:::

::: details setBusinessAccountBio

- 参数: `TelegramMethodArguments<'setBusinessAccountBio'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountBio'>`
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountBio'>>`
- 字段定义与接口限制: [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio).

:::

::: details setBusinessAccountProfilePhoto

- 参数: `TelegramMethodArguments<'setBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountProfilePhoto'>`
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountProfilePhoto'>>`
- 字段定义与接口限制: [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto).

:::

::: details removeBusinessAccountProfilePhoto

- 参数: `TelegramMethodArguments<'removeBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeBusinessAccountProfilePhoto'>`
- 返回值: `Promise<TelegramMethodResult<'removeBusinessAccountProfilePhoto'>>`
- 字段定义与接口限制: [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto).

:::

::: details setBusinessAccountGiftSettings

- 参数: `TelegramMethodArguments<'setBusinessAccountGiftSettings'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountGiftSettings'>`
- 返回值: `Promise<TelegramMethodResult<'setBusinessAccountGiftSettings'>>`
- 字段定义与接口限制: [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings).

:::

::: details getBusinessAccountStarBalance

- 参数: `TelegramMethodArguments<'getBusinessAccountStarBalance'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountStarBalance'>`
- 返回值: `Promise<TelegramMethodResult<'getBusinessAccountStarBalance'>>`
- 字段定义与接口限制: [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance).

:::

::: details transferBusinessAccountStars

- 参数: `TelegramMethodArguments<'transferBusinessAccountStars'>`
- Payload: `TelegramMethodPayload<'transferBusinessAccountStars'>`
- 返回值: `Promise<TelegramMethodResult<'transferBusinessAccountStars'>>`
- 字段定义与接口限制: [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars).

:::

::: details getBusinessAccountGifts

- 参数: `TelegramMethodArguments<'getBusinessAccountGifts'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountGifts'>`
- 返回值: `Promise<TelegramMethodResult<'getBusinessAccountGifts'>>`
- 字段定义与接口限制: [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts).

:::

::: details readBusinessMessage

- 参数: `TelegramMethodArguments<'readBusinessMessage'>`
- Payload: `TelegramMethodPayload<'readBusinessMessage'>`
- 返回值: `Promise<TelegramMethodResult<'readBusinessMessage'>>`
- 字段定义与接口限制: [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage).

:::

## 支付、Stars 与礼物

- [getUserGifts](https://core.telegram.org/bots/api#getusergifts)
- [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars)
- [upgradeGift](https://core.telegram.org/bots/api#upgradegift)
- [transferGift](https://core.telegram.org/bots/api#transfergift)
- [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription)
- [createInvoiceLink](https://core.telegram.org/bots/api#createinvoicelink)
- [answerShippingQuery](https://core.telegram.org/bots/api#answershippingquery)
- [answerPreCheckoutQuery](https://core.telegram.org/bots/api#answerprecheckoutquery)
- [getStarTransactions](https://core.telegram.org/bots/api#getstartransactions)
- [refundStarPayment](https://core.telegram.org/bots/api#refundstarpayment)
- [editUserStarSubscription](https://core.telegram.org/bots/api#edituserstarsubscription)
- [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance)
- [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts)

### 类型化 payload 与结果

::: details getUserGifts

- 参数: `TelegramMethodArguments<'getUserGifts'>`
- Payload: `TelegramMethodPayload<'getUserGifts'>`
- 返回值: `Promise<TelegramMethodResult<'getUserGifts'>>`
- 字段定义与接口限制: [getUserGifts](https://core.telegram.org/bots/api#getusergifts).

:::

::: details convertGiftToStars

- 参数: `TelegramMethodArguments<'convertGiftToStars'>`
- Payload: `TelegramMethodPayload<'convertGiftToStars'>`
- 返回值: `Promise<TelegramMethodResult<'convertGiftToStars'>>`
- 字段定义与接口限制: [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars).

:::

::: details upgradeGift

- 参数: `TelegramMethodArguments<'upgradeGift'>`
- Payload: `TelegramMethodPayload<'upgradeGift'>`
- 返回值: `Promise<TelegramMethodResult<'upgradeGift'>>`
- 字段定义与接口限制: [upgradeGift](https://core.telegram.org/bots/api#upgradegift).

:::

::: details transferGift

- 参数: `TelegramMethodArguments<'transferGift'>`
- Payload: `TelegramMethodPayload<'transferGift'>`
- 返回值: `Promise<TelegramMethodResult<'transferGift'>>`
- 字段定义与接口限制: [transferGift](https://core.telegram.org/bots/api#transfergift).

:::

::: details giftPremiumSubscription

- 参数: `TelegramMethodArguments<'giftPremiumSubscription'>`
- Payload: `TelegramMethodPayload<'giftPremiumSubscription'>`
- 返回值: `Promise<TelegramMethodResult<'giftPremiumSubscription'>>`
- 字段定义与接口限制: [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription).

:::

::: details createInvoiceLink

- 参数: `TelegramMethodArguments<'createInvoiceLink'>`
- Payload: `TelegramMethodPayload<'createInvoiceLink'>`
- 返回值: `Promise<TelegramMethodResult<'createInvoiceLink'>>`
- 字段定义与接口限制: [createInvoiceLink](https://core.telegram.org/bots/api#createinvoicelink).

:::

::: details answerShippingQuery

- 参数: `TelegramMethodArguments<'answerShippingQuery'>`
- Payload: `TelegramMethodPayload<'answerShippingQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerShippingQuery'>>`
- 字段定义与接口限制: [answerShippingQuery](https://core.telegram.org/bots/api#answershippingquery).

:::

::: details answerPreCheckoutQuery

- 参数: `TelegramMethodArguments<'answerPreCheckoutQuery'>`
- Payload: `TelegramMethodPayload<'answerPreCheckoutQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerPreCheckoutQuery'>>`
- 字段定义与接口限制: [answerPreCheckoutQuery](https://core.telegram.org/bots/api#answerprecheckoutquery).

:::

::: details getStarTransactions

- 参数: `TelegramMethodArguments<'getStarTransactions'>`
- Payload: `TelegramMethodPayload<'getStarTransactions'>`
- 返回值: `Promise<TelegramMethodResult<'getStarTransactions'>>`
- 字段定义与接口限制: [getStarTransactions](https://core.telegram.org/bots/api#getstartransactions).

:::

::: details refundStarPayment

- 参数: `TelegramMethodArguments<'refundStarPayment'>`
- Payload: `TelegramMethodPayload<'refundStarPayment'>`
- 返回值: `Promise<TelegramMethodResult<'refundStarPayment'>>`
- 字段定义与接口限制: [refundStarPayment](https://core.telegram.org/bots/api#refundstarpayment).

:::

::: details editUserStarSubscription

- 参数: `TelegramMethodArguments<'editUserStarSubscription'>`
- Payload: `TelegramMethodPayload<'editUserStarSubscription'>`
- 返回值: `Promise<TelegramMethodResult<'editUserStarSubscription'>>`
- 字段定义与接口限制: [editUserStarSubscription](https://core.telegram.org/bots/api#edituserstarsubscription).

:::

::: details getMyStarBalance

- 参数: `TelegramMethodArguments<'getMyStarBalance'>`
- Payload: `TelegramMethodPayload<'getMyStarBalance'>`
- 返回值: `Promise<TelegramMethodResult<'getMyStarBalance'>>`
- 字段定义与接口限制: [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance).

:::

::: details getAvailableGifts

- 参数: `TelegramMethodArguments<'getAvailableGifts'>`
- Payload: `TelegramMethodPayload<'getAvailableGifts'>`
- 返回值: `Promise<TelegramMethodResult<'getAvailableGifts'>>`
- 字段定义与接口限制: [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts).

:::

## 游戏

- [setGameScore](https://core.telegram.org/bots/api#setgamescore)
- [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores)

### 类型化 payload 与结果

::: details setGameScore

- 参数: `TelegramMethodArguments<'setGameScore'>`
- Payload: `TelegramMethodPayload<'setGameScore'>`
- 返回值: `Promise<TelegramMethodResult<'setGameScore'>>`
- 字段定义与接口限制: [setGameScore](https://core.telegram.org/bots/api#setgamescore).

:::

::: details getGameHighScores

- 参数: `TelegramMethodArguments<'getGameHighScores'>`
- Payload: `TelegramMethodPayload<'getGameHighScores'>`
- 返回值: `Promise<TelegramMethodResult<'getGameHighScores'>>`
- 字段定义与接口限制: [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores).

:::

## 机器人、文件、更新与账户信息

- [getUpdates](https://core.telegram.org/bots/api#getupdates)
- [setWebhook](https://core.telegram.org/bots/api#setwebhook)
- [deleteWebhook](https://core.telegram.org/bots/api#deletewebhook)
- [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation)
- [getUserProfilePhotos](https://core.telegram.org/bots/api#getuserprofilephotos)
- [getUserProfileAudios](https://core.telegram.org/bots/api#getuserprofileaudios)
- [setUserEmojiStatus](https://core.telegram.org/bots/api#setuseremojistatus)
- [getFile](https://core.telegram.org/bots/api#getfile)
- [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery)
- [getManagedBotToken](https://core.telegram.org/bots/api#getmanagedbottoken)
- [replaceManagedBotToken](https://core.telegram.org/bots/api#replacemanagedbottoken)
- [getManagedBotAccessSettings](https://core.telegram.org/bots/api#getmanagedbotaccesssettings)
- [setManagedBotAccessSettings](https://core.telegram.org/bots/api#setmanagedbotaccesssettings)
- [setMyCommands](https://core.telegram.org/bots/api#setmycommands)
- [deleteMyCommands](https://core.telegram.org/bots/api#deletemycommands)
- [getMyCommands](https://core.telegram.org/bots/api#getmycommands)
- [setMyName](https://core.telegram.org/bots/api#setmyname)
- [getMyName](https://core.telegram.org/bots/api#getmyname)
- [setMyDescription](https://core.telegram.org/bots/api#setmydescription)
- [getMyDescription](https://core.telegram.org/bots/api#getmydescription)
- [setMyShortDescription](https://core.telegram.org/bots/api#setmyshortdescription)
- [getMyShortDescription](https://core.telegram.org/bots/api#getmyshortdescription)
- [setMyProfilePhoto](https://core.telegram.org/bots/api#setmyprofilephoto)
- [setMyDefaultAdministratorRights](https://core.telegram.org/bots/api#setmydefaultadministratorrights)
- [getMyDefaultAdministratorRights](https://core.telegram.org/bots/api#getmydefaultadministratorrights)
- [stopPoll](https://core.telegram.org/bots/api#stoppoll)
- [deleteAllMessageReactions](https://core.telegram.org/bots/api#deleteallmessagereactions)
- [postStory](https://core.telegram.org/bots/api#poststory)
- [repostStory](https://core.telegram.org/bots/api#repoststory)
- [editStory](https://core.telegram.org/bots/api#editstory)
- [deleteStory](https://core.telegram.org/bots/api#deletestory)
- [verifyUser](https://core.telegram.org/bots/api#verifyuser)
- [removeUserVerification](https://core.telegram.org/bots/api#removeuserverification)
- [setPassportDataErrors](https://core.telegram.org/bots/api#setpassportdataerrors)
- [getWebhookInfo](https://core.telegram.org/bots/api#getwebhookinfo)
- [getMe](https://core.telegram.org/bots/api#getme)
- [logOut](https://core.telegram.org/bots/api#logout)
- [close](https://core.telegram.org/bots/api#close)
- [removeMyProfilePhoto](https://core.telegram.org/bots/api#removemyprofilephoto)

### 类型化 payload 与结果

::: details getUpdates

- 参数: `TelegramMethodArguments<'getUpdates'>`
- Payload: `TelegramMethodPayload<'getUpdates'>`
- 返回值: `Promise<TelegramMethodResult<'getUpdates'>>`
- 字段定义与接口限制: [getUpdates](https://core.telegram.org/bots/api#getupdates).

:::

::: details setWebhook

- 参数: `TelegramMethodArguments<'setWebhook'>`
- Payload: `TelegramMethodPayload<'setWebhook'>`
- 返回值: `Promise<TelegramMethodResult<'setWebhook'>>`
- 字段定义与接口限制: [setWebhook](https://core.telegram.org/bots/api#setwebhook).

:::

::: details deleteWebhook

- 参数: `TelegramMethodArguments<'deleteWebhook'>`
- Payload: `TelegramMethodPayload<'deleteWebhook'>`
- 返回值: `Promise<TelegramMethodResult<'deleteWebhook'>>`
- 字段定义与接口限制: [deleteWebhook](https://core.telegram.org/bots/api#deletewebhook).

:::

::: details stopMessageLiveLocation

- 参数: `TelegramMethodArguments<'stopMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'stopMessageLiveLocation'>`
- 返回值: `Promise<TelegramMethodResult<'stopMessageLiveLocation'>>`
- 字段定义与接口限制: [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation).

:::

::: details getUserProfilePhotos

- 参数: `TelegramMethodArguments<'getUserProfilePhotos'>`
- Payload: `TelegramMethodPayload<'getUserProfilePhotos'>`
- 返回值: `Promise<TelegramMethodResult<'getUserProfilePhotos'>>`
- 字段定义与接口限制: [getUserProfilePhotos](https://core.telegram.org/bots/api#getuserprofilephotos).

:::

::: details getUserProfileAudios

- 参数: `TelegramMethodArguments<'getUserProfileAudios'>`
- Payload: `TelegramMethodPayload<'getUserProfileAudios'>`
- 返回值: `Promise<TelegramMethodResult<'getUserProfileAudios'>>`
- 字段定义与接口限制: [getUserProfileAudios](https://core.telegram.org/bots/api#getuserprofileaudios).

:::

::: details setUserEmojiStatus

- 参数: `TelegramMethodArguments<'setUserEmojiStatus'>`
- Payload: `TelegramMethodPayload<'setUserEmojiStatus'>`
- 返回值: `Promise<TelegramMethodResult<'setUserEmojiStatus'>>`
- 字段定义与接口限制: [setUserEmojiStatus](https://core.telegram.org/bots/api#setuseremojistatus).

:::

::: details getFile

- 参数: `TelegramMethodArguments<'getFile'>`
- Payload: `TelegramMethodPayload<'getFile'>`
- 返回值: `Promise<TelegramMethodResult<'getFile'>>`
- 字段定义与接口限制: [getFile](https://core.telegram.org/bots/api#getfile).

:::

::: details answerCallbackQuery

- 参数: `TelegramMethodArguments<'answerCallbackQuery'>`
- Payload: `TelegramMethodPayload<'answerCallbackQuery'>`
- 返回值: `Promise<TelegramMethodResult<'answerCallbackQuery'>>`
- 字段定义与接口限制: [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery).

:::

::: details getManagedBotToken

- 参数: `TelegramMethodArguments<'getManagedBotToken'>`
- Payload: `TelegramMethodPayload<'getManagedBotToken'>`
- 返回值: `Promise<TelegramMethodResult<'getManagedBotToken'>>`
- 字段定义与接口限制: [getManagedBotToken](https://core.telegram.org/bots/api#getmanagedbottoken).

:::

::: details replaceManagedBotToken

- 参数: `TelegramMethodArguments<'replaceManagedBotToken'>`
- Payload: `TelegramMethodPayload<'replaceManagedBotToken'>`
- 返回值: `Promise<TelegramMethodResult<'replaceManagedBotToken'>>`
- 字段定义与接口限制: [replaceManagedBotToken](https://core.telegram.org/bots/api#replacemanagedbottoken).

:::

::: details getManagedBotAccessSettings

- 参数: `TelegramMethodArguments<'getManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'getManagedBotAccessSettings'>`
- 返回值: `Promise<TelegramMethodResult<'getManagedBotAccessSettings'>>`
- 字段定义与接口限制: [getManagedBotAccessSettings](https://core.telegram.org/bots/api#getmanagedbotaccesssettings).

:::

::: details setManagedBotAccessSettings

- 参数: `TelegramMethodArguments<'setManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'setManagedBotAccessSettings'>`
- 返回值: `Promise<TelegramMethodResult<'setManagedBotAccessSettings'>>`
- 字段定义与接口限制: [setManagedBotAccessSettings](https://core.telegram.org/bots/api#setmanagedbotaccesssettings).

:::

::: details setMyCommands

- 参数: `TelegramMethodArguments<'setMyCommands'>`
- Payload: `TelegramMethodPayload<'setMyCommands'>`
- 返回值: `Promise<TelegramMethodResult<'setMyCommands'>>`
- 字段定义与接口限制: [setMyCommands](https://core.telegram.org/bots/api#setmycommands).

:::

::: details deleteMyCommands

- 参数: `TelegramMethodArguments<'deleteMyCommands'>`
- Payload: `TelegramMethodPayload<'deleteMyCommands'>`
- 返回值: `Promise<TelegramMethodResult<'deleteMyCommands'>>`
- 字段定义与接口限制: [deleteMyCommands](https://core.telegram.org/bots/api#deletemycommands).

:::

::: details getMyCommands

- 参数: `TelegramMethodArguments<'getMyCommands'>`
- Payload: `TelegramMethodPayload<'getMyCommands'>`
- 返回值: `Promise<TelegramMethodResult<'getMyCommands'>>`
- 字段定义与接口限制: [getMyCommands](https://core.telegram.org/bots/api#getmycommands).

:::

::: details setMyName

- 参数: `TelegramMethodArguments<'setMyName'>`
- Payload: `TelegramMethodPayload<'setMyName'>`
- 返回值: `Promise<TelegramMethodResult<'setMyName'>>`
- 字段定义与接口限制: [setMyName](https://core.telegram.org/bots/api#setmyname).

:::

::: details getMyName

- 参数: `TelegramMethodArguments<'getMyName'>`
- Payload: `TelegramMethodPayload<'getMyName'>`
- 返回值: `Promise<TelegramMethodResult<'getMyName'>>`
- 字段定义与接口限制: [getMyName](https://core.telegram.org/bots/api#getmyname).

:::

::: details setMyDescription

- 参数: `TelegramMethodArguments<'setMyDescription'>`
- Payload: `TelegramMethodPayload<'setMyDescription'>`
- 返回值: `Promise<TelegramMethodResult<'setMyDescription'>>`
- 字段定义与接口限制: [setMyDescription](https://core.telegram.org/bots/api#setmydescription).

:::

::: details getMyDescription

- 参数: `TelegramMethodArguments<'getMyDescription'>`
- Payload: `TelegramMethodPayload<'getMyDescription'>`
- 返回值: `Promise<TelegramMethodResult<'getMyDescription'>>`
- 字段定义与接口限制: [getMyDescription](https://core.telegram.org/bots/api#getmydescription).

:::

::: details setMyShortDescription

- 参数: `TelegramMethodArguments<'setMyShortDescription'>`
- Payload: `TelegramMethodPayload<'setMyShortDescription'>`
- 返回值: `Promise<TelegramMethodResult<'setMyShortDescription'>>`
- 字段定义与接口限制: [setMyShortDescription](https://core.telegram.org/bots/api#setmyshortdescription).

:::

::: details getMyShortDescription

- 参数: `TelegramMethodArguments<'getMyShortDescription'>`
- Payload: `TelegramMethodPayload<'getMyShortDescription'>`
- 返回值: `Promise<TelegramMethodResult<'getMyShortDescription'>>`
- 字段定义与接口限制: [getMyShortDescription](https://core.telegram.org/bots/api#getmyshortdescription).

:::

::: details setMyProfilePhoto

- 参数: `TelegramMethodArguments<'setMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setMyProfilePhoto'>`
- 返回值: `Promise<TelegramMethodResult<'setMyProfilePhoto'>>`
- 字段定义与接口限制: [setMyProfilePhoto](https://core.telegram.org/bots/api#setmyprofilephoto).

:::

::: details setMyDefaultAdministratorRights

- 参数: `TelegramMethodArguments<'setMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'setMyDefaultAdministratorRights'>`
- 返回值: `Promise<TelegramMethodResult<'setMyDefaultAdministratorRights'>>`
- 字段定义与接口限制: [setMyDefaultAdministratorRights](https://core.telegram.org/bots/api#setmydefaultadministratorrights).

:::

::: details getMyDefaultAdministratorRights

- 参数: `TelegramMethodArguments<'getMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'getMyDefaultAdministratorRights'>`
- 返回值: `Promise<TelegramMethodResult<'getMyDefaultAdministratorRights'>>`
- 字段定义与接口限制: [getMyDefaultAdministratorRights](https://core.telegram.org/bots/api#getmydefaultadministratorrights).

:::

::: details stopPoll

- 参数: `TelegramMethodArguments<'stopPoll'>`
- Payload: `TelegramMethodPayload<'stopPoll'>`
- 返回值: `Promise<TelegramMethodResult<'stopPoll'>>`
- 字段定义与接口限制: [stopPoll](https://core.telegram.org/bots/api#stoppoll).

:::

::: details deleteAllMessageReactions

- 参数: `TelegramMethodArguments<'deleteAllMessageReactions'>`
- Payload: `TelegramMethodPayload<'deleteAllMessageReactions'>`
- 返回值: `Promise<TelegramMethodResult<'deleteAllMessageReactions'>>`
- 字段定义与接口限制: [deleteAllMessageReactions](https://core.telegram.org/bots/api#deleteallmessagereactions).

:::

::: details postStory

- 参数: `TelegramMethodArguments<'postStory'>`
- Payload: `TelegramMethodPayload<'postStory'>`
- 返回值: `Promise<TelegramMethodResult<'postStory'>>`
- 字段定义与接口限制: [postStory](https://core.telegram.org/bots/api#poststory).

:::

::: details repostStory

- 参数: `TelegramMethodArguments<'repostStory'>`
- Payload: `TelegramMethodPayload<'repostStory'>`
- 返回值: `Promise<TelegramMethodResult<'repostStory'>>`
- 字段定义与接口限制: [repostStory](https://core.telegram.org/bots/api#repoststory).

:::

::: details editStory

- 参数: `TelegramMethodArguments<'editStory'>`
- Payload: `TelegramMethodPayload<'editStory'>`
- 返回值: `Promise<TelegramMethodResult<'editStory'>>`
- 字段定义与接口限制: [editStory](https://core.telegram.org/bots/api#editstory).

:::

::: details deleteStory

- 参数: `TelegramMethodArguments<'deleteStory'>`
- Payload: `TelegramMethodPayload<'deleteStory'>`
- 返回值: `Promise<TelegramMethodResult<'deleteStory'>>`
- 字段定义与接口限制: [deleteStory](https://core.telegram.org/bots/api#deletestory).

:::

::: details verifyUser

- 参数: `TelegramMethodArguments<'verifyUser'>`
- Payload: `TelegramMethodPayload<'verifyUser'>`
- 返回值: `Promise<TelegramMethodResult<'verifyUser'>>`
- 字段定义与接口限制: [verifyUser](https://core.telegram.org/bots/api#verifyuser).

:::

::: details removeUserVerification

- 参数: `TelegramMethodArguments<'removeUserVerification'>`
- Payload: `TelegramMethodPayload<'removeUserVerification'>`
- 返回值: `Promise<TelegramMethodResult<'removeUserVerification'>>`
- 字段定义与接口限制: [removeUserVerification](https://core.telegram.org/bots/api#removeuserverification).

:::

::: details setPassportDataErrors

- 参数: `TelegramMethodArguments<'setPassportDataErrors'>`
- Payload: `TelegramMethodPayload<'setPassportDataErrors'>`
- 返回值: `Promise<TelegramMethodResult<'setPassportDataErrors'>>`
- 字段定义与接口限制: [setPassportDataErrors](https://core.telegram.org/bots/api#setpassportdataerrors).

:::

::: details getWebhookInfo

- 参数: `TelegramMethodArguments<'getWebhookInfo'>`
- Payload: `TelegramMethodPayload<'getWebhookInfo'>`
- 返回值: `Promise<TelegramMethodResult<'getWebhookInfo'>>`
- 字段定义与接口限制: [getWebhookInfo](https://core.telegram.org/bots/api#getwebhookinfo).

:::

::: details getMe

- 参数: `TelegramMethodArguments<'getMe'>`
- Payload: `TelegramMethodPayload<'getMe'>`
- 返回值: `Promise<TelegramMethodResult<'getMe'>>`
- 字段定义与接口限制: [getMe](https://core.telegram.org/bots/api#getme).

:::

::: details logOut

- 参数: `TelegramMethodArguments<'logOut'>`
- Payload: `TelegramMethodPayload<'logOut'>`
- 返回值: `Promise<TelegramMethodResult<'logOut'>>`
- 字段定义与接口限制: [logOut](https://core.telegram.org/bots/api#logout).

:::

::: details close

- 参数: `TelegramMethodArguments<'close'>`
- Payload: `TelegramMethodPayload<'close'>`
- 返回值: `Promise<TelegramMethodResult<'close'>>`
- 字段定义与接口限制: [close](https://core.telegram.org/bots/api#close).

:::

::: details removeMyProfilePhoto

- 参数: `TelegramMethodArguments<'removeMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeMyProfilePhoto'>`
- 返回值: `Promise<TelegramMethodResult<'removeMyProfilePhoto'>>`
- 字段定义与接口限制: [removeMyProfilePhoto](https://core.telegram.org/bots/api#removemyprofilephoto).

:::

## 相关参考

- [Bot API 参考](/zh/reference/api)
- [TypeScript](/zh/reference/typescript)
- [Bot 配置项](/zh/reference/options)
