import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/libs/adminAuth';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin dashboard routes
  if (pathname === '/admin/dashboard' || pathname.startsWith('/admin/dashboard/')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const secret = process.env.ADMIN_AUTH_SECRET || '';
    if (!token || !secret) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    const valid = await verifyAdminToken({ token, secret });
    if (!valid.ok) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for API routes, admin login page, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname === '/admin' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if path already has language prefix
  const hasLanguagePrefix = pathname.startsWith('/ar') || pathname.startsWith('/en');
  
  // If no language prefix, default to English (no prefix needed)
  // Arabic routes will be handled by the /ar folder structure
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
