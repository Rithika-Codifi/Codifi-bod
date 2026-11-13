import js from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sameFeature = { captured: { feature: '{{ from.element.captured.feature }}' } };

export default defineConfig([
  globalIgnores([
    'dist',
    'dev-dist',
    'coverage',
    'docs',
    'visual-diffs',
    'test-results',
    'playwright-report',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      tanstackQuery.configs['flat/recommended'],
    ],
    languageOptions: { globals: globals.browser },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
          noWarnOnMultipleProjects: true,
        },
      },
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-default-export': 'off',
      'import-x/no-unresolved': ['error', { ignore: ['^virtual:'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Architecture boundaries: presentation → domain ← data; features talk via index.ts only.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*'],
      'import/resolver': { typescript: { project: ['./tsconfig.app.json'] } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        { type: 'core', pattern: 'src/core', partialMatch: false },
        { type: 'shared', pattern: 'src/shared', partialMatch: false },
        { type: 'mocks', pattern: 'src/mocks', partialMatch: false },
        { type: 'styles', pattern: 'src/styles', partialMatch: false },
        { type: 'test', pattern: 'src/test', partialMatch: false },
        { type: 'entry', pattern: 'src/*.{ts,tsx}', mode: 'file' },
        {
          type: 'feature-public',
          pattern: 'src/features/*/index.ts',
          mode: 'file',
          capture: ['feature'],
        },
        {
          type: 'feature-domain',
          pattern: 'src/features/*/domain',
          partialMatch: false,
          capture: ['feature'],
        },
        { type: 'feature-data', pattern: 'src/features/*/data', partialMatch: false, capture: ['feature'] },
        {
          type: 'feature-presentation',
          pattern: 'src/features/*/presentation',
          partialMatch: false,
          capture: ['feature'],
        },
      ],
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'entry' } },
              allow: { to: { element: { types: ['app', 'styles', 'core'] } } },
            },
            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    types: [
                      'app',
                      'core',
                      'shared',
                      'styles',
                      'mocks',
                      'feature-public',
                      'feature-domain',
                      'feature-data',
                    ],
                  },
                },
              },
            },
            { from: { element: { type: 'core' } }, allow: { to: { element: { type: 'core' } } } },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { types: ['shared', 'core'] } } },
            },
            {
              from: { element: { type: 'mocks' } },
              allow: { to: { element: { types: ['mocks', 'core', 'feature-data', 'feature-domain'] } } },
            },
            {
              from: { element: { type: 'test' } },
              allow: { to: { element: { types: ['test', 'core', 'shared', 'app', 'mocks'] } } },
            },
            {
              from: { element: { type: 'feature-public' } },
              allow: {
                to: { element: { types: ['feature-domain', 'feature-presentation'], ...sameFeature } },
              },
            },
            {
              from: { element: { type: 'feature-domain' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'feature-domain', ...sameFeature } } },
              ],
            },
            {
              from: { element: { type: 'feature-data' } },
              allow: [
                { to: { element: { types: ['core', 'mocks'] } } },
                { to: { element: { types: ['feature-domain', 'feature-data'], ...sameFeature } } },
              ],
            },
            {
              from: { element: { type: 'feature-presentation' } },
              allow: [
                { to: { element: { types: ['core', 'shared', 'feature-public'] } } },
                { to: { element: { type: 'app' } } },
                { to: { element: { types: ['feature-domain', 'feature-presentation'], ...sameFeature } } },
              ],
            },
          ],
        },
      ],
    },
  },

  // Domain is pure TypeScript: no React, no axios, no data/presentation.
  {
    files: ['src/features/*/domain/**/*.ts', 'src/core/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'axios', '@tanstack/*', 'zustand', 'lucide-react'],
              message: 'Domain must stay framework-agnostic.',
            },
          ],
        },
      ],
    },
  },
  // Views render state only: no fetching, no data hooks.
  {
    files: [
      'src/features/*/presentation/views/**/*.tsx',
      'src/features/*/presentation/components/**/*.tsx',
      'src/shared/ui/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios', '@tanstack/*', '@/app/di/*'],
              message: 'Views/components get data from ViewModels via props.',
            },
          ],
        },
      ],
    },
  },
  // Tests may build fixtures from any layer of their own feature (and mocks).
  { files: ['src/**/*.test.{ts,tsx}'], rules: { 'boundaries/dependencies': 'off' } },
  { files: ['src/test/**/*.{ts,tsx}'], rules: { 'react-refresh/only-export-components': 'off' } },
  { files: ['src/app/routes.tsx'], rules: { 'react-refresh/only-export-components': 'off' } },
  // Config/test files outside src
  {
    files: ['*.config.ts', 'tests/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'import-x/no-default-export': 'off' },
  },
  prettier,
]);
