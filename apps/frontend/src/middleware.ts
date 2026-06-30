import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userStr = request.cookies.get('user')?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // нет авторизации вообще
  if (!token || !userStr) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const user = JSON.parse(userStr);

    // ВАЖНО: если админ ИЛИ usb-админ
    const isAdmin =
      user.role === 'admin' ||
      user.role === 'moderator' ||
      user.type === 'usb';

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};