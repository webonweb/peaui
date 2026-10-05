import { computed, nextTick, ref, watch, type Ref } from 'vue';
import {
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  normalizeVirtualListItemSize,
} from '@/components/data-display/VirtualList/virtual-list.shared';

/** Fixed-size option windows reuse the same range calculation as VirtualList. */
export function useVirtualListWindow<T>(settings: {
  items: Readonly<Ref<readonly T[]>>;
  viewport: Readonly<Ref<HTMLElement | null | undefined>>;
  activeIndex: Readonly<Ref<number>>;
  enabled: () => boolean;
  itemSize: () => number;
  open: Readonly<Ref<boolean>>;
}) {
  const offset = ref(0);
  const itemSize = computed(() =>
    normalizeVirtualListItemSize(
      Number.isFinite(settings.itemSize()) ? Math.max(24, settings.itemSize()) : 48,
    ),
  );
  const viewportSize = ref(240);
  watch(
    [settings.viewport, settings.open, settings.enabled],
    ([viewport, open, enabled], _previous, onCleanup) => {
      if (!viewport || !open || !enabled) return;
      const measure = () => {
        viewportSize.value = viewport.clientHeight || 240;
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(viewport);
      onCleanup(() => observer.disconnect());
    },
    { immediate: true, flush: 'post' },
  );
  const range = computed(() =>
    settings.enabled()
      ? calculateVirtualListRange({
          itemCount: settings.items.value.length,
          itemSize: itemSize.value,
          overscan: 3,
          scrollOffset: offset.value,
          viewportSize: viewportSize.value,
        })
      : { startIndex: 0, endIndex: settings.items.value.length - 1 },
  );
  const visibleOptions = computed(() =>
    settings.open.value
      ? settings.items.value
          .slice(range.value.startIndex, range.value.endIndex + 1)
          .map((item, index) => ({ item, index: index + range.value.startIndex }))
      : [],
  );
  const beforeSize = computed(() =>
    settings.enabled() ? range.value.startIndex * itemSize.value : 0,
  );
  const afterSize = computed(() =>
    settings.enabled()
      ? Math.max(0, settings.items.value.length - range.value.endIndex - 1) * itemSize.value
      : 0,
  );
  const optionStyle = computed(() =>
    settings.enabled()
      ? {
          height: `${itemSize.value}px`,
          minHeight: `${itemSize.value}px`,
          maxHeight: `${itemSize.value}px`,
          boxSizing: 'border-box' as const,
          overflow: 'hidden',
        }
      : undefined,
  );
  function handleScroll(event: Event): void {
    offset.value = (event.currentTarget as HTMLElement).scrollTop;
  }
  async function revealActive(): Promise<void> {
    if (!settings.enabled() || !settings.open.value) return;
    const viewport = settings.viewport.value;
    offset.value = getVirtualListScrollOffset({
      align: 'auto',
      currentOffset: viewport?.scrollTop ?? offset.value,
      index: settings.activeIndex.value,
      itemCount: settings.items.value.length,
      itemSize: itemSize.value,
      viewportSize: viewportSize.value,
    });
    await nextTick();
    if (viewport) viewport.scrollTop = offset.value;
  }
  watch(
    [settings.activeIndex, settings.items, settings.open, settings.enabled, settings.itemSize],
    revealActive,
    { flush: 'post' },
  );
  return { visibleOptions, beforeSize, afterSize, optionStyle, handleScroll, revealActive };
}
