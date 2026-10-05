import { prefersReducedMotion } from './browser.helper';

/** One cancellable transition per dialog, shared by framework adapters. */
export function createDialogMotion(kind: 'ModalDialog' | 'DrawerPanel') {
  let animation: Animation | undefined;
  let generation = 0;
  const cancel = (): void => {
    generation += 1;
    animation?.cancel();
    animation = undefined;
  };

  return {
    cancel,
    run(element: HTMLElement, opening: boolean, finished: () => void = () => undefined): void {
      cancel();
      if (
        prefersReducedMotion(element.ownerDocument.defaultView ?? undefined) ||
        typeof element.animate !== 'function'
      ) {
        finished();
        return;
      }
      const currentGeneration = generation;
      const drawer = kind === 'DrawerPanel';
      const durations = drawer ? { enter: 220, leave: 180 } : { enter: 180, leave: 160 };
      const hidden = drawer ? { transform: 'translateX(100%)', opacity: 0 } : { opacity: 0 };
      const visible = drawer ? { transform: 'translateX(0)', opacity: 1 } : { opacity: 1 };
      const current = element.animate(opening ? [hidden, visible] : [visible, hidden], {
        duration: opening ? durations.enter : durations.leave,
        easing: opening ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
        fill: 'forwards',
      });
      animation = current;
      void current.finished.then(
        () => {
          if (generation !== currentGeneration) return;
          animation = undefined;
          current.cancel();
          finished();
        },
        () => {
          // Replacing or unmounting a transition rejects Animation.finished.
          if (animation === current) animation = undefined;
        },
      );
    },
  };
}
