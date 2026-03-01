import { NextResponse } from 'next/server';
import { getAllSettings, setSetting } from '@/lib/settings';
import { revalidatePath } from 'next/cache';
const SUPPORT_KEYS = [
  'support_enabled', 'support_title', 'support_description', 'support_button_text',
  'support_methods', 'support_custom_html', 'support_image',
];
export async function GET() {
  try {
    const all = await getAllSettings();
    const result: Record<string, string | null> = {};
    for (const k of SUPPORT_KEYS) result[k] = all[k] ?? null;
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      if (SUPPORT_KEYS.includes(key)) await setSetting(key, value as string);
    }
    // Revalidate so public site picks up changes immediately
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
