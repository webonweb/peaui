import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

function patchDialogInstance(dialog: HTMLDialogElement) {
  Object.defineProperty(dialog, 'showModal', {
    value: vi.fn(function (this: any) {
      this.open = true;
    }),
    configurable: true,
  });
  Object.defineProperty(dialog, 'close', {
    value: vi.fn(function (this: any) {
      this.open = false;
    }),
    configurable: true,
  });
  return dialog as any;
}

describe('ModalDialog (index.vue)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // JSDOM: no animate -> mock
    HTMLElement.prototype.animate = vi.fn(() => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
      play: vi.fn(),
    })) as any;

    // matchMedia if your component reads prefers-reduced-motion
    vi.stubGlobal(
      'matchMedia',
      () =>
        ({
          matches: true,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as any,
    );
  });

  it('opens when open changes to true (without dialog.showModal crash)', async () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Modal', open: false },
      slots: { default: 'content' },
    });

    const dialog = patchDialogInstance(wrapper.get('dialog').element as HTMLDialogElement);

    await wrapper.setProps({ open: true });
    await nextTick();

    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(true);
  });

  it('uses header slot as accessible name source when provided', () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Modal techniczny', open: false, dataTestId: 'modal-dialog' },
      slots: {
        header: 'Potwierdzenie eksportu',
        default: 'content',
      },
    });

    const dialog = wrapper.get('dialog');
    const header = wrapper.get('[data-testid="modal-dialog-header"]');

    expect(dialog.attributes('aria-labelledby')).toBe(header.attributes('id'));
    expect(dialog.attributes('aria-label')).toBeUndefined();
    expect(header.text()).toBe('Potwierdzenie eksportu');
  });

  it('falls back to aria-label when header slot is not provided', () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Modal', open: false },
      slots: { default: 'content' },
    });

    const dialog = wrapper.get('dialog');

    expect(dialog.attributes('aria-label')).toBe('Modal');
    expect(dialog.attributes('aria-labelledby')).toBeUndefined();
  });

  it('closes when open changes to false (calls close after animation)', async () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Modal', open: false },
      slots: { default: 'content' },
    });

    const dialog = patchDialogInstance(wrapper.get('dialog').element as HTMLDialogElement);

    // open first
    await wrapper.setProps({ open: true });
    await nextTick();

    // then close
    await wrapper.setProps({ open: false });
    await nextTick();

    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
  });
});
