import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('FullscreenContainer keeps keyboard focus visible and restores it after Escape', async ({ page }) => {
  await page.goto('/iframe.html?id=6-layout-fullscreencontainer--keyboard-interaction&viewMode=story');
  const root = page.locator('.peaui-fullscreen-container');
  const toggle = root.locator('.peaui-fullscreen-container__toggle');
  const inside = root.locator('.peaui-fullscreen-container__content-inner button');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(root).toHaveClass(/--fullscreen/);
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(inside).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(inside).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(root).not.toHaveClass(/--fullscreen/);
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Za kontenerem', exact: true })).toBeFocused();
  const result = await new AxeBuilder({ page }).include('#storybook-root')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .disableRules(['region', 'landmark-one-main', 'page-has-heading-one']).analyze();
  expect(result.violations).toEqual([]);
});
