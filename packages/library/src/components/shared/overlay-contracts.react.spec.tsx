/** @jsxImportSource react */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FullscreenContainer from '../layout/FullscreenContainer';
import PopoverButton from '../overlayer/PopoverButton';
import FormSelect from '../form/FormSelect';
import FormMultiSelect from '../form/FormMultiSelect';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe('regressions: React overlays', () => {
  it.each([FormSelect, FormMultiSelect])(
    'opens a select above a trigger at the viewport bottom',
    (Component) => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
        () => ({ width: 240, top: window.innerHeight - 48, bottom: window.innerHeight }) as DOMRect,
      );
      const { getByRole, container } = render(
        <Component
          id="bottom-select"
          name="choice"
          label="Choice"
          options={[{ label: 'Alpha', value: 'a' }]}
        />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expect(
        container
          .querySelector('.peaui-popover-overlayer__content')
          ?.classList.contains('peaui-popover-overlayer__content--placement-top'),
      ).toBe(true);
    },
  );
  it('measures the popover trigger again on resize and releases its observer', () => {
    let resize: () => void = () => undefined;
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    let width = 180;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ width }) as DOMRect,
    );
    const { container, unmount } = render(
      <PopoverButton matchTriggerWidth content="Content">
        Trigger
      </PopoverButton>,
    );
    const popup = container.querySelector<HTMLElement>('.peaui-popover-button__content')!;
    expect(popup.style.getPropertyValue('--peaui-popover-button-trigger-width')).toBe('180px');
    width = 240;
    act(() => resize());
    expect(popup.style.getPropertyValue('--peaui-popover-button-trigger-width')).toBe('240px');
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
  it('expands within the page, uses supplied labels, restores focus and shares scroll locks', () => {
    const { getAllByRole, container } = render(
      <>
        <FullscreenContainer openLabel="Expand" closeLabel="Collapse">
          One
        </FullscreenContainer>
        <FullscreenContainer openLabel="Expand" closeLabel="Collapse">
          Two
        </FullscreenContainer>
      </>,
    );
    const [first, second] = getAllByRole('button');
    fireEvent.click(first!);
    fireEvent.click(second!);
    expect(container.querySelectorAll('.peaui-fullscreen-container--fullscreen')).toHaveLength(2);
    expect(first?.textContent).toContain('Collapse');
    expect(document.body.classList.contains('peaui-fullscreen-container--scroll-hidden')).toBe(
      true,
    );
    fireEvent.keyDown(first!, { key: 'Escape' });
    expect(document.activeElement).toBe(first);
    expect(document.body.classList.contains('peaui-fullscreen-container--scroll-hidden')).toBe(
      true,
    );
    fireEvent.keyDown(second!, { key: 'Escape' });
    expect(document.body.classList.contains('peaui-fullscreen-container--scroll-hidden')).toBe(
      false,
    );
  });
});
