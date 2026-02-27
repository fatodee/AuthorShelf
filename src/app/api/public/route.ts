import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, chapters, categories, blogPosts, authorProfile, pageToggles } from '@/lib/db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { getAllSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  try {
    if (type === 'home') {
      const settings = await getAllSettings();
      const featuredBooks = await db.select().from(books).where(and(eq(books.status, 'published'), eq(books.featured, true))).orderBy(desc(books.publishedAt)).limit(6);
      const latestBooks = await db.select().from(books).where(eq(books.status, 'published')).orderBy(desc(books.publishedAt)).limit(8);
      const latestChapters = await db.select().from(chapters).where(eq(chapters.status, 'published')).orderBy(desc(chapters.publishedAt)).limit(6);
      const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      const author = await db.select().from(authorProfile).limit(1);
      const allBooks = await db.select().from(books).where(eq(books.status, 'published'));
      // Enrich books with category
      const allCats = await db.select().from(categories);
      const catMap: Record<number, string> = {};
      for (const c of allCats) catMap[c.id] = c.name;
      const enrichBooks = (list: typeof featuredBooks) => list.map(b => ({ ...b, categoryName: b.categoryId ? catMap[b.categoryId] || null : null }));
      // Enrich latest chapters with book info
      const bookMap: Record<number, { title: string; slug: string }> = {};
      for (const b of allBooks) bookMap[b.id] = { title: b.title, slug: b.slug };
      const enrichedChapters = latestChapters.map(c => ({ ...c, bookTitle: bookMap[c.bookId]?.title, bookSlug: bookMap[c.bookId]?.slug }));
      const toggles = await db.select().from(pageToggles);
      const tMap: Record<string, boolean> = {};
      for (const t of toggles) tMap[t.pageKey] = t.enabled;
      return NextResponse.json({ settings, featuredBooks: enrichBooks(featuredBooks), latestBooks: enrichBooks(latestBooks), latestChapters: enrichedChapters, categories: cats, author: author[0] || null, toggles: tMap });
    }

    if (type === 'books') {
      const catId = req.nextUrl.searchParams.get('category');
      const allCats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      const catMap: Record<number, string> = {};
      for (const c of allCats) catMap[c.id] = c.name;
      let query = catId
        ? await db.select().from(books).where(and(eq(books.status, 'published'), eq(books.categoryId, parseInt(catId)))).orderBy(desc(books.publishedAt))
        : await db.select().from(books).where(eq(books.status, 'published')).orderBy(desc(books.publishedAt));
      return NextResponse.json({ books: query.map(b => ({ ...b, categoryName: b.categoryId ? catMap[b.categoryId] : null })), categories: allCats });
    }

    if (type === 'book') {
      const slug = req.nextUrl.searchParams.get('slug');
      if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
      const b = await db.select().from(books).where(and(eq(books.slug, slug), eq(books.status, 'published'))).limit(1);
      if (!b.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const book = b[0];
      const chaps = await db.select().from(chapters).where(and(eq(chapters.bookId, book.id), eq(chapters.status, 'published'))).orderBy(asc(chapters.chapterOrder));
      const cat = book.categoryId ? await db.select().from(categories).where(eq(categories.id, book.categoryId)).limit(1) : [];
      const settings = await getAllSettings();
      return NextResponse.json({ book: { ...book, categoryName: cat[0]?.name || null, categorySlug: cat[0]?.slug || null }, chapters: chaps, settings });
    }

    if (type === 'chapter') {
      const bookSlug = req.nextUrl.searchParams.get('bookSlug');
      const chapterSlug = req.nextUrl.searchParams.get('chapterSlug');
      if (!bookSlug || !chapterSlug) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
      const b = await db.select().from(books).where(and(eq(books.slug, bookSlug), eq(books.status, 'published'))).limit(1);
      if (!b.length) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      const book = b[0];
      const chaps = await db.select().from(chapters).where(and(eq(chapters.bookId, book.id), eq(chapters.status, 'published'))).orderBy(asc(chapters.chapterOrder));
      const current = chaps.find(c => c.slug === chapterSlug);
      if (!current) return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      const idx = chaps.findIndex(c => c.id === current.id);
      const prev = idx > 0 ? chaps[idx - 1] : null;
      const next = idx < chaps.length - 1 ? chaps[idx + 1] : null;
      const settings = await getAllSettings();
      return NextResponse.json({ book, chapter: current, chapters: chaps, prev, next, settings });
    }

    if (type === 'categories') {
      const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      // Count books per category
      const allBooks = await db.select().from(books).where(eq(books.status, 'published'));
      const counts: Record<number, number> = {};
      for (const b of allBooks) { if (b.categoryId) counts[b.categoryId] = (counts[b.categoryId] || 0) + 1; }
      return NextResponse.json({ categories: cats.map(c => ({ ...c, bookCount: counts[c.id] || 0 })) });
    }

    if (type === 'category') {
      const slug = req.nextUrl.searchParams.get('slug');
      if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
      const cat = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      if (!cat.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const bks = await db.select().from(books).where(and(eq(books.status, 'published'), eq(books.categoryId, cat[0].id))).orderBy(desc(books.publishedAt));
      return NextResponse.json({ category: cat[0], books: bks });
    }

    if (type === 'author') {
      const author = await db.select().from(authorProfile).limit(1);
      return NextResponse.json({ author: author[0] || null });
    }

    if (type === 'blog') {
      const posts = await db.select().from(blogPosts).where(eq(blogPosts.status, 'published')).orderBy(desc(blogPosts.publishedAt));
      return NextResponse.json({ posts });
    }

    if (type === 'blogPost') {
      const slug = req.nextUrl.searchParams.get('slug');
      if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
      const post = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published'))).limit(1);
      if (!post.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ post: post[0] });
    }

    if (type === 'toggles') {
      const toggles = await db.select().from(pageToggles);
      const tMap: Record<string, boolean> = {};
      for (const t of toggles) tMap[t.pageKey] = t.enabled;
      return NextResponse.json(tMap);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
