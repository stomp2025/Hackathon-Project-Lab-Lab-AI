// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': ['warn', {
        skip: ['Text']
      }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true
      }],
      'no-console': ['warn', {
        allow: ['warn', 'error']
      }]
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    }
  }
]);
