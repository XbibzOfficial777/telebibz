import { TelegramError } from "../api/errors.js";
import type { ChatId } from "../api/types.js";
import { mapWithConcurrency } from "../utils/concurrency.js";

/** One chat the broadcast could not deliver to. */
export interface BroadcastFailure {
  chatId: ChatId;
  attempts: number;
  error: string;
  errorKind?: string | undefined;
}

/** Live counters emitted through `onProgress` after each chat settles. */
export interface BroadcastProgress {
  total: number;
  processed: number;
  delivered: number;
  failed: number;
}

/** Final result of a broadcast run. */
export interface BroadcastReport {
  total: number;
  delivered: number;
  failed: number;
  durationMs: number;
  failures: BroadcastFailure[];
}

export interface BroadcastOptions {
  /**
   * How many chats are messaged at the same time. Default `Infinity` — every
   * chat is attempted immediately, with no proactive cooldown. Telegram's own
   * 429 answers are honored automatically per chat.
   */
  concurrency?: number;
  /**
   * Attempts per chat when Telegram answers 429 (rate limit). The wait between
   * attempts is exactly what Telegram orders via `retry_after`. Default `10`.
   */
  maxAttempts?: number;
  /** Called after each chat settles, regardless of outcome. */
  onProgress?: (progress: BroadcastProgress) => void;
  /** Aborts pending sends; chats already delivered stay delivered. */
  signal?: AbortSignal;
}

function sleep(delayMs: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, delayMs)); }

function describeError(error: unknown): { message: string; kind: string | undefined } {
  if (error instanceof TelegramError) return { message: error.message, kind: error.kind };
  return { message: error instanceof Error ? error.message : String(error), kind: undefined };
}

/**
 * Sends to many chats in parallel with automatic 429 retry.
 *
 * There is no proactive cooldown: all chats (up to `concurrency`) are attempted
 * at once. The only waiting ever done is the `retry_after` delay Telegram itself
 * returns with a 429 answer, so bursts of 1000+ chats still deliver completely
 * instead of failing.
 */
export async function runBroadcast(
  chatIds: readonly ChatId[],
  send: (chatId: ChatId) => Promise<unknown>,
  options: BroadcastOptions = {},
): Promise<BroadcastReport> {
  const startedAt = Date.now();
  const maxAttempts = options.maxAttempts ?? 10;
  const failures: BroadcastFailure[] = [];
  let delivered = 0;
  let processed = 0;
  const total = chatIds.length;

  await mapWithConcurrency(chatIds, options.concurrency ?? Infinity, async (chatId) => {
    let attempts = 0;
    while (true) {
      if (options.signal?.aborted) {
        failures.push({ chatId, attempts, error: "aborted", errorKind: "aborted" });
        break;
      }
      attempts += 1;
      try {
        await send(chatId);
        delivered += 1;
        break;
      } catch (error) {
        const telegram = error instanceof TelegramError ? error : undefined;
        if (telegram?.kind === "rate-limit" && attempts < maxAttempts) {
          // Telegram told us exactly how long to wait; honor it (plus a small
          // jitter so retried chats do not fire as one synchronized wave).
          const retryAfterMs = Math.max(0, (telegram.retryAfter ?? 1) * 1000);
          await sleep(retryAfterMs + Math.random() * 250);
          continue;
        }
        const { message, kind } = describeError(error);
        failures.push({ chatId, attempts, error: message, errorKind: kind });
        break;
      }
    }
    processed += 1;
    options.onProgress?.({ total, processed, delivered, failed: failures.length });
  });

  return { total, delivered, failed: failures.length, durationMs: Date.now() - startedAt, failures };
}
