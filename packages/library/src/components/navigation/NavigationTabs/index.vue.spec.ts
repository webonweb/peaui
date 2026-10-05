import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

type Tab = {
  key: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  isValid?: boolean;
};

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      ariaLabel: 'Navigation tabs',
      tabs: [],
      ...props,
    },
  });
}

describe('NavigationTabs (index.vue)', () => {
  let focusSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    focusSpy = vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => {});
  });

  afterEach(() => {
    focusSpy.mockRestore();
  });

  it('renders a navigation <nav> with aria-label and default class', () => {
    const wrapper = factory({
      ariaLabel: 'Main tabs',
      tabs: [{ key: 'a', label: 'A', active: true }],
    });

    const nav = wrapper.get('nav');
    expect(nav.attributes('role')).toBeUndefined();
    expect(nav.attributes('aria-orientation')).toBeUndefined();
    expect(nav.attributes('aria-label')).toBe('Main tabs');
    expect(nav.classes()).toContain('uikit-navigation-tabs');
    expect(nav.classes()).not.toContain('uikit-navigation-tabs--without-background');
  });

  it('adds modifier class when withBackround=false', () => {
    const wrapper = factory({
      withBackround: false,
      tabs: [{ key: 'a', label: 'A', active: true }],
    });

    expect(wrapper.get('nav').classes()).toContain('uikit-navigation-tabs--without-background');
  });

  it('renders tabs as buttons with correct ARIA and disabled state', () => {
    const tabs: Tab[] = [
      { key: 'one', label: 'One', active: true },
      { key: 'two', label: 'Two', disabled: true },
      { key: 'three', label: 'Three' },
    ];

    const wrapper = factory({ tabs });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
    const firstButton = buttons[0]!;
    const secondButton = buttons[1]!;
    const thirdButton = buttons[2]!;

    expect(firstButton.attributes('id')).toMatch(/^navigation-tabs-one-/);
    expect(firstButton.attributes('aria-pressed')).toBe('true');
    expect(firstButton.attributes('aria-label')).toBe('One');
    expect(firstButton.classes()).toContain('uikit-navigation-tabs__button--active');

    expect(secondButton.attributes('disabled')).toBeDefined();
    expect(secondButton.classes()).toContain('uikit-navigation-tabs__button--disabled');
    expect(secondButton.attributes('aria-pressed')).toBe('false');

    expect(thirdButton.attributes('aria-pressed')).toBe('false');
  });

  it('adds invalid class when tab is marked as not valid', () => {
    const wrapper = factory({
      tabs: [
        { key: 'one', label: 'One', active: true, isValid: false },
        { key: 'two', label: 'Two', isValid: true },
        { key: 'three', label: 'Three' },
      ],
    });

    const buttons = wrapper.findAll('button');
    const invalidButton = buttons[0]!;
    const validButton = buttons[1]!;
    const defaultButton = buttons[2]!;

    expect(invalidButton.classes()).toContain('uikit-navigation-tabs__button--invalid');
    expect(invalidButton.classes()).toContain('uikit-navigation-tabs__button--active');
    expect(validButton.classes()).not.toContain('uikit-navigation-tabs__button--invalid');
    expect(defaultButton.classes()).not.toContain('uikit-navigation-tabs__button--invalid');
  });

  it('adds data-testid attributes when dataTestId is provided', () => {
    const wrapper = factory({
      dataTestId: 'tabs',
      tabs: [
        { key: 'a', label: 'Alpha', active: true },
        { key: 'b', label: 'Beta' },
      ],
    });

    expect(wrapper.find('nav[data-testid="tabs"]').exists()).toBe(true);

    expect(wrapper.find('button[data-testid="tabs-button-a"]').exists()).toBe(true);
    expect(wrapper.find('button[data-testid="tabs-button-b"]').exists()).toBe(true);

    expect(wrapper.get('[data-testid="tabs-content-a"]').text()).toBe('Alpha');
    expect(wrapper.get('[data-testid="tabs-content-b"]').text()).toBe('Beta');
  });

  it('does not set button/content data-testid when dataTestId is not provided', () => {
    const wrapper = factory({
      tabs: [{ key: 'a', label: 'Alpha', active: true }],
    });

    const nav = wrapper.get('nav');
    expect(nav.attributes('data-testid')).toBeUndefined();

    const btn = wrapper.get('button');
    expect(btn.attributes('data-testid')).toBeUndefined();

    const span = wrapper.get('button span');
    expect(span.attributes('data-testid')).toBeUndefined();
  });

  it("emits 'on:select' with the tab object when a tab is clicked", async () => {
    const tabs: Tab[] = [
      { key: 'a', label: 'Alpha', active: true },
      { key: 'b', label: 'Beta' },
    ];

    const wrapper = factory({ tabs });
    const buttons = wrapper.findAll('button');

    await buttons[1]!.trigger('click');

    const emitted = wrapper.emitted('on:select');
    expect(emitted).toBeTruthy();
    expect(emitted!.length).toBe(1);
    expect(emitted![0]).toEqual([tabs[1]]);
  });

  it('renders before/after slots for each tab', () => {
    const wrapper = mount(Component, {
      props: {
        ariaLabel: 'Tabs',
        tabs: [{ key: 'a', label: 'Alpha', active: true }],
      },
      slots: {
        'navigation-tabs-a-before': '<span data-testid="before">B</span>',
        'navigation-tabs-a-after': '<span data-testid="after">A</span>',
      },
    });

    expect(wrapper.get('[data-testid="before"]').text()).toBe('B');
    expect(wrapper.get('[data-testid="after"]').text()).toBe('A');
  });

  it('keyboard: ignores unrelated keys (no focus calls)', async () => {
    const wrapper = factory({
      tabs: [
        { key: 'a', label: 'A', active: true },
        { key: 'b', label: 'B' },
      ],
    });

    const btn = wrapper.get('button');

    await btn.trigger('keydown', { key: 'Enter' });
    await btn.trigger('keydown', { key: ' ' });
    await btn.trigger('keydown', { key: 'Escape' });

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('keyboard: does nothing when all tabs are disabled', async () => {
    const wrapper = factory({
      tabs: [
        { key: 'a', label: 'A', disabled: true },
        { key: 'b', label: 'B', disabled: true },
      ],
    });

    const btns = wrapper.findAll('button');
    await btns[0]!.trigger('keydown', { key: 'ArrowRight' });

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('keyboard: moves focus between enabled buttons and skips disabled tabs', async () => {
    const wrapper = factory({
      tabs: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B', disabled: true },
        { key: 'c', label: 'C', active: true },
      ],
    });

    const btns = wrapper.findAll('button');
    const getElementByIdSpy = vi
      .spyOn(document, 'getElementById')
      .mockReturnValue(btns[0]!.element as HTMLElement);

    await btns[2]!.trigger('keydown', { key: 'ArrowLeft' });

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(getElementByIdSpy).toHaveBeenCalledWith(btns[0]!.attributes('id'));
  });

  it('generates unique button ids for multiple component instances', () => {
    const wrapper = mount({
      components: {
        NavigationTabs: Component,
      },
      template: `
        <div>
          <NavigationTabs aria-label="First tabs" :tabs="tabs" />
          <NavigationTabs aria-label="Second tabs" :tabs="tabs" />
        </div>
      `,
      data() {
        return {
          tabs: [
            { key: 'a', label: 'A', active: true },
            { key: 'b', label: 'B' },
          ],
        };
      },
    });

    const firstInstanceButtons = wrapper.findAll('nav').at(0)!.findAll('button');
    const secondInstanceButtons = wrapper.findAll('nav').at(1)!.findAll('button');

    expect(firstInstanceButtons[0]!.attributes('id')).not.toBe(
      secondInstanceButtons[0]!.attributes('id'),
    );
    expect(firstInstanceButtons[1]!.attributes('id')).not.toBe(
      secondInstanceButtons[1]!.attributes('id'),
    );
  });
});
