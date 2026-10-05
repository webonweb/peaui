import { expect, type Page } from "@playwright/test";

/** Native decoration must stay inside sr-only clipping, including WebKit. */
export async function expectNativeSelectClipped(
  page: Page,
  story: string,
): Promise<void> {
  for (const initialWidth of [390, 1280]) {
    await page.setViewportSize({ width: initialWidth, height: 844 });
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    const select = page
      .locator("select.peaui-form-field__native-select")
      .first();
    await expect(select).toHaveCount(1);
    // Assert the targeted fix, not page-wide overflow suppression.
    await expect(select).toHaveCSS("appearance", "none");
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const geometry = await select.evaluate((element) => ({
        viewport: document.documentElement.clientWidth,
        scrollWidth: Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        ),
        controlWidth: element.getBoundingClientRect().width,
        overflow: getComputedStyle(element).overflow,
        tabIndex: element.tabIndex,
        ariaHidden: element.getAttribute("aria-hidden"),
      }));
      expect(geometry.controlWidth).toBeLessThanOrEqual(1);
      expect(geometry.tabIndex).toBe(-1);
      expect(geometry.ariaHidden).toBe("true");
      expect(
        geometry.scrollWidth,
        JSON.stringify(geometry),
      ).toBeLessThanOrEqual(geometry.viewport + 1);
    }
  }
}
