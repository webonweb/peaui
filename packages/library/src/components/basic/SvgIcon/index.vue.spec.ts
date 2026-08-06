import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...actual,
    defineAsyncComponent: vi.fn(() =>
      actual.defineComponent({
        name: 'AsyncIconStub',
        template: '<svg />',
      }),
    ),
  };
});

import SvgIcon from './index.vue';
import * as vueModule from 'vue';

describe('SvgIcon (index.vue)', () => {
  it('renders async icon root with decorative defaults and base class', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        name: 'cross',
        dataTestId: 'svg-icon',
      },
    });

    const icon = wrapper.get('svg');

    expect(icon.attributes('data-testid')).toBe('svg-icon');
    expect(icon.attributes('id')).toBeTruthy();
    expect(icon.attributes('aria-hidden')).toBe('true');
    expect(icon.attributes('focusable')).toBe('false');
    expect(icon.classes()).toContain('peaui-svg-icon');
  });

  it('allows explicit accessibility attrs to override decorative defaults', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        name: 'cross',
      },
      attrs: {
        'aria-hidden': 'false',
        focusable: 'true',
        role: 'img',
      },
    });

    const icon = wrapper.get('svg');

    expect(icon.attributes('aria-hidden')).toBe('false');
    expect(icon.attributes('focusable')).toBe('true');
    expect(icon.attributes('role')).toBe('img');
  });

  it('recomputes icon component when name prop changes', async () => {
    const defineAsyncComponentMock = vi.mocked(vueModule.defineAsyncComponent);
    defineAsyncComponentMock.mockClear();

    const wrapper = mount(SvgIcon, {
      props: {
        name: 'lock-open',
      },
    });

    expect(defineAsyncComponentMock).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      name: 'lock-closed',
    });
    await nextTick();

    expect(defineAsyncComponentMock).toHaveBeenCalledTimes(2);
  });
});
