import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoPicker(page: Page, story: string): Promise<void> {
  await gotoStory(page, `5-form-formdaterangepicker--${story}`);
  await waitForStoryRender(page);
}

test("FormDateRangePicker Vue zachowuje ARIA, klawiaturę i cele dotykowe", async ({
  page,
}) => {
  await gotoPicker(page, "playground");
  const input = page.getByRole("combobox", { name: "Data początkowa" });
  await expect(input).toHaveAttribute("aria-controls", "reporting-range-panel");
  await input.focus();
  const inputFocusStyle = await input.evaluate((element) => {
    const style = getComputedStyle(element);
    const field = element.closest<HTMLElement>(
      ".peaui-form-date-range-picker__range-fields",
    );
    return {
      fieldBoxShadow: field ? getComputedStyle(field).boxShadow : "none",
      inputBoxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
    };
  });
  expect(inputFocusStyle.outlineStyle).toBe("none");
  expect(inputFocusStyle.inputBoxShadow).toBe("none");
  expect(inputFocusStyle.fieldBoxShadow).not.toBe("none");
  await page.keyboard.press("ArrowDown");
  const dialog = page.getByRole("dialog", { name: "Wybierz zakres dat" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("grid")).toHaveCount(2);
  await expect(dialog.getByRole("gridcell")).toHaveCount(84);
  const active = dialog.locator('[data-date="2026-08-10"]').first();
  await expect(active).toBeFocused();
  const focusStyle = await active.evaluate((element) => {
    const style = getComputedStyle(element);
    return { boxShadow: style.boxShadow, outlineStyle: style.outlineStyle };
  });
  expect(focusStyle.outlineStyle).toBe("none");
  expect(focusStyle.boxShadow).toContain("inset");
  await page.keyboard.press("ArrowRight");
  await expect(
    dialog.locator('[data-date="2026-08-11"]').first(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(input).toBeFocused();

  await input.click();
  await expect(dialog).toBeVisible();
  // Exercise a slow entry fade when the dialog is reopened.
  await dialog.evaluate((element) => {
    element.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 3000 });
  });
  await waitForFiniteAnimations(dialog);
  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const calendarTargets = [
      ...element.querySelectorAll<HTMLElement>(
        '[role="gridcell"], .peaui-form-date-picker-navigation__button',
      ),
    ];
    const presetTargets = [
      ...element.querySelectorAll<HTMLElement>(
        ".peaui-form-date-range-picker__preset",
      ),
    ];
    return {
      bottom: rect.bottom,
      left: rect.left,
      minCalendarTarget: Math.min(
        ...calendarTargets.map(
          (target) => target.getBoundingClientRect().height,
        ),
      ),
      minPresetTarget: Math.min(
        ...presetTargets.map((target) => target.getBoundingClientRect().height),
      ),
      right: rect.right,
      top: rect.top,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(1280);
  expect(metrics.top).toBeGreaterThanOrEqual(0);
  expect(metrics.bottom).toBeLessThanOrEqual(900);
  expect(metrics.minCalendarTarget).toBeGreaterThanOrEqual(44);
  expect(metrics.minPresetTarget).toBeGreaterThanOrEqual(24);
  expect(metrics.minPresetTarget).toBeLessThan(44);

  await waitForFiniteAnimations(page.locator("body"));
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-date-range-picker")
    .include(".peaui-form-date-range-picker__popover-content")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormDateRangePicker Vue nie ściska kalendarzy ani nie przewija strony na 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoPicker(page, "mobile-and-long-label");
  await page.getByRole("combobox", { name: "Data początkowa" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await waitForFiniteAnimations(dialog);
  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const days = [
      ...element.querySelectorAll<HTMLElement>('[role="gridcell"]'),
    ];
    return {
      left: rect.left,
      minDayHeight: Math.min(
        ...days.map((day) => day.getBoundingClientRect().height),
      ),
      right: rect.right,
      scrollWidth: element.scrollWidth,
      width: rect.width,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(320);
  expect(metrics.width).toBeLessThanOrEqual(320);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(Math.ceil(metrics.width));
  expect(metrics.minDayHeight).toBeGreaterThanOrEqual(44);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
