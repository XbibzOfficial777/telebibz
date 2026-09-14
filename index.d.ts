// index.d.ts — tipe ringkas untuk autocompletion editor (autocorrect).
// v3: tipe longgar (JS-first) — parity grammY.
type Context = any; type Bot = any;

declare module '@xbibzlibrary/telebibz' {
  type Color = 'danger' | 'success' | 'primary';
  type Handler = (ctx: Context) => unknown;

  type WizardMode = 'send' | 'edit' | 'delete';
  type WizardButton = string | { text: string; value?: unknown };
  interface WizardStep {
    key: string;
    ask: string | ((ctx: Context) => string | Promise<string>);
    parse?: (text: string, ctx: Context) => unknown | Promise<unknown>;
    validate?: (value: unknown, ctx: Context) => string | null | Promise<string | null>;
    opts?: Record<string, unknown>;
    /** Tombol pilihan: ['A','B'] | [{text,value}] | baris eksplisit [['A'],['B','C']]. */
    buttons?: Array<WizardButton | WizardButton[]>;
    /** true → tombol inline (callback), default reply keyboard. */
    inline?: boolean;
    /** true/string → tolak ketikan bebas, wajib pilih tombol. */
    onlyButtons?: boolean | string;
    /** Override mode tampilan per langkah. */
    mode?: WizardMode;
    /** Reply keyboard sekali pakai. */
    oneTime?: boolean;
  }
  interface WizardDef {
    steps: WizardStep[];
    done: (answers: Record<string, unknown>, ctx: Context) => unknown;
    cancelWords?: string[];
    onCancel?: (ctx: Context) => unknown;
    /** 'send' (default) | 'edit' satu pesan | 'delete' tanya-hapus per langkah. */
    mode?: WizardMode;
    /** Hapus pesan tanya terakhir saat wizard selesai (default: true bila mode 'delete'). */
    cleanup?: boolean;
    /** Singkirkan reply keyboard saat selesai (default: true bila tombol reply pernah dipakai). */
    removeKeyboard?: boolean;
  }

  interface TeleBibzOpts {
    allowedUpdates?: string[];
    onError?: (err: unknown, ctx?: Context) => unknown;
    silent?: boolean;
    dropPending?: boolean;
    session?: { initial?: () => unknown; getKey?: (ctx: Context) => string | undefined; storage?: unknown };
    transport?: (method: string, payload?: object) => Promise<unknown>;
  }

  class TeleBibz {
    constructor(token: string, opts?: TeleBibzOpts);
    api: any;
    botInfo: any;
    use(...mw: any[]): this;
    cmd(names: string | string[], ...mw: Handler[]): this;
    hears(match: string | RegExp, ...mw: Handler[]): this;
    action(trigs: string | RegExp | string[], ...mw: Handler[]): this;
    on(filter: string | string[], ...mw: Handler[]): this;
    start(replies: string | Handler): this;
    wizard(id: string, def: WizardDef, bindCommand?: boolean): this;
    wizardStart(ctx: Context, id: string): Promise<unknown>;
    wizardActive(ctx: Context): boolean;
    wizardCancel(ctx: Context): Promise<boolean>;
    wizardEdit(ctx: Context, text: string, extra?: object): Promise<unknown>;
    wizardDelete(ctx: Context): Promise<boolean>;
    broadcast(ids: Array<number | string>, pesan: any, opts?: { delay?: number }): Promise<{ terkirim: number; gagal: number; errors: Array<{ chatId: any; pesan: string }> }>;
    launch(opts?: Record<string, unknown>): Promise<this>;
    handleUpdate(update: any): Promise<void>;
    webhook(...args: any[]): any;
    stop(): Promise<void>;
  }

  function btn(text: string, callbackData: string | number, style?: Color, iconId?: string): any;
  function url(text: string, link: string, style?: Color, iconId?: string): any;
  function webApp(text: string, link: string, iconId?: string): any;
  function copy(text: string, value: string, iconId?: string): any;
  function kb(rows: any[][]): { reply_markup: { inline_keyboard: any[][] } };
  namespace kb {
    function markup(rows: any[][]): { inline_keyboard: any[][] };
    function confirm(yesData: string, noData: string, labelYes?: string, labelNo?: string): any;
  }

  const wizard: {
    define: (id: string, def: WizardDef) => string;
    start: (ctx: Context, id: string) => Promise<unknown>;
    active: (ctx: Context) => boolean;
    cancel: (ctx: Context) => Promise<boolean>;
    editAsk: (ctx: Context, text: string, extra?: object) => Promise<unknown>;
    deleteAsk: (ctx: Context) => Promise<boolean>;
    KEY: string;
  };

  function humanize(err: unknown): { pesan: string; saran: string | null; method?: string; code?: number };
  const log: { info: Function; ok: Function; warn: Function; error: Function; banner: Function };
  const say: { html: (text: string, extra?: object) => object };

  class File { constructor(src: any, filename?: string, type?: string); src: any; filename: string; data(): Promise<Buffer>; }
  const InputFile: typeof File;
  const InlineKeyboard: any;
  const Keyboard: any;
  class ApiError extends Error { description: string; error_code?: number; method?: string; payload?: any; }
  const Composer: any; const BotError: any; const session: any; const Api: any;
}

import { Menu as _M } from './lib/menus';
export {};
