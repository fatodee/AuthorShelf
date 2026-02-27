'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/public?type=categories').then(r => r.json()).then(d => { setData(d); setLoading(false); }); }, []);

  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="section-heading text-3xl mb-6"><i className="fa-solid fa-folder"></i>Categories</h1>
      {data?.categories?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categories.map((c: any) => (
            <Link key={c.id} href={`/category/${c.slug}`}>
              <div className="book-card p-6 flex items-center gap-4">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'var(--bg-alt)' }}>
                    <i className="fa-solid fa-folder" style={{ color: 'var(--color-primary)' }}></i>
                  </div>
                )}
                <div>
                  <h3 className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{c.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.bookCount} {c.bookCount === 1 ? 'book' : 'books'}</p>
                  {c.description && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.description}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state"><i className="fa-solid fa-folder-open"></i><p>No categories yet.</p></div>
      )}
    </div>
  );
}
