'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BookCard from '@/components/public/BookCard';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public?type=home').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;

  const { settings, featuredBooks, latestBooks, latestChapters, categories, author, toggles } = data || {};
  const latestSection = settings?.homepage_latest || 'books';

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero-section">
        <div className="page-container">
          <h1 className="hero-title">{settings?.site_name || 'AuthorShelf'}</h1>
          <p className="text-lg mt-3" style={{ color: 'var(--text-muted)' }}>{settings?.tagline || 'Read free books online'}</p>
          {toggles?.books !== false && (
            <Link href="/books" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-white font-semibold" style={{ background: 'var(--color-primary)' }}>
              <i className="fa-solid fa-book-open"></i> Browse Books
            </Link>
          )}
        </div>
      </div>

      <div className="page-container">
        {/* Featured Books */}
        {featuredBooks?.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading"><i className="fa-solid fa-star"></i>Featured Books</h2>
            <div className="books-grid">
              {featuredBooks.map((b: any) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {/* Latest Books or Chapters */}
        {latestSection === 'chapters' && latestChapters?.length > 0 ? (
          <section className="mb-12">
            <h2 className="section-heading"><i className="fa-solid fa-clock"></i>Latest Chapters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestChapters.map((c: any) => (
                <Link key={c.id} href={`/book/${c.bookSlug}/${c.slug}`} className="book-card p-4 flex gap-3">
                  {c.chapterImage && <img src={c.chapterImage} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                  <div>
                    <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{c.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.bookTitle}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-primary)' }}><i className="fa-solid fa-book-open mr-1"></i>Read</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : latestBooks?.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading"><i className="fa-solid fa-clock"></i>Latest Books</h2>
            <div className="books-grid">
              {latestBooks.map((b: any) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {/* Categories */}
        {toggles?.categories !== false && categories?.length > 0 && (
          <section className="mb-12">
            <h2 className="section-heading"><i className="fa-solid fa-folder"></i>Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((c: any) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="category-pill text-sm px-4 py-2">{c.name}</Link>
              ))}
            </div>
          </section>
        )}

        {/* Author Bio Preview */}
        {toggles?.author !== false && author && (
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
              {author.photo && <img src={author.photo} alt={author.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0" style={{ border: '3px solid var(--color-primary)' }} />}
              <div>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{author.name}</h3>
                <div className="text-sm mt-1 line-clamp-3" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: (author.bio || '').substring(0, 300) + '...' }} />
                <Link href="/author" className="inline-block mt-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-arrow-right mr-1"></i>Read More
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
