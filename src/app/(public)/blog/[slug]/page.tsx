'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
function formatDate(d: string | null) { if (!d) return ''; return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/public?type=blogPost&slug=${slug}`).then(r => r.json()).then(d => { setPost(d.post); setLoading(false); });
    fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageType: 'blog', pageSlug: slug }) });
  }, [slug]);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!post) return <div className="page-container empty-state"><i className="fa-solid fa-pen-nib"></i><p>Post not found.</p><Link href="/blog" className="mt-4 inline-block font-semibold" style={{ color: 'var(--color-primary)' }}>Back to Blog</Link></div>;
  return (
    <div className="page-container fade-in">
      <article className="page-narrow">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: 'var(--color-primary)' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Blog
        </Link>
        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full rounded-xl mb-6" style={{ maxHeight: 400, objectFit: 'cover' }} />}
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-faint)' }}>{formatDate(post.publishedAt)}</p>
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.split(',').map((t: string, i: number) => <span key={i} className="pill">{t.trim()}</span>)}
          </div>
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </article>
    </div>
  );
}
