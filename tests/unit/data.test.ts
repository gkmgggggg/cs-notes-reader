import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyData, readingSchema, mergeData } from '../../src/lib/schema.ts';
import { rewriteLink } from '../../scripts/import-content.ts';
import { joinBase } from '../../src/lib/paths.ts';

test('重复记录合并保留较新值，不覆盖其他章节', () => {
  const current = emptyData();
  current.records.mysql = { anchor: '索引', scrollRatio: .4, completed: true, updatedAt: '2026-10-12T00:00:00.000Z' };
  const incoming = emptyData();
  incoming.records.mysql = { anchor: '复制', scrollRatio: .7, completed: true, updatedAt: '2026-10-12T01:00:00.000Z' };
  incoming.records.http = { anchor: '', scrollRatio: .1, completed: false, updatedAt: '2026-10-12T01:00:00.000Z' };
  const merged = mergeData(current, incoming);
  assert.equal(merged.records.mysql.anchor, '复制'); assert.equal(merged.records.http.scrollRatio, .1);
  assert.equal(current.records.mysql.anchor, '索引');
});
test('拒绝损坏、未知版本和危险对象键的数据', () => {
  assert.throws(() => readingSchema.parse({ ...emptyData(), schemaVersion: 2 }));
  assert.throws(() => readingSchema.parse({ ...emptyData(), records: { mysql: { scrollRatio: 1.5 } } }));
  const invalid = JSON.parse('{"schemaVersion":1,"records":{"__proto__":{}},"bookmarks":{},"settings":{"theme":"system","fontSize":18,"updatedAt":"1970-01-01T00:00:00.000Z"}}');
  assert.throws(() => readingSchema.parse(invalid));
});
test('JSON 备份往返保持有效记录', () => {
  const original = emptyData();
  original.bookmarks['mysql#索引'] = { noteId: 'mysql', anchor: '索引', updatedAt: '2026-10-12T00:00:00.000Z' };
  assert.deepEqual(readingSchema.parse(JSON.parse(JSON.stringify(original))), original);
});
test('中文路径、上游绝对链接和历史别名都指向站内正文', () => {
  assert.equal(rewriteLink('Java%20并发.md#线程状态', 'notes/Java IO.md'), '/cs-notes/read/java/concurrency.html#线程状态');
  assert.equal(rewriteLink('https://github.com/CyC2018/CS-Notes/blob/master/notes/MySQL.md', 'notes/HTTP.md'), '/cs-notes/read/database/mysql.html');
  assert.equal(rewriteLink('Java%20基础.md', 'notes/Java IO.md'), '/cs-notes/read/java/basics.html');
  assert.equal(rewriteLink('计算机网络.md', 'notes/HTTP.md'), '/cs-notes/read/network/computer-networks.html');
  assert.match(rewriteLink('notes/设计模式%20%20-%20单例.md', 'notes/设计模式 - 目录1.md'), /^\/cs-notes\/read\/object-oriented\/design-patterns\//);
  assert.equal(rewriteLink('https://example.com/reference', 'notes/HTTP.md'), 'https://example.com/reference');
});
test('部署前缀保留一个斜杠，根路径与子路径一致', () => {
  assert.equal(joinBase('/cs-notes', 'reading.html'), '/cs-notes/reading.html');
  assert.equal(joinBase('/cs-notes/', '/read/java/concurrency.html'), '/cs-notes/read/java/concurrency.html');
  assert.equal(joinBase('/', 'settings.html'), '/settings.html');
  assert.equal(joinBase('/cs-notes', ''), '/cs-notes/');
});
