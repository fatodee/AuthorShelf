'use client';
import { useEffect, useState } from 'react';
import BookCard from '@/components/public/BookCard';
export default function BooksPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('');
  const load = (cat?: string) => {
    setLoading(true);
    const url = cat ? `/api/public?type=books&category=${cat}` : '/api/public?type=books';
    fetch(url).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);
  const handleFilter = (catId: string) => { setCatFilter(catId); load(catId || undefined); };
  return (
    <div className="page-container fade-in">
      <h1 className="section-title text-3xl mb-2"><i className="fa-solid fa-book"></i>Books</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Browse our collection of free books to read online.</p>
      {data?.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => handleFilter('')} className={`pill ${!catFilter ? '' : 'pill-outline'}`} style={!catFilter ? { background: 'var(--color-primary)', color: '#fff' } : {}}>All</button>
          {data.categories.map((c: any) => (
            <button key={c.id} onClick={() => handleFilter(c.id.toString())} className={`pill ${catFilter === c.id.toString() ? '' : 'pill-outline'}`} style={catFilter === c.id.toString() ? { background: 'var(--color-primary)', color: '#fff' } : {}}>{c.name}</button>
          ))}
        </div>
      )}
      {loading ? (
        <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>
      ) : data?.books?.length > 0 ? (
        <div className="book-grid">{data.books.map((b: any) => <BookCard key={b.id} book={b} />)}</div>
      ) : (
        <div className="empty-state"><i className="fa-solid fa-book-open"></i><p>No books found.</p></div>
      )}
    </div>
  );
}
