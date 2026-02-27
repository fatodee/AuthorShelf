import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(authorProfile).limit(1);
    return NextResponse.json(rows[0] || null);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const existing = await db.select().from(authorProfile).limit(1);
    if (existing.length > 0) {
      await db.update(authorProfile).set({ ...data, updatedAt: new Date() }).where(eq(authorProfile.id, existing[0].id));
    } else {
      await db.insert(authorProfile).values({ ...data, updatedAt: new Date() });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
