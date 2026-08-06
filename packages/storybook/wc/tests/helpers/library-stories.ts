import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type LibraryWebComponentStory = {
  componentName: string;
  id: string;
};

const helperDirectory = path.dirname(fileURLToPath(import.meta.url));
const componentsDirectory = path.resolve(helperDirectory, '../../../../library/src/components');

function listStoryFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return listStoryFiles(entryPath);

    return entry.isFile() && entry.name.endsWith('.wc.stories.ts') ? [entryPath] : [];
  });
}

function slugifyTitleSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function slugifyStoryExport(value: string): string {
  return slugifyTitleSegment(value.replace(/([a-z0-9])([A-Z])/g, '$1-$2'));
}

export function getWebComponentStories(): LibraryWebComponentStory[] {
  return listStoryFiles(componentsDirectory)
    .filter((filePath) => !filePath.includes(`${path.sep}__internal__${path.sep}`))
    .map((filePath) => {
      const source = fs.readFileSync(filePath, 'utf8');
      const title = source.match(/const meta[\s\S]*?\btitle:\s*'([^']+)'/)?.[1];
      const storyExport = source.match(/export const (\w+): Story\b/)?.[1];

      if (!title || !storyExport) {
        throw new Error(`Could not read the base Web Component story from ${filePath}.`);
      }

      return {
        componentName: path.basename(path.dirname(filePath)),
        id: `${title.split('/').map(slugifyTitleSegment).join('-')}--${slugifyStoryExport(storyExport)}`,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
