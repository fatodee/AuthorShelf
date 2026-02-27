'use client';
import { useState, useEffect } from 'react';
export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(d => { setSettings(d); setLoading(false); }); }, []);
  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false); setMsg('Settings saved! Changes will appear on the site shortly.'); setTimeout(() => setMsg(''), 4000);
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.media?.path) update(key, data.media.path);
  };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}><i className="fa-solid fa-gear mr-2" style={{ color: 'var(--color-primary)' }}></i>Site Settings</h1>
        <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">{saving ? 'Saving...' : 'Save Settings'}</button>
      </div>
      {msg && <div className="admin-card mb-4" style={{ borderColor: 'var(--color-primary)', background: 'var(--color-primary-glow)' }}><span className="text-sm">{msg}</span></div>}
      <div className="space-y-6">
        <div className="admin-card space-y-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>General</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="admin-label">Site Name</label><input className="admin-input" value={settings.site_name || ''} onChange={e => update('site_name', e.target.value)} /><p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Shown in header, browser tab, and SEO.</p></div>
            <div><label className="admin-label">Tagline</label><input className="admin-input" value={settings.site_tagline || ''} onChange={e => update('site_tagline', e.target.value)} /><p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Short subtitle shown below the site name.</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="admin-label">Logo</label><input type="file" accept="image/*" onChange={e => handleUpload(e, 'logo')} className="admin-input" />{settings.logo && <img src={settings.logo} alt="Logo" className="mt-2 h-12" />}<p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>If no logo, site name text is used.</p></div>
            <div><label className="admin-label">Favicon</label><input type="file" accept="image/*" onChange={e => handleUpload(e, 'favicon')} className="admin-input" />{settings.favicon && <img src={settings.favicon} alt="Favicon" className="mt-2 h-8" />}<p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Small icon in browser tabs.</p></div>
          </div>
        </div>
        <div className="admin-card space-y-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>SEO</h2>
          <div><label className="admin-label">SEO Title</label><input className="admin-input" value={settings.seo_title || ''} onChange={e => update('seo_title', e.target.value)} /></div>
          <div><label className="admin-label">SEO Description</label><textarea className="admin-input" rows={3} value={settings.seo_description || ''} onChange={e => update('seo_description', e.target.value)} /></div>
        </div>
        <div className="admin-card space-y-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Homepage</h2>
          <div><label className="admin-label">Latest Section</label>
            <select className="admin-select" style={{maxWidth:400}} value={settings.homepage_latest || 'books'} onChange={e => update('homepage_latest', e.target.value)}>
              <option value="books">Latest Books</option><option value="chapters">Latest Chapters</option>
            </select></div>
        </div>
        <div className="admin-card space-y-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Footer</h2>
          <div><label className="admin-label">Footer Text</label><textarea className="admin-input" rows={2} value={settings.footer_text || ''} onChange={e => update('footer_text', e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
