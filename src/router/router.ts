import { compose, type Middleware } from "../middleware/compose.js";

export interface RoutableContext {
  update: { [key: string]: unknown };
  message: { text?: string; chat?: { id: number | string }; [key: string]: unknown } | undefined;
  callbackQuery: { data?: string } | undefined;
  params: Record<string, string>;
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

export class Router<Context extends RoutableContext> {
  private readonly routes: Route<Context>[] = [];
  private sequence = 0;
  readonly matchMode: RouterMatchMode;

  constructor(options: RouterOptions = {}) {
    this.matchMode = options.matchMode ?? "first";
  }

  use(...middleware: Handler<Context>[]): this {
    if (middleware.length === 0) return this;
    this.routes.push({ priority: -1_000_000 + this.sequence++, matcher: () => true, middleware });
    return this;
  }

  route(matcher: Matcher<Context>, ...middleware: Handler<Context>[]): this {
    if (middleware.length === 0) throw new Error("A route requires at least one middleware handler.");
    this.routes.push({ priority: this.sequence++, matcher, middleware });
    return this;
  }

  command(name: string | RegExp, ...middleware: Handler<Context>[]): this {
    return this.route(async (ctx) => {
      const text = ctx.message?.text;
      if (!text?.startsWith("/")) return false;
      const command = text.slice(1).split(/[\s@]/, 1)[0] ?? "";
      return typeof name === "string"
        ? command === name.replace(/^\//, "")
        : testRegExp(name, command);
    }, ...middleware);
  }

  text(value: string, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => ctx.message?.text === value, ...middleware);
  }

  regex(expression: RegExp, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => testRegExp(expression, ctx.message?.text ?? ""), ...middleware);
  }

  callback(pattern: string | RegExp, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const data = ctx.callbackQuery?.data ?? "";
      return typeof pattern === "string"
        ? pattern.endsWith("*")
          ? data.startsWith(pattern.slice(0, -1))
          : data === pattern
        : testRegExp(pattern, data);
    }, ...middleware);
  }

  chat(chatId: number | string, ...middleware: Handler<Context>[]): this {
    return this.route((ctx) => {
      const id = ctx.message?.chat?.id;
      return id !== undefined && (id === chatId || String(id) === String(chatId));
    }, ...middleware);
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
    const ordered = [...this.routes].sort((left, right) => left.priority - right.priority);
    let matched = false;
    for (const route of ordered) {
      if (!(await route.matcher(ctx))) continue;
      matched = true;
      await compose(route.middleware)(ctx);
      if (this.matchMode === "first") break;
    }
    if (!matched) await terminal?.();
  }
}
