import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, RootContent } from 'mdast';
import { resolveSourcePath } from './source-path.ts';

const parser = unified().use(remarkParse).use(remarkGfm);
const categories: Record<string, string> = { 算法: 'algorithms', 操作系统: 'os', 网络: 'network', 数据库: 'database', Java: 'java', 系统设计: 'system-design', 面向对象: 'object-oriented', 工具: 'tools', 编码实践: 'practice' };
const slugs: Record<string, string> = {
  '剑指 Offer 题解 - 目录': 'offer', 'Leetcode 题解 - 目录': 'leetcode', '算法 - 目录': 'fundamentals',
  '计算机操作系统 - 目录': 'operating-systems', '计算机网络 - 目录': 'computer-networks', '设计模式 - 目录': 'design-patterns',
  Linux: 'linux', HTTP: 'http', Socket: 'socket', MySQL: 'mysql', Redis: 'redis', Git: 'git', Docker: 'docker',
  数据库系统原理: 'principles', 'SQL 语法': 'sql', 'SQL 练习': 'sql-exercises', SQL: 'sql-legacy',
  'Java 基础': 'basics', 'Java 容器': 'collections', 'Java 并发': 'concurrency', 'Java 虚拟机': 'jvm', 'Java IO': 'io',
  系统设计基础: 'basics', 分布式: 'distributed', 集群: 'clusters', 攻击技术: 'security', 缓存: 'cache', 消息队列: 'message-queues',
  面向对象思想: 'principles', 设计模式: 'patterns-collected', '设计模式 - 目录1': 'patterns-legacy-index',
  构建工具: 'build-tools', 正则表达式: 'regular-expressions', 代码可读性: 'readability', 代码风格规范: 'style',
  概述: 'overview', 物理层: 'physical', 链路层: 'link', 网络层: 'network', 传输层: 'transport', 应用层: 'application',
  进程管理: 'processes', 死锁: 'deadlocks', 内存管理: 'memory', 设备管理: 'devices', 链接: 'linking'
};
const preserved: Record<string, { noteId: string; route: string; title: string }> = {
  'Java 并发': { noteId: 'java-concurrency', route: 'java/concurrency', title: 'Java 并发' },
  MySQL: { noteId: 'mysql', route: 'database/mysql', title: 'MySQL' },
  HTTP: { noteId: 'http', route: 'network/http', title: 'HTTP' },
  'Leetcode 题解 - 动态规划': { noteId: 'dynamic-programming', route: 'algorithms/dynamic-programming', title: 'LeetCode 动态规划' },
  '计算机操作系统 - 内存管理': { noteId: 'virtual-memory', route: 'os/memory', title: '操作系统 · 内存管理' }
};
export interface CatalogNote { noteId: string; title: string; categoryId: string; category: string; route: string; sourcePath: string; order: number; groupId: string; parentId: string | null; pageType: 'index' | 'article'; archived: boolean }
const textOf = (node: any): string => node.value ?? (node.children ?? []).map(textOf).join('');
function links(tree: Root, sourcePath: string) {
  const result: { path: string; title: string }[] = [];
  const visit = (node: Root | RootContent) => {
    if (node.type === 'link') { const path = resolveSourcePath(node.url, sourcePath); if (path?.startsWith('notes/')) result.push({ path, title: textOf(node).replace(/\.md$/, '') }); }
    if ('children' in node) node.children.forEach(child => visit(child as RootContent));
  };
  visit(tree); return result;
}
export async function buildCatalog(sourceRoot: string) {
  const sources = (await readdir(resolve(sourceRoot, 'notes'))).filter(f => f.endsWith('.md')).sort();
  const aliases: Record<string, string> = {};
  for (const file of sources) {
    const raw = (await readFile(resolve(sourceRoot, 'notes', file), 'utf8')).trim();
    const tree = parser.parse(raw);
    if (tree.children.length === 1 && tree.children[0].type === 'paragraph' && tree.children[0].children.length === 1 && tree.children[0].children[0].type === 'link') {
      const target = resolveSourcePath(tree.children[0].children[0].url, `notes/${file}`);
      if (target) aliases[`notes/${file}`] = target;
    }
  }
  const result: CatalogNote[] = [];
  async function add(path: string, title: string, category: string, parent?: CatalogNote, archived = false) {
    path = aliases[path] ?? path;
    if (result.some(n => n.sourcePath === path)) return;
    if (!sources.includes(basename(path))) throw new Error(`上游目录引用缺失：${path}`);
    const stem = basename(path, '.md');
    const leaf = stem.split(/\s+-\s+/).at(-1)!;
    const suffix = slugs[stem] ?? slugs[leaf] ?? (parent?.route.endsWith('/offer') ? `question-${stem.match(/^[\d.]+/)![0].replace(/\.$/, '').replaceAll('.', '-')}` : `topic-${createHash('sha256').update(path).digest('hex').slice(0, 10)}`);
    const route = preserved[stem]?.route ?? (parent ? `${parent.route}/${suffix}` : `${categories[category]}/${suffix}`);
    if (parent && !/^\d/.test(stem)) title = `${parent.title} · ${title}`;
    const note: CatalogNote = { noteId: preserved[stem]?.noteId ?? route.replaceAll('/', '-'), title: preserved[stem]?.title ?? title, categoryId: categories[category], category, route, sourcePath: path, order: result.length + 1, groupId: parent?.noteId ?? route.replaceAll('/', '-'), parentId: parent?.noteId ?? null, pageType: stem.endsWith(' - 目录') || stem.endsWith(' - 目录1') ? 'index' : 'article', archived };
    if (!parent) note.groupId = note.noteId;
    result.push(note);
    if (note.pageType === 'index' && !archived) for (const child of links(parser.parse(await readFile(resolve(sourceRoot, path), 'utf8')), path)) await add(child.path, child.title, category, note);
  }
  const readme = parser.parse(await readFile(resolve(sourceRoot, 'README.md'), 'utf8'));
  let category = '';
  for (const node of readme.children) {
    if (node.type === 'heading' && node.depth === 2) category = Object.keys(categories).find(c => textOf(node).endsWith(c)) ?? '';
    if (category) for (const link of links({ type: 'root', children: [node] }, 'README.md')) await add(link.path, link.title, category);
  }
  // Preserve older, substantive versions too; they are available as supplemental pages.
  await add('notes/SQL.md', 'SQL（旧版）', '数据库', undefined, true);
  await add('notes/设计模式.md', '设计模式（合订本）', '面向对象', undefined, true);
  await add('notes/设计模式 - 目录1.md', '设计模式（旧版目录）', '面向对象', undefined, true);
  const unclassified = sources.filter(f => !aliases[`notes/${f}`] && !result.some(n => n.sourcePath === `notes/${f}`));
  if (unclassified.length) throw new Error(`未分类的上游文档：${unclassified.join(', ')}`);
  await mkdir('content/reports', { recursive: true });
  await writeFile('content/manifest.json', JSON.stringify(result, null, 2) + '\n');
  await writeFile('content/aliases.json', JSON.stringify(aliases, null, 2) + '\n');
  await writeFile('content/reports/coverage.json', JSON.stringify({ sourceFiles: sources.length, importedPages: result.length, aliases, unclassified }, null, 2) + '\n');
  console.log(`目录生成：${sources.length} 个源文件，${result.length} 个阅读页，${Object.keys(aliases).length} 个跳转别名，遗漏 ${unclassified.length}。`);
}
