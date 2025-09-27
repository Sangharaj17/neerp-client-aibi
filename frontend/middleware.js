import { NextResponse } from 'next/server';

export function middleware(request) {
  // Minimal middleware - just pass through everything
  // Tenant detection will be handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Minimal matcher to avoid conflicts
    '/',
    '/login'
  ],
};


