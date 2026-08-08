import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoColorPickerStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-form-formcolorpicker--${story}&viewMode=story`,
  );
}

test("FormColorPicker React zachowuje ARIA, klawiaturę, pointer i cele dotykowe", async ({
  page,
}) => {
  await gotoColorPickerStory(page, "default");
  const input = page.getByRole("combobox", { name: /Kolor marki/ });
  await expect(input).toHaveAttribute("aria-controls", "brand-color-panel");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.locator(".peaui-form-color-picker__toggle-icon"),
  ).toBeVisible();
  const triggerActions = await page
    .locator(".peaui-form-color-picker__field-shell")
    .evaluate((element) => {
      const arrow = element.querySelector<SVGElement>(
        ".peaui-form-color-picker__toggle-icon",
      );
      const erase = element.querySelector<HTMLElement>(
        ".peaui-form-field__erase-button",
      );
      const toggle = element.querySelector<HTMLElement>(
        ".peaui-form-color-picker__toggle",
      );
      if (!arrow || !toggle) return null;

      const arrowRect = arrow.getBoundingClientRect();
      const toggleRect = toggle.getBoundingClientRect();
      return {
        arrowHeight: arrowRect.height,
        arrowWidth: arrowRect.width,
        eraseRight: erase?.getBoundingClientRect().right ?? null,
        toggleLeft: toggleRect.left,
        viewBox: arrow.getAttribute("viewBox"),
      };
    });
  expect(triggerActions).not.toBeNull();
  expect(triggerActions?.viewBox).toBe("0 0 24 24");
  expect(triggerActions?.arrowWidth).toBe(20);
  expect(triggerActions?.arrowHeight).toBe(20);
  if (triggerActions?.eraseRight !== null) {
    expect(triggerActions?.eraseRight).toBeLessThanOrEqual(
      triggerActions?.toggleLeft ?? 0,
    );
  }
  await input.focus();
  await page.keyboard.press("ArrowDown");

  const dialog = page.getByRole("dialog", { name: "Wybierz kolor" });
  await expect(dialog).toBeVisible();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  const triggerWidth = await page
    .locator(".peaui-form-color-picker")
    .boundingBox();
  const popoverWidth = await page
    .locator(".peaui-form-color-picker__popover-content")
    .boundingBox();
  expect(triggerWidth).not.toBeNull();
  expect(popoverWidth).not.toBeNull();
  expect(
    Math.abs((triggerWidth?.width ?? 0) - (popoverWidth?.width ?? 0)),
  ).toBeLessThanOrEqual(1);

  const saturation = dialog.getByRole("slider", {
    name: "Nasycenie i jasność koloru",
  });
  await expect(saturation).toHaveAttribute(
    "aria-valuetext",
    /Nasycenie .* jasność/,
  );
  await saturation.focus();
  const beforeKeyboard = await input.inputValue();
  await page.keyboard.press("Shift+ArrowLeft");
  await expect(input).not.toHaveValue(beforeKeyboard);

  const beforePointer = await input.inputValue();
  const box = await saturation.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.25);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.65);
    await page.mouse.up();
  }
  await expect(input).not.toHaveValue(beforePointer);

  await page.keyboard.press("Escape");
  await expect(input).toBeFocused();
  await input.click();

  const metrics = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const targets = [
      ...element.querySelectorAll<HTMLElement>('button, input[type="range"]'),
    ];
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
    .include(".peaui-form-color-picker")
    .include(".peaui-form-color-picker__popover-content")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormColorPicker React mieści panel inline i długą etykietę na 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoColorPickerStory(page, "mobile-and-long-label");
  const group = page.getByRole("group", { name: "Wybierz kolor" });
  await expect(group).toBeVisible();
  const bounds = await group.evaluate((element) => {
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
