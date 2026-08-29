import { describe, expect, it } from "vitest";
import { assertValidUpload, UploadValidationError, validateUpload } from "../src/utils/files.js";

describe("upload validation", () => {
  it("accepts an upload that satisfies every rule", () => {
    const issues = validateUpload(
      { sizeBytes: 1024, mimeType: "image/png", fileName: "logo.PNG" },
      { maxBytes: 2048, allowedMimeTypes: ["image/png", "image/jpeg"], allowedExtensions: [".png", ".jpg"] },
    );
    expect(issues).toEqual([]);
  });

  it("reports oversized uploads with the limit", () => {
    const issues = validateUpload({ sizeBytes: 5000 }, { maxBytes: 2048 });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ code: "too_large", field: "sizeBytes", actual: 5000, limit: 2048 });
  });

  it("skips size validation when sizeBytes is unknown", () => {
    expect(validateUpload({}, { maxBytes: 1 })).toEqual([]);
  });

  it("matches MIME wildcards case-insensitively", () => {
    expect(validateUpload({ mimeType: "IMAGE/PNG" }, { allowedMimeTypes: ["image/*"] })).toEqual([]);
    expect(validateUpload({ mimeType: "application/pdf" }, { allowedMimeTypes: ["image/*"] })[0]).toMatchObject({ code: "mime_not_allowed" });
  });

  it("matches extensions case-insensitively with or without the leading dot", () => {
    expect(validateUpload({ fileName: "Report.PDF" }, { allowedExtensions: ["pdf", ".TXT", ".docx"] })).toEqual([]);
    expect(validateUpload({ fileName: "virus.exe" }, { allowedExtensions: ["pdf"] })[0]).toMatchObject({ code: "extension_not_allowed" });
  });

  it("rejects file names without any extension when extensions are required", () => {
    expect(validateUpload({ fileName: "README" }, { allowedExtensions: ["pdf"] })[0]).toMatchObject({ code: "extension_not_allowed" });
  });

  it("collects every violation at once", () => {
    const issues = validateUpload({ sizeBytes: 99, mimeType: "application/zip", fileName: "a.zip" }, { maxBytes: 10, allowedMimeTypes: ["image/png"], allowedExtensions: [".png"] });
    expect(issues.map((issue) => issue.code)).toEqual(["too_large", "mime_not_allowed", "extension_not_allowed"]);
  });

  it("assertValidUpload throws with all issues attached", () => {
    try {
      assertValidUpload({ sizeBytes: 100, mimeType: "text/html" }, { maxBytes: 10, allowedMimeTypes: ["image/png"] });
      expect.unreachable("assertValidUpload should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(UploadValidationError);
      const validation = error as UploadValidationError;
      expect(validation.name).toBe("UploadValidationError");
      expect(validation.issues.map((issue) => issue.code)).toEqual(["too_large", "mime_not_allowed"]);
      expect(validation.message).toContain("Upload rejected");
    }
  });

  it("assertValidUpload passes silently for valid uploads", () => {
    expect(() => assertValidUpload({ sizeBytes: 1, mimeType: "image/png", fileName: "a.png" }, { maxBytes: 2, allowedMimeTypes: ["image/png"], allowedExtensions: [".png"] })).not.toThrow();
  });
});
