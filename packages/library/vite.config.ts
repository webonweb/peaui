import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import GlobPlugin from 'vite-plugin-glob';
import svgLoader from 'vite-svg-loader';

import { peauiVueCustomElementPlugin } from './vue-custom-element-plugin';

const projectRootDir = resolve(__dirname);
type ComponentsMap = Record<string, string>;

/**
 * Recursively scans the given components directory and collects framework-specific
 * component entry files (`index.vue` for Vue and `index.tsx` for React).
 *
 * Each component directory may contain one or both framework implementations.
 * For every detected implementation, an entry is added to the result map
 * using the following key format:
 *
 * - `vue/<relative-path>`   → path to `index.vue`
 * - `react/<relative-path>` → path to `index.tsx`
 *
 * Example output:
 * ```ts
 * {
 *   "vue/basic/Test": "src/components/basic/Test/index.vue",
 *   "react/basic/Test": "src/components/basic/Test/index.tsx"
 * }
 * ```
 *
 * @param {string} [componentsDir="src/components"]
 * Root directory that will be scanned recursively for component folders.
 *
 * @returns {ComponentsMap}
 * An object where keys represent framework-prefixed component paths
 * and values are normalized file paths to the corresponding entry files.
 */
export function collectComponents(componentsDir = 'src/components'): ComponentsMap {
  const result: ComponentsMap = {};

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const hasVue = entries.some((e) => e.isFile() && e.name === 'index.vue');
    const hasReact = entries.some((e) => e.isFile() && e.name === 'index.tsx');
    const hasWc = entries.some((e) => e.isFile() && e.name === 'index.wc.ts');

    if (hasVue || hasReact || hasWc) {
      const relativeDir = path.relative(componentsDir, dir).replace(/\\/g, '/');

      if (hasVue) {
        result[`vue/${relativeDir}`] = path.join(dir, 'index.vue').replace(/\\/g, '/');
      }

      if (hasReact) {
        result[`react/${relativeDir}`] = path.join(dir, 'index.tsx').replace(/\\/g, '/');
      }

      if (hasWc) {
        result[`wc/${relativeDir}`] = path.join(dir, 'index.wc.ts').replace(/\\/g, '/');
      }
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      }
    }
  }

  walk(componentsDir);

  return result;
}

function collectLibraryEntries(): ComponentsMap {
  return {
    index: 'src/index.ts',
    ...collectComponents(),
    styles: 'src/styles.ts',
  };
}

/**
 * Vite configuration for a multi-framework component library (Vue + React).
 *
 * This setup builds a library where each component can have a Vue (`index.vue`)
 * and/or React (`index.tsx`) implementation. Entry points are dynamically
 * generated using `collectComponents()`.
 *
 * Key features:
 * - Supports both Vue and React in a single repository
 * - Generates framework-specific component bundles
 * - Preserves module structure for tree-shaking
 * - Publishes component CSS through a single explicit style bundle
 * - Provides type definitions via `vite-plugin-dts`
 *
 * Build output structure:
 * ```
 * dist/
 *   components/
 *     vue/<category>/<name>/
 *     react/<category>/<name>/
 * ```
 * @returns {import("vite").UserConfig}
 * Vite configuration object.
 */
export default defineConfig(() => {
  return {
    plugins: [
      peauiVueCustomElementPlugin(),
      vue(),
      svgLoader(),
      react(),
      dts({
        compilerOptions: {
          noCheck: true,
        },
        insertTypesEntry: true,
        tsconfigPath: resolve(projectRootDir, 'tsconfig.build.json'),
        exclude: ['**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
      }),
      GlobPlugin({
        restoreQueryExtension: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(projectRootDir, 'src'),
        '@/types': resolve(projectRootDir, 'src/types/*'),
        '@/helpers': resolve(projectRootDir, 'src/helpers/*'),
        '@/assets': resolve(projectRootDir, 'src/assets/*'),
        '@/composables': resolve(projectRootDir, 'src/composables/*'),
        '@/components': resolve(projectRootDir, 'src/components/*'),
        '@/constants': resolve(projectRootDir, 'src/constants.ts'),
        '@/directives': resolve(projectRootDir, 'src/directives/*'),
      },
    },
    build: {
      lib: {
        name: '@peaui/ui',
        entry: collectLibraryEntries(),
        cssFileName: 'styles',
        fileName: (format, name) => {
          if (name === 'styles') {
            return `styles.${format === 'es' ? 'js' : 'umd.cjs'}`;
          }

          if (name === 'index') {
            return `index.${format === 'es' ? 'js' : 'umd.cjs'}`;
          }

          const normalizedName = name.replace(/\\/g, '/').replace(/^src\//, '');
          return `components/${normalizedName}.${format === 'es' ? 'js' : 'umd.cjs'}`;
        },
      },
      rollupOptions: {
        external: [/^vue(?:\/|$)/, /^react(?:\/|$)/, /^react-dom(?:\/|$)/],
        output: {
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: 'src',
          globals: { vue: 'Vue', react: 'React', 'react-dom': 'ReactDOM' },
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name?.endsWith('.css')) {
              return 'assets/[name][extname]';
            }

            if (assetInfo.name === 'styles.css') {
              return 'styles[extname]';
            }

            const sourceFile = assetInfo.originalFileNames?.[0] ?? '';

            if (!sourceFile.includes('src/components/')) {
              return 'assets/[name][extname]';
            }

            const relativeSource = sourceFile.replace(/\\/g, '/').replace('src/components/', '');

            const componentDir = relativeSource.replace(/index(\.wc)?\.(vue|tsx|ts)$/, '');

            return `components/${componentDir}[name][extname]`;

            // if (assetInfo.name?.endsWith('.css')) {
            //   let name = '';
            //   if (
            //     assetInfo.originalFileNames &&
            //     assetInfo.originalFileNames.length > 0 &&
            //     assetInfo.originalFileNames[0].includes('src/components')
            //   ) {
            //     const orginaleName = assetInfo.name.replace('.css', '');
            //     name = assetInfo.originalFileNames[0]
            //       .replace('src/components/', '')
            //       .replace(`${orginaleName}.vue`, '');
            //   }

            //   return `components/${name}[name][extname]`;
            // }
            // return 'assets/[name][extname]';
          },
          chunkFileNames: '[name]-[hash].js',
        },
      },
      cssMinify: true,
      minify: 'esbuild',
      outDir: 'dist',
      cssCodeSplit: false,
      emptyOutDir: true,
    },
  };
});
