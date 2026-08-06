import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import FullscreenContainerComponent from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const SvgIconStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => h('svg', { 'data-testid': props.dataTestId, 'data-icon-name': props.name });
  },
});

describe('FullscreenContainerComponent', () => {
  it('renders slot content, root test id and default toggle label with expand icon', () => {
    const wrapper = mount(FullscreenContainerComponent, {
      props: {
        ariaLabel: 'Kontener testowy',
        dataTestId: 'fullscreen-container',
      },
      slots: {
        default: '<div data-testid="slot-content">Zawartosc</div>',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="fullscreen-container"]').classes()).toContain(
      'peaui-fullscreen-container',
    );
    expect(wrapper.get('[data-testid="fullscreen-container"]').attributes('aria-label')).toBe(
      'Kontener testowy',
    );
    expect(wrapper.get('[data-testid="slot-content"]').text()).toBe('Zawartosc');
    expect(wrapper.get('[data-testid="fullscreen-container-toggle"]').text()).toBe(
      'Otwórz tryb pełnoekranowy',
    );
    expect(
      wrapper.get('[data-testid="fullscreen-container-toggle"]').attributes('aria-label'),
    ).toBe('Otwórz tryb pełnoekranowy');
    expect(
      wrapper.get('[data-testid="fullscreen-container-icon"]').attributes('data-icon-name'),
    ).toBe('expandArrows');
  });

  it('toggles fullscreen modifier, aria-pressed and restores document overflow after close', async () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'clip';

    const wrapper = mount(FullscreenContainerComponent, {
      props: {
        dataTestId: 'fullscreen-container',
      },
      slots: {
        default: 'Zawartosc',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    const root = wrapper.get('[data-testid="fullscreen-container"]');
    const toggle = wrapper.get('[data-testid="fullscreen-container-toggle"]');

    expect(root.classes()).not.toContain('peaui-fullscreen-container--fullscreen');
    expect(toggle.attributes('aria-pressed')).toBe('false');

    await toggle.trigger('click');

    expect(root.classes()).toContain('peaui-fullscreen-container--fullscreen');
    expect(toggle.attributes('aria-pressed')).toBe('true');
    expect(toggle.text()).toBe('Zamknij tryb pełnoekranowy');
    expect(toggle.attributes('aria-label')).toBe('Zamknij tryb pełnoekranowy');
    expect(
      wrapper.get('[data-testid="fullscreen-container-icon"]').attributes('data-icon-name'),
    ).toBe('compressArrows');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    await toggle.trigger('click');

    expect(root.classes()).not.toContain('peaui-fullscreen-container--fullscreen');
    expect(toggle.attributes('aria-pressed')).toBe('false');
    expect(toggle.text()).toBe('Otwórz tryb pełnoekranowy');
    expect(toggle.attributes('aria-label')).toBe('Otwórz tryb pełnoekranowy');
    expect(
      wrapper.get('[data-testid="fullscreen-container-icon"]').attributes('data-icon-name'),
    ).toBe('expandArrows');
    expect(document.body.style.overflow).toBe('auto');
    expect(document.documentElement.style.overflow).toBe('clip');
  });

  it('restores document overflow on unmount when component is still fullscreen', async () => {
    document.body.style.overflow = 'scroll';
    document.documentElement.style.overflow = 'visible';

    const wrapper = mount(FullscreenContainerComponent, {
      props: {
        dataTestId: 'fullscreen-container',
      },
      slots: {
        default: 'Zawartosc',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    await wrapper.get('[data-testid="fullscreen-container-toggle"]').trigger('click');

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    wrapper.unmount();

    expect(document.body.style.overflow).toBe('scroll');
    expect(document.documentElement.style.overflow).toBe('visible');
  });

  it('passes arbitrary attrs to the root element', () => {
    const wrapper = mount(FullscreenContainerComponent, {
      props: {
        dataTestId: 'fullscreen-container',
      },
      attrs: {
        id: 'fullscreen-root',
        tabindex: '0',
      },
      slots: {
        default: 'Zawartosc',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    const root = wrapper.get('[data-testid="fullscreen-container"]');

    expect(root.attributes('id')).toBe('fullscreen-root');
    expect(root.attributes('tabindex')).toBe('0');
  });
});
