import { pasteText } from "../../helpers/clipboard.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoTagsStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `5-form-formtagsinput--${story}`);
  await waitForStoryRender(page);
}

test("FormTagsInput Vue zachowuje ARIA, paste, edycję i stabilny fokus", async ({
  page,
}) => {
  await gotoTagsStory(page, "paste-edit-and-keyboard");
  const root = page.locator(".peaui-form-tags-input");
  const input = page.getByRole("combobox", {
    name: "Tagi obsługiwane klawiaturą",
  });
  await expect(input).toHaveAttribute("aria-describedby", /description/);
  await expect(root.locator("label.peaui-form-label")).toBeVisible();
  await expect(root.locator(".peaui-form-tags-input__tag")).toHaveCount(2);

  await input.focus();
  const overlay = root.locator(".peaui-form-tags-input__popover-content");
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveAttribute("popover", "auto");
  await expect(overlay).toHaveClass(/peaui-popover-overlayer__content/);
  const overlayMetrics = await Promise.all([
    root.locator(".peaui-form-tags-input__control").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, width: rect.width };
    }),
    overlay.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        left: rect.left,
        padding: styles.padding,
        width: rect.width,
      };
    }),
  ]);
  expect(
    Math.abs(overlayMetrics[0].left - overlayMetrics[1].left),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(overlayMetrics[0].width - overlayMetrics[1].width),
  ).toBeLessThanOrEqual(1);
  expect(overlayMetrics[1].padding).toBe("0px");
  expect(
    await input.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("none");
  await expect
    .poll(() =>
      root
        .locator(".peaui-form-tags-input__control")
        .evaluate((element) => getComputedStyle(element).boxShadow),
    )
    .toContain("0px 0px 0px 2px");
  await pasteText(input, "TypeScript, Web Components");
  await expect(root.locator(".peaui-form-tags-input__tag")).toHaveCount(4);
  await page.keyboard.press("Backspace");
  await expect(root.locator(".peaui-form-tags-input__tag").last()).toHaveClass(
    /--selected/,
  );
  await page.keyboard.press("Backspace");
  await expect(root.locator(".peaui-form-tags-input__tag")).toHaveCount(3);

  await page.keyboard.press("ArrowLeft");
  const editButton = page.getByRole("button", {
    name: "Edytuj tag TypeScript",
  });
  await expect(editButton).toBeFocused();
  const tagFocusVisual = await editButton.evaluate((element) => ({
    outline: getComputedStyle(element).outlineStyle,
    tagFocus: getComputedStyle(element.parentElement!).boxShadow,
  }));
  expect(tagFocusVisual.outline).toBe("none");
  expect(tagFocusVisual.tagFocus).not.toBe("none");
  await page.keyboard.press("F2");
  await expect(input).toBeFocused();
  await input.fill("TypeScript 5");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Edytuj tag TypeScript 5" }),
  ).toBeVisible();

  const targets = await root
    .locator(".peaui-form-tags-input__remove")
    .evaluateAll((elements) =>
      elements.map((element) => ({
        height: element.getBoundingClientRect().height,
        width: element.getBoundingClientRect().width,
      })),
    );
  expect(
    Math.min(...targets.map((target) => target.height)),
  ).toBeGreaterThanOrEqual(36);
  expect(
    Math.min(...targets.map((target) => target.width)),
  ).toBeGreaterThanOrEqual(36);
  await expect(
    root.locator(".peaui-form-tags-input__remove-icon").first(),
  ).toBeVisible();

  const tagLayout = await root
    .locator(".peaui-form-tags-input__tag")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const label = element.querySelector<HTMLElement>(
          ".peaui-form-tags-input__tag-label",
        );
        return {
          flexShrink: getComputedStyle(element).flexShrink,
          height: element.getBoundingClientRect().height,
          labelClipped: label ? label.scrollWidth > label.clientWidth : false,
        };
      }),
    );
  expect(tagLayout.every((tag) => tag.flexShrink === "0")).toBe(true);
  expect(tagLayout.every((tag) => tag.height >= 36)).toBe(true);
  expect(tagLayout.some((tag) => tag.labelClipped)).toBe(false);
  const tagSpacing = await root
    .locator(".peaui-form-tags-input__tags")
    .evaluate((element) => {
      const styles = getComputedStyle(element);
      const tagMain = element.querySelector<HTMLElement>(
        ".peaui-form-tags-input__tag-main",
      );
      return {
        display: styles.display,
        gap: Number.parseFloat(styles.columnGap),
        tagPaddingInlineStart: tagMain
          ? Number.parseFloat(getComputedStyle(tagMain).paddingInlineStart)
          : 0,
      };
    });
  expect(tagSpacing.display).toBe("flex");
  expect(tagSpacing.gap).toBeGreaterThanOrEqual(4);
  expect(tagSpacing.tagPaddingInlineStart).toBeGreaterThanOrEqual(8);

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-tags-input")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormTagsInput Vue nie tworzy overflow na 320 px i działa w RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoTagsStory(page, "mobile-long-content-and-rtl");
  const root = page.locator(".peaui-form-tags-input");
  const control = root.locator(".peaui-form-tags-input__control");
  await expect(root).toBeVisible();
  const metrics = await root.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(320);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  expect(
    await control.evaluate((element) => getComputedStyle(element).minHeight),
  ).toBe("48px");

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-tags-input")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
