'use client';
import { useEffect, useState } from 'react';
import SupportSection from '@/components/public/SupportSection';
export default function SupportPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/public?type=home').then(r => r.json()).then(d => { setSettings(d.settings || {}); setLoading(false); }); }, []);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  return (
    <div className="page-container fade-in">
      <div className="page-narrow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {settings?.support_title || 'Support the Author'}
          </h1>
        </div>
        <SupportSection settings={settings || {}} />
      </div>
    </div>
  );
}
