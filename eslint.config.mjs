import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist/", "**/.gitignore"]
}, ...compat.extends("plugin:vue/vue3-essential", "eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser
        },

        ecmaVersion: "latest",
        sourceType: "module"
    },

    rules: {
        "comma-dangle": 2
    }
}, ...compat.extends("plugin:cypress/recommended").map(config => ({
    ...config,

    files: [
        "**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx,vue,cjs,mjs}",
        "cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx,vue,cjs,mjs}",
        "cypress/support/**.{js,ts,jsx,tsx,vue,cjs,mjs}"
    ]
}))];