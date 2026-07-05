/*
  Neo-Brutal UI — ESLint Config (interactions package)
  TypeScript + recommended rules for ESM, zero-runtime JS.
*/

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2024: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    project: "./packages/interactions/tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent accidental global leakage in library code
    "no-restricted-globals": ["error", "event", "name"],
    // No console in production code (allow in test scripts)
    "no-console": ["warn", { allow: ["warn", "error"] }],
    // Consistent return types
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    // Ensure ESM imports have extensions
    "@typescript-eslint/consistent-type-imports": "error",
  },
  overrides: [
    {
      files: ["**/*.test.mjs", "scripts/**/*.mjs"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: ["dist", "node_modules", ".astro", "*.d.ts"],
};
