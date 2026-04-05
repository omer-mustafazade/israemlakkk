import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'admin_token';

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? '';
}

export function checkPassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD ?? '');
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const validToken = getAdminToken();
  if (!validToken) return false;
  return token === validToken;
}

export function requireAdminAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export { TOKEN_COOKIE };
