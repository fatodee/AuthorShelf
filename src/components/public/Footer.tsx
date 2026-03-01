import Link from 'next/link';
interface FooterProps {
  siteName: string;
  footerText?: string | null;
  author?: { name: string; facebookUrl?: string | null; instagramUrl?: string | null; xUrl?: string | null; linkedinUrl?: string | null; youtubeUrl?: string | null; websiteUrl?: string | null } | null;
  toggles: Record<string, boolean>;
}
export default function Footer({ siteName, footerText, author, toggles }: FooterProps) {
  // Only show social links that have actual URLs (not empty, not null, not just whitespace)
  const isValidUrl = (url?: string | null) => url && url.trim().length > 0;
  const socials = [
    { key: 'facebook', icon: 'fa-brands fa-facebook-f', url: author?.facebookUrl },
    { key: 'instagram', icon: 'fa-brands fa-instagram', url: author?.instagramUrl },
    { key: 'x', icon: 'fa-brands fa-x-twitter', url: author?.xUrl },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin-in', url: author?.linkedinUrl },
    { key: 'youtube', icon: 'fa-brands fa-youtube', url: author?.youtubeUrl },
    { key: 'website', icon: 'fa-solid fa-globe', url: author?.websiteUrl },
  ].filter(s => isValidUrl(s.url));
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="site-logo justify-center md:justify-start mb-2" style={{ fontSize: '1.125rem' }}>
              <i className="fa-solid fa-feather" style={{ color: 'var(--color-primary)' }}></i>
              <span>{siteName}</span>
            </Link>
            {footerText && <p className="text-sm mt-2" style={{ color: 'var(--text-muted)', maxWidth: 400 }}>{footerText}</p>}
          </div>
          {socials.length > 0 && (
            <div className="footer-social flex gap-2">
              {socials.map(s => (
                <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer"><i className={s.icon}></i></a>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-faint)' }}>
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
