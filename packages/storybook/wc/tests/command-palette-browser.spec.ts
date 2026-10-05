import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("CommandPalette WC supports combobox navigation without pointer input", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=5-navigation-commandpalette-wc--default&viewMode=story",
  );
  const palette = page.locator(".peaui-command-palette__panel");
  await palette.waitFor();
  const input = palette.getByRole("combobox");
  await expect(input).toHaveAttribute("aria-controls");
  await input.fill("project");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(palette.getByText("PEAUI library")).toBeVisible();
  await waitForFiniteAnimations(page.locator("body"));
  expect(
    (
      await new AxeBuilder({ page })
        .include(".peaui-command-palette__panel")
        .analyze()
    ).violations,
  ).toEqual([]);
});
