'use client';
import { useEffect, useState } from 'react';
export default function AuthorPage() {
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/public?type=author').then(r => r.json()).then(d => { setAuthor(d.author); setLoading(false); }); }, []);
  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!author) return <div className="page-container empty-state"><i className="fa-solid fa-user"></i><p>Author profile not set up yet.</p></div>;
  const socials = [
    { key: 'facebook', icon: 'fa-brands fa-facebook-f', url: author.facebookUrl },
    { key: 'instagram', icon: 'fa-brands fa-instagram', url: author.instagramUrl },
    { key: 'x', icon: 'fa-brands fa-x-twitter', url: author.xUrl },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin-in', url: author.linkedinUrl },
    { key: 'youtube', icon: 'fa-brands fa-youtube', url: author.youtubeUrl },
    { key: 'website', icon: 'fa-solid fa-globe', url: author.websiteUrl },
  ].filter(s => s.url);
  return (
    <div className="page-container fade-in">
      <div className="page-narrow text-center">
        {author.photo && <img src={author.photo} alt={author.name} className="author-photo mx-auto mb-6" />}
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{author.name}</h1>
        {socials.length > 0 && (
          <div className="footer-social flex justify-center gap-2 my-6">
            {socials.map(s => (
              <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer"><i className={s.icon}></i></a>
            ))}
          </div>
        )}
        {author.bio && <div className="prose mx-auto text-left" dangerouslySetInnerHTML={{ __html: author.bio }} />}
        {author.achievements && (
          <div className="mt-8 text-left">
            <h2 className="section-title text-xl mb-4"><i className="fa-solid fa-trophy"></i>Achievements</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: author.achievements }} />
          </div>
        )}
      </div>
    </div>
  );
}
