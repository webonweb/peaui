import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { waitForFiniteAnimations } from '../../storybook/helpers/animations.mts';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`ScrollArea ${framework} renderuje treść i przewija ją w dokumentacji`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/layout/scroll-area`);

    const root = page.locator('.peaui-scroll-area');
    const viewport = root.locator('.peaui-scroll-area__viewport');
    const cards = root.locator('.peaui-scroll-area__content > .docs-demo-card');

    await expect(root).toBeVisible();
    await expect(cards).toHaveCount(12);
    await expect(cards.first()).toContainText('Sekcja raportu 1');

    const box = await root.boundingBox();
    const initialScroll = await viewport.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(500);
    expect(box!.height).toBe(288);
    expect(initialScroll.scrollHeight).toBeGreaterThan(initialScroll.clientHeight);

    await viewport.evaluate((element) => element.scrollTo({ top: 180 }));
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    expect(errors).toEqual([]);
    await waitForFiniteAnimations(page.locator('body'));
    expect(
      (await new AxeBuilder({ page }).include('.peaui-scroll-area').analyze()).violations,
    ).toEqual([]);
  });

  test(`FormRatingInput ${framework} nie zmienia geometrii po wyborze oceny`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/form/form-rating-input`);

    const root = page.locator('.peaui-form-rating-input');
    const valueLabel = root.locator('.peaui-form-rating-input__value-label');
    const lastItem = root.locator('.peaui-form-rating-input__item').last();
    const geometry = () =>
      root.evaluate((element) => {
        const rootRect = element.getBoundingClientRect();
        const labelRect = element
          .querySelector<HTMLElement>('.peaui-form-rating-input__value-label')!
          .getBoundingClientRect();
        return {
          height: rootRect.height,
          labelX: labelRect.x + scrollX,
          labelY: labelRect.y + scrollY,
          width: rootRect.width,
          x: rootRect.x + scrollX,
          y: rootRect.y + scrollY,
        };
      });

    await expect(root).toBeVisible();
    await expect(valueLabel).toContainText('3,5 z 5');
    // Font swapping above the example can move its page coordinates independently of rating.
    await page.evaluate(() => document.fonts.ready);
    const before = await geometry();

    await lastItem.click();
    await expect(root).toHaveAttribute('data-value', '4.5');
    await expect(valueLabel).toContainText('4,5 z 5');
    const after = await geometry();

    expect(after.x).toBeCloseTo(before.x, 1);
    expect(after.y).toBeCloseTo(before.y, 1);
    expect(after.width).toBeCloseTo(before.width, 1);
    expect(after.height).toBeCloseTo(before.height, 1);
    expect(after.labelX).toBeCloseTo(before.labelX, 1);
    expect(after.labelY).toBeCloseTo(before.labelY, 1);
    expect(errors).toEqual([]);
    await waitForFiniteAnimations(page.locator('body'));
    expect(
      (await new AxeBuilder({ page }).include('.peaui-form-rating-input').analyze()).violations,
    ).toEqual([]);
  });
}
