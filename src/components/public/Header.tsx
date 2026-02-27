'use client';
import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  siteName: string;
  logo?: string | null;
  toggles: Record<string, boolean>;
}

export default function Header({ siteName, logo, toggles }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { key: 'home', label: 'Home', href: '/', icon: 'fa-solid fa-house' },
    { key: 'books', label: 'Books', href: '/books', icon: 'fa-solid fa-book' },
    { key: 'categories', label: 'Categories', href: '/categories', icon: 'fa-solid fa-folder' },
    { key: 'author', label: 'Author', href: '/author', icon: 'fa-solid fa-user' },
    { key: 'blog', label: 'Blog', href: '/blog', icon: 'fa-solid fa-pen-nib' },
    { key: 'support', label: 'Support', href: '/support', icon: 'fa-solid fa-heart' },
  ].filter(item => toggles[item.key] !== false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="site-header">
      <div className="page-container" style={{ padding: '0.75rem 1rem' }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={siteName} className="h-8 w-auto" />
            ) : (
              <i className="fa-solid fa-book-open text-xl" style={{ color: 'var(--color-primary)' }}></i>
            )}
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{siteName}</span>
          </Link>

          <nav className="desktop-nav flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.key} href={item.href} className="nav-link">
                <i className={`${item.icon} mr-1 text-xs`}></i> {item.label}
              </Link>
            ))}
            {toggles.search !== false && (
              <button onClick={() => setSearchOpen(!searchOpen)} className="nav-link" title="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            )}
          </nav>

          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text)' }}>
            <i className={mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
          </button>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-3 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}></i>
            <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search books, chapters, blog posts..." className="search-input" />
          </form>
        )}

        {mobileOpen && (
          <nav className="mobile-nav mt-2">
            {navItems.map(item => (
              <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}>
                <i className={`${item.icon} mr-2 w-5 text-center`} style={{ color: 'var(--color-primary)' }}></i> {item.label}
              </Link>
            ))}
            {toggles.search !== false && (
              <form onSubmit={handleSearch} className="mt-2 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}></i>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="search-input" />
              </form>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
