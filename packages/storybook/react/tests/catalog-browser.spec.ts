import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { reactComponentCatalog } from '../../../library/src/react/generated-react-catalog';

const disabledAxeRules = ['landmark-one-main', 'page-has-heading-one', 'region'];

function getStoryId(category: string, name: string): string {
  return `react-${category}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

for (const component of reactComponentCatalog) {
  test(`${component.name} renders without browser or WCAG errors`, async ({ page }) => {
    const runtimeErrors: string[] = [];

    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text());
    });

    const storyId = `${getStoryId(component.category, component.name)}--default`;
    const response = await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

    expect(response?.ok(), `Could not load ${storyId}.`).toBe(true);
    await expect(page.locator('#storybook-root > *').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Couldn't find story|Exception in/i);

    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .withTags(['wcag2a', 'wcag2aa'])
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

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
    expect(results.violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}
