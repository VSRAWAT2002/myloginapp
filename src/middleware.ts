import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/users')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
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