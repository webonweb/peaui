import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { getWebComponentStories } from "./helpers/library-stories";

const disabledAxeRules = [
  "landmark-one-main",
  "page-has-heading-one",
  "region",
];
const tableListVariants = [
  "selectable-rows",
  "single-selection",
  "multi-column-sort",
  "all-column-types",
  "workflow-and-details",
  "column-visibility",
  "editable",
  "empty-state",
  "loading",
];

async function expectNoMobileViewportOverflow(page: Page): Promise<void> {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

  const layout = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;

    return {
      clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowingElements: [...document.querySelectorAll<HTMLElement>("body *")]
        .filter(
          (element) => element.getBoundingClientRect().right > clientWidth + 1,
        )
        .slice(0, 8)
        .map((element) => ({
          className: element.className,
          right: Math.round(element.getBoundingClientRect().right),
          tagName: element.tagName.toLowerCase(),
        })),
    };
  });

  expect(
    layout.scrollWidth,
    JSON.stringify(layout, null, 2),
  ).toBeLessThanOrEqual(layout.clientWidth + 1);
}

async function expectStoryHasNoErrors(
  page: Page,
  storyId: string,
): Promise<void> {
  const runtimeErrors: string[] = [];

  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const response = await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

  expect(response?.ok(), `Could not load ${storyId}.`).toBe(true);
  await expect(page.locator("#storybook-root > *").first()).toBeAttached();
  await expect(page.locator("body")).not.toContainText(
    /Couldn't find story|Exception in/i,
  );

  const results = await new AxeBuilder({ page })
    .include("#storybook-root")
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .disableRules(disabledAxeRules)
    .analyze();

  const violations = results.violations.map((violation) => ({
    help: violation.help,
    id: violation.id,
    nodes: violation.nodes.map((node) => ({
      failureSummary: node.failureSummary,
      html: node.html,
      target: node.target,
    })),
  }));

  expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);
  expect(results.violations, JSON.stringify(violations, null, 2)).toEqual([]);
  await expectNoMobileViewportOverflow(page);
}

for (const story of getWebComponentStories()) {
  test(`${story.componentName} renders without browser or WCAG errors`, async ({
    page,
  }) => {
    await expectStoryHasNoErrors(page, story.id);
  });
}

for (const variant of tableListVariants) {
  test(`TableList ${variant} renders without browser, WCAG or mobile layout errors`, async ({
    page,
  }) => {
    await expectStoryHasNoErrors(page, `2-data-display-tablelist--${variant}`);
  });
}
