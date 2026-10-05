import { calculateGuidedTourPosition } from '../../overlayer/GuidedTour/guided-tour.shared';

/** Reuses the overlay collision algorithm and observes only an open group. */
export function observeAvatarGroupPopover(
  root: HTMLElement,
  panel: HTMLElement,
  direction: 'start' | 'end',
): () => void {
  let frame: number | undefined;
  const viewport = window.visualViewport;
  const update = (): void => {
    const target = root.getBoundingClientRect();
    const card = panel.getBoundingClientRect();
    const offsetLeft = viewport?.offsetLeft ?? 0;
    const offsetTop = viewport?.offsetTop ?? 0;
    const gap = Number.parseFloat(getComputedStyle(panel).marginTop) || 0;
    // The panel's existing max-width/max-height reserve one rem on each edge.
    const margin = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let alignment = direction;
    if (getComputedStyle(root).direction === 'rtl')
      alignment = direction === 'start' ? 'end' : 'start';
    const position = calculateGuidedTourPosition(
      {
        top: target.top - offsetTop,
        bottom: target.bottom - offsetTop,
        left: target.left - offsetLeft,
        right: target.right - offsetLeft,
        width: target.width,
        height: target.height,
      },
      card,
      'bottom',
      viewport?.width ?? window.innerWidth,
      viewport?.height ?? window.innerHeight,
      gap,
      margin,
      alignment,
    );
    panel.style.left = `${position.left + offsetLeft - target.left - root.clientLeft}px`;
    panel.style.top = `${position.top + offsetTop - target.top - root.clientTop - gap}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  };
  const schedule = (): void => {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      update();
    });
  };
  update();
  window.addEventListener('resize', schedule);
  window.addEventListener('scroll', schedule, true);
  viewport?.addEventListener('resize', schedule);
  viewport?.addEventListener('scroll', schedule);
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
  observer?.observe(root);
  observer?.observe(panel);
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer?.disconnect();
    window.removeEventListener('resize', schedule);
    window.removeEventListener('scroll', schedule, true);
    viewport?.removeEventListener('resize', schedule);
    viewport?.removeEventListener('scroll', schedule);
    panel.style.left = panel.style.top = panel.style.right = panel.style.bottom = '';
  };
}
