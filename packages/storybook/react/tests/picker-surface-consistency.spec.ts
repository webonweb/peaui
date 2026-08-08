import { expect, test, type Page } from "@playwright/test";

const pickers = [
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
  [
    "FormColorPicker",
    "react-form-formcolorpicker--default",
    "peaui-form-color-picker",
  ],
] as const;

type SurfaceMetrics = {
  backgroundColor: string;
  borderRadius: string;
  borderTopWidth: string;
  boxShadow: string;
  gap: number;
  left: number;
  right: number;
  surfaceWidth: number;
  triggerWidth: number;
};

async function measureOpenSurface(
  page: Page,
  storyId: string,
  rootClass: string,
): Promise<SurfaceMetrics> {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  const root = page.locator(`.${rootClass}`).first();
  const trigger = root.locator('[aria-haspopup="dialog"]').first();
  await expect(trigger).toBeVisible();
  await trigger.click();

  const surface = page
    .locator(
      `.peaui-popover-overlayer__content.${rootClass}__popover-content:visible`,
    )
    .first();
  await expect(surface).toBeVisible();
  const triggerRect = await trigger.evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return { bottom: rect.bottom, top: rect.top, width: rect.width };
  });

  return surface.evaluate((element, measuredTrigger) => {
    const surfaceRect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);
    const gap =
      surfaceRect.top >= measuredTrigger.bottom
        ? surfaceRect.top - measuredTrigger.bottom
        : measuredTrigger.top - surfaceRect.bottom;

    return {
      backgroundColor: styles.backgroundColor,
      borderRadius: styles.borderRadius,
      borderTopWidth: styles.borderTopWidth,
      boxShadow: styles.boxShadow,
      gap,
      left: surfaceRect.left,
      right: surfaceRect.right,
      surfaceWidth: surfaceRect.width,
      triggerWidth: measuredTrigger.width,
    };
  }, triggerRect);
}

test("pickery React korzystają z jednej powierzchni i nie wychodzą poza viewport", async ({
  page,
}) => {
  let reference: Pick<
    SurfaceMetrics,
    "backgroundColor" | "borderRadius" | "borderTopWidth" | "boxShadow"
  > | null = null;

  for (const [name, storyId, rootClass] of pickers) {
    const metrics = await measureOpenSurface(page, storyId, rootClass);
    const sharedSurface = {
      backgroundColor: metrics.backgroundColor,
      borderRadius: metrics.borderRadius,
      borderTopWidth: metrics.borderTopWidth,
      boxShadow: metrics.boxShadow,
    };
    reference ??= sharedSurface;

    expect(sharedSurface, `${name} ma inną powierzchnię overlayu`).toEqual(
      reference,
    );
    expect(metrics.borderRadius).toBe("12px");
    expect(metrics.borderTopWidth).toBe("1px");
    expect(metrics.boxShadow).not.toBe("none");
    const expectedWidth = Math.min(metrics.triggerWidth, 1280 - 16);
    expect(
      Math.abs(metrics.surfaceWidth - expectedWidth),
      name,
    ).toBeLessThanOrEqual(1);
    expect(
      metrics.gap,
      `${name} ma nieprawidłowy odstęp od triggera`,
    ).toBeGreaterThanOrEqual(7);
    expect(
      metrics.gap,
      `${name} ma nieprawidłowy odstęp od triggera`,
    ).toBeLessThanOrEqual(9);
    expect(metrics.left, name).toBeGreaterThanOrEqual(0);
    expect(metrics.right, name).toBeLessThanOrEqual(1280);
  }
});
