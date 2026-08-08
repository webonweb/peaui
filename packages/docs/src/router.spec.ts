import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./views/ComponentPage.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./views/ComponentsIndexPage.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./views/GettingStartedPage.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./views/HomePage.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./views/IconsPage.vue', () => ({ default: { template: '<div />' } }));

import { setLocale } from './i18n';
import { router } from './router';
import { FRAMEWORK_STORAGE_KEY } from './utils/preferred-framework';

describe('documentation routing', () => {
  beforeEach(async () => {
    setLocale('en', false);
    localStorage.clear();
    await router.push('/');
  });

  it('resolves clean component URLs and category pages without a hash', () => {
    const component = router.resolve('/react/components/form/form-input');
    const category = router.resolve('/web-components/components/form');

    expect(component.name).toBe('component');
    expect(component.href).toContain('/react/components/form/form-input');
    expect(component.href).not.toContain('#/');
    expect(category.name).toBe('component-category');
  });

  it('keeps legacy catalog URLs and respects the saved framework', async () => {
    localStorage.setItem(FRAMEWORK_STORAGE_KEY, 'react');
    await router.push('/components');

    expect(router.currentRoute.value.path).toBe('/react/components');
  });

  it('persists Polish language selection in a clean path prefix', async () => {
    setLocale('pl', false);
    await router.push('/vue/start');

    expect(router.currentRoute.value.path).toBe('/pl/vue/start');
    expect(router.currentRoute.value.query.lang).toBeUndefined();
  });

  it('migrates the legacy language query to a localized clean URL', async () => {
    await router.push('/react/components?lang=pl');

    expect(router.currentRoute.value.path).toBe('/pl/react/components');
    expect(router.currentRoute.value.query.lang).toBeUndefined();
  });
});
