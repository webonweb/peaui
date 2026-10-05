import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoRatingStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-form-formratinginput--${story}&viewMode=story`,
  );
}

test("FormRatingInput React zachowuje jeden tab stop, klawiaturę, ARIA i cele dotykowe", async ({
  page,
}) => {
  await gotoRatingStory(page, "default");
  const root = page.locator(".peaui-form-rating-input");
  const slider = page.getByRole("slider", { name: "Ocena obsługi" });

  await expect(slider).toHaveCount(1);
  await expect(slider).toHaveAttribute("aria-valuenow", "3.5");
  await expect(slider).toHaveAttribute(
    "aria-valuetext",
    "3,5 z 5 — Bardzo dobra",
  );

  const secondItem = root.locator(".peaui-form-rating-input__item").nth(1);
  const visualMetrics = async () =>
    root.evaluate((element) => {
      const item = element.querySelectorAll<HTMLElement>(
        ".peaui-form-rating-input__item",
      )[1];
      const fill = element.querySelector<HTMLElement>(
        ".peaui-form-rating-input__icon--fill",
      );
      const valueLabel = element.querySelector<HTMLElement>(
        ".peaui-form-rating-input__value-label",
      );
      const colorProbe = document.createElement("span");
      colorProbe.style.color = "var(--peaui-color-primary-700)";
      element.append(colorProbe);
      const rootRect = element.getBoundingClientRect();
      const metrics = {
        fillColor: fill ? getComputedStyle(fill).color : "",
        itemTop: item?.getBoundingClientRect().top ?? 0,
        primaryColor: getComputedStyle(colorProbe).color,
        rootLeft: rootRect.left,
        rootWidth: rootRect.width,
        rowHeight:
          element
            .querySelector<HTMLElement>(".peaui-form-rating-input__control-row")
            ?.getBoundingClientRect().height ?? 0,
        valueLabelHeight: valueLabel?.getBoundingClientRect().height ?? 0,
      };
      colorProbe.remove();
      return metrics;
    });
  const layoutBeforePreview = await visualMetrics();
  await secondItem.hover({ position: { x: 4, y: 22 } });
  await page.waitForTimeout(180);
  const layoutDuringPreview = await visualMetrics();
  expect(layoutBeforePreview.fillColor).toBe(layoutBeforePreview.primaryColor);
  expect(layoutBeforePreview.valueLabelHeight).toBeGreaterThanOrEqual(44);
  expect(layoutDuringPreview.itemTop).toBeCloseTo(
    layoutBeforePreview.itemTop,
    1,
  );
  expect(layoutDuringPreview.rowHeight).toBeCloseTo(
    layoutBeforePreview.rowHeight,
    1,
  );

  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "4");
  await page.mouse.move(0, 0);
  const layoutAfterChange = await visualMetrics();
  expect(layoutAfterChange.rootLeft).toBeCloseTo(
    layoutBeforePreview.rootLeft,
    1,
  );
  expect(layoutAfterChange.rootWidth).toBeCloseTo(
    layoutBeforePreview.rootWidth,
    1,
  );
  await page.keyboard.press("Delete");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await expect(slider).toHaveAttribute("aria-valuetext", "Brak oceny z 5");

  const metrics = await root.evaluate((element) => {
    const items = [
      ...element.querySelectorAll<HTMLElement>(
        ".peaui-form-rating-input__item",
      ),
    ];
    return {
      minHeight: Math.min(
        ...items.map((item) => item.getBoundingClientRect().height),
      ),
      minWidth: Math.min(
        ...items.map((item) => item.getBoundingClientRect().width),
      ),
      tabStops: [...element.querySelectorAll<HTMLElement>("*")].filter(
        (candidate) =>
          candidate.tabIndex >= 0 && !candidate.hasAttribute("disabled"),
      ).length,
    };
  });
  expect(metrics.minHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.minWidth).toBeGreaterThanOrEqual(44);
  expect(metrics.tabStops).toBe(1);

  await waitForFiniteAnimations(page.locator("body"));
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-rating-input")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormRatingInput React zawija dziesięć ocen i długą etykietę bez overflow na 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoRatingStory(page, "mobile-and-long-label");
  const root = page.locator(".peaui-form-rating-input");
  await expect(root.locator(".peaui-form-rating-input__item")).toHaveCount(10);

  const metrics = await root.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const items = [
      ...element.querySelectorAll<HTMLElement>(
        ".peaui-form-rating-input__item",
      ),
    ];
    return {
      documentWidth: document.documentElement.scrollWidth,
      left: rect.left,
      right: rect.right,
      rows: new Set(
        items.map((item) => Math.round(item.getBoundingClientRect().top)),
      ).size,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(320);
  expect(metrics.documentWidth).toBeLessThanOrEqual(320);
  expect(metrics.rows).toBeGreaterThan(1);
});
