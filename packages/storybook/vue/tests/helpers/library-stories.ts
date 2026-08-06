import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type LibraryBaseStory = {
  componentName: string;
  filePath: string;
  id: string;
  storyExportName: string;
  title: string;
};

const helperDirectory = path.dirname(fileURLToPath(import.meta.url));
const componentsDirectory = path.resolve(helperDirectory, '../../../../library/src/components');

let cachedStories: LibraryBaseStory[] | null = null;

function listStoryFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listStoryFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.vue.stories.ts') ? [entryPath] : [];
  });
}

function slugifyTitle(title: string): string {
  return title
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .join('-');
}

function slugifyStoryExport(storyExportName: string): string {
  return storyExportName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function getMetaTitle(fileContent: string, filePath: string): string {
  const match = fileContent.match(/const meta[\s\S]*?\btitle:\s*'([^']+)'/);

  if (!match) {
    throw new Error(`Could not read story title from ${filePath}.`);
  }

  return match[1];
}

function getFirstStoryExport(fileContent: string, filePath: string): string {
  const match = fileContent.match(/export const (\w+): Story\b/);

  if (!match) {
    throw new Error(`Could not read base story export from ${filePath}.`);
  }

  return match[1];
}

function getComponentName(filePath: string): string {
  return path.basename(path.dirname(filePath));
}

export function getPublicBaseStories(): LibraryBaseStory[] {
  if (cachedStories) {
    return cachedStories;
  }

  cachedStories = listStoryFiles(componentsDirectory)
    .filter((filePath) => !filePath.includes(`${path.sep}__internal__${path.sep}`))
    .map((filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const title = getMetaTitle(fileContent, filePath);
      const storyExportName = getFirstStoryExport(fileContent, filePath);
      const id = `${slugifyTitle(title)}--${slugifyStoryExport(storyExportName)}`;

      return {
        componentName: getComponentName(filePath),
        filePath,
        id,
        storyExportName,
        title,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  return cachedStories;
}
