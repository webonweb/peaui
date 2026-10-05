import {
  areScrollAreaPositionsEqual,
  applyScrollAreaOrientation,
  calculateScrollAreaThumb,
  getRawScrollLeft,
  getScrollAreaEdgeAxes,
  getScrollAreaPosition,
  normalizeScrollAreaAutoHideDelay,
  type ScrollAreaAxis,
  type ScrollAreaEdgeDetail,
  type ScrollAreaHandle,
  type ScrollAreaPosition,
  type ScrollAreaResizeDetail,
  type ScrollAreaRtlMode,
} from './scroll-area.shared';

export type ScrollAreaEventName =
  'scroll' | 'scrollStart' | 'scrollEnd' | 'reachStart' | 'reachEnd' | 'resize';

export type ScrollAreaControllerElements = {
  root: HTMLElement;
  viewport: HTMLElement;
  content: HTMLElement;
  horizontalBar?: HTMLElement | null;
  horizontalThumb?: HTMLElement | null;
  verticalBar?: HTMLElement | null;
  verticalThumb?: HTMLElement | null;
};

export type ScrollAreaControllerOptions = {
  autoHideDelay: number;
  disabled: boolean;
  orientation: 'vertical' | 'horizontal' | 'both';
  restoreKey?: string;
  restorePosition: boolean;
  styled: boolean;
  onEvent: (
    name: ScrollAreaEventName,
    detail: ScrollAreaPosition | ScrollAreaResizeDetail | ScrollAreaEdgeDetail,
  ) => void;
};

export type ScrollAreaController = ScrollAreaHandle & {
  destroy(): void;
  update(nextOptions?: Partial<ScrollAreaControllerOptions>, emitResize?: boolean): void;
};

type DragState = {
  axis: ScrollAreaAxis;
  pointerId: number;
  startClient: number;
  startPosition: number;
  travel: number;
  maximumScroll: number;
};

const restoredPositions = new Map<string, Pick<ScrollAreaPosition, 'x' | 'y'>>();
let cachedRtlMode: ScrollAreaRtlMode | undefined;

export function getScrollAreaRtlMode(): ScrollAreaRtlMode {
  if (cachedRtlMode !== undefined) return cachedRtlMode;
  if (typeof document === 'undefined') return 'negative';

  const outer = document.createElement('div');
  const inner = document.createElement('div');
  Object.assign(outer.style, {
    direction: 'rtl',
    inlineSize: '4px',
    blockSize: '1px',
    overflow: 'scroll',
    position: 'absolute',
    insetInlineStart: '-9999px',
  });
  Object.assign(inner.style, { inlineSize: '8px', blockSize: '1px' });
  outer.append(inner);
  document.body.append(outer);

  if (outer.scrollLeft > 0) cachedRtlMode = 'default';
  else {
    outer.scrollLeft = 1;
    cachedRtlMode = outer.scrollLeft === 0 ? 'negative' : 'reverse';
  }
  outer.remove();
  return cachedRtlMode;
}

function directionOf(element: HTMLElement): 'ltr' | 'rtl' {
  if (typeof getComputedStyle !== 'function') return 'ltr';
  return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}

export function normalizeScrollAreaBehavior(
  behavior: ScrollBehavior | undefined,
): ScrollBehavior | undefined {
  return behavior === 'smooth' && prefersReducedMotion() ? 'auto' : behavior;
}

function rememberPosition(key: string | undefined, position: ScrollAreaPosition): void {
  if (!key) return;
  restoredPositions.delete(key);
  restoredPositions.set(key, { x: position.x, y: position.y });
  const oldest: string | undefined = restoredPositions.keys().next().value;
  if (restoredPositions.size > 100 && oldest !== undefined) restoredPositions.delete(oldest);
}

export function clearScrollAreaRestoredPositions(): void {
  restoredPositions.clear();
}

