'use client';
import { useState, useEffect } from 'react';
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  const cards = [
    { label: 'Published Books', value: stats?.publishedBooks || 0, icon: 'fa-solid fa-book', color: '#6366f1' },
    { label: 'Total Chapters', value: stats?.publishedChapters || 0, icon: 'fa-solid fa-file-lines', color: '#10b981' },
    { label: 'Blog Posts', value: stats?.publishedPosts || 0, icon: 'fa-solid fa-pen-nib', color: '#f59e0b' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: 'fa-solid fa-folder', color: '#8b5cf6' },
    { label: 'Media Files', value: stats?.totalMedia || 0, icon: 'fa-solid fa-images', color: '#ec4899' },
    { label: 'Views (7 days)', value: stats?.weekViews || 0, icon: 'fa-solid fa-eye', color: '#06b6d4' },
    { label: 'Views (30 days)', value: stats?.monthViews || 0, icon: 'fa-solid fa-chart-line', color: '#14b8a6' },
    { label: 'Draft Books', value: (stats?.totalBooks || 0) - (stats?.publishedBooks || 0), icon: 'fa-solid fa-file-pen', color: '#f97316' },
  ];
  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fa-solid fa-chart-pie mr-2" style={{ color: 'var(--color-primary)' }}></i>Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back! Here&apos;s an overview of your site.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.color + '15' }}>
              <i className={card.icon} style={{ color: card.color, fontSize: '1.125rem' }}></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fa-solid fa-rocket mr-2" style={{ color: 'var(--color-primary)' }}></i>Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="/admin/books" className="admin-btn admin-btn-primary" style={{ justifyContent: 'center' }}><i className="fa-solid fa-plus"></i> New Book</a>
          <a href="/admin/blog" className="admin-btn" style={{ justifyContent: 'center' }}><i className="fa-solid fa-pen-nib"></i> New Blog Post</a>
          <a href="/admin/media" className="admin-btn" style={{ justifyContent: 'center' }}><i className="fa-solid fa-upload"></i> Upload Media</a>
          <a href="/admin/settings" className="admin-btn" style={{ justifyContent: 'center' }}><i className="fa-solid fa-gear"></i> Site Settings</a>
        </div>
      </div>
    </div>
  );
}
