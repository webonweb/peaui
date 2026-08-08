import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoToggleGroupStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=react-data-entry-togglegroup--${story}&viewMode=story`,
  );
}

async function readSizeAlignment(page: Page) {
  const groups = page.locator(
    '.peaui-toggle-group[data-testid^="toggle-group-size-"]',
  );
  await groups.first().waitFor();
  return groups.evaluateAll((entries) =>
    entries.map((group) => {
      const buttons = [
        ...group.querySelectorAll<HTMLElement>(".peaui-toggle-group__item"),
      ];
      const offsets = buttons.map((button) => {
        const label = button.querySelector<HTMLElement>(
          ".peaui-toggle-button__label",
        )!;
        const buttonRect = button.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        return {
          horizontal: Math.abs(
            labelRect.left +
              labelRect.width / 2 -
              (buttonRect.left + buttonRect.width / 2),
          ),
          vertical: Math.abs(
            labelRect.top +
              labelRect.height / 2 -
              (buttonRect.top + buttonRect.height / 2),
          ),
        };
      });

      return {
        className: group.className,
        iconCount: group.querySelectorAll(".peaui-toggle-button__icon").length,
        minHeight: Math.min(
          ...buttons.map((button) => button.getBoundingClientRect().height),
        ),
        maxHorizontalOffset: Math.max(
          ...offsets.map(({ horizontal }) => horizontal),
        ),
        maxVerticalOffset: Math.max(...offsets.map(({ vertical }) => vertical)),
      };
    }),
  );
}

test("ToggleGroup React centruje tekst i zachowuje wszystkie rozmiary", async ({
  page,
}) => {
  await gotoToggleGroupStory(page, "sizes-and-alignment");
  const metrics = await readSizeAlignment(page);

  expect(metrics).toHaveLength(5);
  for (const [index, size] of ["xxs", "xs", "s", "m", "l"].entries()) {
    expect(metrics[index]?.className).toContain(
      `peaui-toggle-group--size-${size}`,
    );
    expect(metrics[index]?.iconCount).toBe(0);
    expect(metrics[index]?.minHeight).toBeGreaterThanOrEqual(44);
    expect(metrics[index]?.maxHorizontalOffset).toBeLessThanOrEqual(1);
    expect(metrics[index]?.maxVerticalOffset).toBeLessThanOrEqual(1);
  }
});

test("ToggleGroup React realizuje roving tabindex, aktywację i poprawne ARIA", async ({
  page,
}) => {
  await gotoToggleGroupStory(page, "default");
  const group = page.getByRole("toolbar", { name: "Widok wyników" });
  const buttons = group.getByRole("button");

  expect(
    await page.locator(".peaui-toggle-group__field").evaluate((field) => {
      const label = field.querySelector<HTMLElement>(
        ".peaui-toggle-group__label",
      )!;
      const button = field.querySelector<HTMLElement>(
        ".peaui-toggle-group__item",
      )!;
      return {
        buttonFontWeight: getComputedStyle(button).fontWeight,
        buttonRadius: getComputedStyle(button).borderRadius,
        labelFontWeight: getComputedStyle(label).fontWeight,
        stateMarkers: field.querySelectorAll(
          ".peaui-toggle-button__state-marker",
        ).length,
      };
    }),
  ).toEqual({
    buttonFontWeight: "500",
    buttonRadius: "8px",
    labelFontWeight: "500",
    stateMarkers: 0,
  });

  await expect(buttons.nth(0)).toHaveAttribute("tabindex", "0");
  await buttons.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  expect(await group.locator('button[tabindex="0"]').count()).toBe(1);

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-toggle-group__field")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("ToggleGroup React przenosi fokus po dynamicznym usunięciu pozycji", async ({
  page,
}) => {
  await gotoToggleGroupStory(page, "dynamic-items");
  const group = page.getByTestId("toggle-group-dynamic");
  await group.getByRole("button").last().focus();
  await page
    .getByRole("button", { name: "Usuń ostatnią pozycję" })
    .evaluate((button) => button.click());

  await expect(group.getByRole("button").nth(1)).toBeFocused();
  expect(await group.locator('button[tabindex="0"]').count()).toBe(1);
});

test("ToggleGroup React nie rozpycha viewportu i zachowuje cele 44 px", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoToggleGroupStory(page, "mobile-overflow");
  const metrics = await page
    .locator("[data-toggle-group-mobile]")
    .evaluate((host) => {
      const group = host.querySelector<HTMLElement>(".peaui-toggle-group")!;
      const buttons = [...host.querySelectorAll<HTMLElement>("button")];
      return {
        buttonHeights: buttons.map(
          (button) => button.getBoundingClientRect().height,
        ),
        clientWidth: group.clientWidth,
        scrollWidth: group.scrollWidth,
      };
    });

  expect(Math.min(...metrics.buttonHeights)).toBeGreaterThanOrEqual(44);
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
