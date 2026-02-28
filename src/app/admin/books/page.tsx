'use client';
import { useState, useEffect } from 'react';
import RichEditor from '@/components/admin/RichEditor';
export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const emptyBook = { title: '', slug: '', description: '', authorNote: '', categoryId: '', coverImage: '', featured: false, bookType: 'series', status: 'draft', metaTitle: '', metaDescription: '' };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const load = async () => {
    setLoading(true);
    const [bRes, cRes] = await Promise.all([fetch('/api/admin/books'), fetch('/api/admin/categories')]);
    setBooks(await bRes.json());
    setCategories(await cRes.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');
  const save = async (asDraft = false) => {
    setSaving(true);
    const method = editing?.id ? 'PUT' : 'POST';
    const data = { ...editing };
    if (asDraft) data.status = 'draft';
    if (!data.slug) data.slug = generateSlug(data.title);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);
    try {
      const res = await fetch('/api/admin/books', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (result.error) { showToast('Error: ' + result.error); setSaving(false); return; }
      // Stay in form, update editing with saved data (including new id for new books)
      if (!editing?.id && result.id) setEditing({ ...data, id: result.id });
      else setEditing({ ...data });
      showToast('Book saved successfully!');
      // Reload list in background
      const bRes = await fetch('/api/admin/books');
      setBooks(await bRes.json());
    } catch (e: any) { showToast('Save failed: ' + e.message); }
    setSaving(false);
  };
  const toggleStatus = async (book: any) => {
    const newStatus = book.status === 'published' ? 'draft' : 'published';
    await fetch('/api/admin/books', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: book.id, status: newStatus }) });
    load();
  };
  const remove = async (id: number) => {
    if (!confirm('Delete this book and ALL its chapters?')) return;
    await fetch('/api/admin/books', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.media?.path) { setEditing((prev: any) => ({ ...prev, coverImage: data.media.path })); showToast('Image uploaded!'); }
      else showToast('Upload failed');
    } catch { showToast('Upload error'); }
  };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (showForm) {
    return (
      <div className="fade-in">
        {toast && <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, padding: '.75rem 1.25rem', borderRadius: 'var(--radius-sm)', background: toast.startsWith('Error') || toast.startsWith('Save failed') ? '#dc2626' : 'var(--color-primary)', color: '#fff', fontSize: '.875rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold"><i className="fa-solid fa-book mr-3" style={{ color: 'var(--color-primary)' }}></i>{editing?.id ? 'Edit Book' : 'New Book'}</h1>
          <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary"><i className="fa-solid fa-arrow-left mr-2"></i>Back</button>
        </div>
        <div className="card space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div><label className="form-label">Title *</label><input className="form-input" value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing?.id ? editing.slug : generateSlug(e.target.value) })} /></div>
            <div><label className="form-label">Slug</label><input className="form-input" value={editing?.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} /><p className="form-hint">Auto-generated from title. Edit if needed.</p></div>
            <div><label className="form-label">Category</label><select className="form-input" value={editing?.categoryId || ''} onChange={e => setEditing({ ...editing, categoryId: e.target.value })}><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="form-label">Book Type</label><select className="form-input" value={editing?.bookType || 'series'} onChange={e => setEditing({ ...editing, bookType: e.target.value })}><option value="series">Series (multiple chapters)</option><option value="single">Single Story (one piece)</option></select><p className="form-hint">Series = add chapters later. Single = the description IS the story.</p></div>
            <div><label className="form-label">Status</label><select className="form-input" value={editing?.status || 'draft'} onChange={e => setEditing({ ...editing, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div className="flex items-center gap-3 pt-7"><button type="button" className={`toggle ${editing?.featured ? 'active' : ''}`} onClick={() => setEditing({ ...editing, featured: !editing?.featured })} /><label className="text-sm font-medium">Featured Book</label><span className="form-hint">(Shows in featured section on homepage)</span></div>
          </div>
          <div><label className="form-label">Cover Image</label><div className="flex items-start gap-4">{editing?.coverImage && <img src={editing.coverImage} alt="Cover" className="w-32 h-44 object-cover rounded-lg border" />}<div><input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" /><p className="form-hint">Or paste a URL:</p><input className="form-input mt-1" value={editing?.coverImage || ''} onChange={e => setEditing({ ...editing, coverImage: e.target.value })} placeholder="https://..." /></div></div></div>
          <div><label className="form-label">Description</label><RichEditor value={editing?.description || ''} onChange={v => setEditing({ ...editing, description: v })} /></div>
          <div><label className="form-label">Author Note (optional)</label><RichEditor value={editing?.authorNote || ''} onChange={v => setEditing({ ...editing, authorNote: v })} minHeight="120px" /><p className="form-hint">A personal note about this book, shown on the book detail page.</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><div><label className="form-label">SEO Title</label><input className="form-input" value={editing?.metaTitle || ''} onChange={e => setEditing({ ...editing, metaTitle: e.target.value })} /></div><div><label className="form-label">SEO Description</label><input className="form-input" value={editing?.metaDescription || ''} onChange={e => setEditing({ ...editing, metaDescription: e.target.value })} /></div></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => save()} disabled={saving} className="btn btn-primary">{saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-check mr-2"></i>Save Book</>}</button>
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
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-book mr-3" style={{ color: 'var(--color-primary)' }}></i>Books</h1>
        <button onClick={() => { setEditing({ ...emptyBook }); setShowForm(true); }} className="btn btn-primary"><i className="fa-solid fa-plus mr-2"></i>New Book</button>
      </div>
      {books.length === 0 ? (
        <div className="card text-center py-12"><i className="fa-solid fa-book-open text-4xl mb-3" style={{ color: 'var(--text-muted)' }}></i><p style={{ color: 'var(--text-muted)' }}>No books yet. Create your first book!</p></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td>{b.coverImage ? <img src={b.coverImage} alt="" className="w-10 h-14 object-cover rounded" /> : <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center"><i className="fa-solid fa-image text-gray-400"></i></div>}</td>
                  <td className="font-medium">{b.title}</td>
                  <td><span className="badge badge-blue">{b.categoryName}</span></td>
                  <td className="text-sm">{b.bookType === 'single' ? 'Single Story' : 'Series'}</td>
                  <td><button onClick={() => toggleStatus(b)} className={`badge ${b.status === 'published' ? 'badge-green' : 'badge-yellow'}`} style={{ cursor: 'pointer', border: 'none' }} title="Click to toggle">{b.status}</button></td>
                  <td>{b.featured ? <i className="fa-solid fa-star text-yellow-500"></i> : <i className="fa-regular fa-star text-gray-300"></i>}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(b); setShowForm(true); }} className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button>
                      <a href={`/admin/chapters?bookId=${b.id}`} className="btn btn-sm btn-secondary"><i className="fa-solid fa-list"></i></a>
                      <button onClick={() => remove(b.id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
