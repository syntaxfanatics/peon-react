module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'jest', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module', // Allows for the use of imports
  },
  globals: {},
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-console': 'warn',
    'quotes': ['error', 'single',],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'no-trailing-spaces': ['error'],
  },
};