export function createScrollAreaController(
  elements: ScrollAreaControllerElements,
  initialOptions: ScrollAreaControllerOptions,
): ScrollAreaController {
  const { root, viewport, content, horizontalBar, horizontalThumb, verticalBar, verticalThumb } =
    elements;
  let options = initialOptions;
  let previousPosition: ScrollAreaPosition | undefined;
  let lastStartAxes = '';
  let lastEndAxes = '';
  let scrollFrame = 0;
  let resizeFrame = 0;
  let scrollEndTimer = 0;
  let autoHideTimer = 0;
  let scrolling = false;
  let destroyed = false;
  let drag: DragState | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let mutationObserver: MutationObserver | undefined;

  const position = (): ScrollAreaPosition => {
    const current = getScrollAreaPosition(viewport, directionOf(viewport), getScrollAreaRtlMode());
    return applyScrollAreaOrientation(current, options.orientation);
  };

  const setLogicalPosition = (
    x: number | undefined,
    y: number | undefined,
    behavior?: ScrollBehavior,
  ): void => {
    const current = position();
    viewport.scrollTo({
      left:
        x === undefined
          ? viewport.scrollLeft
          : getRawScrollLeft(x, current.maxX, directionOf(viewport), getScrollAreaRtlMode()),
      top: y ?? viewport.scrollTop,
      behavior: normalizeScrollAreaBehavior(behavior),
    });
  };

  const setActive = (): void => {
    root.dataset.active = 'true';
    window.clearTimeout(autoHideTimer);
    autoHideTimer = window.setTimeout(() => {
      delete root.dataset.active;
    }, normalizeScrollAreaAutoHideDelay(options.autoHideDelay));
  };

  const updateThumb = (
    axis: ScrollAreaAxis,
    bar: HTMLElement | null | undefined,
    thumb: HTMLElement | null | undefined,
    current: ScrollAreaPosition,
  ): void => {
    if (!bar || !thumb) return;
    const horizontal = axis === 'horizontal';
    const overflow = horizontal ? current.overflowX : current.overflowY;
    const maximum = horizontal ? current.maxX : current.maxY;
    const value = horizontal ? current.x : current.y;
    const viewportSize = horizontal ? viewport.clientWidth : viewport.clientHeight;
    const contentSize = horizontal ? viewport.scrollWidth : viewport.scrollHeight;
    const trackSize = horizontal ? bar.clientWidth : bar.clientHeight;
    const metrics = calculateScrollAreaThumb(viewportSize, contentSize, trackSize, value);

    bar.hidden = !overflow || !options.styled;
    bar.tabIndex = options.disabled || !overflow || !options.styled ? -1 : 0;
    bar.setAttribute('aria-valuemax', `${Math.round(maximum)}`);
    bar.setAttribute('aria-valuenow', `${Math.round(value)}`);
    bar.setAttribute('aria-disabled', options.disabled ? 'true' : 'false');
    thumb.style[horizontal ? 'inlineSize' : 'blockSize'] = `${metrics.size}px`;
    thumb.style[horizontal ? 'insetInlineStart' : 'insetBlockStart'] = `${metrics.offset}px`;
  };

  const sync = (emitResize = false): ScrollAreaPosition => {
    const current = position();
    root.dataset.overflowX = `${current.overflowX}`;
    root.dataset.overflowY = `${current.overflowY}`;
    root.dataset.atStart = `${
      (!current.overflowX || current.atStartX) && (!current.overflowY || current.atStartY)
    }`;
    root.dataset.atEnd = `${
      (!current.overflowX || current.atEndX) && (!current.overflowY || current.atEndY)
    }`;
    updateThumb('horizontal', horizontalBar, horizontalThumb, current);
    updateThumb('vertical', verticalBar, verticalThumb, current);

    if (emitResize) {
      options.onEvent('resize', {
        ...current,
        clientWidth: viewport.clientWidth,
        clientHeight: viewport.clientHeight,
        scrollWidth: viewport.scrollWidth,
        scrollHeight: viewport.scrollHeight,
      });
    }
    previousPosition ??= current;
    return current;
  };

  const emitEdges = (current: ScrollAreaPosition): void => {
    const startAxes = getScrollAreaEdgeAxes(current, 'start');
    const endAxes = getScrollAreaEdgeAxes(current, 'end');
    const startKey = startAxes.join('|');
    const endKey = endAxes.join('|');
    if (startKey && startKey !== lastStartAxes) {
      options.onEvent('reachStart', { axes: startAxes, position: current });
    }
    if (endKey && endKey !== lastEndAxes) {
      options.onEvent('reachEnd', { axes: endAxes, position: current });
    }
    lastStartAxes = startKey;
    lastEndAxes = endKey;
  };

  const flushScroll = (): void => {
    scrollFrame = 0;
    const current = sync();
    if (!areScrollAreaPositionsEqual(previousPosition, current)) {
      options.onEvent('scroll', current);
      emitEdges(current);
      previousPosition = current;
    }
  };

  const handleScroll = (): void => {
    if (!scrolling) {
      scrolling = true;
      root.dataset.scrolling = 'true';
      options.onEvent('scrollStart', position());
    }
    setActive();
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(flushScroll);
    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame);
        flushScroll();
      }
      scrolling = false;
      delete root.dataset.scrolling;
      options.onEvent('scrollEnd', position());
    }, 120);
  };

  const scrollAxisBy = (axis: ScrollAreaAxis, delta: number): void => {
    if (options.disabled) return;
    const current = position();
    if (axis === 'horizontal') setLogicalPosition(current.x + delta, undefined, 'auto');
    else setLogicalPosition(undefined, current.y + delta, 'auto');
    setActive();
  };

  const handleBarKeydown = (axis: ScrollAreaAxis, event: KeyboardEvent): void => {
    const current = position();
    const horizontal = axis === 'horizontal';
    const page = horizontal ? viewport.clientWidth : viewport.clientHeight;
    const maximum = horizontal ? current.maxX : current.maxY;
    const value = horizontal ? current.x : current.y;
    let next: number | undefined;
    if (event.key === (horizontal ? 'ArrowRight' : 'ArrowDown')) next = value + 40;
    else if (event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')) next = value - 40;
    else if (event.key === 'PageDown') next = value + page;
    else if (event.key === 'PageUp') next = value - page;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = maximum;
    if (next === undefined || options.disabled) return;
    event.preventDefault();
    if (horizontal) setLogicalPosition(next, undefined, 'auto');
    else setLogicalPosition(undefined, next, 'auto');
    setActive();
  };

  const handleTrackPointerDown = (axis: ScrollAreaAxis, event: PointerEvent): void => {
    if (options.disabled || event.button !== 0) return;
    const thumb = axis === 'horizontal' ? horizontalThumb : verticalThumb;
    if (event.target === thumb || thumb?.contains(event.target as Node) === true) return;
    const bar = axis === 'horizontal' ? horizontalBar : verticalBar;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const current = position();
    let click = event.clientY - rect.top;
    if (axis === 'horizontal') {
      click =
        directionOf(viewport) === 'rtl' ? rect.right - event.clientX : event.clientX - rect.left;
    }
    const metrics = calculateScrollAreaThumb(
      axis === 'horizontal' ? viewport.clientWidth : viewport.clientHeight,
      axis === 'horizontal' ? viewport.scrollWidth : viewport.scrollHeight,
      axis === 'horizontal' ? bar.clientWidth : bar.clientHeight,
      axis === 'horizontal' ? current.x : current.y,
    );
    const page = axis === 'horizontal' ? viewport.clientWidth : viewport.clientHeight;
    let delta = 0;
    if (click < metrics.offset) delta = -page;
    else if (click > metrics.offset + metrics.size) delta = page;
    scrollAxisBy(axis, delta);
  };

  const handleThumbPointerDown = (axis: ScrollAreaAxis, event: PointerEvent): void => {
    if (options.disabled || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const bar = axis === 'horizontal' ? horizontalBar : verticalBar;
    if (!bar) return;
    const current = position();
    const metrics = calculateScrollAreaThumb(
      axis === 'horizontal' ? viewport.clientWidth : viewport.clientHeight,
      axis === 'horizontal' ? viewport.scrollWidth : viewport.scrollHeight,
      axis === 'horizontal' ? bar.clientWidth : bar.clientHeight,
      axis === 'horizontal' ? current.x : current.y,
    );
    drag = {
      axis,
      pointerId: event.pointerId,
      startClient: axis === 'horizontal' ? event.clientX : event.clientY,
      startPosition: axis === 'horizontal' ? current.x : current.y,
      travel: metrics.travel,
      maximumScroll: axis === 'horizontal' ? current.maxX : current.maxY,
    };
    root.dataset.dragging = 'true';
    setActive();
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (!drag || event.pointerId !== drag.pointerId || drag.travel <= 0) return;
    const physicalDelta =
      (drag.axis === 'horizontal' ? event.clientX : event.clientY) - drag.startClient;
    const logicalDelta =
      drag.axis === 'horizontal' && directionOf(viewport) === 'rtl'
        ? -physicalDelta
        : physicalDelta;
    const next = drag.startPosition + (logicalDelta / drag.travel) * drag.maximumScroll;
    if (drag.axis === 'horizontal') setLogicalPosition(next, undefined, 'auto');
    else setLogicalPosition(undefined, next, 'auto');
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag = undefined;
    delete root.dataset.dragging;
  };

  const horizontalKeydown = (event: KeyboardEvent): void => handleBarKeydown('horizontal', event);
  const verticalKeydown = (event: KeyboardEvent): void => handleBarKeydown('vertical', event);
  const horizontalTrackDown = (event: PointerEvent): void =>
    handleTrackPointerDown('horizontal', event);
  const verticalTrackDown = (event: PointerEvent): void =>
    handleTrackPointerDown('vertical', event);
  const horizontalThumbDown = (event: PointerEvent): void =>
    handleThumbPointerDown('horizontal', event);
  const verticalThumbDown = (event: PointerEvent): void =>
    handleThumbPointerDown('vertical', event);

  viewport.addEventListener('scroll', handleScroll, { passive: true });
  horizontalBar?.addEventListener('keydown', horizontalKeydown);
  verticalBar?.addEventListener('keydown', verticalKeydown);
  horizontalBar?.addEventListener('pointerdown', horizontalTrackDown);
  verticalBar?.addEventListener('pointerdown', verticalTrackDown);
  horizontalThumb?.addEventListener('pointerdown', horizontalThumbDown);
  verticalThumb?.addEventListener('pointerdown', verticalThumbDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);

  const scheduleResize = (): void => {
    // Resize and scroll must each flush when they occur in the same frame.
    if (destroyed || resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      sync(true);
      setActive();
    });
  };

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(viewport);
    resizeObserver.observe(content);
  }
  if (typeof MutationObserver !== 'undefined') {
    mutationObserver = new MutationObserver(scheduleResize);
    mutationObserver.observe(content, { childList: true, subtree: true, characterData: true });
  }

  sync();
  const restored =
    options.restorePosition && options.restoreKey
      ? restoredPositions.get(options.restoreKey)
      : undefined;
  if (restored) {
    window.requestAnimationFrame(() => {
      if (!destroyed) setLogicalPosition(restored.x, restored.y, 'auto');
    });
  } else {
    setActive();
  }

  return {
    get viewport() {
      return destroyed ? null : viewport;
    },
    getPosition: position,
    scrollTo(scrollOptions) {
      if (options.disabled) return;
      setLogicalPosition(scrollOptions.left, scrollOptions.top, scrollOptions.behavior);
    },
    scrollBy(scrollOptions) {
      if (options.disabled) return;
      const current = position();
      setLogicalPosition(
        scrollOptions.left === undefined ? undefined : current.x + scrollOptions.left,
        scrollOptions.top === undefined ? undefined : current.y + scrollOptions.top,
        scrollOptions.behavior,
      );
    },
    scrollIntoView(target, scrollOptions = { block: 'nearest', inline: 'nearest' }) {
      if (options.disabled) return false;
      const element = typeof target === 'string' ? content.querySelector<Element>(target) : target;
      if (!element || !content.contains(element)) return false;
      element.scrollIntoView({
        ...scrollOptions,
        behavior: normalizeScrollAreaBehavior(scrollOptions.behavior),
      });
      return true;
    },
    update(nextOptions = {}, emitResize = false) {
      options = { ...options, ...nextOptions };
      sync(emitResize);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (options.restorePosition) rememberPosition(options.restoreKey, position());
      viewport.removeEventListener('scroll', handleScroll);
      horizontalBar?.removeEventListener('keydown', horizontalKeydown);
      verticalBar?.removeEventListener('keydown', verticalKeydown);
      horizontalBar?.removeEventListener('pointerdown', horizontalTrackDown);
      verticalBar?.removeEventListener('pointerdown', verticalTrackDown);
      horizontalThumb?.removeEventListener('pointerdown', horizontalThumbDown);
      verticalThumb?.removeEventListener('pointerdown', verticalThumbDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(scrollEndTimer);
      window.clearTimeout(autoHideTimer);
    },
  };
}
import { prefersReducedMotion } from '@/helpers/browser.helper';
