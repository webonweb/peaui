import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoContextStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `6-navigation-contextmenu--${story}`);
  await waitForStoryRender(page);
}

function rootMenu(page: Page) {
  return page.locator(
    ".peaui-context-menu__menu > .peaui-dropdown-menu__surface",
  );
}

test("ContextMenu Vue matches pointer geometry, ARIA and focus behavior", async ({
  page,
}) => {
  await gotoContextStory(page, "pointer-activation");
  const target = page.getByRole("button", { name: "Raport kwartalny" });
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await target.click({ button: "right", position: { x: 44, y: 48 } });
  const menu = rootMenu(page);
  await expect(menu).toBeVisible();
  await expect
    .poll(() => menu.evaluate((element) => element.style.left))
    .not.toBe("");
  await expect(target).toHaveAttribute("aria-expanded", "true");
  await expect(target).toHaveAttribute(
    "aria-controls",
    await menu.getAttribute("id"),
  );
  const menuRect = await menu.evaluate((element) =>
    element.getBoundingClientRect().toJSON(),
  );
  const anchorX = (box?.x ?? 0) + 44;
  const anchorY = (box?.y ?? 0) + 48;
  const opensLeft =
    anchorX > (await page.evaluate(() => window.innerWidth / 2));
  const opensAbove =
    anchorY > (await page.evaluate(() => window.innerHeight / 2));
  await expect(menu).toHaveAttribute("data-align", opensLeft ? "end" : "start");
  await expect(menu).toHaveAttribute(
    "data-placement",
    opensAbove ? "top" : "bottom",
  );
  expect(
    Math.abs((opensLeft ? menuRect.right : menuRect.left) - anchorX),
  ).toBeLessThanOrEqual(2);
  expect(
    Math.abs((opensAbove ? menuRect.bottom + 4 : menuRect.top - 4) - anchorY),
  ).toBeLessThanOrEqual(2);
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-context-menu")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await menu.getByRole("menuitem", { name: /Edytuj profil/ }).click();
  await expect(menu).toBeHidden();
  await expect(target).toBeFocused();
});

test("ContextMenu Vue supports keyboard reopen and safe touch long press", async ({
  page,
}) => {
  await gotoContextStory(page, "keyboard-activation");
  const target = page.getByRole("button", { name: /Shift\+F10/ });
  await target.focus();
  await page.keyboard.press("Shift+F10");
  const menu = rootMenu(page);
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: /Edytuj profil/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(target).toBeFocused();
  await page.keyboard.press("Shift+F10");
  await expect(menu).toBeVisible();

  await gotoContextStory(page, "long-press");
  const touchTarget = page.locator(".context-story-target");
  await touchTarget.dispatchEvent("pointerdown", {
    bubbles: true,
    button: 0,
    clientX: 40,
    clientY: 50,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  await touchTarget.dispatchEvent("pointermove", {
    bubbles: true,
    clientX: 70,
    clientY: 50,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  await page.waitForTimeout(400);
  await expect(rootMenu(page)).toBeHidden();
  await touchTarget.dispatchEvent("pointerdown", {
    bubbles: true,
    button: 0,
    clientX: 50,
    clientY: 60,
    isPrimary: true,
    pointerId: 2,
    pointerType: "touch",
  });
  await expect(rootMenu(page)).toBeVisible({ timeout: 1000 });
});

test("ContextMenu Vue remains fully inside a mobile viewport at its bottom-right edge", async ({
  page,
}) => {
  await page.setViewportSize({ height: 480, width: 320 });
  await gotoContextStory(page, "pointer-activation");
  const target = page.getByRole("button", { name: "Raport kwartalny" });
  await target.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        button: 2,
        cancelable: true,
        clientX: 314,
        clientY: 474,
      }),
    );
  });
  const menu = rootMenu(page);
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("data-placement", "top");
  await expect
    .poll(() => menu.evaluate((element) => element.style.left))
    .not.toBe("");
  const rect = await menu.evaluate((element) =>
    element.getBoundingClientRect().toJSON(),
  );
  expect(rect.left).toBeGreaterThanOrEqual(7);
  expect(rect.right).toBeLessThanOrEqual(313);
  expect(rect.top).toBeGreaterThanOrEqual(7);
  expect(rect.bottom).toBeLessThanOrEqual(473);
});
