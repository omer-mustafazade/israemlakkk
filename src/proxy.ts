import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

// ---------------------------------------------------------------------------
// Constant-time string comparison (Edge Runtime safe — no Node.js crypto)
// ---------------------------------------------------------------------------
function safeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  // Always iterate max length so timing doesn't reveal length difference.
  const len = Math.max(bufA.length, bufB.length);
  let diff = bufA.length === bufB.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return diff === 0;
}

// ---------------------------------------------------------------------------
// Rate limiter (in-memory, edge-safe)
// ---------------------------------------------------------------------------
const store = new Map<string, { count: number; resetAt: number }>();

/** Purge expired entries to prevent unbounded memory growth. */
function pruneStore() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();

  // Prune ~5% of the time to keep memory bounded without slowing every request.
  if (Math.random() < 0.05) pruneStore();

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

/**
 * Get the real client IP.
 * On Netlify, x-nf-client-connection-ip is set by the platform and cannot be
 * spoofed by the client — use it as the primary source.
 */
function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ||        // Netlify real IP (unspoofable)
    req.headers.get('x-real-ip') ||                        // Other reverse proxies
    req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() || // Last entry = proxy-added
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

    // Admin API auth check (timing-safe comparison)
    if (pathname.startsWith('/api/admin')) {
      const token = req.cookies.get('admin_token')?.value ?? '';
      const validToken = process.env.ADMIN_TOKEN ?? '';
      if (!safeCompare(token, validToken) || !validToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // --- Admin panel pages: auth check ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const token = req.cookies.get('admin_token')?.value ?? '';
    const validToken = process.env.ADMIN_TOKEN ?? '';
    if (!safeCompare(token, validToken) || !validToken) {
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
