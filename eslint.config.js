import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";

const reactFlatRecommended = react.configs.flat.recommended;
const reactFlatJsxRuntime = react.configs.flat["jsx-runtime"];

// react-hooks v7 introduced stricter rules — downgrade to warnings
// until the codebase is incrementally refactored to comply.
const reactHooksOverrides = {
  "react-hooks/set-state-in-effect": "warn",
  "react-hooks/immutability": "warn",
  "react-hooks/purity": "warn",
  "react-hooks/refs": "warn",
};

export default [
  // Global ignores
  {
    ignores: [
      "dist*/**",
      "functions/**",
      "scripts/**",
      "*.cjs",
      "src/scripts/**",
    ],
  },

  // Base config for all JS/JSX files
  {
    files: ["src/**/*.{js,jsx}"],
    ...js.configs.recommended,
    plugins: {
      ...reactFlatRecommended.plugins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactFlatRecommended.rules,
      ...reactFlatJsxRuntime.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "react/no-unescaped-entities": "warn",
      ...reactHooksOverrides,
    },
  },

  // TypeScript files
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      ...reactFlatRecommended.plugins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsparser,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactFlatRecommended.rules,
      ...reactFlatJsxRuntime.rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",
      "no-undef": "off", // TypeScript handles this via type checking
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      ...reactHooksOverrides,
    },
  },

  // Test files (node globals for setup, jest globals for tests)
  {
    files: [
      "src/**/*.test.*",
      "src/**/*.spec.*",
      "src/**/test/**",
      "src/**/tests/**",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
