module.exports = {
  env: {
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-process-exit': 'off',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-var': 'error',
    'prefer-const': 'error'
  }
};
