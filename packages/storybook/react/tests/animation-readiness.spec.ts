import { expect, test } from '@playwright/test';
import { waitForFiniteAnimations } from '../../helpers/animations.mts';

test('layout readiness waits for ancestor and descendant motion without waiting for loaders', async ({ page }) => {
  await page.setContent('<section><div id="target"><span>Content</span><i>Loading</i></div></section>');
  await page.evaluate(() => {
    document.querySelector('section')!.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 250, fill: 'forwards' },
    );
    document.querySelector('span')!.animate(
      [{ transform: 'translateX(20px)' }, { transform: 'translateX(0)' }],
      { duration: 600, fill: 'forwards' },
    );
    document.querySelector('i')!.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 500, iterations: Infinity },
    );
  });

  await waitForFiniteAnimations(page.locator('#target'));

  const states = await page.evaluate(() => ({
    ancestor: document.querySelector('section')!.getAnimations()[0].playState,
    descendant: document.querySelector('span')!.getAnimations()[0].playState,
    loader: document.querySelector('i')!.getAnimations()[0].playState,
  }));
  expect(states).toEqual({ ancestor: 'finished', descendant: 'finished', loader: 'running' });
});

test('layout readiness includes an animated shadow host', async ({ page }) => {
  await page.setContent('<div id="host"></div>');
  await page.evaluate(() => {
    const host = document.querySelector('#host')!;
    host.attachShadow({ mode: 'open' }).innerHTML = '<span id="target">Content</span>';
    host.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
  });

  await waitForFiniteAnimations(page.locator('#target'));

  expect(await page.locator('#host').evaluate((host) => host.getAnimations()[0].playState))
    .toBe('finished');
});
