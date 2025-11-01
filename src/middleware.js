import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check for auth token in cookies
  const token = request.cookies.get('auth_token')?.value;

  const { pathname } = request.nextUrl;

  // Allow access to login page and static assets
  if (pathname === '/') {
    // If already logged in, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
