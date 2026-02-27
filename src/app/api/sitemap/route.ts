import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, chapters, categories, blogPosts } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAllSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAllSettings();
    const baseUrl = settings.site_url || process.env.NEXT_PUBLIC_URL || 'https://example.com';
    const allBooks = await db.select().from(books).where(eq(books.status, 'published'));
    const allChapters = await db.select().from(chapters).where(eq(chapters.status, 'published'));
    const allCats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    const allPosts = await db.select().from(blogPosts).where(eq(blogPosts.status, 'published'));

    const bookMap: Record<number, string> = {};
    for (const b of allBooks) bookMap[b.id] = b.slug;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const add = (loc: string, priority = '0.5', changefreq = 'weekly') => {
      xml += `  <url><loc>${baseUrl}${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>\n`;
    };

    add('/', '1.0', 'daily');
    add('/books', '0.9', 'daily');
    add('/categories', '0.7');
    add('/author', '0.6');
    add('/blog', '0.8', 'daily');
    add('/support', '0.4');

    for (const b of allBooks) add(`/book/${b.slug}`, '0.8');
    for (const c of allChapters) {
      const bookSlug = bookMap[c.bookId];
      if (bookSlug) add(`/book/${bookSlug}/${c.slug}`, '0.7');
    }
    for (const cat of allCats) add(`/category/${cat.slug}`, '0.6');
    for (const p of allPosts) add(`/blog/${p.slug}`, '0.7');

    xml += '</urlset>';
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
