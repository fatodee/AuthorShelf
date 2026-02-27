'use client';
import { useState, useEffect } from 'react';

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const load = async (d: number) => { setLoading(true); const r = await fetch(`/api/admin/analytics?days=${d}`); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(days); }, [days]);

  if (loading) return <div className="flex items-center justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"><i className="fa-solid fa-chart-line mr-3" style={{ color: 'var(--color-primary)' }}></i>Analytics</h1>
        <div className="flex gap-2">
          <button onClick={() => setDays(7)} className={`btn btn-sm ${days === 7 ? 'btn-primary' : 'btn-secondary'}`}>7 Days</button>
          <button onClick={() => setDays(30)} className={`btn btn-sm ${days === 30 ? 'btn-primary' : 'btn-secondary'}`}>30 Days</button>
          <button onClick={() => setDays(90)} className={`btn btn-sm ${days === 90 ? 'btn-primary' : 'btn-secondary'}`}>90 Days</button>
        </div>
      </div>
      <div className="card mb-6">
        <h2 className="font-bold mb-2"><i className="fa-solid fa-eye mr-2"></i>Total Views (last {days} days)</h2>
        <p className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>{data?.totalViews || 0}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold mb-3"><i className="fa-solid fa-book mr-2"></i>Most Read Books</h2>
          {data?.topBooks?.length ? data.topBooks.map((b: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm">{b.title || 'Unknown'}</span>
              <span className="badge badge-blue">{b.views} views</span>
            </div>
          )) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet.</p>}
        </div>
        <div className="card">
          <h2 className="font-bold mb-3"><i className="fa-solid fa-file-lines mr-2"></i>Most Read Chapters</h2>
          {data?.topChapters?.length ? data.topChapters.map((c: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm">{c.title || 'Unknown'}</span>
              <span className="badge badge-green">{c.views} views</span>
            </div>
          )) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet.</p>}
        </div>
      </div>
      {data?.daily && Object.keys(data.daily).length > 0 && (
        <div className="card mt-6">
          <h2 className="font-bold mb-3"><i className="fa-solid fa-calendar mr-2"></i>Daily Views</h2>
          <div className="space-y-2">
            {Object.entries(data.daily).sort((a, b) => b[0].localeCompare(a[0])).map(([day, count]) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm w-28">{day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(100, ((count as number) / Math.max(...Object.values(data.daily).map(Number))) * 100)}%`, background: 'var(--color-primary)' }}></div></div>
                <span className="text-sm font-medium w-12 text-right">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
