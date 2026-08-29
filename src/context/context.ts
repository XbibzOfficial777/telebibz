import { writeFile } from "node:fs/promises";

import type { ApiClient, DownloadedFile } from "../api/client.js";
import type { Chat, ChatId, ChatMember, File, InputFile, Message, ReplyMarkup, Update, User } from "../api/types.js";

export interface ContextOptions<S extends object = Record<string, unknown>> {
  update: Update;
  api: ApiClient;
  session: S;
  services: Record<string, unknown>;
  me?: User | undefined;
}

export class Context<S extends object = Record<string, unknown>> {
  readonly update: Update;
  readonly api: ApiClient;
  readonly session: S;
  readonly state: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  readonly services: Record<string, unknown>;
  readonly params: Record<string, string> = Object.create(null) as Record<string, string>;
  readonly me?: User | undefined;
  match?: RegExpMatchArray;
  args?: string[];

  constructor(options: ContextOptions<S>) {
    this.update = options.update;
    this.api = options.api;
    this.session = options.session;
    this.services = options.services;
    this.me = options.me;
  }

  get message(): Message | undefined {
    return this.update.message
      ?? this.update.edited_message
      ?? this.update.channel_post
      ?? this.update.edited_channel_post
      ?? this.update.business_message
      ?? this.update.edited_business_message
      ?? this.update.guest_message
      ?? this.callbackQuery?.message;
  }
  get chat(): Chat | undefined {
    return this.message?.chat
      ?? this.update.chat_member?.chat
      ?? this.update.my_chat_member?.chat
      ?? this.update.chat_join_request?.chat
      ?? this.pollAnswer?.voter_chat;
  }
  get from(): User | undefined {
    return this.callbackQuery?.from
      ?? this.inlineQuery?.from
      ?? this.update.chosen_inline_result?.from
      ?? this.update.message?.from
      ?? this.update.edited_message?.from
      ?? this.update.channel_post?.from
      ?? this.update.edited_channel_post?.from
      ?? this.update.business_message?.from
      ?? this.update.edited_business_message?.from
      ?? this.update.guest_message?.from
      ?? this.update.chat_member?.from
      ?? this.update.my_chat_member?.from
      ?? this.update.chat_join_request?.from
      ?? this.pollAnswer?.user
      ?? this.message?.from;
  }
  get sender(): User | undefined { return this.from; }
  get callbackQuery() { return this.update.callback_query; }
  get inlineQuery() { return this.update.inline_query; }
  get poll() { return this.update.poll; }
  get pollAnswer() { return this.update.poll_answer; }
  get chatMember() { return this.update.chat_member; }
  get myChatMember() { return this.update.my_chat_member; }
  get chatJoinRequest() { return this.update.chat_join_request; }
  get reaction() { return this.update.message_reaction; }
  get boost() { return this.update.chat_boost ?? this.update.removed_chat_boost; }

  private replyExtras(extra: Record<string, unknown>): { replyParameters: Record<string, unknown> | undefined; replyMarkup: unknown; rest: Record<string, unknown> } {
    const { reply_parameters, reply_markup, ...rest } = extra as { reply_parameters?: Record<string, unknown>; reply_markup?: unknown };
    const quoted = this.message?.message_id !== undefined ? { message_id: this.message.message_id } : undefined;
    const replyParameters = quoted === undefined && reply_parameters === undefined ? undefined : { ...(quoted ?? {}), ...(reply_parameters ?? {}) };
    return { replyParameters, replyMarkup: reply_markup ?? this.state.reply_markup, rest };
  }

