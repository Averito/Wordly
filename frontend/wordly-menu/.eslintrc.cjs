/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        "arrowParens": "avoid",
        "useTabs": true,
        "singleQuote": true,
        "tabWidth": 2,
        "jsxSingleQuote": true,
        "trailingComma": "none",
        "semi": false,
        "endOfLine": "auto",
        "bracketSpacing": true,
        "bracketSameLine": false,
        "proseWrap": "never"
      }
    ],
  }
}
