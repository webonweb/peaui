import { expect, test } from '@playwright/test';

import { gotoStory, waitForStoryRender } from './helpers/a11y';
import { getPublicBaseStories } from './helpers/library-stories';

const mobileViewport = { width: 390, height: 844 };

for (const story of getPublicBaseStories()) {
  test(`${story.componentName} does not overflow the mobile viewport`, async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoStory(page, story.id);
    await waitForStoryRender(page);

    const layout = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>('#storybook-root');

      if (!root) {
        throw new Error('Storybook root is missing.');
      }

      return {
        documentClientWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        rootClientWidth: root.clientWidth,
        rootScrollWidth: root.scrollWidth,
      };
    });

    expect(layout.documentScrollWidth, JSON.stringify(layout, null, 2)).toBeLessThanOrEqual(
      layout.documentClientWidth + 1,
    );
    expect(layout.rootScrollWidth, JSON.stringify(layout, null, 2)).toBeLessThanOrEqual(
      layout.rootClientWidth + 1,
    );
  });
}
