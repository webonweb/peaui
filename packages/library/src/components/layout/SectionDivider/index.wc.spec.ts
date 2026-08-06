import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import SectionDividerVueComponent from './index.ce.vue';
import { SectionDividerElement, defineSectionDivider } from './index.wc';

defineSectionDivider();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SectionDivider (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(SectionDividerElement.tagName)).toBe(SectionDividerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      SectionDividerElement.tagName,
      createVueCustomElementStoryArgs(SectionDividerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
