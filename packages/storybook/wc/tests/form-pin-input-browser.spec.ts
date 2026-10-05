import { pasteText } from "../../helpers/clipboard.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoPinStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=5-form-formpininput-wc--${story}&viewMode=story`,
  );
}

test("FormPinInput WC zachowuje ARIA, paste, klawiaturę i cele dotykowe", async ({
  page,
}) => {
  await gotoPinStory(page, "paste-and-keyboard");
  const group = page.getByRole("group", { name: "Kod obsługiwany klawiaturą" });
  const cells = group.locator(".peaui-form-pin-input__cell");
  await expect(group).toHaveAttribute("aria-describedby", /description/);
  await expect(cells).toHaveCount(6);
  await expect(cells.nth(0)).toHaveAttribute("aria-label", "Cyfra 1 z 6");
  await expect(cells.nth(5)).toHaveAttribute("aria-label", "Cyfra 6 z 6");

  await cells.nth(0).focus();
  await expect
    .poll(() =>
      cells.nth(0).evaluate((element) => getComputedStyle(element).boxShadow),
    )
    .not.toContain("inset");
  const focusMetrics = await cells.nth(0).evaluate((element) => {
    const cell = element.getBoundingClientRect();
    const group = element.parentElement?.getBoundingClientRect();
    return {
      bottomSpace: group ? group.bottom - cell.bottom : 0,
      inlineStartSpace: group ? cell.left - group.left : 0,
      outlineStyle: getComputedStyle(element).outlineStyle,
      topSpace: group ? cell.top - group.top : 0,
    };
  });
  expect(focusMetrics.inlineStartSpace).toBeGreaterThanOrEqual(5);
  expect(focusMetrics.topSpace).toBeGreaterThanOrEqual(5);
  expect(focusMetrics.bottomSpace).toBeGreaterThanOrEqual(5);
  expect(focusMetrics.outlineStyle).toBe("none");
  await page.keyboard.press("0");
  await expect(cells.nth(1)).toBeFocused();
  await page.keyboard.press("0");
  await expect(cells.nth(2)).toBeFocused();
  await page.keyboard.press("End");
  await expect(cells.nth(5)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(cells.nth(0)).toBeFocused();

  await pasteText(cells.nth(0), "12a345678");
  await expect(cells.nth(0)).toHaveValue("1");
  await expect(cells.nth(5)).toHaveValue("6");

  const metrics = await cells.evaluateAll((elements) => ({
    minHeight: Math.min(
      ...elements.map((element) => element.getBoundingClientRect().height),
    ),
    minWidth: Math.min(
      ...elements.map((element) => element.getBoundingClientRect().width),
    ),
    tabStops: elements.filter(
      (element) => element.getAttribute("tabindex") === "0",
    ).length,
  }));
  expect(metrics.minHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.minWidth).toBeGreaterThanOrEqual(44);
  expect(metrics.tabStops).toBe(1);

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-pin-input")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormPinInput WC kontroluje długi kod i etykietę na 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoPinStory(page, "mobile-and-long-code");
  const root = page.locator(".peaui-form-pin-input");
  const group = root.getByRole("group");
  await expect(root).toBeVisible();
  const metrics = await group.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      clientWidth: element.clientWidth,
      left: rect.left,
      right: rect.right,
      scrollWidth: element.scrollWidth,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(320);
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);

  const lastCell = group.locator(".peaui-form-pin-input__cell").last();
  await lastCell.focus();
  await expect.poll(() => group.evaluate((element) => element.scrollLeft)).toBeGreaterThan(
    0,
  );
  expect(
    await lastCell.evaluate((element) => {
      const cell = element.getBoundingClientRect();
      const groupRect = element.parentElement?.getBoundingClientRect();
      return groupRect ? groupRect.right - cell.right : 0;
    }),
  ).toBeGreaterThanOrEqual(5);

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-pin-input")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
