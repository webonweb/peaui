import { expect, test, type Locator, type Page } from "@playwright/test";

import { waitForStoryRender } from "./helpers/a11y";

type EraseStory = {
  args?: string;
  root: string;
  story: string;
};

const stories: EraseStory[] = [
  {
    args: "value:PEAUI;canErase:true;iconAfter:calendar",
    root: ".peaui-form-field",
    story: "5-form-formfield--form-field",
  },
  {
    args: "canErase:true",
    root: ".peaui-form-field",
    story: "5-form-forminput--form-input",
  },
  {
    args: "canErase:true;value:42",
    root: ".peaui-form-field",
    story: "5-form-formnumber--form-number",
  },
  { root: ".peaui-form-select", story: "5-form-formselect--form-select" },
  {
    root: ".peaui-form-multiselect",
    story: "5-form-formmultiselect--form-multi-select",
  },
  {
    root: ".peaui-form-date-picker",
    story: "5-form-formdatepicker--form-date-picker",
  },
  {
    root: ".peaui-form-year-picker",
    story: "5-form-formyearpicker--form-year-picker",
  },
  {
    root: ".peaui-form-time-picker",
    story: "5-form-formtimepicker--playground",
  },
  {
    root: ".peaui-form-date-time-picker",
    story: "5-form-formdatetimepicker--playground",
  },
  {
    root: ".peaui-form-color-picker",
    story: "5-form-formcolorpicker--playground",
  },
];

async function gotoStory(page: Page, entry: EraseStory): Promise<Locator> {
  const args = entry.args ? `&args=${encodeURIComponent(entry.args)}` : "";
  await page.goto(`/iframe.html?id=${entry.story}&viewMode=story${args}`);
  await waitForStoryRender(page);
  const root = page.locator(entry.root).first();
  await expect(root).toBeVisible();
  await root.evaluate((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.width = "200px";
    htmlElement.style.maxWidth = "200px";
  });
  return root;
}

async function expectSafeEraseRail(root: Locator): Promise<void> {
  const metrics = await root.evaluate((element) => {
    const erase = element.querySelector<HTMLElement>(
      ".peaui-form-field__erase-button",
    );
    const field = element.querySelector<HTMLElement>(
      ".peaui-form-field__element",
    );
    const content = element.querySelector<HTMLElement>(
      ".peaui-form-field__content",
    );
    if (!erase || !field || !content) return null;

    const eraseRect = erase.getBoundingClientRect();
    const fieldRect = field.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const candidates = Array.from(
      element.querySelectorAll<HTMLElement>(
        ".peaui-form-field__icon--after, .peaui-form-field__additional--after, .peaui-form-time-picker__panel-trigger, .peaui-form-color-picker__toggle",
      ),
    ).filter(
      (candidate) =>
        candidate !== erase && candidate.getBoundingClientRect().width > 0,
    );
    const overlaps = candidates.some((candidate) => {
      const rect = candidate.getBoundingClientRect();
      return !(
        eraseRect.right <= rect.left ||
        rect.right <= eraseRect.left ||
        eraseRect.bottom <= rect.top ||
        rect.bottom <= eraseRect.top
      );
    });

    return {
      ariaLabel: erase.getAttribute("aria-label"),
      contentLeft: contentRect.left,
      contentRight: contentRect.right,
      eraseBottom: eraseRect.bottom,
      eraseHeight: eraseRect.height,
      eraseLeft: eraseRect.left,
      eraseRight: eraseRect.right,
      eraseTop: eraseRect.top,
      eraseWidth: eraseRect.width,
      fieldPaddingRight: Number.parseFloat(
        getComputedStyle(field).paddingRight,
      ),
      overlaps,
    };
  });

  expect(metrics).not.toBeNull();
  expect(metrics?.ariaLabel).toBeTruthy();
  expect(metrics?.eraseWidth).toBeGreaterThanOrEqual(32);
  expect(metrics?.eraseHeight).toBeGreaterThanOrEqual(32);
  expect(metrics?.eraseLeft).toBeGreaterThanOrEqual(metrics?.contentLeft ?? 0);
  expect(metrics?.eraseRight).toBeLessThanOrEqual(metrics?.contentRight ?? 0);
  expect(metrics?.eraseTop).toBeGreaterThanOrEqual(0);
  expect(metrics?.eraseBottom).toBeGreaterThan(metrics?.eraseTop ?? 0);
  expect(metrics?.fieldPaddingRight).toBeGreaterThanOrEqual(
    (metrics?.contentRight ?? 0) - (metrics?.eraseLeft ?? 0),
  );
  expect(metrics?.overlaps).toBe(false);
}

for (const entry of stories) {
  test(`${entry.story} nie nakłada canErase na trailing actions przy 200 px`, async ({
    page,
  }) => {
    const root = await gotoStory(page, entry);
    await expectSafeEraseRail(root);
  });
}
