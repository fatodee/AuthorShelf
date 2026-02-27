'use client';
import { useState, useEffect } from 'react';

export default function AdminAppearance() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetch('/api/admin/appearance').then(r => r.json()).then(d => { setData(d); setLoading(false); }); }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/appearance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setMsg('Saved! Refresh the site to see changes.'); setTimeout(() => setMsg(''), 4000);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-palette mr-3" style={{ color: 'var(--color-primary)' }}></i>Appearance</h1>
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
      </div>
      {msg && <div className="p-3 rounded-lg mb-4 text-sm bg-green-50 text-green-800"><i className="fa-solid fa-check-circle mr-2"></i>{msg}</div>}
      <div className="card space-y-6">
        <div>
          <h2 className="font-bold mb-3"><i className="fa-solid fa-droplet mr-2"></i>Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">Primary Color</label><div className="flex gap-2 items-center"><input type="color" value={data.primary_color || '#6366f1'} onChange={e => setData({ ...data, primary_color: e.target.value })} className="w-12 h-10 rounded cursor-pointer" /><input className="form-input" value={data.primary_color || '#6366f1'} onChange={e => setData({ ...data, primary_color: e.target.value })} /></div><p className="form-hint">Used for buttons, links, and accents throughout the site.</p></div>
            <div><label className="form-label">Secondary Color</label><div className="flex gap-2 items-center"><input type="color" value={data.secondary_color || '#f59e0b'} onChange={e => setData({ ...data, secondary_color: e.target.value })} className="w-12 h-10 rounded cursor-pointer" /><input className="form-input" value={data.secondary_color || '#f59e0b'} onChange={e => setData({ ...data, secondary_color: e.target.value })} /></div><p className="form-hint">Used for highlights, badges, and secondary elements.</p></div>
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-3"><i className="fa-solid fa-font mr-2"></i>Typography</h2>
          <select className="form-input max-w-md" value={data.font_choice || 'classic'} onChange={e => setData({ ...data, font_choice: e.target.value })}>
            <option value="classic">Classic (Georgia + Segoe UI) — Traditional book feel</option>
            <option value="modern">Modern (Helvetica Neue) — Clean and contemporary</option>
            <option value="literary">Literary (Palatino) — Elegant and scholarly</option>
          </select>
        </div>
        <div>
          <h2 className="font-bold mb-3"><i className="fa-solid fa-circle-half-stroke mr-2"></i>Default Theme</h2>
          <select className="form-input max-w-md" value={data.default_theme || 'light'} onChange={e => setData({ ...data, default_theme: e.target.value })}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
          <p className="form-hint">Readers can still toggle between light/dark mode on the reading page.</p>
        </div>
      </div>
    </div>
  );
}
