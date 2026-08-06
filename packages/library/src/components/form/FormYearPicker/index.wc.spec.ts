import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormYearPickerVueComponent from './index.ce.vue';
import { FormYearPickerElement, defineFormYearPicker } from './index.wc';

defineFormYearPicker();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormYearPicker (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormYearPickerElement.tagName)).toBe(FormYearPickerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormYearPickerElement.tagName,
      createVueCustomElementStoryArgs(FormYearPickerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
