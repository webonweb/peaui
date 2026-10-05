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
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.querySelector('nav')?.hasAttribute('role')).toBe(false);
  });

  it('does not interpret HTML from breadcrumb labels', async () => {
    const label = '<img src=x onerror="alert(1)">Current';
    const element = document.createElement(BreadcrumbsElement.tagName) as InstanceType<
      typeof BreadcrumbsElement
    >;
    element.items = [{ key: 'current', label }];
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(
      element
        .querySelector('.peaui-breadcrumbs__content [aria-current="page"]')
        ?.textContent?.trim(),
    ).toBe(label);
    expect(element.querySelector('img')).toBeNull();
  });
});
