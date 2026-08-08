import { expect, test, type Page } from "@playwright/test";

const datePickers = [
  [
    "FormDatePicker",
    "react-form-formdatepicker--default",
    "peaui-form-date-picker",
  ],
  [
    "FormYearPicker",
    "react-form-formyearpicker--default",
    "peaui-form-year-picker",
  ],
  [
    "FormTimePicker",
    "react-form-formtimepicker--default",
    "peaui-form-time-picker",
  ],
  [
    "FormDateTimePicker",
    "react-form-formdatetimepicker--default",
    "peaui-form-date-time-picker",
  ],
] as const;

async function constrainPicker(
  page: Page,
  storyId: string,
  rootClass: string,
  containerWidth: number,
): Promise<void> {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  const root = page.locator(`.${rootClass}`).first();
  await expect(root).toBeVisible();
  await root.evaluate(async (element, width) => {
    const rootElement = element as HTMLElement;
    rootElement.style.inlineSize = `${width}px`;
    rootElement.style.maxInlineSize = "100%";
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  }, containerWidth);
  await root.locator('[aria-haspopup="dialog"]').first().click();
}

test("date pickers React keep controls separated inside containers down to 200px", async ({
  page,
}) => {
  for (const containerWidth of [400, 320, 200]) {
    for (const [name, storyId, rootClass] of datePickers) {
      await constrainPicker(page, storyId, rootClass, containerWidth);
      const surface = page
        .locator(`.${rootClass}__popover-content:visible`)
        .first();
      await expect(surface, name).toBeVisible();

      const layout = await surface.evaluate((element) => {
        const surface = element as HTMLElement;
        const surfaceRect = surface.getBoundingClientRect();
        const controls = Array.from(
          surface.querySelectorAll<HTMLElement>(
            'button:not([hidden]), [role="spinbutton"]',
          ),
        )
          .map((control) => ({
            label:
              control.getAttribute("aria-label") ??
              control.textContent?.trim() ??
              control.className,
            rect: control.getBoundingClientRect(),
          }))
          .filter(({ rect }) => rect.width > 0 && rect.height > 0);
        const overlaps: string[] = [];

        for (
          let firstIndex = 0;
          firstIndex < controls.length;
          firstIndex += 1
        ) {
          for (
            let secondIndex = firstIndex + 1;
            secondIndex < controls.length;
            secondIndex += 1
          ) {
            const first = controls[firstIndex];
            const second = controls[secondIndex];
            if (!first || !second) continue;
            const horizontal =
              Math.min(first.rect.right, second.rect.right) -
              Math.max(first.rect.left, second.rect.left);
            const vertical =
              Math.min(first.rect.bottom, second.rect.bottom) -
              Math.max(first.rect.top, second.rect.top);

            if (horizontal > 0.5 && vertical > 0.5) {
              overlaps.push(`${first.label} <> ${second.label}`);
            }
          }
        }

        const outside = controls
          .filter(
            ({ rect }) =>
              rect.left < surfaceRect.left - 1 ||
              rect.right > surfaceRect.right + 1,
          )
          .map(({ label }) => label);

        return {
          clientWidth: surface.clientWidth,
          left: surfaceRect.left,
          outside,
          overlaps,
          right: surfaceRect.right,
          scrollWidth: surface.scrollWidth,
          undersized: controls
            .filter(({ rect }) => rect.width < 24 || rect.height < 24)
            .map(({ label }) => label),
          viewportWidth: window.innerWidth,
          width: surfaceRect.width,
        };
      });

      expect(layout.width, name).toBeGreaterThan(0);
      expect(layout.width, name).toBeLessThanOrEqual(
        Math.max(containerWidth, 320) + 1,
      );
      if (containerWidth === 200) {
        expect(
          layout.width,
          `${name} keeps a usable overlay width`,
        ).toBeGreaterThanOrEqual(319);
      }
      expect(
        layout.left,
        `${name} starts inside the viewport`,
      ).toBeGreaterThanOrEqual(-1);
      expect(
        layout.right,
        `${name} ends inside the viewport`,
      ).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(
        layout.scrollWidth,
        `${name} has horizontal overflow at ${containerWidth}px`,
      ).toBeLessThanOrEqual(layout.clientWidth + 1);
      expect(
        layout.outside,
        `${name} has controls outside at ${containerWidth}px`,
      ).toEqual([]);
      expect(
        layout.overlaps,
        `${name} has overlapping controls at ${containerWidth}px`,
      ).toEqual([]);
      expect(
        layout.undersized,
        `${name} has controls below 24px at ${containerWidth}px`,
      ).toEqual([]);
      await page.keyboard.press("Escape");
    }
  }
});
