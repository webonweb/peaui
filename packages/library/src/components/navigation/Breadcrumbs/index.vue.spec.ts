import { mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const PopoverButtonStub = defineComponent({
  name: 'PopoverButton',
  props: {
    placement: String,
    variant: String,
    ariaLabel: String,
    size: String,
    dataTestid: String,
  },
  setup(_props, { slots, attrs }) {
    return () =>
      h('div', { ...attrs }, [
        h('div', { 'data-testid': 'popover-trigger' }, slots.default?.()),
        h('div', { 'data-testid': 'popover-content' }, slots.content?.()),
      ]);
  },
});

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'a',
        {
          ...attrs,
          href: props.to,
          'data-router-link': 'true',
        },
        slots.default?.(),
      );
  },
});

type BreadcrumbItem = {
  key?: string;
  label: string | ((router: Record<string, unknown>) => string);
  path?: string;
};

const BASE_ROUTE = {
  fullPath: '/current',
  hash: '',
  meta: {},
  params: {},
  path: '/current',
  query: {},
};

function factory(
  props?: Partial<InstanceType<typeof Component>['$props']>,
  route: Record<string, unknown> = BASE_ROUTE,
  options?: { withRouterLink?: boolean },
): VueWrapper {
  const items: BreadcrumbItem[] = [
    { key: 'home', label: 'Home' },
    { key: 'projects', label: 'Projects' },
    { key: 'current', label: 'Current page' },
  ];

  return mount(Component, {
    props: {
      items,
      ...props,
    },
    global: {
      components: options?.withRouterLink ? { RouterLink: RouterLinkStub } : undefined,
      mocks: {
        $route: route,
      },
      stubs: {
        PopoverButton: PopoverButtonStub,
      },
    },
  });
}

