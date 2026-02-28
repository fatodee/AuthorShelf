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
  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero">
        <h1>{settings?.site_name || 'AuthorShelf'}</h1>
        <p>{settings?.tagline || settings?.site_tagline || 'Stories worth reading'}</p>
        {toggles?.books !== false && (
          <Link href="/books" className="hero-cta">
            Browse Books <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8em' }}></i>
          </Link>
        )}
      </div>
      <div className="page-container">
        {/* Featured Books */}
        {featuredBooks?.length > 0 && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="section-title"><i className="fa-solid fa-star"></i>Featured</h2>
              {toggles?.books !== false && <Link href="/books" className="section-link">View all <i className="fa-solid fa-arrow-right"></i></Link>}
            </div>
            <div className="book-grid">
              {featuredBooks.map((b: any) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}
        {/* Latest Books */}
        {latestBooks?.length > 0 && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="section-title"><i className="fa-solid fa-clock"></i>Latest</h2>
            </div>
            <div className="book-grid">
              {latestBooks.map((b: any) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}
        {/* Latest Chapters */}
        {latestChapters?.length > 0 && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="section-title"><i className="fa-solid fa-file-lines"></i>Recent Chapters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestChapters.map((c: any) => (
                <Link key={c.id} href={`/book/${c.bookSlug}/${c.slug}`} className="blog-card flex gap-4">
                  {c.chapterImage && <img src={c.chapterImage} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                  <div>
                    <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{c.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.bookTitle}</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--color-primary)' }}>Read <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.625rem' }}></i></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        {/* Categories */}
        {toggles?.categories !== false && categories?.length > 0 && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="section-title"><i className="fa-solid fa-folder"></i>Categories</h2>
              <Link href="/categories" className="section-link">View all <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((c: any) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="pill-outline">{c.name}</Link>
              ))}
            </div>
          </section>
        )}
        {/* Author */}
        {toggles?.author !== false && author && (
          <section className="mb-12">
            <div className="blog-card flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {author.photo && <img src={author.photo} alt={author.name} className="author-photo flex-shrink-0" />}
              <div>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{author.name}</h3>
                <div className="text-sm mt-2 line-clamp-3" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: (author.bio || '').substring(0, 300) + '...' }} />
                <Link href="/author" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Read More <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.625rem' }}></i>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
