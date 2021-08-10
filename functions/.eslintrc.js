module.exports = {
  env: {
    es6: true,
    node: true
  },
  root: true,
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    quotes: 'warn',
    semi: 'warn',
    indent: 'warn',
    'spaced-comment': 'warn',
    'eol-last': 'warn',
    curly: 'warn',
    'no-void': 'warn'
  }
}
