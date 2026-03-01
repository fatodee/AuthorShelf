import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
// Allow Vercel CDN to cache served images (don't use force-dynamic!)
export const revalidate = 31536000; // 1 year
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // If the path is a base64 data URI, decode and serve as binary
    if (row.path.startsWith('data:')) {
      const match = row.path.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return NextResponse.json({ error: 'Invalid data URI' }, { status: 500 });
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'CDN-Cache-Control': 'public, max-age=31536000, immutable',
          'Vercel-CDN-Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    // If it's a regular URL, redirect to it
    return NextResponse.redirect(row.path);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
