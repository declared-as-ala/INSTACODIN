// eslint.config.mjs
// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import path from 'path';
import url from 'url';
import eslintParserTs from '@typescript-eslint/parser';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // ESLint recommended rules
  ...compat.extends('eslint:recommended'),

  // TypeScript recommended rules
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends(
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ),

  // Prettier recommended rules
  ...compat.extends('plugin:prettier/recommended'),

  {
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    ignores: ['eslint.config.mjs'],
    rules: {
      // Prettier line endings fix
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf', // force LF line endings
          singleQuote: true,
          semi: true,
        },
      ],
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
];
