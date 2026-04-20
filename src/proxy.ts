import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

// ---------------------------------------------------------------------------
// Rate limiter (in-memory, edge-safe)
// ---------------------------------------------------------------------------
const store = new Map<string, { count: number; resetAt: number }>();

function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(retryAfter),
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIp(req);
  const MIN_15 = 15 * 60 * 1000;

  // --- Login endpoint: 5 attempts per 15 min ---
  if (pathname === '/api/admin/auth' && req.method === 'POST') {
    const { allowed, retryAfter } = rateLimit(`login:${ip}`, 5, MIN_15);
    if (!allowed) return tooManyRequests(retryAfter);
    return NextResponse.next();
  }

  // --- Contact form: 10 submissions per 15 min ---
  if (pathname === '/api/contact' && req.method === 'POST') {
    const { allowed, retryAfter } = rateLimit(`contact:${ip}`, 10, MIN_15);
    if (!allowed) return tooManyRequests(retryAfter);
    return NextResponse.next();
  }

  // --- All other API routes: 120 requests per 15 min (DDoS protection) ---
  if (pathname.startsWith('/api/')) {
    const { allowed, retryAfter } = rateLimit(`api:${ip}`, 120, MIN_15);
    if (!allowed) return tooManyRequests(retryAfter);
    // Admin API auth check
    if (pathname.startsWith('/api/admin')) {
      const token = req.cookies.get('admin_token')?.value;
      const validToken = process.env.ADMIN_TOKEN ?? '';
      if (!token || !validToken || token !== validToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // --- Admin panel pages: auth check ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const token = req.cookies.get('admin_token')?.value;
    const validToken = process.env.ADMIN_TOKEN ?? '';
    if (!token || token !== validToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // --- All other routes: i18n ---
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
