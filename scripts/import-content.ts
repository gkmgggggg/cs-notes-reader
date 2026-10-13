import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { Root, RootContent } from 'mdast';
import manifest from '../content/manifest.json' with { type: 'json' };
import lock from '../content/source.lock.json' with { type: 'json' };
import aliases from '../content/aliases.json' with { type: 'json' };
import { resolveSourcePath } from './source-path.ts';

export const base = '/cs-notes/';
export const sourceUrl = (path: string) => `https://github.com/CyC2018/CS-Notes/blob/${lock.commit}/${path.split('/').map(encodeURIComponent).join('/')}`;
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkStringify, { fences: true });

export function rewriteLink(url: string, sourcePath: string): string {
  let target = resolveSourcePath(url, sourcePath);
  if (!target) return url;
  target = (aliases as Record<string, string>)[target] ?? target;
  const hash = url.split('#')[1];
  const entry = manifest.find(n => n.sourcePath === target);
  return entry ? `${base}read/${entry.route}.html${hash ? `#${hash}` : ''}` : `${sourceUrl(target)}${hash ? `#${hash}` : ''}`;
}

export async function importContent(sourceRoot: string) {
  const report: { notes: number; assets: number; missingImages: string[] } = { notes: 0, assets: 0, missingImages: [] };
  const assetMap = new Map<string, string>();
  const externalRoot = resolve('content/upstream/external-assets');
  const externalIndex = resolve('content/upstream/external-assets.json');
  const external: Record<string, string> = existsSync(externalIndex) ? JSON.parse(await readFile(externalIndex, 'utf8')) : {};
  await mkdir(externalRoot, { recursive: true });
  await mkdir('src/content/notes', { recursive: true });
  await mkdir('public/content-assets', { recursive: true });
  for (const note of manifest) {
    const raw = await readFile(resolve(sourceRoot, note.sourcePath), 'utf8');
    const body = raw.replace(/<!-- GFM-TOC -->[\s\S]*?<!-- GFM-TOC -->/g, '');
    const tree = processor.parse(body) as Root;
    const textOf = (node: any): string => node.value ?? (node.children ?? []).map(textOf).join('');
    const first = tree.children.find(n => n.type === 'heading' && n.depth === 1);
    const normalized = (value: string) => value.toLowerCase().replace(/[\s/·-]|目录/g, '');
    // Only remove a duplicated page title. Older SQL/patterns files begin with a real section.
    if (first && (normalized(textOf(first)) === normalized(basename(note.sourcePath, '.md')) || normalized(textOf(first)) === normalized(note.title))) tree.children.splice(tree.children.indexOf(first), 1);
    if (tree.children.some(n => n.type === 'heading' && n.depth === 1)) for (const node of tree.children) if (node.type === 'heading') node.depth = Math.min(6, node.depth + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    async function image(url: string): Promise<string> {
      if (assetMap.has(url)) return assetMap.get(url)!;
      let filename: string;
      try { filename = basename(decodeURIComponent(new URL(url, 'https://source.invalid').pathname)); } catch { return url; }
      let local = resolve(sourceRoot, 'notes/pics', filename);
      if (!existsSync(local) && external[url]) local = resolve(externalRoot, external[url]);
      if (!existsSync(local) && /^https:\/\/(latex\.codecogs\.com|cs-notes-1256109796\.cos\.ap-guangzhou\.myqcloud\.com)\//.test(url)) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
          const extension = ({ 'image/gif': '.gif', 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' } as Record<string, string>)[response.headers.get('content-type')?.split(';')[0] ?? ''];
          if (!response.ok || !extension) throw new Error('图片下载失败');
          external[url] = `${createHash('sha256').update(url).digest('hex').slice(0, 12)}${extension}`;
          local = resolve(externalRoot, external[url]);
          await writeFile(local, Buffer.from(await response.arrayBuffer()));
        } catch { /* The report retains failed URLs; validation blocks an incomplete import. */ }
      }
      if (!existsSync(local)) {
        if (!report.missingImages.includes(url)) report.missingImages.push(url);
        return url;
      }
      const output = `${createHash('sha256').update(url).digest('hex').slice(0, 12)}-${basename(local)}`;
      await copyFile(local, resolve('public/content-assets', output));
      const destination = `${base}content-assets/${encodeURIComponent(output)}`;
      assetMap.set(url, destination);
      report.assets += 1;
      return destination;
    }
    async function visit(node: Root | RootContent): Promise<void> {
      if (node.type === 'code' && node.lang) node.lang = ({ 'text-html-basic': 'html', 'source-java': 'java', 'source-c': 'c' } as Record<string, string>)[node.lang] ?? node.lang;
      if (node.type === 'link') node.url = rewriteLink(node.url, note.sourcePath);
      if (node.type === 'image') node.url = await image(node.url);
      if (node.type === 'html') {
        if (/^\s*<!--/.test(node.value)) return;
        const urls = [...node.value.matchAll(/\bsrc=(["'])(.*?)\1/g)];
        for (const match of urls) node.value = node.value.replace(match[0], `src="${await image(match[2])}"`);
        node.value = node.value.replace(/\s(?:id|name)=["'][^"']*["']/g, '');
      }
      if ('children' in node) for (const child of node.children) await visit(child as RootContent);
    }
    await visit(tree);
    const metadata = { ...note, sourceUrl: sourceUrl(note.sourcePath), sourceCommit: lock.commit };
    const frontmatter = Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
    await writeFile(`src/content/notes/${note.noteId}.md`, `---\n${frontmatter}\n---\n\n${processor.stringify(tree)}`);
    report.notes += 1;
  }
  await mkdir('content/reports', { recursive: true });
  await writeFile(externalIndex, JSON.stringify(external, null, 2) + '\n');
  await writeFile('content/reports/import.json', JSON.stringify({ commit: lock.commit, ...report }, null, 2) + '\n');
  console.log(`已导入 ${report.notes} 篇笔记、${report.assets} 张本地图片。`);
  if (report.missingImages.length) console.log(`仍有 ${report.missingImages.length} 个外部图片引用，详见 content/reports/import.json。`);
  return report;
}
