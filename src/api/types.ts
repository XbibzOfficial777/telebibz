import type { TelegramMethodName } from "../../generated/api.js";

export type ChatId = number | string;
export type ParseMode = "Markdown" | "MarkdownV2" | "HTML";
export type InputFile = string | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream | { source: string | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream; filename?: string };

export interface ResponseParameters {
  retry_after?: number;
  migrate_to_chat_id?: number;
}

export interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: ResponseParameters;
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  supports_inline_queries?: boolean;
  can_connect_to_business?: boolean;
  has_main_web_app?: boolean;
  supports_guest_queries?: boolean;
  supports_join_request_queries?: boolean;
}

export interface Chat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  is_direct_messages?: boolean;
}

export interface MessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: User;
  language?: string;
  custom_emoji_id?: string;
}

export interface ReplyParameters {
  message_id?: number;
  chat_id?: ChatId;
  thread_id?: number;
  quote?: string;
  quote_parse_mode?: ParseMode;
  quote_entities?: MessageEntity[];
  allow_sending_without_reply?: boolean;
  checklist_task_id?: number;
  ephemeral_message_id?: number;
  poll_option_id?: number;
}

export interface LinkPreviewOptions {
  is_disabled?: boolean;
  url?: string;
  prefer_small_media?: boolean;
  prefer_large_media?: boolean;
  show_above_text?: boolean;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: WebAppInfo;
  login_url?: LoginUrl;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  callback_game?: CallbackGame;
  pay?: boolean;
  copy_text?: CopyTextButton;
  style?: "danger" | "success" | "primary";
  icon_custom_emoji_id?: string;
}

export interface CopyTextButton { text: string }
export interface CallbackGame { }
export interface WebAppInfo { url: string }
export interface LoginUrl { url: string; forward_text?: string; bot_username?: string; request_write_access?: boolean }

export interface KeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: { type?: "quiz" | "regular" };
  web_app?: WebAppInfo;
  request_users?: Record<string, unknown>;
  request_chat?: Record<string, unknown>;
}

export interface InlineKeyboardMarkup { inline_keyboard: InlineKeyboardButton[][] }
export interface ReplyKeyboardMarkup { keyboard: KeyboardButton[][]; is_persistent?: boolean; resize_keyboard?: boolean; one_time_keyboard?: boolean; input_field_placeholder?: string; selective?: boolean }
export interface ReplyKeyboardRemove { remove_keyboard: true; selective?: boolean }
export interface ForceReply { force_reply: true; input_field_placeholder?: string; selective?: boolean }
export type ReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;

export interface Message {
  message_id: number;
  message_thread_id?: number;
  from?: User;
  sender_chat?: Chat;
  sender_tag?: string;
  date: number;
  chat: Chat;
  text?: string;
  caption?: string;
  entities?: MessageEntity[];
  caption_entities?: MessageEntity[];
  reply_to_message?: Message;
  reply_parameters?: ReplyParameters;
  via_bot?: User;
  edit_date?: number;
  has_protected_content?: boolean;
  is_topic_message?: boolean;
  is_automatic_forward?: boolean;
  media_group_id?: string;
  author_signature?: string;
  reply_markup?: InlineKeyboardMarkup;
  [key: string]: unknown;
}

