import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import App from './App.vue';
import { setLocale } from './i18n';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      {
        path: '/:framework(vue|react|web-components)/start',
        name: 'start',
        component: { template: '<div>Start</div>' },
      },
      {
        path: '/:framework(vue|react|web-components)/components',
        name: 'components',
        component: { template: '<div>Components</div>' },
      },
      {
        path: '/:framework(vue|react|web-components)/icons',
        name: 'icons',
        component: { template: '<div>Icons</div>' },
      },
    ],
  });
}

async function mountApp() {
  const router = createTestRouter();
  await router.push('/');
  await router.isReady();
  const wrapper = mount(App, {
    attachTo: document.body,
    global: {
      plugins: [router],
      stubs: {
        LocaleSwitcher: { template: '<div />' },
        SearchPalette: { template: '<div />' },
        ThemeToggle: { template: '<button type="button">Theme</button>' },
      },
    },
  });
  return wrapper;
}

describe('documentation shell accessibility', () => {
  beforeEach(() => setLocale('en', false));

  it('places a localized skip link first and provides a stable focus target', async () => {
    const wrapper = await mountApp();
    const firstFocusable = wrapper.findAll('a, button, input, [tabindex]')[0];

    expect(firstFocusable?.classes()).toContain('skip-link');
    expect(firstFocusable?.attributes('href')).toBe('#main-content');
    expect(firstFocusable?.text()).toBe('Skip to documentation');
    expect(wrapper.get('main').attributes('id')).toBe('main-content');
    expect(wrapper.get('main').attributes('tabindex')).toBe('-1');
    await firstFocusable?.trigger('click');
    await flushPromises();
    expect(document.activeElement).toBe(wrapper.get('main').element);
    wrapper.unmount();
  });

  it('exposes mobile menu state, moves focus, closes on Escape and restores focus', async () => {
    const wrapper = await mountApp();
    const toggle = wrapper.get('button.menu-toggle');
    const sidebar = wrapper.get('#documentation-sidebar');

    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(toggle.attributes('aria-controls')).toBe('documentation-sidebar');
    expect(toggle.attributes('aria-label')).toBe('Open navigation');
    expect(sidebar.attributes('inert')).toBeDefined();

    await toggle.trigger('click');
    await flushPromises();

    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(toggle.attributes('aria-label')).toBe('Close navigation');
    expect(document.activeElement).toBe(sidebar.find('a').element);
    expect(document.body.classList.contains('docs-mobile-nav-open')).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushPromises();

    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle.element);
    expect(document.body.classList.contains('docs-mobile-nav-open')).toBe(false);
    wrapper.unmount();
  });

  it('does not place focusable controls inside aria-hidden decorations', async () => {
    const wrapper = await mountApp();
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    for (const hidden of wrapper.findAll('[aria-hidden="true"]:not([inert])')) {
      expect(hidden.element.querySelector(focusableSelector)).toBeNull();
    }
    wrapper.unmount();
  });
});
