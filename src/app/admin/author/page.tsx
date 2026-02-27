'use client';
import { useState, useEffect } from 'react';
import RichEditor from '@/components/admin/RichEditor';

export default function AdminAuthor() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetch('/api/admin/author').then(r => r.json()).then(d => { setData(d || {}); setLoading(false); }); }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/author', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const d = await res.json();
    if (d.media?.path) setData({ ...data, photo: d.media.path });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-user-pen mr-3" style={{ color: 'var(--color-primary)' }}></i>Author Profile</h1>
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
      {msg && <div className="p-3 rounded-lg mb-4 text-sm bg-green-50 text-green-800"><i className="fa-solid fa-check-circle mr-2"></i>{msg}</div>}
      <div className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-bold"><i className="fa-solid fa-user mr-2"></i>Basic Info</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="form-label">Author Name</label><input className="form-input" value={data.name || ''} onChange={e => setData({ ...data, name: e.target.value })} /></div>
            <div><label className="form-label">Profile Photo</label><input type="file" accept="image/*" onChange={handlePhoto} className="form-input" />{data.photo && <img src={data.photo} alt="" className="mt-2 w-24 h-24 rounded-full object-cover" />}</div>
          </div>
          <div><label className="form-label">Bio</label><RichEditor value={data.bio || ''} onChange={v => setData({ ...data, bio: v })} /></div>
          <div><label className="form-label">Achievements / Awards</label><RichEditor value={data.achievements || ''} onChange={v => setData({ ...data, achievements: v })} minHeight="150px" /></div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold"><i className="fa-solid fa-share-nodes mr-2"></i>Social Links</h2>
          <p className="form-hint">Leave blank to hide a social link.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><label className="form-label"><i className="fa-brands fa-facebook mr-1"></i>Facebook URL</label><input className="form-input" value={data.facebookUrl || ''} onChange={e => setData({ ...data, facebookUrl: e.target.value })} /></div>
            <div><label className="form-label"><i className="fa-brands fa-instagram mr-1"></i>Instagram URL</label><input className="form-input" value={data.instagramUrl || ''} onChange={e => setData({ ...data, instagramUrl: e.target.value })} /></div>
            <div><label className="form-label"><i className="fa-brands fa-x-twitter mr-1"></i>X (Twitter) URL</label><input className="form-input" value={data.xUrl || ''} onChange={e => setData({ ...data, xUrl: e.target.value })} /></div>
            <div><label className="form-label"><i className="fa-brands fa-linkedin mr-1"></i>LinkedIn URL</label><input className="form-input" value={data.linkedinUrl || ''} onChange={e => setData({ ...data, linkedinUrl: e.target.value })} /></div>
            <div><label className="form-label"><i className="fa-brands fa-youtube mr-1"></i>YouTube URL</label><input className="form-input" value={data.youtubeUrl || ''} onChange={e => setData({ ...data, youtubeUrl: e.target.value })} /></div>
            <div><label className="form-label"><i className="fa-solid fa-globe mr-1"></i>Website URL</label><input className="form-input" value={data.websiteUrl || ''} onChange={e => setData({ ...data, websiteUrl: e.target.value })} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
