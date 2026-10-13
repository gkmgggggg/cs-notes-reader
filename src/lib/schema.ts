import { z } from 'zod';

export const noteMetadata = z.object({
  noteId: z.string().regex(/^[a-z0-9-]+$/), title: z.string(), categoryId: z.string(), category: z.string(),
  route: z.string().regex(/^[a-z0-9/-]+$/), sourcePath: z.string(), order: z.number(),
  groupId: z.string(), parentId: z.string().nullable(), pageType: z.enum(['index', 'article']), archived: z.boolean(),
  sourceUrl: z.url(), sourceCommit: z.string().length(40)
});
const safeId = z.string().regex(/^[a-z0-9-]+$/).refine(value => !['constructor', 'prototype', '__proto__'].includes(value));
const record = z.object({ anchor: z.string().max(1000), scrollRatio: z.number().min(0).max(1), completed: z.boolean(), updatedAt: z.iso.datetime() });
const readingObjectSchema = z.object({
  schemaVersion: z.literal(1),
  records: z.record(safeId, record),
  bookmarks: z.record(z.string().regex(/^[a-z0-9-]+#/), z.object({ noteId: safeId, anchor: z.string().max(1000), updatedAt: z.iso.datetime() })),
  settings: z.object({ theme: z.enum(['system', 'light', 'dark']), fontSize: z.union([z.literal(16), z.literal(18), z.literal(20)]), updatedAt: z.iso.datetime() })
});
export const readingSchema = z.preprocess(input => {
  if (input && typeof input === 'object') {
    const object = input as Record<string, unknown>;
    for (const field of ['records', 'bookmarks']) {
      const map = object[field];
      if (map && typeof map === 'object' && Object.keys(map).some(key => ['__proto__', 'constructor', 'prototype'].includes(key))) return undefined;
    }
  }
  return input;
}, readingObjectSchema);
export type ReadingData = z.infer<typeof readingSchema>;
export const emptyData = (): ReadingData => ({ schemaVersion: 1, records: {}, bookmarks: {}, settings: { theme: 'system', fontSize: 18, updatedAt: new Date(0).toISOString() } });

export function mergeData(current: ReadingData, incoming: ReadingData): ReadingData {
  const merge = <T extends { updatedAt: string }>(a: Record<string, T>, b: Record<string, T>) => {
    const result = { ...a };
    for (const [key, value] of Object.entries(b)) if (!result[key] || value.updatedAt > result[key].updatedAt) result[key] = value;
    return result;
  };
  return { schemaVersion: 1, records: merge(current.records, incoming.records), bookmarks: merge(current.bookmarks, incoming.bookmarks), settings: incoming.settings.updatedAt > current.settings.updatedAt ? incoming.settings : current.settings };
}
