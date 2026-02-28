'use client';
import { useState, useEffect } from 'react';
export default function AdminPages() {
  const [toggles, setToggles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  useEffect(() => { fetch('/api/admin/pages').then(r => r.json()).then(d => { setToggles(Array.isArray(d) ? d : []); setLoading(false); }); }, []);
  const toggle = async (t: any) => {
    setSaving(t.pageKey);
    await fetch('/api/admin/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageKey: t.pageKey, enabled: !t.enabled, label: t.label }) });
    setToggles(prev => prev.map(p => p.pageKey === t.pageKey ? { ...p, enabled: !p.enabled } : p));
    setSaving('');
  };
  const icons: Record<string, string> = { home: 'fa-solid fa-house', books: 'fa-solid fa-book', categories: 'fa-solid fa-folder', author: 'fa-solid fa-user', blog: 'fa-solid fa-pen-nib', search: 'fa-solid fa-magnifying-glass', support: 'fa-solid fa-heart' };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fa-solid fa-eye mr-2" style={{ color: 'var(--color-primary)' }}></i>Page Visibility
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Toggle pages on/off. Disabled pages won&apos;t appear in the navigation.</p>
      </div>
      {toggles.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fa-solid fa-eye" style={{ fontSize: '2rem', color: 'var(--text-faint)', display: 'block', marginBottom: '1rem' }}></i>
          <p style={{ color: 'var(--text-muted)' }}>No page toggles found. Try re-seeding the database.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {toggles.map(t => (
            <div key={t.pageKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <i className={icons[t.pageKey] || 'fa-solid fa-file'} style={{ width: 20, textAlign: 'center', color: 'var(--color-primary)' }}></i>
                <div>
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>/{t.pageKey === 'home' ? '' : t.pageKey}</p>
                </div>
              </div>
              <button
                className={`toggle ${t.enabled ? 'active' : ''}`}
                onClick={() => toggle(t)}
                disabled={!!saving}
                style={{ opacity: saving === t.pageKey ? 0.5 : 1 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
