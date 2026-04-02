'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
function stripHtml(html: string) { return html?.replace(/<[^>]*>/g, '').trim() || ''; }
function formatDate(d: string | null) { if (!d) return ''; return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/public?type=blog').then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); }); }, []);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="page-container fade-in">
      <h1 className="section-title text-3xl mb-8"><i className="fa-solid fa-pen-nib"></i>Blog</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-in">
          {posts.map((p: any) => (
            <Link key={p.id} href={`/blog/${p.slug}`}>
              <article className="card h-full flex flex-col">
                {p.featuredImage ? (
                  <img src={p.featuredImage} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-3xl" style={{ background: 'var(--bg-alt)' }}>
                    <i className="fa-solid fa-pen-nib" style={{ color: 'var(--color-primary)', opacity: 0.3 }}></i>
                  </div>
                )}
                <div className="card-body flex-1 flex flex-col">
                  <p className="text-xs mb-2" style={{ color: 'var(--text-faint)' }}>{formatDate(p.publishedAt)}</p>
                  <h3 className="card-title mb-2">{p.title}</h3>
                  <p className="card-meta line-clamp-3 flex-1">{p.excerpt || stripHtml(p.content || '').substring(0, 150)}</p>
                  {p.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.tags.split(',').map((t: string, i: number) => <span key={i} className="pill" style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem' }}>{t.trim()}</span>)}
                    </div>
                  )}
                  <p className="mt-3 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    Read more <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.5rem' }}></i>
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state"><i className="fa-solid fa-pen-nib"></i><p>No blog posts yet.</p></div>
      )}
    </div>
  );
}
