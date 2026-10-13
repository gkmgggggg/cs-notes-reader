import { basename } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';

const parser = unified().use(remarkParse).use(remarkGfm);
const textOf = (node: any): string => node.value ?? (node.children ?? []).map(textOf).join('');
const normalizeTitle = (value: string) => value.toLowerCase().replace(/[\s/·-]|目录/g, '');
export function sourceBody(raw: string, title: string, sourcePath: string): Root {
  const tree = parser.parse(raw.replace(/<!-- GFM-TOC -->[\s\S]*?<!-- GFM-TOC -->/g, ''));
  const heading = tree.children.find(n => n.type === 'heading' && n.depth === 1);
  if (heading && [title, basename(sourcePath, '.md')].some(t => normalizeTitle(t) === normalizeTitle(textOf(heading)))) tree.children.splice(tree.children.indexOf(heading), 1);
  return tree;
}
/** Independent of URLs, heading levels and Markdown formatting, but preserves all prose/code. */
export function fingerprint(tree: Root) {
  const prose: string[] = [], code: string[] = [], headings: string[] = [];
  let images = 0, tables = 0;
  function visit(node: any) {
    if (node.type === 'text' || node.type === 'inlineCode') prose.push(node.value);
    if (node.type === 'code') code.push(node.value);
    if (node.type === 'heading') headings.push(textOf(node));
    if (node.type === 'image') images++;
    if (node.type === 'table') tables++;
    if (node.type === 'html') {
      const visible = node.value.replace(/<!--[\s\S]*?-->/g, '');
      images += [...visible.matchAll(/<img\b/g)].length;
      prose.push(visible.replace(/<[^>]*>/g, ''));
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return { prose: prose.join('').replace(/\s+/g, ''), code, headings, images, tables };
}
export const parseBody = (body: string) => parser.parse(body);
