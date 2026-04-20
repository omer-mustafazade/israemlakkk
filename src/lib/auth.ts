import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';

const TOKEN_COOKIE = 'admin_token';

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? '';
}

/** Constant-time string comparison — prevents timing attacks. */
function safeCompare(a: string, b: string): boolean {
  // Hash both sides to normalize length before byte comparison.
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  return safeCompare(password, expected);
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const validToken = getAdminToken();
  if (!validToken) return false;
  return safeCompare(token, validToken);
}

export function requireAdminAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export { TOKEN_COOKIE };
