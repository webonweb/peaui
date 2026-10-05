import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsRoot = path.join(libraryRoot, 'src', 'assets', 'icons');
const inventoryTarget = path.join(iconsRoot, 'inventory.json');
const manifestTarget = path.join(iconsRoot, 'catalog.json');
const runtimeDirectory = path.join(iconsRoot, 'runtime', 'catalog');
const bucketsDirectory = path.join(runtimeDirectory, 'buckets');
const legacyRuntimeDirectory = path.join(iconsRoot, 'runtime');
const legacyBucketsDirectory = path.join(legacyRuntimeDirectory, 'buckets');
const checkOnly = process.argv.includes('--check');

const ICON_COUNT = 1348;
const ICON_SIZE = '24';
const ICON_STROKE_WIDTH = '1.8';
const categoryNames = ['core', 'extended', 'ring', 'tile'];

function fail(message) {
  throw new Error(`[icon-catalog] ${message}`);
}

function assertInsideIconsRoot(target) {
  const relativeTarget = path.relative(iconsRoot, target);

  if (!relativeTarget || relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
    fail(`Nieprawidlowy katalog docelowy: ${target}`);
  }
}

function readInventory() {
  if (!fs.existsSync(inventoryTarget)) fail('Brak inventory.json.');

  const inventory = JSON.parse(fs.readFileSync(inventoryTarget, 'utf8'));

  if (inventory.inventoryVersion !== 2) fail('Nieobslugiwana wersja inventory.json.');
  if (
    inventory.packageName !== 'PeaUI Outline Icons Mega' ||
    inventory.packageVersion !== '0.3.0'
  ) {
    fail('Inventory nie opisuje oczekiwanej paczki PeaUI Outline Icons Mega 0.3.0.');
  }
  if (
    inventory.iconSize !== Number(ICON_SIZE) ||
    inventory.strokeWidth !== Number(ICON_STROKE_WIDTH)
  ) {
    fail('Parametry stylu inventory.json nie odpowiadaja katalogowi SVG.');
  }
  if (JSON.stringify(inventory.categories) !== JSON.stringify(categoryNames)) {
    fail('Kategorie inventory.json nie odpowiadaja katalogowi PEAUI.');
  }
  if (!Array.isArray(inventory.icons) || inventory.icons.length !== ICON_COUNT) {
    fail(`Inwentarz musi zawierac ${ICON_COUNT} ikon, zawiera ${inventory.icons?.length ?? 0}.`);
  }

  const publicNames = new Set();

  for (const icon of inventory.icons) {
    if (!categoryNames.includes(icon.category)) fail(`Nieznana kategoria: ${icon.category}.`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(icon.name)) fail(`Nieprawidlowa nazwa: ${icon.name}.`);

    const publicName = `${icon.category}/${icon.name}`;

    if (publicNames.has(publicName)) fail(`Powtorzona ikona: ${publicName}.`);
    publicNames.add(publicName);
  }

  return inventory;
}

function readRootTag(source) {
  return source.match(/<svg\b[^>]*>/i)?.[0];
}

function validateSvg(fileName, source) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/.test(fileName)) {
    fail(`Nieprawidlowa nazwa pliku: ${fileName}`);
  }

  const root = readRootTag(source);

  if (!root) fail(`${fileName} nie zawiera elementu svg.`);

  for (const attribute of [
    `width="${ICON_SIZE}"`,
    `height="${ICON_SIZE}"`,
    `viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}"`,
    'fill="none"',
    'stroke="currentColor"',
    `stroke-width="${ICON_STROKE_WIDTH}"`,
    'stroke-linecap="round"',
    'stroke-linejoin="round"',
    'aria-hidden="true"',
    'focusable="false"',
  ]) {
    if (!root.includes(attribute)) fail(`${fileName} nie zawiera atrybutu ${attribute}.`);
  }

  if (
    /<(?:script|style|foreignObject)\b/i.test(source) ||
    /\son[a-z]+\s*=/i.test(source) ||
    /\b(?:href|src)\s*=/i.test(source) ||
    /url\s*\(/i.test(source) ||
    /<!DOCTYPE|<\?xml/i.test(source)
  ) {
    fail(`${fileName} zawiera niedozwolona lub zewnetrzna zawartosc.`);
  }

  const allowedElements = new Set([
    'svg',
    'g',
    'path',
    'line',
    'circle',
    'ellipse',
    'rect',
    'polyline',
    'polygon',
  ]);

  for (const [, elementName] of source.matchAll(/<([a-z][a-z0-9-]*)\b/gi)) {
    if (!allowedElements.has(elementName.toLowerCase())) {
      fail(`${fileName} zawiera niedozwolony element <${elementName}>.`);
    }
  }
}

function extractBody(fileName, source) {
  const body = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim();

  if (body === undefined) fail(`${fileName} nie zawiera prawidlowego elementu svg.`);

  return body;
}

const CATALOG_BUCKET_COUNT = 32;

