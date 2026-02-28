import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: 250, background: 'var(--bg)', minHeight: '100vh', overflow: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
