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
  const [darkMode, setDarkMode] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  useEffect(() => {
    // Restore preferences
    const savedSize = localStorage.getItem('reader-font-size');
    const savedTheme = localStorage.getItem('reader-theme');
    if (savedSize) setFontSize(parseInt(savedSize));
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/public?type=chapter&bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); window.scrollTo(0, 0); });
    fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageType: 'chapter', pageSlug: `${bookSlug}/${chapterSlug}` }) });
  }, [bookSlug, chapterSlug]);

  const changeFontSize = useCallback((delta: number) => {
    setFontSize(prev => {
      const newSize = Math.min(28, Math.max(14, prev + delta));
      localStorage.setItem('reader-font-size', newSize.toString());
      return newSize;
    });
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('reader-theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }, []);

  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!data?.chapter) return <div className="page-container empty-state"><i className="fa-solid fa-file-lines"></i><p>Chapter not found.</p></div>;

  const { book, chapter, chapters, prev, next, settings } = data;

  return (
    <div className="fade-in" style={{ background: 'var(--reader-bg)', minHeight: '100vh' }}>
      {/* Reader toolbar */}
      <div className="reader-toolbar">
        <div className="page-container flex items-center justify-between" style={{ padding: '0 1rem' }}>
          <Link href={`/book/${bookSlug}`} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-arrow-left"></i>
            <span className="hidden sm:inline">{book.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Chapter list toggle */}
            <button onClick={() => setShowChapters(!showChapters)} className="theme-toggle" title="Chapter List">
              <i className="fa-solid fa-list"></i>
            </button>

            {/* Font size controls */}
            <div className="font-size-control flex items-center gap-1">
              <button onClick={() => changeFontSize(-2)} title="Smaller text"><i className="fa-solid fa-minus text-xs"></i></button>
              <span className="text-xs px-1 w-8 text-center">{fontSize}</span>
              <button onClick={() => changeFontSize(2)} title="Larger text"><i className="fa-solid fa-plus text-xs"></i></button>
            </div>

            {/* Theme toggle */}
            <button onClick={toggleDark} className="theme-toggle" title="Toggle theme">
              <i className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Chapter list sidebar */}
      {showChapters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChapters(false)}></div>
          <div className="relative ml-auto w-80 max-w-full h-full overflow-y-auto" style={{ background: 'var(--card-bg)' }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold"><i className="fa-solid fa-list mr-2" style={{ color: 'var(--color-primary)' }}></i>Chapters</h3>
                <button onClick={() => setShowChapters(false)} className="theme-toggle"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="space-y-1">
                {chapters.map((ch: any, idx: number) => (
                  <Link key={ch.id} href={`/book/${bookSlug}/${ch.slug}`} onClick={() => setShowChapters(false)} className={`block p-3 rounded-lg text-sm transition-all ${ch.slug === chapterSlug ? 'font-bold' : ''}`} style={ch.slug === chapterSlug ? { background: 'var(--bg-alt)', color: 'var(--color-primary)' } : {}}>
                    <span className="mr-2" style={{ color: 'var(--text-muted)' }}>{idx + 1}.</span> {ch.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reader body */}
      <div className="reader-body">
        {chapter.chapterImage && (
          <img src={chapter.chapterImage} alt={chapter.title} className="w-full max-h-64 object-cover rounded-xl mb-6" />
        )}

        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{chapter.title}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-book mr-1"></i> {book.title}
          {chapters.length > 1 && <> &middot; Chapter {chapters.findIndex((c: any) => c.id === chapter.id) + 1} of {chapters.length}</>}
        </p>

        <div className="reader-content" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: chapter.content || '<p>No content yet.</p>' }} />

        {/* Chapter navigation */}
        <div className="chapter-nav">
          {prev ? (
            <Link href={`/book/${bookSlug}/${prev.slug}`}>
              <i className="fa-solid fa-arrow-left"></i>
              <span className="hidden sm:inline">{prev.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : <div></div>}
          {next ? (
            <Link href={`/book/${bookSlug}/${next.slug}`}>
              <span className="hidden sm:inline">{next.title}</span>
              <span className="sm:hidden">Next</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          ) : <div></div>}
        </div>

        {/* Support at end of chapter */}
        {settings && (
          <div className="mt-8">
            <SupportSection settings={settings} />
          </div>
        )}
      </div>
    </div>
  );
}
