import type { Transport, TransportRequest, TransportResponse } from "./api/transport.js";
import type { TelegramResponse, Update } from "./api/types.js";
import { Bot } from "./core/bot.js";
import { Context } from "./context/context.js";

export class MockTransport implements Transport {
  readonly calls: TransportRequest[] = [];
  /** Downloads recorded through `download()` (the `file_path` values, in order). */
  readonly downloads: string[] = [];
  /** Bytes returned by `download()`; defaults to the UTF-8 encoding of the file path. */
  downloadBytes: Uint8Array | undefined;
  private readonly responses = new Map<string, TelegramResponse<unknown> | ((payload: unknown) => TelegramResponse<unknown>)>();
  respond(method: string, response: TelegramResponse<unknown> | ((payload: unknown) => TelegramResponse<unknown>)): this { this.responses.set(method, response); return this; }
  async request<T>(request: TransportRequest): Promise<TransportResponse<T>> { this.calls.push(request); const configured = this.responses.get(request.method); const data = typeof configured === "function" ? configured(request.payload) : configured ?? { ok: true, result: true }; return { status: data.ok ? 200 : (data.error_code ?? 500), headers: new Headers(), data: data as TelegramResponse<T> }; }
  fileUrl(filePath: string): string { return `mock://files/${filePath}`; }
  async download(filePath: string): Promise<Uint8Array> { this.downloads.push(filePath); return this.downloadBytes ?? new TextEncoder().encode(filePath); }
}

export function createMockUpdate(overrides: Partial<Update> = {}): Update { return { update_id: 1, message: { message_id: 1, date: Date.now(), chat: { id: 1, type: "private" }, from: { id: 2, is_bot: false, first_name: "Test" }, text: "/start" }, ...overrides }; }
export function createMockCallbackUpdate(overrides: Partial<Update> = {}): Update {
  const base = createMockUpdate();
  delete base.message;
  return {
    ...base,
    update_id: 2,
    callback_query: {
      id: "callback-1",
      from: { id: 2, is_bot: false, first_name: "Test" },
      message: { message_id: 10, date: Date.now(), chat: { id: 1, type: "private" }, text: "Choose" },
      chat_instance: "chat-instance",
      data: "action",
    },
    ...overrides,
  };
}
export function createTestBot(): { bot: Bot; transport: MockTransport } {
  const transport = new MockTransport();
  transport.respond("getMe", { ok: true, result: { id: 99, is_bot: true, first_name: "TestBot", username: "test_bot" } });
  return { bot: new Bot({ token: "123456:TEST_TOKEN", transport }), transport };
}
export function createMockContext(bot: Bot, update: Update = createMockUpdate()): Context { return new Context({ update, api: bot.api, session: {}, services: {} }); }
