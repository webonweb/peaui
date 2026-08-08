import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("ScrollArea Vue pokazuje treść i przewija pionowy viewport", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=6-layout-scrollarea--vertical&viewMode=story",
  );

  const root = page.locator(".peaui-scroll-area");
  const viewport = root.locator(".peaui-scroll-area__viewport");
  await expect(root).toBeVisible();
  await expect(root.locator(".peaui-scroll-area__content article")).toHaveCount(
    12,
  );

  const box = await root.boundingBox();
  const overflow = await viewport.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(320);
  expect(box!.height).toBe(288);
  expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight);

  await viewport.evaluate((element) => element.scrollTo({ top: 160 }));
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  expect(
    (await new AxeBuilder({ page }).include(".peaui-scroll-area").analyze())
      .violations,
  ).toEqual([]);
});
