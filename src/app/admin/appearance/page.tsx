'use client';
import { useState, useEffect } from 'react';
const themes = [
  { id: 'midnight-ink', name: 'Midnight Ink', desc: 'Dark glassmorphism with navy & gold accents', style: 'Glassmorphism', fonts: 'Playfair Display + Lora', bg: '#0b1426', primary: '#c9a84c', text: '#e8e4db' },
  { id: 'parchment', name: 'Parchment', desc: 'Warm paper texture with sepia tones', style: 'Skeuomorphism', fonts: 'Libre Baskerville + Georgia', bg: '#f5f0e8', primary: '#8b4513', text: '#2c1810' },
  { id: 'obsidian', name: 'Obsidian', desc: 'Flat dark with monochrome & violet accents', style: 'Flat Modern', fonts: 'Inter', bg: '#09090b', primary: '#8b5cf6', text: '#fafafa' },
  { id: 'rose-garden', name: 'Rose Garden', desc: 'Soft pink with clay-style depth & shadows', style: 'Claymorphism', fonts: 'Cormorant Garamond + EB Garamond', bg: '#fff5f7', primary: '#be185d', text: '#1a1a1a' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', desc: 'Cool teal with frosted glass elements', style: 'Liquid Glass', fonts: 'DM Sans', bg: '#f0fdfa', primary: '#0891b2', text: '#0f172a' },
  { id: 'forest', name: 'Forest', desc: 'Deep green & cream, editorial feel', style: 'Editorial', fonts: 'Libre Baskerville + Source Sans', bg: '#f9faf4', primary: '#166534', text: '#1a2e1a' },
  { id: 'royal', name: 'Royal Purple', desc: 'Deep purple & gold, luxurious elegance', style: 'Luxe', fonts: 'Cinzel + Nunito Sans', bg: '#faf8ff', primary: '#7c3aed', text: '#1e1030' },
  { id: 'neon-noir', name: 'Neon Noir', desc: 'Pure dark with glowing neon accents', style: 'Cyberpunk', fonts: 'Sora', bg: '#050505', primary: '#06b6d4', text: '#f5f5f5' },
  { id: 'terracotta', name: 'Terracotta', desc: 'Warm earth tones, organic & inviting', style: 'Organic', fonts: 'Italiana + Raleway', bg: '#faf6f1', primary: '#c2410c', text: '#292018' },
  { id: 'arctic', name: 'Arctic', desc: 'Clean white with ice blue, Swiss simplicity', style: 'Minimal', fonts: 'DM Sans', bg: '#f8fafc', primary: '#2563eb', text: '#0f172a' },
];
export default function AdminAppearance() {
  const [selected, setSelected] = useState('midnight-ink');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    fetch('/api/admin/appearance').then(r => r.json()).then(d => {
      if (d.theme_name) setSelected(d.theme_name);
      setLoading(false);
    });
  }, []);
  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/appearance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme_name: selected }) });
    setSaving(false);
    setMsg('Theme saved! Refresh the site to see changes.');
    setTimeout(() => setMsg(''), 4000);
  };
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fa-solid fa-palette mr-2" style={{ color: 'var(--color-primary)' }}></i>Appearance
        </h1>
        <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">{saving ? 'Saving...' : 'Save Theme'}</button>
      </div>
      {msg && <div className="admin-card" style={{ marginBottom: '1rem', borderColor: 'var(--color-primary)', background: 'var(--color-primary-glow)' }}><span className="text-sm">{msg}</span></div>}
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Choose a theme pack. Each theme includes curated colors, typography, border styles, and shadows designed to work perfectly together.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-card)',
              border: selected === t.id ? '2px solid var(--color-primary)' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all .2s',
              boxShadow: selected === t.id ? '0 0 0 3px var(--color-primary-glow)' : 'none',
              fontFamily: 'var(--font-body)',
            }}
          >
            {/* Color preview */}
            <div style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0, background: t.bg, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.primary, boxShadow: `0 0 12px ${t.primary}40` }}></div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: t.primary, opacity: 0.3 }}></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                <span className="font-bold">{t.name}</span>
                <span className="badge badge-blue">{t.style}</span>
                {selected === t.id && <span className="badge badge-green">Active</span>}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '.25rem' }}>{t.desc}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Fonts: {t.fonts}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
