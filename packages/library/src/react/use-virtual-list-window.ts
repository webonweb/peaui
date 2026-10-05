import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type UIEvent,
  type RefObject,
} from 'react';
import {
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  normalizeVirtualListItemSize,
} from '../components/data-display/VirtualList/virtual-list.shared';

export function useVirtualListWindow<T, Element extends HTMLElement = HTMLUListElement>(
  items: readonly T[],
  activeIndex: number,
  open: boolean,
  enabled: boolean,
  requestedSize: number,
  externalRef?: RefObject<Element | null>,
) {
  const internalRef = useRef<Element>(null);
  const viewportRef = externalRef ?? internalRef;
  const [offset, setOffset] = useState(0);
  const itemSize = normalizeVirtualListItemSize(
    Number.isFinite(requestedSize) ? Math.max(24, requestedSize) : 48,
  );
  const [viewportSize, setViewportSize] = useState(240);
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !enabled || !open) return;
    const measure = (): void => setViewportSize(viewport.clientHeight || 240);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewportRef, enabled, open]);
  const range = enabled
    ? calculateVirtualListRange({
        itemCount: items.length,
        itemSize,
        overscan: 3,
        scrollOffset: offset,
        viewportSize,
      })
    : { startIndex: 0, endIndex: items.length - 1 };
  useLayoutEffect(() => {
    if (!enabled || !open) return;
    const viewport = viewportRef.current;
    const next = getVirtualListScrollOffset({
      align: 'auto',
      currentOffset: viewport?.scrollTop ?? 0,
      index: activeIndex,
      itemCount: items.length,
      itemSize,
      viewportSize: viewport?.clientHeight || 240,
    });
    if (viewport) viewport.scrollTop = next;
    setOffset(next);
  }, [activeIndex, enabled, itemSize, items, open, viewportRef]);
  const visibleOptions = open
    ? items
        .slice(range.startIndex, range.endIndex + 1)
        .map((item, index) => ({ item, index: index + range.startIndex }))
    : [];
  return {
    viewportRef,
    visibleOptions,
    beforeSize: enabled ? range.startIndex * itemSize : 0,
    afterSize: enabled ? Math.max(0, items.length - range.endIndex - 1) * itemSize : 0,
    optionStyle: enabled
      ? ({
          height: itemSize,
          minHeight: itemSize,
          maxHeight: itemSize,
          boxSizing: 'border-box',
          overflow: 'hidden',
        } as CSSProperties)
      : undefined,
    handleScroll: (event: UIEvent<HTMLElement>) => setOffset(event.currentTarget.scrollTop),
  };
}
