import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoToggleGroupStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `3-data-entry-togglegroup--${story}`);
  await waitForStoryRender(page);
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

test("ToggleGroup Vue centruje tekst i zachowuje wszystkie rozmiary", async ({
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

test("ToggleGroup Vue realizuje roving tabindex, aktywację i poprawne ARIA", async ({
  page,
}) => {
  await gotoToggleGroupStory(page, "playground");
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

  await expect(group).toHaveAttribute("aria-orientation", "horizontal");
  await expect(buttons.nth(0)).toHaveAttribute("tabindex", "0");
  await buttons.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(buttons.nth(1)).toBeFocused();
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Space");
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "false");
  expect(await group.locator('button[tabindex="0"]').count()).toBe(1);

  await waitForFiniteAnimations(page.locator("body"));
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-toggle-group__field")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("ToggleGroup Vue przenosi fokus po dynamicznym usunięciu pozycji", async ({
  page,
}) => {
  await gotoToggleGroupStory(page, "dynamic-items");
  const group = page.getByTestId("toggle-group-dynamic");
  const last = group.getByRole("button").last();
  await last.focus();
  await page
    .getByRole("button", { name: "Usuń ostatnią pozycję" })
    .evaluate((button) => button.click());

  await expect(group.getByRole("button").nth(1)).toBeFocused();
  expect(await group.locator('button[tabindex="0"]').count()).toBe(1);
});

test("ToggleGroup Vue nie rozpycha viewportu i zachowuje cele 44 px", async ({
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
