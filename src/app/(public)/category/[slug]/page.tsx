'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/components/public/BookCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(`/api/public?type=category&slug=${slug}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }); }, [slug]);

  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!data?.category) return <div className="page-container empty-state"><i className="fa-solid fa-folder"></i><p>Category not found.</p></div>;

  return (
    <div className="page-container fade-in">
      <Link href="/categories" className="text-sm mb-4 inline-block" style={{ color: 'var(--color-primary)' }}><i className="fa-solid fa-arrow-left mr-1"></i>All Categories</Link>
      <h1 className="section-heading text-3xl mb-2"><i className="fa-solid fa-folder"></i>{data.category.name}</h1>
      {data.category.description && <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{data.category.description}</p>}
      {data.books?.length > 0 ? (
        <div className="books-grid">{data.books.map((b: any) => <BookCard key={b.id} book={b} />)}</div>
      ) : (
        <div className="empty-state"><i className="fa-solid fa-book-open"></i><p>No books in this category yet.</p></div>
      )}
    </div>
  );
}
