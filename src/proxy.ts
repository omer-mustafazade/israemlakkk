import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes: check auth (except login page)
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

  // Admin API routes: check auth
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/auth') {
      return NextResponse.next(); // login endpoint - no auth needed
    }
    const token = req.cookies.get('admin_token')?.value;
    const validToken = process.env.ADMIN_TOKEN ?? '';
    if (!token || !validToken || token !== validToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Other API routes: skip i18n
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // All other routes: i18n locale middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
