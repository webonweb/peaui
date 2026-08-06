import { expect, test } from '@playwright/test';

import {
  expectVisibleFocusIndicator,
  gotoStory,
  tabToTarget,
} from './helpers/a11y';

test('ButtonAction exposes visible keyboard focus and accessible name', async ({ page }) => {
  await gotoStory(page, '3-data-entry-buttonaction--button-action');

  const button = page.getByRole('button', { name: /lorem ipsum/i });

  await tabToTarget(page, button);
  await expect(button).toBeFocused();
  await expectVisibleFocusIndicator(button);
  await expect(button).toHaveAccessibleName(/lorem ipsum/i);
});

test('SearchInput exposes visible keyboard focus and accepts keyboard input', async ({ page }) => {
  await gotoStory(page, '3-data-entry-searchinput--search-input');

  const input = page.getByRole('searchbox', { name: 'Wyszukaj dokument' });

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.fill('bud');
  await input.press('Enter');

  await expect(input).toHaveValue('bud');
});

test('InputSlider exposes visible keyboard focus and changes value with arrows', async ({
  page,
}) => {
  await gotoStory(page, '3-data-entry-inputslider--input-slider');

  const slider = page.getByTestId('input-slider-slider');
  const before = Number(await slider.getAttribute('aria-valuenow'));

  await tabToTarget(page, slider);
  await expect(slider).toBeFocused();
  await expectVisibleFocusIndicator(slider);

  await slider.press('ArrowRight');

  const after = Number(await slider.getAttribute('aria-valuenow'));

  expect(after).toBeGreaterThan(before);
});

test('FormInput exposes visible keyboard focus and keeps label/description semantics', async ({
  page,
}) => {
  await gotoStory(page, '5-form-forminput--form-input');

  const input = page.getByLabel('Lorem ipsum');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);
  await expect(input).toHaveAccessibleName(/Lorem ipsum/);
  await expect(input).toHaveAttribute('aria-describedby', /.+/);
});

