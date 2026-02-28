'use client';
import { useState, useEffect } from 'react';
export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [changePwId, setChangePwId] = useState<number | null>(null);
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const load = () => fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  useEffect(() => { load(); }, []);
  const showMsg = (m: string) => { setMsg(m); setErr(''); setTimeout(() => setMsg(''), 3000); };
  const showErr = (m: string) => { setErr(m); setMsg(''); setTimeout(() => setErr(''), 3000); };
  const create = async () => {
    if (!form.name || !form.email || !form.password) return showErr('All fields required');
    const r = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...form }) });
    const d = await r.json();
    if (d.error) return showErr(d.error);
    showMsg('Admin created'); setShowForm(false); setForm({ name: '', email: '', password: '', role: 'editor' }); load();
  };
  const update = async (id: number) => {
    const r = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, ...editData }) });
    const d = await r.json();
    if (d.error) return showErr(d.error);
    showMsg('Updated'); setEditId(null); load();
  };
  const changePw = async (id: number) => {
    if (newPw.length < 6) return showErr('Min 6 characters');
    const r = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'change-password', id, password: newPw }) });
    const d = await r.json();
    if (d.error) return showErr(d.error);
    showMsg('Password changed'); setChangePwId(null); setNewPw(''); load();
  };
  const remove = async (id: number) => {
    if (!confirm('Delete this admin?')) return;
    const r = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    const d = await r.json();
    if (d.error) return showErr(d.error);
    showMsg('Deleted'); load();
  };
  const roleBadge = (role: string) => {
    const m: Record<string, string> = { super_admin: 'badge-red', admin: 'badge-yellow', editor: 'badge-blue' };
    return <span className={`badge ${m[role] || 'badge-blue'}`}>{role.replace('_', ' ')}</span>;
  };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fa-solid fa-users-gear mr-2" style={{ color: 'var(--color-primary)' }}></i>Admin Users
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus"></i> Add Admin
        </button>
      </div>
      {msg && <div className="admin-card mb-4" style={{ borderColor: '#16a34a', background: 'rgba(22,163,74,.1)' }}><span className="text-sm" style={{ color: '#16a34a' }}>{msg}</span></div>}
      {err && <div className="admin-card mb-4" style={{ borderColor: '#dc2626', background: 'rgba(220,38,38,.1)' }}><span className="text-sm" style={{ color: '#dc2626' }}>{err}</span></div>}
      {showForm && (
        <div className="admin-card mb-6">
          <h3 className="font-bold mb-4">Create New Admin</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label className="admin-label">Name</label><input className="admin-input" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="admin-label">Email</label><input className="admin-input" placeholder="admin@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="admin-label">Password</label><input type="password" className="admin-input" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="admin-label">Role</label><select className="admin-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="super_admin">Super Admin</option><option value="admin">Admin</option><option value="editor">Editor</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button onClick={create} className="admin-btn admin-btn-primary"><i className="fa-solid fa-check"></i> Create</button>
            <button onClick={() => setShowForm(false)} className="admin-btn">Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%' }}>
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{editId === u.id ? <input className="admin-input" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ maxWidth: 200 }} /> : <span className="font-medium">{u.name}</span>}</td>
                <td>{editId === u.id ? <input className="admin-input" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} style={{ maxWidth: 250 }} /> : u.email}</td>
                <td>{editId === u.id ? <select className="admin-select" value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} style={{ maxWidth: 150 }}><option value="super_admin">Super Admin</option><option value="admin">Admin</option><option value="editor">Editor</option></select> : roleBadge(u.role)}</td>
                <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '.25rem' }}>
                    {editId === u.id ? (
                      <>
                        <button onClick={() => update(u.id)} className="btn btn-sm btn-primary"><i className="fa-solid fa-check"></i></button>
                        <button onClick={() => setEditId(null)} className="btn btn-sm">✕</button>
                      </>
                    ) : changePwId === u.id ? (
                      <>
                        <input type="password" className="admin-input" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ maxWidth: 160, fontSize: '.75rem' }} />
                        <button onClick={() => changePw(u.id)} className="btn btn-sm btn-primary"><i className="fa-solid fa-check"></i></button>
                        <button onClick={() => setChangePwId(null)} className="btn btn-sm">✕</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(u.id); setEditData({ name: u.name, email: u.email, role: u.role }); }} className="btn btn-sm" title="Edit"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => { setChangePwId(u.id); setNewPw(''); }} className="btn btn-sm" title="Change Password"><i className="fa-solid fa-key"></i></button>
                        <button onClick={() => remove(u.id)} className="btn btn-sm btn-danger" title="Delete"><i className="fa-solid fa-trash"></i></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-card mt-6">
        <h3 className="font-bold text-sm mb-3">Role Permissions</h3>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <p><strong>Super Admin</strong> — Full access: manage content, settings, appearance, and other admins</p>
          <p><strong>Admin</strong> — Manage content, settings, and appearance. Cannot manage other admins</p>
          <p><strong>Editor</strong> — Create and edit books, chapters, and blog posts only</p>
        </div>
      </div>
    </div>
  );
}
