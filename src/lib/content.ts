import manifest from '../../content/manifest.json';
import { joinBase } from './paths';

export const notes = manifest;
export type Note = typeof notes[number];
export const rootNotes = notes.filter(note => !note.parentId && !note.archived);
export const childrenOf = (note: Note) => notes.filter(child => child.parentId === note.noteId);
export const chapterLabel = (note: Note) => note.parentId ? note.title.split(' · ').at(-1)! : note.title;
export const categories = [
  { id: 'algorithms', title: '算法', detail: '从题型到解题方法', number: '01' },
  { id: 'os', title: '操作系统', detail: '理解计算机如何工作', number: '02' },
  { id: 'network', title: '网络', detail: '从协议到请求与响应', number: '03' },
  { id: 'database', title: '数据库', detail: '数据、索引与事务', number: '04' },
  { id: 'java', title: 'Java', detail: '语言、并发与运行时', number: '05' },
  { id: 'system-design', title: '系统设计', detail: '构建可靠的系统', number: '06' },
  { id: 'object-oriented', title: '面向对象', detail: '设计思想与模式', number: '07' },
  { id: 'tools', title: '工具', detail: '让工作更有效率', number: '08' },
  { id: 'practice', title: '编码实践', detail: '写出清晰的代码', number: '09' }
];
export const base = joinBase(import.meta.env.BASE_URL, '');
export const url = (path = '') => joinBase(base, path);
export const noteUrl = (note: Note, anchor = '') => `${url(`read/${note.route}.html`)}${anchor ? `#${encodeURIComponent(anchor)}` : ''}`;
