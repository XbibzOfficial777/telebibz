import { compose, type Middleware } from "../middleware/compose.js";

export interface RoutableContext {
  update: { [key: string]: unknown };
  message: { text?: string; caption?: string; chat?: { id: number | string }; [key: string]: unknown } | undefined;
  callbackQuery: { data?: string } | undefined;
  params: Record<string, string>;
  match?: RegExpMatchArray | undefined;
  args?: string[] | undefined;
  me?: { username?: string; id?: number } | undefined;
}

type Matcher<Context> = (ctx: Context) => boolean | Promise<boolean>;
type Handler<Context> = Middleware<Context>;

export type RouterMatchMode = "first" | "all";

export interface RouterOptions {
  /** `first` prevents accidental double replies; `all` runs every matching route explicitly. */
  matchMode?: RouterMatchMode;
}

interface Route<Context> {
  priority: number;
  matcher: Matcher<Context>;
  middleware: Handler<Context>[];
  metadata?: Record<string, unknown>;
}

function testRegExp(expression: RegExp, value: string): boolean {
  expression.lastIndex = 0;
  return expression.test(value);
}

/** Update types accepted by `on()` filters, mirroring the Telegram `Update` object. */
export const UPDATE_FILTER_TYPES = [
  "message",
  "edited_message",
  "channel_post",
  "edited_channel_post",
  "business_connection",
  "business_message",
  "edited_business_message",
  "deleted_business_messages",
  "guest_message",
  "message_reaction",
  "message_reaction_count",
  "inline_query",
  "chosen_inline_result",
  "callback_query",
  "shipping_query",
  "pre_checkout_query",
  "purchased_paid_media",
  "poll",
  "poll_answer",
  "my_chat_member",
  "chat_member",
  "chat_join_request",
  "chat_boost",
  "removed_chat_boost",
] as const;

export type UpdateFilterType = typeof UPDATE_FILTER_TYPES[number];
/** Filter grammar: an update type such as `message`, optionally narrowed by a payload field: `message:text`. */
export type UpdateFilter = `${UpdateFilterType}` | `${UpdateFilterType}:${string}`;

const updateFilterTypes = new Set<string>(UPDATE_FILTER_TYPES);

function assertValidFilter(filter: string): void {
  const type = filter.split(":", 1)[0] ?? "";
  if (!updateFilterTypes.has(type)) throw new TypeError(`Unknown update type in filter "${filter}". Expected one of: ${UPDATE_FILTER_TYPES.join(", ")}.`);
}

function matchesFilter(ctx: RoutableContext, filter: string): boolean {
  const separator = filter.indexOf(":");
  const type = separator < 0 ? filter : filter.slice(0, separator);
  const field = separator < 0 ? undefined : filter.slice(separator + 1);
  const payload = ctx.update[type];
  if (payload === undefined || payload === null) return false;
  if (field === undefined || field === "") return true;
  return typeof payload === "object" && (payload as Record<string, unknown>)[field] !== undefined;
}

export class Router<Context extends RoutableContext> {
  private readonly middlewares: Handler<Context>[] = [];
  private readonly routes: Route<Context>[] = [];
  private sequence = 0;
  readonly matchMode: RouterMatchMode;

  constructor(options: RouterOptions = {}) {
    this.matchMode = options.matchMode ?? "first";
  }

  use(...middleware: Handler<Context>[]): this {
    if (middleware.length === 0) return this;
    this.middlewares.push(...middleware);
    return this;
  }

  route(matcher: Matcher<Context>, ...middleware: Handler<Context>[]): this {
    if (middleware.length === 0) throw new Error("A route requires at least one middleware handler.");
    this.routes.push({ priority: this.sequence++, matcher, middleware });
    return this;
  }

  command(name: string | RegExp, ...middleware: Handler<Context>[]): this {
    return this.route(async (ctx) => {
      const text = ctx.message?.text ?? ctx.message?.caption;
      if (!text?.startsWith("/")) return false;
      const parts = text.slice(1).split(/\s+/);
      const commandWithBot = parts[0] ?? "";
      const [command, botUsername] = commandWithBot.split("@");
      if (botUsername && ctx.me?.username && botUsername.toLowerCase() !== ctx.me.username.toLowerCase()) {
        return false;
      }
      const matched = typeof name === "string"
        ? command === name.replace(/^\//, "")
        : testRegExp(name, command ?? "");
      if (matched) {
        ctx.args = parts.slice(1);
      }
      return matched;
    }, ...middleware);
  }

  text(value: string, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const text = ctx.message?.text ?? ctx.message?.caption;
      return text === value;
    }, ...middleware);
  }

  regex(expression: RegExp, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const text = ctx.message?.text ?? ctx.message?.caption ?? "";
      const match = text.match(expression);
      if (match) {
        ctx.match = match;
        return true;
      }
      return false;
    }, ...middleware);
  }

  callback(pattern: string | RegExp, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const data = ctx.callbackQuery?.data ?? "";
      if (typeof pattern === "string") {
        if (pattern.endsWith("*")) {
          const prefix = pattern.slice(0, -1);
          if (data.startsWith(prefix)) {
            ctx.params = { ...ctx.params, wildcard: data.slice(prefix.length) };
            return true;
          }
          return false;
        }
        return data === pattern;
      }
      const match = data.match(pattern);
      if (match) {
        ctx.match = match;
        return true;
      }
      return false;
    }, ...middleware);
  }

  chat(chatId: number | string, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const id = ctx.message?.chat?.id;
      return id !== undefined && (id === chatId || String(id) === String(chatId));
    }, ...middleware);
  }

  /**
   * Registers handlers for update types, with optional payload narrowing:
   * `on("message")`, `on("message:photo")`, `on("callback_query:data")`,
   * or an array such as `["message:text", "callback_query:data"]`.
   */
  on(filter: UpdateFilter | UpdateFilter[], ...middleware: Handler<Context>[]): this {
    const filters = (Array.isArray(filter) ? filter : [filter]).map((value) => String(value));
    if (filters.length === 0) throw new Error("At least one update filter is required.");
    for (const value of filters) assertValidFilter(value);
    return this.route((ctx) => filters.some((value) => matchesFilter(ctx, value)), ...middleware);
  }

  predicate(matcher: Matcher<Context>, ...middleware: Handler<Context>[]): this {
    return this.route(matcher, ...middleware);
  }

  nest(child: Router<Context>): this {
    return this.route(() => true, async (ctx, next) => {
      await child.handle(ctx, next);
    });
  }

  async handle(ctx: Context, terminal?: () => Promise<void>): Promise<void> {
    const routeDispatcher: Handler<Context> = async (currentCtx, next) => {
      const ordered = [...this.routes].sort((left, right) => left.priority - right.priority);
      let matched = false;
      for (const route of ordered) {
        if (!(await route.matcher(currentCtx))) continue;
        matched = true;
        await compose(route.middleware)(currentCtx);
        if (this.matchMode === "first") break;
      }
      if (!matched) {
        if (terminal) await terminal();
        else await next();
      }
    };

    if (this.middlewares.length === 0) {
      await routeDispatcher(ctx, async () => {});
    } else {
      await compose([...this.middlewares, routeDispatcher])(ctx);
    }
  }
}