export interface CallbackQuery {
  id: string;
  from: User;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

export interface InlineQuery { id: string; from: User; query: string; offset: string; chat_type?: string; location?: unknown }
export interface ChosenInlineResult { result_id: string; from: User; query?: string; inline_message_id?: string; location?: unknown }
export interface Poll { id: string; question: string; options: Array<{ text: string; voter_count: number; [key: string]: unknown }>; total_voter_count: number; is_closed: boolean; is_anonymous: boolean; type: "regular" | "quiz"; allows_multiple_answers: boolean; [key: string]: unknown }
export interface PollAnswer { poll_id: string; voter_chat?: Chat; user?: User; option_ids: number[]; [key: string]: unknown }
export interface ChatMemberUpdated { chat: Chat; from: User; date: number; old_chat_member: Record<string, unknown>; new_chat_member: Record<string, unknown>; invite_link?: Record<string, unknown>; via_join_request?: boolean; via_chat_folder_invite_link?: boolean }
export interface ChatJoinRequest { chat: Chat; from: User; date: number; user_chat_id: number; bio?: string; invite_link?: Record<string, unknown>; [key: string]: unknown }

export interface Update {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  business_connection?: Record<string, unknown>;
  business_message?: Message;
  edited_business_message?: Message;
  deleted_business_messages?: Record<string, unknown>;
  guest_message?: Message;
  message_reaction?: Record<string, unknown>;
  message_reaction_count?: Record<string, unknown>;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: Record<string, unknown>;
  pre_checkout_query?: Record<string, unknown>;
  purchased_paid_media?: Record<string, unknown>;
  poll?: Poll;
  poll_answer?: PollAnswer;
  my_chat_member?: ChatMemberUpdated;
  chat_member?: ChatMemberUpdated;
  chat_join_request?: ChatJoinRequest;
  chat_boost?: Record<string, unknown>;
  removed_chat_boost?: Record<string, unknown>;
  managed_bot?: Record<string, unknown>;
  subscription?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BotCommand { command: string; description: string; is_ephemeral?: boolean }
export interface BotCommandScope { type: string; chat_id?: ChatId; user_id?: number }
export interface WebhookInfo { url: string; has_custom_certificate: boolean; pending_update_count: number; ip_address?: string; last_error_date?: number; last_error_message?: string; last_synchronization_error_date?: number; max_connections?: number; allowed_updates?: string[] }
export interface File { file_id: string; file_unique_id: string; file_size?: number; file_path?: string }
export interface UserProfilePhotos { total_count: number; photos: Array<Array<Record<string, unknown>>> }
export interface ChatMember { status: string; user: User; [key: string]: unknown }
export interface ChatAdministratorRights { is_anonymous?: boolean; can_manage_chat?: boolean; can_delete_messages?: boolean; can_manage_video_chats?: boolean; can_restrict_members?: boolean; can_promote_members?: boolean; can_change_info?: boolean; can_invite_users?: boolean; can_post_stories?: boolean; can_edit_stories?: boolean; can_delete_stories?: boolean; can_post_messages?: boolean; can_edit_messages?: boolean; can_pin_messages?: boolean; can_manage_topics?: boolean; can_manage_direct_messages?: boolean }

export interface SendMessageParams { chat_id: ChatId; text: string; business_connection_id?: string; message_thread_id?: number; parse_mode?: ParseMode; entities?: MessageEntity[]; link_preview_options?: LinkPreviewOptions; disable_notification?: boolean; protect_content?: boolean; allow_paid_broadcast?: boolean; message_effect_id?: string; suggested_post_parameters?: Record<string, unknown>; reply_parameters?: ReplyParameters; reply_markup?: ReplyMarkup }
export interface EditMessageTextParams extends Omit<SendMessageParams, "chat_id" | "text" | "reply_parameters"> { chat_id?: ChatId; message_id?: number; inline_message_id?: string; text: string; reply_markup?: InlineKeyboardMarkup }
export interface DeleteMessageParams { chat_id: ChatId; message_id: number }
export interface GetUpdatesParams { offset?: number; limit?: number; timeout?: number; allowed_updates?: string[] }
export interface SetWebhookParams { url: string; certificate?: InputFile; ip_address?: string; max_connections?: number; allowed_updates?: string[]; drop_pending_updates?: boolean; secret_token?: string }
export interface AnswerCallbackQueryParams { callback_query_id: string; text?: string; show_alert?: boolean; url?: string; cache_time?: number }
export interface GetChatParams { chat_id: ChatId }
export interface GetFileParams { file_id: string }
export interface SendPhotoParams extends Omit<SendMessageParams, "text"> { photo: InputFile; caption?: string; caption_entities?: MessageEntity[]; has_spoiler?: boolean; show_caption_above_media?: boolean }
export interface SendDocumentParams extends Omit<SendMessageParams, "text"> { document: InputFile; thumbnail?: InputFile; caption?: string; caption_entities?: MessageEntity[]; disable_content_type_detection?: boolean }

export interface TelegramMethodMap {
  getMe: { params: Record<never, never>; result: User };
  getUpdates: { params: GetUpdatesParams; result: Update[] };
  setWebhook: { params: SetWebhookParams; result: boolean };
  deleteWebhook: { params: { drop_pending_updates?: boolean }; result: boolean };
  getWebhookInfo: { params: Record<never, never>; result: WebhookInfo };
  sendMessage: { params: SendMessageParams; result: Message };
  editMessageText: { params: EditMessageTextParams; result: Message | true };
  deleteMessage: { params: DeleteMessageParams; result: true };
  answerCallbackQuery: { params: AnswerCallbackQueryParams; result: true };
  getChat: { params: GetChatParams; result: Chat };
  getFile: { params: GetFileParams; result: File };
  getUserProfilePhotos: { params: { user_id: number; offset?: number; limit?: number }; result: UserProfilePhotos };
  sendPhoto: { params: SendPhotoParams; result: Message };
  sendDocument: { params: SendDocumentParams; result: Message };
}

export type ApiParams<M extends TelegramMethodName> = M extends keyof TelegramMethodMap ? TelegramMethodMap[M]["params"] : Record<string, unknown>;
export type ApiResult<M extends TelegramMethodName> = M extends keyof TelegramMethodMap ? TelegramMethodMap[M]["result"] : unknown;
export type ApiCallArgs<M extends TelegramMethodName> = keyof ApiParams<M> extends never ? [] : [params: ApiParams<M>];
