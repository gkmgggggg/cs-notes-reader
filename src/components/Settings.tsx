import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $reading, $storageError, initializeReading, saveReading } from '../stores/reading';
import { emptyData, mergeData, readingSchema, type ReadingData } from '../lib/schema';

export default function Settings() {
  const data = useStore($reading);
  const error = useStore($storageError);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<ReadingData | null>(null);
  useEffect(() => initializeReading(), []);
  function settings(update: Partial<ReadingData['settings']>) {
    saveReading({ ...$reading.get(), settings: { ...$reading.get().settings, ...update, updatedAt: new Date().toISOString() } });
  }
  function exportData() {
    const blob = new Blob([JSON.stringify({ ...$reading.get(), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `cs-notes-reading-${new Date().toISOString().slice(0, 10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('阅读记录已导出。');
  }
  return <div className="settings-panel">
    <section className="setting-section"><h2>让阅读舒服一点</h2><fieldset><legend>页面主题</legend><div className="segmented">{(['system', 'light', 'dark'] as const).map((theme, index) => <button key={theme} className={data.settings.theme === theme ? 'selected' : ''} aria-pressed={data.settings.theme === theme} onClick={() => settings({ theme })}>{['跟随系统', '浅色', '深色'][index]}</button>)}</div></fieldset>
      <fieldset><legend>正文字号</legend><div className="segmented">{([16, 18, 20] as const).map(size => <button key={size} className={data.settings.fontSize === size ? 'selected' : ''} aria-pressed={data.settings.fontSize === size} onClick={() => settings({ fontSize: size })}>{size} px</button>)}</div></fieldset>
    </section>
    <section className="setting-section"><h2>保存你的阅读记录</h2><p>书签、进度和设置仅保存在当前浏览器。换设备、换域名或清理浏览器前，可以先导出一份备份。</p>
      <div className="settings-actions"><button className="primary-button" onClick={exportData}>导出记录</button><label className="small-button file-label">选择备份文件<input type="file" accept="application/json,.json" onChange={async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        try { if (file.size > 2 * 1024 * 1024) throw new Error(); setPending(readingSchema.parse(JSON.parse(await file.text()))); setMessage('已读取备份，请确认后合并。'); }
        catch { setPending(null); setMessage('备份文件格式不正确，现有记录保持不变。'); }
        event.target.value = '';
      }} /></label></div>
      {pending ? <div className="import-confirm"><p>将合并 {Object.keys(pending.records).length} 条阅读记录和 {Object.keys(pending.bookmarks).length} 个书签，重复项保留较新记录。</p><button className="small-button selected" onClick={() => { saveReading(mergeData($reading.get(), pending)); setPending(null); setMessage('阅读记录已合并。'); }}>确认合并</button><button className="small-button" onClick={() => setPending(null)}>取消</button></div> : null}
    </section>
    <section className="setting-section"><h2>重新开始</h2><p>仅清除这个阅读站保存的个人记录。</p><button className="small-button danger" onClick={() => { if (window.confirm('确认清除进度、书签和阅读设置？建议先导出备份。')) { saveReading(emptyData()); setMessage('记录已清除。'); } }}>清除阅读记录</button></section>
    {message || error ? <p role="status" className="settings-message">{error || message}</p> : null}
  </div>;
}
