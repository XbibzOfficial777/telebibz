export const TELEBIBZ_BRAND_TEXT = "Library Bot Telegram By @xbibzofficial";

export interface BrandingBoxOptions { title?: string; footer?: string }

/**
 * Telegram does not support arbitrary font colors. Colored square markers and a
 * monospace Unicode box provide a portable colored/boxed treatment in clients.
 */
export function buildBrandingBox(options: BrandingBoxOptions = {}): string {
  const title = options.title ?? "TELEBIBZ";
  const footer = options.footer ?? TELEBIBZ_BRAND_TEXT;
  const safeFooter = escapeHtml(footer);
  const innerWidth = Math.max(32, [...safeFooter].length);
  const horizontal = "─".repeat(innerWidth + 2);
  return [
    `🟦 <b>${escapeHtml(title)}</b> 🟪`,
    `<pre>┌${horizontal}┐`,
    `│ ${padBox(safeFooter, innerWidth)} │`,
    `└${horizontal}┘</pre>`,
  ].join("\n");
}

export interface ApprovalBrandingDetails { ownerLabel: string; botLine: string; ownerIdLine: string }

export function buildApprovalNotification(details: ApprovalBrandingDetails): string {
  return [
    buildBrandingBox(),
    "",
    `Haloo ${escapeHtml(details.ownerLabel)}, ada yang memakai library telebibz nihh`,
    "",
    escapeHtml(details.botLine),
    escapeHtml(details.ownerIdLine),
    "Status: menunggu izin owner.",
  ].join("\n");
}

function padBox(value: string, width: number): string {
  const safe = [...value].slice(0, width).join("");
  return `${safe}${" ".repeat(Math.max(0, width - [...safe].length))}`;
}

function escapeHtml(value: string): string { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
