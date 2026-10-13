import { readFile, access, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import manifest from '../content/manifest.json' with { type: 'json' };
import { fingerprint, sourceBody } from './content-integrity.ts';

await access('dist/pagefind/pagefind.js');
await access('dist/index.html');
const homepage = await readFile('dist/index.html', 'utf8');
if (/href="\/cs-notes[^/"?#]/.test(homepage)) throw new Error('部署前缀缺少路径分隔符');
const integrity = JSON.parse(await readFile('content/reports/integrity.json', 'utf8'));
const pages = new Map<string, { ids: Set<string>; links: string[] }>();
function walk(node: any, callback: (node: any) => void) { callback(node); node.childNodes?.forEach((child: any) => walk(child, callback)); }
const attribute = (node: any, name: string): string | undefined => node.attrs?.find((a: any) => a.name === name)?.value;
const textOf = (node: any): string => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textOf).join('');
for (const note of manifest) {
  const html = await readFile(`dist/read/${note.route}.html`, 'utf8');
  if (!html.includes('data-pagefind-body') || !html.includes(note.title)) throw new Error(`正文输出缺失：${note.noteId}`);
  if (html.includes('<script>alert(')) throw new Error('发现未清洗的脚本');
  const tree = parse(html);
  let prose: any;
  const ids = new Set<string>(), links: string[] = [];
  walk(tree, node => {
    const id = attribute(node, 'id'); if (id) ids.add(id);
    if (attribute(node, 'class') === 'prose') prose = node;
    const href = attribute(node, 'href'); if (href?.startsWith('/cs-notes/read/') || href?.startsWith('#')) links.push(href);
  });
  assert.ok(prose, `没有正文容器：${note.noteId}`);
  let images = 0, tables = 0, headings = 0;
  const code: string[] = [];
  walk(prose, node => {
    if (node.tagName === 'img') {
      images++;
      assert.ok(attribute(node, 'src')?.startsWith('/cs-notes/content-assets/'), `图片仍依赖外站：${note.noteId}`);
    }
    if (node.tagName === 'table') tables++;
    if (/^h[1-6]$/.test(node.tagName ?? '')) headings++;
    if (node.tagName === 'pre') code.push(textOf(node));
  });
  const expected = integrity.notes.find((n: any) => n.noteId === note.noteId);
  assert.equal(images, expected.images, `HTML 图片缺失：${note.noteId}`);
  assert.equal(tables, expected.tables, `HTML 表格缺失：${note.noteId}`);
  assert.equal(headings, expected.headings, `HTML 标题缺失：${note.noteId}`);
  assert.equal(code.length, expected.codeBlocks, `HTML 代码缺失：${note.noteId}`);
  const original = await readFile(`content/upstream/${note.sourcePath}`, 'utf8');
  assert.deepEqual(code.map(value => value.replace(/\n$/, '')), fingerprint(sourceBody(original, note.title, note.sourcePath)).code.map(value => value.replace(/\n$/, '')), `HTML 代码内容改变：${note.noteId}`);
  pages.set(`/cs-notes/read/${note.route}.html`, { ids, links });
}
const broken: { from: string; href: string }[] = [];
for (const [from, page] of pages) for (const href of page.links) {
  const target = new URL(href, `https://reader.invalid${from}`);
  const destination = pages.get(target.pathname);
  if (!destination || (target.hash && !destination.ids.has(decodeURIComponent(target.hash.slice(1))))) broken.push({ from, href });
}
await writeFile('content/reports/links.json', JSON.stringify({ pages: pages.size, broken }, null, 2) + '\n');
assert.equal(broken.length, 0, `站内页面/锚点断链 ${broken.length} 处，见 content/reports/links.json`);
console.log(`静态页面检查通过：${pages.size} 篇正文的标题、代码、表格、图片完整，站内链接与锚点无断链，Pagefind 已生成。`);
