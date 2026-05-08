import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;
  
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("Middleware Error: JWT_SECRET is not defined");
    return NextResponse.next();
  }
  const secret = new TextEncoder().encode(jwtSecret);

  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/profile') || 
                           pathname.startsWith('/admin') || 
                           pathname.startsWith('/api/users');

  if (isProtectedRoute) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const { payload } = await jwtVerify(token, secret);

      // Admin check
      if (pathname.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*',
    '/profile/:path*',
    '/login', 
    '/signup',
    '/api/users/:path*' 
  ],
};