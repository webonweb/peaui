import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoPicker(
  page: Page,
  name: "formdatepicker" | "formyearpicker",
): Promise<void> {
  await page.goto(`/iframe.html?id=react-form-${name}--default&viewMode=story`);
}

async function expectOpenPickerIsAccessible(
  page: Page,
  rootClass: string,
): Promise<void> {
  const accessibility = await new AxeBuilder({ page })
    .include(`.${rootClass}`)
    .include(`.${rootClass}__popover-content`)
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
}

test("FormDatePicker React odwzorowuje siatkę, widoki i zarządzanie fokusem Vue", async ({
  page,
}) => {
  await gotoPicker(page, "formdatepicker");
  const input = page.getByRole("combobox", { name: "Data wykonania" });
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await input.focus();
  await page.keyboard.press("ArrowDown");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("gridcell")).toHaveCount(42);
  const selectedDay = dialog.locator(
    '[data-picker-option][data-selected="true"]',
  );
  await expect(selectedDay).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(selectedDay).not.toBeFocused();

  await dialog
    .getByRole("button", { name: "Wybierz rok, obecnie 2026" })
    .click();
  await expect(dialog.getByRole("gridcell")).toHaveCount(10);
  await expect(
    dialog.getByRole("button", { name: "Wybierz rok 2026" }),
  ).toBeVisible();
  await expectOpenPickerIsAccessible(page, "peaui-form-date-picker");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(input).toBeFocused();
});

test("FormYearPicker React odwzorowuje dekadę, klawiaturę i ARIA Vue", async ({
  page,
}) => {
  await gotoPicker(page, "formyearpicker");
  const input = page.getByRole("combobox", { name: "Rok budowy" });
  await input.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("gridcell")).toHaveCount(10);
  const selectedYear = dialog.locator(
    '[data-picker-option][data-selected="true"]',
  );
  await expect(selectedYear).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(selectedYear).not.toBeFocused();
  await expectOpenPickerIsAccessible(page, "peaui-form-year-picker");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(input).toBeFocused();
});
