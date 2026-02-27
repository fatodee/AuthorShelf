'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/components/public/BookCard';

function stripHtml(html: string) { return html?.replace(/<[^>]*>/g, '').trim() || ''; }

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const search = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
      .then(r => r.json())
      .then(d => { setResults(d); setLoading(false); });
  };

  useEffect(() => { if (q) search(q); }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
    window.history.replaceState(null, '', `/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative mb-8 max-w-2xl">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}></i>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search books, chapters, blog posts..." className="search-input" autoFocus />
      </form>

      {loading && <div className="page-loader" style={{ minHeight: '30vh' }}><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>}

      {results && !loading && (
        <div className="space-y-8">
          {results.books?.length > 0 && (
            <section>
              <h2 className="font-bold mb-4"><i className="fa-solid fa-book mr-2" style={{ color: 'var(--color-primary)' }}></i>Books ({results.books.length})</h2>
              <div className="books-grid">{results.books.map((b: any) => <BookCard key={b.id} book={b} />)}</div>
            </section>
          )}
          {results.chapters?.length > 0 && (
            <section>
              <h2 className="font-bold mb-4"><i className="fa-solid fa-file-lines mr-2" style={{ color: 'var(--color-primary)' }}></i>Chapters ({results.chapters.length})</h2>
              <div className="space-y-2">
                {results.chapters.map((c: any) => (
                  <Link key={c.id} href={`/book/${c.bookSlug || 'unknown'}/${c.slug}`}>
                    <div className="chapter-item">
                      <div className="chapter-number"><i className="fa-solid fa-file-lines text-sm"></i></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.bookTitle || ''}</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-sm" style={{ color: 'var(--text-muted)' }}></i>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.posts?.length > 0 && (
            <section>
              <h2 className="font-bold mb-4"><i className="fa-solid fa-pen-nib mr-2" style={{ color: 'var(--color-primary)' }}></i>Blog Posts ({results.posts.length})</h2>
              <div className="space-y-2">
                {results.posts.map((p: any) => (
                  <Link key={p.id} href={`/blog/${p.slug}`}>
                    <div className="chapter-item">
                      <div className="chapter-number"><i className="fa-solid fa-pen-nib text-sm"></i></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stripHtml(p.excerpt || p.content || '').substring(0, 80)}</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-sm" style={{ color: 'var(--text-muted)' }}></i>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {!results.books?.length && !results.chapters?.length && !results.posts?.length && (
            <div className="empty-state"><i className="fa-solid fa-magnifying-glass"></i><p>No results found for &quot;{q}&quot;</p></div>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="page-container fade-in">
      <h1 className="section-heading text-3xl mb-6"><i className="fa-solid fa-magnifying-glass"></i>Search</h1>
      <Suspense fallback={<div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
