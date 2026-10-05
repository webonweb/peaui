import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import type { Plugin } from 'vite';

/** Keep debugging information while storing identical ESM/CJS source text only once. */
export function deduplicateSourceMaps(): Plugin {
  return {
    name: 'peaui:deduplicate-source-maps',
    writeBundle(options) {
      if (!options.dir) return;
      const output = resolve(options.dir);
      const sourcesDirectory = join(output, 'sources');
      mkdirSync(sourcesDirectory, { recursive: true });
      for (const entry of readdirSync(output, { recursive: true, withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.map')) continue;
        const file = join(entry.parentPath, entry.name);
        const map = JSON.parse(readFileSync(file, 'utf8')) as {
          sources?: string[];
          sourcesContent?: Array<string | null>;
          sourceRoot?: string;
        };
        if (!map.sourcesContent || !map.sources || map.sourceRoot) continue;
        map.sources = map.sources.map((source, index) => {
          const content = map.sourcesContent?.[index];
          if (content === null || content === undefined) return source;
          const hash = createHash('sha256').update(content).digest('hex').slice(0, 20);
          const target = join(
            sourcesDirectory,
            `${hash}-${basename(source).replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          );
          writeFileSync(target, content);
          return relative(dirname(file), target).replaceAll('\\', '/');
        });
        delete map.sourcesContent;
        writeFileSync(file, JSON.stringify(map));
      }
    },
  };
}
