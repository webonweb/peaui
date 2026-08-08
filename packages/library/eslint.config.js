import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
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
  {
    ignores: [
      'husky/**',
      'dist/**',
      'env.d.ts',
      'src/**/*.stories.tsx',
      'node_modules/**',
      'eslint.config.js',
      'vite.config.ts',
      'vitest.setup.ts',
      'tsconfig.json',
      'vitest.config.ts',
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
      'src/**/*.stories.ts',
      'scripts/**',
      'src/assets/icons/runtime/catalog/buckets/**',
      'src/assets/icons/runtime/catalog/bucket-loaders.ts',
      'src/assets/icons/runtime/buckets/**',
      'src/assets/icons/runtime/bucket-loaders.ts',
    ],
  },
);
