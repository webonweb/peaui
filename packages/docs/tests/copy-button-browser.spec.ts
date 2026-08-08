import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`CopyButton ${framework} działa w dokumentacji i przechodzi axe`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) => {
            (window as Window & { __peauiCopiedText?: string }).__peauiCopiedText = text;
            return Promise.resolve();
          },
        },
      });
    });

    await page.goto(`/pl/${framework}/components/data-entry/copy-button`);
    const root = page.locator('.peaui-copy-button');
    await expect(root).toBeVisible();
    const button = root.getByRole('button', { name: 'Kopiuj identyfikator' });
    const statusRegion = root.locator('.peaui-copy-button__status');
    await button.click();
    await Promise.all([
      expect(root).toHaveAttribute('data-status', 'copied'),
      expect(button).toBeFocused(),
      expect(statusRegion).toHaveAttribute('role', 'status'),
      expect(statusRegion).toHaveText('Skopiowano'),
    ]);
    expect(
      await page.evaluate(
        () => (window as Window & { __peauiCopiedText?: string }).__peauiCopiedText,
      ),
    ).toBe('PEA-2026-022');

    await page.setViewportSize({ width: 320, height: 800 });
    const metrics = await root.evaluate((element) => ({
      pageWidth: document.documentElement.scrollWidth,
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.rootWidth + 1);
    expect(metrics.pageWidth).toBeLessThanOrEqual(320);
    expect(errors).toEqual([]);
    expect(
      (await new AxeBuilder({ page }).include('.peaui-copy-button').analyze()).violations,
    ).toEqual([]);
  });
}
