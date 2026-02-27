import type { Metadata } from 'next';
import './globals.css';
import { getAllSettings } from '@/lib/settings';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
const fontMap: Record<string, { name: string; heading: string; body: string; google: string }> = {
  classic:    { name: 'Classic',       heading: "'Georgia', serif",                          body: "'Georgia', serif",                          google: '' },
  modern:     { name: 'Modern',        heading: "'Inter', sans-serif",                       body: "'Inter', sans-serif",                       google: 'Inter:wght@400;500;600;700' },
  literary:   { name: 'Literary',      heading: "'Playfair Display', serif",                 body: "'Lora', serif",                             google: 'Playfair+Display:wght@400;700&family=Lora:wght@400;500;600' },
  elegant:    { name: 'Elegant',       heading: "'Cormorant Garamond', serif",               body: "'EB Garamond', serif",                      google: 'Cormorant+Garamond:wght@400;600;700&family=EB+Garamond:wght@400;500' },
  minimal:    { name: 'Minimal',       heading: "'DM Sans', sans-serif",                     body: "'DM Sans', sans-serif",                     google: 'DM+Sans:wght@400;500;600;700' },
  editorial:  { name: 'Editorial',     heading: "'Libre Baskerville', serif",                body: "'Source Sans 3', sans-serif",                google: 'Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600' },
  romantic:   { name: 'Romantic',      heading: "'Italiana', serif",                         body: "'Raleway', sans-serif",                     google: 'Italiana&family=Raleway:wght@400;500;600' },
  bold:       { name: 'Bold',          heading: "'Sora', sans-serif",                        body: "'Sora', sans-serif",                        google: 'Sora:wght@400;500;600;700' },
  typewriter: { name: 'Typewriter',    heading: "'Special Elite', cursive",                  body: "'Courier Prime', monospace",                google: 'Special+Elite&family=Courier+Prime:wght@400;700' },
  luxe:       { name: 'Luxe',          heading: "'Cinzel', serif",                           body: "'Nunito Sans', sans-serif",                 google: 'Cinzel:wght@400;600;700&family=Nunito+Sans:wght@400;500;600' },
};
export async function generateMetadata(): Promise<Metadata> {
  let s: Record<string, string | null> = {};
  try { s = await getAllSettings(); } catch {}
  return {
    title: s.site_name || 'Your Rey Of Ecstasy',
    description: s.seo_description || 'Exploring thoughts across genres',
    icons: { icon: s.favicon || '/favicon.svg' },
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let s: Record<string, string | null> = {};
  try { s = await getAllSettings(); } catch {}
  const primary = s.primary_color || '#8b1a1a';
  const secondary = s.secondary_color || '#d4a574';
  const theme = s.default_theme || 'dark';
  const fontKey = s.font_choice || 'literary';
  const font = fontMap[fontKey] || fontMap.literary;
  const darken = (hex: string, amt = 25) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.max((n >> 16) - amt, 0);
    const g = Math.max(((n >> 8) & 0xFF) - amt, 0);
    const b = Math.max((n & 0xFF) - amt, 0);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };
  const lighten = (hex: string, amt = 0.12) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = (n >> 16) & 0xFF;
    const g = (n >> 8) & 0xFF;
    const b = n & 0xFF;
    return `rgba(${r},${g},${b},${amt})`;
  };
  const css = `
    :root {
      --color-primary: ${primary};
      --color-primary-dark: ${darken(primary)};
      --color-primary-glow: ${lighten(primary)};
      --color-secondary: ${secondary};
      --color-secondary-glow: ${lighten(secondary)};
      --font-heading: ${font.heading};
      --font-body: ${font.body};
    }
  `;
  const googleFontUrl = font.google
    ? `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`
    : '';
  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {googleFontUrl && <link rel="stylesheet" href={googleFontUrl} />}
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
