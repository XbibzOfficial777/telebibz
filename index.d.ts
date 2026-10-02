// Public TypeScript surface for @xbibzlibrary/telebibz.
import type { ApiMethods, Opts } from './types/telegram-bot-api/methods.js';
import type { InputRichBlock, InputRichBlockButtons, InputRichMessage, InputRichMessageMedia, RichMessageButton, RichTextButton } from './types/telegram-bot-api/rich.js';
export * as TelegramTypes from './types/telegram-bot-api/mod.js';
export type * from './types/telegram-bot-api/rich.js';

export type TelegramFileInput = string | File;
export type TelegramMethodName = keyof ApiMethods<TelegramFileInput>;
export type TelegramApiMethods = ApiMethods<TelegramFileInput>;
export type TelegramApiPayloads = Opts<TelegramFileInput>;
export type TelegramMethodArguments<M extends TelegramMethodName> = Parameters<ApiMethods<TelegramFileInput>[M]>;
export type TelegramMethodPayload<M extends TelegramMethodName> = Opts<TelegramFileInput>[M];
export type TelegramMethodResult<M extends TelegramMethodName> = ReturnType<ApiMethods<TelegramFileInput>[M]>;
export const TELEGRAM_API_METHODS: readonly TelegramMethodName[];

export interface ApiClient {
  readonly token: string;
  config: { use(transformer: (prev: (method: string, payload?: any) => Promise<any>, method: string, payload?: any) => any): ApiClient['config'] };
  callApi<M extends TelegramMethodName>(method: M, ...args: TelegramMethodArguments<M>): Promise<TelegramMethodResult<M>>;
  raw<M extends TelegramMethodName>(method: M, ...args: TelegramMethodArguments<M>): Promise<TelegramMethodResult<M>>;
  sendRichMessage(payload: TelegramMethodPayload<'sendRichMessage'>): Promise<TelegramMethodResult<'sendRichMessage'>>;
  sendLivePhoto(payload: TelegramMethodPayload<'sendLivePhoto'>): Promise<TelegramMethodResult<'sendLivePhoto'>>;
  sendMessageDraft(payload: TelegramMethodPayload<'sendMessageDraft'>): Promise<TelegramMethodResult<'sendMessageDraft'>>;
  sendRichMessageDraft(payload: TelegramMethodPayload<'sendRichMessageDraft'>): Promise<TelegramMethodResult<'sendRichMessageDraft'>>;
  answerGuestQuery(payload: TelegramMethodPayload<'answerGuestQuery'>): Promise<TelegramMethodResult<'answerGuestQuery'>>;
  editEphemeralMessageText(payload: TelegramMethodPayload<'editEphemeralMessageText'>): Promise<TelegramMethodResult<'editEphemeralMessageText'>>;
  editEphemeralMessageMedia(payload: TelegramMethodPayload<'editEphemeralMessageMedia'>): Promise<TelegramMethodResult<'editEphemeralMessageMedia'>>;
  editEphemeralMessageCaption(payload: TelegramMethodPayload<'editEphemeralMessageCaption'>): Promise<TelegramMethodResult<'editEphemeralMessageCaption'>>;
  editEphemeralMessageReplyMarkup(payload: TelegramMethodPayload<'editEphemeralMessageReplyMarkup'>): Promise<TelegramMethodResult<'editEphemeralMessageReplyMarkup'>>;
  deleteEphemeralMessage(payload: TelegramMethodPayload<'deleteEphemeralMessage'>): Promise<TelegramMethodResult<'deleteEphemeralMessage'>>;
  [method: string]: any;
}

export type Handler = (ctx: Context, next?: () => Promise<unknown>) => unknown;
export type WizardMode = 'send' | 'edit' | 'delete';
export type WizardButton = string | { text: string; value?: unknown };
export type Color = 'danger' | 'success' | 'primary';

