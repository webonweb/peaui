import { describe, expect, it } from 'vitest';

const vueComponents = import.meta.glob('../../*/*/index.vue');
const webComponents = import.meta.glob('../../*/*/index.wc.ts');
const webComponentStories = import.meta.glob('../../*/*/index.wc.stories.ts');
const webComponentTests = import.meta.glob('../../*/*/index.wc.spec.ts');

function componentDirectories(files: Record<string, unknown>): string[] {
  return Object.keys(files)
    .filter((file) => !file.includes('/__internal__/'))
    .map((file) => file.replace(/\/index(?:\.wc(?:\.stories|\.spec)?)?\.(?:ts|vue)$/, ''))
    .sort();
}

describe('Web Components catalog parity', () => {
  it('keeps a Web Component, story and test next to every Vue component', () => {
    const expectedComponents = componentDirectories(vueComponents);

    expect(expectedComponents).toHaveLength(87);
    expect(componentDirectories(webComponents)).toEqual(expectedComponents);
    expect(componentDirectories(webComponentStories)).toEqual(expectedComponents);
    expect(componentDirectories(webComponentTests)).toEqual(expectedComponents);
  });
});
