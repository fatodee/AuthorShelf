import { NextResponse } from 'next/server';
import { getAllSettings, setSetting } from '@/lib/settings';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
const APPEARANCE_KEYS = ['primary_color', 'secondary_color', 'font_choice', 'default_theme'];
export async function GET() {
  try {
    const all = await getAllSettings();
    const result: Record<string, string | null> = {};
    for (const k of APPEARANCE_KEYS) result[k] = all[k] ?? null;
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    for (const k of APPEARANCE_KEYS) {
      if (data[k] !== undefined) await setSetting(k, data[k]);
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
