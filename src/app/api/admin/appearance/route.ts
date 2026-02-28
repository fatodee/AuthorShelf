import { NextResponse } from 'next/server';
import { getAllSettings, setSetting } from '@/lib/settings';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const all = await getAllSettings();
    return NextResponse.json({ theme_name: all.theme_name || 'midnight-ink' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data.theme_name) await setSetting('theme_name', data.theme_name);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
