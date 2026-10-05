import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ModalDialog from './index.vue';
import DrawerPanel from '../DrawerPanel/index.vue';

afterEach(() => vi.restoreAllMocks());

describe.each([
  ['ModalDialog', ModalDialog],
  ['DrawerPanel', DrawerPanel],
] as const)('%s interrupted motion', (_name, Component) => {
  it('does not close a reopened dialog when the previous leave finishes', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    const finishes: Array<() => void> = [];
    vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation(
      () =>
        ({
          cancel: vi.fn(),
          finished: new Promise<void>((resolve) => finishes.push(resolve)),
        }) as unknown as Animation,
    );
    const wrapper = mount(Component, { props: { ariaLabel: 'Dialog', open: true } });
    await flushPromises();
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    finishes[1]!();
    await flushPromises();
    expect(wrapper.get('dialog').element.open).toBe(true);
    wrapper.unmount();
  });
});
