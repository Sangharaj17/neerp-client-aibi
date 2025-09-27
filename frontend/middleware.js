import { NextResponse } from 'next/server';

// Public assets or internal Next routes that should not be rewritten
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Skip Next.js internals and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Determine tenant
  const hostHeader = request.headers.get('host') || '';
  const [hostName, hostPort] = hostHeader.split(':');
  const host = hostName; // name only

  // Allow overriding via query during local development: /path?tenant=abc
  const qpTenant = url.searchParams.get('tenant');

  // Prefer cookie if previously set (but we'll ignore on localhost)
  const cookieTenant = request.cookies.get('tenant')?.value;

  // For custom domains like abc.com, use the bare host (sans www)
  let derivedFromHost = host.replace(/^www\./i, '');

  // Detect localhost
  const isLocal = hostName.includes('localhost');
  if (isLocal) {
    // On localhost prefer full host with port as the tenant
    derivedFromHost = hostPort ? `${hostName}:${hostPort}` : hostName;
  }

  // On localhost, ignore cookie to avoid sharing across ports; always use host (with port) or query param
  let tenant = isLocal ? (qpTenant || derivedFromHost) : (qpTenant || cookieTenant || derivedFromHost);
  // Optional configurable default for local development only
  if (!tenant && isLocal && process.env.NEXT_PUBLIC_DEV_TENANT) {
    tenant = process.env.NEXT_PUBLIC_DEV_TENANT;
  }

  // If we still don't have a tenant, let the request pass through (will likely 404)
  if (!tenant) {
    return NextResponse.next();
  }

  // If the path already includes the tenant segment, redirect to stripped path
  if (pathname === `/${tenant}` || pathname.startsWith(`/${tenant}/`)) {
    const stripped = pathname.replace(`/${tenant}`, '') || '/';
    const redirectUrl = new URL(stripped + url.search, request.url);
    const response = NextResponse.redirect(redirectUrl);
    if (!isLocal && cookieTenant !== tenant) {
      response.cookies.set('tenant', tenant, { path: '/' });
    }
    return response;
  }

  // No more rewriting to /{tenant}/*; just proceed
  const response = NextResponse.next();
  if (!isLocal && cookieTenant !== tenant) {
    response.cookies.set('tenant', tenant, { path: '/' });
  }
  return response;
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and assets
    '/((?!_next|favicon.ico|public).*)',
  ],
};


