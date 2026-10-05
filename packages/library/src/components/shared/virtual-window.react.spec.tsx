/** @jsxImportSource react */
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useVirtualListWindow } from '../../react/use-virtual-list-window';
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it('recalculates the option window on resize and disconnects on disposal', () => {
  let resize = () => {};
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
  const viewport = document.createElement('ul');
  let height = 96;
  Object.defineProperty(viewport, 'clientHeight', { get: () => height });
  const items = Array.from({ length: 100 }, (_, i) => i);
  const viewportRef = { current: viewport };
  const view = renderHook(() => useVirtualListWindow(items, 0, true, true, 48, viewportRef));
  const initialCount = view.result.current.visibleOptions.length;
  height = 960;
  act(resize);
  expect(view.result.current.visibleOptions.length).toBeGreaterThan(initialCount);
  view.unmount();
  expect(disconnect).toHaveBeenCalled();
});
it('uses the same capped row height for geometry and rendered styles', () => {
  const { result } = renderHook(() => useVirtualListWindow([1, 2, 3], 0, true, true, 5000));
  expect(result.current.optionStyle?.height).toBe(2048);
});
