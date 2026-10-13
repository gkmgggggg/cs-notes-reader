import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $reading, initializeReading, toggleBookmark } from '../stores/reading';
import { notes, noteUrl } from '../lib/content';

export default function ReadingDashboard({ compact = false }: { compact?: boolean }) {
  const data = useStore($reading);
  useEffect(() => initializeReading(), []);
  const recent = Object.entries(data.records).sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));
  const last = recent.find(([id]) => notes.some(note => note.noteId === id));
  const lastNote = notes.find(note => note.noteId === last?.[0]);
  if (compact) return <div className="continue-card">
    <span className="eyebrow">继续你的阅读</span>
    <h3>{lastNote ? lastNote.title : '从一个知识点开始'}</h3>
    <p>{lastNote ? '上次停下的地方，已经为你保存。' : '选择一篇笔记，慢慢读，认真想。'}</p>
    <a className="text-link" href={lastNote && last ? `${noteUrl(lastNote)}?resume=1${last[1].anchor ? `#${encodeURIComponent(last[1].anchor)}` : ''}` : noteUrl(notes[0])}>{lastNote ? '继续阅读' : '开始阅读'} <span>↗</span></a>
  </div>;
  return <div className="dashboard">
    <section><h2>最近阅读</h2>{recent.length ? recent.map(([id, record]) => {
      const note = notes.find(n => n.noteId === id);
      return <div className="reading-row" key={id}><div>{note ? <a href={`${noteUrl(note)}?resume=1${record.anchor ? `#${encodeURIComponent(record.anchor)}` : ''}`}>{note.title}</a> : <span>章节暂不可用</span>}<small>{record.completed ? '已标记已读' : `阅读位置 ${Math.round(record.scrollRatio * 100)}%`}</small></div><span>{record.updatedAt.slice(0, 10)}</span></div>;
    }) : <p className="empty-state">还没有阅读记录。打开一篇笔记后，你的阅读位置会保存在这里。</p>}</section>
    <section><h2>我的书签</h2>{Object.entries(data.bookmarks).length ? Object.entries(data.bookmarks).map(([key, bookmark]) => {
      const note = notes.find(n => n.noteId === bookmark.noteId);
      return <div className="reading-row" key={key}><div>{note ? <a href={noteUrl(note, bookmark.anchor)}>{note.title}</a> : <span>章节暂不可用</span>}<small>{bookmark.anchor ? `小节：${bookmark.anchor}` : '整篇章节'}</small></div><button className="small-button" onClick={() => toggleBookmark(bookmark.noteId, bookmark.anchor)}>移除</button></div>;
    }) : <p className="empty-state">值得再读的内容，可以随时收藏。</p>}</section>
  </div>;
}
