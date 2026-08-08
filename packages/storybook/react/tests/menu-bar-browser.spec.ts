import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoMenuBarStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-navigation-menubar--${story}&viewMode=story`,
  );
}

test("MenuBar React implements the APG keyboard flow and ARIA", async ({
  page,
}) => {
  await gotoMenuBarStory(page, "multiple-menus-and-keyboard");
  const bar = page.getByRole("menubar", { name: "Menu edytora" });
  const triggers = bar.locator("[data-menubar-index]");
  await expect(triggers).toHaveCount(5);
  await expect
    .poll(() =>
      triggers.evaluateAll((elements) =>
        elements.filter((element) => element.getAttribute("tabindex") === "0")
          .length,
      ),
    )
    .toBe(1);

  await triggers.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(triggers.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: /Cofnij/ })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitemradio", { name: "Kompaktowa" })).toBeFocused();
  await expect(triggers.nth(2)).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(triggers.nth(2)).toBeFocused();
  await page.keyboard.press("p");
  await expect(triggers.nth(4)).toBeFocused();

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-menu-bar")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("MenuBar React switches an open section by pointer without losing menu mode", async ({
  page,
}) => {
  await gotoMenuBarStory(page, "multiple-menus-and-keyboard");
  const triggers = page.locator("[data-menubar-index]");
  await triggers.nth(0).click();
  await expect(page.getByRole("menu", { name: "Plik" })).toBeVisible();
  await triggers.nth(1).hover();
  await expect(page.getByRole("menu", { name: "Edycja" })).toBeVisible();
  await expect(page.getByRole("menu", { name: "Plik" })).toBeHidden();
});

test("MenuBar React scrolls horizontally and keeps overlays inside a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ height: 640, width: 320 });
  await gotoMenuBarStory(page, "responsive-overflow");
  const viewport = page.locator(".peaui-menu-bar__viewport");
  const triggers = page.locator("[data-menubar-index]");
  const overflow = await viewport.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await triggers.nth(0).focus();
  await page.keyboard.press("End");
  await expect(triggers.nth(4)).toBeFocused();
  await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Pomoc i dokumentacja" });
  await expect(menu).toBeVisible();
  const rect = await menu.evaluate((element) => element.getBoundingClientRect().toJSON());
  expect(rect.left).toBeGreaterThanOrEqual(7);
  expect(rect.right).toBeLessThanOrEqual(313);
});
