import { NextResponse } from 'next/server';

export function middleware(request) {
  // Simple middleware that just passes through requests
  // Remove complex tenant detection that was causing 500 errors
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match API routes and dynamic pages that need middleware
    '/api/:path*',
    '/dashboard/:path*',
  ],
};


