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
  if (!data?.book) return <div className="page-container empty-state"><i className="fa-solid fa-book"></i><p>Book not found.</p><Link href="/books" className="mt-4 inline-block" style={{ color: 'var(--color-primary)' }}>Back to Books</Link></div>;

  const { book, chapters, settings } = data;

  return (
    <div className="page-container fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cover */}
        <div className="lg:w-1/3 flex-shrink-0">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full rounded-xl shadow-lg" style={{ maxWidth: '350px' }} />
          ) : (
            <div className="book-cover-placeholder rounded-xl" style={{ maxWidth: '350px', height: '500px' }}><i className="fa-solid fa-book"></i></div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {book.categoryName && (
              <Link href={`/category/${book.categorySlug}`} className="category-pill">{book.categoryName}</Link>
            )}
            {book.bookType === 'single' && <span className="tag"><i className="fa-solid fa-file-lines mr-1"></i>Short Story</span>}
            {book.bookType === 'series' && <span className="tag"><i className="fa-solid fa-layer-group mr-1"></i>Series</span>}
          </div>

          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{book.title}</h1>

          {book.description && (
            <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: book.description }} />
          )}

          {book.authorNote && (
            <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold text-sm mb-2"><i className="fa-solid fa-pen-nib mr-2" style={{ color: 'var(--color-primary)' }}></i>Author&apos;s Note</h3>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: book.authorNote }} />
            </div>
          )}

          {/* Gallery */}
          {book.galleryImages?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3"><i className="fa-solid fa-images mr-2" style={{ color: 'var(--color-primary)' }}></i>Gallery</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {book.galleryImages.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className="h-32 rounded-lg object-cover flex-shrink-0" />
                ))}
              </div>
            </div>
          )}

          {/* Read button for single books */}
          {book.bookType === 'single' ? (
            chapters.length > 0 ? (
              <Link href={`/book/${book.slug}/${chapters[0].slug}`} className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-lg" style={{ background: 'var(--color-primary)' }}>
                <i className="fa-solid fa-book-open"></i> Read Story
              </Link>
            ) : null
          ) : (
            <>
              {/* Chapter List */}
              {chapters.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    <i className="fa-solid fa-list-ol mr-2" style={{ color: 'var(--color-primary)' }}></i>
                    Chapters ({chapters.length})
                  </h3>
                  <div className="space-y-2">
                    {chapters.map((ch: any, idx: number) => (
                      <Link key={ch.id} href={`/book/${book.slug}/${ch.slug}`}>
                        <div className="chapter-item">
                          <div className="chapter-number">{idx + 1}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{ch.title}</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-sm" style={{ color: 'var(--text-muted)' }}></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/book/${book.slug}/${chapters[0].slug}`} className="inline-flex items-center gap-2 mt-4 px-8 py-3 rounded-full text-white font-semibold" style={{ background: 'var(--color-primary)' }}>
                    <i className="fa-solid fa-book-open"></i> Start Reading
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Support */}
      {settings && (
        <div className="mt-12">
          <SupportSection settings={settings} />
        </div>
      )}
    </div>
  );
}
