import fs from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

/**
 * Loads `index.ce.vue` requests from the colocated `index.vue` source.
 *
 * The virtual `.ce.vue` filename makes @vitejs/plugin-vue compile native slot
 * outlets for Custom Elements without duplicating the source SFC on disk.
 */
export function peauiVueCustomElementPlugin(): Plugin {
  const sourceFiles = new Map<string, string>();

  return {
    name: 'peaui:vue-custom-element-source',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || (!source.endsWith('/index.ce.vue') && source !== './index.ce.vue')) {
        return undefined;
      }

      const virtualFile = path.resolve(path.dirname(importer), source);
      const sourceFile = virtualFile.replace(/\.ce\.vue$/, '.vue');

      if (!fs.existsSync(sourceFile)) return undefined;

      sourceFiles.set(path.normalize(virtualFile), sourceFile);
      return virtualFile;
    },
    load(id) {
      const sourceFile = sourceFiles.get(path.normalize(id));
      return sourceFile ? fs.readFileSync(sourceFile, 'utf8') : undefined;
    },
  };
}
