import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("ScrollArea WC pokazuje treść i przewija pionowy viewport", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=6-layout-scrollarea-wc--vertical&viewMode=story",
  );

  const host = page.locator("peaui-scroll-area");
  const root = host.locator(".peaui-scroll-area");
  const viewport = root.locator(".peaui-scroll-area__viewport");
  await expect(host).toBeVisible();
  await expect(root.locator(".peaui-scroll-area__content article")).toHaveCount(
    12,
  );

  const box = await host.boundingBox();
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
  await waitForFiniteAnimations(page.locator("body"));
  expect(
    (await new AxeBuilder({ page }).include("peaui-scroll-area").analyze())
      .violations,
  ).toEqual([]);
});
