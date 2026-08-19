import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/types.test.ts", "node_modules/**", "dist/**", "dist-cjs/**"]
  }
});
