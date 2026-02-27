import Link from 'next/link';

interface FooterProps {
  siteName: string;
  footerText?: string | null;
  author?: { name: string; facebookUrl?: string | null; instagramUrl?: string | null; xUrl?: string | null; linkedinUrl?: string | null; youtubeUrl?: string | null; websiteUrl?: string | null } | null;
  toggles: Record<string, boolean>;
}

export default function Footer({ siteName, footerText, author, toggles }: FooterProps) {
  const socials = [
    { key: 'facebookUrl', icon: 'fa-brands fa-facebook-f', url: author?.facebookUrl },
    { key: 'instagramUrl', icon: 'fa-brands fa-instagram', url: author?.instagramUrl },
    { key: 'xUrl', icon: 'fa-brands fa-x-twitter', url: author?.xUrl },
    { key: 'linkedinUrl', icon: 'fa-brands fa-linkedin-in', url: author?.linkedinUrl },
    { key: 'youtubeUrl', icon: 'fa-brands fa-youtube', url: author?.youtubeUrl },
    { key: 'websiteUrl', icon: 'fa-solid fa-globe', url: author?.websiteUrl },
  ].filter(s => s.url);

  return (
    <footer className="site-footer">
      <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <i className="fa-solid fa-book-open" style={{ color: 'var(--color-primary)' }}></i>
              <span className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{siteName}</span>
            </Link>
            {footerText && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{footerText}</p>}
          </div>
          {socials.length > 0 && (
            <div className="footer-social flex gap-2">
              {socials.map(s => (
                <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer" title={s.key.replace('Url', '')}>
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
