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
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}><i className="fa-solid fa-palette mr-2" style={{ color: 'var(--color-primary)' }}></i>Appearance</h1>
        <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">{saving ? 'Saving...' : 'Save'}</button>
      </div>
      {msg && <div className="admin-card mb-4" style={{ borderColor: 'var(--color-primary)', background: 'var(--color-primary-glow)' }}><span className="text-sm">{msg}</span></div>}
      <div className="admin-card space-y-8">
        <div>
          <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Primary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={data.primary_color || '#8b1a1a'} onChange={e => setData({ ...data, primary_color: e.target.value })} className="w-12 h-10 rounded cursor-pointer border-none" />
                <input className="admin-input" value={data.primary_color || '#8b1a1a'} onChange={e => setData({ ...data, primary_color: e.target.value })} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Buttons, links, and accents throughout the site.</p>
            </div>
            <div>
              <label className="admin-label">Secondary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={data.secondary_color || '#d4a574'} onChange={e => setData({ ...data, secondary_color: e.target.value })} className="w-12 h-10 rounded cursor-pointer border-none" />
                <input className="admin-input" value={data.secondary_color || '#d4a574'} onChange={e => setData({ ...data, secondary_color: e.target.value })} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Highlights, badges, secondary elements.</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Typography</h2>
          <select className="admin-select" style={{ maxWidth: 400 }} value={data.font_choice || 'literary'} onChange={e => setData({ ...data, font_choice: e.target.value })}>
            <option value="classic">Classic — Georgia serif, traditional feel</option>
            <option value="modern">Modern — Inter, clean & contemporary</option>
            <option value="literary">Literary — Playfair Display + Lora</option>
            <option value="elegant">Elegant — Cormorant Garamond + EB Garamond</option>
            <option value="minimal">Minimal — DM Sans, Swiss simplicity</option>
            <option value="editorial">Editorial — Libre Baskerville + Source Sans</option>
            <option value="romantic">Romantic — Italiana + Raleway</option>
            <option value="bold">Bold — Sora, geometric & striking</option>
            <option value="typewriter">Typewriter — Special Elite + Courier Prime</option>
            <option value="luxe">Luxe — Cinzel + Nunito Sans, high fashion</option>
          </select>
        </div>
        <div>
          <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Default Theme</h2>
          <select className="admin-select" style={{ maxWidth: 400 }} value={data.default_theme || 'dark'} onChange={e => setData({ ...data, default_theme: e.target.value })}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Readers can still toggle on the reading page.</p>
        </div>
      </div>
    </div>
  );
}
