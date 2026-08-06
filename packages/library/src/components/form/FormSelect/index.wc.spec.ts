import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormSelectVueComponent from './index.ce.vue';
import { FormSelectElement, defineFormSelect } from './index.wc';

defineFormSelect();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormSelect (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormSelectElement.tagName)).toBe(FormSelectElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormSelectElement.tagName,
      createVueCustomElementStoryArgs(FormSelectVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
