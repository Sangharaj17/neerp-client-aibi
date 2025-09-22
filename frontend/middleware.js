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
  matcher: ['/:tenant', '/:tenant/'],
};


