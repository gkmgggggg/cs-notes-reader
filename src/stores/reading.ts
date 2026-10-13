import { atom } from 'nanostores';
import { emptyData, readingSchema, type ReadingData } from '../lib/schema';

export const storageKey = 'cs-notes-reader:v1';
export const $reading = atom<ReadingData>(emptyData());
export const $storageError = atom('');
let initialized = false;

export function initializeReading() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) $reading.set(readingSchema.parse(JSON.parse(raw)));
  } catch { $storageError.set('浏览器中的阅读记录无法读取，当前仍可正常阅读。'); }
  applySettings();
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    try { $reading.set(event.newValue ? readingSchema.parse(JSON.parse(event.newValue)) : emptyData()); applySettings(); } catch { $storageError.set('其他页面的记录格式无法读取。'); }
  });
}
export function applySettings() {
  if (typeof document === 'undefined') return;
  const settings = $reading.get().settings;
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.style.setProperty('--reading-size', `${settings.fontSize}px`);
}
export function saveReading(data: ReadingData) {
  $reading.set(data);
  applySettings();
  try { localStorage.setItem(storageKey, JSON.stringify(data)); $storageError.set(''); }
  catch { $storageError.set('本次阅读记录无法保存，请检查浏览器存储设置。'); }
}
export function updateRecord(noteId: string, update: Partial<ReadingData['records'][string]>) {
  const current = $reading.get();
  const previous = current.records[noteId] ?? { anchor: '', scrollRatio: 0, completed: false, updatedAt: new Date(0).toISOString() };
  saveReading({ ...current, records: { ...current.records, [noteId]: { ...previous, ...update, updatedAt: new Date().toISOString() } } });
}
export function toggleBookmark(noteId: string, anchor = '') {
  const current = $reading.get();
  const key = `${noteId}#${anchor}`;
  const bookmarks = { ...current.bookmarks };
  if (bookmarks[key]) delete bookmarks[key]; else bookmarks[key] = { noteId, anchor, updatedAt: new Date().toISOString() };
  saveReading({ ...current, bookmarks });
}
