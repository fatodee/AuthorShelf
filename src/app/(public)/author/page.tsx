'use client';
import { useEffect, useState } from 'react';

export default function AuthorPage() {
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/public?type=author').then(r => r.json()).then(d => { setAuthor(d.author); setLoading(false); }); }, []);

  if (loading) return <div className="page-loader"><i className="fa-solid fa-spinner fa-spin text-3xl" style={{ color: 'var(--color-primary)' }}></i></div>;
  if (!author) return <div className="page-container empty-state"><i className="fa-solid fa-user"></i><p>Author profile not set up yet.</p></div>;

  const socials = [
    { key: 'facebookUrl', icon: 'fa-brands fa-facebook-f', url: author.facebookUrl, label: 'Facebook' },
    { key: 'instagramUrl', icon: 'fa-brands fa-instagram', url: author.instagramUrl, label: 'Instagram' },
    { key: 'xUrl', icon: 'fa-brands fa-x-twitter', url: author.xUrl, label: 'X (Twitter)' },
    { key: 'linkedinUrl', icon: 'fa-brands fa-linkedin-in', url: author.linkedinUrl, label: 'LinkedIn' },
    { key: 'youtubeUrl', icon: 'fa-brands fa-youtube', url: author.youtubeUrl, label: 'YouTube' },
    { key: 'websiteUrl', icon: 'fa-solid fa-globe', url: author.websiteUrl, label: 'Website' },
  ].filter(s => s.url);

  return (
    <div className="page-container fade-in">
      <div className="narrow-container text-center">
        {author.photo && <img src={author.photo} alt={author.name} className="author-photo mx-auto mb-6" />}
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{author.name}</h1>

        {socials.length > 0 && (
          <div className="social-links flex justify-center gap-3 mb-8">
            {socials.map(s => (
              <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer" title={s.label}><i className={s.icon}></i></a>
            ))}
          </div>
        )}

        {author.bio && <div className="prose mx-auto text-left" dangerouslySetInnerHTML={{ __html: author.bio }} />}

        {author.achievements && (
          <div className="mt-8 text-left">
            <h2 className="section-heading text-xl"><i className="fa-solid fa-trophy"></i>Achievements & Awards</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: author.achievements }} />
          </div>
        )}
      </div>
    </div>
  );
}
