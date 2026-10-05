import { expect, type Page } from '@playwright/test';

type MotionWindow = Window & { dialogAnimations: Array<{ className: string; duration: number }> };

export async function checkDialogMotion(page: Page, story: string, root: string, enter: number, leave: number): Promise<void> {
  await page.addInitScript(() => {
    const target = window as MotionWindow;
    target.dialogAnimations = [];
    const animate = HTMLElement.prototype.animate;
    HTMLElement.prototype.animate = function (...args: Parameters<HTMLElement['animate']>) {
      const options = args[1];
      target.dialogAnimations.push({
        className: this.className,
        duration: typeof options === 'number' ? options : Number(options?.duration),
      });
      return animate.apply(this, args);
    };
  });
  const url = `/iframe.html?id=${story}&viewMode=story`;
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(url);
  const dialog = page.locator(`dialog.${root}`);
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.evaluate((className) =>
    (window as MotionWindow).dialogAnimations.filter(entry => entry.className === className).map(entry => entry.duration),
    `${root}__inner`,
  )).toContain(enter);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate((className) =>
    (window as MotionWindow).dialogAnimations.filter(entry => entry.className === className).map(entry => entry.duration),
    `${root}__inner`,
  )).toContain(leave);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate((className) =>
    (window as MotionWindow).dialogAnimations.filter(entry => entry.className === className),
    `${root}__inner`,
  )).toEqual([]);
}
