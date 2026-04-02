import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createAdminToken } from '@/libs/adminAuth';
import { getDb } from '@/libs/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = (body?.username ?? '').toString();
  const password = (body?.password ?? '').toString();

  const secret = process.env.ADMIN_AUTH_SECRET || '';

  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'Server admin auth is not configured.' },
      { status: 500 }
    );
  }

  // Authenticate against MongoDB users collection (seeded via `npm run seed:admin`)
  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({
    role: 'admin',
    $or: [{ username }, { email: username }],
  });

  if (!user?.password || typeof user.password !== 'string') {
    return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
  }

  const token = await createAdminToken({ secret });

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

