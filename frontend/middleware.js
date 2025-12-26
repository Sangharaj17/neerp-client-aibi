import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get tenant from various sources
  const host = request.headers.get('host') || '';
  const tenant = host.split(':')[0]; // e.g., "localhost" from "localhost:3009"

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/complaint-form',
    '/_next',
    '/api',
    '/favicon.ico',
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Root path should redirect to login if no token
  if (pathname === '/') {
    // Check for token in cookies
    const allCookies = request.cookies.getAll();
    const tokenCookie = allCookies.find(cookie =>
      cookie.name === 'token' || cookie.name.endsWith('_token')
    );

    if (!tokenCookie?.value) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // If logged in, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard/dashboard-data', request.url));
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes (dashboard, etc.), check authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/editor')) {
    // Check for token in cookies
    const allCookies = request.cookies.getAll();
    const tokenCookie = allCookies.find(cookie =>
      cookie.name === 'token' || cookie.name.endsWith('_token')
    );

    if (!tokenCookie?.value) {
      // No token found, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      // Store the intended destination for redirect after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, allow access
    // Note: Token validation should be done on API calls, not middleware
    // Middleware just checks for presence of token
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
