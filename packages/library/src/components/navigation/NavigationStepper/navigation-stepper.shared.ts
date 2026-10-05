import { getLogicalScrollLeft, getRawScrollLeft } from '../../layout/ScrollArea/scroll-area.shared';
import { getScrollAreaRtlMode } from '../../layout/ScrollArea/scroll-area.controller';

export function getStepperScrollPosition(viewport: HTMLElement) {
  const direction: 'rtl' | 'ltr' = getComputedStyle(viewport).direction === 'rtl' ? 'rtl' : 'ltr';
  const rtlMode = getScrollAreaRtlMode();
  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  return {
    direction,
    rtlMode,
    max,
    position: getLogicalScrollLeft(viewport.scrollLeft, max, direction, rtlMode),
  };
}

export function scrollStepper(viewport: HTMLElement | null, direction: -1 | 1): void {
  if (!viewport) return;
  const state = getStepperScrollPosition(viewport);
  const target = getRawScrollLeft(
    state.position + 284 * direction,
    state.max,
    state.direction,
    state.rtlMode,
  );
  viewport.scrollBy({ left: target - viewport.scrollLeft, behavior: 'smooth' });
}
