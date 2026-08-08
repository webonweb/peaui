import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`InlineEdit ${framework} działa w dokumentacji i przechodzi axe`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/data-entry/inline-edit`);
    const root = page.locator('.peaui-inline-edit');
    await expect(root).toBeVisible();
    await root.getByRole('button', { name: 'Edytuj nazwę projektu' }).click();
    const input = root.getByRole('textbox', { name: 'Edytuj nazwę projektu' });
    await expect(input).toBeFocused();
    await input.fill('Panel partnera');
    await root.getByRole('button', { name: 'Zapisz' }).click();
    await expect(root.getByText('Panel partnera')).toBeVisible();

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
      (await new AxeBuilder({ page }).include('.peaui-inline-edit').analyze()).violations,
    ).toEqual([]);
  });
}
