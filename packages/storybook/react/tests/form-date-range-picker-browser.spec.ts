import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoPicker(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-form-formdaterangepicker--${story}&viewMode=story`,
  );
}

test("FormDateRangePicker React zachowuje parytet ARIA i klawiatury", async ({
  page,
}) => {
  await gotoPicker(page, "default");
  const input = page.getByRole("combobox", { name: "Data początkowa" });
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
  // Keep the fade active even when a fast close/reopen skips @starting-style.
  await dialog.evaluate((element) => {
    element.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 3000 });
  });
  await waitForFiniteAnimations(page.locator("body"));
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-date-range-picker")
    .include(".peaui-form-date-range-picker__popover-content")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormDateRangePicker React mieści overlay w mobilnym viewporcie", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoPicker(page, "mobile-and-long-label");
  await page.getByRole("combobox", { name: "Data początkowa" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await waitForFiniteAnimations(dialog);
  const bounds = await dialog.evaluate((element) => {
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
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(320);
  expect(bounds.scrollWidth).toBeLessThanOrEqual(Math.ceil(bounds.width));
  expect(bounds.minDayHeight).toBeGreaterThanOrEqual(44);
});
