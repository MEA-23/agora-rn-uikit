module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/', 'docs/'],
  rules: {
    // Formatting is not enforced; the codebase mixes quote styles.
    'prettier/prettier': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
