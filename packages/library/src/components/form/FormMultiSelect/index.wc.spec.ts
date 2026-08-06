import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormMultiSelectVueComponent from './index.ce.vue';
import { FormMultiSelectElement, defineFormMultiSelect } from './index.wc';

defineFormMultiSelect();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormMultiSelect (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormMultiSelectElement.tagName)).toBe(FormMultiSelectElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormMultiSelectElement.tagName,
      createVueCustomElementStoryArgs(FormMultiSelectVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
