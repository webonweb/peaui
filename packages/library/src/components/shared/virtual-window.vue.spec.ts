import { effectScope, nextTick, ref } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { useVirtualListWindow } from '../../composables/useVirtualListWindow';
afterEach(() => vi.unstubAllGlobals());
it('recalculates the option window when its viewport resizes and disconnects on disposal', async () => {
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
  const scope = effectScope();
  const window = scope.run(() =>
    useVirtualListWindow({
      items: ref(Array.from({ length: 100 }, (_, i) => i)),
      viewport: ref(viewport),
      activeIndex: ref(0),
      open: ref(true),
      enabled: () => true,
      itemSize: () => 48,
    }),
  )!;
  await nextTick();
  const initialCount = window.visibleOptions.value.length;
  height = 960;
  resize();
  await nextTick();
  expect(window.visibleOptions.value.length).toBeGreaterThan(initialCount);
  scope.stop();
  expect(disconnect).toHaveBeenCalled();
});
it('uses the same capped row height for geometry and rendered styles', () => {
  const scope = effectScope();
  const window = scope.run(() =>
    useVirtualListWindow({
      items: ref([1, 2, 3]),
      viewport: ref(null),
      activeIndex: ref(0),
      open: ref(true),
      enabled: () => true,
      itemSize: () => 5000,
    }),
  )!;
  expect(window.optionStyle.value?.height).toBe('2048px');
  scope.stop();
});
