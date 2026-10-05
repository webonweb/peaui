import { expect, test, type Page } from "@playwright/test";
import { waitForFiniteAnimations } from "../../helpers/animations.mts";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

type Placement = "top" | "right" | "bottom" | "left";

async function expectPlacement(
  page: Page,
  placement: Placement
): Promise<void> {
  const trigger = page.getByRole("button", { exact: true, name: placement });
  const menu = page.getByTestId(`placement-${placement}-menu`);

  await trigger.click();
  await expect(menu).toBeVisible();
  await waitForFiniteAnimations(menu);

  const geometry = await Promise.all([
    trigger.evaluate((element) => element.getBoundingClientRect().toJSON()),
    menu.evaluate((element) => ({
      ...element.getBoundingClientRect().toJSON(),
      placement: element.dataset.placement,
    })),
  ]);
  const [triggerRect, menuRect] = geometry;
  expect(menuRect.placement).toBe(placement);

  if (placement === "left")
    expect(menuRect.right).toBeLessThanOrEqual(triggerRect.left - 7);
  if (placement === "right")
    expect(menuRect.left).toBeGreaterThanOrEqual(triggerRect.right + 7);
  if (placement === "top")
    expect(menuRect.bottom).toBeLessThanOrEqual(triggerRect.top - 7);
  if (placement === "bottom")
    expect(menuRect.top).toBeGreaterThanOrEqual(triggerRect.bottom + 7);

  const horizontal = placement === "top" || placement === "bottom";
  const triggerCenter = horizontal
    ? triggerRect.left + triggerRect.width / 2
    : triggerRect.top + triggerRect.height / 2;
  const menuCenter = horizontal
    ? menuRect.left + menuRect.width / 2
    : menuRect.top + menuRect.height / 2;
  expect(Math.abs(triggerCenter - menuCenter)).toBeLessThanOrEqual(2.5);

  await trigger.click();
  await expect(menu).toBeHidden();
}

test("DropdownMenu keeps exact placement and center alignment", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1600, width: 1280 });
  await gotoStory(page, "6-navigation-dropdownmenu--placements-and-alignment");
  await waitForStoryRender(page);

  for (const placement of ["top", "right", "bottom", "left"] as const) {
    await expectPlacement(page, placement);
  }
});
