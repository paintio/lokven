import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userStr = request.cookies.get('user')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !userStr) {
      return NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
    }

    try {
      const user = JSON.parse(userStr);

      if (user.type === 'usb' || user.role === 'admin') {
  return NextResponse.next();
}
    } catch {
      return NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};