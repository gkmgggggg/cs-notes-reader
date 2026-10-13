import { posix } from 'node:path';

/** Resolve both relative links and the upstream's older root-relative notes/ links. */
export function resolveSourcePath(url: string, sourcePath: string): string | undefined {
  const path = url.replace(/^https:\/\/github.com\/CyC2018\/CS-Notes\/blob\/[^/]+\//, '/');
  if (/^(https?:|mailto:|#)/.test(path)) return;
  const file = path.split('#')[0];
  if (!file?.endsWith('.md')) return;
  const decoded = decodeURIComponent(file);
  return decoded.startsWith('/') || decoded.startsWith('notes/')
    ? decoded.replace(/^\//, '')
    : posix.normalize(posix.join(posix.dirname(sourcePath), decoded));
}
