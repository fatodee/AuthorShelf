import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageToggles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(pageToggles);
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { pageKey, enabled } = data;
    const existing = await db.select().from(pageToggles).where(eq(pageToggles.pageKey, pageKey)).limit(1);
    if (existing.length > 0) {
      await db.update(pageToggles).set({ enabled, updatedAt: new Date() }).where(eq(pageToggles.pageKey, pageKey));
    } else {
      await db.insert(pageToggles).values({ pageKey, enabled, label: data.label || pageKey, updatedAt: new Date() });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
