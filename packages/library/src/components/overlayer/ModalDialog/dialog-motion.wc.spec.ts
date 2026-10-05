import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModalDialogElement } from './index.wc';
import { DrawerPanelElement } from '../DrawerPanel/index.wc';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe.each([
  ['ModalDialog', ModalDialogElement],
  ['DrawerPanel', DrawerPanelElement],
] as const)('%s custom element interrupted motion', (_name, Constructor) => {
  it('keeps the reopened dialog visible after the old animation completes', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    const finishes: Array<() => void> = [];
    vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation(
      () =>
        ({
          cancel: vi.fn(),
          finished: new Promise<void>((resolve) => finishes.push(resolve)),
        }) as unknown as Animation,
    );
    const element = new Constructor();
    element.ariaLabel = 'Dialog';
    element.open = true;
    document.body.append(element);
    await nextTick();
    await nextTick();
    element.open = false;
    await nextTick();
    await nextTick();
    element.open = true;
    await nextTick();
    await nextTick();
    finishes[1]!();
    await nextTick();
    await nextTick();
    expect(element.querySelector('dialog')?.open).toBe(true);
  });
});
