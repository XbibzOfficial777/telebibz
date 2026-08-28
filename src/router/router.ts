import { compose, type Middleware } from "../middleware/compose.js";

export interface RoutableContext {
  update: { [key: string]: unknown };
  message: { text?: string; caption?: string; chat?: { id: number | string }; [key: string]: unknown } | undefined;
  callbackQuery: { data?: string } | undefined;
  params: Record<string, string>;
  match?: RegExpMatchArray | undefined;
  args?: string[] | undefined;
  me?: { username?: string; id?: number; [key: string]: unknown } | undefined;
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
