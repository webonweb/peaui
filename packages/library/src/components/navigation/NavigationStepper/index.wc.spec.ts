import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationStepperVueComponent from './index.ce.vue';
import { NavigationStepperElement, defineNavigationStepper } from './index.wc';

defineNavigationStepper();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NavigationStepper (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(NavigationStepperElement.tagName)).toBe(NavigationStepperElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      NavigationStepperElement.tagName,
      createVueCustomElementStoryArgs(NavigationStepperVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
