import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactCompiler from "eslint-plugin-react-compiler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
      "react-compiler/react-compiler": "error",
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      ...tseslint.configs.strict.rules,
      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-unused-vars": [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  eslintConfigPrettier,

  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "next-env.d.ts",
      "coverage/",
      "src/test-utils/test-utils.tsx",
    ],
  },
];

export default eslintConfig;
