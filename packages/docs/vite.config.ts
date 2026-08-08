import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'vitest/config';

import { peauiVueCustomElementPlugin } from '../library/vue-custom-element-plugin';

const librarySource = fileURLToPath(new URL('../library/src', import.meta.url));
const libraryPackage = JSON.parse(
  readFileSync(fileURLToPath(new URL('../library/package.json', import.meta.url)), 'utf8'),
) as { version: string };

export default defineConfig(({ command, mode }) => ({
  base: command === 'serve' && mode === 'development' ? '/' : '/peaui/',
  define: {
    __PEAUI_VERSION__: JSON.stringify(libraryPackage.version),
  },
  plugins: [peauiVueCustomElementPlugin(), react(), vue(), svgLoader()],
  resolve: {
    dedupe: ['react', 'react-dom', 'vue'],
    alias: {
      '@': librarySource,
      '@docs': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 4174,
  },
  preview: {
    port: 4174,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
    setupFiles: ['./src/test/setup.ts'],
  },
}));
