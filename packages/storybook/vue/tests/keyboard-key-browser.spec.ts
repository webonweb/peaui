import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.setTimeout(60_000);

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=4-data-display-keyboardkey--${story}&viewMode=story`,
  );
  await page.locator(".peaui-keyboard-key").first().waitFor();
}

test("KeyboardKey Vue zachowuje semantykę, kolejność, nazwę AT i mapowanie platformy", async ({
  page,
}) => {
  await gotoStory(page, "default");
  const root = page.locator(".peaui-keyboard-key");
  await expect(root.locator("kbd")).toHaveCount(3);
  await expect(root.locator("kbd")).toHaveText(["Ctrl", "Shift", "K"]);
  await expect(root.locator(".peaui-keyboard-key__accessible")).toHaveText(
    "Control plus Shift plus K",
  );
  await expect(root).not.toHaveAttribute("tabindex", /.+/u);
  await expect(root).not.toHaveAttribute("aria-keyshortcuts", /.+/u);
  expect(
    (await new AxeBuilder({ page }).include(".peaui-keyboard-key").analyze())
      .violations,
  ).toEqual([]);

  await gotoStory(page, "platform-matrix");
  await expect(
    page.locator(".peaui-keyboard-key").nth(0).locator("kbd").first(),
  ).toHaveText("Ctrl");
  await expect(
    page.locator(".peaui-keyboard-key").nth(1).locator("kbd").first(),
  ).toHaveText("⌘");
});

test("KeyboardKey Vue zawija wyłącznie między klawiszami i mieści się w wąskim kontenerze", async ({
  page,
}) => {
  await page.setViewportSize({ width: 220, height: 500 });
  await gotoStory(page, "narrow-container");
  const metrics = await page
    .locator("[data-keyboard-key-narrow]")
    .evaluate((container) => {
      const root = container.querySelector<HTMLElement>(".peaui-keyboard-key");
      const keys = [...container.querySelectorAll<HTMLElement>("kbd")];
      return {
        keyWhiteSpace: keys.map((key) => getComputedStyle(key).whiteSpace),
        pageWidth: document.documentElement.scrollWidth,
        rootWidth: root?.getBoundingClientRect().width ?? 0,
        wrapperWidth: container.getBoundingClientRect().width,
      };
    });
  expect(metrics.keyWhiteSpace).toEqual(["nowrap", "nowrap", "nowrap"]);
  expect(metrics.rootWidth).toBeLessThanOrEqual(metrics.wrapperWidth + 1);
  expect(metrics.pageWidth).toBeLessThanOrEqual(220);
});
