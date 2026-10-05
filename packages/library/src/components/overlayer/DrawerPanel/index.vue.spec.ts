import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

function patchDialogInstance(dialog: HTMLDialogElement) {
  Object.defineProperty(dialog, 'showModal', {
    value: vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    }),
    configurable: true,
  });
  Object.defineProperty(dialog, 'close', {
    value: vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
    }),
    configurable: true,
  });
  return dialog;
}

describe('DrawerPanel (index.vue)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    HTMLElement.prototype.animate = vi.fn(() => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
      play: vi.fn(),
    })) as unknown as typeof HTMLElement.prototype.animate;

    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders during SSR without a window global', async () => {
    const clientWindow = globalThis.window;

    try {
      vi.stubGlobal('window', undefined);
      const html = await renderToString(
        createSSRApp(Component, { ariaLabel: 'Drawer', open: false }),
      );

      expect(html).toContain('<dialog');
      expect(html).toContain('aria-label="Drawer"');
    } finally {
      vi.stubGlobal('window', clientWindow);
    }
  });

  it('opens when open changes to true (without dialog.showModal crash)', async () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Drawer', open: false },
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
      props: { ariaLabel: 'Drawer techniczny', open: false, dataTestId: 'drawer-panel' },
      slots: {
        header: 'Szczegoly rekordu',
        default: 'content',
      },
    });

    const dialog = wrapper.get('dialog');
    const header = wrapper.get('[data-testid="drawer-panel-header"]');

    expect(dialog.attributes('aria-labelledby')).toBe(header.attributes('id'));
    expect(dialog.attributes('aria-label')).toBeUndefined();
    expect(header.text()).toBe('Szczegoly rekordu');
  });

  it('falls back to aria-label when header slot is not provided', () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Drawer', open: false },
      slots: { default: 'content' },
    });

    const dialog = wrapper.get('dialog');

    expect(dialog.attributes('aria-label')).toBe('Drawer');
    expect(dialog.attributes('aria-labelledby')).toBeUndefined();
  });

  it('closes when open changes to false (calls close after animation)', async () => {
    const wrapper = mount(Component, {
      props: { ariaLabel: 'Drawer', open: false },
      slots: { default: 'content' },
    });

    const dialog = patchDialogInstance(wrapper.get('dialog').element as HTMLDialogElement);

    await wrapper.setProps({ open: true });
    await nextTick();

    await wrapper.setProps({ open: false });
    await nextTick();

    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
  });
});
