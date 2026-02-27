import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, chapters, blogPosts, categories, pageViews, media } from '@/lib/db/schema';
import { gte, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const allBooks = await db.select().from(books);
    const allChapters = await db.select().from(chapters);
    const allPosts = await db.select().from(blogPosts);
    const allCats = await db.select().from(categories);
    const allMedia = await db.select().from(media);

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);

    const weekViews = await db.select().from(pageViews).where(gte(pageViews.viewedAt, weekAgo));
    const monthViews = await db.select().from(pageViews).where(gte(pageViews.viewedAt, monthAgo));

    return NextResponse.json({
      totalBooks: allBooks.length,
      publishedBooks: allBooks.filter(b => b.status === 'published').length,
      totalChapters: allChapters.length,
      publishedChapters: allChapters.filter(c => c.status === 'published').length,
      totalPosts: allPosts.length,
      publishedPosts: allPosts.filter(p => p.status === 'published').length,
      totalCategories: allCats.length,
      totalMedia: allMedia.length,
      weekViews: weekViews.length,
      monthViews: monthViews.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
