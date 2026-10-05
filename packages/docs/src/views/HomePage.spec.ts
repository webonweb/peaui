import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import libraryPackage from '../../../library/package.json';
import { setLocale } from '../i18n';
import HomePage from './HomePage.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/:framework/start', component: { template: '<div />' } },
      { path: '/:framework/components', component: { template: '<div />' } },
      { path: '/:framework/components/:category/:component', component: { template: '<div />' } },
    ],
  });
}

async function mountHome() {
  const router = createTestRouter();
  await router.push('/');
  await router.isReady();
  return mount(HomePage, {
    global: {
      plugins: [router],
      stubs: {
        HomeComponentPreview: { template: '<div data-testid="component-preview" />' },
        InstallCommand: { template: '<div data-testid="install-command" />' },
      },
    },
  });
}

describe('HomePage', () => {
  beforeEach(() => setLocale('en', false));

  it('renders the English value proposition, dynamic version and all main CTAs', async () => {
    const wrapper = await mountHome();

    expect(wrapper.get('h1').text()).toBe('One UI system for Vue, React and Web Components.');
    expect(wrapper.text()).toContain(`Documentation v${libraryPackage.version}`);
    expect(wrapper.text()).toContain('Browse components');
    expect(wrapper.text()).toContain('Get started');
    expect(wrapper.find('[data-testid="component-preview"]').exists()).toBe(true);

    const github = wrapper.get('a[href="https://github.com/webonweb/peaui"]');
    const npm = wrapper.get('a[href="https://www.npmjs.com/package/@peaui/ui"]');
    expect(github.attributes('rel')).toBe('noopener noreferrer');
    expect(npm.attributes('target')).toBe('_blank');
  });

  it('renders the Polish hero and CTA copy', async () => {
    setLocale('pl', false);
    const wrapper = await mountHome();

    expect(wrapper.get('h1').text()).toBe('Jeden system UI dla Vue, React i Web Components.');
    expect(wrapper.text()).toContain('Przeglądaj komponenty');
    expect(wrapper.text()).toContain('Zobacz w npm');
    expect(wrapper.text()).toContain(`Dokumentacja v${libraryPackage.version}`);
  });

  it('shows six featured components and the verified trust features', async () => {
    const wrapper = await mountHome();

    expect(wrapper.findAll('.featured-component-card')).toHaveLength(6);
    expect(wrapper.text()).toContain('Featured components');
    expect(wrapper.findAll('.trust-list li')).toHaveLength(6);
    expect(wrapper.text()).toContain('MIT licensed');
    expect(wrapper.text()).not.toContain('PhotoEditor');
  });

  it('keeps documentation CTAs neutral until a framework is selected', async () => {
    const wrapper = await mountHome();
    expect(wrapper.findAll('.home-hero__actions a')[0]?.attributes('href')).toContain(
      '#frameworks',
    );

    await wrapper.findAll('.hero-framework-choice button')[1]?.trigger('click');
    expect(wrapper.findAll('.home-hero__actions a')[0]?.attributes('href')).toContain(
      '/react/components',
    );
  });
});
