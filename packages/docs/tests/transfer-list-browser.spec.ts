import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { waitForFiniteAnimations } from '../../storybook/helpers/animations.mts';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`TransferList ${framework} jest widoczny i przenosi element w dokumentacji`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/pl/${framework}/components/data-entry/transfer-list`);

    const root = page.locator('.peaui-transfer-list');
    const source = root.locator('.peaui-transfer-list__panel--source [role="listbox"]');
    const target = root.locator('.peaui-transfer-list__panel--target [role="listbox"]');
    const billing = source.locator('[role="option"][data-key="billing"]');

    await expect(root).toBeVisible();
    await expect(source.locator('[role="option"]')).toHaveCount(6);
    await expect(target.locator('[role="option"]')).toHaveCount(2);
    await expect(billing).toBeVisible();

    const rootBox = await root.boundingBox();
    const billingBox = await billing.boundingBox();
    expect(rootBox).not.toBeNull();
    expect(rootBox!.width).toBeGreaterThanOrEqual(320);
    expect(rootBox!.height).toBeLessThan(1_200);
    expect(billingBox).not.toBeNull();
    expect(billingBox!.width).toBeGreaterThanOrEqual(240);
    expect(billingBox!.height).toBeGreaterThanOrEqual(44);
    expect(billingBox!.height).toBeLessThan(100);

    await billing.click();
    const moveSelected = root.locator('.peaui-transfer-list__control--selected-target');
    await expect(moveSelected).toBeEnabled();
    await moveSelected.click();

    await expect(source.locator('[role="option"]')).toHaveCount(5);
    await expect(target.locator('[role="option"]')).toHaveCount(3);
    await expect(target.locator('[role="option"][data-key="billing"]')).toBeVisible();
    expect(errors).toEqual([]);
    await waitForFiniteAnimations(page.locator('body'));
    expect(
      (await new AxeBuilder({ page }).include('.peaui-transfer-list').analyze()).violations,
    ).toEqual([]);
  });
}
