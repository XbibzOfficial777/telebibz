---
title: Daftar metode Bot API
description: Daftar metode Bot API yang dikenali TeleBibz.
---

# Daftar metode Bot API

Registry TeleBibz mencakup **185 nama metode**. Daftar ini dibuat otomatis dari source saat build.

> Nama metode tidak menjamin endpoint dapat digunakan tanpa syarat. Izin, chat, update, dan batasan Telegram tetap berlaku.

## Pemanggilan

```js
await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'Hello' });
await bot.api.getMe();
```

Daftar berikut dibuat dari registry dan deklarasi package. Setiap entri menghubungkan tuple argumen, payload, dan hasil yang dapat diperiksa IDE; gunakan link Telegram untuk deskripsi field dan batasan endpoint.

## Pesan, media, dan reaksi

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

### Payload dan hasil bertipe

::: details sendMessage

- Argumen: `TelegramMethodArguments<'sendMessage'>`
- Payload: `TelegramMethodPayload<'sendMessage'>`
- Hasil: `Promise<TelegramMethodResult<'sendMessage'>>`
- Field dan batasan endpoint: [sendMessage](https://core.telegram.org/bots/api#sendmessage).

:::

::: details sendRichMessage

- Argumen: `TelegramMethodArguments<'sendRichMessage'>`
- Payload: `TelegramMethodPayload<'sendRichMessage'>`
- Hasil: `Promise<TelegramMethodResult<'sendRichMessage'>>`
- Field dan batasan endpoint: [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage).

:::

::: details forwardMessage

- Argumen: `TelegramMethodArguments<'forwardMessage'>`
- Payload: `TelegramMethodPayload<'forwardMessage'>`
- Hasil: `Promise<TelegramMethodResult<'forwardMessage'>>`
- Field dan batasan endpoint: [forwardMessage](https://core.telegram.org/bots/api#forwardmessage).

:::

::: details forwardMessages

- Argumen: `TelegramMethodArguments<'forwardMessages'>`
- Payload: `TelegramMethodPayload<'forwardMessages'>`
- Hasil: `Promise<TelegramMethodResult<'forwardMessages'>>`
- Field dan batasan endpoint: [forwardMessages](https://core.telegram.org/bots/api#forwardmessages).

:::

::: details copyMessage

- Argumen: `TelegramMethodArguments<'copyMessage'>`
- Payload: `TelegramMethodPayload<'copyMessage'>`
- Hasil: `Promise<TelegramMethodResult<'copyMessage'>>`
- Field dan batasan endpoint: [copyMessage](https://core.telegram.org/bots/api#copymessage).

:::

::: details copyMessages

- Argumen: `TelegramMethodArguments<'copyMessages'>`
- Payload: `TelegramMethodPayload<'copyMessages'>`
- Hasil: `Promise<TelegramMethodResult<'copyMessages'>>`
- Field dan batasan endpoint: [copyMessages](https://core.telegram.org/bots/api#copymessages).

:::

::: details sendPhoto

- Argumen: `TelegramMethodArguments<'sendPhoto'>`
- Payload: `TelegramMethodPayload<'sendPhoto'>`
- Hasil: `Promise<TelegramMethodResult<'sendPhoto'>>`
- Field dan batasan endpoint: [sendPhoto](https://core.telegram.org/bots/api#sendphoto).

:::

::: details sendLivePhoto

- Argumen: `TelegramMethodArguments<'sendLivePhoto'>`
- Payload: `TelegramMethodPayload<'sendLivePhoto'>`
- Hasil: `Promise<TelegramMethodResult<'sendLivePhoto'>>`
- Field dan batasan endpoint: [sendLivePhoto](https://core.telegram.org/bots/api#sendlivephoto).

:::

::: details sendAudio

- Argumen: `TelegramMethodArguments<'sendAudio'>`
- Payload: `TelegramMethodPayload<'sendAudio'>`
- Hasil: `Promise<TelegramMethodResult<'sendAudio'>>`
- Field dan batasan endpoint: [sendAudio](https://core.telegram.org/bots/api#sendaudio).

:::

::: details sendDocument

- Argumen: `TelegramMethodArguments<'sendDocument'>`
- Payload: `TelegramMethodPayload<'sendDocument'>`
- Hasil: `Promise<TelegramMethodResult<'sendDocument'>>`
- Field dan batasan endpoint: [sendDocument](https://core.telegram.org/bots/api#senddocument).

:::

::: details sendVideo

- Argumen: `TelegramMethodArguments<'sendVideo'>`
- Payload: `TelegramMethodPayload<'sendVideo'>`
- Hasil: `Promise<TelegramMethodResult<'sendVideo'>>`
- Field dan batasan endpoint: [sendVideo](https://core.telegram.org/bots/api#sendvideo).

:::

::: details sendAnimation

- Argumen: `TelegramMethodArguments<'sendAnimation'>`
- Payload: `TelegramMethodPayload<'sendAnimation'>`
- Hasil: `Promise<TelegramMethodResult<'sendAnimation'>>`
- Field dan batasan endpoint: [sendAnimation](https://core.telegram.org/bots/api#sendanimation).

:::

::: details sendVoice

- Argumen: `TelegramMethodArguments<'sendVoice'>`
- Payload: `TelegramMethodPayload<'sendVoice'>`
- Hasil: `Promise<TelegramMethodResult<'sendVoice'>>`
- Field dan batasan endpoint: [sendVoice](https://core.telegram.org/bots/api#sendvoice).

:::

::: details sendVideoNote

- Argumen: `TelegramMethodArguments<'sendVideoNote'>`
- Payload: `TelegramMethodPayload<'sendVideoNote'>`
- Hasil: `Promise<TelegramMethodResult<'sendVideoNote'>>`
- Field dan batasan endpoint: [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote).

:::

::: details sendPaidMedia

- Argumen: `TelegramMethodArguments<'sendPaidMedia'>`
- Payload: `TelegramMethodPayload<'sendPaidMedia'>`
- Hasil: `Promise<TelegramMethodResult<'sendPaidMedia'>>`
- Field dan batasan endpoint: [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia).

:::

::: details sendMediaGroup

- Argumen: `TelegramMethodArguments<'sendMediaGroup'>`
- Payload: `TelegramMethodPayload<'sendMediaGroup'>`
- Hasil: `Promise<TelegramMethodResult<'sendMediaGroup'>>`
- Field dan batasan endpoint: [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup).

:::

::: details sendLocation

- Argumen: `TelegramMethodArguments<'sendLocation'>`
- Payload: `TelegramMethodPayload<'sendLocation'>`
- Hasil: `Promise<TelegramMethodResult<'sendLocation'>>`
- Field dan batasan endpoint: [sendLocation](https://core.telegram.org/bots/api#sendlocation).

:::

::: details editMessageLiveLocation

- Argumen: `TelegramMethodArguments<'editMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'editMessageLiveLocation'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageLiveLocation'>>`
- Field dan batasan endpoint: [editMessageLiveLocation](https://core.telegram.org/bots/api#editmessagelivelocation).

:::

::: details sendVenue

- Argumen: `TelegramMethodArguments<'sendVenue'>`
- Payload: `TelegramMethodPayload<'sendVenue'>`
- Hasil: `Promise<TelegramMethodResult<'sendVenue'>>`
- Field dan batasan endpoint: [sendVenue](https://core.telegram.org/bots/api#sendvenue).

:::

::: details sendContact

- Argumen: `TelegramMethodArguments<'sendContact'>`
- Payload: `TelegramMethodPayload<'sendContact'>`
- Hasil: `Promise<TelegramMethodResult<'sendContact'>>`
- Field dan batasan endpoint: [sendContact](https://core.telegram.org/bots/api#sendcontact).

:::

::: details sendPoll

- Argumen: `TelegramMethodArguments<'sendPoll'>`
- Payload: `TelegramMethodPayload<'sendPoll'>`
- Hasil: `Promise<TelegramMethodResult<'sendPoll'>>`
- Field dan batasan endpoint: [sendPoll](https://core.telegram.org/bots/api#sendpoll).

:::

::: details sendChecklist

- Argumen: `TelegramMethodArguments<'sendChecklist'>`
- Payload: `TelegramMethodPayload<'sendChecklist'>`
- Hasil: `Promise<TelegramMethodResult<'sendChecklist'>>`
- Field dan batasan endpoint: [sendChecklist](https://core.telegram.org/bots/api#sendchecklist).

:::

::: details editMessageChecklist

- Argumen: `TelegramMethodArguments<'editMessageChecklist'>`
- Payload: `TelegramMethodPayload<'editMessageChecklist'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageChecklist'>>`
- Field dan batasan endpoint: [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist).

:::

::: details sendDice

- Argumen: `TelegramMethodArguments<'sendDice'>`
- Payload: `TelegramMethodPayload<'sendDice'>`
- Hasil: `Promise<TelegramMethodResult<'sendDice'>>`
- Field dan batasan endpoint: [sendDice](https://core.telegram.org/bots/api#senddice).

:::

::: details sendMessageDraft

- Argumen: `TelegramMethodArguments<'sendMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendMessageDraft'>`
- Hasil: `Promise<TelegramMethodResult<'sendMessageDraft'>>`
- Field dan batasan endpoint: [sendMessageDraft](https://core.telegram.org/bots/api#sendmessagedraft).

:::

::: details sendRichMessageDraft

- Argumen: `TelegramMethodArguments<'sendRichMessageDraft'>`
- Payload: `TelegramMethodPayload<'sendRichMessageDraft'>`
- Hasil: `Promise<TelegramMethodResult<'sendRichMessageDraft'>>`
- Field dan batasan endpoint: [sendRichMessageDraft](https://core.telegram.org/bots/api#sendrichmessagedraft).

:::

::: details sendChatAction

- Argumen: `TelegramMethodArguments<'sendChatAction'>`
- Payload: `TelegramMethodPayload<'sendChatAction'>`
- Hasil: `Promise<TelegramMethodResult<'sendChatAction'>>`
- Field dan batasan endpoint: [sendChatAction](https://core.telegram.org/bots/api#sendchataction).

:::

::: details setMessageReaction

- Argumen: `TelegramMethodArguments<'setMessageReaction'>`
- Payload: `TelegramMethodPayload<'setMessageReaction'>`
- Hasil: `Promise<TelegramMethodResult<'setMessageReaction'>>`
- Field dan batasan endpoint: [setMessageReaction](https://core.telegram.org/bots/api#setmessagereaction).

:::

::: details sendChatJoinRequestWebApp

- Argumen: `TelegramMethodArguments<'sendChatJoinRequestWebApp'>`
- Payload: `TelegramMethodPayload<'sendChatJoinRequestWebApp'>`
- Hasil: `Promise<TelegramMethodResult<'sendChatJoinRequestWebApp'>>`
- Field dan batasan endpoint: [sendChatJoinRequestWebApp](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp).

:::

::: details editMessageText

- Argumen: `TelegramMethodArguments<'editMessageText'>`
- Payload: `TelegramMethodPayload<'editMessageText'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageText'>>`
- Field dan batasan endpoint: [editMessageText](https://core.telegram.org/bots/api#editmessagetext).

:::

::: details editMessageCaption

- Argumen: `TelegramMethodArguments<'editMessageCaption'>`
- Payload: `TelegramMethodPayload<'editMessageCaption'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageCaption'>>`
- Field dan batasan endpoint: [editMessageCaption](https://core.telegram.org/bots/api#editmessagecaption).

:::

::: details editMessageMedia

- Argumen: `TelegramMethodArguments<'editMessageMedia'>`
- Payload: `TelegramMethodPayload<'editMessageMedia'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageMedia'>>`
- Field dan batasan endpoint: [editMessageMedia](https://core.telegram.org/bots/api#editmessagemedia).

:::

::: details editMessageReplyMarkup

- Argumen: `TelegramMethodArguments<'editMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editMessageReplyMarkup'>`
- Hasil: `Promise<TelegramMethodResult<'editMessageReplyMarkup'>>`
- Field dan batasan endpoint: [editMessageReplyMarkup](https://core.telegram.org/bots/api#editmessagereplymarkup).

:::

::: details deleteMessage

- Argumen: `TelegramMethodArguments<'deleteMessage'>`
- Payload: `TelegramMethodPayload<'deleteMessage'>`
- Hasil: `Promise<TelegramMethodResult<'deleteMessage'>>`
- Field dan batasan endpoint: [deleteMessage](https://core.telegram.org/bots/api#deletemessage).

:::

::: details deleteMessages

- Argumen: `TelegramMethodArguments<'deleteMessages'>`
- Payload: `TelegramMethodPayload<'deleteMessages'>`
- Hasil: `Promise<TelegramMethodResult<'deleteMessages'>>`
- Field dan batasan endpoint: [deleteMessages](https://core.telegram.org/bots/api#deletemessages).

:::

::: details deleteMessageReaction

- Argumen: `TelegramMethodArguments<'deleteMessageReaction'>`
- Payload: `TelegramMethodPayload<'deleteMessageReaction'>`
- Hasil: `Promise<TelegramMethodResult<'deleteMessageReaction'>>`
- Field dan batasan endpoint: [deleteMessageReaction](https://core.telegram.org/bots/api#deletemessagereaction).

:::

::: details sendSticker

- Argumen: `TelegramMethodArguments<'sendSticker'>`
- Payload: `TelegramMethodPayload<'sendSticker'>`
- Hasil: `Promise<TelegramMethodResult<'sendSticker'>>`
- Field dan batasan endpoint: [sendSticker](https://core.telegram.org/bots/api#sendsticker).

:::

::: details sendGift

- Argumen: `TelegramMethodArguments<'sendGift'>`
- Payload: `TelegramMethodPayload<'sendGift'>`
- Hasil: `Promise<TelegramMethodResult<'sendGift'>>`
- Field dan batasan endpoint: [sendGift](https://core.telegram.org/bots/api#sendgift).

:::

::: details sendInvoice

- Argumen: `TelegramMethodArguments<'sendInvoice'>`
- Payload: `TelegramMethodPayload<'sendInvoice'>`
- Hasil: `Promise<TelegramMethodResult<'sendInvoice'>>`
- Field dan batasan endpoint: [sendInvoice](https://core.telegram.org/bots/api#sendinvoice).

:::

::: details sendGame

- Argumen: `TelegramMethodArguments<'sendGame'>`
- Payload: `TelegramMethodPayload<'sendGame'>`
- Hasil: `Promise<TelegramMethodResult<'sendGame'>>`
- Field dan batasan endpoint: [sendGame](https://core.telegram.org/bots/api#sendgame).

:::

## Chat, anggota, dan administrasi

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

### Payload dan hasil bertipe

::: details banChatMember

- Argumen: `TelegramMethodArguments<'banChatMember'>`
- Payload: `TelegramMethodPayload<'banChatMember'>`
- Hasil: `Promise<TelegramMethodResult<'banChatMember'>>`
- Field dan batasan endpoint: [banChatMember](https://core.telegram.org/bots/api#banchatmember).

:::

::: details unbanChatMember

- Argumen: `TelegramMethodArguments<'unbanChatMember'>`
- Payload: `TelegramMethodPayload<'unbanChatMember'>`
- Hasil: `Promise<TelegramMethodResult<'unbanChatMember'>>`
- Field dan batasan endpoint: [unbanChatMember](https://core.telegram.org/bots/api#unbanchatmember).

:::

::: details restrictChatMember

- Argumen: `TelegramMethodArguments<'restrictChatMember'>`
- Payload: `TelegramMethodPayload<'restrictChatMember'>`
- Hasil: `Promise<TelegramMethodResult<'restrictChatMember'>>`
- Field dan batasan endpoint: [restrictChatMember](https://core.telegram.org/bots/api#restrictchatmember).

:::

::: details promoteChatMember

- Argumen: `TelegramMethodArguments<'promoteChatMember'>`
- Payload: `TelegramMethodPayload<'promoteChatMember'>`
- Hasil: `Promise<TelegramMethodResult<'promoteChatMember'>>`
- Field dan batasan endpoint: [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember).

:::

::: details setChatAdministratorCustomTitle

- Argumen: `TelegramMethodArguments<'setChatAdministratorCustomTitle'>`
- Payload: `TelegramMethodPayload<'setChatAdministratorCustomTitle'>`
- Hasil: `Promise<TelegramMethodResult<'setChatAdministratorCustomTitle'>>`
- Field dan batasan endpoint: [setChatAdministratorCustomTitle](https://core.telegram.org/bots/api#setchatadministratorcustomtitle).

:::

::: details setChatMemberTag

- Argumen: `TelegramMethodArguments<'setChatMemberTag'>`
- Payload: `TelegramMethodPayload<'setChatMemberTag'>`
- Hasil: `Promise<TelegramMethodResult<'setChatMemberTag'>>`
- Field dan batasan endpoint: [setChatMemberTag](https://core.telegram.org/bots/api#setchatmembertag).

:::

::: details banChatSenderChat

- Argumen: `TelegramMethodArguments<'banChatSenderChat'>`
- Payload: `TelegramMethodPayload<'banChatSenderChat'>`
- Hasil: `Promise<TelegramMethodResult<'banChatSenderChat'>>`
- Field dan batasan endpoint: [banChatSenderChat](https://core.telegram.org/bots/api#banchatsenderchat).

:::

::: details unbanChatSenderChat

- Argumen: `TelegramMethodArguments<'unbanChatSenderChat'>`
- Payload: `TelegramMethodPayload<'unbanChatSenderChat'>`
- Hasil: `Promise<TelegramMethodResult<'unbanChatSenderChat'>>`
- Field dan batasan endpoint: [unbanChatSenderChat](https://core.telegram.org/bots/api#unbanchatsenderchat).

:::

::: details setChatPermissions

- Argumen: `TelegramMethodArguments<'setChatPermissions'>`
- Payload: `TelegramMethodPayload<'setChatPermissions'>`
- Hasil: `Promise<TelegramMethodResult<'setChatPermissions'>>`
- Field dan batasan endpoint: [setChatPermissions](https://core.telegram.org/bots/api#setchatpermissions).

:::

::: details exportChatInviteLink

- Argumen: `TelegramMethodArguments<'exportChatInviteLink'>`
- Payload: `TelegramMethodPayload<'exportChatInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'exportChatInviteLink'>>`
- Field dan batasan endpoint: [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink).

:::

::: details createChatInviteLink

- Argumen: `TelegramMethodArguments<'createChatInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'createChatInviteLink'>>`
- Field dan batasan endpoint: [createChatInviteLink](https://core.telegram.org/bots/api#createchatinvitelink).

:::

::: details editChatInviteLink

- Argumen: `TelegramMethodArguments<'editChatInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'editChatInviteLink'>>`
- Field dan batasan endpoint: [editChatInviteLink](https://core.telegram.org/bots/api#editchatinvitelink).

:::

::: details createChatSubscriptionInviteLink

- Argumen: `TelegramMethodArguments<'createChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'createChatSubscriptionInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'createChatSubscriptionInviteLink'>>`
- Field dan batasan endpoint: [createChatSubscriptionInviteLink](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink).

:::

::: details editChatSubscriptionInviteLink

- Argumen: `TelegramMethodArguments<'editChatSubscriptionInviteLink'>`
- Payload: `TelegramMethodPayload<'editChatSubscriptionInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'editChatSubscriptionInviteLink'>>`
- Field dan batasan endpoint: [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink).

:::

::: details revokeChatInviteLink

- Argumen: `TelegramMethodArguments<'revokeChatInviteLink'>`
- Payload: `TelegramMethodPayload<'revokeChatInviteLink'>`
- Hasil: `Promise<TelegramMethodResult<'revokeChatInviteLink'>>`
- Field dan batasan endpoint: [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink).

:::

::: details approveChatJoinRequest

- Argumen: `TelegramMethodArguments<'approveChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'approveChatJoinRequest'>`
- Hasil: `Promise<TelegramMethodResult<'approveChatJoinRequest'>>`
- Field dan batasan endpoint: [approveChatJoinRequest](https://core.telegram.org/bots/api#approvechatjoinrequest).

:::

::: details declineChatJoinRequest

- Argumen: `TelegramMethodArguments<'declineChatJoinRequest'>`
- Payload: `TelegramMethodPayload<'declineChatJoinRequest'>`
- Hasil: `Promise<TelegramMethodResult<'declineChatJoinRequest'>>`
- Field dan batasan endpoint: [declineChatJoinRequest](https://core.telegram.org/bots/api#declinechatjoinrequest).

:::

::: details answerChatJoinRequestQuery

- Argumen: `TelegramMethodArguments<'answerChatJoinRequestQuery'>`
- Payload: `TelegramMethodPayload<'answerChatJoinRequestQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerChatJoinRequestQuery'>>`
- Field dan batasan endpoint: [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery).

:::

::: details approveSuggestedPost

- Argumen: `TelegramMethodArguments<'approveSuggestedPost'>`
- Payload: `TelegramMethodPayload<'approveSuggestedPost'>`
- Hasil: `Promise<TelegramMethodResult<'approveSuggestedPost'>>`
- Field dan batasan endpoint: [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost).

:::

::: details declineSuggestedPost

- Argumen: `TelegramMethodArguments<'declineSuggestedPost'>`
- Payload: `TelegramMethodPayload<'declineSuggestedPost'>`
- Hasil: `Promise<TelegramMethodResult<'declineSuggestedPost'>>`
- Field dan batasan endpoint: [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost).

:::

::: details setChatPhoto

- Argumen: `TelegramMethodArguments<'setChatPhoto'>`
- Payload: `TelegramMethodPayload<'setChatPhoto'>`
- Hasil: `Promise<TelegramMethodResult<'setChatPhoto'>>`
- Field dan batasan endpoint: [setChatPhoto](https://core.telegram.org/bots/api#setchatphoto).

:::

::: details deleteChatPhoto

- Argumen: `TelegramMethodArguments<'deleteChatPhoto'>`
- Payload: `TelegramMethodPayload<'deleteChatPhoto'>`
- Hasil: `Promise<TelegramMethodResult<'deleteChatPhoto'>>`
- Field dan batasan endpoint: [deleteChatPhoto](https://core.telegram.org/bots/api#deletechatphoto).

:::

::: details setChatTitle

- Argumen: `TelegramMethodArguments<'setChatTitle'>`
- Payload: `TelegramMethodPayload<'setChatTitle'>`
- Hasil: `Promise<TelegramMethodResult<'setChatTitle'>>`
- Field dan batasan endpoint: [setChatTitle](https://core.telegram.org/bots/api#setchattitle).

:::

::: details setChatDescription

- Argumen: `TelegramMethodArguments<'setChatDescription'>`
- Payload: `TelegramMethodPayload<'setChatDescription'>`
- Hasil: `Promise<TelegramMethodResult<'setChatDescription'>>`
- Field dan batasan endpoint: [setChatDescription](https://core.telegram.org/bots/api#setchatdescription).

:::

::: details pinChatMessage

- Argumen: `TelegramMethodArguments<'pinChatMessage'>`
- Payload: `TelegramMethodPayload<'pinChatMessage'>`
- Hasil: `Promise<TelegramMethodResult<'pinChatMessage'>>`
- Field dan batasan endpoint: [pinChatMessage](https://core.telegram.org/bots/api#pinchatmessage).

:::

::: details unpinChatMessage

- Argumen: `TelegramMethodArguments<'unpinChatMessage'>`
- Payload: `TelegramMethodPayload<'unpinChatMessage'>`
- Hasil: `Promise<TelegramMethodResult<'unpinChatMessage'>>`
- Field dan batasan endpoint: [unpinChatMessage](https://core.telegram.org/bots/api#unpinchatmessage).

:::

::: details unpinAllChatMessages

- Argumen: `TelegramMethodArguments<'unpinAllChatMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllChatMessages'>`
- Hasil: `Promise<TelegramMethodResult<'unpinAllChatMessages'>>`
- Field dan batasan endpoint: [unpinAllChatMessages](https://core.telegram.org/bots/api#unpinallchatmessages).

:::

::: details leaveChat

- Argumen: `TelegramMethodArguments<'leaveChat'>`
- Payload: `TelegramMethodPayload<'leaveChat'>`
- Hasil: `Promise<TelegramMethodResult<'leaveChat'>>`
- Field dan batasan endpoint: [leaveChat](https://core.telegram.org/bots/api#leavechat).

:::

::: details getChat

- Argumen: `TelegramMethodArguments<'getChat'>`
- Payload: `TelegramMethodPayload<'getChat'>`
- Hasil: `Promise<TelegramMethodResult<'getChat'>>`
- Field dan batasan endpoint: [getChat](https://core.telegram.org/bots/api#getchat).

:::

::: details getChatAdministrators

- Argumen: `TelegramMethodArguments<'getChatAdministrators'>`
- Payload: `TelegramMethodPayload<'getChatAdministrators'>`
- Hasil: `Promise<TelegramMethodResult<'getChatAdministrators'>>`
- Field dan batasan endpoint: [getChatAdministrators](https://core.telegram.org/bots/api#getchatadministrators).

:::

::: details getChatMemberCount

- Argumen: `TelegramMethodArguments<'getChatMemberCount'>`
- Payload: `TelegramMethodPayload<'getChatMemberCount'>`
- Hasil: `Promise<TelegramMethodResult<'getChatMemberCount'>>`
- Field dan batasan endpoint: [getChatMemberCount](https://core.telegram.org/bots/api#getchatmembercount).

:::

::: details getChatMember

- Argumen: `TelegramMethodArguments<'getChatMember'>`
- Payload: `TelegramMethodPayload<'getChatMember'>`
- Hasil: `Promise<TelegramMethodResult<'getChatMember'>>`
- Field dan batasan endpoint: [getChatMember](https://core.telegram.org/bots/api#getchatmember).

:::

::: details getUserPersonalChatMessages

- Argumen: `TelegramMethodArguments<'getUserPersonalChatMessages'>`
- Payload: `TelegramMethodPayload<'getUserPersonalChatMessages'>`
- Hasil: `Promise<TelegramMethodResult<'getUserPersonalChatMessages'>>`
- Field dan batasan endpoint: [getUserPersonalChatMessages](https://core.telegram.org/bots/api#getuserpersonalchatmessages).

:::

::: details setChatStickerSet

- Argumen: `TelegramMethodArguments<'setChatStickerSet'>`
- Payload: `TelegramMethodPayload<'setChatStickerSet'>`
- Hasil: `Promise<TelegramMethodResult<'setChatStickerSet'>>`
- Field dan batasan endpoint: [setChatStickerSet](https://core.telegram.org/bots/api#setchatstickerset).

:::

::: details deleteChatStickerSet

- Argumen: `TelegramMethodArguments<'deleteChatStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteChatStickerSet'>`
- Hasil: `Promise<TelegramMethodResult<'deleteChatStickerSet'>>`
- Field dan batasan endpoint: [deleteChatStickerSet](https://core.telegram.org/bots/api#deletechatstickerset).

:::

::: details getUserChatBoosts

- Argumen: `TelegramMethodArguments<'getUserChatBoosts'>`
- Payload: `TelegramMethodPayload<'getUserChatBoosts'>`
- Hasil: `Promise<TelegramMethodResult<'getUserChatBoosts'>>`
- Field dan batasan endpoint: [getUserChatBoosts](https://core.telegram.org/bots/api#getuserchatboosts).

:::

::: details getChatGifts

- Argumen: `TelegramMethodArguments<'getChatGifts'>`
- Payload: `TelegramMethodPayload<'getChatGifts'>`
- Hasil: `Promise<TelegramMethodResult<'getChatGifts'>>`
- Field dan batasan endpoint: [getChatGifts](https://core.telegram.org/bots/api#getchatgifts).

:::

::: details setChatMenuButton

- Argumen: `TelegramMethodArguments<'setChatMenuButton'>`
- Payload: `TelegramMethodPayload<'setChatMenuButton'>`
- Hasil: `Promise<TelegramMethodResult<'setChatMenuButton'>>`
- Field dan batasan endpoint: [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton).

:::

::: details getChatMenuButton

- Argumen: `TelegramMethodArguments<'getChatMenuButton'>`
- Payload: `TelegramMethodPayload<'getChatMenuButton'>`
- Hasil: `Promise<TelegramMethodResult<'getChatMenuButton'>>`
- Field dan batasan endpoint: [getChatMenuButton](https://core.telegram.org/bots/api#getchatmenubutton).

:::

::: details verifyChat

- Argumen: `TelegramMethodArguments<'verifyChat'>`
- Payload: `TelegramMethodPayload<'verifyChat'>`
- Hasil: `Promise<TelegramMethodResult<'verifyChat'>>`
- Field dan batasan endpoint: [verifyChat](https://core.telegram.org/bots/api#verifychat).

:::

::: details removeChatVerification

- Argumen: `TelegramMethodArguments<'removeChatVerification'>`
- Payload: `TelegramMethodPayload<'removeChatVerification'>`
- Hasil: `Promise<TelegramMethodResult<'removeChatVerification'>>`
- Field dan batasan endpoint: [removeChatVerification](https://core.telegram.org/bots/api#removechatverification).

:::

## Forum, topik, dan sticker

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

### Payload dan hasil bertipe

::: details createForumTopic

- Argumen: `TelegramMethodArguments<'createForumTopic'>`
- Payload: `TelegramMethodPayload<'createForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'createForumTopic'>>`
- Field dan batasan endpoint: [createForumTopic](https://core.telegram.org/bots/api#createforumtopic).

:::

::: details editForumTopic

- Argumen: `TelegramMethodArguments<'editForumTopic'>`
- Payload: `TelegramMethodPayload<'editForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'editForumTopic'>>`
- Field dan batasan endpoint: [editForumTopic](https://core.telegram.org/bots/api#editforumtopic).

:::

::: details closeForumTopic

- Argumen: `TelegramMethodArguments<'closeForumTopic'>`
- Payload: `TelegramMethodPayload<'closeForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'closeForumTopic'>>`
- Field dan batasan endpoint: [closeForumTopic](https://core.telegram.org/bots/api#closeforumtopic).

:::

::: details reopenForumTopic

- Argumen: `TelegramMethodArguments<'reopenForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'reopenForumTopic'>>`
- Field dan batasan endpoint: [reopenForumTopic](https://core.telegram.org/bots/api#reopenforumtopic).

:::

::: details deleteForumTopic

- Argumen: `TelegramMethodArguments<'deleteForumTopic'>`
- Payload: `TelegramMethodPayload<'deleteForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'deleteForumTopic'>>`
- Field dan batasan endpoint: [deleteForumTopic](https://core.telegram.org/bots/api#deleteforumtopic).

:::

::: details unpinAllForumTopicMessages

- Argumen: `TelegramMethodArguments<'unpinAllForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllForumTopicMessages'>`
- Hasil: `Promise<TelegramMethodResult<'unpinAllForumTopicMessages'>>`
- Field dan batasan endpoint: [unpinAllForumTopicMessages](https://core.telegram.org/bots/api#unpinallforumtopicmessages).

:::

::: details editGeneralForumTopic

- Argumen: `TelegramMethodArguments<'editGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'editGeneralForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'editGeneralForumTopic'>>`
- Field dan batasan endpoint: [editGeneralForumTopic](https://core.telegram.org/bots/api#editgeneralforumtopic).

:::

::: details closeGeneralForumTopic

- Argumen: `TelegramMethodArguments<'closeGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'closeGeneralForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'closeGeneralForumTopic'>>`
- Field dan batasan endpoint: [closeGeneralForumTopic](https://core.telegram.org/bots/api#closegeneralforumtopic).

:::

::: details reopenGeneralForumTopic

- Argumen: `TelegramMethodArguments<'reopenGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'reopenGeneralForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'reopenGeneralForumTopic'>>`
- Field dan batasan endpoint: [reopenGeneralForumTopic](https://core.telegram.org/bots/api#reopengeneralforumtopic).

:::

::: details hideGeneralForumTopic

- Argumen: `TelegramMethodArguments<'hideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'hideGeneralForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'hideGeneralForumTopic'>>`
- Field dan batasan endpoint: [hideGeneralForumTopic](https://core.telegram.org/bots/api#hidegeneralforumtopic).

:::

::: details unhideGeneralForumTopic

- Argumen: `TelegramMethodArguments<'unhideGeneralForumTopic'>`
- Payload: `TelegramMethodPayload<'unhideGeneralForumTopic'>`
- Hasil: `Promise<TelegramMethodResult<'unhideGeneralForumTopic'>>`
- Field dan batasan endpoint: [unhideGeneralForumTopic](https://core.telegram.org/bots/api#unhidegeneralforumtopic).

:::

::: details unpinAllGeneralForumTopicMessages

- Argumen: `TelegramMethodArguments<'unpinAllGeneralForumTopicMessages'>`
- Payload: `TelegramMethodPayload<'unpinAllGeneralForumTopicMessages'>`
- Hasil: `Promise<TelegramMethodResult<'unpinAllGeneralForumTopicMessages'>>`
- Field dan batasan endpoint: [unpinAllGeneralForumTopicMessages](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages).

:::

::: details getStickerSet

- Argumen: `TelegramMethodArguments<'getStickerSet'>`
- Payload: `TelegramMethodPayload<'getStickerSet'>`
- Hasil: `Promise<TelegramMethodResult<'getStickerSet'>>`
- Field dan batasan endpoint: [getStickerSet](https://core.telegram.org/bots/api#getstickerset).

:::

::: details getCustomEmojiStickers

- Argumen: `TelegramMethodArguments<'getCustomEmojiStickers'>`
- Payload: `TelegramMethodPayload<'getCustomEmojiStickers'>`
- Hasil: `Promise<TelegramMethodResult<'getCustomEmojiStickers'>>`
- Field dan batasan endpoint: [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers).

:::

::: details uploadStickerFile

- Argumen: `TelegramMethodArguments<'uploadStickerFile'>`
- Payload: `TelegramMethodPayload<'uploadStickerFile'>`
- Hasil: `Promise<TelegramMethodResult<'uploadStickerFile'>>`
- Field dan batasan endpoint: [uploadStickerFile](https://core.telegram.org/bots/api#uploadstickerfile).

:::

::: details createNewStickerSet

- Argumen: `TelegramMethodArguments<'createNewStickerSet'>`
- Payload: `TelegramMethodPayload<'createNewStickerSet'>`
- Hasil: `Promise<TelegramMethodResult<'createNewStickerSet'>>`
- Field dan batasan endpoint: [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset).

:::

::: details addStickerToSet

- Argumen: `TelegramMethodArguments<'addStickerToSet'>`
- Payload: `TelegramMethodPayload<'addStickerToSet'>`
- Hasil: `Promise<TelegramMethodResult<'addStickerToSet'>>`
- Field dan batasan endpoint: [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset).

:::

::: details setStickerPositionInSet

- Argumen: `TelegramMethodArguments<'setStickerPositionInSet'>`
- Payload: `TelegramMethodPayload<'setStickerPositionInSet'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerPositionInSet'>>`
- Field dan batasan endpoint: [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset).

:::

::: details deleteStickerFromSet

- Argumen: `TelegramMethodArguments<'deleteStickerFromSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerFromSet'>`
- Hasil: `Promise<TelegramMethodResult<'deleteStickerFromSet'>>`
- Field dan batasan endpoint: [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset).

:::

::: details replaceStickerInSet

- Argumen: `TelegramMethodArguments<'replaceStickerInSet'>`
- Payload: `TelegramMethodPayload<'replaceStickerInSet'>`
- Hasil: `Promise<TelegramMethodResult<'replaceStickerInSet'>>`
- Field dan batasan endpoint: [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset).

:::

::: details setStickerEmojiList

- Argumen: `TelegramMethodArguments<'setStickerEmojiList'>`
- Payload: `TelegramMethodPayload<'setStickerEmojiList'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerEmojiList'>>`
- Field dan batasan endpoint: [setStickerEmojiList](https://core.telegram.org/bots/api#setstickeremojilist).

:::

::: details setStickerKeywords

- Argumen: `TelegramMethodArguments<'setStickerKeywords'>`
- Payload: `TelegramMethodPayload<'setStickerKeywords'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerKeywords'>>`
- Field dan batasan endpoint: [setStickerKeywords](https://core.telegram.org/bots/api#setstickerkeywords).

:::

::: details setStickerMaskPosition

- Argumen: `TelegramMethodArguments<'setStickerMaskPosition'>`
- Payload: `TelegramMethodPayload<'setStickerMaskPosition'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerMaskPosition'>>`
- Field dan batasan endpoint: [setStickerMaskPosition](https://core.telegram.org/bots/api#setstickermaskposition).

:::

::: details setStickerSetTitle

- Argumen: `TelegramMethodArguments<'setStickerSetTitle'>`
- Payload: `TelegramMethodPayload<'setStickerSetTitle'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerSetTitle'>>`
- Field dan batasan endpoint: [setStickerSetTitle](https://core.telegram.org/bots/api#setstickersettitle).

:::

::: details deleteStickerSet

- Argumen: `TelegramMethodArguments<'deleteStickerSet'>`
- Payload: `TelegramMethodPayload<'deleteStickerSet'>`
- Hasil: `Promise<TelegramMethodResult<'deleteStickerSet'>>`
- Field dan batasan endpoint: [deleteStickerSet](https://core.telegram.org/bots/api#deletestickerset).

:::

::: details setStickerSetThumbnail

- Argumen: `TelegramMethodArguments<'setStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setStickerSetThumbnail'>`
- Hasil: `Promise<TelegramMethodResult<'setStickerSetThumbnail'>>`
- Field dan batasan endpoint: [setStickerSetThumbnail](https://core.telegram.org/bots/api#setstickersetthumbnail).

:::

::: details setCustomEmojiStickerSetThumbnail

- Argumen: `TelegramMethodArguments<'setCustomEmojiStickerSetThumbnail'>`
- Payload: `TelegramMethodPayload<'setCustomEmojiStickerSetThumbnail'>`
- Hasil: `Promise<TelegramMethodResult<'setCustomEmojiStickerSetThumbnail'>>`
- Field dan batasan endpoint: [setCustomEmojiStickerSetThumbnail](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail).

:::

::: details getForumTopicIconStickers

- Argumen: `TelegramMethodArguments<'getForumTopicIconStickers'>`
- Payload: `TelegramMethodPayload<'getForumTopicIconStickers'>`
- Hasil: `Promise<TelegramMethodResult<'getForumTopicIconStickers'>>`
- Field dan batasan endpoint: [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers).

:::

## Inline query, Web App, dan guest

- [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery)
- [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)
- [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery)
- [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage)
- [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)

### Payload dan hasil bertipe

::: details answerGuestQuery

- Argumen: `TelegramMethodArguments<'answerGuestQuery'>`
- Payload: `TelegramMethodPayload<'answerGuestQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerGuestQuery'>>`
- Field dan batasan endpoint: [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery).

:::

::: details answerInlineQuery

- Argumen: `TelegramMethodArguments<'answerInlineQuery'>`
- Payload: `TelegramMethodPayload<'answerInlineQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerInlineQuery'>>`
- Field dan batasan endpoint: [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery).

:::

::: details answerWebAppQuery

- Argumen: `TelegramMethodArguments<'answerWebAppQuery'>`
- Payload: `TelegramMethodPayload<'answerWebAppQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerWebAppQuery'>>`
- Field dan batasan endpoint: [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

:::

::: details savePreparedInlineMessage

- Argumen: `TelegramMethodArguments<'savePreparedInlineMessage'>`
- Payload: `TelegramMethodPayload<'savePreparedInlineMessage'>`
- Hasil: `Promise<TelegramMethodResult<'savePreparedInlineMessage'>>`
- Field dan batasan endpoint: [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage).

:::

::: details savePreparedKeyboardButton

- Argumen: `TelegramMethodArguments<'savePreparedKeyboardButton'>`
- Payload: `TelegramMethodPayload<'savePreparedKeyboardButton'>`
- Hasil: `Promise<TelegramMethodResult<'savePreparedKeyboardButton'>>`
- Field dan batasan endpoint: [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton).

:::

## Business dan pesan ephemeral

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

### Payload dan hasil bertipe

::: details getBusinessConnection

- Argumen: `TelegramMethodArguments<'getBusinessConnection'>`
- Payload: `TelegramMethodPayload<'getBusinessConnection'>`
- Hasil: `Promise<TelegramMethodResult<'getBusinessConnection'>>`
- Field dan batasan endpoint: [getBusinessConnection](https://core.telegram.org/bots/api#getbusinessconnection).

:::

::: details editEphemeralMessageText

- Argumen: `TelegramMethodArguments<'editEphemeralMessageText'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageText'>`
- Hasil: `Promise<TelegramMethodResult<'editEphemeralMessageText'>>`
- Field dan batasan endpoint: [editEphemeralMessageText](https://core.telegram.org/bots/api#editephemeralmessagetext).

:::

::: details editEphemeralMessageMedia

- Argumen: `TelegramMethodArguments<'editEphemeralMessageMedia'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageMedia'>`
- Hasil: `Promise<TelegramMethodResult<'editEphemeralMessageMedia'>>`
- Field dan batasan endpoint: [editEphemeralMessageMedia](https://core.telegram.org/bots/api#editephemeralmessagemedia).

:::

::: details editEphemeralMessageCaption

- Argumen: `TelegramMethodArguments<'editEphemeralMessageCaption'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageCaption'>`
- Hasil: `Promise<TelegramMethodResult<'editEphemeralMessageCaption'>>`
- Field dan batasan endpoint: [editEphemeralMessageCaption](https://core.telegram.org/bots/api#editephemeralmessagecaption).

:::

::: details editEphemeralMessageReplyMarkup

- Argumen: `TelegramMethodArguments<'editEphemeralMessageReplyMarkup'>`
- Payload: `TelegramMethodPayload<'editEphemeralMessageReplyMarkup'>`
- Hasil: `Promise<TelegramMethodResult<'editEphemeralMessageReplyMarkup'>>`
- Field dan batasan endpoint: [editEphemeralMessageReplyMarkup](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup).

:::

::: details deleteEphemeralMessage

- Argumen: `TelegramMethodArguments<'deleteEphemeralMessage'>`
- Payload: `TelegramMethodPayload<'deleteEphemeralMessage'>`
- Hasil: `Promise<TelegramMethodResult<'deleteEphemeralMessage'>>`
- Field dan batasan endpoint: [deleteEphemeralMessage](https://core.telegram.org/bots/api#deleteephemeralmessage).

:::

::: details deleteBusinessMessages

- Argumen: `TelegramMethodArguments<'deleteBusinessMessages'>`
- Payload: `TelegramMethodPayload<'deleteBusinessMessages'>`
- Hasil: `Promise<TelegramMethodResult<'deleteBusinessMessages'>>`
- Field dan batasan endpoint: [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages).

:::

::: details setBusinessAccountName

- Argumen: `TelegramMethodArguments<'setBusinessAccountName'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountName'>`
- Hasil: `Promise<TelegramMethodResult<'setBusinessAccountName'>>`
- Field dan batasan endpoint: [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname).

:::

::: details setBusinessAccountUsername

- Argumen: `TelegramMethodArguments<'setBusinessAccountUsername'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountUsername'>`
- Hasil: `Promise<TelegramMethodResult<'setBusinessAccountUsername'>>`
- Field dan batasan endpoint: [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername).

:::

::: details setBusinessAccountBio

- Argumen: `TelegramMethodArguments<'setBusinessAccountBio'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountBio'>`
- Hasil: `Promise<TelegramMethodResult<'setBusinessAccountBio'>>`
- Field dan batasan endpoint: [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio).

:::

::: details setBusinessAccountProfilePhoto

- Argumen: `TelegramMethodArguments<'setBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountProfilePhoto'>`
- Hasil: `Promise<TelegramMethodResult<'setBusinessAccountProfilePhoto'>>`
- Field dan batasan endpoint: [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto).

:::

::: details removeBusinessAccountProfilePhoto

- Argumen: `TelegramMethodArguments<'removeBusinessAccountProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeBusinessAccountProfilePhoto'>`
- Hasil: `Promise<TelegramMethodResult<'removeBusinessAccountProfilePhoto'>>`
- Field dan batasan endpoint: [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto).

:::

::: details setBusinessAccountGiftSettings

- Argumen: `TelegramMethodArguments<'setBusinessAccountGiftSettings'>`
- Payload: `TelegramMethodPayload<'setBusinessAccountGiftSettings'>`
- Hasil: `Promise<TelegramMethodResult<'setBusinessAccountGiftSettings'>>`
- Field dan batasan endpoint: [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings).

:::

::: details getBusinessAccountStarBalance

- Argumen: `TelegramMethodArguments<'getBusinessAccountStarBalance'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountStarBalance'>`
- Hasil: `Promise<TelegramMethodResult<'getBusinessAccountStarBalance'>>`
- Field dan batasan endpoint: [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance).

:::

::: details transferBusinessAccountStars

- Argumen: `TelegramMethodArguments<'transferBusinessAccountStars'>`
- Payload: `TelegramMethodPayload<'transferBusinessAccountStars'>`
- Hasil: `Promise<TelegramMethodResult<'transferBusinessAccountStars'>>`
- Field dan batasan endpoint: [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars).

:::

::: details getBusinessAccountGifts

- Argumen: `TelegramMethodArguments<'getBusinessAccountGifts'>`
- Payload: `TelegramMethodPayload<'getBusinessAccountGifts'>`
- Hasil: `Promise<TelegramMethodResult<'getBusinessAccountGifts'>>`
- Field dan batasan endpoint: [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts).

:::

::: details readBusinessMessage

- Argumen: `TelegramMethodArguments<'readBusinessMessage'>`
- Payload: `TelegramMethodPayload<'readBusinessMessage'>`
- Hasil: `Promise<TelegramMethodResult<'readBusinessMessage'>>`
- Field dan batasan endpoint: [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage).

:::

## Pembayaran, Stars, dan gifts

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

### Payload dan hasil bertipe

::: details getUserGifts

- Argumen: `TelegramMethodArguments<'getUserGifts'>`
- Payload: `TelegramMethodPayload<'getUserGifts'>`
- Hasil: `Promise<TelegramMethodResult<'getUserGifts'>>`
- Field dan batasan endpoint: [getUserGifts](https://core.telegram.org/bots/api#getusergifts).

:::

::: details convertGiftToStars

- Argumen: `TelegramMethodArguments<'convertGiftToStars'>`
- Payload: `TelegramMethodPayload<'convertGiftToStars'>`
- Hasil: `Promise<TelegramMethodResult<'convertGiftToStars'>>`
- Field dan batasan endpoint: [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars).

:::

::: details upgradeGift

- Argumen: `TelegramMethodArguments<'upgradeGift'>`
- Payload: `TelegramMethodPayload<'upgradeGift'>`
- Hasil: `Promise<TelegramMethodResult<'upgradeGift'>>`
- Field dan batasan endpoint: [upgradeGift](https://core.telegram.org/bots/api#upgradegift).

:::

::: details transferGift

- Argumen: `TelegramMethodArguments<'transferGift'>`
- Payload: `TelegramMethodPayload<'transferGift'>`
- Hasil: `Promise<TelegramMethodResult<'transferGift'>>`
- Field dan batasan endpoint: [transferGift](https://core.telegram.org/bots/api#transfergift).

:::

::: details giftPremiumSubscription

- Argumen: `TelegramMethodArguments<'giftPremiumSubscription'>`
- Payload: `TelegramMethodPayload<'giftPremiumSubscription'>`
- Hasil: `Promise<TelegramMethodResult<'giftPremiumSubscription'>>`
- Field dan batasan endpoint: [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription).

:::

::: details createInvoiceLink

- Argumen: `TelegramMethodArguments<'createInvoiceLink'>`
- Payload: `TelegramMethodPayload<'createInvoiceLink'>`
- Hasil: `Promise<TelegramMethodResult<'createInvoiceLink'>>`
- Field dan batasan endpoint: [createInvoiceLink](https://core.telegram.org/bots/api#createinvoicelink).

:::

::: details answerShippingQuery

- Argumen: `TelegramMethodArguments<'answerShippingQuery'>`
- Payload: `TelegramMethodPayload<'answerShippingQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerShippingQuery'>>`
- Field dan batasan endpoint: [answerShippingQuery](https://core.telegram.org/bots/api#answershippingquery).

:::

::: details answerPreCheckoutQuery

- Argumen: `TelegramMethodArguments<'answerPreCheckoutQuery'>`
- Payload: `TelegramMethodPayload<'answerPreCheckoutQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerPreCheckoutQuery'>>`
- Field dan batasan endpoint: [answerPreCheckoutQuery](https://core.telegram.org/bots/api#answerprecheckoutquery).

:::

::: details getStarTransactions

- Argumen: `TelegramMethodArguments<'getStarTransactions'>`
- Payload: `TelegramMethodPayload<'getStarTransactions'>`
- Hasil: `Promise<TelegramMethodResult<'getStarTransactions'>>`
- Field dan batasan endpoint: [getStarTransactions](https://core.telegram.org/bots/api#getstartransactions).

:::

::: details refundStarPayment

- Argumen: `TelegramMethodArguments<'refundStarPayment'>`
- Payload: `TelegramMethodPayload<'refundStarPayment'>`
- Hasil: `Promise<TelegramMethodResult<'refundStarPayment'>>`
- Field dan batasan endpoint: [refundStarPayment](https://core.telegram.org/bots/api#refundstarpayment).

:::

::: details editUserStarSubscription

- Argumen: `TelegramMethodArguments<'editUserStarSubscription'>`
- Payload: `TelegramMethodPayload<'editUserStarSubscription'>`
- Hasil: `Promise<TelegramMethodResult<'editUserStarSubscription'>>`
- Field dan batasan endpoint: [editUserStarSubscription](https://core.telegram.org/bots/api#edituserstarsubscription).

:::

::: details getMyStarBalance

- Argumen: `TelegramMethodArguments<'getMyStarBalance'>`
- Payload: `TelegramMethodPayload<'getMyStarBalance'>`
- Hasil: `Promise<TelegramMethodResult<'getMyStarBalance'>>`
- Field dan batasan endpoint: [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance).

:::

::: details getAvailableGifts

- Argumen: `TelegramMethodArguments<'getAvailableGifts'>`
- Payload: `TelegramMethodPayload<'getAvailableGifts'>`
- Hasil: `Promise<TelegramMethodResult<'getAvailableGifts'>>`
- Field dan batasan endpoint: [getAvailableGifts](https://core.telegram.org/bots/api#getavailablegifts).

:::

## Games

- [setGameScore](https://core.telegram.org/bots/api#setgamescore)
- [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores)

### Payload dan hasil bertipe

::: details setGameScore

- Argumen: `TelegramMethodArguments<'setGameScore'>`
- Payload: `TelegramMethodPayload<'setGameScore'>`
- Hasil: `Promise<TelegramMethodResult<'setGameScore'>>`
- Field dan batasan endpoint: [setGameScore](https://core.telegram.org/bots/api#setgamescore).

:::

::: details getGameHighScores

- Argumen: `TelegramMethodArguments<'getGameHighScores'>`
- Payload: `TelegramMethodPayload<'getGameHighScores'>`
- Hasil: `Promise<TelegramMethodResult<'getGameHighScores'>>`
- Field dan batasan endpoint: [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores).

:::

## Bot, file, update, dan informasi akun

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

### Payload dan hasil bertipe

::: details getUpdates

- Argumen: `TelegramMethodArguments<'getUpdates'>`
- Payload: `TelegramMethodPayload<'getUpdates'>`
- Hasil: `Promise<TelegramMethodResult<'getUpdates'>>`
- Field dan batasan endpoint: [getUpdates](https://core.telegram.org/bots/api#getupdates).

:::

::: details setWebhook

- Argumen: `TelegramMethodArguments<'setWebhook'>`
- Payload: `TelegramMethodPayload<'setWebhook'>`
- Hasil: `Promise<TelegramMethodResult<'setWebhook'>>`
- Field dan batasan endpoint: [setWebhook](https://core.telegram.org/bots/api#setwebhook).

:::

::: details deleteWebhook

- Argumen: `TelegramMethodArguments<'deleteWebhook'>`
- Payload: `TelegramMethodPayload<'deleteWebhook'>`
- Hasil: `Promise<TelegramMethodResult<'deleteWebhook'>>`
- Field dan batasan endpoint: [deleteWebhook](https://core.telegram.org/bots/api#deletewebhook).

:::

::: details stopMessageLiveLocation

- Argumen: `TelegramMethodArguments<'stopMessageLiveLocation'>`
- Payload: `TelegramMethodPayload<'stopMessageLiveLocation'>`
- Hasil: `Promise<TelegramMethodResult<'stopMessageLiveLocation'>>`
- Field dan batasan endpoint: [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation).

:::

::: details getUserProfilePhotos

- Argumen: `TelegramMethodArguments<'getUserProfilePhotos'>`
- Payload: `TelegramMethodPayload<'getUserProfilePhotos'>`
- Hasil: `Promise<TelegramMethodResult<'getUserProfilePhotos'>>`
- Field dan batasan endpoint: [getUserProfilePhotos](https://core.telegram.org/bots/api#getuserprofilephotos).

:::

::: details getUserProfileAudios

- Argumen: `TelegramMethodArguments<'getUserProfileAudios'>`
- Payload: `TelegramMethodPayload<'getUserProfileAudios'>`
- Hasil: `Promise<TelegramMethodResult<'getUserProfileAudios'>>`
- Field dan batasan endpoint: [getUserProfileAudios](https://core.telegram.org/bots/api#getuserprofileaudios).

:::

::: details setUserEmojiStatus

- Argumen: `TelegramMethodArguments<'setUserEmojiStatus'>`
- Payload: `TelegramMethodPayload<'setUserEmojiStatus'>`
- Hasil: `Promise<TelegramMethodResult<'setUserEmojiStatus'>>`
- Field dan batasan endpoint: [setUserEmojiStatus](https://core.telegram.org/bots/api#setuseremojistatus).

:::

::: details getFile

- Argumen: `TelegramMethodArguments<'getFile'>`
- Payload: `TelegramMethodPayload<'getFile'>`
- Hasil: `Promise<TelegramMethodResult<'getFile'>>`
- Field dan batasan endpoint: [getFile](https://core.telegram.org/bots/api#getfile).

:::

::: details answerCallbackQuery

- Argumen: `TelegramMethodArguments<'answerCallbackQuery'>`
- Payload: `TelegramMethodPayload<'answerCallbackQuery'>`
- Hasil: `Promise<TelegramMethodResult<'answerCallbackQuery'>>`
- Field dan batasan endpoint: [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery).

:::

::: details getManagedBotToken

- Argumen: `TelegramMethodArguments<'getManagedBotToken'>`
- Payload: `TelegramMethodPayload<'getManagedBotToken'>`
- Hasil: `Promise<TelegramMethodResult<'getManagedBotToken'>>`
- Field dan batasan endpoint: [getManagedBotToken](https://core.telegram.org/bots/api#getmanagedbottoken).

:::

::: details replaceManagedBotToken

- Argumen: `TelegramMethodArguments<'replaceManagedBotToken'>`
- Payload: `TelegramMethodPayload<'replaceManagedBotToken'>`
- Hasil: `Promise<TelegramMethodResult<'replaceManagedBotToken'>>`
- Field dan batasan endpoint: [replaceManagedBotToken](https://core.telegram.org/bots/api#replacemanagedbottoken).

:::

::: details getManagedBotAccessSettings

- Argumen: `TelegramMethodArguments<'getManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'getManagedBotAccessSettings'>`
- Hasil: `Promise<TelegramMethodResult<'getManagedBotAccessSettings'>>`
- Field dan batasan endpoint: [getManagedBotAccessSettings](https://core.telegram.org/bots/api#getmanagedbotaccesssettings).

:::

::: details setManagedBotAccessSettings

- Argumen: `TelegramMethodArguments<'setManagedBotAccessSettings'>`
- Payload: `TelegramMethodPayload<'setManagedBotAccessSettings'>`
- Hasil: `Promise<TelegramMethodResult<'setManagedBotAccessSettings'>>`
- Field dan batasan endpoint: [setManagedBotAccessSettings](https://core.telegram.org/bots/api#setmanagedbotaccesssettings).

:::

::: details setMyCommands

- Argumen: `TelegramMethodArguments<'setMyCommands'>`
- Payload: `TelegramMethodPayload<'setMyCommands'>`
- Hasil: `Promise<TelegramMethodResult<'setMyCommands'>>`
- Field dan batasan endpoint: [setMyCommands](https://core.telegram.org/bots/api#setmycommands).

:::

::: details deleteMyCommands

- Argumen: `TelegramMethodArguments<'deleteMyCommands'>`
- Payload: `TelegramMethodPayload<'deleteMyCommands'>`
- Hasil: `Promise<TelegramMethodResult<'deleteMyCommands'>>`
- Field dan batasan endpoint: [deleteMyCommands](https://core.telegram.org/bots/api#deletemycommands).

:::

::: details getMyCommands

- Argumen: `TelegramMethodArguments<'getMyCommands'>`
- Payload: `TelegramMethodPayload<'getMyCommands'>`
- Hasil: `Promise<TelegramMethodResult<'getMyCommands'>>`
- Field dan batasan endpoint: [getMyCommands](https://core.telegram.org/bots/api#getmycommands).

:::

::: details setMyName

- Argumen: `TelegramMethodArguments<'setMyName'>`
- Payload: `TelegramMethodPayload<'setMyName'>`
- Hasil: `Promise<TelegramMethodResult<'setMyName'>>`
- Field dan batasan endpoint: [setMyName](https://core.telegram.org/bots/api#setmyname).

:::

::: details getMyName

- Argumen: `TelegramMethodArguments<'getMyName'>`
- Payload: `TelegramMethodPayload<'getMyName'>`
- Hasil: `Promise<TelegramMethodResult<'getMyName'>>`
- Field dan batasan endpoint: [getMyName](https://core.telegram.org/bots/api#getmyname).

:::

::: details setMyDescription

- Argumen: `TelegramMethodArguments<'setMyDescription'>`
- Payload: `TelegramMethodPayload<'setMyDescription'>`
- Hasil: `Promise<TelegramMethodResult<'setMyDescription'>>`
- Field dan batasan endpoint: [setMyDescription](https://core.telegram.org/bots/api#setmydescription).

:::

::: details getMyDescription

- Argumen: `TelegramMethodArguments<'getMyDescription'>`
- Payload: `TelegramMethodPayload<'getMyDescription'>`
- Hasil: `Promise<TelegramMethodResult<'getMyDescription'>>`
- Field dan batasan endpoint: [getMyDescription](https://core.telegram.org/bots/api#getmydescription).

:::

::: details setMyShortDescription

- Argumen: `TelegramMethodArguments<'setMyShortDescription'>`
- Payload: `TelegramMethodPayload<'setMyShortDescription'>`
- Hasil: `Promise<TelegramMethodResult<'setMyShortDescription'>>`
- Field dan batasan endpoint: [setMyShortDescription](https://core.telegram.org/bots/api#setmyshortdescription).

:::

::: details getMyShortDescription

- Argumen: `TelegramMethodArguments<'getMyShortDescription'>`
- Payload: `TelegramMethodPayload<'getMyShortDescription'>`
- Hasil: `Promise<TelegramMethodResult<'getMyShortDescription'>>`
- Field dan batasan endpoint: [getMyShortDescription](https://core.telegram.org/bots/api#getmyshortdescription).

:::

::: details setMyProfilePhoto

- Argumen: `TelegramMethodArguments<'setMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'setMyProfilePhoto'>`
- Hasil: `Promise<TelegramMethodResult<'setMyProfilePhoto'>>`
- Field dan batasan endpoint: [setMyProfilePhoto](https://core.telegram.org/bots/api#setmyprofilephoto).

:::

::: details setMyDefaultAdministratorRights

- Argumen: `TelegramMethodArguments<'setMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'setMyDefaultAdministratorRights'>`
- Hasil: `Promise<TelegramMethodResult<'setMyDefaultAdministratorRights'>>`
- Field dan batasan endpoint: [setMyDefaultAdministratorRights](https://core.telegram.org/bots/api#setmydefaultadministratorrights).

:::

::: details getMyDefaultAdministratorRights

- Argumen: `TelegramMethodArguments<'getMyDefaultAdministratorRights'>`
- Payload: `TelegramMethodPayload<'getMyDefaultAdministratorRights'>`
- Hasil: `Promise<TelegramMethodResult<'getMyDefaultAdministratorRights'>>`
- Field dan batasan endpoint: [getMyDefaultAdministratorRights](https://core.telegram.org/bots/api#getmydefaultadministratorrights).

:::

::: details stopPoll

- Argumen: `TelegramMethodArguments<'stopPoll'>`
- Payload: `TelegramMethodPayload<'stopPoll'>`
- Hasil: `Promise<TelegramMethodResult<'stopPoll'>>`
- Field dan batasan endpoint: [stopPoll](https://core.telegram.org/bots/api#stoppoll).

:::

::: details deleteAllMessageReactions

- Argumen: `TelegramMethodArguments<'deleteAllMessageReactions'>`
- Payload: `TelegramMethodPayload<'deleteAllMessageReactions'>`
- Hasil: `Promise<TelegramMethodResult<'deleteAllMessageReactions'>>`
- Field dan batasan endpoint: [deleteAllMessageReactions](https://core.telegram.org/bots/api#deleteallmessagereactions).

:::

::: details postStory

- Argumen: `TelegramMethodArguments<'postStory'>`
- Payload: `TelegramMethodPayload<'postStory'>`
- Hasil: `Promise<TelegramMethodResult<'postStory'>>`
- Field dan batasan endpoint: [postStory](https://core.telegram.org/bots/api#poststory).

:::

::: details repostStory

- Argumen: `TelegramMethodArguments<'repostStory'>`
- Payload: `TelegramMethodPayload<'repostStory'>`
- Hasil: `Promise<TelegramMethodResult<'repostStory'>>`
- Field dan batasan endpoint: [repostStory](https://core.telegram.org/bots/api#repoststory).

:::

::: details editStory

- Argumen: `TelegramMethodArguments<'editStory'>`
- Payload: `TelegramMethodPayload<'editStory'>`
- Hasil: `Promise<TelegramMethodResult<'editStory'>>`
- Field dan batasan endpoint: [editStory](https://core.telegram.org/bots/api#editstory).

:::

::: details deleteStory

- Argumen: `TelegramMethodArguments<'deleteStory'>`
- Payload: `TelegramMethodPayload<'deleteStory'>`
- Hasil: `Promise<TelegramMethodResult<'deleteStory'>>`
- Field dan batasan endpoint: [deleteStory](https://core.telegram.org/bots/api#deletestory).

:::

::: details verifyUser

- Argumen: `TelegramMethodArguments<'verifyUser'>`
- Payload: `TelegramMethodPayload<'verifyUser'>`
- Hasil: `Promise<TelegramMethodResult<'verifyUser'>>`
- Field dan batasan endpoint: [verifyUser](https://core.telegram.org/bots/api#verifyuser).

:::

::: details removeUserVerification

- Argumen: `TelegramMethodArguments<'removeUserVerification'>`
- Payload: `TelegramMethodPayload<'removeUserVerification'>`
- Hasil: `Promise<TelegramMethodResult<'removeUserVerification'>>`
- Field dan batasan endpoint: [removeUserVerification](https://core.telegram.org/bots/api#removeuserverification).

:::

::: details setPassportDataErrors

- Argumen: `TelegramMethodArguments<'setPassportDataErrors'>`
- Payload: `TelegramMethodPayload<'setPassportDataErrors'>`
- Hasil: `Promise<TelegramMethodResult<'setPassportDataErrors'>>`
- Field dan batasan endpoint: [setPassportDataErrors](https://core.telegram.org/bots/api#setpassportdataerrors).

:::

::: details getWebhookInfo

- Argumen: `TelegramMethodArguments<'getWebhookInfo'>`
- Payload: `TelegramMethodPayload<'getWebhookInfo'>`
- Hasil: `Promise<TelegramMethodResult<'getWebhookInfo'>>`
- Field dan batasan endpoint: [getWebhookInfo](https://core.telegram.org/bots/api#getwebhookinfo).

:::

::: details getMe

- Argumen: `TelegramMethodArguments<'getMe'>`
- Payload: `TelegramMethodPayload<'getMe'>`
- Hasil: `Promise<TelegramMethodResult<'getMe'>>`
- Field dan batasan endpoint: [getMe](https://core.telegram.org/bots/api#getme).

:::

::: details logOut

- Argumen: `TelegramMethodArguments<'logOut'>`
- Payload: `TelegramMethodPayload<'logOut'>`
- Hasil: `Promise<TelegramMethodResult<'logOut'>>`
- Field dan batasan endpoint: [logOut](https://core.telegram.org/bots/api#logout).

:::

::: details close

- Argumen: `TelegramMethodArguments<'close'>`
- Payload: `TelegramMethodPayload<'close'>`
- Hasil: `Promise<TelegramMethodResult<'close'>>`
- Field dan batasan endpoint: [close](https://core.telegram.org/bots/api#close).

:::

::: details removeMyProfilePhoto

- Argumen: `TelegramMethodArguments<'removeMyProfilePhoto'>`
- Payload: `TelegramMethodPayload<'removeMyProfilePhoto'>`
- Hasil: `Promise<TelegramMethodResult<'removeMyProfilePhoto'>>`
- Field dan batasan endpoint: [removeMyProfilePhoto](https://core.telegram.org/bots/api#removemyprofilephoto).

:::

## Referensi terkait

- [Referensi Telegram API](/reference/api)
- [Tipe TypeScript](/reference/typescript)
- [Opsi bot](/reference/options)
