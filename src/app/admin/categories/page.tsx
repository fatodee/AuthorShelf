'use client';
import { useState, useEffect } from 'react';

export default function AdminCategories() {
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); const r = await fetch('/api/admin/categories'); setCats(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const genSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');

  const save = async () => {
    setSaving(true);
    const method = editing?.id ? 'PUT' : 'POST';
    const data = { ...editing };
    if (!data.slug) data.slug = genSlug(data.name);
    await fetch('/api/admin/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setEditing(null); load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-folder mr-3" style={{ color: 'var(--color-primary)' }}></i>Categories</h1>
        <button onClick={() => setEditing({ name: '', slug: '', description: '', sortOrder: cats.length })} className="btn btn-primary"><i className="fa-solid fa-plus mr-2"></i>New Category</button>
      </div>
      {editing && (
        <div className="card mb-6 space-y-4">
          <h2 className="font-bold">{editing.id ? 'Edit' : 'New'} Category</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div><label className="form-label">Name *</label><input className="form-input" value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : genSlug(e.target.value) })} /></div>
            <div><label className="form-label">Slug</label><input className="form-input" value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div><label className="form-label">Sort Order</label><input type="number" className="form-input" value={editing.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) })} /></div>
          </div>
          <div><label className="form-label">Description</label><textarea className="form-input" rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td>{c.sortOrder}</td><td className="font-medium">{c.name}</td><td className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.slug}</td>
                <td><div className="flex gap-2"><button onClick={() => setEditing(c)} className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button><button onClick={() => remove(c.id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
