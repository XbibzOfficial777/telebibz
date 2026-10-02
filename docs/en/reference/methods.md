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

Use the documented shortcut signature where one exists. Otherwise call the method with its name and a payload object. TypeScript declarations validate the method, payload, and result.

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

## Inline queries, Web Apps, and guest updates

- [answerGuestQuery](https://core.telegram.org/bots/api#answerguestquery)
- [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)
- [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery)
- [savePreparedInlineMessage](https://core.telegram.org/bots/api#savepreparedinlinemessage)
- [savePreparedKeyboardButton](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)

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

## Games

- [setGameScore](https://core.telegram.org/bots/api#setgamescore)
- [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores)

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

## Related references

- [Bot API reference](/en/reference/api)
- [TypeScript](/en/reference/typescript)
- [Bot options](/en/reference/options)
