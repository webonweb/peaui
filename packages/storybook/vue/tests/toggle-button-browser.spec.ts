import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoToggleStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `3-data-entry-togglebutton--${story}`);
  await waitForStoryRender(page);
}

test("ToggleButton Vue zachowuje natywną klawiaturę, stałą nazwę i semantykę ARIA", async ({
  page,
}) => {
  await gotoToggleStory(page, "playground");
  const button = page.locator(".peaui-toggle-button");

  expect(
    await button.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        borderRadius: styles.borderRadius,
        fontWeight: styles.fontWeight,
        stateMarkers: element.querySelectorAll(
          ".peaui-toggle-button__state-marker",
        ).length,
      };
    }),
  ).toEqual({ borderRadius: "8px", fontWeight: "500", stateMarkers: 0 });

  await expect(button).toHaveAttribute("type", "button");
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect(button).toHaveAccessibleName("Pokaż podgląd");
  await button.focus();
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(button).toHaveAccessibleName("Pokaż podgląd");
  await expect(button.locator(".peaui-toggle-button__label")).toHaveText(
    "Podgląd widoczny",
  );

  const outlineWidth = await button.evaluate(
    (element) => getComputedStyle(element).outlineWidth,
  );
  expect(outlineWidth).not.toBe("0px");

  const pressedAccessibility = await new AxeBuilder({ page })
    .include(".peaui-toggle-button")
    .analyze();
  expect(pressedAccessibility.violations).toEqual([]);

  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "false");

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-toggle-button")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("ToggleButton Vue nie zmienia wartości w stanach blokujących", async ({
  page,
}) => {
  await gotoToggleStory(page, "blocking-states");
  const disabled = page.getByTestId("toggle-disabled");
  const readonly = page.getByTestId("toggle-readonly");
  const loading = page.getByTestId("toggle-loading");

  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute("aria-pressed", "true");
  await expect(readonly).not.toHaveAttribute("disabled", "");
  await expect(readonly).toHaveAttribute("aria-disabled", "true");
  await readonly.focus();
  await expect(readonly).toBeFocused();
  await page.keyboard.press("Space");
  await expect(readonly).toHaveAttribute("aria-pressed", "true");
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(loading).toHaveAccessibleDescription(
    "Trwa aktualizowanie ustawienia",
  );
});

test("ToggleButton Vue zawija tekst i utrzymuje cel dotykowy na mobile", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoToggleStory(page, "responsive-long-content");
  const metrics = await page
    .locator(".peaui-toggle-button")
    .evaluate((button) => {
      const label = button.querySelector(".peaui-toggle-button__label")!;
      return {
        buttonHeight: button.getBoundingClientRect().height,
        labelHeight: label.getBoundingClientRect().height,
        rootRight: button.getBoundingClientRect().right,
      };
    });

  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.labelHeight).toBeGreaterThan(21);
  expect(metrics.rootRight).toBeLessThanOrEqual(320);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
