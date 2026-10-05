/** @jsxImportSource react */
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ModalDialog from './index';
import DrawerPanel from '../DrawerPanel/index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe.each([
  ['ModalDialog', ModalDialog, 180, 160],
  ['DrawerPanel', DrawerPanel, 220, 180],
] as const)('%s motion parity', (_name, Component, enterDuration, leaveDuration) => {
  it('animates both directions and cancels a stale close after reopening', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    const finishes: Array<() => void> = [];
    const animate = vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation(
      () =>
        ({
          cancel: vi.fn(),
          finished: new Promise<void>((resolve) => finishes.push(resolve)),
        }) as unknown as Animation,
    );
    const { rerender } = render(
      <Component ariaLabel="Dialog" open header="Visible heading">
        Body
      </Component>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Visible heading');
    expect(animate).toHaveBeenLastCalledWith(
      expect.any(Array),
      expect.objectContaining({ duration: enterDuration }),
    );
    rerender(
      <Component ariaLabel="Dialog" open={false}>
        Body
      </Component>,
    );
    expect(dialog).toHaveAttribute('open');
    expect(animate).toHaveBeenLastCalledWith(
      expect.any(Array),
      expect.objectContaining({ duration: leaveDuration }),
    );
    rerender(
      <Component ariaLabel="Dialog" open>
        Body
      </Component>,
    );
    await act(async () => {
      finishes[1]!();
    });
    expect(dialog).toHaveAttribute('open');
    rerender(
      <Component ariaLabel="Dialog" open={false}>
        Body
      </Component>,
    );
    await act(async () => {
      finishes[3]!();
    });
    expect(dialog).not.toHaveAttribute('open');
  });

  it('closes immediately without animation for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    const animate = vi.spyOn(HTMLElement.prototype, 'animate');
    const { rerender } = render(
      <Component ariaLabel="Dialog" open>
        Body
      </Component>,
    );
    const dialog = screen.getByRole('dialog');
    rerender(
      <Component ariaLabel="Dialog" open={false}>
        Body
      </Component>,
    );
    expect(dialog).not.toHaveAttribute('open');
    expect(animate).not.toHaveBeenCalled();
  });
});
