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
    { key: 'home', label: 'Home', href: '/' },
    { key: 'books', label: 'Books', href: '/books' },
    { key: 'categories', label: 'Categories', href: '/categories' },
    { key: 'author', label: 'Author', href: '/author' },
    { key: 'blog', label: 'Blog', href: '/blog' },
    { key: 'support', label: 'Support', href: '/support' },
  ].filter(item => toggles[item.key] !== false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-logo">
          {logo ? <img src={logo} alt={siteName} /> : <i className="fa-solid fa-feather" style={{ color: 'var(--color-primary)' }}></i>}
          <span>{siteName}</span>
        </Link>
        <nav className="desktop-nav">
          {navItems.map(item => (
            <Link key={item.key} href={item.href} className="nav-link">{item.label}</Link>
          ))}
          {toggles.search !== false && (
            <button onClick={() => setSearchOpen(!searchOpen)} className="nav-link" title="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          )}
        </nav>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <i className={mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
        </button>
      </div>
      {searchOpen && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 0.75rem' }}>
          <form onSubmit={handleSearch} className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}></i>
            <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search books, chapters, blog posts..." className="search-input" />
          </form>
        </div>
      )}
      {mobileOpen && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 0.75rem' }}>
          <nav className="mobile-nav">
            {navItems.map(item => (
              <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
            ))}
            {toggles.search !== false && (
              <form onSubmit={handleSearch} className="relative" style={{ padding: '0.5rem 1rem 0' }}>
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}></i>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="search-input" />
              </form>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
