import { randomBytes } from "node:crypto";
import type { ApiClient } from "../api/client.js";
import type { ChatId, CallbackQuery, Message, User } from "../api/types.js";
import type { Storage } from "../storage/storage.js";
import { InlineKeyboard } from "../keyboard/index.js";

export type ApprovalStatus = "pending" | "approved" | "denied";

export interface ApprovalRecord {
  key: string;
  botId: number;
  botUsername?: string;
  ownerUserId?: number;
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
  ownerChatId: ChatId;
  ownerUserId: number;
  ownerLabel?: string;
  requireApproval?: boolean;
  notificationCooldownMs?: number;
  store?: ApprovalStore;
}

export interface ApprovalIdentity {
  bot: User;
  configuredOwnerUserId?: number;
}

export interface ApprovalCheck {
  allowed: boolean;
  status: ApprovalStatus | "disabled";
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
  private readonly enabled: boolean;
  constructor(private readonly api: ApiClient, private readonly options: ApprovalOptions) {
    this.store = options.store ?? new MemoryApprovalStore();
    this.cooldownMs = options.notificationCooldownMs ?? 10 * 60_000;
    this.enabled = options.requireApproval ?? true;
  }

  async check(identity: ApprovalIdentity): Promise<ApprovalCheck> {
    if (!this.enabled) return { allowed: true, status: "disabled" };
    const key = this.key(identity.bot.id);
    const current = await this.store.get(key);
    if (current?.status === "approved") return { allowed: true, status: "approved", record: current };
    if (current?.status === "pending" && Date.now() - current.requestedAt < this.cooldownMs) return { allowed: false, status: "pending", record: current };
    const record: ApprovalRecord = {
      key,
      botId: identity.bot.id,
      ownerUserId: identity.configuredOwnerUserId ?? this.options.ownerUserId,
      status: "pending",
      nonce: randomBytes(8).toString("hex"),
      requestedAt: Date.now(),
    };
    if (identity.bot.username !== undefined) record.botUsername = identity.bot.username;
    const ownerLabel = this.options.ownerLabel ?? "Dev Gantenggg";
    const ownerIdLine = record.ownerUserId ? `Owner ID: ${record.ownerUserId}` : "Owner ID: tidak dikonfigurasi";
    const botLine = record.botUsername ? `Bot: @${record.botUsername} (ID: ${record.botId})` : `Bot ID: ${record.botId}`;
    const keyboard = new InlineKeyboard()
      .text("Izinkan", this.callbackData("approve", record))
      .text("Tidak Diizinkan", this.callbackData("deny", record))
      .build();
    const message = await this.api.methods.sendMessage({
      chat_id: this.options.ownerChatId,
      text: `Haloo ${ownerLabel}, ada yang memakai library telebibz nihh\n\n${botLine}\n${ownerIdLine}\nStatus: menunggu izin owner.`,
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
    if (callback.from.id !== this.options.ownerUserId) {
      await this.api.methods.answerCallbackQuery({ callback_query_id: callback.id, text: "Hanya owner yang dapat mengambil keputusan.", show_alert: true });
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

  async isAllowed(botId: number): Promise<boolean> { return (await this.store.get(this.key(botId)))?.status === "approved" || !this.enabled; }
  async revoke(botId: number): Promise<boolean> { return this.store.delete ? this.store.delete(this.key(botId)) : false; }
  private key(botId: number): string { return `telebibz:approval:${botId}`; }
  private callbackData(action: "approve" | "deny", record: ApprovalRecord): string { return `telebibz:approval:${action}:${record.botId}:${record.nonce}`; }
  private parseCallback(data: string): { action: "approve" | "deny"; botId: number; nonce: string } | undefined { const match = /^telebibz:approval:(approve|deny):(\d+):([a-f0-9]{16})$/.exec(data); if (!match) return undefined; return { action: match[1] as "approve" | "deny", botId: Number(match[2]), nonce: match[3]! }; }
  private async updateDecisionMessage(message: Message, record: ApprovalRecord, status: ApprovalStatus): Promise<void> { const statusText = status === "approved" ? "DIIZINKAN" : "TIDAK DIIZINKAN"; await this.api.methods.editMessageText({ chat_id: message.chat.id, message_id: message.message_id, text: `Permintaan pemakaian telebibz\nBot ID: ${record.botId}${record.botUsername ? `\nBot: @${record.botUsername}` : ""}\nStatus: ${statusText}\nDiputuskan oleh: ${record.decidedBy ?? "owner"}` }); }
}
