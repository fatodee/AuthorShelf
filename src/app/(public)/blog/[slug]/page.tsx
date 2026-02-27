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
  if (!post) return <div className="page-container empty-state"><i className="fa-solid fa-pen-nib"></i><p>Post not found.</p></div>;

  return (
    <div className="page-container fade-in">
      <div className="narrow-container">
        <Link href="/blog" className="text-sm mb-4 inline-block" style={{ color: 'var(--color-primary)' }}><i className="fa-solid fa-arrow-left mr-1"></i>Back to Blog</Link>

        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6" />
        )}

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          <i className="fa-regular fa-calendar mr-1"></i>{formatDate(post.publishedAt)}
        </p>

        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h1>

        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.split(',').map((t: string, i: number) => <span key={i} className="tag">{t.trim()}</span>)}
          </div>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </div>
    </div>
  );
}
