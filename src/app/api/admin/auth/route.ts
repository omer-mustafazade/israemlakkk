import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, getAdminToken, TOKEN_COOKIE } from '@/lib/auth';
import { sanitizeStr } from '@/lib/validate';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const password = sanitizeStr(body.password, { max: 200 });
  if (!password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_COOKIE, getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}
