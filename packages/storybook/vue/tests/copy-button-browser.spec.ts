import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.setTimeout(60_000);

async function stubClipboard(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (text: string) => {
          (
            window as Window & { __peauiCopiedText?: string }
          ).__peauiCopiedText = text;
          return Promise.resolve();
        },
      },
    });
  });
}

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=3-data-entry-copybutton--${story}&viewMode=story`,
  );
  await page.locator(".peaui-copy-button").waitFor();
}

test("CopyButton Vue kopiuje, utrzymuje focus i przechodzi axe", async ({
  page,
}) => {
  await stubClipboard(page);
  await gotoStory(page, "icon-and-text");
  const root = page.locator(".peaui-copy-button");
  const button = root.getByRole("button", { name: "Kopiuj identyfikator" });
  await button.focus();
    await page.keyboard.press('Enter');

  await expect(root).toHaveAttribute("data-status", "copied");
  await expect(button).toBeFocused();
  await expect(root.getByRole("status")).toHaveText("Skopiowano");
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __peauiCopiedText?: string }).__peauiCopiedText,
    ),
  ).toBe("PEA-2026-022");
  await waitForFiniteAnimations(page.locator("body"));
  expect(
    (await new AxeBuilder({ page }).include(".peaui-copy-button").analyze())
      .violations,
  ).toEqual([]);
});

test("CopyButton Vue obsługuje async i wąski kontener bez overflow", async ({
  page,
}) => {
  await stubClipboard(page);
  await gotoStory(page, "async-text");
  const asyncRoot = page.locator(".peaui-copy-button");
  const asyncButton = asyncRoot.getByRole("button", {
    name: "Kopiuj identyfikator",
  });
  await asyncButton.click();
  await expect(asyncButton).toHaveAttribute("aria-busy", "true");
  await expect(asyncRoot).toHaveAttribute("data-status", "copied");

  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStory(page, "narrow-container");
  const metrics = await page
    .locator(".peaui-copy-button")
    .evaluate((element) => ({
      pageWidth: document.documentElement.scrollWidth,
      rootWidth: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
    }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.rootWidth + 1);
  expect(metrics.pageWidth).toBeLessThanOrEqual(320);
});
