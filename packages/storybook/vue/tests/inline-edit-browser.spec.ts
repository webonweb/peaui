import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.setTimeout(60_000);

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=3-data-entry-inlineedit--${story}&viewMode=story`,
  );
  await page.locator(".peaui-inline-edit").waitFor();
}

test("InlineEdit Vue zapisuje szkic, zarządza fokusem i przechodzi axe", async ({
  page,
}) => {
  await gotoStory(page, "text");
  const root = page.locator(".peaui-inline-edit");
  const edit = root.getByRole("button", { name: "Edytuj nazwę projektu" });
  await edit.click();
  const input = root.getByRole("textbox", { name: "Edytuj nazwę projektu" });
  await expect(input).toBeFocused();
  await input.fill("Panel partnera");
  await root.getByRole("button", { name: "Zapisz" }).click();
  await expect(root.getByText("Panel partnera")).toBeVisible();
  await expect(
    root.getByRole("button", { name: "Edytuj nazwę projektu" }),
  ).toBeFocused();
  await waitForFiniteAnimations(page.locator("body"));
  expect(
    (await new AxeBuilder({ page }).include(".peaui-inline-edit").analyze())
      .violations,
  ).toEqual([]);
});

test("InlineEdit Vue waliduje i mieści akcje w wąskim kontenerze", async ({
  page,
}) => {
  await gotoStory(page, "validation");
  const root = page.locator(".peaui-inline-edit");
  await root.getByRole("button", { name: "Edytuj nazwę projektu" }).click();
  const input = root.getByRole("textbox");
  await input.fill("x");
  await root.getByRole("button", { name: "Zapisz" }).click();
  await expect(root.getByRole("alert")).toContainText("co najmniej 3 znaki");
  await expect(input).toHaveAttribute("aria-invalid", "true");

  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStory(page, "narrow-container");
  const metrics = await page
    .locator(".peaui-inline-edit")
    .evaluate((element) => ({
      pageWidth: document.documentElement.scrollWidth,
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
    }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.rootWidth + 1);
  expect(metrics.pageWidth).toBeLessThanOrEqual(320);
});
