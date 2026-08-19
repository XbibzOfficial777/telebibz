import { InlineKeyboard } from "../keyboard/index.js";
import type { InlineKeyboardButton, InlineKeyboardMarkup } from "../api/types.js";

export interface Page<T> { items: T[]; page: number; pageCount: number; hasPrevious: boolean; hasNext: boolean }

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  if (!Number.isInteger(page) || page < 0) throw new RangeError("page must be a non-negative integer");
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError("pageSize must be a positive integer");
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  return { items: items.slice(start, start + pageSize) as T[], page: safePage, pageCount, hasPrevious: safePage > 0, hasNext: safePage < pageCount - 1 };
}

export function paginationButtons(page: Page<unknown>, prefix: string, labels: { previous?: string; next?: string } = {}): InlineKeyboardButton[] {
  const buttons: InlineKeyboardButton[] = [];
  if (page.hasPrevious) buttons.push({ text: labels.previous ?? "Previous", callback_data: `${prefix}:page:${page.page - 1}` });
  buttons.push({ text: `${page.page + 1}/${page.pageCount}`, callback_data: `${prefix}:noop` });
  if (page.hasNext) buttons.push({ text: labels.next ?? "Next", callback_data: `${prefix}:page:${page.page + 1}` });
  return buttons;
}

export interface MenuContext { userId?: number; permissions?: Iterable<string>; [key: string]: unknown }
export type MenuVisibility = boolean | ((context: MenuContext, item: MenuItem) => boolean | Promise<boolean>);
export type MenuPermission = string | ((context: MenuContext, item: MenuItem) => boolean | Promise<boolean>);

export interface MenuItem {
  id: string;
  label: string;
  callbackData?: string;
  url?: string;
  visible?: MenuVisibility;
  permission?: MenuPermission;
}

export interface MenuBuildOptions { columns?: number; includeBreadcrumbs?: boolean }

export class Menu {
  private readonly itemsList: MenuItem[] = [];
  private readonly parents: string[] = [];
  constructor(readonly id: string) {}

  item(item: MenuItem): this {
    if (!item.id || !item.label) throw new Error("Menu item id and label are required.");
    if (item.url !== undefined && item.callbackData !== undefined) throw new Error("A menu item cannot have both url and callbackData.");
    this.itemsList.push(item);
    return this;
  }

  breadcrumb(label: string): this { if (label) this.parents.push(label); return this; }
  get items(): readonly MenuItem[] { return this.itemsList; }
  get breadcrumbs(): readonly string[] { return this.parents; }

  async visibleItems(context: MenuContext = {}): Promise<MenuItem[]> {
    const permissions = context.permissions ? new Set(context.permissions) : undefined;
    const result: MenuItem[] = [];
    for (const item of this.itemsList) {
      const visible = typeof item.visible === "function" ? await item.visible(context, item) : item.visible ?? true;
      if (!visible) continue;
      const allowed = typeof item.permission === "function"
        ? await item.permission(context, item)
        : item.permission === undefined
          ? true
          : permissions?.has(item.permission) ?? false;
      if (allowed) result.push(item);
    }
    return result;
  }

  async build(context: MenuContext = {}, options: MenuBuildOptions = {}): Promise<InlineKeyboard> {
    const columns = options.columns ?? 1;
    if (!Number.isInteger(columns) || columns < 1) throw new RangeError("columns must be a positive integer");
    const keyboard = new InlineKeyboard();
    if (options.includeBreadcrumbs && this.parents.length) keyboard.text(this.parents.join(" / "), `${this.id}:breadcrumb`);
    const buttons = (await this.visibleItems(context)).map((item) => item.url
      ? { text: item.label, url: item.url }
      : { text: item.label, callback_data: item.callbackData ?? `${this.id}:${item.id}` });
    keyboard.grid(buttons, columns);
    return keyboard;
  }
}

export interface MenuControllerOptions<T> {
  id: string;
  items: readonly T[] | (() => readonly T[] | Promise<readonly T[]>);
  pageSize: number;
  label: (item: T, index: number) => string;
  callback?: (item: T, context: MenuContext) => void | Promise<void>;
  context?: MenuContext;
  labels?: { previous?: string; next?: string };
}

export type MenuControllerResult<T> =
  | { type: "page"; page: Page<T>; keyboard: InlineKeyboardMarkup }
  | { type: "select"; item: T; index: number }
  | { type: "noop" }
  | undefined;

export class MenuController<T> {
  private currentPage = 0;
  private readonly options: MenuControllerOptions<T>;
  constructor(options: MenuControllerOptions<T>) {
    if (!options.id || !options.id.trim()) throw new Error("MenuController id is required.");
    if (!Number.isInteger(options.pageSize) || options.pageSize < 1) throw new RangeError("pageSize must be a positive integer");
    this.options = options;
  }

  get page(): number { return this.currentPage; }

  private async allItems(): Promise<readonly T[]> { return typeof this.options.items === "function" ? await this.options.items() : this.options.items; }

  async render(context: MenuContext = this.options.context ?? {}): Promise<InlineKeyboardMarkup> {
    const items = await this.allItems();
    const page = paginate(items, this.currentPage, this.options.pageSize);
    this.currentPage = page.page;
    const keyboard = new InlineKeyboard();
    for (let index = 0; index < page.items.length; index += 1) {
      const absoluteIndex = page.page * this.options.pageSize + index;
      keyboard.text(this.options.label(page.items[index]!, absoluteIndex), `${this.options.id}:select:${absoluteIndex}`);
    }
    const navigation = paginationButtons(page, this.options.id, this.options.labels);
    if (navigation.length) keyboard.row(...navigation);
    void context;
    return keyboard.build();
  }

  async handle(data: string, context: MenuContext = this.options.context ?? {}): Promise<MenuControllerResult<T>> {
    const prefix = `${this.options.id}:`;
    if (!data.startsWith(prefix)) return undefined;
    const action = data.slice(prefix.length);
    if (action === "noop" || action === "breadcrumb") return { type: "noop" };
    if (action.startsWith("page:")) {
      const page = Number(action.slice("page:".length));
      if (!Number.isInteger(page) || page < 0) return undefined;
      this.currentPage = page;
      const items = await this.allItems();
      const pageData = paginate(items, this.currentPage, this.options.pageSize);
      this.currentPage = pageData.page;
      return { type: "page", page: pageData, keyboard: await this.render(context) };
    }
    if (action.startsWith("select:")) {
      const index = Number(action.slice("select:".length));
      const items = await this.allItems();
      const item = items[index];
      if (item === undefined || !Number.isInteger(index) || index < 0) return undefined;
      await this.options.callback?.(item, context);
      return { type: "select", item, index };
    }
    return undefined;
  }
}
