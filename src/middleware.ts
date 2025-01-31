import { NextResponse } from 'next/server';
import { auth } from '@/auth';
export default auth((request) => {
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
  ];
  const {pathname, origin} = request.nextUrl;
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (isProtectedPath && !request.auth) {
    return NextResponse.redirect(origin);
  }
  return NextResponse.next();
})

// Optional: Configure matcher for better performance
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|$|api/auth).*)',
  ],
};
