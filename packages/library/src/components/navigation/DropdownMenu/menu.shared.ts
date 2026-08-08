export type MenuFocusDirection = 1 | -1;

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuPlacement = 'top' | 'right' | 'bottom' | 'left';

export type MenuRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

export type MenuViewport = {
  height: number;
  left?: number;
  top?: number;
  width: number;
};

export type MenuSurfacePosition = {
  left: number;
  maxHeight: number;
  maxWidth: number;
  minWidth: number;
  placement: MenuPlacement;
  top: number;
};

export type RootMenuPositionOptions = {
  align: MenuAlign;
  margin?: number;
  offset: number;
  placement: MenuPlacement;
  surface: MenuRect;
  trigger: MenuRect;
  viewport: MenuViewport;
};

export type SubmenuPositionOptions = {
  gap?: number;
  margin?: number;
  parent: MenuRect;
  surface: MenuRect;
  viewport: MenuViewport;
};

const DEFAULT_VIEWPORT_MARGIN = 8;
const DEFAULT_SUBMENU_GAP = 4;
const MENU_MIN_WIDTH = 208;

function clamp(value: number, minimum: number, maximum: number): number {
  if (maximum < minimum) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

function alignedCrossAxisStart(
  start: number,
  end: number,
  surfaceSize: number,
  align: MenuAlign,
): number {
  if (align === 'center') return start + (end - start - surfaceSize) / 2;
  if (align === 'end') return end - surfaceSize;
  return start;
}

/**
 * Positions the root surface on the requested side and only shifts it on the
 * cross axis. The explicit placement is never silently changed: a `left`
 * surface remains left and a `right` surface remains right. When space is
 * limited, the surface is constrained and becomes scrollable instead.
 */
export function calculateRootMenuPosition({
  align,
  margin = DEFAULT_VIEWPORT_MARGIN,
  offset,
  placement,
  surface,
  trigger,
  viewport,
}: RootMenuPositionOptions): MenuSurfacePosition {
  const safeMargin = Math.max(0, margin);
  const safeOffset = Math.max(0, offset);
  const viewportLeft = viewport.left ?? 0;
  const viewportTop = viewport.top ?? 0;
  const viewportRight = viewportLeft + viewport.width;
  const viewportBottom = viewportTop + viewport.height;
  const horizontal = placement === 'left' || placement === 'right';
  let availableWidth = viewport.width - safeMargin * 2;
  let availableHeight = viewport.height - safeMargin * 2;

  if (horizontal) {
    availableWidth =
      placement === 'left'
        ? trigger.left - safeOffset - viewportLeft - safeMargin
        : viewportRight - trigger.right - safeOffset - safeMargin;
  } else {
    availableHeight =
      placement === 'top'
        ? trigger.top - safeOffset - viewportTop - safeMargin
        : viewportBottom - trigger.bottom - safeOffset - safeMargin;
  }
  const maxWidth = Math.max(0, Math.floor(availableWidth));
  const maxHeight = Math.max(0, Math.floor(availableHeight));
  const effectiveWidth = Math.min(surface.width, maxWidth);
  const effectiveHeight = Math.min(surface.height, maxHeight);

  let left: number;
  let top: number;

  if (placement === 'left') {
    left = trigger.left - effectiveWidth - safeOffset;
    top = alignedCrossAxisStart(trigger.top, trigger.bottom, effectiveHeight, align);
  } else if (placement === 'right') {
    left = trigger.right + safeOffset;
    top = alignedCrossAxisStart(trigger.top, trigger.bottom, effectiveHeight, align);
  } else if (placement === 'top') {
    left = alignedCrossAxisStart(trigger.left, trigger.right, effectiveWidth, align);
    top = trigger.top - effectiveHeight - safeOffset;
  } else {
    left = alignedCrossAxisStart(trigger.left, trigger.right, effectiveWidth, align);
    top = trigger.bottom + safeOffset;
  }

  if (horizontal) {
    top = clamp(top, viewportTop + safeMargin, viewportBottom - effectiveHeight - safeMargin);
  } else {
    left = clamp(left, viewportLeft + safeMargin, viewportRight - effectiveWidth - safeMargin);
  }

  return {
    left: Math.round(left),
    maxHeight,
    maxWidth,
    minWidth: Math.min(MENU_MIN_WIDTH, maxWidth),
    placement,
    top: Math.round(top),
  };
}

/** Positions a submenu on the roomier horizontal side of its parent item. */
export function calculateSubmenuPosition({
  gap = DEFAULT_SUBMENU_GAP,
  margin = DEFAULT_VIEWPORT_MARGIN,
  parent,
  surface,
  viewport,
}: SubmenuPositionOptions): MenuSurfacePosition {
  const safeGap = Math.max(0, gap);
  const safeMargin = Math.max(0, margin);
  const viewportLeft = viewport.left ?? 0;
  const viewportTop = viewport.top ?? 0;
  const viewportRight = viewportLeft + viewport.width;
  const viewportBottom = viewportTop + viewport.height;
  const rightSpace = viewportRight - parent.right - safeGap - safeMargin;
  const leftSpace = parent.left - viewportLeft - safeGap - safeMargin;
  const placement: MenuPlacement =
    rightSpace >= surface.width || rightSpace >= leftSpace ? 'right' : 'left';
  const availableWidth = placement === 'right' ? rightSpace : leftSpace;
  const maxWidth = Math.max(0, Math.floor(availableWidth));
  const maxHeight = Math.max(0, Math.floor(viewport.height - safeMargin * 2));
  const effectiveWidth = Math.min(surface.width, maxWidth);
  const effectiveHeight = Math.min(surface.height, maxHeight);
  const left =
    placement === 'right' ? parent.right + safeGap : parent.left - effectiveWidth - safeGap;
  const top = clamp(
    parent.top - 6,
    viewportTop + safeMargin,
    viewportBottom - effectiveHeight - safeMargin,
  );

  return {
    left: Math.round(left),
    maxHeight,
    maxWidth,
    minWidth: Math.min(MENU_MIN_WIDTH, maxWidth),
    placement,
    top: Math.round(top),
  };
}

export type MenuNavigableItem = {
  disabled?: boolean;
  label?: string;
};

export function normalizeMenuSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function nextEnabledMenuIndex<T extends MenuNavigableItem>(
  items: readonly T[],
  currentIndex: number,
  direction: MenuFocusDirection,
  loop = true,
): number {
  if (items.length === 0) return -1;

  for (let step = 1; step <= items.length; step += 1) {
    let candidate = currentIndex + step * direction;

    if (loop) candidate = (candidate + items.length) % items.length;
    else if (candidate < 0 || candidate >= items.length) return currentIndex;

    if (items[candidate]?.disabled !== true) return candidate;
  }

  return currentIndex;
}

export function edgeEnabledMenuIndex<T extends MenuNavigableItem>(
  items: readonly T[],
  edge: 'first' | 'last',
): number {
  const start = edge === 'first' ? 0 : items.length - 1;
  const direction: MenuFocusDirection = edge === 'first' ? 1 : -1;

  for (let index = start; index >= 0 && index < items.length; index += direction) {
    if (items[index]?.disabled !== true) return index;
  }

  return -1;
}

export function typeaheadMenuIndex<T extends MenuNavigableItem>(
  items: readonly T[],
  query: string,
  currentIndex = -1,
): number {
  const normalizedQuery = normalizeMenuSearchText(query);

  if (!normalizedQuery || items.length === 0) return -1;

  for (let step = 1; step <= items.length; step += 1) {
    const index = (currentIndex + step + items.length) % items.length;
    const item = items[index];

    if (
      item &&
      item.disabled !== true &&
      normalizeMenuSearchText(item.label ?? '').startsWith(normalizedQuery)
    ) {
      return index;
    }
  }

  return -1;
}
