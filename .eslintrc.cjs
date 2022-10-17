/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  overrides: [
    {
      files: [
        "**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress/support/**.{js,ts,jsx,tsx}"
      ],
      extends: ["plugin:cypress/recommended"]
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ['dist/'],
  rules: {
    "comma-dangle": 2
  }
};
