import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormDatePickerVueComponent from './index.ce.vue';
import { FormDatePickerElement, defineFormDatePicker } from './index.wc';

defineFormDatePicker();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormDatePicker (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormDatePickerElement.tagName)).toBe(FormDatePickerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormDatePickerElement.tagName,
      createVueCustomElementStoryArgs(FormDatePickerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
