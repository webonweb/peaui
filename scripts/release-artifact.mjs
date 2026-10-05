import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, '.release');
mkdirSync(output, { recursive: true });
const metadata = JSON.parse(readFileSync(join(root, 'packages/library/package.json'), 'utf8'));
if (process.env.GITHUB_REF_TYPE === 'tag') {
  assert.equal(process.env.GITHUB_REF_NAME, `v${metadata.version}`, 'Release tag must match the package version');
}
assert.ok(process.env.npm_execpath, 'Run this script with npm run release:artifact');
// Run lifecycle checks with inherited output, then obtain an uncontaminated JSON pack result.
execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'prepack', '--workspace', 'packages/library'], { cwd: root, stdio: 'inherit' });
const [packed] = JSON.parse(execFileSync(process.execPath, [
  process.env.npm_execpath, 'pack', '--workspace', 'packages/library', '--pack-destination', output, '--json', '--ignore-scripts',
], { cwd: root, encoding: 'utf8' }));
const archive = join(output, packed.filename);
const fixture = mkdtempSync(join(output, 'consumer-'));
execFileSync('tar', ['-xzf', archive, '-C', fixture]);
const packageDirectory = join(fixture, 'package');
const manifest = JSON.parse(readFileSync(join(packageDirectory, 'package.json'), 'utf8'));
assert.equal(manifest.version, metadata.version);
assert.ok(manifest.imports['#peaui-html-decoder'], 'Private import mappings must be included');
for (const file of ['README.md', 'LICENSE', 'custom-elements.json']) {
  assert.ok(readFileSync(join(packageDirectory, file)).length > 0, `${file} must be in the release`);
}
// Resolve through the extracted exports map, as an application consuming the tarball does.
for (const [name, source] of [
  ['vue', "import Table from '@peaui/ui/vue/data-display/TableList'; console.log(Table)"],
  ['react', "import Button from '@peaui/ui/react/data-entry/ButtonAction'; console.log(Button)"],
  ['wc-native', "import '@peaui/ui/wc/data-entry/ButtonAction'"],
  ['wc-adapter', "import '@peaui/ui/wc/form/FormSelect'"],
]) {
  await build({
    stdin: { contents: source, resolveDir: packageDirectory },
    bundle: true, write: false, platform: 'browser', format: 'esm',
    external: ['react', 'react/*', 'react-dom', 'vue'],
    outdir: join(fixture, name), logLevel: 'silent',
  });
}
// The server entry must also resolve CSS-free imports and the Node HTML decoder.
const serverEntry = join(packageDirectory, 'consumer-ssr.mjs');
writeFileSync(serverEntry, "import { createSSRApp } from 'vue'; import { renderToString } from 'vue/server-renderer'; import Table from '@peaui/ui/vue/data-display/TableList'; export const html = await renderToString(createSSRApp(Table, { columns: [{ key: 'name', label: 'Name' }], records: [{ id: '1', name: 'Ada' }] }));");
assert.match((await import(pathToFileURL(serverEntry).href)).html, /Ada/);
console.log(`Verified release artifact: ${archive}`);