test('FormNumber exposes visible keyboard focus and changes numeric value', async ({ page }) => {
  await gotoStory(page, '5-form-formnumber--form-number');

  const input = page.getByTestId('form-number-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.press('ArrowUp');

  await expect(input).toHaveValue('11');
});

test('FormTextarea exposes visible keyboard focus and accepts typed content', async ({ page }) => {
  await gotoStory(page, '5-form-formtextarea--form-textarea');

  const textarea = page.getByTestId('form-textarea-element');

  await tabToTarget(page, textarea);
  await expect(textarea).toBeFocused();
  await expectVisibleFocusIndicator(textarea);

  await textarea.fill('Rozszerzony opis do testu browserowego.');

  await expect(textarea).toHaveValue('Rozszerzony opis do testu browserowego.');
});

test('FormCheckbox exposes visible keyboard focus and toggles with Space', async ({ page }) => {
  await gotoStory(page, '5-form-formcheckbox--form-checkbox');

  const checkbox = page.getByTestId('form-checkbox-element');

  await tabToTarget(page, checkbox);
  await expect(checkbox).toBeFocused();
  await expectVisibleFocusIndicator(checkbox);
  await expect(checkbox).toBeChecked();

  await checkbox.press('Space');

  await expect(checkbox).not.toBeChecked();
});

test('FormYearPicker exposes visible keyboard focus and updates value after selecting a year', async ({
  page,
}) => {
  await gotoStory(page, '5-form-formyearpicker--form-year-picker');

  const input = page.getByTestId('form-year-picker-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.press('Enter');
  await expect(page.getByTestId('form-year-picker-panel')).toBeVisible();

  await page.getByTestId('form-year-picker-year-2026').click();

  await expect(input).toHaveValue('2026');
});

test('FormYearPicker exposes dialog semantics and keyboard relationships in the browser', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--form-year-picker');

  const input = page.getByTestId('form-year-picker-smoke-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);
  await expect(input).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveAttribute('aria-controls', /browser-year-dialog/);

  await input.press('Enter');

  const panel = page.getByTestId('form-year-picker-smoke-panel');
  const grid = page.getByTestId('form-year-picker-smoke-grid');
  const range = page.getByTestId('form-year-picker-smoke-range');

  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('role', 'dialog');
  await expect(grid).toHaveAttribute('role', 'grid');
  await expect(range).toContainText('2020 - 2029');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
});

test('FormMultiSelect exposes visible keyboard focus and opens its listbox from keyboard', async ({
  page,
}) => {
  await gotoStory(page, '5-form-formmultiselect--form-multi-select');

  const input = page.getByTestId('form-multiselect-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);
  await expect(input).toHaveAttribute('aria-controls', /.+/);

  await input.press('ArrowDown');

  await expect(page.getByTestId('form-multiselect-listbox')).toBeVisible();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
});

test('FormMultiSelect exposes listbox semantics and option selection state in the browser', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--form-multi-select');

  const input = page.getByTestId('form-multiselect-smoke-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);
  await expect(input).toHaveAttribute('aria-haspopup', 'listbox');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveAttribute('aria-controls', /browser-multiselect-listbox/);

  await input.press('ArrowDown');

  const listbox = page.getByTestId('form-multiselect-smoke-listbox');
  const selectedOption = page.getByRole('option', { name: 'Mazowieckie' });
  const nextOption = page.getByRole('option', { name: 'Pomorskie' });

  await expect(listbox).toBeVisible();
  await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  await expect(nextOption).toHaveAttribute('aria-selected', 'false');

  await nextOption.click();
  await expect(nextOption).toHaveAttribute('aria-selected', 'true');

  await input.press('Escape');

  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveValue(/Mazowieckie, Pomorskie/);
});

test('PaginationControl exposes visible keyboard focus and updates current page', async ({
  page,
}) => {
  await gotoStory(page, '7-navigation-paginationcontrol--pagination-control');

  const nextButton = page.getByTestId('pagination-control-button-next-page');

  await tabToTarget(page, nextButton);
  await expect(nextButton).toBeFocused();
  await expectVisibleFocusIndicator(nextButton);

  await nextButton.press('Enter');

  await expect(page.getByTestId('pagination-control-button-4-page')).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('ListLimitControl exposes visible keyboard focus and updates selected limit', async ({
  page,
}) => {
  await gotoStory(page, '7-navigation-listlimitcontrol--list-limit-control');

  const input = page.getByTestId('list-limit-control-select-element');

  await tabToTarget(page, input);
  await expect(input).toBeFocused();
  await expectVisibleFocusIndicator(input);

  await input.press('ArrowDown');
  await expect(page.getByTestId('list-limit-control-select-listbox')).toBeVisible();

  await page.getByRole('option', { name: '25' }).click();

  await expect(input).toHaveValue('25');
});

test('NavigationTabs exposes visible keyboard focus and moves focus with arrow keys', async ({
  page,
}) => {
  await gotoStory(page, '7-navigation-navigationtabs--with-invalid-tab');

  const generalTab = page.getByTestId('navigation-tabs-invalid-button-general');
  const detailsTab = page.getByTestId('navigation-tabs-invalid-button-details');

  await tabToTarget(page, generalTab);
  await expect(generalTab).toBeFocused();
  await expectVisibleFocusIndicator(generalTab);

  await generalTab.press('ArrowRight');

  await expect(detailsTab).toBeFocused();

  await detailsTab.press('Home');

  await expect(generalTab).toBeFocused();
});

test('NavigationIconCard exposes visible keyboard focus and the accessible name from its visible text', async ({
  page,
}) => {
  await gotoStory(page, '7-navigation-navigationiconcard--navigation-icon-card');

  const card = page.getByTestId('navigation-icon-card');

  await tabToTarget(page, card);
  await expect(card).toBeFocused();
  await expectVisibleFocusIndicator(card);
  await expect(card).toHaveAccessibleName('Obywatel');
});

test('PopoverButton exposes visible keyboard focus and opens popover content with keyboard', async ({
  page,
}) => {
  await gotoStory(page, '8-overlayer-popoverbutton--popover-button');

  const trigger = page.getByTestId('popover-button-trigger');

  await tabToTarget(page, trigger);
  await expect(trigger).toBeFocused();
  await expectVisibleFocusIndicator(trigger);

  await trigger.press('Enter');

  await expect(page.locator('[data-test-id="popover-button-content"]')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('DrawerPanel exposes dialog focus and keyboard close behavior in the browser', async ({
  page,
}) => {
  await gotoStory(page, 'internal-wcag-browser-smoke--drawer-panel');

  const openButton = page.getByTestId('drawer-panel-smoke-open');

  await tabToTarget(page, openButton);
  await expect(openButton).toBeFocused();
  await expectVisibleFocusIndicator(openButton);

  await openButton.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Panel boczny smoke' });
  const focusTarget = page.getByTestId('drawer-panel-smoke-focus-target');

  await expect(dialog).toBeVisible();
  await expect(focusTarget).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
});
