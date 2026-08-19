export interface Plugin<Context = unknown> {
  name: string;
  version?: string;
  install?: (api: PluginApi<Context>) => void | Promise<void>;
  setup?: (api: PluginApi<Context>) => void | Promise<void>;
  onStart?: (api: PluginApi<Context>) => void | Promise<void>;
  onUpdate?: (context: Context) => void | Promise<void>;
  onStop?: (api: PluginApi<Context>) => void | Promise<void>;
  dispose?: (api: PluginApi<Context>) => void | Promise<void>;
}

export interface PluginApi<Context> {
  bot: unknown;
  services: ServiceContainer;
  registerMiddleware: (middleware: unknown) => void;
  registerRoute: (route: unknown) => void;
}

export class ServiceContainer {
  private readonly values = new Map<string | symbol, unknown>();
  register<T>(name: string | symbol, value: T): this { this.values.set(name, value); return this; }
  get<T>(name: string | symbol): T { if (!this.values.has(name)) throw new Error(`Service not registered: ${String(name)}`); return this.values.get(name) as T; }
  has(name: string | symbol): boolean { return this.values.has(name); }
  delete(name: string | symbol): boolean { return this.values.delete(name); }
}

export class PluginManager<Context> {
  private readonly plugins: Plugin<Context>[] = [];
  private readonly api: PluginApi<Context>;
  constructor(bot: unknown) {
    this.api = { bot, services: new ServiceContainer(), registerMiddleware: () => undefined, registerRoute: () => undefined };
  }
  use(plugin: Plugin<Context>): this { if (this.plugins.some((existing) => existing.name === plugin.name)) throw new Error(`Plugin already registered: ${plugin.name}`); this.plugins.push(plugin); return this; }
  async setup(): Promise<void> { for (const plugin of this.plugins) { await plugin.install?.(this.api); await plugin.setup?.(this.api); } }
  async start(): Promise<void> { for (const plugin of this.plugins) await plugin.onStart?.(this.api); }
  async update(context: Context): Promise<void> { for (const plugin of this.plugins) await plugin.onUpdate?.(context); }
  async stop(): Promise<void> { for (const plugin of this.plugins) await plugin.onStop?.(this.api); }
  async dispose(): Promise<void> { for (const plugin of [...this.plugins].reverse()) await plugin.dispose?.(this.api); }
  list(): readonly Plugin<Context>[] { return this.plugins; }
}
