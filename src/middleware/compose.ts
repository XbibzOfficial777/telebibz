export type Next = () => Promise<void>;
export type Middleware<Context> = (ctx: Context, next: Next) => void | Promise<void>;

export function compose<Context>(middleware: readonly Middleware<Context>[]): (ctx: Context) => Promise<void> {
  return async function run(ctx: Context): Promise<void> {
    let index = -1;
    const dispatch = async (position: number): Promise<void> => {
      if (position <= index) throw new Error("next() called multiple times");
      index = position;
      const handler = middleware[position];
      if (!handler) return;
      await handler(ctx, () => dispatch(position + 1));
    };
    await dispatch(0);
  };
}

export function middleware<Context>(handler: Middleware<Context>): Middleware<Context> { return handler; }
