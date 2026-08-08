import { describe, expect, it } from 'vitest';

import { iconCatalog, iconCategories, icons } from './icons';

describe('PEAUI icon catalog', () => {
  it('keeps every synchronized icon in a functional category', () => {
    const categoryIds = new Set(iconCategories.map((category) => category.id));

    expect(iconCatalog.icons).toHaveLength(1348);
    expect(iconCatalog.categories).toEqual(['core', 'extended', 'ring', 'tile']);
    expect(new Set(iconCatalog.icons.map((icon) => icon.name)).size).toBe(iconCatalog.icons.length);
    expect(iconCatalog.icons.every((icon) => categoryIds.has(icon.category))).toBe(true);
    expect(iconCatalog.icons.every((icon) => icon.name.startsWith(`${icon.category}/`))).toBe(true);
    expect(iconCatalog.catalogVersion).toBe(5);
    expect(iconCatalog.profile).toEqual({
      generator: 'scripts/sync-icon-catalog.mjs',
      geometrySource: 'peaui-outline-icons-mega',
      name: 'peaui-outline-0.3.0',
    });
    expect(iconCatalog.strokeWidth).toBe(1.8);
  });

  it('combines the grouped catalog with the existing PEAUI icons', () => {
    const names = new Set(icons.map((icon) => icon.name));

    expect(icons).toHaveLength(1398);
    expect(names.size).toBe(icons.length);
    expect(names.has('core/copy')).toBe(true);
    expect(names.has('core/check-circle')).toBe(true);
    expect(names.has('ring/ring-check')).toBe(true);
    expect(names.has('tile/tile-check')).toBe(true);
    expect(names.has('extended/building')).toBe(true);
    expect(names.has('check')).toBe(true);
  });
});
