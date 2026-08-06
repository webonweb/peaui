import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormFileUploadSimpleVueComponent from './index.ce.vue';
import { FormFileUploadSimpleElement, defineFormFileUploadSimple } from './index.wc';

defineFormFileUploadSimple();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormFileUploadSimple (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormFileUploadSimpleElement.tagName)).toBe(
      FormFileUploadSimpleElement,
    );
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormFileUploadSimpleElement.tagName,
      createVueCustomElementStoryArgs(FormFileUploadSimpleVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
