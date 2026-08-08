import { expect, test, type Locator, type Page } from '@playwright/test';

import { gotoStory, waitForStoryRender } from './helpers/a11y';

type CalendarCellStyle = {
  backgroundColor: string;
  borderRadius: string;
  borderTopWidth: string;
  boxShadow: string;
  color: string;
  fontSize: string;
  fontWeight: string;
  minHeight: string;
};

async function openPicker(page: Page, storyId: string, rootClass: string): Promise<void> {
  await gotoStory(page, storyId);
  await waitForStoryRender(page);
  await page.locator(`.${rootClass}`).first().locator('[aria-haspopup="dialog"]').click();
  await expect(page.locator(`.${rootClass}__popover-content:visible`)).toBeVisible();
}

async function readCellStyle(cell: Locator): Promise<CalendarCellStyle> {
  return cell.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      borderTopWidth: style.borderTopWidth,
      boxShadow: style.boxShadow,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      minHeight: style.minHeight,
    };
  });
}

test('FormDatePicker Vue uses the same selected and today states as FormDateTimePicker', async ({
  page,
}) => {
  await openPicker(page, '5-form-formdatepicker--form-date-picker', 'peaui-form-date-picker');
  const dateSelected = page
    .locator('.peaui-form-date-picker__grid--day .peaui-form-date-picker-button--variant-primary')
    .first();
  const dateToday = page
    .locator(
      '.peaui-form-date-picker__grid--day .peaui-form-date-picker-button--variant-ghost:not(.peaui-form-date-picker__picker-button--outside-month)',
    )
    .first();
  await expect(dateSelected).toBeVisible();
  await dateToday.evaluate((element) => {
    (element as HTMLElement).style.transition = 'none';
    element.setAttribute('aria-current', 'date');
  });
  const dateSelectedStyle = await readCellStyle(dateSelected);
  const dateTodayStyle = await readCellStyle(dateToday);

  await page.keyboard.press('Escape');
  await openPicker(
    page,
    '5-form-formdatetimepicker--playground',
    'peaui-form-date-time-picker',
  );
  const dateTimeSelected = page.locator('.peaui-form-date-time-picker__day--selected').first();
  const dateTimeToday = page
    .locator(
      '.peaui-form-date-time-picker__day:not(.peaui-form-date-time-picker__day--selected):not(.peaui-form-date-time-picker__day--outside)',
    )
    .first();
  await expect(dateTimeSelected).toBeVisible();
  await dateTimeToday.evaluate((element) => {
    (element as HTMLElement).style.transition = 'none';
    element.classList.add('peaui-form-date-time-picker__day--today');
  });

  expect(dateSelectedStyle).toEqual(await readCellStyle(dateTimeSelected));
  expect(dateTodayStyle).toEqual(await readCellStyle(dateTimeToday));
  expect(dateSelectedStyle.borderRadius).toBe('8px');
  expect(dateSelectedStyle.minHeight).toBe('44px');
  expect(dateSelectedStyle.borderTopWidth).toBe('0px');
  expect(dateTodayStyle.boxShadow).not.toBe('none');
});
