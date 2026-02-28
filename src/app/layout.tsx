import type { Metadata } from 'next';
import './globals.css';
import { getAllSettings } from '@/lib/settings';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
const themeMap: Record<string, { className: string; google: string }> = {
  'midnight-ink':  { className: 'theme-midnight-ink',  google: 'Playfair+Display:wght@400;700&family=Lora:wght@400;500;600' },
  'parchment':     { className: 'theme-parchment',     google: 'Libre+Baskerville:wght@400;700' },
  'obsidian':      { className: 'theme-obsidian',      google: 'Inter:wght@400;500;600;700' },
  'rose-garden':   { className: 'theme-rose-garden',   google: 'Cormorant+Garamond:wght@400;600;700&family=EB+Garamond:wght@400;500' },
  'ocean-breeze':  { className: 'theme-ocean-breeze',  google: 'DM+Sans:wght@400;500;600;700' },
  'forest':        { className: 'theme-forest',        google: 'Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600' },
  'royal':         { className: 'theme-royal',         google: 'Cinzel:wght@400;600;700&family=Nunito+Sans:wght@400;500;600' },
  'neon-noir':     { className: 'theme-neon-noir',     google: 'Sora:wght@400;500;600;700' },
  'terracotta':    { className: 'theme-terracotta',    google: 'Italiana&family=Raleway:wght@400;500;600' },
  'arctic':        { className: 'theme-arctic',        google: 'DM+Sans:wght@400;500;600;700' },
};
export async function generateMetadata(): Promise<Metadata> {
  let s: Record<string, string | null> = {};
  try { s = await getAllSettings(); } catch {}
  return {
    title: s.site_name || 'AuthorShelf',
    description: s.seo_description || 'A personal online book reading platform',
    icons: { icon: s.favicon || '/favicon.svg' },
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let s: Record<string, string | null> = {};
  try { s = await getAllSettings(); } catch {}
  const themeName = s.theme_name || 'midnight-ink';
  const theme = themeMap[themeName] || themeMap['midnight-ink'];
  const googleFontUrl = theme.google
    ? `https://fonts.googleapis.com/css2?family=${theme.google}&display=swap`
    : '';
  return (
    <html lang="en" className={theme.className}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {googleFontUrl && <link rel="stylesheet" href={googleFontUrl} />}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
