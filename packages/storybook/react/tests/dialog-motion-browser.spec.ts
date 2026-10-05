import { test } from '@playwright/test';
import { checkDialogMotion } from '../../helpers/dialog-motion.mts';

test('ModalDialog shares animation timing and reduced motion', async ({ page }) => {
  await checkDialogMotion(page, 'react-overlayer-modaldialog--default', 'peaui-modal-dialog', 180, 160);
});

test('DrawerPanel shares animation timing and reduced motion', async ({ page }) => {
  await checkDialogMotion(page, 'react-overlayer-drawerpanel--default', 'peaui-drawer-panel', 220, 180);
});
