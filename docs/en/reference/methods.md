---
title: Bot API methods
description: Bot API methods included in the TeleBibz registry.
---

# Bot API methods

The TeleBibz registry includes **185 method names**. This page is generated from the source registry during the docs build.

> A method name does not guarantee that every request is available. Telegram permissions, chat context, updates, and endpoint limits still apply.

## Calling methods

```js
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'Hello' });
await bot.api.getMe();
```

This index is generated from the method registry and package declarations. Each entry links the type-safe argument tuple, payload, and result; use the Telegram link for field descriptions and endpoint constraints.

## Messages, media, and reactions

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

### Typed payloads and results

::: details sendMessage

- Arguments: `TelegramMethodArguments<'sendMessage'>`
- Payload: `TelegramMethodPayload<'sendMessage'>`
- Result: `Promise<TelegramMethodResult<'sendMessage'>>`
- Field definitions and endpoint constraints: [sendMessage](https://core.telegram.org/bots/api#sendmessage).

:::

::: details sendRichMessage

- Arguments: `TelegramMethodArguments<'sendRichMessage'>`
- Payload: `TelegramMethodPayload<'sendRichMessage'>`
- Result: `Promise<TelegramMethodResult<'sendRichMessage'>>`
- Field definitions and endpoint constraints: [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage).

:::

::: details forwardMessage

- Arguments: `TelegramMethodArguments<'forwardMessage'>`
- Payload: `TelegramMethodPayload<'forwardMessage'>`
- Result: `Promise<TelegramMethodResult<'forwardMessage'>>`
- Field definitions and endpoint constraints: [forwardMessage](https://core.telegram.org/bots/api#forwardmessage).

:::

::: details forwardMessages

- Arguments: `TelegramMethodArguments<'forwardMessages'>`
- Payload: `TelegramMethodPayload<'forwardMessages'>`
- Result: `Promise<TelegramMethodResult<'forwardMessages'>>`
- Field definitions and endpoint constraints: [forwardMessages](https://core.telegram.org/bots/api#forwardmessages).

:::

::: details copyMessage

- Arguments: `TelegramMethodArguments<'copyMessage'>`
- Payload: `TelegramMethodPayload<'copyMessage'>`
- Result: `Promise<TelegramMethodResult<'copyMessage'>>`
- Field definitions and endpoint constraints: [copyMessage](https://core.telegram.org/bots/api#copymessage).

:::

::: details copyMessages

- Arguments: `TelegramMethodArguments<'copyMessages'>`
- Payload: `TelegramMethodPayload<'copyMessages'>`
- Result: `Promise<TelegramMethodResult<'copyMessages'>>`
- Field definitions and endpoint constraints: [copyMessages](https://core.telegram.org/bots/api#copymessages).

:::

::: details sendPhoto

- Arguments: `TelegramMethodArguments<'sendPhoto'>`
- Payload: `TelegramMethodPayload<'sendPhoto'>`
- Result: `Promise<TelegramMethodResult<'sendPhoto'>>`
- Field definitions and endpoint constraints: [sendPhoto](https://core.telegram.org/bots/api#sendphoto).

:::

::: details sendLivePhoto

- Arguments: `TelegramMethodArguments<'sendLivePhoto'>`
- Payload: `TelegramMethodPayload<'sendLivePhoto'>`
- Result: `Promise<TelegramMethodResult<'sendLivePhoto'>>`
- Field definitions and endpoint constraints: [sendLivePhoto](https://core.telegram.org/bots/api#sendlivephoto).

:::

::: details sendAudio

- Arguments: `TelegramMethodArguments<'sendAudio'>`
- Payload: `TelegramMethodPayload<'sendAudio'>`
- Result: `Promise<TelegramMethodResult<'sendAudio'>>`
- Field definitions and endpoint constraints: [sendAudio](https://core.telegram.org/bots/api#sendaudio).

:::

::: details sendDocument

- Arguments: `TelegramMethodArguments<'sendDocument'>`
- Payload: `TelegramMethodPayload<'sendDocument'>`
- Result: `Promise<TelegramMethodResult<'sendDocument'>>`
- Field definitions and endpoint constraints: [sendDocument](https://core.telegram.org/bots/api#senddocument).

:::

::: details sendVideo

- Arguments: `TelegramMethodArguments<'sendVideo'>`
- Payload: `TelegramMethodPayload<'sendVideo'>`
- Result: `Promise<TelegramMethodResult<'sendVideo'>>`
- Field definitions and endpoint constraints: [sendVideo](https://core.telegram.org/bots/api#sendvideo).

:::

::: details sendAnimation

- Arguments: `TelegramMethodArguments<'sendAnimation'>`
- Payload: `TelegramMethodPayload<'sendAnimation'>`
- Result: `Promise<TelegramMethodResult<'sendAnimation'>>`
- Field definitions and endpoint constraints: [sendAnimation](https://core.telegram.org/bots/api#sendanimation).

:::

::: details sendVoice

- Arguments: `TelegramMethodArguments<'sendVoice'>`
- Payload: `TelegramMethodPayload<'sendVoice'>`
- Result: `Promise<TelegramMethodResult<'sendVoice'>>`
- Field definitions and endpoint constraints: [sendVoice](https://core.telegram.org/bots/api#sendvoice).

:::

::: details sendVideoNote

- Arguments: `TelegramMethodArguments<'sendVideoNote'>`
- Payload: `TelegramMethodPayload<'sendVideoNote'>`
- Result: `Promise<TelegramMethodResult<'sendVideoNote'>>`
- Field definitions and endpoint constraints: [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote).

:::

::: details sendPaidMedia

- Arguments: `TelegramMethodArguments<'sendPaidMedia'>`
- Payload: `TelegramMethodPayload<'sendPaidMedia'>`
- Result: `Promise<TelegramMethodResult<'sendPaidMedia'>>`
- Field definitions and endpoint constraints: [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia).

:::

::: details sendMediaGroup

- Arguments: `TelegramMethodArguments<'sendMediaGroup'>`
- Payload: `TelegramMethodPayload<'sendMediaGroup'>`
- Result: `Promise<TelegramMethodResult<'sendMediaGroup'>>`
- Field definitions and endpoint constraints: [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup).

:::

::: details sendLocation

- Arguments: `TelegramMethodArguments<'sendLocation'>`
- Payload: `TelegramMethodPayload<'sendLocation'>`
- Result: `Promise<TelegramMethodResult<'sendLocation'>>`
- Field definitions and endpoint constraints: [sendLocation](https://core.telegram.org/bots/api#sendlocation).

:::

::: details editMessageLiveLocation

- Arguments: `TelegramMethodArguments<'editMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'editMessageLiveLocation'>`
- Result: `Promise<TelegramMethodResult<'editMessageLiveLocation'>>`
- Field definitions and endpoint constraints: [editMessageLiveLocation](https://core.telegram.org/bots/api#editmessagelivelocation).

:::

::: details sendVenue

- Arguments: `TelegramMethodArguments<'sendVenue'>`
- Payload: `TelegramMethodPayload<'sendVenue'>`
- Result: `Promise<TelegramMethodResult<'sendVenue'>>`
- Field definitions and endpoint constraints: [sendVenue](https://core.telegram.org/bots/api#sendvenue).

:::

::: details sendContact

- Arguments: `TelegramMethodArguments<'sendContact'>`
- Payload: `TelegramMethodPayload<'sendContact'>`
- Result: `Promise<TelegramMethodResult<'sendContact'>>`
- Field definitions and endpoint constraints: [sendContact](https://core.telegram.org/bots/api#sendcontact).

:::

::: details sendPoll

- Arguments: `TelegramMethodArguments<'sendPoll'>`
- Payload: `TelegramMethodPayload<'sendPoll'>`
- Result: `Promise<TelegramMethodResult<'sendPoll'>>`
- Field definitions and endpoint constraints: [sendPoll](https://core.telegram.org/bots/api#sendpoll).

:::

::: details sendChecklist

- Arguments: `TelegramMethodArguments<'sendChecklist'>`
- Payload: `TelegramMethodPayload<'sendChecklist'>`
- Result: `Promise<TelegramMethodResult<'sendChecklist'>>`
- Field definitions and endpoint constraints: [sendChecklist](https://core.telegram.org/bots/api#sendchecklist).

:::

::: details editMessageChecklist

- Arguments: `TelegramMethodArguments<'editMessageChecklist'>`
- Payload: `TelegramMethodPayload<'editMessageChecklist'>`
- Result: `Promise<TelegramMethodResult<'editMessageChecklist'>>`
- Field definitions and endpoint constraints: [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist).

:::

::: details sendDice

- Arguments: `TelegramMethodArguments<'sendDice'>`
- Payload: `TelegramMethodPayload<'sendDice'>`
- Result: `Promise<TelegramMethodResult<'sendDice'>>`
- Field definitions and endpoint constraints: [sendDice](https://core.telegram.org/bots/api#senddice).

:::

::: details sendMessageDraft

- Arguments: `TelegramMethodArguments<'sendMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendMessageDraft'>`
- Result: `Promise<TelegramMethodResult<'sendMessageDraft'>>`
- Field definitions and endpoint constraints: [sendMessageDraft](https://core.telegram.org/bots/api#sendmessagedraft).

:::

::: details sendRichMessageDraft

- Arguments: `TelegramMethodArguments<'sendRichMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendRichMessageDraft'>`
- Result: `Promise<TelegramMethodResult<'sendRichMessageDraft'>>`
- Field definitions and endpoint constraints: [sendRichMessageDraft](https://core.telegram.org/bots/api#sendrichmessagedraft).

:::

::: details sendChatAction

- Arguments: `TelegramMethodArguments<'sendChatAction'>`
- Payload: `TelegramMethodPayload<'sendChatAction'>`
- Result: `Promise<TelegramMethodResult<'sendChatAction'>>`
- Field definitions and endpoint constraints: [sendChatAction](https://core.telegram.org/bots/api#sendchataction).

:::

::: details setMessageReaction

- Arguments: `TelegramMethodArguments<'setMessageReaction'>`
- Payload: `TelegramMethodPayload<'setMessageReaction'>`
- Result: `Promise<TelegramMethodResult<'setMessageReaction'>>`
- Field definitions and endpoint constraints: [setMessageReaction](https://core.telegram.org/bots/api#setmessagereaction).

:::

::: details sendChatJoinRequestWebApp

- Arguments: `TelegramMethodArguments<'sendChatJoinRequestWebApp'>`
- Payload: `TelegramMethodPayload<'sendChatJoinRequestWebApp'>`
- Result: `Promise<TelegramMethodResult<'sendChatJoinRequestWebApp'>>`
- Field definitions and endpoint constraints: [sendChatJoinRequestWebApp](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp).

:::

::: details editMessageText

- Arguments: `TelegramMethodArguments<'editMessageText'>`
- Payload: `TelegramMethodPayload<'editMessageText'>`
- Result: `Promise<TelegramMethodResult<'editMessageText'>>`
- Field definitions and endpoint constraints: [editMessageText](https://core.telegram.org/bots/api#editmessagetext).

:::

::: details editMessageCaption

- Arguments: `TelegramMethodArguments<'editMessageCaption'>`
- Payload: `TelegramMethodPayload<'editMessageCaption'>`
- Result: `Promise<TelegramMethodResult<'editMessageCaption'>>`
- Field definitions and endpoint constraints: [editMessageCaption](https://core.telegram.org/bots/api#editmessagecaption).

:::

::: details editMessageMedia

- Arguments: `TelegramMethodArguments<'editMessageMedia'>`
- Payload: `TelegramMethodPayload<'editMessageMedia'>`
- Result: `Promise<TelegramMethodResult<'editMessageMedia'>>`
- Field definitions and endpoint constraints: [editMessageMedia](https://core.telegram.org/bots/api#editmessagemedia).

:::

::: details editMessageReplyMarkup

- Arguments: `TelegramMethodArguments<'editMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editMessageReplyMarkup'>`
- Result: `Promise<TelegramMethodResult<'editMessageReplyMarkup'>>`
- Field definitions and endpoint constraints: [editMessageReplyMarkup](https://core.telegram.org/bots/api#editmessagereplymarkup).

:::

::: details deleteMessage

- Arguments: `TelegramMethodArguments<'deleteMessage'>`
- Payload: `TelegramMethodPayload<'deleteMessage'>`
- Result: `Promise<TelegramMethodResult<'deleteMessage'>>`
- Field definitions and endpoint constraints: [deleteMessage](https://core.telegram.org/bots/api#deletemessage).

:::

::: details deleteMessages

- Arguments: `TelegramMethodArguments<'deleteMessages'>`
- Payload: `TelegramMethodPayload<'deleteMessages'>`
- Result: `Promise<TelegramMethodResult<'deleteMessages'>>`
- Field definitions and endpoint constraints: [deleteMessages](https://core.telegram.org/bots/api#deletemessages).

:::

::: details deleteMessageReaction

- Arguments: `TelegramMethodArguments<'deleteMessageReaction'>`
- Payload: `TelegramMethodPayload<'deleteMessageReaction'>`
- Result: `Promise<TelegramMethodResult<'deleteMessageReaction'>>`
- Field definitions and endpoint constraints: [deleteMessageReaction](https://core.telegram.org/bots/api#deletemessagereaction).

:::

::: details sendSticker

- Arguments: `TelegramMethodArguments<'sendSticker'>`
- Payload: `TelegramMethodPayload<'sendSticker'>`
- Result: `Promise<TelegramMethodResult<'sendSticker'>>`
- Field definitions and endpoint constraints: [sendSticker](https://core.telegram.org/bots/api#sendsticker).

:::

::: details sendGift

- Arguments: `TelegramMethodArguments<'sendGift'>`
- Payload: `TelegramMethodPayload<'sendGift'>`
- Result: `Promise<TelegramMethodResult<'sendGift'>>`
- Field definitions and endpoint constraints: [sendGift](https://core.telegram.org/bots/api#sendgift).

:::

::: details sendInvoice

- Arguments: `TelegramMethodArguments<'sendInvoice'>`
- Payload: `TelegramMethodPayload<'sendInvoice'>`
- Result: `Promise<TelegramMethodResult<'sendInvoice'>>`
- Field definitions and endpoint constraints: [sendInvoice](https://core.telegram.org/bots/api#sendinvoice).

:::

::: details sendGame

- Arguments: `TelegramMethodArguments<'sendGame'>`
- Payload: `TelegramMethodPayload<'sendGame'>`
- Result: `Promise<TelegramMethodResult<'sendGame'>>`
- Field definitions and endpoint constraints: [sendGame](https://core.telegram.org/bots/api#sendgame).

:::

## Chats, members, and administration

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

### Typed payloads and results

::: details banChatMember

- Arguments: `TelegramMethodArguments<'banChatMember'>`
- Payload: `TelegramMethodPayload<'banChatMember'>`
- Result: `Promise<TelegramMethodResult<'banChatMember'>>`
- Field definitions and endpoint constraints: [banChatMember](https://core.telegram.org/bots/api#banchatmember).

:::

::: details unbanChatMember

- Arguments: `TelegramMethodArguments<'unbanChatMember'>`
- Payload: `TelegramMethodPayload<'unbanChatMember'>`
- Result: `Promise<TelegramMethodResult<'unbanChatMember'>>`
- Field definitions and endpoint constraints: [unbanChatMember](https://core.telegram.org/bots/api#unbanchatmember).

:::

::: details restrictChatMember

- Arguments: `TelegramMethodArguments<'restrictChatMember'>`
- Payload: `TelegramMethodPayload<'restrictChatMember'>`
- Result: `Promise<TelegramMethodResult<'restrictChatMember'>>`
- Field definitions and endpoint constraints: [restrictChatMember](https://core.telegram.org/bots/api#restrictchatmember).

:::

::: details promoteChatMember

- Arguments: `TelegramMethodArguments<'promoteChatMember'>`
- Payload: `TelegramMethodPayload<'promoteChatMember'>`
- Result: `Promise<TelegramMethodResult<'promoteChatMember'>>`
- Field definitions and endpoint constraints: [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember).

:::

::: details setChatAdministratorCustomTitle

- Arguments: `TelegramMethodArguments<'setChatAdministratorCustomTitle'>`
- Payload: `TelegramMethodPayload<'setChatAdministratorCustomTitle'>`
- Result: `Promise<TelegramMethodResult<'setChatAdministratorCustomTitle'>>`
- Field definitions and endpoint constraints: [setChatAdministratorCustomTitle](https://core.telegram.org/bots/api#setchatadministratorcustomtitle).

:::

::: details setChatMemberTag

- Arguments: `TelegramMethodArguments<'setChatMemberTag'>`
- Payload: `TelegramMethodPayload<'setChatMemberTag'>`
- Result: `Promise<TelegramMethodResult<'setChatMemberTag'>>`
- Field definitions and endpoint constraints: [setChatMemberTag](https://core.telegram.org/bots/api#setchatmembertag).

:::

::: details banChatSenderChat

- Arguments: `TelegramMethodArguments<'banChatSenderChat'>`
- Payload: `TelegramMethodPayload<'banChatSenderChat'>`
- Result: `Promise<TelegramMethodResult<'banChatSenderChat'>>`
- Field definitions and endpoint constraints: [banChatSenderChat](https://core.telegram.org/bots/api#banchatsenderchat).

:::

::: details unbanChatSenderChat

- Arguments: `TelegramMethodArguments<'unbanChatSenderChat'>`
- Payload: `TelegramMethodPayload<'unbanChatSenderChat'>`
- Result: `Promise<TelegramMethodResult<'unbanChatSenderChat'>>`
- Field definitions and endpoint constraints: [unbanChatSenderChat](https://core.telegram.org/bots/api#unbanchatsenderchat).

:::

::: details setChatPermissions

- Arguments: `TelegramMethodArguments<'setChatPermissions'>`
- Payload: `TelegramMethodPayload<'setChatPermissions'>`
- Result: `Promise<TelegramMethodResult<'setChatPermissions'>>`
- Field definitions and endpoint constraints: [setChatPermissions](https://core.telegram.org/bots/api#setchatpermissions).

:::

::: details exportChatInviteLink

- Arguments: `TelegramMethodArguments<'exportChatInviteLink'>`
- Payload: `TelegramMethodPayload<'exportChatInviteLink'>`
- Result: `Promise<TelegramMethodResult<'exportChatInviteLink'>>`
- Field definitions and endpoint constraints: [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink).

:::

::: details createChatInviteLink

- Arguments: `TelegramMethodArguments<'createChatInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatInviteLink'>`
- Result: `Promise<TelegramMethodResult<'createChatInviteLink'>>`
- Field definitions and endpoint constraints: [createChatInviteLink](https://core.telegram.org/bots/api#createchatinvitelink).

:::

::: details editChatInviteLink

- Arguments: `TelegramMethodArguments<'editChatInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatInviteLink'>`
- Result: `Promise<TelegramMethodResult<'editChatInviteLink'>>`
- Field definitions and endpoint constraints: [editChatInviteLink](https://core.telegram.org/bots/api#editchatinvitelink).

:::

::: details createChatSubscriptionInviteLink

- Arguments: `TelegramMethodArguments<'createChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatSubscriptionInviteLink'>`
- Result: `Promise<TelegramMethodResult<'createChatSubscriptionInviteLink'>>`
- Field definitions and endpoint constraints: [createChatSubscriptionInviteLink](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink).

:::

::: details editChatSubscriptionInviteLink

- Arguments: `TelegramMethodArguments<'editChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatSubscriptionInviteLink'>`
- Result: `Promise<TelegramMethodResult<'editChatSubscriptionInviteLink'>>`
- Field definitions and endpoint constraints: [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink).

:::

::: details revokeChatInviteLink

- Arguments: `TelegramMethodArguments<'revokeChatInviteLink'>`
- Payload: `TelegramMethodPayload<'revokeChatInviteLink'>`
- Result: `Promise<TelegramMethodResult<'revokeChatInviteLink'>>`
- Field definitions and endpoint constraints: [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink).

:::

::: details approveChatJoinRequest

- Arguments: `TelegramMethodArguments<'approveChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'approveChatJoinRequest'>`
- Result: `Promise<TelegramMethodResult<'approveChatJoinRequest'>>`
- Field definitions and endpoint constraints: [approveChatJoinRequest](https://core.telegram.org/bots/api#approvechatjoinrequest).

:::

::: details declineChatJoinRequest

- Arguments: `TelegramMethodArguments<'declineChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'declineChatJoinRequest'>`
- Result: `Promise<TelegramMethodResult<'declineChatJoinRequest'>>`
- Field definitions and endpoint constraints: [declineChatJoinRequest](https://core.telegram.org/bots/api#declinechatjoinrequest).

:::

::: details answerChatJoinRequestQuery

- Arguments: `TelegramMethodArguments<'answerChatJoinRequestQuery'>`
- Payload: `TelegramMethodPayload<'answerChatJoinRequestQuery'>`
- Result: `Promise<TelegramMethodResult<'answerChatJoinRequestQuery'>>`
- Field definitions and endpoint constraints: [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery).

:::

::: details approveSuggestedPost

- Arguments: `TelegramMethodArguments<'approveSuggestedPost'>`
- Payload: `TelegramMethodPayload<'approveSuggestedPost'>`
- Result: `Promise<TelegramMethodResult<'approveSuggestedPost'>>`
- Field definitions and endpoint constraints: [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost).

:::

::: details declineSuggestedPost

- Arguments: `TelegramMethodArguments<'declineSuggestedPost'>`
- Payload: `TelegramMethodPayload<'declineSuggestedPost'>`
- Result: `Promise<TelegramMethodResult<'declineSuggestedPost'>>`
- Field definitions and endpoint constraints: [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost).

:::

::: details setChatPhoto

- Arguments: `TelegramMethodArguments<'setChatPhoto'>`
- Payload: `TelegramMethodPayload<'setChatPhoto'>`
- Result: `Promise<TelegramMethodResult<'setChatPhoto'>>`
- Field definitions and endpoint constraints: [setChatPhoto](https://core.telegram.org/bots/api#setchatphoto).

:::

::: details deleteChatPhoto

- Arguments: `TelegramMethodArguments<'deleteChatPhoto'>`
- Payload: `TelegramMethodPayload<'deleteChatPhoto'>`
- Result: `Promise<TelegramMethodResult<'deleteChatPhoto'>>`
- Field definitions and endpoint constraints: [deleteChatPhoto](https://core.telegram.org/bots/api#deletechatphoto).

:::

::: details setChatTitle

- Arguments: `TelegramMethodArguments<'setChatTitle'>`
- Payload: `TelegramMethodPayload<'setChatTitle'>`
- Result: `Promise<TelegramMethodResult<'setChatTitle'>>`
- Field definitions and endpoint constraints: [setChatTitle](https://core.telegram.org/bots/api#setchattitle).

:::

::: details setChatDescription

- Arguments: `TelegramMethodArguments<'setChatDescription'>`
- Payload: `TelegramMethodPayload<'setChatDescription'>`
- Result: `Promise<TelegramMethodResult<'setChatDescription'>>`
- Field definitions and endpoint constraints: [setChatDescription](https://core.telegram.org/bots/api#setchatdescription).

:::

::: details pinChatMessage

- Arguments: `TelegramMethodArguments<'pinChatMessage'>`
- Payload: `TelegramMethodPayload<'pinChatMessage'>`
- Result: `Promise<TelegramMethodResult<'pinChatMessage'>>`
- Field definitions and endpoint constraints: [pinChatMessage](https://core.telegram.org/bots/api#pinchatmessage).

:::

::: details unpinChatMessage

- Arguments: `TelegramMethodArguments<'unpinChatMessage'>`
- Payload: `TelegramMethodPayload<'unpinChatMessage'>`
- Result: `Promise<TelegramMethodResult<'unpinChatMessage'>>`
- Field definitions and endpoint constraints: [unpinChatMessage](https://core.telegram.org/bots/api#unpinchatmessage).

:::

::: details unpinAllChatMessages

- Arguments: `TelegramMethodArguments<'unpinAllChatMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllChatMessages'>`
- Result: `Promise<TelegramMethodResult<'unpinAllChatMessages'>>`
- Field definitions and endpoint constraints: [unpinAllChatMessages](https://core.telegram.org/bots/api#unpinallchatmessages).

:::

::: details leaveChat

- Arguments: `TelegramMethodArguments<'leaveChat'>`
- Payload: `TelegramMethodPayload<'leaveChat'>`
- Result: `Promise<TelegramMethodResult<'leaveChat'>>`
- Field definitions and endpoint constraints: [leaveChat](https://core.telegram.org/bots/api#leavechat).

:::

::: details getChat

- Arguments: `TelegramMethodArguments<'getChat'>`
- Payload: `TelegramMethodPayload<'getChat'>`
- Result: `Promise<TelegramMethodResult<'getChat'>>`
- Field definitions and endpoint constraints: [getChat](https://core.telegram.org/bots/api#getchat).

:::

::: details getChatAdministrators

- Arguments: `TelegramMethodArguments<'getChatAdministrators'>`
- Payload: `TelegramMethodPayload<'getChatAdministrators'>`
- Result: `Promise<TelegramMethodResult<'getChatAdministrators'>>`
- Field definitions and endpoint constraints: [getChatAdministrators](https://core.telegram.org/bots/api#getchatadministrators).

:::

::: details getChatMemberCount

- Arguments: `TelegramMethodArguments<'getChatMemberCount'>`
- Payload: `TelegramMethodPayload<'getChatMemberCount'>`
- Result: `Promise<TelegramMethodResult<'getChatMemberCount'>>`
- Field definitions and endpoint constraints: [getChatMemberCount](https://core.telegram.org/bots/api#getchatmembercount).

:::

::: details getChatMember

- Arguments: `TelegramMethodArguments<'getChatMember'>`
- Payload: `TelegramMethodPayload<'getChatMember'>`
- Result: `Promise<TelegramMethodResult<'getChatMember'>>`
- Field definitions and endpoint constraints: [getChatMember](https://core.telegram.org/bots/api#getchatmember).

:::

::: details getUserPersonalChatMessages

- Arguments: `TelegramMethodArguments<'getUserPersonalChatMessages'>`
- Payload: `TelegramMethodPayload<'getUserPersonalChatMessages'>`
- Result: `Promise<TelegramMethodResult<'getUserPersonalChatMessages'>>`
- Field definitions and endpoint constraints: [getUserPersonalChatMessages](https://core.telegram.org/bots/api#getuserpersonalchatmessages).

:::

::: details setChatStickerSet

- Arguments: `TelegramMethodArguments<'setChatStickerSet'>`
- Payload: `TelegramMethodPayload<'setChatStickerSet'>`
- Result: `Promise<TelegramMethodResult<'setChatStickerSet'>>`
- Field definitions and endpoint constraints: [setChatStickerSet](https://core.telegram.org/bots/api#setchatstickerset).

:::

::: details deleteChatStickerSet

- Arguments: `TelegramMethodArguments<'deleteChatStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteChatStickerSet'>`
- Result: `Promise<TelegramMethodResult<'deleteChatStickerSet'>>`
- Field definitions and endpoint constraints: [deleteChatStickerSet](https://core.telegram.org/bots/api#deletechatstickerset).

:::

::: details getUserChatBoosts

- Arguments: `TelegramMethodArguments<'getUserChatBoosts'>`
- Payload: `TelegramMethodPayload<'getUserChatBoosts'>`
- Result: `Promise<TelegramMethodResult<'getUserChatBoosts'>>`
- Field definitions and endpoint constraints: [getUserChatBoosts](https://core.telegram.org/bots/api#getuserchatboosts).

:::

::: details getChatGifts

- Arguments: `TelegramMethodArguments<'getChatGifts'>`
- Payload: `TelegramMethodPayload<'getChatGifts'>`
- Result: `Promise<TelegramMethodResult<'getChatGifts'>>`
- Field definitions and endpoint constraints: [getChatGifts](https://core.telegram.org/bots/api#getchatgifts).

:::

::: details setChatMenuButton

- Arguments: `TelegramMethodArguments<'setChatMenuButton'>`
- Payload: `TelegramMethodPayload<'setChatMenuButton'>`
- Result: `Promise<TelegramMethodResult<'setChatMenuButton'>>`
- Field definitions and endpoint constraints: [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton).

:::

::: details getChatMenuButton

- Arguments: `TelegramMethodArguments<'getChatMenuButton'>`
- Payload: `TelegramMethodPayload<'getChatMenuButton'>`
- Result: `Promise<TelegramMethodResult<'getChatMenuButton'>>`
- Field definitions and endpoint constraints: [getChatMenuButton](https://core.telegram.org/bots/api#getchatmenubutton).

:::

::: details verifyChat

- Arguments: `TelegramMethodArguments<'verifyChat'>`
- Payload: `TelegramMethodPayload<'verifyChat'>`
- Result: `Promise<TelegramMethodResult<'verifyChat'>>`
- Field definitions and endpoint constraints: [verifyChat](https://core.telegram.org/bots/api#verifychat).

:::

::: details removeChatVerification

- Arguments: `TelegramMethodArguments<'removeChatVerification'>`
- Payload: `TelegramMethodPayload<'removeChatVerification'>`
- Result: `Promise<TelegramMethodResult<'removeChatVerification'>>`
- Field definitions and endpoint constraints: [removeChatVerification](https://core.telegram.org/bots/api#removechatverification).

:::

## Forums, topics, and stickers

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

### Typed payloads and results

::: details createForumTopic

- Arguments: `TelegramMethodArguments<'createForumTopic'>`
- Payload: `TelegramMethodPayload<'createForumTopic'>`
- Result: `Promise<TelegramMethodResult<'createForumTopic'>>`
- Field definitions and endpoint constraints: [createForumTopic](https://core.telegram.org/bots/api#createforumtopic).

:::

::: details editForumTopic

- Arguments: `TelegramMethodArguments<'editForumTopic'>`
- Payload: `TelegramMethodPayload<'editForumTopic'>`
- Result: `Promise<TelegramMethodResult<'editForumTopic'>>`
- Field definitions and endpoint constraints: [editForumTopic](https://core.telegram.org/bots/api#editforumtopic).

:::

::: details closeForumTopic

- Arguments: `TelegramMethodArguments<'closeForumTopic'>`
- Payload: `TelegramMethodPayload<'closeForumTopic'>`
- Result: `Promise<TelegramMethodResult<'closeForumTopic'>>`
- Field definitions and endpoint constraints: [closeForumTopic](https://core.telegram.org/bots/api#closeforumtopic).

:::

::: details reopenForumTopic

- Arguments: `TelegramMethodArguments<'reopenForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenForumTopic'>`
- Result: `Promise<TelegramMethodResult<'reopenForumTopic'>>`
- Field definitions and endpoint constraints: [reopenForumTopic](https://core.telegram.org/bots/api#reopenforumtopic).

:::

::: details deleteForumTopic

- Arguments: `TelegramMethodArguments<'deleteForumTopic'>`
- Payload: `TelegramMethodPayload<'deleteForumTopic'>`
- Result: `Promise<TelegramMethodResult<'deleteForumTopic'>>`
- Field definitions and endpoint constraints: [deleteForumTopic](https://core.telegram.org/bots/api#deleteforumtopic).

:::

::: details unpinAllForumTopicMessages

- Arguments: `TelegramMethodArguments<'unpinAllForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllForumTopicMessages'>`
- Result: `Promise<TelegramMethodResult<'unpinAllForumTopicMessages'>>`
- Field definitions and endpoint constraints: [unpinAllForumTopicMessages](https://core.telegram.org/bots/api#unpinallforumtopicmessages).

:::

::: details editGeneralForumTopic

- Arguments: `TelegramMethodArguments<'editGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'editGeneralForumTopic'>`
- Result: `Promise<TelegramMethodResult<'editGeneralForumTopic'>>`
- Field definitions and endpoint constraints: [editGeneralForumTopic](https://core.telegram.org/bots/api#editgeneralforumtopic).

:::

::: details closeGeneralForumTopic

- Arguments: `TelegramMethodArguments<'closeGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'closeGeneralForumTopic'>`
- Result: `Promise<TelegramMethodResult<'closeGeneralForumTopic'>>`
- Field definitions and endpoint constraints: [closeGeneralForumTopic](https://core.telegram.org/bots/api#closegeneralforumtopic).

:::

::: details reopenGeneralForumTopic

- Arguments: `TelegramMethodArguments<'reopenGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenGeneralForumTopic'>`
- Result: `Promise<TelegramMethodResult<'reopenGeneralForumTopic'>>`
- Field definitions and endpoint constraints: [reopenGeneralForumTopic](https://core.telegram.org/bots/api#reopengeneralforumtopic).

:::

::: details hideGeneralForumTopic

- Arguments: `TelegramMethodArguments<'hideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'hideGeneralForumTopic'>`
- Result: `Promise<TelegramMethodResult<'hideGeneralForumTopic'>>`
- Field definitions and endpoint constraints: [hideGeneralForumTopic](https://core.telegram.org/bots/api#hidegeneralforumtopic).

:::

::: details unhideGeneralForumTopic

- Arguments: `TelegramMethodArguments<'unhideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'unhideGeneralForumTopic'>`
- Result: `Promise<TelegramMethodResult<'unhideGeneralForumTopic'>>`
- Field definitions and endpoint constraints: [unhideGeneralForumTopic](https://core.telegram.org/bots/api#unhidegeneralforumtopic).

:::

::: details unpinAllGeneralForumTopicMessages

- Arguments: `TelegramMethodArguments<'unpinAllGeneralForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllGeneralForumTopicMessages'>`
- Result: `Promise<TelegramMethodResult<'unpinAllGeneralForumTopicMessages'>>`
- Field definitions and endpoint constraints: [unpinAllGeneralForumTopicMessages](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages).

:::

::: details getStickerSet

- Arguments: `TelegramMethodArguments<'getStickerSet'>`
- Payload: `TelegramMethodPayload<'getStickerSet'>`
- Result: `Promise<TelegramMethodResult<'getStickerSet'>>`
- Field definitions and endpoint constraints: [getStickerSet](https://core.telegram.org/bots/api#getstickerset).

:::

::: details getCustomEmojiStickers

- Arguments: `TelegramMethodArguments<'getCustomEmojiStickers'>`
- Payload: `TelegramMethodPayload<'getCustomEmojiStickers'>`
- Result: `Promise<TelegramMethodResult<'getCustomEmojiStickers'>>`
- Field definitions and endpoint constraints: [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers).

:::

::: details uploadStickerFile

- Arguments: `TelegramMethodArguments<'uploadStickerFile'>`
- Payload: `TelegramMethodPayload<'uploadStickerFile'>`
- Result: `Promise<TelegramMethodResult<'uploadStickerFile'>>`
- Field definitions and endpoint constraints: [uploadStickerFile](https://core.telegram.org/bots/api#uploadstickerfile).

:::

::: details createNewStickerSet

- Arguments: `TelegramMethodArguments<'createNewStickerSet'>`
- Payload: `TelegramMethodPayload<'createNewStickerSet'>`
- Result: `Promise<TelegramMethodResult<'createNewStickerSet'>>`
- Field definitions and endpoint constraints: [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset).

:::

::: details addStickerToSet

- Arguments: `TelegramMethodArguments<'addStickerToSet'>`
- Payload: `TelegramMethodPayload<'addStickerToSet'>`
- Result: `Promise<TelegramMethodResult<'addStickerToSet'>>`
- Field definitions and endpoint constraints: [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset).

:::

::: details setStickerPositionInSet

- Arguments: `TelegramMethodArguments<'setStickerPositionInSet'>`
- Payload: `TelegramMethodPayload<'setStickerPositionInSet'>`
- Result: `Promise<TelegramMethodResult<'setStickerPositionInSet'>>`
- Field definitions and endpoint constraints: [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset).

:::

::: details deleteStickerFromSet

- Arguments: `TelegramMethodArguments<'deleteStickerFromSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerFromSet'>`
- Result: `Promise<TelegramMethodResult<'deleteStickerFromSet'>>`
- Field definitions and endpoint constraints: [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset).

:::

::: details replaceStickerInSet

- Arguments: `TelegramMethodArguments<'replaceStickerInSet'>`
- Payload: `TelegramMethodPayload<'replaceStickerInSet'>`
- Result: `Promise<TelegramMethodResult<'replaceStickerInSet'>>`
- Field definitions and endpoint constraints: [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset).

:::

::: details setStickerEmojiList

- Arguments: `TelegramMethodArguments<'setStickerEmojiList'>`
- Payload: `TelegramMethodPayload<'setStickerEmojiList'>`
- Result: `Promise<TelegramMethodResult<'setStickerEmojiList'>>`
- Field definitions and endpoint constraints: [setStickerEmojiList](https://core.telegram.org/bots/api#setstickeremojilist).

:::

::: details setStickerKeywords

- Arguments: `TelegramMethodArguments<'setStickerKeywords'>`
- Payload: `TelegramMethodPayload<'setStickerKeywords'>`
- Result: `Promise<TelegramMethodResult<'setStickerKeywords'>>`
- Field definitions and endpoint constraints: [setStickerKeywords](https://core.telegram.org/bots/api#setstickerkeywords).

:::

::: details setStickerMaskPosition

- Arguments: `TelegramMethodArguments<'setStickerMaskPosition'>`
- Payload: `TelegramMethodPayload<'setStickerMaskPosition'>`
- Result: `Promise<TelegramMethodResult<'setStickerMaskPosition'>>`
- Field definitions and endpoint constraints: [setStickerMaskPosition](https://core.telegram.org/bots/api#setstickermaskposition).

:::

::: details setStickerSetTitle

- Arguments: `TelegramMethodArguments<'setStickerSetTitle'>`
- Payload: `TelegramMethodPayload<'setStickerSetTitle'>`
- Result: `Promise<TelegramMethodResult<'setStickerSetTitle'>>`
- Field definitions and endpoint constraints: [setStickerSetTitle](https://core.telegram.org/bots/api#setstickersettitle).

:::

::: details deleteStickerSet

- Arguments: `TelegramMethodArguments<'deleteStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerSet'>`
- Result: `Promise<TelegramMethodResult<'deleteStickerSet'>>`
- Field definitions and endpoint constraints: [deleteStickerSet](https://core.telegram.org/bots/api#deletestickerset).

:::

::: details setStickerSetThumbnail

- Arguments: `TelegramMethodArguments<'setStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setStickerSetThumbnail'>`
- Result: `Promise<TelegramMethodResult<'setStickerSetThumbnail'>>`
- Field definitions and endpoint constraints: [setStickerSetThumbnail](https://core.telegram.org/bots/api#setstickersetthumbnail).

:::

::: details setCustomEmojiStickerSetThumbnail

- Arguments: `TelegramMethodArguments<'setCustomEmojiStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setCustomEmojiStickerSetThumbnail'>`
- Result: `Promise<TelegramMethodResult<'setCustomEmojiStickerSetThumbnail'>>`
- Field definitions and endpoint constraints: [setCustomEmojiStickerSetThumbnail](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail).

:::

::: details getForumTopicIconStickers

- Arguments: `TelegramMethodArguments<'getForumTopicIconStickers'>`
- Payload: `TelegramMethodPayload<'getForumTopicIconStickers'>`
- Result: `Promise<TelegramMethodResult<'getForumTopicIconStickers'>>`
- Field definitions and endpoint constraints: [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers).

:::

## Inline queries, Web Apps, and guest updates

- [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery)
- [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)
- [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery)
- [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage)
- [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)

### Typed payloads and results

::: details answerGuestQuery

- Arguments: `TelegramMethodArguments<'answerGuestQuery'>`
- Payload: `TelegramMethodPayload<'answerGuestQuery'>`
- Result: `Promise<TelegramMethodResult<'answerGuestQuery'>>`
- Field definitions and endpoint constraints: [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery).

:::

::: details answerInlineQuery

- Arguments: `TelegramMethodArguments<'answerInlineQuery'>`
- Payload: `TelegramMethodPayload<'answerInlineQuery'>`
- Result: `Promise<TelegramMethodResult<'answerInlineQuery'>>`
- Field definitions and endpoint constraints: [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery).

:::

::: details answerWebAppQuery

- Arguments: `TelegramMethodArguments<'answerWebAppQuery'>`
- Payload: `TelegramMethodPayload<'answerWebAppQuery'>`
- Result: `Promise<TelegramMethodResult<'answerWebAppQuery'>>`
- Field definitions and endpoint constraints: [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

:::

::: details savePreparedInlineMessage

- Arguments: `TelegramMethodArguments<'savePreparedInlineMessage'>`
- Payload: `TelegramMethodPayload<'savePreparedInlineMessage'>`
- Result: `Promise<TelegramMethodResult<'savePreparedInlineMessage'>>`
- Field definitions and endpoint constraints: [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage).

:::

::: details savePreparedKeyboardButton

- Arguments: `TelegramMethodArguments<'savePreparedKeyboardButton'>`
- Payload: `TelegramMethodPayload<'savePreparedKeyboardButton'>`
- Result: `Promise<TelegramMethodResult<'savePreparedKeyboardButton'>>`
- Field definitions and endpoint constraints: [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton).

:::

## Business and ephemeral messages

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

### Typed payloads and results

::: details getBusinessConnection

- Arguments: `TelegramMethodArguments<'getBusinessConnection'>`
- Payload: `TelegramMethodPayload<'getBusinessConnection'>`
- Result: `Promise<TelegramMethodResult<'getBusinessConnection'>>`
- Field definitions and endpoint constraints: [getBusinessConnection](https://core.telegram.org/bots/api#getbusinessconnection).

:::

::: details editEphemeralMessageText

- Arguments: `TelegramMethodArguments<'editEphemeralMessageText'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageText'>`
- Result: `Promise<TelegramMethodResult<'editEphemeralMessageText'>>`
- Field definitions and endpoint constraints: [editEphemeralMessageText](https://core.telegram.org/bots/api#editephemeralmessagetext).

:::

::: details editEphemeralMessageMedia

- Arguments: `TelegramMethodArguments<'editEphemeralMessageMedia'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageMedia'>`
- Result: `Promise<TelegramMethodResult<'editEphemeralMessageMedia'>>`
- Field definitions and endpoint constraints: [editEphemeralMessageMedia](https://core.telegram.org/bots/api#editephemeralmessagemedia).

:::

::: details editEphemeralMessageCaption

- Arguments: `TelegramMethodArguments<'editEphemeralMessageCaption'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageCaption'>`
- Result: `Promise<TelegramMethodResult<'editEphemeralMessageCaption'>>`
- Field definitions and endpoint constraints: [editEphemeralMessageCaption](https://core.telegram.org/bots/api#editephemeralmessagecaption).

:::

::: details editEphemeralMessageReplyMarkup

- Arguments: `TelegramMethodArguments<'editEphemeralMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageReplyMarkup'>`
- Result: `Promise<TelegramMethodResult<'editEphemeralMessageReplyMarkup'>>`
- Field definitions and endpoint constraints: [editEphemeralMessageReplyMarkup](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup).

:::

::: details deleteEphemeralMessage

- Arguments: `TelegramMethodArguments<'deleteEphemeralMessage'>`
- Payload: `TelegramMethodPayload<'deleteEphemeralMessage'>`
- Result: `Promise<TelegramMethodResult<'deleteEphemeralMessage'>>`
- Field definitions and endpoint constraints: [deleteEphemeralMessage](https://core.telegram.org/bots/api#deleteephemeralmessage).

:::

::: details deleteBusinessMessages

- Arguments: `TelegramMethodArguments<'deleteBusinessMessages'>`
- Payload: `TelegramMethodPayload<'deleteBusinessMessages'>`
- Result: `Promise<TelegramMethodResult<'deleteBusinessMessages'>>`
- Field definitions and endpoint constraints: [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages).

:::

::: details setBusinessAccountName

- Arguments: `TelegramMethodArguments<'setBusinessAccountName'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountName'>`
- Result: `Promise<TelegramMethodResult<'setBusinessAccountName'>>`
- Field definitions and endpoint constraints: [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname).

:::

::: details setBusinessAccountUsername

- Arguments: `TelegramMethodArguments<'setBusinessAccountUsername'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountUsername'>`
- Result: `Promise<TelegramMethodResult<'setBusinessAccountUsername'>>`
- Field definitions and endpoint constraints: [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername).

:::

::: details setBusinessAccountBio

- Arguments: `TelegramMethodArguments<'setBusinessAccountBio'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountBio'>`
- Result: `Promise<TelegramMethodResult<'setBusinessAccountBio'>>`
- Field definitions and endpoint constraints: [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio).

:::

::: details setBusinessAccountProfilePhoto

- Arguments: `TelegramMethodArguments<'setBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountProfilePhoto'>`
- Result: `Promise<TelegramMethodResult<'setBusinessAccountProfilePhoto'>>`
- Field definitions and endpoint constraints: [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto).

:::

::: details removeBusinessAccountProfilePhoto

- Arguments: `TelegramMethodArguments<'removeBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeBusinessAccountProfilePhoto'>`
- Result: `Promise<TelegramMethodResult<'removeBusinessAccountProfilePhoto'>>`
- Field definitions and endpoint constraints: [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto).

:::

::: details setBusinessAccountGiftSettings

- Arguments: `TelegramMethodArguments<'setBusinessAccountGiftSettings'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountGiftSettings'>`
- Result: `Promise<TelegramMethodResult<'setBusinessAccountGiftSettings'>>`
- Field definitions and endpoint constraints: [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings).

:::

::: details getBusinessAccountStarBalance

- Arguments: `TelegramMethodArguments<'getBusinessAccountStarBalance'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountStarBalance'>`
- Result: `Promise<TelegramMethodResult<'getBusinessAccountStarBalance'>>`
- Field definitions and endpoint constraints: [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance).

:::

::: details transferBusinessAccountStars

- Arguments: `TelegramMethodArguments<'transferBusinessAccountStars'>`
- Payload: `TelegramMethodPayload<'transferBusinessAccountStars'>`
- Result: `Promise<TelegramMethodResult<'transferBusinessAccountStars'>>`
- Field definitions and endpoint constraints: [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars).

:::

::: details getBusinessAccountGifts

- Arguments: `TelegramMethodArguments<'getBusinessAccountGifts'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountGifts'>`
- Result: `Promise<TelegramMethodResult<'getBusinessAccountGifts'>>`
- Field definitions and endpoint constraints: [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts).

:::

::: details readBusinessMessage

- Arguments: `TelegramMethodArguments<'readBusinessMessage'>`
- Payload: `TelegramMethodPayload<'readBusinessMessage'>`
- Result: `Promise<TelegramMethodResult<'readBusinessMessage'>>`
- Field definitions and endpoint constraints: [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage).

:::

## Payments, Stars, and gifts

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

### Typed payloads and results

::: details getUserGifts

- Arguments: `TelegramMethodArguments<'getUserGifts'>`
- Payload: `TelegramMethodPayload<'getUserGifts'>`
- Result: `Promise<TelegramMethodResult<'getUserGifts'>>`
- Field definitions and endpoint constraints: [getUserGifts](https://core.telegram.org/bots/api#getusergifts).

:::

::: details convertGiftToStars

- Arguments: `TelegramMethodArguments<'convertGiftToStars'>`
- Payload: `TelegramMethodPayload<'convertGiftToStars'>`
- Result: `Promise<TelegramMethodResult<'convertGiftToStars'>>`
- Field definitions and endpoint constraints: [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars).

:::

::: details upgradeGift

- Arguments: `TelegramMethodArguments<'upgradeGift'>`
- Payload: `TelegramMethodPayload<'upgradeGift'>`
- Result: `Promise<TelegramMethodResult<'upgradeGift'>>`
- Field definitions and endpoint constraints: [upgradeGift](https://core.telegram.org/bots/api#upgradegift).

:::

::: details transferGift

- Arguments: `TelegramMethodArguments<'transferGift'>`
- Payload: `TelegramMethodPayload<'transferGift'>`
- Result: `Promise<TelegramMethodResult<'transferGift'>>`
- Field definitions and endpoint constraints: [transferGift](https://core.telegram.org/bots/api#transfergift).

:::

::: details giftPremiumSubscription

- Arguments: `TelegramMethodArguments<'giftPremiumSubscription'>`
- Payload: `TelegramMethodPayload<'giftPremiumSubscription'>`
- Result: `Promise<TelegramMethodResult<'giftPremiumSubscription'>>`
- Field definitions and endpoint constraints: [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription).

:::

::: details createInvoiceLink

- Arguments: `TelegramMethodArguments<'createInvoiceLink'>`
- Payload: `TelegramMethodPayload<'createInvoiceLink'>`
- Result: `Promise<TelegramMethodResult<'createInvoiceLink'>>`
- Field definitions and endpoint constraints: [createInvoiceLink](https://core.telegram.org/bots/api#createinvoicelink).

:::

::: details answerShippingQuery

- Arguments: `TelegramMethodArguments<'answerShippingQuery'>`
- Payload: `TelegramMethodPayload<'answerShippingQuery'>`
- Result: `Promise<TelegramMethodResult<'answerShippingQuery'>>`
- Field definitions and endpoint constraints: [answerShippingQuery](https://core.telegram.org/bots/api#answershippingquery).

:::

::: details answerPreCheckoutQuery

- Arguments: `TelegramMethodArguments<'answerPreCheckoutQuery'>`
- Payload: `TelegramMethodPayload<'answerPreCheckoutQuery'>`
- Result: `Promise<TelegramMethodResult<'answerPreCheckoutQuery'>>`
- Field definitions and endpoint constraints: [answerPreCheckoutQuery](https://core.telegram.org/bots/api#answerprecheckoutquery).

:::

::: details getStarTransactions

- Arguments: `TelegramMethodArguments<'getStarTransactions'>`
- Payload: `TelegramMethodPayload<'getStarTransactions'>`
- Result: `Promise<TelegramMethodResult<'getStarTransactions'>>`
- Field definitions and endpoint constraints: [getStarTransactions](https://core.telegram.org/bots/api#getstartransactions).

:::

::: details refundStarPayment

- Arguments: `TelegramMethodArguments<'refundStarPayment'>`
- Payload: `TelegramMethodPayload<'refundStarPayment'>`
- Result: `Promise<TelegramMethodResult<'refundStarPayment'>>`
- Field definitions and endpoint constraints: [refundStarPayment](https://core.telegram.org/bots/api#refundstarpayment).

:::

::: details editUserStarSubscription

- Arguments: `TelegramMethodArguments<'editUserStarSubscription'>`
- Payload: `TelegramMethodPayload<'editUserStarSubscription'>`
- Result: `Promise<TelegramMethodResult<'editUserStarSubscription'>>`
- Field definitions and endpoint constraints: [editUserStarSubscription](https://core.telegram.org/bots/api#edituserstarsubscription).

:::

::: details getMyStarBalance

- Arguments: `TelegramMethodArguments<'getMyStarBalance'>`
- Payload: `TelegramMethodPayload<'getMyStarBalance'>`
- Result: `Promise<TelegramMethodResult<'getMyStarBalance'>>`
- Field definitions and endpoint constraints: [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance).

:::

::: details getAvailableGifts

- Arguments: `TelegramMethodArguments<'getAvailableGifts'>`
- Payload: `TelegramMethodPayload<'getAvailableGifts'>`
- Result: `Promise<TelegramMethodResult<'getAvailableGifts'>>`
- Field definitions and endpoint constraints: [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts).

:::

## Games

- [setGameScore](https://core.telegram.org/bots/api#setgamescore)
- [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores)

### Typed payloads and results

::: details setGameScore

- Arguments: `TelegramMethodArguments<'setGameScore'>`
- Payload: `TelegramMethodPayload<'setGameScore'>`
- Result: `Promise<TelegramMethodResult<'setGameScore'>>`
- Field definitions and endpoint constraints: [setGameScore](https://core.telegram.org/bots/api#setgamescore).

:::

::: details getGameHighScores

- Arguments: `TelegramMethodArguments<'getGameHighScores'>`
- Payload: `TelegramMethodPayload<'getGameHighScores'>`
- Result: `Promise<TelegramMethodResult<'getGameHighScores'>>`
- Field definitions and endpoint constraints: [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores).

:::

## Bot, files, updates, and account information

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

### Typed payloads and results

::: details getUpdates

- Arguments: `TelegramMethodArguments<'getUpdates'>`
- Payload: `TelegramMethodPayload<'getUpdates'>`
- Result: `Promise<TelegramMethodResult<'getUpdates'>>`
- Field definitions and endpoint constraints: [getUpdates](https://core.telegram.org/bots/api#getupdates).

:::

::: details setWebhook

- Arguments: `TelegramMethodArguments<'setWebhook'>`
- Payload: `TelegramMethodPayload<'setWebhook'>`
- Result: `Promise<TelegramMethodResult<'setWebhook'>>`
- Field definitions and endpoint constraints: [setWebhook](https://core.telegram.org/bots/api#setwebhook).

:::

::: details deleteWebhook

- Arguments: `TelegramMethodArguments<'deleteWebhook'>`
- Payload: `TelegramMethodPayload<'deleteWebhook'>`
- Result: `Promise<TelegramMethodResult<'deleteWebhook'>>`
- Field definitions and endpoint constraints: [deleteWebhook](https://core.telegram.org/bots/api#deletewebhook).

:::

::: details stopMessageLiveLocation

- Arguments: `TelegramMethodArguments<'stopMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'stopMessageLiveLocation'>`
- Result: `Promise<TelegramMethodResult<'stopMessageLiveLocation'>>`
- Field definitions and endpoint constraints: [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation).

:::

::: details getUserProfilePhotos

- Arguments: `TelegramMethodArguments<'getUserProfilePhotos'>`
- Payload: `TelegramMethodPayload<'getUserProfilePhotos'>`
- Result: `Promise<TelegramMethodResult<'getUserProfilePhotos'>>`
- Field definitions and endpoint constraints: [getUserProfilePhotos](https://core.telegram.org/bots/api#getuserprofilephotos).

:::

::: details getUserProfileAudios

- Arguments: `TelegramMethodArguments<'getUserProfileAudios'>`
- Payload: `TelegramMethodPayload<'getUserProfileAudios'>`
- Result: `Promise<TelegramMethodResult<'getUserProfileAudios'>>`
- Field definitions and endpoint constraints: [getUserProfileAudios](https://core.telegram.org/bots/api#getuserprofileaudios).

:::

::: details setUserEmojiStatus

- Arguments: `TelegramMethodArguments<'setUserEmojiStatus'>`
- Payload: `TelegramMethodPayload<'setUserEmojiStatus'>`
- Result: `Promise<TelegramMethodResult<'setUserEmojiStatus'>>`
- Field definitions and endpoint constraints: [setUserEmojiStatus](https://core.telegram.org/bots/api#setuseremojistatus).

:::

::: details getFile

- Arguments: `TelegramMethodArguments<'getFile'>`
- Payload: `TelegramMethodPayload<'getFile'>`
- Result: `Promise<TelegramMethodResult<'getFile'>>`
- Field definitions and endpoint constraints: [getFile](https://core.telegram.org/bots/api#getfile).

:::

::: details answerCallbackQuery

- Arguments: `TelegramMethodArguments<'answerCallbackQuery'>`
- Payload: `TelegramMethodPayload<'answerCallbackQuery'>`
- Result: `Promise<TelegramMethodResult<'answerCallbackQuery'>>`
- Field definitions and endpoint constraints: [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery).

:::

::: details getManagedBotToken

- Arguments: `TelegramMethodArguments<'getManagedBotToken'>`
- Payload: `TelegramMethodPayload<'getManagedBotToken'>`
- Result: `Promise<TelegramMethodResult<'getManagedBotToken'>>`
- Field definitions and endpoint constraints: [getManagedBotToken](https://core.telegram.org/bots/api#getmanagedbottoken).

:::

::: details replaceManagedBotToken

- Arguments: `TelegramMethodArguments<'replaceManagedBotToken'>`
- Payload: `TelegramMethodPayload<'replaceManagedBotToken'>`
- Result: `Promise<TelegramMethodResult<'replaceManagedBotToken'>>`
- Field definitions and endpoint constraints: [replaceManagedBotToken](https://core.telegram.org/bots/api#replacemanagedbottoken).

:::

::: details getManagedBotAccessSettings

- Arguments: `TelegramMethodArguments<'getManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'getManagedBotAccessSettings'>`
- Result: `Promise<TelegramMethodResult<'getManagedBotAccessSettings'>>`
- Field definitions and endpoint constraints: [getManagedBotAccessSettings](https://core.telegram.org/bots/api#getmanagedbotaccesssettings).

:::

::: details setManagedBotAccessSettings

- Arguments: `TelegramMethodArguments<'setManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'setManagedBotAccessSettings'>`
- Result: `Promise<TelegramMethodResult<'setManagedBotAccessSettings'>>`
- Field definitions and endpoint constraints: [setManagedBotAccessSettings](https://core.telegram.org/bots/api#setmanagedbotaccesssettings).

:::

::: details setMyCommands

- Arguments: `TelegramMethodArguments<'setMyCommands'>`
- Payload: `TelegramMethodPayload<'setMyCommands'>`
- Result: `Promise<TelegramMethodResult<'setMyCommands'>>`
- Field definitions and endpoint constraints: [setMyCommands](https://core.telegram.org/bots/api#setmycommands).

:::

::: details deleteMyCommands

- Arguments: `TelegramMethodArguments<'deleteMyCommands'>`
- Payload: `TelegramMethodPayload<'deleteMyCommands'>`
- Result: `Promise<TelegramMethodResult<'deleteMyCommands'>>`
- Field definitions and endpoint constraints: [deleteMyCommands](https://core.telegram.org/bots/api#deletemycommands).

:::

::: details getMyCommands

- Arguments: `TelegramMethodArguments<'getMyCommands'>`
- Payload: `TelegramMethodPayload<'getMyCommands'>`
- Result: `Promise<TelegramMethodResult<'getMyCommands'>>`
- Field definitions and endpoint constraints: [getMyCommands](https://core.telegram.org/bots/api#getmycommands).

:::

::: details setMyName

- Arguments: `TelegramMethodArguments<'setMyName'>`
- Payload: `TelegramMethodPayload<'setMyName'>`
- Result: `Promise<TelegramMethodResult<'setMyName'>>`
- Field definitions and endpoint constraints: [setMyName](https://core.telegram.org/bots/api#setmyname).

:::

::: details getMyName

- Arguments: `TelegramMethodArguments<'getMyName'>`
- Payload: `TelegramMethodPayload<'getMyName'>`
- Result: `Promise<TelegramMethodResult<'getMyName'>>`
- Field definitions and endpoint constraints: [getMyName](https://core.telegram.org/bots/api#getmyname).

:::

::: details setMyDescription

- Arguments: `TelegramMethodArguments<'setMyDescription'>`
- Payload: `TelegramMethodPayload<'setMyDescription'>`
- Result: `Promise<TelegramMethodResult<'setMyDescription'>>`
- Field definitions and endpoint constraints: [setMyDescription](https://core.telegram.org/bots/api#setmydescription).

:::

::: details getMyDescription

- Arguments: `TelegramMethodArguments<'getMyDescription'>`
- Payload: `TelegramMethodPayload<'getMyDescription'>`
- Result: `Promise<TelegramMethodResult<'getMyDescription'>>`
- Field definitions and endpoint constraints: [getMyDescription](https://core.telegram.org/bots/api#getmydescription).

:::

::: details setMyShortDescription

- Arguments: `TelegramMethodArguments<'setMyShortDescription'>`
- Payload: `TelegramMethodPayload<'setMyShortDescription'>`
- Result: `Promise<TelegramMethodResult<'setMyShortDescription'>>`
- Field definitions and endpoint constraints: [setMyShortDescription](https://core.telegram.org/bots/api#setmyshortdescription).

:::

::: details getMyShortDescription

- Arguments: `TelegramMethodArguments<'getMyShortDescription'>`
- Payload: `TelegramMethodPayload<'getMyShortDescription'>`
- Result: `Promise<TelegramMethodResult<'getMyShortDescription'>>`
- Field definitions and endpoint constraints: [getMyShortDescription](https://core.telegram.org/bots/api#getmyshortdescription).

:::

::: details setMyProfilePhoto

- Arguments: `TelegramMethodArguments<'setMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setMyProfilePhoto'>`
- Result: `Promise<TelegramMethodResult<'setMyProfilePhoto'>>`
- Field definitions and endpoint constraints: [setMyProfilePhoto](https://core.telegram.org/bots/api#setmyprofilephoto).

:::

::: details setMyDefaultAdministratorRights

- Arguments: `TelegramMethodArguments<'setMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'setMyDefaultAdministratorRights'>`
- Result: `Promise<TelegramMethodResult<'setMyDefaultAdministratorRights'>>`
- Field definitions and endpoint constraints: [setMyDefaultAdministratorRights](https://core.telegram.org/bots/api#setmydefaultadministratorrights).

:::

::: details getMyDefaultAdministratorRights

- Arguments: `TelegramMethodArguments<'getMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'getMyDefaultAdministratorRights'>`
- Result: `Promise<TelegramMethodResult<'getMyDefaultAdministratorRights'>>`
- Field definitions and endpoint constraints: [getMyDefaultAdministratorRights](https://core.telegram.org/bots/api#getmydefaultadministratorrights).

:::

::: details stopPoll

- Arguments: `TelegramMethodArguments<'stopPoll'>`
- Payload: `TelegramMethodPayload<'stopPoll'>`
- Result: `Promise<TelegramMethodResult<'stopPoll'>>`
- Field definitions and endpoint constraints: [stopPoll](https://core.telegram.org/bots/api#stoppoll).

:::

::: details deleteAllMessageReactions

- Arguments: `TelegramMethodArguments<'deleteAllMessageReactions'>`
- Payload: `TelegramMethodPayload<'deleteAllMessageReactions'>`
- Result: `Promise<TelegramMethodResult<'deleteAllMessageReactions'>>`
- Field definitions and endpoint constraints: [deleteAllMessageReactions](https://core.telegram.org/bots/api#deleteallmessagereactions).

:::

::: details postStory

- Arguments: `TelegramMethodArguments<'postStory'>`
- Payload: `TelegramMethodPayload<'postStory'>`
- Result: `Promise<TelegramMethodResult<'postStory'>>`
- Field definitions and endpoint constraints: [postStory](https://core.telegram.org/bots/api#poststory).

:::

::: details repostStory

- Arguments: `TelegramMethodArguments<'repostStory'>`
- Payload: `TelegramMethodPayload<'repostStory'>`
- Result: `Promise<TelegramMethodResult<'repostStory'>>`
- Field definitions and endpoint constraints: [repostStory](https://core.telegram.org/bots/api#repoststory).

:::

::: details editStory

- Arguments: `TelegramMethodArguments<'editStory'>`
- Payload: `TelegramMethodPayload<'editStory'>`
- Result: `Promise<TelegramMethodResult<'editStory'>>`
- Field definitions and endpoint constraints: [editStory](https://core.telegram.org/bots/api#editstory).

:::

::: details deleteStory

- Arguments: `TelegramMethodArguments<'deleteStory'>`
- Payload: `TelegramMethodPayload<'deleteStory'>`
- Result: `Promise<TelegramMethodResult<'deleteStory'>>`
- Field definitions and endpoint constraints: [deleteStory](https://core.telegram.org/bots/api#deletestory).

:::

::: details verifyUser

- Arguments: `TelegramMethodArguments<'verifyUser'>`
- Payload: `TelegramMethodPayload<'verifyUser'>`
- Result: `Promise<TelegramMethodResult<'verifyUser'>>`
- Field definitions and endpoint constraints: [verifyUser](https://core.telegram.org/bots/api#verifyuser).

:::

::: details removeUserVerification

- Arguments: `TelegramMethodArguments<'removeUserVerification'>`
- Payload: `TelegramMethodPayload<'removeUserVerification'>`
- Result: `Promise<TelegramMethodResult<'removeUserVerification'>>`
- Field definitions and endpoint constraints: [removeUserVerification](https://core.telegram.org/bots/api#removeuserverification).

:::

::: details setPassportDataErrors

- Arguments: `TelegramMethodArguments<'setPassportDataErrors'>`
- Payload: `TelegramMethodPayload<'setPassportDataErrors'>`
- Result: `Promise<TelegramMethodResult<'setPassportDataErrors'>>`
- Field definitions and endpoint constraints: [setPassportDataErrors](https://core.telegram.org/bots/api#setpassportdataerrors).

:::

::: details getWebhookInfo

- Arguments: `TelegramMethodArguments<'getWebhookInfo'>`
- Payload: `TelegramMethodPayload<'getWebhookInfo'>`
- Result: `Promise<TelegramMethodResult<'getWebhookInfo'>>`
- Field definitions and endpoint constraints: [getWebhookInfo](https://core.telegram.org/bots/api#getwebhookinfo).

:::

::: details getMe

- Arguments: `TelegramMethodArguments<'getMe'>`
- Payload: `TelegramMethodPayload<'getMe'>`
- Result: `Promise<TelegramMethodResult<'getMe'>>`
- Field definitions and endpoint constraints: [getMe](https://core.telegram.org/bots/api#getme).

:::

::: details logOut

- Arguments: `TelegramMethodArguments<'logOut'>`
- Payload: `TelegramMethodPayload<'logOut'>`
- Result: `Promise<TelegramMethodResult<'logOut'>>`
- Field definitions and endpoint constraints: [logOut](https://core.telegram.org/bots/api#logout).

:::

::: details close

- Arguments: `TelegramMethodArguments<'close'>`
- Payload: `TelegramMethodPayload<'close'>`
- Result: `Promise<TelegramMethodResult<'close'>>`
- Field definitions and endpoint constraints: [close](https://core.telegram.org/bots/api#close).

:::

::: details removeMyProfilePhoto

- Arguments: `TelegramMethodArguments<'removeMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeMyProfilePhoto'>`
- Result: `Promise<TelegramMethodResult<'removeMyProfilePhoto'>>`
- Field definitions and endpoint constraints: [removeMyProfilePhoto](https://core.telegram.org/bots/api#removemyprofilephoto).

:::

## Related references

- [Bot API reference](/en/reference/api)
- [TypeScript](/en/reference/typescript)
- [Bot options](/en/reference/options)
