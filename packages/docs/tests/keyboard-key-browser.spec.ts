import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { waitForFiniteAnimations } from '../../storybook/helpers/animations.mts';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`KeyboardKey ${framework} renderuje spójnie w dokumentacji i przechodzi axe`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/data-display/keyboard-key`);
    const root = page.locator('.peaui-keyboard-key');
    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('data-platform', 'generic');
    await expect(root.locator('kbd')).toHaveText(['Ctrl', 'Shift', 'K']);
    await expect(root.locator('.peaui-keyboard-key__accessible')).toHaveText(
      'Control plus Shift plus K',
    );
    await expect(root).not.toHaveAttribute('tabindex', /.+/u);
    await expect(root).not.toHaveAttribute('aria-keyshortcuts', /.+/u);

    await page.setViewportSize({ width: 220, height: 700 });
    const metrics = await root.evaluate((element) => ({
      keyWhiteSpace: [...element.querySelectorAll<HTMLElement>('kbd')].map(
        (key) => getComputedStyle(key).whiteSpace,
      ),
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(metrics.keyWhiteSpace).toEqual(['nowrap', 'nowrap', 'nowrap']);
    expect(metrics.rootWidth).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.rootWidth + 1);
    expect(errors).toEqual([]);
    await waitForFiniteAnimations(page.locator('body'));
    expect(
      (await new AxeBuilder({ page }).include('.peaui-keyboard-key').analyze()).violations,
    ).toEqual([]);
  });
}
