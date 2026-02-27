import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, chapters, blogPosts } from '@/lib/db/schema';
import { ilike, eq, or } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) return NextResponse.json({ books: [], chapters: [], posts: [] });

    const pattern = `%${q}%`;
    const foundBooks = await db.select().from(books).where(
      or(ilike(books.title, pattern), ilike(books.description, pattern))
    ).limit(20);
    const foundChapters = await db.select().from(chapters).where(
      or(ilike(chapters.title, pattern), ilike(chapters.content, pattern))
    ).limit(20);
    const foundPosts = await db.select().from(blogPosts).where(
      or(ilike(blogPosts.title, pattern), ilike(blogPosts.content, pattern))
    ).limit(20);

    // Enrich chapters with book slug/title
    const publishedChapters = foundChapters.filter(c => c.status === 'published');
    const bookIds = Array.from(new Set(publishedChapters.map(c => c.bookId)));
    const allBooks = bookIds.length ? await db.select().from(books) : [];
    const bookMap: Record<number, { title: string; slug: string }> = {};
    for (const b of allBooks) bookMap[b.id] = { title: b.title, slug: b.slug };
    const enrichedChapters = publishedChapters.map(c => ({
      ...c,
      bookTitle: bookMap[c.bookId]?.title || 'Unknown',
      bookSlug: bookMap[c.bookId]?.slug || '',
    }));

    return NextResponse.json({
      books: foundBooks.filter(b => b.status === 'published'),
      chapters: enrichedChapters,
      posts: foundPosts.filter(p => p.status === 'published'),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
