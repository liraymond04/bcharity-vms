module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'simple-import-sort',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-useless-fragment': 2,
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'error',
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/ban-ts-comment': 'off', // turn warn
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    '@next/next/no-img-element': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'jsx-a11y/role-supports-aria-props': 'off',
    'no-use-before-define': 'off'
  },
  ignorePatterns: ['/src/generated/types.ts']
}
