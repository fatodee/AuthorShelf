'use client';
import { useState, useEffect } from 'react';
import RichEditor from '@/components/admin/RichEditor';

export default function AdminSupport() {
  const [data, setData] = useState<any>({});
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/support').then(r => r.json()).then(d => {
      setData(d);
      try { setMethods(JSON.parse(d.support_methods || '[]')); } catch { setMethods([]); }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { ...data, support_methods: JSON.stringify(methods) };
    await fetch('/api/admin/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false); setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
  };

  const addMethod = () => setMethods([...methods, { label: '', url: '', icon: 'fa-solid fa-heart' }]);
  const removeMethod = (i: number) => setMethods(methods.filter((_, idx) => idx !== i));
  const updateMethod = (i: number, key: string, val: string) => setMethods(methods.map((m, idx) => idx === i ? { ...m, [key]: val } : m));

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-heart mr-3" style={{ color: 'var(--color-primary)' }}></i>Support / Donate Section</h1>
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
      </div>
      {msg && <div className="p-3 rounded-lg mb-4 text-sm bg-green-50 text-green-800"><i className="fa-solid fa-check-circle mr-2"></i>{msg}</div>}
      <div className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-bold"><i className="fa-solid fa-toggle-on mr-2"></i>General</h2>
          <p className="form-hint">This section appears on book pages and chapter pages. You decide what to call it — "Donate", "Tip", "Support", "Buy me a coffee" — it's entirely up to you.</p>
          <div className="flex items-center gap-3">
            <button className={`toggle ${data.support_enabled === 'true' ? 'active' : ''}`} onClick={() => setData({ ...data, support_enabled: data.support_enabled === 'true' ? 'false' : 'true' })} />
            <span className="font-medium">Enable Support Section</span>
          </div>
          <div><label className="form-label">Section Title</label><input className="form-input" value={data.support_title || ''} onChange={e => setData({ ...data, support_title: e.target.value })} placeholder="e.g., Support My Writing, Buy Me a Coffee, Tip Jar" /><p className="form-hint">This is the heading visitors see. Call it whatever feels right.</p></div>
          <div><label className="form-label">Description</label><textarea className="form-input" rows={3} value={data.support_description || ''} onChange={e => setData({ ...data, support_description: e.target.value })} placeholder="Tell your readers why their support matters..." /><p className="form-hint">A personal message to your readers about why support matters.</p></div>
          <div><label className="form-label">Button Text</label><input className="form-input max-w-sm" value={data.support_button_text || ''} onChange={e => setData({ ...data, support_button_text: e.target.value })} placeholder="e.g., Donate, Send a Tip, Buy Me a Coffee" /></div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold"><i className="fa-solid fa-credit-card mr-2"></i>Payment Methods</h2>
          <p className="form-hint">Add links to your payment/donation platforms. Use Font Awesome icon classes (e.g., fa-brands fa-paypal, fa-solid fa-mug-hot).</p>
          {methods.map((m, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-end p-3 rounded-lg bg-gray-50">
              <div><label className="form-label">Label</label><input className="form-input" value={m.label} onChange={e => updateMethod(i, 'label', e.target.value)} placeholder="PayPal" /></div>
              <div><label className="form-label">URL</label><input className="form-input" value={m.url} onChange={e => updateMethod(i, 'url', e.target.value)} placeholder="https://paypal.me/..." /></div>
              <div><label className="form-label">Icon Class</label><input className="form-input" value={m.icon} onChange={e => updateMethod(i, 'icon', e.target.value)} placeholder="fa-brands fa-paypal" /></div>
              <button onClick={() => removeMethod(i)} className="btn btn-sm btn-danger self-end"><i className="fa-solid fa-trash mr-1"></i>Remove</button>
            </div>
          ))}
          <button onClick={addMethod} className="btn btn-secondary"><i className="fa-solid fa-plus mr-2"></i>Add Payment Method</button>
        </div>
        <div className="card space-y-4">
          <h2 className="font-bold"><i className="fa-solid fa-code mr-2"></i>Custom HTML (Advanced)</h2>
          <p className="form-hint">Paste custom embed code (e.g., Ko-fi widget, Buy Me a Coffee button). This will be shown below the payment methods.</p>
          <textarea className="form-input font-mono text-sm" rows={5} value={data.support_custom_html || ''} onChange={e => setData({ ...data, support_custom_html: e.target.value })} placeholder="<script>...</script> or <iframe>...</iframe>" />
        </div>
      </div>
    </div>
  );
}
