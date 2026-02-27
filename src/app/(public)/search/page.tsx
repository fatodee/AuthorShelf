'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
function stripHtml(html: string) { return html?.replace(/<[^>]*>/g, '').trim() || ''; }
function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);
  useEffect(() => { if (q) doSearch(q); }, [q]);
  const doSearch = (term: string) => {
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(term)}`).then(r => r.json()).then(d => { setResults(d); setLoading(false); });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { window.history.pushState({}, '', `/search?q=${encodeURIComponent(query.trim())}`); doSearch(query.trim()); }
  };
  return (
    <div className="page-container fade-in">
      <h1 className="section-title text-3xl mb-6"><i className="fa-solid fa-magnifying-glass"></i>Search</h1>
      <form onSubmit={handleSubmit} className="relative mb-8" style={{ maxWidth: 600 }}>
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}></i>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search books, chapters, blog posts..."
          className="search-input" style={{ paddingLeft: '2.75rem' }} autoFocus />
      </form>
      {loading && <div className="page-loader" style={{ minHeight: '20vh' }}><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>}
      {results && !loading && (
        <div className="space-y-8">
          {results.books?.length > 0 && (
            <section>
              <h2 className="font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Books ({results.books.length})</h2>
              <div className="space-y-2">
                {results.books.map((b: any) => (
                  <Link key={b.id} href={`/book/${b.slug}`} className="blog-card flex items-center gap-4">
                    {b.coverImage ? <img src={b.coverImage} alt="" className="w-12 h-16 rounded object-cover flex-shrink-0" /> : <div className="w-12 h-16 rounded flex items-center justify-center" style={{ background: 'var(--color-primary-glow)' }}><i className="fa-solid fa-book" style={{ color: 'var(--color-primary)' }}></i></div>}
                    <div><h3 className="card-title text-sm">{b.title}</h3><p className="card-meta line-clamp-2">{stripHtml(b.description || '')}</p></div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.chapters?.length > 0 && (
            <section>
              <h2 className="font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Chapters ({results.chapters.length})</h2>
              <div className="space-y-2">
                {results.chapters.map((c: any) => (
                  <Link key={c.id} href={`/book/${c.bookSlug}/${c.slug}`} className="blog-card">
                    <h3 className="card-title text-sm">{c.title}</h3>
                    <p className="card-meta">{c.bookTitle}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.posts?.length > 0 && (
            <section>
              <h2 className="font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Blog Posts ({results.posts.length})</h2>
              <div className="space-y-2">
                {results.posts.map((p: any) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
                    <h3 className="card-title text-sm">{p.title}</h3>
                    <p className="card-meta line-clamp-2">{stripHtml(p.content || '')}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {!results.books?.length && !results.chapters?.length && !results.posts?.length && (
            <div className="empty-state"><i className="fa-solid fa-magnifying-glass"></i><p>No results found for &ldquo;{q}&rdquo;</p></div>
          )}
        </div>
      )}
    </div>
  );
}
export default function SearchPage() {
  return <Suspense fallback={<div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>}><SearchContent /></Suspense>;
}
