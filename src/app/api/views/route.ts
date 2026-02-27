import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { pageType, pageId, pageSlug } = await request.json();
    await db.insert(pageViews).values({ pageType, pageId, pageSlug, viewedAt: new Date() });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
