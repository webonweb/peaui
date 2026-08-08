export type ScrollAreaType = 'native' | 'styled';
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaScrollbarVisibility = 'auto' | 'always' | 'hover';
export type ScrollAreaAxis = 'horizontal' | 'vertical';
export type ScrollAreaRtlMode = 'default' | 'negative' | 'reverse';

export type ScrollAreaPosition = {
  x: number;
  y: number;
  maxX: number;
  maxY: number;
  overflowX: boolean;
  overflowY: boolean;
  atStartX: boolean;
  atEndX: boolean;
  atStartY: boolean;
  atEndY: boolean;
};

export type ScrollAreaResizeDetail = ScrollAreaPosition & {
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
};

export type ScrollAreaEdgeDetail = {
  axes: ScrollAreaAxis[];
  position: ScrollAreaPosition;
};

export type ScrollAreaThumbMetrics = {
  offset: number;
  size: number;
  travel: number;
};

export type ScrollAreaHandle = {
  readonly viewport: HTMLElement | null;
  scrollTo(options: ScrollToOptions): void;
  scrollBy(options: ScrollToOptions): void;
  scrollIntoView(target: Element | string, options?: ScrollIntoViewOptions): boolean;
  getPosition(): ScrollAreaPosition;
};

export type ScrollAreaScrollbarSlotState = {
  orientation: ScrollAreaAxis;
};

export const SCROLL_AREA_EDGE_EPSILON = 1;
export const SCROLL_AREA_MIN_THUMB_SIZE = 24;

export function clampScrollAreaValue(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export function normalizeScrollAreaScrollbarSize(value: number): number {
  return clampScrollAreaValue(value, 6, 20);
}

export function normalizeScrollAreaAutoHideDelay(value: number): number {
  return clampScrollAreaValue(value, 0, 10_000);
}

export function calculateScrollAreaThumb(
  viewportSize: number,
  contentSize: number,
  trackSize: number,
  scrollPosition: number,
): ScrollAreaThumbMetrics {
  const normalizedTrack = Math.max(0, trackSize);
  const maximumScroll = Math.max(0, contentSize - viewportSize);

  if (normalizedTrack === 0 || maximumScroll === 0 || contentSize <= 0) {
    return { offset: 0, size: normalizedTrack, travel: 0 };
  }

  const size = Math.min(
    normalizedTrack,
    Math.max(SCROLL_AREA_MIN_THUMB_SIZE, (viewportSize / contentSize) * normalizedTrack),
  );
  const travel = Math.max(0, normalizedTrack - size);
  const offset = (clampScrollAreaValue(scrollPosition, 0, maximumScroll) / maximumScroll) * travel;

  return { offset, size, travel };
}

export function getLogicalScrollLeft(
  rawScrollLeft: number,
  maximumScroll: number,
  direction: 'ltr' | 'rtl',
  rtlMode: ScrollAreaRtlMode,
): number {
  if (direction === 'ltr') return clampScrollAreaValue(rawScrollLeft, 0, maximumScroll);
  if (rtlMode === 'negative') return clampScrollAreaValue(-rawScrollLeft, 0, maximumScroll);
  if (rtlMode === 'default') {
    return clampScrollAreaValue(maximumScroll - rawScrollLeft, 0, maximumScroll);
  }
  return clampScrollAreaValue(rawScrollLeft, 0, maximumScroll);
}

export function getRawScrollLeft(
  logicalScrollLeft: number,
  maximumScroll: number,
  direction: 'ltr' | 'rtl',
  rtlMode: ScrollAreaRtlMode,
): number {
  const position = clampScrollAreaValue(logicalScrollLeft, 0, maximumScroll);
  if (direction === 'ltr') return position;
  if (rtlMode === 'negative') return -position;
  if (rtlMode === 'default') return maximumScroll - position;
  return position;
}

export function getScrollAreaPosition(
  viewport: Pick<
    HTMLElement,
    'clientHeight' | 'clientWidth' | 'scrollHeight' | 'scrollLeft' | 'scrollTop' | 'scrollWidth'
  >,
  direction: 'ltr' | 'rtl' = 'ltr',
  rtlMode: ScrollAreaRtlMode = 'negative',
): ScrollAreaPosition {
  const maxX = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const maxY = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  const x = getLogicalScrollLeft(viewport.scrollLeft, maxX, direction, rtlMode);
  const y = clampScrollAreaValue(viewport.scrollTop, 0, maxY);

  return {
    x,
    y,
    maxX,
    maxY,
    overflowX: maxX > SCROLL_AREA_EDGE_EPSILON,
    overflowY: maxY > SCROLL_AREA_EDGE_EPSILON,
    atStartX: x <= SCROLL_AREA_EDGE_EPSILON,
    atEndX: maxX - x <= SCROLL_AREA_EDGE_EPSILON,
    atStartY: y <= SCROLL_AREA_EDGE_EPSILON,
    atEndY: maxY - y <= SCROLL_AREA_EDGE_EPSILON,
  };
}

export function applyScrollAreaOrientation(
  position: ScrollAreaPosition,
  orientation: ScrollAreaOrientation,
): ScrollAreaPosition {
  if (orientation === 'vertical') {
    return {
      ...position,
      x: 0,
      maxX: 0,
      overflowX: false,
      atStartX: true,
      atEndX: true,
    };
  }
  if (orientation === 'horizontal') {
    return {
      ...position,
      y: 0,
      maxY: 0,
      overflowY: false,
      atStartY: true,
      atEndY: true,
    };
  }
  return position;
}

export function getScrollAreaEdgeAxes(
  position: ScrollAreaPosition,
  edge: 'start' | 'end',
): ScrollAreaAxis[] {
  const axes: ScrollAreaAxis[] = [];
  if (position.overflowX && (edge === 'start' ? position.atStartX : position.atEndX)) {
    axes.push('horizontal');
  }
  if (position.overflowY && (edge === 'start' ? position.atStartY : position.atEndY)) {
    axes.push('vertical');
  }
  return axes;
}

export function areScrollAreaPositionsEqual(
  left: ScrollAreaPosition | undefined,
  right: ScrollAreaPosition,
): boolean {
  if (!left) return false;
  return (
    Math.abs(left.x - right.x) <= SCROLL_AREA_EDGE_EPSILON &&
    Math.abs(left.y - right.y) <= SCROLL_AREA_EDGE_EPSILON &&
    left.maxX === right.maxX &&
    left.maxY === right.maxY
  );
}