export interface WizardStep {
  key: string;
  ask: string | ((ctx: Context) => string | Promise<string>);
  parse?: (text: unknown, ctx: Context) => unknown | Promise<unknown>;
  validate?: (value: unknown, ctx: Context) => string | null | Promise<string | null>;
  opts?: Record<string, unknown>;
  buttons?: Array<WizardButton | WizardButton[]>;
  inline?: boolean;
  onlyButtons?: boolean | string;
  mode?: WizardMode;
  oneTime?: boolean;
}
export interface WizardDef {
  steps: WizardStep[];
  done: (answers: Record<string, unknown>, ctx: Context) => unknown;
  cancelWords?: string[];
  onCancel?: (ctx: Context) => unknown;
  mode?: WizardMode;
  cleanup?: boolean;
  removeKeyboard?: boolean;
}
export interface SessionOptions {
  initial?: () => Record<string, unknown>;
  getKey?: (ctx: Context) => string | undefined;
  storage?: {
    read(key: string): unknown | Promise<unknown>;
    write(key: string, value: Record<string, unknown>): unknown | Promise<unknown>;
    delete(key: string): unknown | Promise<unknown>;
  } | Map<string, Record<string, unknown>>;
}
export interface TeleBibzOptions {
  allowedUpdates?: string[];
  onError?: (err: unknown, ctx?: Context) => unknown;
  silent?: boolean;
  dropPending?: boolean;
  session?: SessionOptions;
  transport?: (method: string, payload?: Record<string, unknown>) => Promise<unknown>;
  apiRoot?: string;
  proxy?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class Context {
  constructor(update: any, api: any, me?: any);
  update: any;
  api: ApiClient;
  me?: any;
  msg?: any;
  chat?: any;
  from?: any;
  chatId?: number | string;
  msgId?: number;
  guestQueryId?: string;
  session: Record<string, any>;
  match?: string;
  reply(text: string, extra?: object): Promise<any>;
  replyWithRichMessage(content: InputRichMessage<TelegramFileInput>, extra?: object): Promise<any>;
  replyWithLivePhoto(livePhoto: TelegramFileInput, photo: TelegramFileInput, extra?: object): Promise<any>;
  replyEphemeral(text: string, receiverUserId: number, extra?: object): Promise<any>;
  sendMessageDraft(draftId: number, text: string, extra?: object): Promise<any>;
  sendRichMessageDraft(draftId: number, content: TelegramMethodPayload<'sendRichMessageDraft'>['rich_message'], extra?: object): Promise<any>;
  replyWithHTML(text: string, extra?: object): Promise<any>;
  replyWithMarkdown(text: string, extra?: object): Promise<any>;
  replyWithPhoto(photo: any, extra?: object): Promise<any>;
  replyWithVideo(video: any, extra?: object): Promise<any>;
  replyWithAudio(audio: any, extra?: object): Promise<any>;
  replyWithDocument(document: any, extra?: object): Promise<any>;
  replyWithAnimation(animation: any, extra?: object): Promise<any>;
  replyWithVoice(voice: any, extra?: object): Promise<any>;
  replyWithVideoNote(videoNote: any, extra?: object): Promise<any>;
  replyWithSticker(sticker: any, extra?: object): Promise<any>;
  replyWithMediaGroup(media: any[], extra?: object): Promise<any>;
  replyWithLocation(latitude: number, longitude: number, extra?: object): Promise<any>;
  replyWithVenue(latitude: number, longitude: number, title: string, address: string, extra?: object): Promise<any>;
  replyWithContact(phone: string, firstName: string, extra?: object): Promise<any>;
  replyWithPoll(question: string, options: any[], extra?: object): Promise<any>;
  replyWithDice(emoji?: string, extra?: object): Promise<any>;
  replyWithInvoice(title: string, description: string, payload: string, currency: string, prices: any[], extra?: object): Promise<any>;
  replyWithChatAction(action?: string, extra?: object): Promise<any>;
  forwardMessage(to: number | string, from?: number | string, messageId?: number, extra?: object): Promise<any>;
  copyMessage(to: number | string, from?: number | string, messageId?: number, extra?: object): Promise<any>;
  editMessageText(text: string, extra?: object): Promise<any>;
  editRichMessage(content: InputRichMessage<TelegramFileInput>, extra?: object): Promise<any>;
  editEphemeralMessageText(receiverUserId: number, ephemeralMessageId: number, text: string, extra?: object): Promise<any>;
  editEphemeralRichMessage(receiverUserId: number, ephemeralMessageId: number, content: InputRichMessage<TelegramFileInput>, extra?: object): Promise<any>;
  editEphemeralMessageMedia(receiverUserId: number, ephemeralMessageId: number, media: any, extra?: object): Promise<any>;
  editEphemeralMessageCaption(receiverUserId: number, ephemeralMessageId: number, extra?: object): Promise<any>;
  editEphemeralMessageReplyMarkup(receiverUserId: number, ephemeralMessageId: number, extra?: object): Promise<any>;
  deleteEphemeralMessage(receiverUserId: number, ephemeralMessageId: number): Promise<any>;
  editMessageCaption(extra?: object): Promise<any>;
  editMessageMedia(media: any, extra?: object): Promise<any>;
  editMessageReplyMarkup(extra?: object): Promise<any>;
  deleteMessage(chatId?: number | string, messageId?: number): Promise<any>;
  deleteMessages(ids: number[]): Promise<any>;
  react(emoji?: string, extra?: object): Promise<any>;
  answerCallbackQuery(extra?: object | string): Promise<any>;
  answerInlineQuery(results: any[], extra?: object): Promise<any>;
  answerGuestQuery(result: any): Promise<any>;
  getFile(): Promise<any>;
  downloadFile(dest: string): Promise<string>;
  [key: string]: any;
}

export class Composer {
  use(...middleware: any[]): this;
  on(filter: string | string[], ...middleware: Handler[]): this;
  hears(match: string | RegExp, ...middleware: Handler[]): this;
  command(names: string | string[], ...middleware: Handler[]): this;
  callbackQuery(triggers: string | RegExp | Array<string | RegExp>, ...middleware: Handler[]): this;
  filter(predicate: (ctx: Context) => unknown, ...middleware: Array<Handler | Composer>): Composer;
  drop(predicate: (ctx: Context) => unknown, ...middleware: Array<Handler | Composer>): Composer;
  branch(predicate: (ctx: Context) => unknown, yes: any, no: any): this;
  route(router: string | ((ctx: Context) => unknown), routes: Record<string, any>): this;
  lazy(factory: (ctx: Context) => any): this;
  fork(...middleware: Handler[]): this;
  errorBoundary(handler: (err: BotError, next: () => Promise<unknown>) => unknown, ...middleware: Handler[]): Composer;
  middleware(): Handler;
  run(ctx: Context, next?: () => Promise<unknown>): Promise<unknown>;
}
export class BotError extends Error { error: unknown; ctx: Context; }

export class TeleBibz {
  constructor(token: string, opts?: TeleBibzOptions);
  api: ApiClient;
  botInfo?: any;
  use(...middleware: Array<Handler | Composer>): this;
  cmd(names: string | string[], ...middleware: Handler[]): this;
  hears(match: string | RegExp, ...middleware: Handler[]): this;
  action(triggers: string | RegExp | Array<string | RegExp>, ...middleware: Handler[]): this;
  on(filter: string | string[], ...middleware: Handler[]): this;
  inlineQuery(trigger: string | RegExp, ...middleware: Handler[]): this;
  branch(predicate: (ctx: Context) => unknown, yes: Handler | Composer, no: Handler | Composer): this;
  filter(predicate: (ctx: Context) => unknown, ...middleware: Array<Handler | Composer>): this;
  drop(predicate: (ctx: Context) => unknown, ...middleware: Array<Handler | Composer>): this;
  route(router: string | ((ctx: Context) => unknown), routes: Record<string, Handler | Composer>): this;
  lazy(factory: (ctx: Context) => Handler | Handler[] | Composer | Promise<Handler | Handler[] | Composer>): this;
  fork(...middleware: Array<Handler | Composer>): this;
  start(replies: string | Handler): this;
  wizard(id: string, def: WizardDef, bindCommand?: boolean): this;
  wizardStart(ctx: Context, id: string): Promise<unknown>;
  wizardActive(ctx: Context): boolean;
  wizardCancel(ctx: Context): Promise<boolean>;
  wizardEdit(ctx: Context, text: string, extra?: object): Promise<unknown>;
  wizardDelete(ctx: Context): Promise<boolean>;
  broadcast(ids: Array<number | string>, message: any, opts?: { delay?: number }): Promise<{ terkirim: number; gagal: number; errors: Array<{ chatId: any; pesan: string }> }>;
  init(): Promise<any>;
  launch(opts?: Record<string, unknown>): Promise<this>;
  handleUpdate(update: any): Promise<void>;
  webhook(opts?: { secretToken?: string; maxBodyBytes?: number }): (req: any, res: any) => Promise<void>;
  stop(): void;
  readonly runPromise?: Promise<void>;
}
export { TeleBibz as Bot };

export function session(opts?: SessionOptions): Handler;
export function btn(text: string, callbackData: string | number, style?: Color, iconId?: string): any;
export function url(text: string, link: string, style?: Color, iconId?: string): any;
export function webApp(text: string, link: string, iconId?: string): any;
export function copy(text: string, value: string, iconId?: string): any;
export function kb(rows: any[][]): { reply_markup: { inline_keyboard: any[][] } };
export namespace kb {
  function markup(rows: any[][]): { inline_keyboard: any[][] };
  function confirm(yesData: string, noData: string, labelYes?: string, labelNo?: string): any;
}
export class InlineKeyboard {
  constructor(rows?: any[][]);
  text(text: string, data: string, style?: Color, iconId?: string): this;
  url(text: string, link: string, style?: Color, iconId?: string): this;
  webApp(text: string, link: string, iconId?: string): this;
  copy(text: string, value: string, iconId?: string): this;
  row(): this;
  build(): { reply_markup: { inline_keyboard: any[][] } };
}
export class Keyboard {
  text(text: string): this;
  requestContact(text: string): this;
  requestLocation(text: string): this;
  row(): this;
  resized(value?: boolean): this;
  oneTime(value?: boolean): this;
  build(): any;
}

export class Menu extends Composer {
  constructor(id: string);
  text(label: string, handler?: Handler): this;
  url(label: string, link: string, opts?: object): this;
  webApp(label: string, link: string): this;
  submenu(label: string, targetId: string): this;
  back(label?: string, parentId?: string): this;
  row(): this;
  render(ctx: Context): Promise<any>;
}
export class MenuContainer extends Composer {
  create(id: string): Menu;
  get(id: string): Menu | undefined;
}

export class File {
  constructor(src: any, filename?: string, type?: string);
  src: any;
  filename: string;
  type?: string;
  data(): Promise<Uint8Array>;
}
export class InputFile extends File {}
export const InputMediaBuilder: {
  photo(media: any, extra?: object): any;
  video(media: any, extra?: object): any;
  livePhoto(media: any, photo: any, extra?: object): any;
  document(media: any, extra?: object): any;
  audio(media: any, extra?: object): any;
  animation(media: any, extra?: object): any;
};
export const InputPaidMediaBuilder: {
  photo(media: any, extra?: object): any;
  video(media: any, extra?: object): any;
  livePhoto(media: any, photo: any, extra?: object): any;
};
export class RichMessageBuilder {
  html(value: string): this;
  markdown(value: string): this;
  blocks(value?: InputRichBlock<TelegramFileInput>[]): this;
  add(...blocks: InputRichBlock<TelegramFileInput>[]): this;
  media(items: InputRichMessageMedia<TelegramFileInput>[]): this;
  rtl(value?: boolean): this;
  skipEntityDetection(value?: boolean): this;
  build(): InputRichMessage<TelegramFileInput>;
  buildDraft(): TelegramMethodPayload<'sendRichMessageDraft'>['rich_message'];
}
export const rich: {
  html(html: string, options?: Partial<InputRichMessage<TelegramFileInput>>): InputRichMessage<TelegramFileInput>;
  markdown(markdown: string, options?: Partial<InputRichMessage<TelegramFileInput>>): InputRichMessage<TelegramFileInput>;
  blocks(blocks: InputRichBlock<TelegramFileInput>[], options?: Partial<InputRichMessage<TelegramFileInput>>): InputRichMessage<TelegramFileInput>;
  draftHtml(html: string, options?: Partial<InputRichMessage<TelegramFileInput>>): TelegramMethodPayload<'sendRichMessageDraft'>['rich_message'];
  draftMarkdown(markdown: string, options?: Partial<InputRichMessage<TelegramFileInput>>): TelegramMethodPayload<'sendRichMessageDraft'>['rich_message'];
  draftBlocks(blocks: InputRichBlock<TelegramFileInput>[], options?: Partial<InputRichMessage<TelegramFileInput>>): TelegramMethodPayload<'sendRichMessageDraft'>['rich_message'];
  button(text: string, action: Record<string, unknown>, style?: 'danger' | 'success' | 'primary' | 'link'): RichMessageButton;
  buttonText(text: string, action: Record<string, unknown>, style?: 'danger' | 'success' | 'primary' | 'link'): RichTextButton;
  buttons(buttons: RichMessageButton[], align?: 'left' | 'center' | 'right'): InputRichBlockButtons;
  block(type: string, props?: Record<string, unknown>): InputRichBlock<TelegramFileInput>;
  [builder: string]: (...args: any[]) => any;
};
export function inputRichMessage(content: Partial<InputRichMessage<TelegramFileInput>>, options?: Partial<InputRichMessage<TelegramFileInput>>): InputRichMessage<TelegramFileInput>;

export function makeApi(token: string, transport?: TeleBibzOptions['transport'], transportOpts?: TeleBibzOptions): ApiClient;
export function createTransport(token: string, opts?: { apiRoot?: string; proxy?: string; timeoutMs?: number; headers?: Record<string, string> }): TeleBibzOptions['transport'];
export class ApiError extends Error {
  description: string;
  error_code?: number;
  method?: string;
  payload?: any;
  parameters: Record<string, any>;
}
export function autoRetry(opts?: { maxRetry?: number; baseDelayMs?: number }): Function;
export function throttler(opts?: { perSecond?: number }): Function;
export function limiter(opts?: { windowMs?: number; limit?: number; onExceeded?: Handler }): Handler;
export function broadcast(api: any, ids: Array<number | string>, message: any, opts?: { delay?: number }): Promise<any>;
export function matchInlineQuery(trigger: string | RegExp): (ctx: Context) => boolean;
export const iq: Record<string, (...args: any[]) => any>;
export function humanize(error: unknown): { pesan: string; saran: string | null; method?: string; code?: number | string };
export const wizard: {
  define(id: string, def: WizardDef): string;
  get(id: string): WizardDef | undefined;
  start(ctx: Context, id: string): Promise<unknown>;
  active(ctx: Context): boolean;
  cancel(ctx: Context): Promise<boolean>;
  editAsk(ctx: Context, text: string, extra?: object): Promise<unknown>;
  deleteAsk(ctx: Context): Promise<boolean>;
  middleware(): Handler;
  KEY: string;
};
export const log: {
  info(...args: any[]): void;
  ok(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  paint(code: string, text: unknown): string;
  banner(title: string, rows?: string[], developer?: string): void;
};
export const say: { html(text: string, extra?: object): object };
