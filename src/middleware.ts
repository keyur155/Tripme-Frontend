import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const protectedPaths = ['/bookings', '/profile', '/account', '/wishlist', '/host'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtected) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/bookings/:path*', '/profile/:path*', '/account/:path*', '/wishlist/:path*', '/host/:path*']
};
