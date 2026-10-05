import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoTimePickerStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `5-form-formtimepicker--${story}`);
  await waitForStoryRender(page);
}

test("FormTimePicker Vue zachowuje ARIA, listboxy i pełną obsługę klawiatury", async ({
  page,
}) => {
  await gotoTimePickerStory(page, "playground");
  const input = page.getByRole("combobox", { name: /Godzina spotkania/ });
  const dialog = page.getByRole("dialog", {
    name: "Wybór czasu: Godzina spotkania",
  });

  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute("aria-haspopup", "dialog");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).toHaveAttribute(
    "aria-controls",
    "appointment-time-time-panel",
  );
  await input.focus();
  await page.keyboard.press("ArrowDown");
  await expect(dialog).toBeVisible();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("listbox")).toHaveCount(2);
  await expect(dialog.getByRole("option", { name: "09" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("option", { name: "30" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(input).toBeFocused();
  await expect(dialog).toBeHidden();

  await input.click();
  await expect(dialog).toBeVisible();
  await waitForFiniteAnimations(dialog);
  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const options = [
      ...element.querySelectorAll<HTMLElement>('[role="option"]'),
    ];
    return {
      bottom: rect.bottom,
      left: rect.left,
      minTarget: Math.min(
        ...options.map((option) => option.getBoundingClientRect().height),
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
    .include(".peaui-form-time-picker")
    .include(".peaui-form-time-picker__popover-content")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormTimePicker Vue mieści długą etykietę i panel w mobilnym viewporcie", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoTimePickerStory(page, "mobile-and-long-label");
  const input = page.getByRole("combobox", {
    name: /Preferowana godzina rozpoczęcia szczegółowego spotkania/,
  });
  await expect(input).toHaveAccessibleName(
    /Preferowana godzina rozpoczęcia szczegółowego spotkania podsumowującego projekt/,
  );
  await input.click();
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
