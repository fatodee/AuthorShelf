'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-alt)' }}>
      <div className="card w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <i className="fa-solid fa-book-open text-4xl mb-3" style={{ color: 'var(--color-primary)' }}></i>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>AuthorShelf</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Admin Dashboard Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
            </div>
          )}
          <div>
            <label className="form-label"><i className="fa-solid fa-envelope mr-2"></i>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="admin@authorshelf.com" required />
          </div>
          <div>
            <label className="form-label"><i className="fa-solid fa-lock mr-2"></i>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="Enter password" required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
            {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Signing in...</> : <><i className="fa-solid fa-right-to-bracket mr-2"></i>Sign In</>}
          </button>
        </form>
      </div>
    </div>
  );
}
