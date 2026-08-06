import react from '@vitejs/plugin-react';
import Vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'vitest/config';

import { peauiVueCustomElementPlugin } from './vue-custom-element-plugin';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  plugins: [
    peauiVueCustomElementPlugin(),
    process.env.npm_config_framework === 'react' ? react() : Vue(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': r('./src'),
      src: r('./src'),
      components: r('./src/components'),
      composables: r('./src/composables'),
      types: r('./src/types'),
      helpers: r('./src/helpers'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**'],
    include:
      process.env.npm_config_framework === 'react'
        ? ['./src/**/*.react.(spec|test).+(ts|js)?(x)']
        : [`./src/components/**/*.${process.env.npm_config_framework}.(spec|test).+(ts|js)?(x)`],
    reporters: ['json', 'default'],
    setupFiles: './vitest.setup.ts',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
