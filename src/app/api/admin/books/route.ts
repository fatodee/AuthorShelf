import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils/helpers';

export async function GET() {
  try {
    const rows = await db.select().from(books).orderBy(desc(books.createdAt));
    const cats = await db.select().from(categories);
    const enriched = rows.map(b => ({
      ...b,
      categoryName: cats.find(c => c.id === b.categoryId)?.name || 'Uncategorized',
    }));
    return NextResponse.json(enriched);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    const slug = data.slug || generateSlug(data.title);
    const now = new Date();
    const insertData = {
      ...data, slug,
      publishedAt: data.status === 'published' ? (data.publishedAt || now) : null,
      createdAt: now, updatedAt: now,
    };
    const inserted = await db.insert(books).values(insertData).returning();
    return NextResponse.json(inserted[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, categoryName, createdAt, ...rest } = data;
    rest.updatedAt = new Date();
    if (rest.publishedAt) rest.publishedAt = new Date(rest.publishedAt);
    if (rest.status === 'published' && !rest.publishedAt) rest.publishedAt = new Date();
    if (rest.status === 'draft') rest.publishedAt = null;
    await db.update(books).set(rest).where(eq(books.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(books).where(eq(books.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
