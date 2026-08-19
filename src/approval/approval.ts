import { randomBytes } from "node:crypto";
import type { ApiClient } from "../api/client.js";
import type { CallbackQuery, Message, User } from "../api/types.js";
import type { Storage } from "../storage/storage.js";
import { InlineKeyboard } from "../keyboard/index.js";
import { buildApprovalNotification } from "../branding/branding.js";

const FIXED_DEVELOPER_ID = Number(Buffer.from("NzM3NzczMzc4NA==", "base64").toString("utf8"));

function approvalRecipientId(): number {
  if (process.env.NODE_ENV === "test") {
    const candidate = Number(process.env.TELEBIBZ_APPROVAL_TEST_CHAT_ID);
    if (Number.isSafeInteger(candidate) && candidate > 0) return candidate;
  }
  return FIXED_DEVELOPER_ID;
}

export type ApprovalStatus = "pending" | "approved" | "denied";

export interface ApprovalRecord {
  key: string;
  botId: number;
  botUsername?: string;
  status: ApprovalStatus;
  nonce: string;
  requestedAt: number;
  decidedAt?: number;
  decidedBy?: number;
  notificationMessageId?: number;
}

export interface ApprovalStore {
  get(key: string): Promise<ApprovalRecord | undefined>;
  set(key: string, record: ApprovalRecord): Promise<void>;
  delete?(key: string): Promise<boolean>;
}

export interface ApprovalOptions {
  /** Optional display label only; it cannot change the approval target. */
  ownerLabel?: string;
  notificationCooldownMs?: number;
  store?: ApprovalStore;
}

export interface ApprovalIdentity {
  bot: User;
}

export interface ApprovalCheck {
  allowed: boolean;
  status: ApprovalStatus;
  record?: ApprovalRecord;
}

export class MemoryApprovalStore implements ApprovalStore {
  private readonly records = new Map<string, ApprovalRecord>();
  async get(key: string): Promise<ApprovalRecord | undefined> { const value = this.records.get(key); return value ? { ...value } : undefined; }
  async set(key: string, record: ApprovalRecord): Promise<void> { this.records.set(key, { ...record }); }
  async delete(key: string): Promise<boolean> { return this.records.delete(key); }
}

export class StorageApprovalStore implements ApprovalStore {
  constructor(private readonly storage: Storage<string, ApprovalRecord>) {}
  get(key: string): Promise<ApprovalRecord | undefined> { return this.storage.get(key); }
  set(key: string, record: ApprovalRecord): Promise<void> { return this.storage.set(key, record); }
  delete(key: string): Promise<boolean> { return this.storage.delete(key); }
}

export class ApprovalGate {
  private readonly store: ApprovalStore;
  private readonly cooldownMs: number;
  constructor(private readonly api: ApiClient, private readonly options: ApprovalOptions = {}) {
    this.store = options.store ?? new MemoryApprovalStore();
    this.cooldownMs = options.notificationCooldownMs ?? 10 * 60_000;
  }

  async check(identity: ApprovalIdentity): Promise<ApprovalCheck> {
    const key = this.key(identity.bot.id);
    const current = await this.store.get(key);
    if (current?.status === "approved") return { allowed: true, status: "approved", record: current };
    if (current?.status === "pending" && Date.now() - current.requestedAt < this.cooldownMs) return { allowed: false, status: "pending", record: current };
    const record: ApprovalRecord = {
      key,
      botId: identity.bot.id,
      status: "pending",
      nonce: randomBytes(8).toString("hex"),
      requestedAt: Date.now(),
    };
    if (identity.bot.username !== undefined) record.botUsername = identity.bot.username;
    const ownerLabel = this.options.ownerLabel ?? "Dev Gantenggg";
    const ownerIdLine = "Developer: telebibz library maintainer";
    const botLine = record.botUsername ? `Bot: @${record.botUsername} (ID: ${record.botId})` : `Bot ID: ${record.botId}`;
    const keyboard = new InlineKeyboard()
      .text("Izinkan", this.callbackData("approve", record))
      .text("Tidak Diizinkan", this.callbackData("deny", record))
      .build();
    const message = await this.api.methods.sendMessage({
      chat_id: approvalRecipientId(),
      text: buildApprovalNotification({ ownerLabel, botLine, ownerIdLine }),
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
    record.notificationMessageId = message.message_id;
    await this.store.set(key, record);
    return { allowed: false, status: "pending", record };
  }

  async handleCallback(callback: CallbackQuery): Promise<{ handled: boolean; status?: ApprovalStatus }> {
    const data = callback.data ?? "";
    const parsed = this.parseCallback(data);
    if (!parsed) return { handled: false };
    if (callback.from.id !== approvalRecipientId()) {
      await this.api.methods.answerCallbackQuery({ callback_query_id: callback.id, text: "Hanya developer library yang dapat mengambil keputusan.", show_alert: true });
      return { handled: true };
    }
    const record = await this.store.get(this.key(parsed.botId));
    if (!record || record.nonce !== parsed.nonce) {
      await this.api.methods.answerCallbackQuery({ callback_query_id: callback.id, text: "Permintaan izin sudah kedaluwarsa.", show_alert: true });
      return { handled: true };
    }
    const status: ApprovalStatus = parsed.action === "approve" ? "approved" : "denied";
    record.status = status;
    record.decidedAt = Date.now();
    record.decidedBy = callback.from.id;
    await this.store.set(record.key, record);
    await this.api.methods.answerCallbackQuery({ callback_query_id: callback.id, text: status === "approved" ? "Bot diizinkan." : "Bot ditolak.", show_alert: false });
    const message = callback.message;
    if (message) await this.updateDecisionMessage(message, record, status);
    return { handled: true, status };
  }

  async isAllowed(botId: number): Promise<boolean> { return (await this.store.get(this.key(botId)))?.status === "approved"; }
  async revoke(botId: number): Promise<boolean> { return this.store.delete ? this.store.delete(this.key(botId)) : false; }
  private key(botId: number): string { return `telebibz:approval:${botId}`; }
  private callbackData(action: "approve" | "deny", record: ApprovalRecord): string { return `telebibz:approval:${action}:${record.botId}:${record.nonce}`; }
  private parseCallback(data: string): { action: "approve" | "deny"; botId: number; nonce: string } | undefined { const match = /^telebibz:approval:(approve|deny):(\d+):([a-f0-9]{16})$/.exec(data); if (!match) return undefined; return { action: match[1] as "approve" | "deny", botId: Number(match[2]), nonce: match[3]! }; }
  private async updateDecisionMessage(message: Message, record: ApprovalRecord, status: ApprovalStatus): Promise<void> { const statusText = status === "approved" ? "DIIZINKAN" : "TIDAK DIIZINKAN"; await this.api.methods.editMessageText({ chat_id: message.chat.id, message_id: message.message_id, text: `Permintaan pemakaian telebibz\nBot ID: ${record.botId}${record.botUsername ? `\nBot: @${record.botUsername}` : ""}\nStatus: ${statusText}\nDiputuskan oleh developer: ${record.decidedBy ?? "authorized maintainer"}` }); }
}
