import { test } from '@playwright/test';
import { checkCarouselRotation } from '../../helpers/carousel.mts';

test('CardCarousel preserves pause clicks when pointer focus stops rotation', async ({ page }) => {
  await checkCarouselRotation(page, 'react-data-display-cardcarousel--with-animation');
});
