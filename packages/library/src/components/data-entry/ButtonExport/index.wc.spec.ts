import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import ButtonExportVueComponent from './index.ce.vue';
import { ButtonExportElement, defineButtonExport } from './index.wc';

defineButtonExport();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ButtonExport (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(ButtonExportElement.tagName)).toBe(ButtonExportElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      ButtonExportElement.tagName,
      createVueCustomElementStoryArgs(ButtonExportVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
