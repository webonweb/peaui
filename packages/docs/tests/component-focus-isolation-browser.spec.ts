import { expect, test } from '@playwright/test';

const frameworks = ['vue', 'react', 'web-components'] as const;

for (const framework of frameworks) {
  test(`dokumentacja nie nadpisuje focusu FormDateRangePicker ${framework}`, async ({ page }) => {
    await page.goto(`/pl/${framework}/components/form/form-date-range-picker`);

    const input = page.getByRole('combobox', { name: 'Data początkowa' });
    await input.focus();

    const focusStyle = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      const field = element.closest<HTMLElement>('.peaui-form-date-range-picker__range-fields');

      return {
        fieldBoxShadow: field ? getComputedStyle(field).boxShadow : 'none',
        inputBoxShadow: style.boxShadow,
        outlineOffset: style.outlineOffset,
        outlineStyle: style.outlineStyle,
      };
    });

    expect(focusStyle.outlineStyle).toBe('none');
    expect(focusStyle.outlineOffset).not.toBe('3px');
    expect(focusStyle.inputBoxShadow).toBe('none');
    expect(focusStyle.fieldBoxShadow).not.toBe('none');
  });
}

test('dokumentacja nie nadpisuje focusu komponentów poza demo stage', async ({ page }) => {
  await page.goto('/pl/');

  const input = page.locator('#home-preview-workspace');
  await input.focus();

  const focusStyle = await input.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      className: element.className,
      outlineOffset: style.outlineOffset,
    };
  });

  expect(focusStyle.className).toContain('peaui-');
  expect(focusStyle.outlineOffset).not.toBe('3px');
});
