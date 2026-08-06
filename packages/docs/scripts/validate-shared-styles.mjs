import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const assetsDirectory = resolve('dist/assets');
const assetNames = await readdir(assetsDirectory);
const cssNames = assetNames.filter((name) => name.endsWith('.css'));
const css = (
  await Promise.all(cssNames.map((name) => readFile(resolve(assetsDirectory, name), 'utf8')))
).join('\n');

const requiredSelectors = [
  '.peaui-button-action',
  '.peaui-form-field__element',
  '.peaui-navigation-card',
  '.peaui-popover-overlayer',
  '--peaui-color-primary-700',
];
const missingSelectors = requiredSelectors.filter((selector) => !css.includes(selector));

if (missingSelectors.length > 0) {
  throw new Error(
    `Build dokumentacji nie zawiera wspólnych stylów PEAUI: ${missingSelectors.join(', ')}`,
  );
}

console.log(`Zweryfikowano wspólne style PEAUI w ${cssNames.length} pliku/pliku CSS.`);
