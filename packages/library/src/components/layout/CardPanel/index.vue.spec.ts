import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardPanelComponent from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

describe('CardPanelComponent', () => {
  it('renders default tag <div> and base class', () => {
    const wrapper = mount(CardPanelComponent, {
      slots: {
        default: 'Content',
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('div');
    expect(wrapper.classes()).toContain('peaui-card-panel');
    expect(wrapper.classes()).toContain('peaui-card-panel--size-m');
    expect(wrapper.classes()).toContain('peaui-card-panel--background-default');
    expect(wrapper.classes()).toContain('peaui-card-panel--border-default');
    expect(wrapper.find('.peaui-card-panel__header').exists()).toBe(false);
    expect(wrapper.find('.peaui-card-panel__content').text()).toBe('Content');
  });

  it('applies explicit size modifier class when size prop is provided', () => {
    const wrapper = mount(CardPanelComponent, {
      props: { size: 'l' },
      slots: { default: 'Content' },
    });

    expect(wrapper.classes()).toContain('peaui-card-panel--size-l');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--size-m');
  });

  it('applies explicit background and border modifier classes when props are provided', () => {
    const wrapper = mount(CardPanelComponent, {
      props: {
        backgroundColor: 'grey',
        borderColor: 'primary',
      },
      slots: { default: 'Content' },
    });

    expect(wrapper.classes()).toContain('peaui-card-panel--background-grey');
    expect(wrapper.classes()).toContain('peaui-card-panel--border-primary');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--background-default');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--border-default');
  });

  it('by default: isHoverEnabled=true and isShadowEnabled=false -> hover class is applied', () => {
    const wrapper = mount(CardPanelComponent, {
      slots: { default: 'Content' },
    });

    expect(wrapper.classes()).toContain('peaui-card-panel--hover-enabled');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--shadow-enabled');
  });

  it('when isHoverEnabled=false -> hover class is NOT applied', () => {
    const wrapper = mount(CardPanelComponent, {
      props: { isHoverEnabled: false },
      slots: { default: 'Content' },
    });

    expect(wrapper.classes()).toContain('peaui-card-panel');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--hover-enabled');
  });

  it('when isShadowEnabled=true -> shadow class is applied and hover class is NOT applied', () => {
    const wrapper = mount(CardPanelComponent, {
      props: { isShadowEnabled: true, isHoverEnabled: true },
      slots: { default: 'Content' },
    });

    expect(wrapper.classes()).toContain('peaui-card-panel--shadow-enabled');
    expect(wrapper.classes()).not.toContain('peaui-card-panel--hover-enabled');
  });

  it('passes data-testid attribute when provided', () => {
    const wrapper = mount(CardPanelComponent, {
      props: { dataTestId: 'card-panel' },
      slots: { default: 'Content' },
    });

    expect(wrapper.attributes('data-testid')).toBe('card-panel');
  });

  it('passes aria-label when provided', () => {
    const wrapper = mount(CardPanelComponent, {
      props: { ariaLabel: 'Sekcja filtrów' },
      slots: { default: 'Content' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Sekcja filtrów');
  });

  it("renders correct element when as='section' | 'article'", () => {
    const section = mount(CardPanelComponent, {
      props: { as: 'section' },
      slots: { default: 'Content' },
    });
    expect(section.element.tagName.toLowerCase()).toBe('section');

    const article = mount(CardPanelComponent, {
      props: { as: 'article' },
      slots: { default: 'Content' },
    });
    expect(article.element.tagName.toLowerCase()).toBe('article');
  });

  it('renders optional header slot and adds separated content wrapper when provided', () => {
    const wrapper = mount(CardPanelComponent, {
      slots: {
        header: 'Naglowek panelu',
        default: 'Content',
      },
    });

    expect(wrapper.get('.peaui-card-panel__header').text()).toBe('Naglowek panelu');
    expect(wrapper.classes()).toContain('peaui-card-panel--with-header');
    expect(wrapper.get('.peaui-card-panel__content').classes()).toContain(
      'peaui-card-panel__content--with-header',
    );
    expect(wrapper.get('.peaui-card-panel__content').text()).toBe('Content');
  });
});
