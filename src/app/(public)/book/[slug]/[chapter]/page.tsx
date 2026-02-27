'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SupportSection from '@/components/public/SupportSection';
export default function ChapterReaderPage() {
  const params = useParams();
  const bookSlug = params.slug as string;
  const chapterSlug = params.chapter as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [showChapters, setShowChapters] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('reader-font-size');
    if (saved) setFontSize(parseInt(saved));
  }, []);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/public?type=chapter&bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); window.scrollTo(0, 0); });
    fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageType: 'chapter', pageSlug: `${bookSlug}/${chapterSlug}` }) });
  }, [bookSlug, chapterSlug]);
  const changeFontSize = useCallback((delta: number) => {
    setFontSize(prev => {
      const n = Math.min(28, Math.max(14, prev + delta));
      localStorage.setItem('reader-font-size', n.toString());
      return n;
    });
  }, []);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!data?.chapter) return <div className="page-container empty-state"><i className="fa-solid fa-file-lines"></i><p>Chapter not found.</p></div>;
  const { book, chapter, chapters, prev, next, settings } = data;
  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      <div className="reader-toolbar">
        <Link href={`/book/${bookSlug}`} className="reader-btn">
          <i className="fa-solid fa-arrow-left mr-1"></i> <span className="hidden sm:inline">{book.title}</span><span className="sm:hidden">Back</span>
        </Link>
        <button onClick={() => setShowChapters(!showChapters)} className="reader-btn"><i className="fa-solid fa-list"></i></button>
        <button onClick={() => changeFontSize(-2)} className="reader-btn">A-</button>
        <span className="text-xs" style={{ color: 'var(--text-muted)', minWidth: 20, textAlign: 'center' }}>{fontSize}</span>
        <button onClick={() => changeFontSize(2)} className="reader-btn">A+</button>
      </div>
      {showChapters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChapters(false)}></div>
          <div className="relative ml-auto w-80 max-w-full h-full overflow-y-auto" style={{ background: 'var(--bg-card)' }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Chapters</h3>
                <button onClick={() => setShowChapters(false)} className="reader-btn"><i className="fa-solid fa-xmark"></i></button>
              </div>
              {chapters.map((ch: any, idx: number) => (
                <Link key={ch.id} href={`/book/${bookSlug}/${ch.slug}`} onClick={() => setShowChapters(false)}
                  className="block p-3 rounded-lg text-sm transition-all mb-1"
                  style={ch.slug === chapterSlug ? { background: 'var(--color-primary-glow)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--text-muted)' }}>
                  <span className="mr-2">{idx + 1}.</span> {ch.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="page-narrow" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {chapter.chapterImage && <img src={chapter.chapterImage} alt={chapter.title} className="w-full max-h-64 object-cover rounded-xl mb-6" />}
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{chapter.title}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-faint)' }}>
          {book.title}{chapters.length > 1 && <> &middot; Chapter {chapters.findIndex((c: any) => c.id === chapter.id) + 1} of {chapters.length}</>}
        </p>
        <div className="reader-content" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: chapter.content || '<p>No content yet.</p>' }} />
        <div className="chapter-nav">
          {prev ? <Link href={`/book/${bookSlug}/${prev.slug}`}><i className="fa-solid fa-arrow-left"></i> {prev.title}</Link> : <div></div>}
          {next ? <Link href={`/book/${bookSlug}/${next.slug}`}>{next.title} <i className="fa-solid fa-arrow-right"></i></Link> : <div></div>}
        </div>
        {settings && <div className="mt-8"><SupportSection settings={settings} /></div>}
      </div>
    </div>
  );
}
