import type { ApiClient } from "../api/client.js";
import type { Chat, ChatId, InputFile, Message, ReplyMarkup, SendDocumentParams, SendPhotoParams, Update, User } from "../api/types.js";

export interface ContextOptions<S extends object = Record<string, unknown>> {
  update: Update;
  api: ApiClient;
  session: S;
  services: Record<string, unknown>;
  me?: User;
}

export class Context<S extends object = Record<string, unknown>> {
  readonly update: Update;
  readonly api: ApiClient;
  readonly session: S;
  readonly state: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  readonly services: Record<string, unknown>;
  readonly params: Record<string, string> = Object.create(null) as Record<string, string>;
  readonly me?: User;
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

  async reply(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    const reply_parameters = this.message?.message_id !== undefined
      ? { message_id: this.message.message_id, ...(extra.reply_parameters as Record<string, unknown> | undefined) }
      : (extra.reply_parameters as Record<string, unknown> | undefined);
    return this.api.methods.sendMessage({
      chat_id: this.chat.id,
      text,
      ...(reply_parameters ? { reply_parameters } : {}),
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async send(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot send without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    return this.api.methods.sendMessage({
      chat_id: this.chat.id,
      text,
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async edit(text: string, extra: Record<string, unknown> = {}): Promise<Message | true> {
    if (!this.chat || !this.message) throw new Error("Cannot edit without a chat and message in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    return this.api.methods.editMessageText({
      chat_id: this.chat.id,
      message_id: this.message.message_id,
      text,
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message | true>;
  }

  async replyWithHTML(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.reply(text, { parse_mode: "HTML", ...extra });
  }

  async replyWithMarkdown(text: string, extra: Record<string, unknown> = {}): Promise<Message> {
    return this.reply(text, { parse_mode: "MarkdownV2", ...extra });
  }

  async replyWithPhoto(photo: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    const reply_parameters = this.message?.message_id !== undefined
      ? { message_id: this.message.message_id, ...(extra.reply_parameters as Record<string, unknown> | undefined) }
      : (extra.reply_parameters as Record<string, unknown> | undefined);
    return this.api.methods.sendPhoto({
      chat_id: this.chat.id,
      photo,
      ...(reply_parameters ? { reply_parameters } : {}),
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async replyWithDocument(document: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    const reply_parameters = this.message?.message_id !== undefined
      ? { message_id: this.message.message_id, ...(extra.reply_parameters as Record<string, unknown> | undefined) }
      : (extra.reply_parameters as Record<string, unknown> | undefined);
    return this.api.methods.sendDocument({
      chat_id: this.chat.id,
      document,
      ...(reply_parameters ? { reply_parameters } : {}),
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async replyWithAudio(audio: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    return this.api.call("sendAudio", {
      chat_id: this.chat.id,
      audio,
      reply_parameters: this.message?.message_id !== undefined ? { message_id: this.message.message_id } : undefined,
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async replyWithVideo(video: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    return this.api.call("sendVideo", {
      chat_id: this.chat.id,
      video,
      reply_parameters: this.message?.message_id !== undefined ? { message_id: this.message.message_id } : undefined,
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
  }

  async replyWithVoice(voice: InputFile, extra: Record<string, unknown> = {}): Promise<Message> {
    if (!this.chat) throw new Error("Cannot reply without a chat in this update.");
    const reply_markup = extra.reply_markup ?? this.state.reply_markup;
    return this.api.call("sendVoice", {
      chat_id: this.chat.id,
      voice,
      reply_parameters: this.message?.message_id !== undefined ? { message_id: this.message.message_id } : undefined,
      ...(reply_markup ? { reply_markup } : {}),
      ...extra,
    } as never) as Promise<Message>;
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
  async getFile(fileId: string): Promise<unknown> { return this.api.methods.getFile({ file_id: fileId }); }
  withReplyMarkup(markup: ReplyMarkup): this { this.state.reply_markup = markup; return this; }
}
