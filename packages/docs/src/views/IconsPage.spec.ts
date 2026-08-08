import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { setLocale } from '../i18n';
import IconsPage from './IconsPage.vue';

const { iconCategories, icons } = vi.hoisted(() => {
  const categories = [
    { description: 'Core symbols.', id: 'core', label: 'Core' },
    { description: 'Extended symbols.', id: 'extended', label: 'Extended' },
  ];
  const entries = Array.from({ length: 105 }, (_, index) => {
    const category = index < 100 ? 'core' : 'extended';
    const suffix = index.toString().padStart(3, '0');

    return {
      category,
      description: `Icon ${suffix}.`,
      keywords: [`icon-${suffix}`],
      label: `Icon ${suffix}`,
      name: `${category}/icon-${suffix}`,
    };
  });

  return { iconCategories: categories, icons: entries };
});

vi.mock('../data/icons', () => ({ iconCategories, icons }));
vi.mock('../data/localized-content', () => ({
  getIcon: (icon: unknown) => icon,
  getIconCategory: (category: unknown) => category,
}));

async function mountPage(query = '') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:framework/icons', component: { template: '<div />' } }],
  });
  await router.push(`/vue/icons${query}`);
  await router.isReady();

  return mount(IconsPage, {
    attachTo: document.body,
    global: {
      plugins: [router],
      stubs: {
        CodeBlock: { template: '<div data-testid="code-block" />' },
        SvgIcon: {
          props: ['name'],
          template: '<svg :data-icon="name" />',
        },
      },
    },
  });
}

describe('IconsPage catalog navigation', () => {
  beforeEach(() => {
    setLocale('en', false);
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('replaces incremental loading with deterministic pagination above and below the grid', async () => {
    const wrapper = await mountPage();

    expect(wrapper.find('.icon-load-more').exists()).toBe(false);
    expect(wrapper.findAll('.icon-card')).toHaveLength(96);
    expect(wrapper.findAll('nav.icon-pagination')).toHaveLength(2);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('1');

    await wrapper.findAll('button[aria-label="Next page"]')[0]!.trigger('click');

    expect(wrapper.findAll('.icon-card')).toHaveLength(9);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2');
    expect(wrapper.text()).toContain('core/icon-096');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('filters by a named category with counts and resets the current page', async () => {
    const wrapper = await mountPage();
    await wrapper.findAll('button[aria-label="Next page"]')[0]!.trigger('click');

    const categoryButtons = wrapper.findAll('.icon-category-filter button');
    const extended = categoryButtons.find((button) => button.text().includes('Extended'));
    expect(extended).toBeDefined();
    expect(extended?.text()).toContain('5');

    await extended!.trigger('click');

    expect(extended?.attributes('aria-pressed')).toBe('true');
    expect(wrapper.get('.icon-catalog-section h2').text()).toBe('Extended');
    expect(wrapper.findAll('.icon-card')).toHaveLength(5);
    expect(wrapper.find('nav.icon-pagination').exists()).toBe(false);
    wrapper.unmount();
  });

  it('searches inside the selected category and offers a return to all categories', async () => {
    const wrapper = await mountPage('?category=extended');
    const search = wrapper.get('input[type="search"]');

    expect(wrapper.get('.icon-catalog-section h2').text()).toBe('Extended');
    await search.setValue('icon-004');

    expect(wrapper.findAll('.icon-card')).toHaveLength(0);
    const searchEverywhere = wrapper.get('.icon-empty-state button');
    expect(searchEverywhere.text()).toBe('Search all categories');

    await searchEverywhere.trigger('click');

    expect(wrapper.findAll('.icon-card')).toHaveLength(1);
    expect(wrapper.text()).toContain('core/icon-004');
    wrapper.unmount();
  });
});
