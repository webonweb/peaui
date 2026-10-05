import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

import { waitForFiniteAnimations } from "../helpers/animations.mts";

/** Measure visible text after both the inverse surface and theme have settled. */
export async function expectInverseSurfaceContrast(
  page: Page,
  story: string,
  selector: string,
  theme: "light" | "dark",
) {
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(`/iframe.html?id=${story}&viewMode=story`);
  const text = page.locator(selector);
  await expect(text.first()).toBeVisible();
  await page.evaluate((scheme) => {
    document.body.classList.toggle("dark-mode", scheme === "dark");
    document.documentElement.style.colorScheme = scheme;
    document.body.style.colorScheme = scheme;
  }, theme);
  // Color transitions inherit through the text's ancestors.
  await waitForFiniteAnimations(page.locator("body"));
  const samples = await text.evaluateAll((elements) => {
    const channels = (color: string): number[] =>
      (color.match(/[\d.]+/g) ?? []).map(Number);
    const luminance = (color: string): number => {
      const [r, g, b] = channels(color).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return elements.map((element) => {
      let surface: Element | null = element;
      let background = "transparent";
      while (surface) {
        background = getComputedStyle(surface).backgroundColor;
        const values = channels(background);
        if (values.length === 3 || values[3] === 1) break;
        const root = surface.getRootNode();
        surface =
          surface.parentElement ??
          (root instanceof ShadowRoot ? root.host : null);
      }
      const foreground = getComputedStyle(element).color;
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return {
        text: element.textContent?.trim(),
        foreground,
        background,
        contrast:
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
      };
    });
  });
  for (const sample of samples) {
    expect(sample.contrast, JSON.stringify(sample)).toBeGreaterThanOrEqual(4.5);
  }
  const axe = await new AxeBuilder({ page })
    .include(selector)
    .withRules(["color-contrast"])
    .analyze();
  expect(axe.violations).toEqual([]);
  return { theme, samples, axeIncomplete: axe.incomplete };
}
