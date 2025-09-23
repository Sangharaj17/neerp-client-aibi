import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 1) {
    const tenant = pathSegments[0];
    const url = request.nextUrl.clone();
    url.pathname = `/${tenant}/login`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except API, Next.js assets, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


