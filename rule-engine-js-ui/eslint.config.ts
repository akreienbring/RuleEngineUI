import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig} from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["*", "!src/", "!eslint.config.*"] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    linterOptions: {
      reportUnusedInlineConfigs: "off",
    },
    settings: {
      react: { version: "19" },
      //react: { version: 'detect' },
      //'import/extensions': ['.js', '.jsx'],
      settings: {
        "import/resolver": {
          node: {
            extensions: [{ ".js": "never", ".jsx": "never" }],
          },
        },
      },
    },
  },
  eslintJs.configs.recommended,
  eslintTs.configs.recommended,
 );
