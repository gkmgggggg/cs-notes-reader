import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $reading, $storageError, initializeReading, toggleBookmark, updateRecord } from '../stores/reading';

export default function ReaderToolbar({ noteId }: { noteId: string }) {
  const data = useStore($reading);
  const error = useStore($storageError);
  const anchor = useRef('');
  useEffect(() => {
    initializeReading();
    const headings = [...document.querySelectorAll<HTMLElement>('article h2[id],article h3[id],article h4[id]')];
    const currentHeading = () => {
      const marker = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 90) + (document.querySelector('.toolbar-wrapper')?.getBoundingClientRect().height ?? 50) + 16;
      return headings.filter(item => item.getBoundingClientRect().top <= marker).at(-1);
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      const span = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const heading = currentHeading();
      anchor.current = heading?.id ?? '';
      updateRecord(noteId, { anchor: anchor.current, scrollRatio: Math.min(1, Math.max(0, window.scrollY / span)) });
    };
    const scroll = () => { if (!timer) timer = setTimeout(() => { timer = undefined; save(); }, 1000); };
    const saved = $reading.get().records[noteId];
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    if (!location.hash && saved && new URLSearchParams(location.search).has('resume')) {
      resumeTimer = setTimeout(() => {
        const target = saved.anchor ? document.getElementById(saved.anchor) : null;
        if (target) target.scrollIntoView(); else window.scrollTo(0, saved.scrollRatio * (document.documentElement.scrollHeight - innerHeight));
      }, 200);
    }
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('pagehide', save);
    const sectionBookmark = () => {
      toggleBookmark(noteId, currentHeading()?.id ?? (location.hash ? decodeURIComponent(location.hash.slice(1)) : ''));
    };
    document.addEventListener('bookmark-section', sectionBookmark);
    return () => { clearTimeout(timer); clearTimeout(resumeTimer); window.removeEventListener('scroll', scroll); window.removeEventListener('pagehide', save); document.removeEventListener('bookmark-section', sectionBookmark); };
  }, [noteId]);
  const completed = data.records[noteId]?.completed ?? false;
  return <div className="reader-controls">
    <button className={data.bookmarks[`${noteId}#`] ? 'small-button selected' : 'small-button'} onClick={() => toggleBookmark(noteId)}>{data.bookmarks[`${noteId}#`] ? '★ 已收藏' : '☆ 收藏章节'}</button>
    <button className={completed ? 'small-button selected' : 'small-button'} onClick={() => updateRecord(noteId, { completed: !completed })}>{completed ? '✓ 已读' : '标记已读'}</button>
    <button className="small-button" onClick={() => document.dispatchEvent(new Event('bookmark-section'))}>收藏当前小节</button>
    {error ? <p className="storage-error" role="status">{error}</p> : null}
  </div>;
}
