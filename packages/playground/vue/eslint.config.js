import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended.map((config) =>
    config.files ? { ...config, files: [...config.files, '**/*.vue'] } : config,
  ),
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/block-lang': ['error', { script: { lang: ['ts'], allowNoLang: false } }],
    },
  },
  skipFormatting,
);
