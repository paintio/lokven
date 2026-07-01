import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function safeParseUser(value: string | undefined) {
  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userCookie = req.cookies.get('user')?.value;

  const user = safeParseUser(userCookie);

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!token || !user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/'));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};