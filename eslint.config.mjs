export default [
  {
    ignores: ["dist/**", "dist-cjs/**", "node_modules/**", "schema/**", "generated/**"]
  },
  {
    files: ["scripts/**/*.mjs", "bin/**/*.mjs"],
    languageOptions: { globals: { console: "readonly", URL: "readonly", process: "readonly", fetch: "readonly", Buffer: "readonly", Headers: "readonly", Request: "readonly", setTimeout: "readonly" } },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "args": "none" }],
      "no-unreachable": "error",
      "no-constant-condition": "error"
    }
  }
];
