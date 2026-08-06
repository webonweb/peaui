import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormCheckboxVueComponent from './index.ce.vue';
import { FormCheckboxElement, defineFormCheckbox } from './index.wc';

defineFormCheckbox();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormCheckbox (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormCheckboxElement.tagName)).toBe(FormCheckboxElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormCheckboxElement.tagName,
      createVueCustomElementStoryArgs(FormCheckboxVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
