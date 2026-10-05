import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const [framework, ...args] = process.argv.slice(2);
if (!['vue', 'react', 'wc'].includes(framework)) throw new Error('Expected vue, react or wc.');
const behavior = args.includes('--behavior');
const result = spawnSync(
  process.execPath,
  [
    join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs'),
    'run',
    '--config',
    './vitest.config.ts',
    ...args.filter((arg) => arg !== '--behavior'),
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PEAUI_FRAMEWORK: framework,
      PEAUI_WC_BEHAVIOR_COVERAGE: behavior ? '1' : '0',
    },
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
