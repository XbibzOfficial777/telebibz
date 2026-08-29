/**
 * File-upload validation helpers. Telegram caps uploads at 50 MB for most
 * methods (10 MB for photos) and rejects mismatches between content and
 * declared type; these helpers let applications enforce their own limits
 * before a byte leaves the process.
 */

/** Constraints applied to an upload before it is sent. */
export interface UploadRules {
  /** Maximum size in bytes. */
  maxBytes?: number;
  /** Allowed MIME types; supports wildcards like `image/*`. */
  allowedMimeTypes?: readonly string[];
  /** Allowed file extensions, with or without the leading dot, case-insensitive. */
  allowedExtensions?: readonly string[];
}

/** What is known about an upload before it is sent. */
export interface UploadLike {
  sizeBytes?: number;
  mimeType?: string;
  fileName?: string;
}

export type UploadValidationCode = "too_large" | "mime_not_allowed" | "extension_not_allowed";

export interface UploadValidationIssue {
  code: UploadValidationCode;
  field: "sizeBytes" | "mimeType" | "fileName";
  message: string;
  /** The offending value, when known. */
  actual?: string | number;
  /** The limit that was violated, when applicable. */
  limit?: string | number;
}

/** Thrown by {@link assertValidUpload} when an upload violates the rules. */
export class UploadValidationError extends Error {
  override readonly name: string = "UploadValidationError";
  readonly issues: readonly UploadValidationIssue[];
  constructor(issues: readonly UploadValidationIssue[]) {
    super(`Upload rejected: ${issues.map((issue) => issue.message).join("; ")}`);
    this.issues = issues;
  }
}

function normalizeExtension(extension: string): string {
  const value = extension.trim().toLowerCase();
  return value.startsWith(".") ? value.slice(1) : value;
}

function mimeMatches(pattern: string, mimeType: string): boolean {
  const normalizedPattern = pattern.trim().toLowerCase();
  if (normalizedPattern.endsWith("/*")) return mimeType.toLowerCase().startsWith(normalizedPattern.slice(0, -1));
  return mimeType.toLowerCase() === normalizedPattern;
}

/**
 * Validates an upload against the rules and returns every violation found
 * (an empty array means the upload is acceptable).
 */
export function validateUpload(upload: UploadLike, rules: UploadRules): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = [];
  if (rules.maxBytes !== undefined && upload.sizeBytes !== undefined && upload.sizeBytes > rules.maxBytes) {
    issues.push({ code: "too_large", field: "sizeBytes", message: `size ${upload.sizeBytes} bytes exceeds the ${rules.maxBytes} byte limit`, actual: upload.sizeBytes, limit: rules.maxBytes });
  }
  if (rules.allowedMimeTypes !== undefined && rules.allowedMimeTypes.length > 0 && upload.mimeType !== undefined && !rules.allowedMimeTypes.some((pattern) => mimeMatches(pattern, upload.mimeType!))) {
    issues.push({ code: "mime_not_allowed", field: "mimeType", message: `MIME type ${upload.mimeType} is not allowed (allowed: ${rules.allowedMimeTypes.join(", ")})`, actual: upload.mimeType, limit: rules.allowedMimeTypes.join(", ") });
  }
  if (rules.allowedExtensions !== undefined && rules.allowedExtensions.length > 0 && upload.fileName !== undefined) {
    const extension = upload.fileName.includes(".") ? upload.fileName.slice(upload.fileName.lastIndexOf(".") + 1) : "";
    const normalized = normalizeExtension(extension);
    if (!normalized || !rules.allowedExtensions.some((allowed) => normalizeExtension(allowed) === normalized)) {
      issues.push({ code: "extension_not_allowed", field: "fileName", message: `extension .${normalized || "?"} is not allowed (allowed: ${rules.allowedExtensions.join(", ")})`, actual: upload.fileName, limit: rules.allowedExtensions.join(", ") });
    }
  }
  return issues;
}

/** Like {@link validateUpload} but throws {@link UploadValidationError} when any rule is violated. */
export function assertValidUpload(upload: UploadLike, rules: UploadRules): void {
  const issues = validateUpload(upload, rules);
  if (issues.length > 0) throw new UploadValidationError(issues);
}
