import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { createRequire } from 'node:module';
import { mergeConfig } from 'vite';

const libraryRoot = path.resolve(__dirname, '../../../library');
const librarySrc = path.join(libraryRoot, 'src');
const require = createRequire(import.meta.url);
const frameworkPath = path.dirname(require.resolve('@storybook/react-vite/package.json'));
const config: StorybookConfig = {
  framework: { name: frameworkPath as '@storybook/react-vite', options: {} },
  stories: ['../../../library/src/components/**/*.react.stories.@(js|ts|mdx|tsx)'],
  addons: ['@storybook/addon-essentials'],
  staticDirs: ['../public'],
  viteFinal: (config) => mergeConfig(config, {
    esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
    resolve: { alias: { '@': librarySrc } },
    css: { preprocessorOptions: { scss: { additionalData: '@use "@/assets/mixins.scss" as *;' } } },
    server: { fs: { allow: [libraryRoot, path.resolve(__dirname, '..')] } },
  }),
};
export default config;
