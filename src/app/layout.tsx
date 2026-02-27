import type { Metadata } from 'next';
import './globals.css';
import { getAllSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string | null> = {};
  try { settings = await getAllSettings(); } catch {}
  return {
    title: settings.site_name || 'AuthorShelf',
    description: settings.seo_description || 'A personal online book reading platform',
    icons: { icon: settings.favicon || '/favicon.svg' },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let s: Record<string, string | null> = {};
  try { s = await getAllSettings(); } catch {}

  const primaryColor = s.primary_color || '#6366f1';
  const secondaryColor = s.secondary_color || '#f59e0b';
  const defaultTheme = s.default_theme || 'light';
  const fontChoice = s.font_choice || 'classic';

  const fontMap: Record<string, { heading: string; body: string }> = {
    classic: { heading: "'Georgia', serif", body: "'Segoe UI', system-ui, sans-serif" },
    modern: { heading: "'Helvetica Neue', Helvetica, Arial, sans-serif", body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    literary: { heading: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", body: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
  };

  const fonts = fontMap[fontChoice] || fontMap.classic;

  // Darken primary color for hover
  const darken = (hex: string) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max((num >> 16) - 30, 0);
    const g = Math.max(((num >> 8) & 0x00FF) - 30, 0);
    const b = Math.max((num & 0x0000FF) - 30, 0);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const cssVars = `
    :root {
      --color-primary: ${primaryColor};
      --color-primary-dark: ${darken(primaryColor)};
      --color-secondary: ${secondaryColor};
      --font-heading: ${fonts.heading};
      --font-body: ${fonts.body};
    }
  `;

  return (
    <html lang="en" className={defaultTheme === 'dark' ? 'dark' : ''}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        {children}
      </body>
    </html>
  );
}
