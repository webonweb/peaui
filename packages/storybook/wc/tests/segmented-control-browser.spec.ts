import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoSegmentedControlStory(
  page: Page,
  story: string,
): Promise<void> {
  await page.goto(
    `/iframe.html?id=3-data-entry-segmentedcontrol-wc--${story}&viewMode=story`,
  );
}

test("SegmentedControl WC realizuje automatic activation, roving focus i poprawne ARIA", async ({
  page,
}) => {
  await gotoSegmentedControlStory(page, "default");
  const group = page.getByRole("radiogroup", { name: "Sposób wyświetlania" });
  const radios = group.getByRole("radio");

  expect(
    await group.evaluate((element) => {
      const item = element.querySelector<HTMLElement>(
        ".peaui-segmented-control__item",
      )!;
      return {
        groupRadius: getComputedStyle(element).borderRadius,
        itemFontWeight: getComputedStyle(item).fontWeight,
        itemRadius: getComputedStyle(item).borderRadius,
      };
    }),
  ).toEqual({ groupRadius: "10px", itemFontWeight: "500", itemRadius: "6px" });

  await radios.nth(1).focus();
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(2)).toBeFocused();
  await expect(radios.nth(2)).toHaveAttribute("aria-checked", "true");
  expect(await group.locator('[role="radio"][tabindex="0"]').count()).toBe(1);
  expect(
    await group.locator('[role="radio"][aria-checked="true"]').count(),
  ).toBe(1);

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-segmented-control")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("SegmentedControl WC aktualizuje wskaźnik po resize i respektuje reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 900 });
  await gotoSegmentedControlStory(page, "distribution-and-width");
  const group = page.getByRole("radiogroup", { name: "Pełna szerokość" });
  const selected = group.getByRole("radio", { checked: true });
  const indicator = group.locator(".peaui-segmented-control__indicator");

  await expect
    .poll(async () => (await indicator.boundingBox())?.width)
    .toBeGreaterThan(0);
  await page.setViewportSize({ height: 720, width: 480 });
  await expect
    .poll(async () => {
      const indicatorBox = await indicator.boundingBox();
      const selectedBox = await selected.boundingBox();
      return Math.abs((indicatorBox?.width ?? 0) - (selectedBox?.width ?? 1));
    })
    .toBeLessThan(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoSegmentedControlStory(page, "reduced-motion");
  await expect
    .poll(() =>
      page
        .locator(".peaui-segmented-control__indicator")
        .evaluate((element) => getComputedStyle(element).transitionDuration),
    )
    .toBe("0s");
});

test("SegmentedControl WC utrzymuje aktywny segment w mobilnym overflow i cel 44 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoSegmentedControlStory(page, "mobile-overflow");
  const group = page.getByRole("radiogroup", { name: "Zakres raportu" });
  const radios = group.getByRole("radio");
  const lastRadio = radios.last();
  await lastRadio.evaluate((button) => (button as HTMLElement).click());
  await expect(lastRadio).toHaveAttribute("aria-checked", "true");
  await expect
    .poll(() =>
      group.evaluate((element) => {
        const selected = element.querySelector<HTMLElement>(
          '[aria-checked="true"]',
        )!;
        const groupRect = element.getBoundingClientRect();
        const selectedRect = selected.getBoundingClientRect();
        return (
          selectedRect.left >= groupRect.left - 1 &&
          selectedRect.right <= groupRect.right + 1
        );
      }),
    )
    .toBe(true);

  const metrics = await group.evaluate((element) => {
    const selected = element.querySelector<HTMLElement>(
      '[aria-checked="true"]',
    )!;
    const groupRect = element.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();
    return {
      clientWidth: element.clientWidth,
      minHeight: Math.min(
        ...[...element.querySelectorAll<HTMLElement>('[role="radio"]')].map(
          (radio) => radio.getBoundingClientRect().height,
        ),
      ),
      scrollWidth: element.scrollWidth,
      selectedInside:
        selectedRect.left >= groupRect.left - 1 &&
        selectedRect.right <= groupRect.right + 1,
    };
  });

  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(metrics.minHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.selectedInside).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});


test("SegmentedControl exposes all disabled labels without keyboard scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoSegmentedControlStory(page, "disabled-states");
  const group = page.locator('.peaui-segmented-control[aria-disabled="true"]');
  await expect(group).toBeVisible();
  const metrics = await group.evaluate(element => ({ width: element.clientWidth, scrollWidth: element.scrollWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
  await expect(group.locator('button:not(:disabled), [tabindex="0"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).include('.peaui-segmented-control').analyze()).violations).toEqual([]);
});
