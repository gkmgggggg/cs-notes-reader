import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, sourceBody } from '../../scripts/content-integrity.ts';
import manifest from '../../content/manifest.json' with { type: 'json' };

test('九类目录齐全，网络保留原 README 的三个入口与六个子章节', () => {
  assert.equal(new Set(manifest.map(n => n.categoryId)).size, 9);
  const network = manifest.filter(n => n.categoryId === 'network' && !n.parentId);
  assert.deepEqual(network.map(n => n.title), ['计算机网络', 'HTTP', 'Socket']);
  assert.equal(manifest.filter(n => n.parentId === network[0].noteId).length, 6);
});
test('重复页面标题可以省略，旧版文档的第一节和代码必须保留', () => {
  assert.deepEqual(fingerprint(sourceBody('# SQL 语法\n\n## 一、基础\n\n正文', 'SQL 语法', 'notes/SQL 语法.md')).headings, ['一、基础']);
  const legacy = fingerprint(sourceBody('# 一、基础\n\n正文\n\n```sql\nSELECT 1;\n```\n\n# 二、创建表', 'SQL（旧版）', 'notes/SQL.md'));
  assert.deepEqual(legacy.headings, ['一、基础', '二、创建表']);
  assert.deepEqual(legacy.code, ['SELECT 1;']);
});
