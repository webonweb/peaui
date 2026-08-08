import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=4-data-display-virtuallist--${story}&viewMode=story`
  );
  await page.locator(".peaui-virtual-list").waitFor();
}

test("VirtualList Vue ogranicza DOM, przewija 10k elementów i przechodzi axe", async ({
  page,
}) => {
  await gotoStory(page, "large-dataset");
  const root = page.locator(".peaui-virtual-list");
  const viewport = root.locator(".peaui-scroll-area__viewport");
  await expect(root.getByRole("listitem")).toHaveCount(9);
  await viewport.evaluate((element) => {
    element.scrollTop = 320_000;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(root.getByText("Wynik 05001")).toBeVisible();
  expect(await root.getByRole("listitem").count()).toBeLessThanOrEqual(13);
  await expect(root.locator(".peaui-virtual-list__end")).toHaveCount(0);
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(root.locator(".peaui-virtual-list__end")).toBeVisible();
  const metrics = await root.evaluate((element) => ({
    height: element.querySelector(".peaui-scroll-area")?.getBoundingClientRect()
      .height,
    rootWidth: element.getBoundingClientRect().width,
    scrollWidth: element.scrollWidth,
  }));
  expect(metrics.height).toBe(320);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.rootWidth + 1);
  expect(
    (await new AxeBuilder({ page }).include(".peaui-virtual-list").analyze())
      .violations
  ).toEqual([]);
});

test("VirtualList Vue obsługuje listbox i mobilny kontener", async ({
  page,
}) => {
  await gotoStory(page, "listbox-keyboard");
  const listbox = page.getByRole("listbox", { name: "Wyniki wyszukiwania" });
  await listbox.focus();
  await listbox.press("End");
  await expect(page.getByRole("option", { selected: true })).toHaveAttribute(
    "aria-posinset",
    "10000"
  );

  await page.setViewportSize({ width: 320, height: 900 });
  await gotoStory(page, "long-content-mobile");
  const overflow = await page
    .locator("[data-virtual-list-narrow]")
    .evaluate((element) => ({
      pageWidth: document.documentElement.scrollWidth,
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
    }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.rootWidth + 1);
  expect(overflow.pageWidth).toBeLessThanOrEqual(320);
});
