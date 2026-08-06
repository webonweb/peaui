import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => h('svg', { ...attrs, 'data-icon-name': props.name });
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

function factory(
  props?: Partial<InstanceType<typeof Component>['$props']>,
  options?: { withRouterLink?: boolean },
) {
  return mount(Component, {
    props: {
      id: 'sekcja-glowna',
      title: 'Sekcja glowna',
      description: 'Opis sekcji',
      dataTestId: 'navigation-disclosure-card',
      ...props,
    } as any,
    slots: {
      default: () => h('div', 'Zawartosc komponentu'),
      'description-additional': () => h('span', 'Dodatkowe info'),
    },
    global: {
      components: options?.withRouterLink ? { RouterLink: RouterLinkStub } : undefined,
      stubs: {
        SvgIcon: SvgIconStub,
      },
    },
  });
}

describe('NavigationDisclosureCard (index.vue)', () => {
  it('renders disclosure variant with BEM classes, dataTestId and aria bindings', async () => {
    const wrapper = factory();

    const root = wrapper.get('details');
    const summary = wrapper.get('summary');

    expect(root.classes()).toContain('uikit-navigation-disclosure-card');
    expect(root.classes()).toContain('uikit-navigation-disclosure-card--disclosure');
    expect(root.attributes('data-testid')).toBe('navigation-disclosure-card');
    expect(summary.classes()).toContain('uikit-navigation-disclosure-card__summary');
    expect(summary.attributes('data-testid')).toBe('navigation-disclosure-card-summary');
    expect(summary.attributes('aria-expanded')).toBe('false');
    expect(summary.attributes('aria-controls')).toBeUndefined();
    expect(wrapper.find('[role="region"]').exists()).toBe(false);

    await summary.trigger('click');

    const content = wrapper.get('[role="region"]');

    expect(root.classes()).toContain('uikit-navigation-disclosure-card--open');
    expect(summary.attributes('aria-expanded')).toBe('true');
    expect(summary.attributes('aria-controls')).toBe(content.attributes('id'));
    expect(content.attributes('data-testid')).toBe('navigation-disclosure-card-content');
    expect(content.attributes('aria-labelledby')).toBe(
      wrapper.get('[data-testid="navigation-disclosure-card-title"]').attributes('id'),
    );
  });

  it('uses RouterLink in link variant and keeps visible title as accessible name', () => {
    const wrapper = factory(
      {
        path: '/sekcja-glowna',
        ariaLabel: 'Przejdz do sekcji glownej',
      },
      { withRouterLink: true },
    );

    const root = wrapper.get('[data-testid="navigation-disclosure-card"]');
    const summary = wrapper.get('a');
    const title = wrapper.get('[data-testid="navigation-disclosure-card-title"]');
    const description = wrapper.get('[data-testid="navigation-disclosure-card-description"]');

    expect(root.element.tagName).toBe('DIV');
    expect(root.classes()).toContain('uikit-navigation-disclosure-card--link');
    expect(summary.attributes('data-router-link')).toBe('true');
    expect(summary.attributes('aria-label')).toBeUndefined();
    expect(summary.attributes('aria-labelledby')).toBe(title.attributes('id'));
    expect(summary.attributes('aria-describedby')).toBe(description.attributes('id'));
    expect(summary.attributes('aria-controls')).toBeUndefined();
    expect(summary.attributes('aria-expanded')).toBeUndefined();
  });

  it('falls back to native anchor when router is unavailable', () => {
    const wrapper = factory({
      path: '/sekcja-glowna',
    });

    expect(wrapper.get('a').attributes('data-router-link')).toBeUndefined();
  });

  it('does not prevent default click on link variant', () => {
    const wrapper = factory(
      {
        path: '/sekcja-glowna',
      },
      { withRouterLink: true },
    );

    const link = wrapper.get('a').element;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    });

    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('renders content in link variant when open prop is true', () => {
    const wrapper = factory({
      path: '/sekcja-glowna',
      open: true,
    });

    expect(wrapper.get('[data-testid="navigation-disclosure-card-content"]').text()).toContain(
      'Zawartosc komponentu',
    );
    expect(
      wrapper.get('[data-testid="navigation-disclosure-card-action"]').attributes('aria-hidden'),
    ).toBe('true');
  });
});
