'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="admin-sidebar flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2 !p-0 !m-0">
          <i className="fa-solid fa-book-open text-xl text-indigo-400"></i>
          <span className="text-lg font-bold">AuthorShelf</span>
        </Link>
        <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? 'active' : ''}
          >
            <i className={`${item.icon} w-5 text-center text-sm`}></i>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="text-sm">
          <i className="fa-solid fa-external-link w-5 text-center text-sm"></i>
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-red-300 hover:bg-white/10 rounded-lg mx-0.5 mt-0.5"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center text-sm"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
