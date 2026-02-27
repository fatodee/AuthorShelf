import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { verifyPassword, createSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    const users = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    if (!users.length) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const valid = await verifyPassword(password, users[0].password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    await createSession(users[0].id, users[0].email, users[0].name);
    return NextResponse.json({ success: true, name: users[0].name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
