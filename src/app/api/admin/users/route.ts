import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const users = await db.select({
      id: adminUsers.id, email: adminUsers.email, name: adminUsers.name,
      role: adminUsers.role, createdAt: adminUsers.createdAt,
    }).from(adminUsers);
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    if (action === 'create') {
      const { email, name, password, role } = body;
      if (!email || !name || !password) return NextResponse.json({ error: 'Email, name, and password required' }, { status: 400 });
      const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
      if (existing.length > 0) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      const hash = await hashPassword(password);
      await db.insert(adminUsers).values({ email, name, password: hash, role: role || 'editor' });
      return NextResponse.json({ success: true });
    }
    if (action === 'update') {
      const { id, name, email, role } = body;
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role;
      await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id));
      return NextResponse.json({ success: true });
    }
    if (action === 'change-password') {
      const { id, newPassword } = body;
      if (!id || !newPassword) return NextResponse.json({ error: 'ID and new password required' }, { status: 400 });
      if (newPassword.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      const hash = await hashPassword(newPassword);
      await db.update(adminUsers).set({ password: hash }).where(eq(adminUsers.id, id));
      return NextResponse.json({ success: true });
    }
    if (action === 'delete') {
      const { id } = body;
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
      const all = await db.select().from(adminUsers);
      if (all.length <= 1) return NextResponse.json({ error: 'Cannot delete the only admin' }, { status: 400 });
      await db.delete(adminUsers).where(eq(adminUsers.id, id));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
