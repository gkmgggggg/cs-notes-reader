import { readFile, access, readdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import manifest from '../content/manifest.json' with { type: 'json' };
import { noteMetadata } from '../src/lib/schema.ts';
import { base } from './import-content.ts';
import aliases from '../content/aliases.json' with { type: 'json' };
import { fingerprint, parseBody, sourceBody } from './content-integrity.ts';

const sources = (await readdir('content/upstream/notes')).filter(file => file.endsWith('.md'));
assert.equal((await readdir('src/content/notes')).filter(file => file.endsWith('.md')).length, manifest.length, '生成目录含有未纳入清单的文档');
assert.equal(sources.length, manifest.length + Object.keys(aliases).length, '上游文件没有全部纳入清单');
for (const file of sources) assert.ok(manifest.some(n => n.sourcePath === `notes/${file}`) || Object.hasOwn(aliases, `notes/${file}`), `遗漏源文件：${file}`);
for (const target of Object.values(aliases)) assert.ok(manifest.some(n => n.sourcePath === target), `别名缺少目标：${target}`);
const report = JSON.parse(await readFile('content/reports/import.json', 'utf8'));
assert.deepEqual(report.missingImages, [], '正文图片未全部本地化');
const integrity = [];

const ids = new Set<string>();
const routes = new Set<string>();
for (const note of manifest) {
  if (ids.has(note.noteId) || routes.has(note.route)) throw new Error(`重复章节或路由：${note.noteId}`);
  ids.add(note.noteId); routes.add(note.route);
  const body = await readFile(`src/content/notes/${note.noteId}.md`, 'utf8');
  const fields = Object.fromEntries(body.split('---')[1].trim().split('\n').map(line => {
    const colon = line.indexOf(':');
    return [line.slice(0, colon), JSON.parse(line.slice(colon + 1).trim())];
  }));
  noteMetadata.parse(fields);
  for (const [key, value] of Object.entries(note)) assert.equal(fields[key], value, `元数据不同步：${note.noteId}/${key}`);
  const original = await readFile(`content/upstream/${note.sourcePath}`, 'utf8');
  const expected = fingerprint(sourceBody(original, note.title, note.sourcePath));
  const actual = fingerprint(parseBody(body.replace(/^---\n[\s\S]*?\n---\n/, '')));
  assert.deepEqual(actual, expected, `正文、代码、标题、图片或表格有遗漏：${note.sourcePath}`);
  integrity.push({ noteId: note.noteId, sourcePath: note.sourcePath, characters: expected.prose.length, codeBlocks: expected.code.length, headings: expected.headings.length, images: expected.images, tables: expected.tables });
  for (const match of body.matchAll(/\/cs-notes\/content-assets\/([^"\s)<>]+)/g)) await access(`public/content-assets/${decodeURIComponent(match[1])}`);
  for (const match of body.matchAll(/\/cs-notes\/read\/([^\s)#"<>]+)\.html/g)) if (!routes.has(match[1]) && !manifest.some(n => n.route === match[1])) throw new Error(`站内断链：${match[0]}`);
  if (body.includes('<!-- GFM-TOC -->')) throw new Error(`自动目录未清理：${note.noteId}`);
}
await writeFile('content/reports/integrity.json', JSON.stringify({ pages: integrity.length, verified: true, notes: integrity }, null, 2) + '\n');
console.log(`内容检查通过：${sources.length} 个源文件全部覆盖，${manifest.length} 篇正文与上游逐篇一致，图片全部本地化，部署前缀 ${base}。`);
