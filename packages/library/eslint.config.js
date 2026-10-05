import eslint from '@eslint/js';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import vue from 'eslint-plugin-vue';
import vueAccessibility from 'eslint-plugin-vuejs-accessibility';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const testFiles = ['src/**/*.spec.{ts,tsx}', 'src/**/*.test.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'];

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
    ignores: [...testFiles, '*.config.ts', 'vitest.setup.ts', 'scripts/**'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...testFiles, '*.config.ts', 'vitest.setup.ts', 'scripts/**'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 🚫 Nie zostawiaj nieużywanego kodu
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 🚫 any tylko świadomie
      '@typescript-eslint/no-explicit-any': 'error',

      // 🚫 puste funkcje i bloki
      '@typescript-eslint/no-empty-function': 'error',

      // 🚫 błędy promise (częsty bug)
      '@typescript-eslint/no-floating-promises': 'error',

      // 🚫 await w warunkach
      '@typescript-eslint/no-misused-promises': 'error',

      // 🚫 console.log w produkcji
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // 🔒 Jawna obsługa null / undefined
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableNumber: true,
          allowNullableString: true,
        },
      ],

      // 🔒 Bezpieczny dostęp do obiektów
      '@typescript-eslint/no-unnecessary-condition': 'error',

      // 🔒 Czytelność async/await
      '@typescript-eslint/return-await': 'error',

      // 🔒 Lepiej łapać błędy w await
      'no-throw-literal': 'error',

      // 🔒 Spójność typów
      '@typescript-eslint/consistent-type-imports': 'error',

      // 🔒 Czytelne typy
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      // ✨ prostszy kod
      'prefer-const': 'error',

      // ✨ jeden styl warunków
      eqeqeq: ['error', 'always'],

      // ✨ mniej zagnieżdżeń
      'no-nested-ternary': 'error',

      // ✨ spójne arrow functions
      'arrow-body-style': ['error', 'as-needed'],

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-control-regex': 'off',
    },
  },
  // Essential Vue rules catch invalid templates and prop mutations; Prettier owns layout.
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.eslint.json'],
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'vuejs-accessibility': vueAccessibility,
    },
    rules: {
      // The base rule cannot distinguish TypeScript-only event/slot signatures.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'vue/no-mutating-props': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'off',
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/anchor-has-content': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/heading-has-content': 'error',
      'vuejs-accessibility/iframe-has-title': 'error',
      'vuejs-accessibility/no-access-key': 'error',
      'vuejs-accessibility/no-distracting-elements': 'error',
      'vuejs-accessibility/role-has-required-aria-props': 'error',
      'vuejs-accessibility/label-has-for': [
        'error',
        { required: { some: ['nesting', 'id'] }, allowChildren: true },
      ],
      'vuejs-accessibility/click-events-have-key-events': 'error',
      'vuejs-accessibility/mouse-events-have-key-events': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either', depth: 3 }],
      // Empty table cells are structural; labels are required for actual controls.
      'jsx-a11y/control-has-associated-label': ['error', { ignoreElements: ['td', 'th'] }],
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: [...testFiles, '*.config.ts', 'vitest.setup.ts', 'scripts/**/*.ts'],
  })),
  {
    files: [
      ...testFiles,
      '*.config.ts',
      'vitest.setup.ts',
      'scripts/**/*.{js,mjs,ts}',
      '*.config.js',
    ],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: null },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  prettier,
  {
    ignores: [
      'husky/**',
      'dist/**',
      'coverage/**',
      'env.d.ts',
      'node_modules/**',
      'tsconfig.json',
      'src/assets/icons/runtime/catalog/buckets/**',
      'src/assets/icons/runtime/catalog/bucket-loaders.ts',
      'src/assets/icons/runtime/buckets/**',
      'src/assets/icons/runtime/bucket-loaders.ts',
      'src/web-components.ts',
    ],
  },
);
