import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoDateTimePickerStory(
  page: Page,
  story: string,
): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-form-formdatetimepicker--${story}&viewMode=story`,
  );
}

test("FormDateTimePicker React zachowuje ARIA, klawiaturę i cele dotykowe", async ({
  page,
}) => {
  await gotoDateTimePickerStory(page, "default");
  const input = page.getByRole("combobox", { name: /Termin spotkania/ });
  await expect(input).toHaveAttribute(
    "aria-controls",
    "appointment-date-time-panel",
  );
  await input.focus();
  await page.keyboard.press("ArrowDown");
  const dialog = page.getByRole("dialog", { name: "Wybierz datę i czas" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("gridcell")).toHaveCount(42);
  await expect(dialog.locator('[data-date="2026-08-18"]')).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator('[data-date="2026-08-19"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(input).toBeFocused();

  // A slow opening transition reproduces contrast measurements taken mid-animation.
  await page.addStyleTag({
    content:
      ".peaui-popover-overlayer__content[popover] { transition-duration: 1s; }",
  });
  await input.click();
  await waitForFiniteAnimations(dialog);
  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const targets = [...element.querySelectorAll<HTMLElement>("button")];
    return {
      bottom: rect.bottom,
      left: rect.left,
      minTarget: Math.min(
        ...targets.map((target) => target.getBoundingClientRect().height),
      ),
      right: rect.right,
      top: rect.top,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(1280);
  expect(metrics.top).toBeGreaterThanOrEqual(0);
  expect(metrics.bottom).toBeLessThanOrEqual(900);
  expect(metrics.minTarget).toBeGreaterThanOrEqual(44);
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-date-time-picker")
    .include(".peaui-form-date-time-picker__popover-content")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormDateTimePicker React nie powoduje poziomego scrolla na 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoDateTimePickerStory(page, "mobile-and-long-label");
  await page.getByRole("combobox", { name: "Data" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await waitForFiniteAnimations(dialog);
  const bounds = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(320);
  expect(bounds.width).toBeLessThanOrEqual(320);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

test("FormDateTimePicker react native form actions meet WCAG 2.2 target sizes", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 });
  await gotoDateTimePickerStory(page, "native-required-and-reset");
  const form = page.locator("form");
  for (const name of ["Validate", "Reset"]) {
    const action = form.getByRole("button", { name, exact: true });
    await expect(action).toBeVisible();
    const bounds = await action.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(24);
    expect(bounds?.height).toBeGreaterThanOrEqual(24);
  }
  const accessibility = await new AxeBuilder({ page })
    .include("form")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
