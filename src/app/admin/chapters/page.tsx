'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RichEditor from '@/components/admin/RichEditor';

function ChaptersContent() {
  const searchParams = useSearchParams();
  const preselectedBookId = searchParams.get('bookId') || '';
  const [chapters, setChapters] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(preselectedBookId);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const bRes = await fetch('/api/admin/books');
    const booksData = await bRes.json();
    setBooks(booksData);
    if (selectedBookId) {
      const cRes = await fetch(`/api/admin/chapters?bookId=${selectedBookId}`);
      setChapters(await cRes.json());
    } else {
      setChapters([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedBookId]);

  const genSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');

  const save = async () => {
    setSaving(true);
    const method = editing?.id ? 'PUT' : 'POST';
    const data = { ...editing };
    if (!data.slug) data.slug = genSlug(data.title);
    data.bookId = parseInt(data.bookId || selectedBookId);
    data.chapterOrder = parseInt(data.chapterOrder || chapters.length + 1);
    await fetch('/api/admin/chapters', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this chapter?')) return;
    await fetch('/api/admin/chapters', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.media?.path) setEditing({ ...editing, chapterImage: data.media.path });
  };

  const bookName = books.find(b => b.id === parseInt(selectedBookId))?.title || '';

  if (showForm) {
    return (
      <div className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold"><i className="fa-solid fa-file-lines mr-3" style={{ color: 'var(--color-primary)' }}></i>{editing?.id ? 'Edit Chapter' : 'New Chapter'}</h1>
          <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary"><i className="fa-solid fa-arrow-left mr-2"></i>Back</button>
        </div>
        <div className="card space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Title *</label>
              <input className="form-input" value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing?.id ? editing.slug : genSlug(e.target.value) })} />
            </div>
            <div>
              <label className="form-label">Slug</label>
              <input className="form-input" value={editing?.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Chapter Order</label>
              <input type="number" className="form-input" value={editing?.chapterOrder || chapters.length + 1} onChange={e => setEditing({ ...editing, chapterOrder: e.target.value })} />
              <p className="form-hint">Lower numbers appear first.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Book</label>
              <select className="form-input" value={editing?.bookId || selectedBookId} onChange={e => setEditing({ ...editing, bookId: e.target.value })}>
                <option value="">Select book</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" value={editing?.status || 'draft'} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Chapter Image (optional, shown at top of chapter)</label>
            <div className="flex items-start gap-4">
              {editing?.chapterImage && <img src={editing.chapterImage} alt="" className="w-40 h-24 object-cover rounded-lg border" />}
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                <input className="form-input mt-2" value={editing?.chapterImage || ''} onChange={e => setEditing({ ...editing, chapterImage: e.target.value })} placeholder="Or paste image URL" />
              </div>
            </div>
          </div>
          <div>
            <label className="form-label">Content</label>
            <p className="form-hint mb-2">Write your chapter content here. Use the toolbar to format text and insert images inside the text.</p>
            <RichEditor value={editing?.content || ''} onChange={v => setEditing({ ...editing, content: v })} minHeight="500px" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving} className="btn btn-primary">
              {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-check mr-2"></i>Save Chapter</>}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-file-lines mr-3" style={{ color: 'var(--color-primary)' }}></i>Chapters</h1>
        <button onClick={() => { setEditing({ title: '', slug: '', content: '', chapterOrder: chapters.length + 1, bookId: selectedBookId, status: 'draft' }); setShowForm(true); }} className="btn btn-primary" disabled={!selectedBookId}><i className="fa-solid fa-plus mr-2"></i>New Chapter</button>
      </div>
      <div className="card mb-4">
        <label className="form-label"><i className="fa-solid fa-book mr-2"></i>Select Book</label>
        <select className="form-input max-w-md" value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)}>
          <option value="">Choose a book to manage chapters...</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
      </div>
      {selectedBookId && !loading && (
        chapters.length === 0 ? (
          <div className="card text-center py-12">
            <i className="fa-solid fa-file-pen text-4xl mb-3" style={{ color: 'var(--text-muted)' }}></i>
            <p style={{ color: 'var(--text-muted)' }}>No chapters for &quot;{bookName}&quot;. Add your first chapter!</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>#</th><th>Title</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {chapters.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-sm">{c.chapterOrder}</td>
                    <td className="font-medium">{c.title}</td>
                    <td><span className={`badge ${c.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{c.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(c); setShowForm(true); }} className="btn btn-sm btn-secondary"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => remove(c.id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default function AdminChapters() {
  return <Suspense fallback={<div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>}><ChaptersContent /></Suspense>;
}
