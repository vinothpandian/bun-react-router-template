import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import noSecrets from "eslint-plugin-no-secrets";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["build/", ".react-router/"],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "no-secrets": noSecrets,
    },
    rules: {
      "no-secrets/no-secrets": "error",
      "react/react-in-jsx-scope": "off",
    },
  },
];
