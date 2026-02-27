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
    setSaving(false);
    setMsg('Settings saved! Refresh the site to see changes.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.media?.path) update(key, data.media.path);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-gear mr-3" style={{ color: 'var(--color-primary)' }}></i>Site Settings</h1>
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-check mr-2"></i>Save Settings</>}</button>
      </div>
      {msg && <div className="p-3 rounded-lg mb-4 text-sm bg-green-50 text-green-800 border border-green-200"><i className="fa-solid fa-check-circle mr-2"></i>{msg}</div>}
      <div className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-bold text-lg"><i className="fa-solid fa-globe mr-2"></i>General</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="form-label">Site Name</label><input className="form-input" value={settings.site_name || ''} onChange={e => update('site_name', e.target.value)} /><p className="form-hint">Shown in header, browser tab, and SEO.</p></div>
            <div><label className="form-label">Tagline</label><input className="form-input" value={settings.site_tagline || ''} onChange={e => update('site_tagline', e.target.value)} /><p className="form-hint">Short subtitle shown below the site name.</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="form-label">Logo</label><input type="file" accept="image/*" onChange={e => handleUpload(e, 'logo')} className="form-input" />{settings.logo && <img src={settings.logo} alt="Logo" className="mt-2 h-12" />}<p className="form-hint">If no logo, the site name text is used.</p></div>
            <div><label className="form-label">Favicon</label><input type="file" accept="image/*" onChange={e => handleUpload(e, 'favicon')} className="form-input" />{settings.favicon && <img src={settings.favicon} alt="Favicon" className="mt-2 h-8" />}<p className="form-hint">Small icon shown in browser tabs.</p></div>
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold text-lg"><i className="fa-solid fa-magnifying-glass mr-2"></i>SEO Defaults</h2>
          <div><label className="form-label">Default SEO Title</label><input className="form-input" value={settings.seo_title || ''} onChange={e => update('seo_title', e.target.value)} /><p className="form-hint">Used for homepage and pages without custom meta titles.</p></div>
          <div><label className="form-label">Default SEO Description</label><textarea className="form-input" rows={3} value={settings.seo_description || ''} onChange={e => update('seo_description', e.target.value)} /><p className="form-hint">Used for homepage meta description.</p></div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold text-lg"><i className="fa-solid fa-house mr-2"></i>Homepage</h2>
          <div><label className="form-label">Featured Section</label><select className="form-input max-w-md" value={settings.homepage_featured_section || 'featured'} onChange={e => update('homepage_featured_section', e.target.value)}><option value="featured">Featured Books</option><option value="latest">Latest Books</option><option value="none">Hide</option></select><p className="form-hint">What to show in the main hero section.</p></div>
          <div><label className="form-label">Latest Section</label><select className="form-input max-w-md" value={settings.homepage_latest_section || 'latest_books'} onChange={e => update('homepage_latest_section', e.target.value)}><option value="latest_books">Latest Books</option><option value="latest_chapters">Latest Chapters</option><option value="both">Both</option></select></div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold text-lg"><i className="fa-solid fa-paragraph mr-2"></i>Footer</h2>
          <div><label className="form-label">Footer Text</label><textarea className="form-input" rows={2} value={settings.footer_text || ''} onChange={e => update('footer_text', e.target.value)} /><p className="form-hint">Copyright notice and other footer content.</p></div>
        </div>
      </div>
    </div>
  );
}
