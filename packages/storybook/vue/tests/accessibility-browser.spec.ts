import { expect, test, type Locator, type Page } from '@playwright/test';

import { expectNoA11yViolations, gotoStory } from './helpers/a11y';

type AccessibilityScenario = {
  id: string;
  name: string;
  ready: (page: Page) => Locator;
  setup?: (page: Page) => Promise<void>;
};

const accessibilityScenarios: AccessibilityScenario[] = [
  {
    id: '3-data-entry-buttonaction--button-action',
    name: 'ButtonAction',
    ready: (page) => page.getByRole('button', { name: /lorem ipsum/i }),
  },
  {
    id: '3-data-entry-searchinput--search-input',
    name: 'SearchInput',
    ready: (page) => page.getByTestId('search-input'),
  },
  {
    id: '3-data-entry-inputslider--input-slider',
    name: 'InputSlider',
    ready: (page) => page.getByTestId('input-slider'),
  },
  {
    id: '5-form-forminput--form-input',
    name: 'FormInput',
    ready: (page) => page.getByLabel('Lorem ipsum'),
  },
  {
    id: '5-form-formnumber--form-number',
    name: 'FormNumber',
    ready: (page) => page.getByTestId('form-number-element'),
  },
  {
    id: '5-form-formtextarea--form-textarea',
    name: 'FormTextarea',
    ready: (page) => page.getByTestId('form-textarea-element'),
  },
  {
    id: '5-form-formcheckbox--form-checkbox',
    name: 'FormCheckbox',
    ready: (page) => page.getByTestId('form-checkbox-element'),
  },
  {
    id: 'internal-wcag-browser-smoke--form-select',
    name: 'FormSelect',
    ready: (page) => page.getByTestId('form-select-smoke-element'),
    setup: async (page) => {
      const input = page.getByTestId('form-select-smoke-element');

      await input.press('ArrowDown');
      await expect(page.getByTestId('form-select-smoke-listbox')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--form-date-picker',
    name: 'FormDatePicker',
    ready: (page) => page.getByTestId('form-date-picker-smoke-element'),
    setup: async (page) => {
      const input = page.getByTestId('form-date-picker-smoke-element');

      await input.press('Enter');
      await expect(page.getByTestId('form-date-picker-smoke-panel')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--form-year-picker',
    name: 'FormYearPicker',
    ready: (page) => page.getByTestId('form-year-picker-smoke-element'),
    setup: async (page) => {
      const input = page.getByTestId('form-year-picker-smoke-element');

      await input.press('Enter');
      await expect(page.getByTestId('form-year-picker-smoke-panel')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--form-multi-select',
    name: 'FormMultiSelect',
    ready: (page) => page.getByTestId('form-multiselect-smoke-element'),
    setup: async (page) => {
      const input = page.getByTestId('form-multiselect-smoke-element');

      await input.press('ArrowDown');
      await expect(page.getByTestId('form-multiselect-smoke-listbox')).toBeVisible();
    },
  },
  {
    id: '7-navigation-paginationcontrol--pagination-control',
    name: 'PaginationControl',
    ready: (page) => page.getByTestId('pagination-control'),
  },
  {
    id: '7-navigation-listlimitcontrol--list-limit-control',
    name: 'ListLimitControl',
    ready: (page) => page.getByTestId('list-limit-control'),
    setup: async (page) => {
      const input = page.getByTestId('list-limit-control-select-element');

      await input.press('ArrowDown');
      await expect(page.getByTestId('list-limit-control-select-listbox')).toBeVisible();
    },
  },
  {
    id: '7-navigation-navigationtabs--with-invalid-tab',
    name: 'NavigationTabs',
    ready: (page) => page.getByTestId('navigation-tabs-invalid'),
  },
  {
    id: '7-navigation-navigationiconcard--navigation-icon-card',
    name: 'NavigationIconCard',
    ready: (page) => page.getByTestId('navigation-icon-card'),
  },
  {
    id: '8-overlayer-popoverbutton--popover-button',
    name: 'PopoverButton',
    ready: (page) => page.getByTestId('popover-button-trigger'),
    setup: async (page) => {
      await page.getByTestId('popover-button-trigger').click();
      await expect(page.locator('[data-test-id="popover-button-content"]')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--drawer-panel',
    name: 'DrawerPanel',
    ready: (page) => page.getByTestId('drawer-panel-smoke-open'),
    setup: async (page) => {
      await page.getByTestId('drawer-panel-smoke-open').click();
      await expect(page.getByTestId('drawer-panel-smoke')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--modal-dialog',
    name: 'ModalDialog',
    ready: (page) => page.getByTestId('modal-dialog-smoke-open'),
    setup: async (page) => {
      await page.getByTestId('modal-dialog-smoke-open').click();
      await expect(page.getByTestId('modal-dialog-smoke')).toBeVisible();
    },
  },
  {
    id: 'internal-wcag-browser-smoke--breadcrumbs',
    name: 'Breadcrumbs',
    ready: (page) => page.getByTestId('breadcrumbs-smoke'),
  },
  {
    id: 'internal-wcag-browser-smoke--table-list',
    name: 'TableList',
    ready: (page) => page.getByTestId('table-list-smoke'),
  },
  {
    id: 'internal-wcag-browser-smoke--tree-list',
    name: 'TreeList',
    ready: (page) => page.getByTestId('tree-list-smoke'),
    setup: async (page) => {
      const trigger = page.getByTestId('tree-list-smoke-trigger');

      await trigger.press('Enter');
      await expect(page.getByTestId('tree-list-smoke-content')).toBeVisible();
    },
  },
];

for (const scenario of accessibilityScenarios) {
  test(`${scenario.name} has no browser-detected WCAG violations in Storybook`, async ({
    page,
  }) => {
    await gotoStory(page, scenario.id);
    await expect(scenario.ready(page)).toBeVisible();
    await scenario.setup?.(page);
    await expectNoA11yViolations(page, scenario.name);
  });
}
