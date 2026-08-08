import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import DisclosurePanelVueComponent from './index.ce.vue';
import { DisclosurePanelElement, defineDisclosurePanel } from './index.wc';

defineDisclosurePanel();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DisclosurePanel (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(DisclosurePanelElement.tagName)).toBe(DisclosurePanelElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      DisclosurePanelElement.tagName,
      createVueCustomElementStoryArgs(DisclosurePanelVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });

  it.each(['alwaysOpen', 'allwaysOpen'] as const)(
    'keeps compatibility with the %s property',
    async (propertyName) => {
      const element = document.createElement(DisclosurePanelElement.tagName) as HTMLElement &
        Record<typeof propertyName, boolean>;
      element[propertyName] = true;
      element.setAttribute('title', 'Details');
      document.body.appendChild(element);
      await nextTick();
      await Promise.resolve();

      expect(element.querySelector('details')).toHaveAttribute('open');
      expect(element.querySelector('.peaui-disclosure-panel__icon')).toBeNull();
    },
  );
});
