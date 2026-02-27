'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SupportSection from '@/components/public/SupportSection';
export default function BookDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/public?type=book&slug=${slug}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
    fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageType: 'book', pageSlug: slug }) });
  }, [slug]);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!data?.book) return <div className="page-container empty-state"><i className="fa-solid fa-book"></i><p>Book not found.</p><Link href="/books" className="mt-4 inline-block font-semibold" style={{ color: 'var(--color-primary)' }}>Back to Books</Link></div>;
  const { book, chapters, settings } = data;
  return (
    <div className="page-container fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex-shrink-0">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full rounded-xl" style={{ maxWidth: 350, boxShadow: 'var(--shadow-lg)' }} />
          ) : (
            <div className="card-cover-empty rounded-xl" style={{ maxWidth: 350, height: 500 }}><i className="fa-solid fa-book-open"></i></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {book.categoryName && <Link href={`/category/${book.categorySlug}`} className="pill">{book.categoryName}</Link>}
            {book.bookType === 'single' && <span className="pill pill-outline">Short Story</span>}
            {book.bookType === 'series' && <span className="pill pill-outline">Series</span>}
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{book.title}</h1>
          {book.description && <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: book.description }} />}
          {book.authorNote && (
            <div className="blog-card mb-6">
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-primary)' }}>Author&apos;s Note</h3>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: book.authorNote }} />
            </div>
          )}
          {book.galleryImages?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3">Gallery</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {book.galleryImages.map((img: string, i: number) => <img key={i} src={img} alt="" className="h-32 rounded-lg object-cover flex-shrink-0" />)}
              </div>
            </div>
          )}
          {book.bookType === 'single' ? (
            chapters.length > 0 && (
              <Link href={`/book/${book.slug}/${chapters[0].slug}`} className="hero-cta" style={{ display: 'inline-flex' }}>
                Read Story <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8em' }}></i>
              </Link>
            )
          ) : chapters.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Chapters ({chapters.length})</h3>
              <div className="space-y-2">
                {chapters.map((ch: any, idx: number) => (
                  <Link key={ch.id} href={`/book/${book.slug}/${ch.slug}`}>
                    <div className="blog-card flex items-center gap-4 py-3 px-4">
                      <span className="text-sm font-bold" style={{ color: 'var(--color-primary)', minWidth: 24 }}>{idx + 1}</span>
                      <span className="font-medium text-sm flex-1">{ch.title}</span>
                      <i className="fa-solid fa-chevron-right text-xs" style={{ color: 'var(--text-faint)' }}></i>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href={`/book/${book.slug}/${chapters[0].slug}`} className="hero-cta mt-4" style={{ display: 'inline-flex' }}>
                Start Reading <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8em' }}></i>
              </Link>
            </div>
          )}
        </div>
      </div>
      {settings && <div className="mt-12"><SupportSection settings={settings} /></div>}
    </div>
  );
}
