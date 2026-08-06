import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import NavigationLink from './index.vue';

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
          'data-router-link': 'true',
          'data-to': props.to,
        },
        slots.default?.(),
      );
  },
});

function factory(
  props?: Partial<InstanceType<typeof NavigationLink>['$props']>,
  options?: { withRouter?: boolean },
) {
  return mount(NavigationLink, {
    props: {
      path: '/building',
      ...props,
    } as never,
    slots: {
      default: () => 'Przejdz do budynku',
    },
    global: options?.withRouter
      ? {
          components: {
            RouterLink: RouterLinkStub,
          },
        }
      : undefined,
  });
}

describe('NavigationLink (index.vue)', () => {
  it('renders anchor with default variant, size and data-testid bindings', () => {
    const wrapper = factory({
      dataTestId: 'navigation-link',
    });

    const root = wrapper.get('a');

    expect(root.classes()).toContain('uikit-navigation-link');
    expect(root.classes()).toContain('uikit-navigation-link--size-s');
    expect(root.classes()).toContain('uikit-navigation-link--variant-default');
    expect(root.attributes('href')).toBe('/building');
    expect(root.attributes('data-testid')).toBe('navigation-link');
    expect(root.attributes('aria-label')).toBeUndefined();
  });

  it('renders RouterLink for internal paths when RouterLink component is available', () => {
    const wrapper = factory(
      {
        path: '/results/details',
        variant: 'primary',
        size: 'm',
      },
      { withRouter: true },
    );

    const root = wrapper.get('a[data-router-link="true"]');

    expect(root.attributes('data-to')).toBe('/results/details');
    expect(root.attributes('href')).toBeUndefined();
    expect(root.classes()).toContain('uikit-navigation-link--size-m');
    expect(root.classes()).toContain('uikit-navigation-link--variant-primary');
  });

  it('renders anchor for hash links even when RouterLink is available', () => {
    const wrapper = factory(
      {
        path: '#summary',
      },
      { withRouter: true },
    );

    const root = wrapper.get('a');

    expect(root.attributes('href')).toBe('#summary');
    expect(root.attributes('data-router-link')).toBeUndefined();
  });

  it('renders anchor for absolute urls and preserves external target attrs', () => {
    const wrapper = mount(NavigationLink, {
      props: {
        path: 'https://example.com/docs',
      } as never,
      attrs: {
        target: '_blank',
      },
      slots: {
        default: () => 'Dokumentacja',
      },
      global: {
        components: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const root = wrapper.get('a');

    expect(root.attributes('href')).toBe('https://example.com/docs');
    expect(root.attributes('target')).toBe('_blank');
    expect(root.attributes('rel')).toBe('noopener noreferrer');
    expect(root.attributes('data-router-link')).toBeUndefined();
  });

  it('keeps explicit rel when target blank is provided', () => {
    const wrapper = mount(NavigationLink, {
      props: {
        path: 'https://example.com/docs',
      } as never,
      attrs: {
        target: '_blank',
        rel: 'external',
      },
      slots: {
        default: () => 'Dokumentacja',
      },
    });

    expect(wrapper.get('a').attributes('rel')).toBe('external');
  });

  it('uses ariaLabel when slot does not expose visible text', () => {
    const wrapper = mount(NavigationLink, {
      props: {
        path: '/icon-only',
        ariaLabel: 'Przejdz do sekcji ikonowej',
      } as never,
      slots: {
        default: () => h('svg', { 'aria-hidden': 'true' }),
      },
    });

    expect(wrapper.get('a').attributes('aria-label')).toBe('Przejdz do sekcji ikonowej');
  });

  it('falls back to generic accessible name when slot text and ariaLabel are missing', () => {
    const wrapper = mount(NavigationLink, {
      props: {
        path: '/icon-only',
      } as never,
      slots: {
        default: () => h('svg', { 'aria-hidden': 'true' }),
      },
    });

    expect(wrapper.get('a').attributes('aria-label')).toBe('Link nawigacyjny');
  });

  it('forwards attrs and merges custom class on root element', () => {
    const wrapper = mount(NavigationLink, {
      props: {
        path: '/building',
      } as never,
      attrs: {
        id: 'main-navigation-link',
        class: 'custom-link',
        'data-foo': 'bar',
        'aria-current': 'page',
      },
      slots: {
        default: () => 'Przejdz do budynku',
      },
    });

    const root = wrapper.get('a');

    expect(root.attributes('id')).toBe('main-navigation-link');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('aria-current')).toBe('page');
    expect(root.classes()).toContain('uikit-navigation-link');
    expect(root.classes()).toContain('custom-link');
  });
});
