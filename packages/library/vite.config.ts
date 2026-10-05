import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import GlobPlugin from 'vite-plugin-glob';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import svgLoader from 'vite-svg-loader';

import { peauiVueCustomElementPlugin } from './vue-custom-element-plugin';
import { deduplicateSourceMaps } from './source-map-plugin';

const projectRootDir = resolve(__dirname);
const componentSourceRoot = resolve(projectRootDir, 'src/components');
const globalStylesPath = resolve(projectRootDir, 'src/assets/global.scss');
type ComponentsMap = Record<string, string>;

const componentStyleCache = new Map<string, string[]>();

function isInsideComponentSource(filePath: string): boolean {
  const relativePath = path.relative(componentSourceRoot, filePath);

  return relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

function resolveVueComponentImport(
  specifier: string,
  importerDirectory: string,
): string | undefined {
  let importedPath: string;

  if (specifier.startsWith('@/components/')) {
    importedPath = path.join(componentSourceRoot, specifier.slice('@/components/'.length));
  } else if (specifier.startsWith('.')) {
    importedPath = path.resolve(importerDirectory, specifier);
  } else {
    return undefined;
  }

  const candidates = [
    importedPath,
    `${importedPath}.vue`,
    `${importedPath}.ts`,
    path.join(importedPath, 'index.vue'),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) continue;
    if (!/\.(vue|ts)$/.test(candidate) || candidate.endsWith('.wc.ts')) continue;
    if (isInsideComponentSource(candidate)) return candidate;
  }

  return undefined;
}

/**
 * Uses the Vue composition graph as the framework-neutral source of style
 * dependencies. React and Web Component implementations render the same BEM
 * structure, so they need the same primitive styles as their Vue counterpart.
 */
function collectComponentStyles(componentDirectory: string): string[] {
  const cachedStyles = componentStyleCache.get(componentDirectory);

  if (cachedStyles) return cachedStyles;

  const styles = new Set<string>();
  const visitedSources = new Set<string>();
  const visitedDirectories = new Set<string>();

  function visit(sourceFile: string) {
    if (visitedSources.has(sourceFile) || !fs.existsSync(sourceFile)) return;
    visitedSources.add(sourceFile);
    const directory = path.dirname(sourceFile);
    const source = fs.readFileSync(sourceFile, 'utf8').replace(/import\s+type\b[^;]+;/g, '');
    for (const match of source.matchAll(/(?:from\s+|import\s*(?:\(\s*)?)["']([^"']+)["']/g)) {
      const dependency = resolveVueComponentImport(match[1], directory);
      if (dependency) visit(dependency);
    }
    // Shared TypeScript utilities do not render their directory's component.
    // Follow their Vue imports, but do not attach unrelated sibling CSS.
    if (!sourceFile.endsWith('.vue') || visitedDirectories.has(directory)) return;
    visitedDirectories.add(directory);
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.scss'))
      .sort((left, right) => left.name.localeCompare(right.name))) {
      styles.add(path.join(directory, entry.name));
    }
  }

  visit(path.join(componentDirectory, 'index.vue'));

  const collectedStyles = [...styles];
  componentStyleCache.set(componentDirectory, collectedStyles);

  return collectedStyles;
}

function toRelativeImport(importerFile: string, importedFile: string): string {
  const relativePath = path.relative(path.dirname(importerFile), importedFile).replace(/\\/g, '/');

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

/**
 * Adds styles to every framework entry before Rollup creates its chunks.
 * vite-plugin-lib-inject-css then writes the corresponding CSS import into
 * the published ESM/CommonJS module, keeping SSR compatibility.
 */
function peauiComponentStylesPlugin(): Plugin {
  const componentEntryNames = new Set(['index.vue', 'index.ce.vue', 'index.tsx', 'index.wc.ts']);

  return {
    name: 'peaui:component-styles',
    apply: 'build',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('?')) return undefined;

      const normalizedId = id.replace(/\\/g, '/');
      const componentDirectory = path.dirname(id);

      if (!componentEntryNames.has(path.basename(normalizedId))) return undefined;
      if (!isInsideComponentSource(componentDirectory)) return undefined;

      const styleImports = [globalStylesPath, ...collectComponentStyles(componentDirectory)]
        .map((styleFile) => `import '${toRelativeImport(id, styleFile)}';`)
        .join('\n');

      return {
        code: `${styleImports}\n${code}`,
        map: null,
      };
    },
  };
}

