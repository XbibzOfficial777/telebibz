import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Webhook reply support (Telegraf-style): while handling a webhook update, the
 * first outgoing API call can be answered through the webhook HTTP response
 * itself instead of a separate request to api.telegram.org — Telegram executes
 * the method for you. Only one call can ride the response; every other call
 * goes through the transport as usual.
 *
 * The sink is carried in an AsyncLocalStorage, so concurrent updates (parallel
 * across chats) each keep their own responder.
 */

export type WebhookReplyPayload = Record<string, unknown>;
export type WebhookReplySink = (payload: WebhookReplyPayload) => void;

interface ReplyState {
  sink: WebhookReplySink;
  claimed: boolean;
  suppressed: boolean;
}

const storage = new AsyncLocalStorage<ReplyState>();

/** Runs `fn` with a webhook reply sink active for every API call inside it. */
export function runWithWebhookReply<T>(sink: WebhookReplySink, fn: () => Promise<T>): Promise<T> {
  return storage.run({ sink, claimed: false, suppressed: false }, fn);
}

/**
 * Runs `fn` with webhook replies suppressed (library-internal calls such as
 * the lazy `getMe` initialization must never claim the response slot).
 */
export function runWithoutWebhookReply<T>(fn: () => Promise<T>): Promise<T> {
  const state = storage.getStore();
  if (!state) return fn();
  return storage.run({ ...state, suppressed: true }, fn);
}

/**
 * Claims the webhook reply for `method`/`payload` if a sink is active and not
 * yet used. Returns the synthesized transport response the caller should
 * resolve with, or `undefined` when the call must go through the transport.
 */
export function claimWebhookReply(method: string, payload: Record<string, unknown> | undefined): { status: number; data: { ok: true; result: true } } | undefined {
  const state = storage.getStore();
  if (!state || state.claimed || state.suppressed) return undefined;
  state.claimed = true;
  state.sink({ method, ...(payload ?? {}) });
  // Telegram never sends the method result back to the webhook response, so
  // the caller resolves with a synthetic success (same as Telegraf).
  return { status: 200, data: { ok: true, result: true } };
}

/** True while an unclaimed webhook reply is available (diagnostics/testing). */
export function hasWebhookReply(): boolean {
  const state = storage.getStore();
  return state !== undefined && !state.claimed;
}
