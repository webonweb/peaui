import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=3-data-entry-transferlist--${story}&viewMode=story`,
  );
  await page.locator(".peaui-transfer-list").waitFor();
}

test("TransferList Vue przenosi element i nie ma naruszeń axe", async ({
  page,
}) => {
  await gotoStory(page, "playground");
  const source = page.getByRole("listbox", { name: "Dostępne" });
  await source.getByRole("option", { name: /Rozliczenia/ }).click();
  await page
    .getByRole("button", { name: "Przenieś zaznaczone do przypisanych" })
    .click();
  await expect(page.getByRole("listbox", { name: "Przypisane" })).toContainText(
    "Rozliczenia",
  );
  expect(
    (await new AxeBuilder({ page }).include(".peaui-transfer-list").analyze())
      .violations,
  ).toEqual([]);
});

test("TransferList Vue składa się i nie przelewa przy 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await gotoStory(page, "vertical-mobile");
  const metrics = await page
    .locator("[data-transfer-list-narrow]")
    .evaluate((host) => {
      const panels = [
        ...host.querySelectorAll<HTMLElement>(".peaui-transfer-list__panel"),
      ];
      const buttons = [
        ...host.querySelectorAll<HTMLElement>(".peaui-transfer-list__control"),
      ];
      return {
        pageWidth: document.documentElement.scrollWidth,
        panelLefts: panels.map((panel) => panel.getBoundingClientRect().left),
        minButtonHeight: Math.min(
          ...buttons.map((button) => button.getBoundingClientRect().height),
        ),
      };
    });
  expect(
    Math.abs(metrics.panelLefts[0]! - metrics.panelLefts[1]!),
  ).toBeLessThanOrEqual(1);
  expect(metrics.minButtonHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.pageWidth).toBeLessThanOrEqual(320);
});
