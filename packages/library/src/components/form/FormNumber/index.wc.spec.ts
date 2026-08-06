import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormNumberVueComponent from './index.ce.vue';
import { FormNumberElement, defineFormNumber } from './index.wc';

defineFormNumber();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormNumber (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormNumberElement.tagName)).toBe(FormNumberElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormNumberElement.tagName,
      createVueCustomElementStoryArgs(FormNumberVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