  private sendMethod<M extends string>(method: M, payload: Record<string, unknown>, extra: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.chat) throw new Error(`Cannot send ${method} without a chat in this update.`);
    const { replyParameters, replyMarkup, rest } = this.replyExtras(extra);
    return this.api.call(method as never, {
      chat_id: this.chat.id,
      ...payload,
      ...rest,
      ...(replyParameters ? { reply_parameters: replyParameters } : {}),
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    } as never);
  }

  async reply(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendMessage", { text }, extra) as Promise<Message>;
  }

  async send(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot send without a chat in this update.");
    const { replyMarkup, rest } = this.replyExtras(extra);
    return this.api.methods.sendMessage({
      chat_id: this.chat.id,
      text,
      ...rest,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    } as never) as Promise<Message>;
  }

  async edit(text: string, extra: Record<string, unknown> = {}): Promise<Message | true> {
    if (!this.chat || !this.message) throw new Error("Cannot edit without a chat and message in this update.");
    const { replyMarkup, rest } = this.replyExtras(extra);
    return this.api.methods.editMessageText({
      chat_id: this.chat.id,
      message_id: this.message.message_id,
      text,
      ...rest,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    } as never) as Promise<Message | true>;
  }

  async replyWithHTML(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.reply(text, { parse_mode: "HTML", ...extra });
  }

  async replyWithMarkdown(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.reply(text, { parse_mode: "MarkdownV2", ...extra });
  }

  async replyWithPhoto(photo: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendPhoto", { photo }, extra) as Promise<Message>;
  }

  async replyWithDocument(document: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendDocument", { document }, extra) as Promise<Message>;
  }

  async replyWithAudio(audio: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendAudio", { audio }, extra) as Promise<Message>;
  }

  async replyWithVideo(video: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendVideo", { video }, extra) as Promise<Message>;
  }

  async replyWithVoice(voice: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendVoice", { voice }, extra) as Promise<Message>;
  }

  async replyWithAnimation(animation: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendAnimation", { animation }, extra) as Promise<Message>;
  }

  async replyWithVideoNote(videoNote: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendVideoNote", { video_note: videoNote }, extra) as Promise<Message>;
  }

  async replyWithSticker(sticker: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendSticker", { sticker }, extra) as Promise<Message>;
  }

  async replyWithMediaGroup(media: Array<Record<string, unknown>>, extra: Record<string, unknown> = {}): Promise<Message[]> {
    return this.sendMethod("sendMediaGroup", { media }, extra) as Promise<Message[]>;
  }

  async replyWithLocation(latitude: number, longitude: number, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendLocation", { latitude, longitude }, extra) as Promise<Message>;
  }

  async replyWithVenue(latitude: number, longitude: number, title: string, address: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendVenue", { latitude, longitude, title, address }, extra) as Promise<Message>;
  }

  async replyWithContact(phoneNumber: string, firstName: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendContact", { phone_number: phoneNumber, first_name: firstName }, extra) as Promise<Message>;
  }

  async replyWithPoll(question: string, options: string[], extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendPoll", { question, options }, extra) as Promise<Message>;
  }

  async replyWithDice(emoji?: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendDice", emoji === undefined ? {} : { emoji }, extra) as Promise<Message>;
  }

  async sendChatAction(action: string, extra: Record<string, unknown> = {}): Promise<true> {
    if (!this.chat) throw new Error("Cannot send chat action without a chat in this update.");
    return this.api.call("sendChatAction", { chat_id: this.chat.id, action, ...extra } as never) as Promise<true>;
  }

  async delete(): Promise<true> {
    if (!this.chat || !this.message) throw new Error("Cannot delete without a chat and message in this update.");
    return this.api.methods.deleteMessage({ chat_id: this.chat.id, message_id: this.message.message_id });
  }

  async copy(fromChatId: ChatId, messageId: number, extra: Record<string, unknown> = {}): Promise<unknown> { return this.api.call("copyMessage", { chat_id: this.chat?.id, from_chat_id: fromChatId, message_id: messageId, ...extra } as never); }
  async forward(fromChatId: ChatId, messageId: number, extra: Record<string, unknown> = {}): Promise<Message> { return this.api.call("forwardMessage", { chat_id: this.chat?.id, from_chat_id: fromChatId, message_id: messageId, ...extra } as never) as Promise<Message>; }
  async pin(messageId = this.message?.message_id, extra: Record<string, unknown> = {}): Promise<true> { return this.api.call("pinChatMessage", { chat_id: this.chat?.id, message_id: messageId, ...extra } as never) as Promise<true>; }
  async unpin(messageId = this.message?.message_id, extra: Record<string, unknown> = {}): Promise<true> { return this.api.call("unpinChatMessage", { chat_id: this.chat?.id, message_id: messageId, ...extra } as never) as Promise<true>; }
  async react(reaction: unknown, extra: Record<string, unknown> = {}): Promise<true> { return this.api.call("setMessageReaction", { chat_id: this.chat?.id, message_id: this.message?.message_id, reaction, ...extra } as never) as Promise<true>; }
  async answerCallbackQuery(text?: string, extra: Record<string, unknown> = {}): Promise<true> { if (!this.callbackQuery) throw new Error("No callback query in this update."); return this.api.methods.answerCallbackQuery({ callback_query_id: this.callbackQuery.id, text, ...extra } as never); }
  async answerInlineQuery(results: unknown[], extra: Record<string, unknown> = {}): Promise<true> { if (!this.inlineQuery) throw new Error("No inline query in this update."); return this.api.call("answerInlineQuery", { inline_query_id: this.inlineQuery.id, results, ...extra } as never) as Promise<true>; }
  async getChat(): Promise<Chat> { if (!this.chat) throw new Error("No chat in this update."); return this.api.methods.getChat({ chat_id: this.chat.id }); }
  async getUserProfilePhotos(userId = this.from?.id, extra: Record<string, unknown> = {}): Promise<unknown> { if (!userId) throw new Error("No user in this update."); return this.api.call("getUserProfilePhotos", { user_id: userId, ...extra } as never); }
  async getFile(fileId: string): Promise<File> { return this.api.methods.getFile({ file_id: fileId }); }
  /**
   * Resolves `fileId` with `getFile` and downloads the raw bytes (see
   * `Bot.downloadFile`). Pass `destination` to persist the bytes to a local
   * file path. Prefer this over reading `file_path` manually — it throws
   * precise `TelegramError`s when Telegram returns no path.
   */
  async downloadFile(fileId: string, options: { signal?: AbortSignal; destination?: string } = {}): Promise<DownloadedFile> {
    const downloaded = await this.api.downloadFile(fileId, options.signal !== undefined ? { signal: options.signal } : {});
    if (options.destination !== undefined) {
      await writeFile(options.destination, downloaded.bytes);
      return { ...downloaded, savedTo: options.destination };
    }
    return downloaded;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Admin & moderation (full Telegraf-parity surface; chat defaults to ctx.chat)
  // ─────────────────────────────────────────────────────────────────────────────

  private requireChatId(): ChatId { if (this.chat?.id === undefined) throw new Error("This update has no chat to act on."); return this.chat.id; }

  async banChatMember(userId: number, untilDate?: number, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("banChatMember", { chat_id: this.requireChatId(), user_id: userId, ...(untilDate !== undefined ? { until_date: untilDate } : {}), ...extra } as never) as Promise<true>;
  }
  async unbanChatMember(userId: number, onlyIfBanned?: boolean, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("unbanChatMember", { chat_id: this.requireChatId(), user_id: userId, ...(onlyIfBanned !== undefined ? { only_if_banned: onlyIfBanned } : {}), ...extra } as never) as Promise<true>;
  }
  async restrictChatMember(userId: number, permissions: Record<string, unknown>, untilDate?: number, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("restrictChatMember", { chat_id: this.requireChatId(), user_id: userId, permissions, ...(untilDate !== undefined ? { until_date: untilDate } : {}), ...extra } as never) as Promise<true>;
  }
  async promoteChatMember(userId: number, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("promoteChatMember", { chat_id: this.requireChatId(), user_id: userId, ...extra } as never) as Promise<true>;
  }
  async banChatSenderChat(senderChatId: ChatId, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("banChatSenderChat", { chat_id: this.requireChatId(), sender_chat_id: senderChatId, ...extra } as never) as Promise<true>;
  }
  async unbanChatSenderChat(senderChatId: ChatId, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("unbanChatSenderChat", { chat_id: this.requireChatId(), sender_chat_id: senderChatId, ...extra } as never) as Promise<true>;
  }

  // ── Chat management ──

  async setChatTitle(title: string): Promise<true> { return this.api.call("setChatTitle", { chat_id: this.requireChatId(), title } as never) as Promise<true>; }
  async setChatDescription(description?: string): Promise<true> { return this.api.call("setChatDescription", { chat_id: this.requireChatId(), description } as never) as Promise<true>; }
  async setChatPhoto(photo: InputFile): Promise<true> { return this.api.call("setChatPhoto", { chat_id: this.requireChatId(), photo } as never) as Promise<true>; }
  async deleteChatPhoto(): Promise<true> { return this.api.call("deleteChatPhoto", { chat_id: this.requireChatId() } as never) as Promise<true>; }
  async setChatPermissions(permissions: Record<string, unknown>, extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("setChatPermissions", { chat_id: this.requireChatId(), permissions, ...extra } as never) as Promise<true>;
  }
  async leaveChat(): Promise<true> { return this.api.call("leaveChat", { chat_id: this.requireChatId() } as never) as Promise<true>; }
  async unpinAllChatMessages(extra: Record<string, unknown> = {}): Promise<true> { return this.api.call("unpinAllChatMessages", { chat_id: this.requireChatId(), ...extra } as never) as Promise<true>; }
  async setChatStickerSet(stickerSetName: string): Promise<true> { return this.api.call("setChatStickerSet", { chat_id: this.requireChatId(), sticker_set_name: stickerSetName } as never) as Promise<true>; }
  async deleteChatStickerSet(): Promise<true> { return this.api.call("deleteChatStickerSet", { chat_id: this.requireChatId() } as never) as Promise<true>; }

  // ── Chat & member info ──

  async getChatAdministrators(): Promise<ChatMember[]> { return this.api.call("getChatAdministrators", { chat_id: this.requireChatId() } as never) as Promise<ChatMember[]>; }
  async getChatMemberCount(): Promise<number> { return this.api.call("getChatMemberCount", { chat_id: this.requireChatId() } as never) as Promise<number>; }
  async getChatMember(userId: number): Promise<ChatMember> { return this.api.call("getChatMember", { chat_id: this.requireChatId(), user_id: userId } as never) as Promise<ChatMember>; }

  // ── Invite links ──

  async exportChatInviteLink(): Promise<string> { return this.api.call("exportChatInviteLink", { chat_id: this.requireChatId() } as never) as Promise<string>; }
  async createChatInviteLink(extra: Record<string, unknown> = {}): Promise<unknown> { return this.api.call("createChatInviteLink", { chat_id: this.requireChatId(), ...extra } as never); }
  async editChatInviteLink(inviteLink: string, extra: Record<string, unknown> = {}): Promise<unknown> { return this.api.call("editChatInviteLink", { chat_id: this.requireChatId(), invite_link: inviteLink, ...extra } as never); }
  async revokeChatInviteLink(inviteLink: string): Promise<unknown> { return this.api.call("revokeChatInviteLink", { chat_id: this.requireChatId(), invite_link: inviteLink } as never); }

  // ── Join requests ──

  async approveChatJoinRequest(userId: number): Promise<true> { return this.api.call("approveChatJoinRequest", { chat_id: this.requireChatId(), user_id: userId } as never) as Promise<true>; }
  async declineChatJoinRequest(userId: number): Promise<true> { return this.api.call("declineChatJoinRequest", { chat_id: this.requireChatId(), user_id: userId } as never) as Promise<true>; }

  // ── Polls, live location, games, invoices ──

  async replyWithQuiz(question: string, options: string[], extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendPoll", { question, options, type: "quiz" }, extra) as Promise<Message>;
  }
  async stopPoll(messageId = this.message?.message_id, extra: Record<string, unknown> = {}): Promise<unknown> {
    if (messageId === undefined) throw new Error("Cannot stop a poll without a message id.");
    return this.api.call("stopPoll", { chat_id: this.requireChatId(), message_id: messageId, ...extra } as never);
  }
  async editMessageLiveLocation(latitude?: number, longitude?: number, extra: Record<string, unknown> = {}): Promise<Message | true> {
    return this.api.call("editMessageLiveLocation", { chat_id: this.chat?.id, message_id: this.message?.message_id, latitude, longitude, ...extra } as never) as Promise<Message | true>;
  }
  async stopMessageLiveLocation(extra: Record<string, unknown> = {}): Promise<Message | true> {
    return this.api.call("stopMessageLiveLocation", { chat_id: this.chat?.id, message_id: this.message?.message_id, ...extra } as never) as Promise<Message | true>;
  }
  async replyWithGame(gameShortName: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendGame", { game_short_name: gameShortName }, extra) as Promise<Message>;
  }
  async setGameScore(userId: number, score: number, extra: Record<string, unknown> = {}): Promise<Message | true> {
    return this.api.call("setGameScore", { chat_id: this.chat?.id, message_id: this.message?.message_id, user_id: userId, score, ...extra } as never) as Promise<Message | true>;
  }
  async getGameHighScores(userId = this.from?.id, extra: Record<string, unknown> = {}): Promise<unknown[]> {
    if (userId === undefined) throw new Error("No user in this update; pass a user_id explicitly.");
    return this.api.call("getGameHighScores", { chat_id: this.chat?.id, message_id: this.message?.message_id, user_id: userId, ...extra } as never) as Promise<unknown[]>;
  }
  async replyWithInvoice(title: string, description: string, payload: string, providerToken: string, currency: string, prices: Array<Record<string, unknown>>, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.sendMethod("sendInvoice", { title, description, payload, provider_token: providerToken, currency, prices }, extra) as Promise<Message>;
  }

  // ── Forum topics ──

  async createForumTopic(name: string, extra: Record<string, unknown> = {}): Promise<unknown> { return this.api.call("createForumTopic", { chat_id: this.requireChatId(), name, ...extra } as never); }
  async editForumTopic(extra: Record<string, unknown> = {}): Promise<true> {
    return this.api.call("editForumTopic", { chat_id: this.requireChatId(), message_thread_id: this.message?.message_thread_id, ...extra } as never) as Promise<true>;
  }
  async closeForumTopic(messageThreadId = this.message?.message_thread_id): Promise<true> {
    if (messageThreadId === undefined) throw new Error("Cannot act on a forum topic without a message_thread_id.");
    return this.api.call("closeForumTopic", { chat_id: this.requireChatId(), message_thread_id: messageThreadId } as never) as Promise<true>;
  }
  async reopenForumTopic(messageThreadId = this.message?.message_thread_id): Promise<true> {
    if (messageThreadId === undefined) throw new Error("Cannot act on a forum topic without a message_thread_id.");
    return this.api.call("reopenForumTopic", { chat_id: this.requireChatId(), message_thread_id: messageThreadId } as never) as Promise<true>;
  }
  async deleteForumTopic(messageThreadId = this.message?.message_thread_id): Promise<true> {
    if (messageThreadId === undefined) throw new Error("Cannot act on a forum topic without a message_thread_id.");
    return this.api.call("deleteForumTopic", { chat_id: this.requireChatId(), message_thread_id: messageThreadId } as never) as Promise<true>;
  }
  async unpinAllForumTopicMessages(messageThreadId = this.message?.message_thread_id): Promise<true> {
    if (messageThreadId === undefined) throw new Error("Cannot act on a forum topic without a message_thread_id.");
    return this.api.call("unpinAllForumTopicMessages", { chat_id: this.requireChatId(), message_thread_id: messageThreadId } as never) as Promise<true>;
  }
  async getForumTopicIconStickers(): Promise<unknown[]> { return this.api.call("getForumTopicIconStickers", {} as never) as Promise<unknown[]>; }
  async editGeneralForumTopic(name: string): Promise<true> { return this.api.call("editGeneralForumTopic", { chat_id: this.requireChatId(), name } as never) as Promise<true>; }
  async closeGeneralForumTopic(): Promise<true> { return this.api.call("closeGeneralForumTopic", { chat_id: this.requireChatId() } as never) as Promise<true>; }
  async reopenGeneralForumTopic(): Promise<true> { return this.api.call("reopenGeneralForumTopic", { chat_id: this.requireChatId() } as never) as Promise<true>; }
  async hideGeneralForumTopic(): Promise<true> { return this.api.call("hideGeneralForumTopic", { chat_id: this.requireChatId() } as never) as Promise<true>; }
  async unhideGeneralForumTopic(): Promise<true> { return this.api.call("unhideGeneralForumTopic", { chat_id: this.requireChatId() } as never) as Promise<true>; }

  withReplyMarkup(markup: ReplyMarkup): this { this.state.reply_markup = markup; return this; }
}
