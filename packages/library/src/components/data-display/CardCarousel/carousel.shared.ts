export const CAROUSEL_DEFAULT_VISIBLE_SLIDES = 4;
export const CAROUSEL_DEFAULT_DELAY = 2000;
export const CAROUSEL_PAUSE_LABEL = 'Zatrzymaj automatyczne przewijanie';
export const CAROUSEL_RESUME_LABEL = 'Wznów automatyczne przewijanie';

export function createCarouselRotationToggle() {
  let pointerPaused: boolean | undefined;
  return {
    capturePointerState(paused: boolean): void {
      pointerPaused = paused;
    },
    toggle(paused: boolean, event: Pick<MouseEvent, 'detail'>): boolean {
      // Pointer focus can pause rotation between pointerdown and click. Preserve
      // the action the user pressed; keyboard activation uses the current state.
      const next = !(event.detail > 0 ? (pointerPaused ?? paused) : paused);
      pointerPaused = undefined;
      return next;
    },
  };
}

export function getCarouselMetrics(
  viewport: HTMLElement,
  total: number,
  requested: number,
): { step: number; visible: number } {
  const styles = getComputedStyle(viewport);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
  const width = (viewport.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
  const step = width > 0 ? width + gap : 0;
  const visible =
    step > 0 ? Math.max(1, Math.round((viewport.clientWidth + gap) / step)) : requested;
  return { step, visible: Math.max(1, Math.min(total || requested, visible)) };
}
