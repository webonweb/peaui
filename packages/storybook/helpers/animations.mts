import type { Locator } from '@playwright/test';

/** Measure settled UI without disabling motion or waiting for infinite loaders. */
export async function waitForFiniteAnimations(target: Locator): Promise<void> {
  await target.evaluate(async (element) => {
    const nextPaint = () => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    // CSS transitions, including @starting-style, register after style resolution.
    await nextPaint();
    while (element.isConnected) {
      const animations = new Set(element.getAnimations({ subtree: true }));
      let ancestor: Element | null = element;
      while (ancestor) {
        for (const animation of ancestor.getAnimations()) animations.add(animation);
        const root = ancestor.getRootNode();
        ancestor = ancestor.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
      }
      const active = [...animations].filter((animation) =>
        animation.playState === 'running'
        && animation.playbackRate !== 0
        && Number.isFinite(animation.effect?.getComputedTiming().endTime),
      );
      if (!active.length) return;
      await Promise.all(active.map((animation) => animation.finished.catch(() => {
        // Removing a transition cancels its finished promise and also settles it.
      })));
      await nextPaint();
    }
  });
}
