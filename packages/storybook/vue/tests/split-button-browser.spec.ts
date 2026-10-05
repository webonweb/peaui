import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoSplitButtonStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `3-data-entry-splitbutton--${story}`);
  await waitForStoryRender(page);
}

test("SplitButton Vue zachowuje rosnącą skalę fontu od xxs do l", async ({
  page,
}) => {
  await gotoSplitButtonStory(page, "variants-and-sizes");
  const sizes = ["xxs", "xs", "s", "m", "l"];
  const metrics = await Promise.all(
    sizes.map((size) =>
      page
        .locator(`.peaui-split-button--size-${size}`)
        .last()
        .evaluate((group) => {
          const primary = group.querySelector<HTMLElement>(
            ".peaui-split-button__primary",
          )!;
          const trigger = group.querySelector<HTMLElement>(
            ".peaui-split-button__trigger",
          )!;
          return {
            primaryFontSize: Number.parseFloat(
              getComputedStyle(primary).fontSize,
            ),
            primaryHeight: primary.getBoundingClientRect().height,
            triggerFontSize: Number.parseFloat(
              getComputedStyle(trigger).fontSize,
            ),
            triggerHeight: trigger.getBoundingClientRect().height,
          };
        }),
    ),
  );

  expect(metrics.map(({ primaryFontSize }) => primaryFontSize)).toEqual([
    10, 12, 14, 16, 18,
  ]);
  expect(metrics.map(({ triggerFontSize }) => triggerFontSize)).toEqual([
    10, 12, 14, 16, 18,
  ]);
  for (const metric of metrics) {
    expect(metric.primaryHeight).toBeGreaterThanOrEqual(44);
    expect(metric.triggerHeight).toBe(metric.primaryHeight);
  }
});

test("SplitButton Vue rozdziela akcje, zachowuje ARIA i pełną obsługę klawiatury", async ({
  page,
}) => {
  await gotoSplitButtonStory(page, "playground");
  const group = page.getByRole("group", { name: "Akcje eksportu" });
  const primary = page.getByRole("button", { name: "Eksportuj" });
  const trigger = page.getByRole("button", {
    name: "Więcej opcji eksportu",
  });
  const menu = page.locator(".peaui-split-button [role=menu]");

  await expect(primary).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute(
    "aria-controls",
    await menu.getAttribute("id"),
  );

  const metrics = await group.evaluate((element) => {
    const primaryButton = element.querySelector<HTMLElement>(
      ".peaui-split-button__primary",
    )!;
    const menuButton = element.querySelector<HTMLElement>(
      ".peaui-split-button__trigger",
    )!;
    const primaryRect = primaryButton.getBoundingClientRect();
    const menuRect = menuButton.getBoundingClientRect();
    return {
      gap: Math.abs(primaryRect.right - menuRect.left),
      primaryHeight: primaryRect.height,
      primaryRadiusEnd: getComputedStyle(primaryButton).borderTopRightRadius,
      triggerHeight: menuRect.height,
      triggerRadiusStart: getComputedStyle(menuButton).borderTopLeftRadius,
    };
  });
  // Layout engines can differ by a fraction of a CSS pixel at the shared edge.
  expect(metrics.gap).toBeCloseTo(0, 3);
  expect(metrics).toMatchObject({
    primaryHeight: 54,
    primaryRadiusEnd: "0px",
    triggerHeight: 54,
    triggerRadiusStart: "0px",
  });

  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const firstItem = page.getByRole("menuitem", { name: "Eksportuj jako PDF" });
  await expect(firstItem).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-split-button")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("SplitButton Vue nie przepełnia viewportu i zachowuje pełną nazwę przy długiej etykiecie", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoSplitButtonStory(page, "mobile-and-long-label");
  const group = page.getByRole("group", {
    name: "Akcje bardzo długiego raportu",
  });
  const primary = page.getByRole("button", {
    name: "Eksportuj bardzo długi raport podsumowujący cały kwartał",
  });
  const trigger = page.getByRole("button", {
    name: "Więcej opcji eksportu raportu",
  });

  await expect(primary).toHaveAccessibleName(
    "Eksportuj bardzo długi raport podsumowujący cały kwartał",
  );
  await trigger.click();
  await expect(page.getByRole("menu")).toBeVisible();
  const bounds = await group.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const menu = element.querySelector<HTMLElement>('[role="menu"]')!;
    const menuRect = menu.getBoundingClientRect();
    return {
      groupRight: rect.right,
      menuLeft: menuRect.left,
      menuRight: menuRect.right,
      minControlHeight: Math.min(
        ...[
          ...element.querySelectorAll<HTMLElement>(
            ".peaui-split-button__primary, .peaui-split-button__trigger",
          ),
        ].map((button) => button.getBoundingClientRect().height),
      ),
    };
  });
  expect(bounds.groupRight).toBeLessThanOrEqual(320);
  expect(bounds.menuLeft).toBeGreaterThanOrEqual(0);
  expect(bounds.menuRight).toBeLessThanOrEqual(320);
  expect(bounds.minControlHeight).toBeGreaterThanOrEqual(44);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
