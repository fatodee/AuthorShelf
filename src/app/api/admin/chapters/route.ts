import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils/helpers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    let rows;
    if (bookId) {
      rows = await db.select().from(chapters).where(eq(chapters.bookId, parseInt(bookId))).orderBy(asc(chapters.chapterOrder));
    } else {
      rows = await db.select().from(chapters).orderBy(asc(chapters.chapterOrder));
    }
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.bookId) return NextResponse.json({ error: 'Title and bookId required' }, { status: 400 });
    const slug = data.slug || generateSlug(data.title);
    const now = new Date();
    const insertData = {
      ...data, slug,
      publishedAt: data.status === 'published' ? (data.publishedAt || now) : null,
      createdAt: now, updatedAt: now,
    };
    const inserted = await db.insert(chapters).values(insertData).returning();
    return NextResponse.json(inserted[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, createdAt, ...rest } = data;
    rest.updatedAt = new Date();
    if (rest.publishedAt) rest.publishedAt = new Date(rest.publishedAt);
    if (rest.status === 'published' && !rest.publishedAt) rest.publishedAt = new Date();
    if (rest.status === 'draft') rest.publishedAt = null;
    if (rest.bookId) rest.bookId = parseInt(rest.bookId);
    if (rest.chapterOrder) rest.chapterOrder = parseInt(rest.chapterOrder);
    await db.update(chapters).set(rest).where(eq(chapters.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(chapters).where(eq(chapters.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
