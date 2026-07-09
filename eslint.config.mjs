import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const tsRecommended = tsPlugin.configs.recommended.rules;
const tsRecommendedTypeChecked = tsPlugin.configs["recommended-type-checked"].rules;

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.astro/**", "**/*.d.ts"],
  },
  {
    files: ["packages/interactions/src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./packages/interactions/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsRecommended,
      ...tsRecommendedTypeChecked,
      "no-undef": "off",
      "no-restricted-globals": ["error", "event", "name"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
];
