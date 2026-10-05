import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(docsRoot, 'dist');
const assetsRoot = join(distRoot, 'assets');
const indexHtml = readFileSync(join(distRoot, 'index.html'), 'utf8');
const errors = [];
const manifest = JSON.parse(readFileSync(join(distRoot, '.vite/manifest.json'), 'utf8'));

function closure(key, reached = new Set()) {
  if (reached.has(key)) return reached;
  reached.add(key);
  for (const dependency of manifest[key]?.imports ?? []) closure(dependency, reached);
  return reached;
}

function validateRouteBudget(name, maximumBytes, pageKey) {
  const key =
    name === 'index'
      ? Object.keys(manifest).find((key) => manifest[key].isEntry)
      : Object.keys(manifest).find((key) => manifest[key].name === name);
  if (!key) {
    errors.push(`Missing route module: ${name}`);
    return;
  }
  const reached = closure(key, pageKey ? closure(pageKey) : new Set());
  const bytes = [...reached].reduce(
    (sum, key) => sum + gzipSync(readFileSync(join(distRoot, manifest[key].file))).byteLength,
    0,
  );
  if (bytes > maximumBytes)
    errors.push(`${name} with static dependencies: ${bytes} B gzip > ${maximumBytes} B`);
  console.log(`${name} with static dependencies: ${bytes} B gzip.`);
}

function validateGzipBudget(file, maximumBytes, label) {
  const gzipBytes = gzipSync(readFileSync(file)).byteLength;

  if (gzipBytes > maximumBytes) {
    errors.push(`${label}: ${gzipBytes} B gzip > ${maximumBytes} B`);
  }

  return gzipBytes;
}

const mainAssetMatch = indexHtml.match(/<script[^>]+src="[^"]*\/assets\/(index-[^"]+\.js)"/);

if (!mainAssetMatch) {
  errors.push('Nie znaleziono glownego pliku JavaScript dokumentacji.');
}

const componentPageAsset = readdirSync(assetsRoot).find((file) =>
  /^ComponentPage-.+\.js$/.test(file),
);

if (!componentPageAsset) {
  errors.push('Nie znaleziono chunka strony komponentu.');
}

const mainGzipBytes = mainAssetMatch
  ? validateGzipBudget(join(assetsRoot, mainAssetMatch[1]), 125 * 1024, 'Glowny bundle docs')
  : 0;
const componentPageGzipBytes = componentPageAsset
  ? validateGzipBudget(join(assetsRoot, componentPageAsset), 200 * 1024, 'Bundle strony komponentu')
  : 0;

const pageKey = Object.keys(manifest).find((key) => manifest[key].name === 'ComponentPage');
validateRouteBudget('index', 125 * 1024);
validateRouteBudget('ComponentPage', 210 * 1024);
validateRouteBudget('DemoCanvas', 240 * 1024, pageKey);
validateRouteBudget('WebComponentDemo', 250 * 1024, pageKey);
validateRouteBudget('ReactDemoCanvas', 300 * 1024, pageKey);

if (errors.length > 0) {
  console.error('Budzet wydajnosci dokumentacji zostal przekroczony:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Budzet docs OK: main ${mainGzipBytes} B gzip, component page ${componentPageGzipBytes} B gzip.`,
  );
}
