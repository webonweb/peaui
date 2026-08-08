import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`VirtualList ${framework} renderuje i przewija 10k rekordów w dokumentacji`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/data-display/virtual-list`);
    const root = page.locator('.peaui-virtual-list');
    const scrollArea = root.locator('.peaui-scroll-area');
    const viewport = root.locator('.peaui-scroll-area__viewport');

    await expect(root).toBeVisible();
    await expect(root.getByRole('listitem')).toHaveCount(9);
    await expect(root.getByText('Wynik 00001')).toBeVisible();

    const initial = await root.evaluate((element) => ({
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      trackHeight: element.querySelector<HTMLElement>('.peaui-virtual-list__items')?.offsetHeight,
    }));
    const scrollAreaBox = await scrollArea.boundingBox();
    expect(scrollAreaBox?.height).toBe(320);
    expect(initial.rootWidth).toBeGreaterThanOrEqual(500);
    expect(initial.scrollWidth).toBeLessThanOrEqual(initial.rootWidth + 1);
    expect(initial.trackHeight).toBe(640_000);

    await viewport.evaluate((element) => {
      element.scrollTop = 320_000;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect(root.getByText('Wynik 05001')).toBeVisible();
    expect(await root.getByRole('listitem').count()).toBeLessThanOrEqual(13);
    await expect(root.locator('.peaui-virtual-list__end')).toHaveCount(0);
    await viewport.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect(root.locator('.peaui-virtual-list__end')).toBeVisible();

    expect(errors).toEqual([]);
    expect(
      (await new AxeBuilder({ page }).include('.peaui-virtual-list').analyze()).violations,
    ).toEqual([]);
  });
}
