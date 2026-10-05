import { expect, type Page } from '@playwright/test';

export async function checkCarouselRotation(page: Page, story: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/iframe.html?id=${story}&viewMode=story`);
  const control = page.locator('.peaui-card-carousel__rotation');
  await expect(control).toHaveText('Zatrzymaj automatyczne przewijanie');
  await control.click();
  await expect(control).toHaveText('Wznów automatyczne przewijanie');
  // WebKit does not focus native buttons on a pointer click. Start the keyboard
  // checks with explicit focus without changing the pointer-click assertion.
  await control.focus();
  await expect(control).toBeFocused();
  await control.press('Enter');
  await expect(control).toHaveText('Zatrzymaj automatyczne przewijanie');
  await control.press('Space');
  await expect(control).toHaveText('Wznów automatyczne przewijanie');
}
