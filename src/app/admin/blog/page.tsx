'use client';
import { useState, useEffect } from 'react';
import RichEditor from '@/components/admin/RichEditor';
export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const load = async () => { setLoading(true); const r = await fetch('/api/admin/blog'); setPosts(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const genSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');
  const save = async (asDraft = false) => {
    setSaving(true);
    const method = editing?.id ? 'PUT' : 'POST';
    const data = { ...editing };
    if (asDraft) data.status = 'draft';
    if (!data.slug) data.slug = genSlug(data.title);
    try {
      const res = await fetch('/api/admin/blog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (result.error) { showToast('Error: ' + result.error); setSaving(false); return; }
      if (!editing?.id && result.id) setEditing({ ...data, id: result.id });
      showToast('Post saved!');
      const r = await fetch('/api/admin/blog'); setPosts(await r.json());
    } catch (e: any) { showToast('Save failed'); }
    setSaving(false);
  };
  const toggleStatus = async (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: post.id, status: newStatus }) });
    load();
  };
  const remove = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (showForm) {
    return (
      <div className="fade-in">
        {toast && <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, padding: '.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: toast.startsWith('Error') ? '#dc2626' : 'var(--color-primary)', color: '#fff', fontSize: '.875rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold"><i className="fa-solid fa-pen-nib mr-3" style={{ color: 'var(--color-primary)' }}></i>{editing?.id ? 'Edit Post' : 'New Post'}</h1>
          <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary"><i className="fa-solid fa-arrow-left mr-2"></i>Back</button>
        </div>
        <div className="card space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div><label className="form-label">Title *</label><input className="form-input" value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing?.id ? editing.slug : genSlug(e.target.value) })} /></div>
            <div><label className="form-label">Slug</label><input className="form-input" value={editing?.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div><label className="form-label">Status</label><select className="form-input" value={editing?.status || 'draft'} onChange={e => setEditing({ ...editing, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div><label className="form-label">Tags (comma separated)</label><input className="form-input" value={editing?.tags || ''} onChange={e => setEditing({ ...editing, tags: e.target.value })} placeholder="writing, tips, craft" /></div>
          </div>
          <div><label className="form-label">Featured Image URL</label><input className="form-input" value={editing?.featuredImage || ''} onChange={e => setEditing({ ...editing, featuredImage: e.target.value })} /></div>
          <div><label className="form-label">Excerpt</label><textarea className="form-input" rows={3} value={editing?.excerpt || ''} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} /></div>
          <div><label className="form-label">Content</label><RichEditor value={editing?.content || ''} onChange={v => setEditing({ ...editing, content: v })} minHeight="400px" /></div>
          <div className="flex gap-3">
            <button onClick={() => save()} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Post'}</button>
            <button onClick={() => save(true)} disabled={saving} className="btn btn-secondary"><i className="fa-solid fa-file-pen mr-2"></i>Save as Draft</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-pen-nib mr-3" style={{ color: 'var(--color-primary)' }}></i>Blog Posts</h1>
        <button onClick={() => { setEditing({ title: '', slug: '', excerpt: '', content: '', status: 'draft', tags: '' }); setShowForm(true); }} className="btn btn-primary"><i className="fa-solid fa-plus mr-2"></i>New Post</button>
      </div>
      {posts.length === 0 ? (
        <div className="card text-center py-12"><i className="fa-solid fa-pen-nib text-4xl mb-3" style={{ color: 'var(--text-muted)' }}></i><p style={{ color: 'var(--text-muted)' }}>No blog posts yet.</p></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Status</th><th>Tags</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td className="font-medium">{p.title}</td>
                  <td><button onClick={() => toggleStatus(p)} className={`badge ${p.status === 'published' ? 'badge-green' : 'badge-yellow'}`} style={{ cursor: 'pointer', border: 'none' }} title="Click to toggle">{p.status}</button></td>
                  <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.tags}</td>
                  <td><div className="flex gap-2"><button onClick={() => { setEditing(p); setShowForm(true); }} className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button><button onClick={() => remove(p.id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
