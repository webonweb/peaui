import { generatedComponentCatalog } from '../generated/component-catalog';
import type { ComponentCatalogDefinition, FrameworkId } from '../types';
import { componentCopy, fallbackCopy } from './component-copy';

function toSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export const componentCatalog: Record<FrameworkId, ComponentCatalogDefinition[]> = {
  vue: generatedComponentCatalog.vue.map(enhanceCatalogEntry),
  react: generatedComponentCatalog.react.map(enhanceCatalogEntry),
  'web-components': generatedComponentCatalog['web-components'].map(enhanceCatalogEntry),
};

function enhanceCatalogEntry(
  entry: (typeof generatedComponentCatalog)[FrameworkId][number],
): ComponentCatalogDefinition {
  return {
    ...entry,
    slug: toSlug(entry.name),
    copy: componentCopy[entry.name] ?? fallbackCopy(entry.name),
  };
}

export function getCatalogComponents(framework: FrameworkId): ComponentCatalogDefinition[] {
  return componentCatalog[framework];
}

export function getCatalogCategories(framework: FrameworkId) {
  const entries = getCatalogComponents(framework);

  return [
    ...new Map(entries.map((component) => [component.category, component.categoryLabel])).entries(),
  ].map(([slug, label]) => ({
    slug,
    label,
    components: entries.filter((component) => component.category === slug),
  }));
}

export function findCatalogComponent(
  framework: FrameworkId,
  category: string,
  slug: string,
): ComponentCatalogDefinition | undefined {
  return getCatalogComponents(framework).find(
    (component) => component.category === category && component.slug === slug,
  );
}
