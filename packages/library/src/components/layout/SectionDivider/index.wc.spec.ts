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
  it('updates direction, size and accessibility without a Vue instance', async () => {
    const element = new SectionDividerElement();
    document.body.append(element);
    expect(element.querySelector('hr')?.className).toContain('--size-s');
    element.direction = 'vertical';
    element.size = 'xl';
    element.setAttribute('aria-label', 'Groups');
    await Promise.resolve();
    const separator = element.querySelector('[role="separator"]');
    expect(separator?.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator?.getAttribute('aria-label')).toBe('Groups');
    expect(separator?.className).toContain('--size-xl');
    element.remove();
    document.body.append(element);
    element.direction = 'horizontal';
    expect(element.querySelector('hr')).not.toBeNull();
    expect(element.querySelector('[role="separator"]')).toBeNull();
  });
  it('registers the public custom element', () => {
    expect(customElements.get(SectionDividerElement.tagName)).toBe(SectionDividerElement);
  });

  it('accepts the shared Storybook props', async () => {
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