describe('Breadcrumbs (index.vue)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders <nav> with aria-label, data-testid and UIKIT class', () => {
    const wrapper = factory({
      ariaLabel: 'My breadcrumbs',
      dataTestId: 'bc',
    });

    const nav = wrapper.get('nav');
    expect(nav.attributes('aria-label')).toBe('My breadcrumbs');
    expect(nav.attributes('data-testid')).toBe('bc');
    expect(nav.classes()).toContain('uikit-breadcrumbs');
  });

  it('uses default ariaLabel and separator when not provided', () => {
    const wrapper = factory();

    const nav = wrapper.get('nav');
    expect(nav.attributes('aria-label')).toBe('Ścieżka nawigacji');
    expect(wrapper.get('.uikit-breadcrumbs__menu').attributes('aria-label')).toBe(
      'Menu ścieżki nawigacji',
    );

    expect(wrapper.text()).toContain('/');
  });

  it('renders desktop breadcrumb items as <ol><li> with current page as <span aria-current>', () => {
    const wrapper = factory();

    const ol = wrapper.get('ol');
    const li = ol.findAll('li');
    expect(li.length).toBe(3);

    const buttons = ol.findAll('button[type="button"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0]!.text()).toBe('Home');
    expect(buttons[1]!.text()).toBe('Projects');

    const current = ol.find('[aria-current="page"]');
    expect(current.exists()).toBe(true);
    expect(current.text()).toBe('Current page');
  });

  it('renders mobile current label and separator', () => {
    const wrapper = factory({ separator: ' / ' });

    const mobile = wrapper.get('.uikit-breadcrumbs__mobile');
    expect(mobile.text()).toContain(' / ');
    expect(mobile.text()).toContain('Current page');

    const mobileCurrent = mobile.get('[aria-current="page"]');
    expect(mobileCurrent.text()).toBe('Current page');
  });

  it('renders function labels using current route object', () => {
    const wrapper = factory(
      {
        items: [
          {
            key: 'home',
            label: 'Home',
            path: '/home',
          },
          {
            label: (router: { path: string }) =>
              router.path.includes('edit') ? 'Edit certificate' : 'Create certificate',
          },
        ],
      },
      {
        ...BASE_ROUTE,
        fullPath: '/certificates/edit',
        path: '/certificates/edit',
      },
    );

    expect(wrapper.get('ol').text()).toContain('Edit certificate');
    expect(wrapper.get('.uikit-breadcrumbs__mobile').text()).toContain('Edit certificate');
    expect(wrapper.get('a[href="/home"]').attributes('aria-label')).toContain('Home');
  });

  it('sets desktop item/separator/button/current data-testid when dataTestId is provided', () => {
    const wrapper = factory({ dataTestId: 'bc' });

    expect(wrapper.find('[data-testid="bc-item-home"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="bc-item-projects"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="bc-item-current"]').exists()).toBe(true);

    expect(wrapper.find('[data-testid="bc-item-separator-projects"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="bc-item-separator-current"]').exists()).toBe(true);

    expect(wrapper.find('[data-testid="bc-item-button-home"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="bc-item-button-projects"]').exists()).toBe(true);

    expect(wrapper.find('[data-testid="bc-item-current-current"]').exists()).toBe(true);
  });

  it('does not set item/separator/button/current data-testid when dataTestId is not provided', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-testid^="bc-"]').exists()).toBe(false);

    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('ol').exists()).toBe(true);
  });

  it("emits 'on:navigate' when a non-last breadcrumb button is clicked (desktop)", async () => {
    const wrapper = factory();

    const desktopButtons = wrapper.get('ol').findAll('button');
    await desktopButtons[0]!.trigger('click');

    const emitted = wrapper.emitted('on:navigate');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([{ key: 'home', label: 'Home' }]);
  });

  it('emits original item when label is a function', async () => {
    const functionLabel = (router: { path: string }) =>
      router.path.includes('edit') ? 'Edit certificate' : 'Create certificate';

    const wrapper = factory(
      {
        items: [
          {
            key: 'home',
            label: functionLabel,
            path: '/certificates',
          },
          {
            key: 'current',
            label: 'Current page',
          },
        ],
      },
      {
        ...BASE_ROUTE,
        fullPath: '/certificates/edit',
        path: '/certificates/edit',
      },
    );

    const link = wrapper.get('ol').find('a');
    link.element.addEventListener('click', (event) => event.preventDefault(), { once: true });
    await link.trigger('click');

    expect(wrapper.emitted('on:navigate')?.[0]).toEqual([
      {
        key: 'home',
        label: functionLabel,
        path: '/certificates',
      },
    ]);
  });

  it("does NOT emit 'on:navigate' when clicking the last breadcrumb (it is not a button)", async () => {
    const wrapper = factory();

    const ol = wrapper.get('ol');
    const lastButton = ol.findAll('button').at(2);
    expect(lastButton).toBeUndefined();

    const current = ol.get('[aria-current="page"]');
    expect(current.text()).toBe('Current page');

    expect(wrapper.emitted('on:navigate')).toBeUndefined();
  });

  it('renders links for non-last items with path and still emits on desktop click', async () => {
    const wrapper = factory({
      items: [
        { key: 'home', label: 'Home', path: '/home' },
        { key: 'projects', label: 'Projects' },
        { key: 'current', label: 'Current page' },
      ],
    });

    const desktop = wrapper.get('ol');
    const desktopLink = desktop.get('a[href="/home"]');

    expect(desktopLink.attributes('data-testid')).toBeUndefined();
    expect(desktop.findAll('button').length).toBe(1);

    desktopLink.element.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    await desktopLink.trigger('click');

    expect(wrapper.emitted('on:navigate')?.[0]).toEqual([
      { key: 'home', label: 'Home', path: '/home' },
    ]);
  });

  it('uses RouterLink for items with path when router is available', async () => {
    const wrapper = factory(
      {
        items: [
          { key: 'home', label: 'Home', path: '/home' },
          { key: 'projects', label: 'Projects' },
          { key: 'current', label: 'Current page' },
        ],
      },
      BASE_ROUTE,
      { withRouterLink: true },
    );

    const desktopLink = wrapper.get('ol').get('a[href="/home"]');
    const menuLink = wrapper.get('.uikit-breadcrumbs__menu').get('a[href="/home"]');

    expect(desktopLink.attributes('data-router-link')).toBe('true');
    expect(menuLink.attributes('data-router-link')).toBe('true');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    });
    let defaultPreventedByComponent = true;

    desktopLink.element.addEventListener(
      'click',
      (clickEvent) => {
        defaultPreventedByComponent = clickEvent.defaultPrevented;
        clickEvent.preventDefault();
      },
      { once: true },
    );

    expect(desktopLink.element.dispatchEvent(event)).toBe(false);
    expect(defaultPreventedByComponent).toBe(false);
    expect(wrapper.emitted('on:navigate')?.[0]).toEqual([
      { key: 'home', label: 'Home', path: '/home' },
    ]);
  });

  it('popover menu renders links for items with path and current item as non-interactive text', async () => {
    const wrapper = factory({
      items: [
        { key: 'home', label: 'Home', path: '/home' },
        { key: 'projects', label: 'Projects' },
        { key: 'current', label: 'Current page' },
      ],
    });

    const menu = wrapper.get('.uikit-breadcrumbs__menu');
    const menuLink = menu.get('a[href="/home"]');
    const menuButtons = menu.findAll('button');
    const menuCurrent = menu.get('[aria-current="page"]');

    expect(menuLink.text()).toBe('Home');
    expect(menuButtons.length).toBe(1);
    expect(menuButtons[0]!.text()).toBe('Projects');
    expect(menuCurrent.text()).toBe('Current page');
  });

  it('popover menu emits for non-last items and does not emit for current item', async () => {
    const wrapper = factory();

    const menu = wrapper.get('.uikit-breadcrumbs__menu');
    const menuButtons = menu.findAll('button');
    expect(menuButtons.length).toBe(2);

    await menuButtons[1]!.trigger('click');
    expect(wrapper.emitted('on:navigate')?.[0]).toEqual([{ key: 'projects', label: 'Projects' }]);

    expect(wrapper.emitted('on:navigate')?.length).toBe(1);
    expect(menu.find('[aria-current="page"]').text()).toBe('Current page');
  });

  it('does not interpret HTML from breadcrumb labels', () => {
    const label = '<img src=x onerror="alert(1)">Current';
    const wrapper = factory({ items: [{ key: 'current', label }] });

    expect(wrapper.get('.uikit-breadcrumbs__content [aria-current="page"]').text()).toBe(label);
    expect(wrapper.find('img').exists()).toBe(false);
  });
});
