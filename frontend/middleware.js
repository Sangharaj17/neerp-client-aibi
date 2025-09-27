import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Skip Next.js internals and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Get tenant from host header
  const hostHeader = request.headers.get('host') || '';
  const [hostName] = hostHeader.split(':');
  const tenant = hostName.replace(/^www\./i, '');

  // For production domains like scrolljourney.com, set tenant cookie
  if (tenant && !tenant.includes('localhost')) {
    const response = NextResponse.next();
    response.cookies.set('tenant', tenant, { path: '/' });
    return response;
  }

  // For localhost, use full host with port
  if (hostName.includes('localhost')) {
    const port = hostHeader.split(':')[1];
    const localhostTenant = port ? `localhost:${port}` : 'localhost';
    const response = NextResponse.next();
    response.cookies.set('tenant', localhostTenant, { path: '/' });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and assets
    '/((?!_next|favicon.ico|public).*)',
  ],
};


