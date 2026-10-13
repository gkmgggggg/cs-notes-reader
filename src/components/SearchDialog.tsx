import { useEffect, useRef, useState } from 'react';
import { base } from '../lib/content';

type SearchData = { url: string; excerpt: string; meta: { title?: string; category?: string }; sub_results?: { url: string; title: string; excerpt: string }[] };
type SearchApi = { search: (query: string) => Promise<{ results: { data: () => Promise<SearchData> }[] }> };
let searchModule: Promise<SearchApi> | undefined;
const getSearch = (): Promise<SearchApi> => searchModule ??= import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).catch(error => { searchModule = undefined; throw error; });
function plainText(html: string) { return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''; }
function destination(path: string) {
  const url = new URL(path, location.origin);
  const prefix = url.pathname.startsWith(base) ? '' : base.replace(/\/$/, '');
  return `${prefix}${url.pathname}${url.hash}`;
}

export default function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchData[]>([]);
  const [status, setStatus] = useState('输入关键词，在笔记中寻找答案。');
  const [active, setActive] = useState(0);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.current?.showModal(); }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (!query.trim()) { setResults([]); setStatus('输入关键词，在笔记中寻找答案。'); return; }
    let cancelled = false;
    setStatus('正在搜索…');
    const timer = setTimeout(async () => {
      try {
        const api = await getSearch();
        const matches = await api.search(query.trim());
        const data = await Promise.all(matches.results.slice(0, 8).map(result => result.data()));
        if (!cancelled) { setResults(data); setActive(0); setStatus(data.length ? `找到 ${data.length} 条相关笔记` : '没有找到结果，试试其他关键词。'); }
      } catch {
        if (!cancelled) { setResults([]); setStatus('搜索暂时不可用，请稍后重试。'); }
      }
    }, 160);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);
  return <>
    <button className="search-trigger" onClick={() => dialog.current?.showModal()} aria-label="搜索笔记"><span>⌕</span><span>搜索笔记</span><kbd>⌘ K</kbd></button>
    <dialog ref={dialog} className="search-dialog" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="dialog-heading"><span className="eyebrow">在知识中寻找</span><button className="icon-button" aria-label="关闭搜索" onClick={() => dialog.current?.close()}>✕</button></div>
      <input autoFocus type="search" aria-label="搜索关键词" placeholder="例如：虚拟内存、ThreadLocal…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => {
        if (event.key === 'ArrowDown') { event.preventDefault(); setActive(index => Math.min(index + 1, results.length - 1)); }
        if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => Math.max(0, index - 1)); }
        if (event.key === 'Enter' && results[active]) { event.preventDefault(); location.href = destination(results[active].sub_results?.[0]?.url ?? results[active].url); }
      }} />
      <p className="search-status" role="status">{status}</p>
      <div className="search-results">{results.map((result, index) => {
        const section = result.sub_results?.[0];
        return <a className={active === index ? 'search-result active' : 'search-result'} href={destination(section?.url ?? result.url)} key={result.url} onMouseEnter={() => setActive(index)}>
          <span className="eyebrow">{result.meta.category ?? '笔记'}</span><strong>{result.meta.title ?? section?.title ?? '阅读笔记'}</strong>
          <p>{plainText(section?.excerpt ?? result.excerpt)}</p>
        </a>;
      })}</div>
      <div className="dialog-footer">↑ ↓ 选择　↵ 阅读　Esc 关闭</div>
    </dialog>
  </>;
}
