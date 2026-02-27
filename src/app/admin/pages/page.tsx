'use client';
import { useState, useEffect } from 'react';

export default function AdminPages() {
  const [toggles, setToggles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  useEffect(() => { fetch('/api/admin/pages').then(r => r.json()).then(d => { setToggles(d); setLoading(false); }); }, []);

  const toggle = async (t: any) => {
    setSaving(t.pageKey);
    await fetch('/api/admin/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageKey: t.pageKey, enabled: !t.enabled, label: t.label }) });
    setToggles(prev => prev.map(p => p.pageKey === t.pageKey ? { ...p, enabled: !p.enabled } : p));
    setSaving('');
  };

  const icons: Record<string, string> = { home: 'fa-solid fa-house', books: 'fa-solid fa-book', categories: 'fa-solid fa-folder', author: 'fa-solid fa-user', blog: 'fa-solid fa-pen-nib', search: 'fa-solid fa-magnifying-glass', support: 'fa-solid fa-heart' };

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-eye mr-3" style={{ color: 'var(--color-primary)' }}></i>Page Visibility</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Toggle pages on/off. Disabled pages won&apos;t appear in the navigation or be accessible to visitors.</p>
      </div>
      <div className="card space-y-1">
        {toggles.map(t => (
          <div key={t.pageKey} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <i className={`${icons[t.pageKey] || 'fa-solid fa-file'} w-5 text-center`} style={{ color: 'var(--color-primary)' }}></i>
              <div>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>/{t.pageKey === 'home' ? '' : t.pageKey}</p>
              </div>
            </div>
            <button className={`toggle ${t.enabled ? 'active' : ''} ${saving === t.pageKey ? 'opacity-50' : ''}`} onClick={() => toggle(t)} disabled={!!saving} />
          </div>
        ))}
      </div>
    </div>
  );
}