function getLegacyBucketName(publicName) {
  if (!publicName.includes('/')) {
    return publicName.replaceAll('-', '').toLowerCase().slice(0, 2);
  }

  const [category = 'core', name = ''] = publicName.split('/');
  let bucketSource = name;

  if (bucketSource.startsWith(`${category}-`)) {
    bucketSource = bucketSource.slice(category.length + 1);
  } else if (category === 'core' && bucketSource.startsWith('badge-')) {
    bucketSource = bucketSource.slice('badge-'.length);
  }

  return `${category}-${bucketSource.replaceAll('-', '').toLowerCase().slice(0, 2)}`;
}

function getCatalogBucketName(publicName) {
  let hash = 2166136261;

  for (let index = 0; index < publicName.length; index += 1) {
    hash ^= publicName.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `catalog-${((hash >>> 0) % CATALOG_BUCKET_COUNT).toString(16).padStart(2, '0')}`;
}

function buildRuntimeBuckets(icons, getBucketName) {
  const buckets = new Map();

  for (const icon of icons) {
    const bucketName = getBucketName(icon.publicName);
    const bucket = buckets.get(bucketName) ?? [];

    bucket.push(icon);
    buckets.set(bucketName, bucket);
  }

  return new Map(
    [...buckets.entries()]
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
      .map(([bucketName, bucketIcons]) => {
        const entries = bucketIcons
          .map(
            ({ body, publicName }) => `  ${JSON.stringify(publicName)}: ${JSON.stringify(body)},`,
          )
          .join('\n');

        return [
          `${bucketName}.ts`,
          `// Ten plik jest generowany przez scripts/sync-icon-catalog.mjs.\nconst icons: Readonly<Record<string, string>> = {\n${entries}\n};\n\nexport default icons;\n`,
        ];
      }),
  );
}

function buildBucketLoaders(buckets, iconNames = []) {
  const loaders = [...buckets.keys()]
    .map((fileName) => {
      const bucketName = path.basename(fileName, '.ts');

      return `  ${JSON.stringify(bucketName)}: () => import('./buckets/${bucketName}').then(({ default: bucket }) => bucket),`;
    })
    .join('\n');
  const namesExport = iconNames.length
    ? `\nexport const iconNames: ReadonlySet<string> = new Set(${JSON.stringify(iconNames)});\n`
    : '';

  return `// Ten plik jest generowany przez scripts/sync-icon-catalog.mjs.\nexport type IconBucket = Readonly<Record<string, string>>;\nexport type IconBucketLoader = () => Promise<IconBucket>;\n\nconst bucketLoaders: Readonly<Record<string, IconBucketLoader>> = {\n${loaders}\n};\n${namesExport}\nexport default bucketLoaders;\n`;
}

function buildExpectedFiles() {
  const inventory = readInventory();
  const icons = inventory.icons
    .map(({ category, name }) => {
      const fileName = `${name}.svg`;
      const source = fs
        .readFileSync(path.join(iconsRoot, category, fileName), 'utf8')
        .replace(/\r\n?/g, '\n');

      validateSvg(fileName, source);

      return {
        body: extractBody(fileName, source),
        category,
        fileName,
        name,
        publicName: `${category}/${name}`,
        source,
        tags: [...new Set([category, ...name.split('-')])],
      };
    })
    .sort((left, right) => {
      const categoryOrder =
        categoryNames.indexOf(left.category) - categoryNames.indexOf(right.category);

      return categoryOrder || left.name.localeCompare(right.name, 'en');
    });

  const uniqueGeometryCount = new Set(icons.map(({ body }) => body)).size;

  if (uniqueGeometryCount < 1300) {
    fail(`Katalog utracil roznorodnosc geometrii: ${uniqueGeometryCount} unikalnych SVG.`);
  }

  const manifest = `${JSON.stringify(
    {
      catalogVersion: 5,
      iconSize: Number(ICON_SIZE),
      strokeWidth: Number(ICON_STROKE_WIDTH),
      profile: {
        name: 'peaui-outline-0.3.0',
        geometrySource: 'peaui-outline-icons-mega',
        generator: 'scripts/sync-icon-catalog.mjs',
      },
      categories: categoryNames,
      icons: icons.map(({ category, name, publicName, tags }) => ({
        category,
        name: publicName,
        sourceName: name,
        tags,
      })),
    },
    null,
    2,
  )}\n`;
  const buckets = buildRuntimeBuckets(icons, getCatalogBucketName);
  const legacyIcons = fs
    .readdirSync(iconsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en'))
    .map((fileName) => {
      const source = fs
        .readFileSync(path.join(iconsRoot, fileName), 'utf8')
        .replace(/\r\n?/g, '\n');

      if (
        !/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.svg$/.test(fileName) ||
        !/<svg\b[^>]*>[\s\S]*<\/svg>/i.test(source) ||
        /<(?:script|style|foreignObject)\b/i.test(source) ||
        /\son[a-z]+\s*=/i.test(source) ||
        /\b(?:href|src)\s*=|url\s*\(/i.test(source)
      ) {
        fail(`Ikona zgodnosci ${fileName} nie jest bezpiecznym plikiem SVG.`);
      }

      return {
        body: source,
        name: path.basename(fileName, '.svg'),
        publicName: path.basename(fileName, '.svg'),
      };
    });
  const legacyBuckets = buildRuntimeBuckets(legacyIcons, getLegacyBucketName);

  return {
    buckets,
    bucketLoaders: buildBucketLoaders(buckets),
    icons,
    legacyBuckets,
    legacyBucketLoaders: buildBucketLoaders(
      legacyBuckets,
      legacyIcons.map(({ name }) => name),
    ),
    manifest,
  };
}

function checkRuntimeFiles(directory, bucketDirectory, buckets, bucketLoaders, label) {
  const actualNames = fs.existsSync(bucketDirectory)
    ? fs
        .readdirSync(bucketDirectory, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
    : [];
  const unexpectedNames = actualNames.filter((name) => !buckets.has(name));

  if (unexpectedNames.length)
    fail(`Nieoczekiwane buckety ${label}: ${unexpectedNames.join(', ')}.`);

  for (const [fileName, source] of buckets) {
    const target = path.join(bucketDirectory, fileName);

    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== source) {
      fail(`Runtime bucket ${label}/${fileName} nie jest aktualny.`);
    }
  }

  const loadersTarget = path.join(directory, 'bucket-loaders.ts');

  if (!fs.existsSync(loadersTarget) || fs.readFileSync(loadersTarget, 'utf8') !== bucketLoaders) {
    fail(`Mapa loaderow ${label} nie jest aktualna.`);
  }
}

function checkFiles(expected) {
  for (const category of categoryNames) {
    const categoryDirectory = path.join(iconsRoot, category);
    const expectedFiles = new Set(
      expected.icons.filter((icon) => icon.category === category).map((icon) => icon.fileName),
    );
    const actualFiles = fs.existsSync(categoryDirectory)
      ? fs
          .readdirSync(categoryDirectory, { withFileTypes: true })
          .filter((entry) => entry.isFile())
          .map((entry) => entry.name)
      : [];
    const unexpectedFiles = actualFiles.filter((name) => !expectedFiles.has(name));
    const missingFiles = [...expectedFiles].filter((name) => !actualFiles.includes(name));

    if (unexpectedFiles.length) {
      fail(`Nieoczekiwane pliki w ${category}: ${unexpectedFiles.join(', ')}.`);
    }
    if (missingFiles.length) fail(`Brakujace pliki w ${category}: ${missingFiles.join(', ')}.`);
  }

  if (
    !fs.existsSync(manifestTarget) ||
    fs.readFileSync(manifestTarget, 'utf8') !== expected.manifest
  ) {
    fail('catalog.json nie jest aktualny.');
  }

  checkRuntimeFiles(
    runtimeDirectory,
    bucketsDirectory,
    expected.buckets,
    expected.bucketLoaders,
    'catalog',
  );
  checkRuntimeFiles(
    legacyRuntimeDirectory,
    legacyBucketsDirectory,
    expected.legacyBuckets,
    expected.legacyBucketLoaders,
    'legacy',
  );
}

function writeRuntimeFiles(directory, bucketDirectory, buckets, bucketLoaders) {
  assertInsideIconsRoot(directory);
  assertInsideIconsRoot(bucketDirectory);
  fs.mkdirSync(bucketDirectory, { recursive: true });

  for (const entry of fs.readdirSync(bucketDirectory, { withFileTypes: true })) {
    if (entry.isFile() && !buckets.has(entry.name))
      fs.rmSync(path.join(bucketDirectory, entry.name));
  }
  for (const [fileName, source] of buckets) {
    fs.writeFileSync(path.join(bucketDirectory, fileName), source, 'utf8');
  }
  fs.writeFileSync(path.join(directory, 'bucket-loaders.ts'), bucketLoaders, 'utf8');
}

function writeFiles(expected) {
  writeRuntimeFiles(runtimeDirectory, bucketsDirectory, expected.buckets, expected.bucketLoaders);
  writeRuntimeFiles(
    legacyRuntimeDirectory,
    legacyBucketsDirectory,
    expected.legacyBuckets,
    expected.legacyBucketLoaders,
  );
  fs.writeFileSync(manifestTarget, expected.manifest, 'utf8');
}

const expectedFiles = buildExpectedFiles();

if (checkOnly) {
  checkFiles(expectedFiles);
  console.log(
    `[icon-catalog] OK: ${expectedFiles.icons.length} ikon PEAUI w ${categoryNames.length} grupach.`,
  );
} else {
  writeFiles(expectedFiles);
  checkFiles(expectedFiles);
  console.log(
    `[icon-catalog] Zapisano ${expectedFiles.icons.length} ikon PEAUI w ${categoryNames.length} grupach.`,
  );
}
