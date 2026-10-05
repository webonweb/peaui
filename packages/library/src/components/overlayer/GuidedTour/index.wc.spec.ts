import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import type { GuidedTourStep } from './guided-tour.shared';
import GuidedTourVueComponent from './index.ce.vue';
import { defineGuidedTour, GuidedTourElement } from './index.wc';

defineGuidedTour();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('GuidedTour (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(GuidedTourElement.tagName)).toBe(GuidedTourElement);
  });

  it('renders the shared implementation and accepts controlled complex props', async () => {
    const element = renderVueCustomElementStory(
      GuidedTourElement.tagName,
      createVueCustomElementStoryArgs(GuidedTourVueComponent),
    ) as HTMLElement & {
      mode: 'modal';
      open: boolean;
      steps: GuidedTourStep[];
    };
    element.mode = 'modal';
    element.open = true;
    element.steps = [{ id: 'welcome', title: 'Welcome', description: 'Web Component tour' }];
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element).toHaveAttribute('role', 'group');
    expect(element.childNodes.length).toBeGreaterThan(0);
    expect(element.querySelector('[role="dialog"]')?.textContent).toContain('Welcome');
  });
});
