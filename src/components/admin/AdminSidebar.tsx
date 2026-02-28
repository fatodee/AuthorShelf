'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
  { href: '/admin/books', label: 'Books', icon: 'fa-solid fa-book' },
  { href: '/admin/chapters', label: 'Chapters', icon: 'fa-solid fa-file-lines' },
  { href: '/admin/categories', label: 'Categories', icon: 'fa-solid fa-folder' },
  { href: '/admin/blog', label: 'Blog Posts', icon: 'fa-solid fa-pen-nib' },
  { href: '/admin/media', label: 'Media Library', icon: 'fa-solid fa-images' },
  { href: '/admin/author', label: 'Author Profile', icon: 'fa-solid fa-user-pen' },
  { href: '/admin/settings', label: 'Site Settings', icon: 'fa-solid fa-gear' },
  { href: '/admin/appearance', label: 'Appearance', icon: 'fa-solid fa-palette' },
  { href: '/admin/pages', label: 'Page Visibility', icon: 'fa-solid fa-eye' },
  { href: '/admin/support', label: 'Support / Donate', icon: 'fa-solid fa-heart' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line' },
  { href: '/admin/users', label: 'Admin Users', icon: 'fa-solid fa-users-gear' },
];
const linkStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem',
  margin: '0.125rem 0.5rem', borderRadius: '8px', fontSize: '0.875rem',
  color: 'var(--text-muted)', transition: 'all 0.15s', textDecoration: 'none',
};
const activeLinkStyle: React.CSSProperties = {
  ...linkStyle, background: 'var(--color-primary-glow)', color: 'var(--color-primary)', fontWeight: 600,
};
export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [siteName, setSiteName] = useState('AuthorShelf');
  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.site_name) setSiteName(d.site_name);
    }).catch(() => {});
  }, []);
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  return (
    <div style={{
      width: 250, background: 'var(--bg-alt)', borderRight: '1px solid var(--border)',
      position: 'fixed', top: 0, bottom: 0, display: 'flex', flexDirection: 'column',
      overflowY: 'auto', zIndex: 40,
    }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <i className="fa-solid fa-feather" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}></i>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem' }}>{siteName}</span>
        </Link>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.25rem' }}>Admin Dashboard</p>
      </div>
      <nav style={{ flex: 1, padding: '0.5rem 0', overflowY: 'auto' }}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            style={pathname === item.href ? activeLinkStyle : linkStyle}
            onMouseEnter={e => { if (pathname !== item.href) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={e => { if (pathname !== item.href) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
          >
            <i className={item.icon} style={{ width: 20, textAlign: 'center', fontSize: '0.8rem' }}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid var(--border)', padding: '0.5rem' }}>
        <Link href="/" target="_blank" style={linkStyle}>
          <i className="fa-solid fa-external-link" style={{ width: 20, textAlign: 'center', fontSize: '0.8rem' }}></i>
          <span>View Site</span>
        </Link>
        <button onClick={handleLogout} style={{
          ...linkStyle, width: '100%', textAlign: 'left' as const, border: 'none',
          cursor: 'pointer', color: '#ef4444', fontFamily: 'var(--font-body)',
        }}>
          <i className="fa-solid fa-right-from-bracket" style={{ width: 20, textAlign: 'center', fontSize: '0.8rem' }}></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
