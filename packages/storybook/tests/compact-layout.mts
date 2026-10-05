import { expect, type Page } from "@playwright/test";

export async function expectCompactLayout(
  page: Page,
  id: string,
  selector: string,
): Promise<void> {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  const component = page.locator(selector);
  await expect(component).toBeVisible();
  // A larger user font also exposes intrinsic sizing differences between operating systems.
  await page.addStyleTag({ content: "html { font-size: 20px; }" });
  await expect
    .poll(() =>
      component.evaluate((element) => {
        const viewportWidth = document.documentElement.clientWidth;
        const bounds = element.getBoundingClientRect();
        return (
          bounds.left >= -1 &&
          bounds.right <= viewportWidth + 1 &&
          element.scrollWidth <= element.clientWidth + 1
        );
      }),
    )
    .toBe(true);

  for (const control of await component
    .locator("button:visible, input:visible")
    .all()) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(321);
  }
}
