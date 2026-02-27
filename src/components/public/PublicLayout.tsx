'use client';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public?type=home')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loader">
      <i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i>
    </div>
  );

  const settings = data?.settings || {};
  const toggles = data?.toggles || {};
  const author = data?.author || null;

  return (
    <>
      <Header
        siteName={settings.site_name || 'AuthorShelf'}
        logo={settings.logo}
        toggles={toggles}
      />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name || 'AuthorShelf'}
        footerText={settings.footer_text}
        author={author}
        toggles={toggles}
      />
    </>
  );
}
