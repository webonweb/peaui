import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import BreadcrumbsVueComponent from './index.ce.vue';
import { BreadcrumbsElement, defineBreadcrumbs } from './index.wc';

defineBreadcrumbs();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Breadcrumbs (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(BreadcrumbsElement.tagName)).toBe(BreadcrumbsElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      BreadcrumbsElement.tagName,
      createVueCustomElementStoryArgs(BreadcrumbsVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
    expect(element.getAttribute('role')).toBe('group');
  });
});
