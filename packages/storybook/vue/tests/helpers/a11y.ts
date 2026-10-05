import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

import { waitForFiniteAnimations } from '../../../helpers/animations.mts';

const AXE_DISABLED_RULES = [
  'landmark-one-main',
  'page-has-heading-one',
  'region',
];

export function storyPath(id: string): string {
  return `/iframe.html?id=${id}&viewMode=story`;
}

export async function gotoStory(page: Page, id: string): Promise<void> {
  await page.goto(storyPath(id));
  await expect(page.locator('#storybook-root')).toBeAttached();
}

export async function waitForStoryRender(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const storyRoot = document.querySelector('#storybook-root');

    return Boolean(storyRoot?.firstElementChild);
  });
}

export async function expectVisibleFocusIndicator(target: Locator): Promise<void> {
  const focusState = await target.evaluate((element) => {
    const computed = window.getComputedStyle(element);

    return {
      boxShadow: computed.boxShadow,
      isFocusVisible: element.matches(':focus-visible'),
      outlineStyle: computed.outlineStyle,
      outlineWidth: computed.outlineWidth,
    };
  });

  const hasOutline = focusState.outlineStyle !== 'none' && focusState.outlineWidth !== '0px';
  const hasShadow = focusState.boxShadow !== 'none';

  expect(hasOutline || hasShadow || focusState.isFocusVisible).toBe(true);
}

export async function tabToTarget(page: Page, target: Locator, maxTabs = 30): Promise<void> {
  await expect(target).toBeVisible();
  await target.scrollIntoViewIfNeeded();

  await page.locator('#storybook-root').click({ position: { x: 1, y: 1 } });

  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab');

    const isFocused = await target.evaluate((element) => element === document.activeElement);

    if (isFocused) {
      return;
    }
  }

  throw new Error(`Could not reach focus target after ${maxTabs} Tab presses.`);
}

export async function expectNoA11yViolations(page: Page, context: string): Promise<void> {
  await waitForFiniteAnimations(page.locator('#storybook-root'));
  const results = await new AxeBuilder({ page })
    .include('#storybook-root')
    .exclude('[class*="story-settings"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .disableRules(AXE_DISABLED_RULES)
    .analyze();

  const formattedViolations = results.violations.map((violation) => ({
    description: violation.description,
    help: violation.help,
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => ({
      failureSummary: node.failureSummary,
      html: node.html,
      target: node.target,
    })),
  }));

  expect(
    results.violations,
    `${context}:\n${JSON.stringify(formattedViolations, null, 2)}`,
  ).toEqual([]);
}
