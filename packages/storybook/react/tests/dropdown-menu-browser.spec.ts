import { expect, test, type Page } from "@playwright/test";

type Placement = "top" | "right" | "bottom" | "left";

async function gotoDropdownStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-navigation-dropdownmenu--${story}&viewMode=story`
  );
}

async function expectPlacement(
  page: Page,
  placement: Placement
): Promise<void> {
  const trigger = page.getByRole("button", { exact: true, name: placement });
  const menu = page.getByTestId(`placement-${placement}-menu`);

  await trigger.click();
  await expect(menu).toBeVisible();
  await menu.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished)
    );
  });

  const [triggerRect, menuRect] = await Promise.all([
    trigger.evaluate((element) => element.getBoundingClientRect().toJSON()),
    menu.evaluate((element) => ({
      ...element.getBoundingClientRect().toJSON(),
      placement: element.dataset.placement,
    })),
  ]);
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
  await gotoDropdownStory(page, "placements");
  await expect(page.locator("[data-dropdown-placement-grid]")).toBeVisible();

  for (const placement of ["top", "right", "bottom", "left"] as const) {
    await expectPlacement(page, placement);
  }
});

test("DropdownMenu default preview starts closed and can be reopened repeatedly", async ({
  page,
}) => {
  await gotoDropdownStory(page, "default");
  const trigger = page.getByRole("button", { name: "Opcje" });
  const menu = page.getByRole("menu", { name: "Akcje profilu" });

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
  await trigger.click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
});

test("DropdownMenu controlled preview synchronizes close and reopen", async ({
  page,
}) => {
  await gotoDropdownStory(page, "controlled");
  const trigger = page.getByRole("button", { name: "Opcje" });
  const menu = page.getByRole("menu", { name: "Akcje profilu" });

  await expect(menu).toBeVisible();
  await trigger.click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
});
