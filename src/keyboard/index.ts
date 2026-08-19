import type { InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, ReplyMarkup } from "../api/types.js";

export class InlineKeyboard {
  private readonly rows: InlineKeyboardButton[][] = [];
  static from(rows: InlineKeyboardButton[][]): InlineKeyboard { const keyboard = new InlineKeyboard(); keyboard.rows.push(...rows.map((row) => [...row])); return keyboard; }
  text(text: string, callbackData: string): this { return this.button({ text, callback_data: callbackData }); }
  url(text: string, url: string): this { return this.button({ text, url }); }
  webApp(text: string, url: string): this { return this.button({ text, web_app: { url } }); }
  pay(text = "Pay"): this { return this.button({ text, pay: true }); }
  copy(text: string, copiedText: string): this { return this.button({ text, copy_text: { text: copiedText } }); }
  button(button: InlineKeyboardButton): this { this.ensureRow().push(validateInlineButton(button)); return this; }
  row(...buttons: InlineKeyboardButton[]): this { this.rows.push(buttons.map(validateInlineButton)); return this; }
  conditional(condition: boolean, factory: (keyboard: this) => this): this { return condition ? factory(this) : this; }
  grid(buttons: InlineKeyboardButton[], columns: number): this { if (!Number.isInteger(columns) || columns < 1) throw new RangeError("columns must be a positive integer"); for (let index = 0; index < buttons.length; index += columns) this.rows.push(buttons.slice(index, index + columns).map(validateInlineButton)); return this; }
  build(): InlineKeyboardMarkup { return { inline_keyboard: this.rows.map((row) => [...row]) }; }
  asReplyMarkup(): InlineKeyboardMarkup { return this.build(); }
  private ensureRow(): InlineKeyboardButton[] { const row = this.rows.at(-1); if (row) return row; const next: InlineKeyboardButton[] = []; this.rows.push(next); return next; }
}

export class ReplyKeyboard {
  private readonly rows: KeyboardButton[][] = [];
  text(text: string): this { return this.button({ text }); }
  contact(text: string): this { return this.button({ text, request_contact: true }); }
  location(text: string): this { return this.button({ text, request_location: true }); }
  poll(text: string, type?: "quiz" | "regular"): this { return this.button({ text, request_poll: type ? { type } : {} }); }
  webApp(text: string, url: string): this { return this.button({ text, web_app: { url } }); }
  button(button: KeyboardButton): this { this.ensureRow().push(button); return this; }
  row(...buttons: KeyboardButton[]): this { this.rows.push([...buttons]); return this; }
  grid(buttons: KeyboardButton[], columns: number): this { if (!Number.isInteger(columns) || columns < 1) throw new RangeError("columns must be a positive integer"); for (let index = 0; index < buttons.length; index += columns) this.rows.push(buttons.slice(index, index + columns)); return this; }
  build(options: Omit<ReplyKeyboardMarkup, "keyboard"> = {}): ReplyKeyboardMarkup { return { keyboard: this.rows.map((row) => [...row]), ...options }; }
  asReplyMarkup(): ReplyKeyboardMarkup { return this.build(); }
  private ensureRow(): KeyboardButton[] { const row = this.rows.at(-1); if (row) return row; const next: KeyboardButton[] = []; this.rows.push(next); return next; }
}

export function removeKeyboard(selective = false): ReplyMarkup { return { remove_keyboard: true, ...(selective ? { selective: true } : {}) }; }
export function forceReply(placeholder?: string, selective = false): ReplyMarkup { return { force_reply: true, ...(placeholder ? { input_field_placeholder: placeholder } : {}), ...(selective ? { selective: true } : {}) }; }
function validateInlineButton(button: InlineKeyboardButton): InlineKeyboardButton { if (!button.text) throw new Error("Inline keyboard button text is required."); const actions = [button.url, button.callback_data, button.web_app, button.login_url, button.switch_inline_query, button.switch_inline_query_current_chat, button.callback_game, button.pay, button.copy_text].filter((value) => value !== undefined); if (actions.length !== 1) throw new Error(`Inline button ${button.text} must contain exactly one action.`); if (button.callback_data && new TextEncoder().encode(button.callback_data).length > 64) throw new RangeError("callback_data must be at most 64 bytes."); return { ...button }; }