/**
 * Node cannot execute CSS through CommonJS `require()`. ESM entries retain
 * their component-level CSS imports for bundlers, while CommonJS entries stay
 * directly loadable in SSR and build tooling. Consumers using CommonJS import
 * `@peaui/ui/styles.css` from their application stylesheet or bundler entry.
 */
function stripCommonJsCssRequiresPlugin(): Plugin {
  return {
    name: 'peaui:strip-commonjs-css-requires',
    apply: 'build',
    enforce: 'post',
    generateBundle(outputOptions, bundle) {
      if (outputOptions.format !== 'cjs') return undefined;

      for (const artifact of Object.values(bundle)) {
        if (artifact.type !== 'chunk') continue;
        artifact.code = artifact.code.replace(/require\((["'])[^"']+\.css\1\);?/g, '');
      }
    },
  };
}

/** Native Node ESM facades share the CSS-free CommonJS runtime and unwrap its default export. */
function nodeEsmFacadesPlugin(): Plugin {
  return {
    name: 'peaui:node-esm-facades',
    generateBundle(outputOptions, bundle) {
      if (outputOptions.format !== 'cjs') return;
      for (const artifact of Object.values(bundle)) {
        if (artifact.type !== 'chunk' || !artifact.isEntry) continue;
        if (artifact.fileName.startsWith('components/wc/')) continue;
        const fileName = `node/${artifact.fileName.replace(/\.umd\.cjs$/, '.mjs')}`;
        const specifier = path.posix.relative(path.posix.dirname(fileName), artifact.fileName);
        const source = [
          `import runtime from '${specifier.startsWith('.') ? specifier : `./${specifier}`}';`,
          ...artifact.exports.map((name) =>
            name === 'default'
              ? 'export default runtime.default;'
              : `export const ${name} = runtime.${name};`,
          ),
        ].join('\n');
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}

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
    react: 'src/react.ts',
    vite: 'src/vite.ts',
    'web-components': 'src/web-components.ts',
    'internal/html-decoder': 'src/helpers/html-decoder.ts',
    'internal/html-decoder.browser': 'src/helpers/html-decoder.browser.ts',
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
 * - Associates every component entry with only its required CSS
 * - Keeps the complete stylesheet as an optional compatibility entry
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
      {
        name: 'peaui:conditional-html-decoder',
        enforce: 'pre',
        resolveId(source, importer) {
          if (
            source === './html-decoder' &&
            importer?.replaceAll('\\', '/').endsWith('/helpers/functions.helper.ts')
          ) {
            return { id: '#peaui-html-decoder', external: true };
          }
        },
      },
      peauiVueCustomElementPlugin(),
      vue(),
      svgLoader(),
      react(),
      peauiComponentStylesPlugin(),
      libInjectCss(),
      stripCommonJsCssRequiresPlugin(),
      nodeEsmFacadesPlugin(),
      deduplicateSourceMaps(),
      dts({
        compilerOptions: {
          noCheck: true,
        },
        insertTypesEntry: true,
        tsconfigPath: resolve(projectRootDir, 'tsconfig.build.json'),
        exclude: ['**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
        beforeWriteFile(filePath, content) {
          // The generated entry facade must expose named types as well as the default component.
          if (/\/dist\/(?:react|vue)\//.test(filePath.replace(/\\/g, '/'))) {
            const modulePath = content.match(/import peauiui from ['"]([^'"]+)['"]/);
            if (modulePath) content += `\nexport * from '${modulePath[1]}';\n`;
          }
          return { filePath, content };
        },
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
      sourcemap: true,
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

          if (name === 'web-components') {
            return `web-components.${format === 'es' ? 'js' : 'umd.cjs'}`;
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

            return 'assets/[name]-[hash][extname]';
          },
          chunkFileNames: '[name]-[hash].js',
        },
      },
      cssMinify: true,
      minify: 'esbuild',
      outDir: 'dist',
      cssCodeSplit: true,
      emptyOutDir: true,
    },
  };
});
