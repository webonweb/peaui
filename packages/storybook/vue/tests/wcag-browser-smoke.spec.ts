import { expect, test } from '@playwright/test';

import { expectVisibleFocusIndicator, gotoStory, tabToTarget } from './helpers/a11y';

test('ModalDialog works in reduced motion mode in a real browser', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoStory(page, 'internal-wcag-browser-smoke--modal-dialog');

  await page.getByTestId('modal-dialog-smoke-open').click();

  const dialog = page.getByTestId('modal-dialog-smoke');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('modal-dialog-smoke-focus-target')).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
});

test('FormSelect exposes visible keyboard focus and supports keyboard selection', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--form-select');

  const input = page.getByTestId('form-select-smoke-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.press('ArrowDown');
  await expect(page.getByTestId('form-select-smoke-listbox')).toBeVisible();

  await page.getByRole('option', { name: 'Pomorskie' }).click();

  await expect(input).toHaveValue('Pomorskie');
});

test('FormDatePicker exposes visible keyboard focus and updates value after selecting a day', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--form-date-picker');

  const input = page.getByTestId('form-date-picker-smoke-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.press('Enter');
  await expect(page.getByTestId('form-date-picker-smoke-panel')).toBeVisible();

  await page.getByRole('button', { name: 'Wybierz date 20 marca 2026' }).click();

  await expect(input).toHaveValue('2026-03-20');
});

test('Breadcrumbs reflows to the mobile variant and remains keyboard operable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoStory(page, 'internal-wcag-browser-smoke--breadcrumbs');

  const trigger = page.getByRole('button', { name: /Poka/ });

  await expect(trigger).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await expectVisibleFocusIndicator(trigger);

  await trigger.press('Enter');

  await expect(page.getByRole('list', { name: /Menu/ })).toBeVisible();
});

test('TableList keeps a visible focus state, reflows into a scroll region and toggles column visibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 480, height: 900 });
  await gotoStory(page, 'internal-wcag-browser-smoke--table-list');

  const root = page.getByTestId('table-list-smoke');
  const horizontalMetrics = await root.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));

  expect(horizontalMetrics.scrollWidth).toBeGreaterThan(horizontalMetrics.clientWidth);

  await page.keyboard.press('Tab');
  await expect(root).toBeFocused();
  await expectVisibleFocusIndicator(root);

  const visibilityTrigger = page.getByTestId(
    'table-list-smoke-actions-head-column-visibility-trigger',
  );

  await visibilityTrigger.press('Enter');
  await expect(
    page.locator('[data-test-id="table-list-smoke-actions-head-column-visibility-content"]'),
  ).toBeVisible();

  const statusCheckbox = page.getByTestId(
    'table-list-smoke-actions-head-column-visibility-checkbox-status',
  );

  await expect(statusCheckbox).toBeChecked();
  await statusCheckbox.uncheck();
  await expect(statusCheckbox).not.toBeChecked();
  await expect(
    page.getByTestId('table-list-smoke-columns-head-cell-status-status'),
  ).toHaveCount(0);
});

test('TreeList exposes a visible keyboard focus, toggles branches and keeps remove action separate', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--tree-list');

  const trigger = page.getByTestId('tree-list-smoke-trigger');

  await tabToTarget(page, trigger);
  await expect(trigger).toBeFocused();
  await expectVisibleFocusIndicator(trigger);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.press('Enter');

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('tree-list-smoke-content')).toBeVisible();

  await page.getByTestId('tree-list-smoke-remove').click();
  await expect(page.getByTestId('tree-list-smoke-removed')).toContainText('malopolskie');
});
