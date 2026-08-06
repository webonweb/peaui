import { expect, test, type Page } from '@playwright/test';

import { expectNoA11yViolations, gotoStory, waitForStoryRender } from './helpers/a11y';
import { getPublicBaseStories } from './helpers/library-stories';

type Setup = (page: Page) => Promise<void>;

const alreadyCoveredPublicStoryIds = new Set([
  '3-data-entry-buttonaction--button-action',
  '3-data-entry-inputslider--input-slider',
  '3-data-entry-searchinput--search-input',
  '5-form-formcheckbox--form-checkbox',
  '5-form-forminput--form-input',
  '5-form-formnumber--form-number',
  '5-form-formtextarea--form-textarea',
  '7-navigation-listlimitcontrol--list-limit-control',
  '7-navigation-navigationiconcard--navigation-icon-card',
  '7-navigation-navigationtabs--with-invalid-tab',
  '7-navigation-paginationcontrol--pagination-control',
  '8-overlayer-popoverbutton--popover-button',
]);

const setupByStoryId: Partial<Record<string, Setup>> = {
  '2-data-display-disclosurepanel--disclosure-panel': async (page) => {
    await page.getByTestId('disclosure-panel-summary').click();
    await expect(page.getByTestId('disclosure-panel-content')).toBeVisible();
  },
  '3-data-entry-buttonexport--button-export': async (page) => {
    await page.getByRole('button', { name: /lorem ipsum/i }).click();
    await expect(page.getByRole('button', { name: /^Do CSV/i })).toBeVisible();
  },
  '6-layout-fullscreencontainer--fullscreen-container': async (page) => {
    const toggle = page.getByTestId('fullscreen-container-toggle');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
  '7-navigation-navigationdisclosurecard--navigation-disclosure-card': async (page) => {
    await page.getByTestId('navigation-disclosure-card-summary').click();
    await expect(page.getByTestId('navigation-disclosure-card-content')).toBeVisible();
  },
  '8-overlayer-infotooltip--info-tooltip': async (page) => {
    await page.getByTestId('info-tooltip-content').focus();
    await expect(page.getByTestId('info-tooltip-tooltip')).toBeVisible();
  },
  '8-overlayer-popoveroverlayer--popover-overlayer': async (page) => {
    await page.getByTestId('popover-overlayer-trigger').click();
    await expect(page.locator('[data-test-id="popover-overlayer-content"]')).toBeVisible();
  },
};

const uncoveredBaseStories = getPublicBaseStories().filter(
  (story) => !alreadyCoveredPublicStoryIds.has(story.id),
);

for (const story of uncoveredBaseStories) {
  test(`${story.componentName} base story is covered by browser axe audit`, async ({
    page,
  }) => {
    await gotoStory(page, story.id);
    await waitForStoryRender(page);
    await setupByStoryId[story.id]?.(page);
    await expectNoA11yViolations(page, story.componentName);
  });
}
