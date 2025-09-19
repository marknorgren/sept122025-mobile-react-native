// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    ignores: ['dist/**', 'build/**', 'artifacts/**', 'eslint.config.js'],
  },
  ...expoConfig,
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    rules: {
      'expo/no-dynamic-env-var': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
  prettierConfig,
]);
