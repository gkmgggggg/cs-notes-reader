import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { mkdir, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { buildCatalog } from './build-catalog.ts';
import lock from '../content/source.lock.json' with { type: 'json' };

const supplied = process.argv.indexOf('--from');
let checkout: string;
if (supplied >= 0 && process.argv[supplied + 1]) {
  checkout = resolve(process.argv[supplied + 1]);
} else {
  await mkdir('.cache', { recursive: true });
  checkout = resolve('.cache/upstream');
  if (!existsSync(checkout)) execFileSync('git', ['clone', '--filter=blob:none', '--no-checkout', lock.repository, checkout], { stdio: 'inherit' });
  execFileSync('git', ['-C', checkout, 'fetch', '--depth', '1', 'origin', lock.commit], { stdio: 'inherit' });
  execFileSync('git', ['-C', checkout, 'checkout', '--detach', lock.commit], { stdio: 'inherit' });
}
if (checkout !== resolve('content/upstream')) {
  await mkdir('content/upstream', { recursive: true });
  await cp(resolve(checkout, 'notes'), resolve('content/upstream/notes'), { recursive: true });
  await cp(resolve(checkout, 'README.md'), resolve('content/upstream/README.md'));
}
await buildCatalog(checkout);
// Load the importer after generating its manifest and aliases.
const { importContent } = await import('./import-content.ts');
await importContent(checkout);
