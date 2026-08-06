import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

import { peauiVueCustomElementPlugin } from '../library/vue-custom-element-plugin';

const librarySource = fileURLToPath(new URL('../library/src', import.meta.url));

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/peaui/' : '/',
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
});
