import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import CalculationResultsVueComponent from './index.ce.vue';
import { CalculationResultsElement, defineCalculationResults } from './index.wc';

defineCalculationResults();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('CalculationResults (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(CalculationResultsElement.tagName)).toBe(CalculationResultsElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      CalculationResultsElement.tagName,
      createVueCustomElementStoryArgs(CalculationResultsVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
