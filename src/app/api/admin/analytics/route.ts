import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews, books, chapters, blogPosts } from '@/lib/db/schema';
import { sql, desc, gte } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const since = new Date();
    since.setDate(since.getDate() - days);

    const views = await db.select().from(pageViews).where(gte(pageViews.viewedAt, since));

    const bookViews: Record<number, number> = {};
    const chapterViews: Record<number, number> = {};
    const blogViews: Record<number, number> = {};
    let totalViews = views.length;

    for (const v of views) {
      if (v.pageType === 'book' && v.pageId) bookViews[v.pageId] = (bookViews[v.pageId] || 0) + 1;
      if (v.pageType === 'chapter' && v.pageId) chapterViews[v.pageId] = (chapterViews[v.pageId] || 0) + 1;
      if (v.pageType === 'blog' && v.pageId) blogViews[v.pageId] = (blogViews[v.pageId] || 0) + 1;
    }

    // Daily breakdown
    const daily: Record<string, number> = {};
    for (const v of views) {
      const day = v.viewedAt.toISOString().split('T')[0];
      daily[day] = (daily[day] || 0) + 1;
    }

    const allBooks = await db.select().from(books);
    const allChapters = await db.select().from(chapters);

    const topBooks = Object.entries(bookViews)
      .map(([id, count]) => ({ ...allBooks.find(b => b.id === parseInt(id)), views: count }))
      .sort((a, b) => b.views - a.views).slice(0, 10);

    const topChapters = Object.entries(chapterViews)
      .map(([id, count]) => ({ ...allChapters.find(c => c.id === parseInt(id)), views: count }))
      .sort((a, b) => b.views - a.views).slice(0, 10);

    return NextResponse.json({ totalViews, topBooks, topChapters, daily, days });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
