import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the current URL path
  const currentPath = request.nextUrl.pathname;

  // Store the path in a response header (or cookies) to pass it to SSR components
  const response = NextResponse.next();
  response.headers.set('x-current-path', currentPath);

  return response;
}

// Define the matcher to specify the routes where the middleware should be applied
export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Apply middleware to all pages except for static files
};
