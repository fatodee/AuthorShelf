import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const inserted = await db.insert(media).values({
      filename,
      path: base64,
      mimeType: file.type,
      size: file.size,
      alt: filename.split('.')[0],
    }).returning();

    return NextResponse.json({ success: true, media: inserted[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
