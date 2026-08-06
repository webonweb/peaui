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

const InfoTooltipStub = defineComponent({
  name: 'InfoTooltip',
  props: {
    placement: String,
    dataTestId: String,
  },
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-tooltip-placement': props.placement }, [
        h('div', { 'data-testid': 'tooltip-trigger' }, slots.default?.()),
        slots.description
          ? h('p', { 'data-testid': 'tooltip-description' }, slots.description())
          : null,
      ]);
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      title: 'Example',
      description: 'Navigation card description',
      ...props,
    } as any,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
        InfoTooltip: InfoTooltipStub,
      },
    },
  });
}

describe('NavigationCard (index.vue)', () => {
  it('renders an interactive anchor with proper ids, aria and default test id', () => {
    const wrapper = factory({ path: '/example' });

    const root = wrapper.get('a');
    const heading = wrapper.get('h4');
    const description = wrapper.get('p');

    expect(root.classes()).toContain('uikit-navigation-card');
    expect(root.classes()).toContain('uikit-navigation-card--interactive');
    expect(root.attributes('href')).toBe('/example');
    expect(root.attributes('data-testid')).toBe('navigation-tile-example');
    expect(root.attributes('aria-labelledby')).toBe(heading.attributes('id'));
    expect(root.attributes('aria-describedby')).toBe(description.attributes('id'));
    expect(root.attributes('aria-disabled')).toBeUndefined();
    expect(heading.classes()).toContain('uikit-navigation-card__title--size-s');
  });

  it('uses visible title as accessible name even when ariaLabel is provided', () => {
    const wrapper = factory({
      path: '/details',
      dataTestId: 'navigation-card',
      ariaLabel: 'Open card details',
    });

    const root = wrapper.get('a');
    const heading = wrapper.get('h4');

    expect(root.attributes('data-testid')).toBe('navigation-card');
    expect(root.attributes('aria-label')).toBeUndefined();
    expect(root.attributes('aria-labelledby')).toBe(heading.attributes('id'));
    expect(wrapper.get('[data-testid="navigation-card-title"]').text()).toBe('Example');
    expect(wrapper.get('[data-testid="navigation-card-description"]').text()).toBe(
      'Navigation card description',
    );
  });

  it('renders article with aria-disabled and lock icon for disabled variant', () => {
    const wrapper = factory({
      path: '/disabled',
      variant: 'disabled',
      size: 'l',
    });

    const root = wrapper.get('article');
    const heading = wrapper.get('h4');

    expect(root.classes()).toContain('uikit-navigation-card--variant-disabled');
    expect(root.attributes('aria-disabled')).toBe('true');
    expect(wrapper.find('a').exists()).toBe(false);
    expect(heading.classes()).toContain('uikit-navigation-card__title--size-l');
    expect(heading.classes()).toContain('uikit-navigation-card__title--locked');
    expect(wrapperIconName(wrapper)).toBe('lock');
  });

  it('applies title size classes for medium and large sizes', () => {
    const mediumWrapper = factory({ path: '/medium', size: 'm' });
    const largeWrapper = factory({ path: '/large', size: 'l' });

    expect(mediumWrapper.get('h4').classes()).toContain('uikit-navigation-card__title--size-m');
    expect(largeWrapper.get('h4').classes()).toContain('uikit-navigation-card__title--size-l');
  });

  it('renders tooltip description only for locked variants', () => {
    const disabledWrapper = factory({ variant: 'hidden' });
    expect(disabledWrapper.get('[data-testid="tooltip-description"]').text()).toContain(
      'Krok niedostepny',
    );

    const activeWrapper = factory({ path: '/active' });
    expect(activeWrapper.find('[data-testid="tooltip-description"]').exists()).toBe(false);
  });

  it('uses arrow icon for default and during variants and success icon for complete', () => {
    const defaultWrapper = factory({ path: '/default' });
    const duringWrapper = factory({ path: '/during', variant: 'during' });
    const completeWrapper = factory({ path: '/complete', variant: 'complete' });

    expect(wrapperIconName(defaultWrapper)).toBe('arrow');
    expect(wrapperIconName(duringWrapper)).toBe('arrow');
    expect(wrapperIconName(completeWrapper)).toBe('progressFinish');
  });

  it('renders article when path is missing even for active variants', () => {
    const wrapper = factory({ variant: 'default' });

    expect(wrapper.find('article').exists()).toBe(true);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.get('article').classes()).toContain('uikit-navigation-card--static');
  });
});

function wrapperIconName(wrapper: ReturnType<typeof factory>) {
  return wrapper.get('[data-icon-name]').attributes('data-icon-name');
}
