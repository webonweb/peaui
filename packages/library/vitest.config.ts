import react from '@vitejs/plugin-react';
import Vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'vitest/config';

import { peauiVueCustomElementPlugin } from './vue-custom-element-plugin';

const r = (p: string) => resolve(__dirname, p);
const framework = process.env.PEAUI_FRAMEWORK ?? process.env.npm_config_framework ?? 'vue';
const wcBehaviorCoverage = framework === 'wc' && process.env.PEAUI_WC_BEHAVIOR_COVERAGE === '1';

export default defineConfig({
  plugins: [peauiVueCustomElementPlugin(), framework === 'react' ? react() : Vue(), svgLoader()],
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
    include: [
      './src/components/**/*.shared.spec.ts',
      ...(framework === 'react'
        ? ['./src/**/*.react.(spec|test).+(ts|js)?(x)']
        : [`./src/components/**/*.${framework}.(spec|test).+(ts|js)?(x)`]),
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: `./coverage/${wcBehaviorCoverage ? 'wc-behavior' : framework}`,
      reporter: ['text-summary', 'json-summary', 'html', 'lcov'],
      include: [
        ...(wcBehaviorCoverage
          ? ['./src/components/**/*.vue', './src/helpers/**/*.ts', './src/composables/**/*.ts']
          : []),
        './src/components/**/*.shared.ts',
        ...(framework === 'react'
          ? ['./src/react/**/*.tsx', './src/react/**/*.ts', './src/components/**/index.tsx']
          : framework === 'wc'
            ? ['./src/components/**/*.wc.ts', './src/helpers/vue-custom-element.helper.ts']
            : ['./src/components/**/*.vue', './src/helpers/**/*.ts', './src/composables/**/*.ts']),
      ],
      exclude: [
        './src/**/*.stories.*',
        './src/**/*.spec.*',
        './src/**/*.test.*',
        './src/react/generated-*.ts',
        './src/react/renderer-entries/**',
      ],
      // Gate both the native adapters and the behavior actually executed by Vue-backed WC.
      thresholds: wcBehaviorCoverage
        ? { branches: 55, functions: 69, lines: 69, statements: 68 }
        : framework === 'react'
          ? { branches: 67, functions: 72, lines: 79, statements: 75 }
          : framework === 'wc'
            ? { branches: 72, functions: 92, lines: 86, statements: 86 }
            : { branches: 72, functions: 84, lines: 81, statements: 80 },
    },
    reporters: ['default'],
    setupFiles: './vitest.setup.ts',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
