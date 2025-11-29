import jslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import tslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      jslint.configs.recommended,
      tslint.configs.recommended,
      tslint.configs.recommendedTypeChecked,
      tslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { tsPlugin },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { project: ["./tsconfig.app.json"] },
    },
    rules: {
      "no-fallthrough": ["error", { allowEmptyCase: true }],
      "default-case": "error",
    },
  },
]);
