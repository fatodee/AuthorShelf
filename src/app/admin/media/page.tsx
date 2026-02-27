'use client';
import { useState, useEffect } from 'react';

export default function AdminMedia() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => { setLoading(true); const r = await fetch('/api/admin/media'); setItems(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      await fetch('/api/upload', { method: 'POST', body: fd });
    }
    setUploading(false);
    load();
    e.target.value = '';
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this file?')) return;
    await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const copyPath = (path: string) => { navigator.clipboard.writeText(path); alert('Image path copied!'); };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-images mr-3" style={{ color: 'var(--color-primary)' }}></i>Media Library</h1>
        <label className={`btn btn-primary cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
          <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'} mr-2`}></i>{uploading ? 'Uploading...' : 'Upload Files'}
          <input type="file" accept="image/*" multiple onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}><i className="fa-solid fa-info-circle mr-1"></i> Click "Copy" to copy the image path, then paste it into any image URL field or use "Insert Image" in the editor.</p>
      {loading ? <div className="text-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div> : items.length === 0 ? (
        <div className="card text-center py-12"><i className="fa-solid fa-images text-4xl mb-3" style={{ color: 'var(--text-muted)' }}></i><p style={{ color: 'var(--text-muted)' }}>No media uploaded yet.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(m => (
            <div key={m.id} className="card p-2 group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img src={m.path} alt={m.alt || m.filename} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs truncate font-medium">{m.filename}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.size ? `${(m.size / 1024).toFixed(1)}KB` : ''}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => copyPath(m.path)} className="btn btn-sm btn-secondary flex-1"><i className="fa-solid fa-copy"></i> Copy</button>
                <button onClick={() => remove(m.id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
