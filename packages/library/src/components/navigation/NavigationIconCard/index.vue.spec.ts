import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import NavigationIconCard from './index.vue';

const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

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

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    dataTestId: {
      type: String,
      required: false,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('svg', {
        ...attrs,
        'aria-hidden': 'true',
        focusable: 'false',
        'data-icon-name': props.name,
        'data-testid': props.dataTestId,
      });
  },
});

function factory(
  props?: Partial<InstanceType<typeof NavigationIconCard>['$props']>,
  options?: { withRouter?: boolean; attrs?: Record<string, unknown> },
) {
  return mount(NavigationIconCard, {
    props: {
      icon: 'users',
      text: 'Obywatel',
      path: '/citizen',
      ...props,
    } as never,
    attrs: options?.attrs,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
      },
      ...(options?.withRouter
        ? {
            components: {
              RouterLink: RouterLinkStub,
            },
          }
        : {}),
    },
  });
}

afterEach(() => {
  consoleWarnSpy.mockClear();
});

afterAll(() => {
  consoleWarnSpy.mockRestore();
});

describe('NavigationIconCard (index.vue)', () => {
  it('renders RouterLink when available and binds accessible name to visible text', () => {
    const wrapper = factory(
      {
        dataTestId: 'navigation-icon-card',
      },
      { withRouter: true },
    );

    const root = wrapper.get('a[data-router-link="true"]');
    const text = wrapper.get('[data-testid="navigation-icon-card-text"]');
    const icon = wrapper.get('[data-testid="navigation-icon-card-icon"]');

    expect(root.classes()).toContain('uikit-navigation-icon-card');
    expect(root.attributes('data-to')).toBe('/citizen');
    expect(root.attributes('tabindex')).toBe('0');
    expect(root.attributes('href')).toBeUndefined();
    expect(root.attributes('data-testid')).toBe('navigation-icon-card');
    expect(root.attributes('aria-labelledby')).toBe(text.attributes('id'));
    expect(root.attributes('aria-label')).toBeUndefined();
    expect(text.text()).toBe('Obywatel');
    expect(text.element.tagName.toLowerCase()).toBe('strong');
    expect(icon.attributes('data-icon-name')).toBe('users');
    expect(icon.attributes('aria-hidden')).toBe('true');
  });

  it('renders anchor for external urls and preserves target rel attrs', () => {
    const wrapper = factory(
      {
        path: 'https://example.com/citizen',
      },
      {
        withRouter: true,
        attrs: {
          target: '_blank',
        },
      },
    );

    const root = wrapper.get('a');

    expect(root.attributes('href')).toBe('https://example.com/citizen');
    expect(root.attributes('target')).toBe('_blank');
    expect(root.attributes('rel')).toBe('noopener noreferrer');
    expect(root.attributes('aria-describedby')).toMatch(/target-description/);
    expect(root.attributes('data-router-link')).toBeUndefined();
    expect(wrapper.text()).toContain('Link otwiera sie w nowej karcie.');
  });

  it('uses ariaLabel when visible text is empty', () => {
    const wrapper = factory({
      text: '   ',
      ariaLabel: 'Przejdz do karty obywatela',
    });

    const root = wrapper.get('a');

    expect(root.attributes('aria-label')).toBe('Przejdz do karty obywatela');
    expect(root.attributes('aria-labelledby')).toBeUndefined();
  });

  it('derives accessible name from path when text and ariaLabel are missing', () => {
    const wrapper = factory({
      text: '   ',
      path: '/citizen-profile',
      ariaLabel: undefined,
    });

    expect(wrapper.get('a').attributes('aria-label')).toBe('Przejdz do citizen profile');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('renders a disabled non-navigable card when path is empty', () => {
    const wrapper = factory(
      {
        path: '   ',
      },
      {
        withRouter: true,
        attrs: {
          target: '_blank',
        },
      },
    );

    const root = wrapper.get('a');

    expect(root.attributes('data-router-link')).toBeUndefined();
    expect(root.attributes('href')).toBeUndefined();
    expect(root.attributes('target')).toBeUndefined();
    expect(root.attributes('rel')).toBeUndefined();
    expect(root.attributes('aria-disabled')).toBe('true');
    expect(root.attributes('role')).toBe('link');
    expect(root.attributes('tabindex')).toBe('-1');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[NavigationIconCard] Missing path. Rendering a disabled card without navigation.',
    );
  });

  it('forwards attrs and merges custom class on root element', () => {
    const wrapper = factory(undefined, {
      attrs: {
        id: 'citizen-navigation-card',
        class: 'custom-card',
        'data-foo': 'bar',
        'aria-current': 'page',
      },
    });

    const root = wrapper.get('a');

    expect(root.attributes('id')).toBe('citizen-navigation-card');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('aria-current')).toBe('page');
    expect(root.classes()).toContain('uikit-navigation-icon-card');
    expect(root.classes()).toContain('custom-card');
  });
});
