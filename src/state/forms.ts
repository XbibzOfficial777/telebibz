export interface ValidationIssue { path: string; message: string; code?: string }
export interface Field<T> { name: string; parse: (input: unknown) => T; validate?: (value: T) => string | undefined | Promise<string | undefined>; transform?: (value: T) => T | Promise<T>; required?: boolean }
export class Form<T extends Record<string, unknown>> {
  private readonly fields = new Map<keyof T & string, Field<unknown>>();
  field<K extends keyof T & string>(definition: Field<T[K]> & { name: K }): this { this.fields.set(definition.name, definition as Field<unknown>); return this; }
  async parse(input: Record<string, unknown>): Promise<{ success: true; data: T } | { success: false; issues: ValidationIssue[] }> {
    const issues: ValidationIssue[] = [];
    const values: Partial<T> = {};
    for (const [name, field] of this.fields) {
      const raw = input[name];
      if ((raw === undefined || raw === null || raw === "") && field.required) {
        issues.push({ path: name, message: "Field is required", code: "required" });
        continue;
      }
      if (raw === undefined || raw === null || raw === "") continue;
      try {
        let value = field.parse(raw);
        if (field.transform) value = await field.transform(value);
        const error = await field.validate?.(value);
        if (error) issues.push({ path: name, message: error, code: "invalid" });
        else values[name as keyof T] = value as T[keyof T];
      } catch (error) {
        issues.push({ path: name, message: error instanceof Error ? error.message : "Invalid value", code: "parse" });
      }
    }
    return issues.length ? { success: false, issues } : { success: true, data: values as T };
  }
  reset(): void {}
}
export const validators = { string: (value: unknown): string => { if (typeof value !== "string") throw new TypeError("Expected string"); return value; }, number: (value: unknown): number => { const number = typeof value === "number" ? value : Number(value); if (!Number.isFinite(number)) throw new TypeError("Expected number"); return number; }, integer: (value: unknown): number => { const number = validators.number(value); if (!Number.isInteger(number)) throw new TypeError("Expected integer"); return number; }, email: (value: unknown): string => { const email = validators.string(value); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new TypeError("Expected email"); return email; }, url: (value: unknown): string => { const url = validators.string(value); try { new URL(url); return url; } catch { throw new TypeError("Expected URL"); } } };
