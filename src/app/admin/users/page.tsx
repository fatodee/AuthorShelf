'use client';
import { useEffect, useState } from 'react';
interface AdminUser { id: number; email: string; name: string; role: string; createdAt: string; }
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showPw, setShowPw] = useState<number|null>(null);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({ email:'', name:'', password:'', role:'editor' });
  const [editForm, setEditForm] = useState({ name:'', email:'', role:'' });
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/admin/users').then(r=>r.json()).then(d=>{setUsers(d);setLoading(false)});
  useEffect(()=>{load()},[]);
  const api = async (body:any) => {
    const r = await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    return r.json();
  };
  const createUser = async () => {
    if(!form.email||!form.name||!form.password){setMsg('All fields required');return}
    const d = await api({action:'create',...form});
    if(d.error){setMsg(d.error);return}
    setForm({email:'',name:'',password:'',role:'editor'});setShowCreate(false);setMsg('User created!');load();
  };
  const updateUser = async (id:number) => {
    const d = await api({action:'update',id,...editForm});
    if(d.error){setMsg(d.error);return}
    setEditId(null);setMsg('Updated!');load();
  };
  const changePw = async (id:number) => {
    if(newPw.length<6){setMsg('Min 6 characters');return}
    const d = await api({action:'change-password',id,newPassword:newPw});
    if(d.error){setMsg(d.error);return}
    setShowPw(null);setNewPw('');setMsg('Password changed!');
  };
  const deleteUser = async (id:number) => {
    if(!confirm('Delete this admin?'))return;
    const d = await api({action:'delete',id});
    if(d.error){setMsg(d.error);return}
    setMsg('Deleted');load();
  };
  const rc:Record<string,string> = {super_admin:'#dc2626',admin:'#8b1a1a',editor:'#2563eb',viewer:'#059669'};
  if(loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{color:'var(--color-primary)'}}></i></div>;
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}><i className="fa-solid fa-users-gear mr-2" style={{color:'var(--color-primary)'}}></i>Admin Users</h1>
        <button onClick={()=>setShowCreate(!showCreate)} className="admin-btn admin-btn-primary"><i className="fa-solid fa-user-plus"></i> Add Admin</button>
      </div>
      {msg && <div className="admin-card mb-4 flex items-center justify-between" style={{borderColor:'var(--color-primary)',background:'var(--color-primary-glow)'}}><span className="text-sm">{msg}</span><button onClick={()=>setMsg('')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)'}}><i className="fa-solid fa-xmark"></i></button></div>}
      {showCreate && (
        <div className="admin-card mb-6">
          <h3 className="font-bold mb-4">Create New Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="admin-label">Name</label><input className="admin-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name"/></div>
            <div><label className="admin-label">Email</label><input className="admin-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/></div>
            <div><label className="admin-label">Password</label><input className="admin-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 characters"/></div>
            <div><label className="admin-label">Role</label>
              <select className="admin-select" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="super_admin">Super Admin</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option>
              </select></div>
          </div>
          <div className="flex gap-2 mt-4"><button onClick={createUser} className="admin-btn admin-btn-primary"><i className="fa-solid fa-check"></i> Create</button><button onClick={()=>setShowCreate(false)} className="admin-btn">Cancel</button></div>
        </div>
      )}
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Created</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td>{editId===u.id?<input className="admin-input" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})}/>:<span className="font-medium">{u.name}</span>}</td>
                <td>{editId===u.id?<input className="admin-input" value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})}/>:<span style={{color:'var(--text-muted)'}}>{u.email}</span>}</td>
                <td>{editId===u.id?<select className="admin-select" value={editForm.role} onChange={e=>setEditForm({...editForm,role:e.target.value})}><option value="super_admin">Super Admin</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select>:<span className="pill" style={{background:`${rc[u.role]||'#666'}20`,color:rc[u.role]||'#666',border:'none'}}>{u.role.replace('_',' ')}</span>}</td>
                <td style={{color:'var(--text-faint)',fontSize:'.8125rem'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><div className="flex gap-1 justify-end flex-wrap">
                  {editId===u.id?<><button onClick={()=>updateUser(u.id)} className="admin-btn admin-btn-primary" style={{padding:'.25rem .5rem',fontSize:'.75rem'}}><i className="fa-solid fa-check"></i></button><button onClick={()=>setEditId(null)} className="admin-btn" style={{padding:'.25rem .5rem',fontSize:'.75rem'}}><i className="fa-solid fa-xmark"></i></button></>
                  :showPw===u.id?<div className="flex gap-1 items-center"><input className="admin-input" type="password" placeholder="New password" value={newPw} onChange={e=>setNewPw(e.target.value)} style={{width:140,padding:'.25rem .5rem',fontSize:'.8125rem'}}/><button onClick={()=>changePw(u.id)} className="admin-btn admin-btn-primary" style={{padding:'.25rem .5rem',fontSize:'.75rem'}}><i className="fa-solid fa-check"></i></button><button onClick={()=>{setShowPw(null);setNewPw('')}} className="admin-btn" style={{padding:'.25rem .5rem',fontSize:'.75rem'}}><i className="fa-solid fa-xmark"></i></button></div>
                  :<><button onClick={()=>{setEditId(u.id);setEditForm({name:u.name,email:u.email,role:u.role})}} className="admin-btn" style={{padding:'.25rem .5rem',fontSize:'.75rem'}} title="Edit"><i className="fa-solid fa-pen"></i></button><button onClick={()=>setShowPw(u.id)} className="admin-btn" style={{padding:'.25rem .5rem',fontSize:'.75rem'}} title="Change Password"><i className="fa-solid fa-key"></i></button><button onClick={()=>deleteUser(u.id)} className="admin-btn admin-btn-danger" style={{padding:'.25rem .5rem',fontSize:'.75rem'}} title="Delete"><i className="fa-solid fa-trash"></i></button></>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
